import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {extname, join, normalize} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=join(fileURLToPath(new URL('.',import.meta.url)),'public');
const port=Number(process.env.PORT||3000);
const offlineMedia=process.env.IA_OFFLINE==='1';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon'};
const mediaCache=new Map();
const galleryCache=new Map();
const emblemCache=new Map();
const sourcePreviewCache=new Map();
const dynamicMediaHosts=new Set();
const proxyAllowHosts=['static.wikia.nocookie.net','warhammer40k.fandom.com','wh40k.lexicanum.com','wh40k.lexicanumcdn.com'];
const badMediaName=s=>/(placeholder|default-avatar|portrait_placeholder|noimage|article-placeholder|wikia-visualization-main|question|disambig|stub)/i.test(String(s||''));
const sites={
  lexicanum:{api:'https://wh40k.lexicanum.com/mediawiki/api.php',page:'https://wh40k.lexicanum.com/wiki/',name:'Lexicanum'},
  fandom:{api:'https://warhammer40k.fandom.com/api.php',page:'https://warhammer40k.fandom.com/wiki/',name:'Warhammer 40k Wiki / Fandom'}
};
const netOpts=(headers={},ms=6500)=>({headers,signal:AbortSignal.timeout(ms)});
async function wikiImage(site,title){
  const cfg=sites[site];if(!cfg||!title)return null;const key=`${site}:${title.toLowerCase()}`;if(mediaCache.has(key))return mediaCache.get(key);
  const qs=new URLSearchParams({action:'query',format:'json',prop:'pageimages',piprop:'original|thumbnail',pithumbsize:'1500',redirects:'1',titles:title});
  try{
    const headers={'user-agent':'ImperiumArchiveFanProject/4.0'};
    const r=await fetch(`${cfg.api}?${qs}`,netOpts(headers));
    let canonical=title,src=null;
    if(r.ok){const j=await r.json();const page=Object.values(j?.query?.pages||{})[0];canonical=page?.title||title;src=page?.original?.source||page?.thumbnail?.source||null;}
    const source=`${cfg.page}${encodeURIComponent(canonical.replaceAll(' ','_')).replaceAll('%2F','/')}`;
    if(!src){const pageRes=await fetch(source,netOpts(headers));if(pageRes.ok){const html=await pageRes.text();const m=html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)||html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);if(m)src=m[1].replaceAll('&amp;','&');}}
    if(src&&badMediaName(src))src=null;const out=src?{src,source,sourceName:cfg.name,title:canonical}:null;mediaCache.set(key,out);return out;
  }catch{mediaCache.set(key,null);return null}
}

async function wikiGallery(site,title,kind='generic'){
  const cfg=sites[site];if(!cfg||!title)return [];const key=`gallery:${site}:${kind}:${title.toLowerCase()}`;if(galleryCache.has(key))return galleryCache.get(key);
  try{
    const headers={'user-agent':'ImperiumArchiveFanProject/5.0'};
    const qs=new URLSearchParams({action:'query',format:'json',generator:'images',titles:title,gimlimit:'18',prop:'imageinfo',iiprop:'url',iiurlwidth:'1400',redirects:'1'});
    const r=await fetch(`${cfg.api}?${qs}`,netOpts(headers));if(!r.ok)throw 0;const j=await r.json();
    const pages=Object.values(j?.query?.pages||{});
    const banned=/(logo|icon|symbol|badge|portal|button|arrow|flag_of|question|disambig|stub|mapicon|interface|ui[_ -]|avatar)/i;
    const words=title.toLowerCase().replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(x=>x.length>3);
    const scoreFile=file=>{const f=file.toLowerCase();let score=0;for(const w of words)if(f.includes(w))score+=4;if(words.length&&words.every(w=>f.includes(w)))score+=7;if(/artwork|illustration|portrait|battle|scene|codex|cover|heresy|marine|warrior/i.test(f))score+=3;if(/miniature|model|joytoy|figure|painted|sprue|box|card|token|dice/i.test(f))score-=8;if(kind==='character'&&/portrait|artwork|primarch|lord|captain|commander/i.test(f))score+=5;if(kind==='faction'&&/army|battle|warrior|marine|legion|host|fleet/i.test(f))score+=4;if(kind==='chapter'&&/marine|battle|artwork|chapter/i.test(f))score+=4;if(kind==='location'&&/map|world|planet|city|system|sector/i.test(f))score+=3;return score};
    const out=pages.map(pg=>{const ii=pg?.imageinfo?.[0];const file=String(pg?.title||'');if(!ii||!file||banned.test(file))return null;const src=ii.thumburl||ii.url;if(!src||badMediaName(file)||badMediaName(src)||!/\.(?:jpe?g|png|webp)(?:$|\?)/i.test(src))return null;const source=(site==='fandom'?`https://warhammer40k.fandom.com/wiki/${encodeURIComponent(title.replaceAll(' ','_'))}`:`https://wh40k.lexicanum.com/wiki/${encodeURIComponent(file.replaceAll(' ','_')).replaceAll('%3A',':')}`);return{src,source,sourceName:cfg.name,fileTitle:file.replace(/^File:/i,''),title,score:scoreFile(file)};}).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,10);
    galleryCache.set(key,out);return out;
  }catch{galleryCache.set(key,[]);return []}
}

async function wikiEmblem(site,title){
  const cfg=sites[site];if(!cfg||!title)return null;const key=`emblem:${site}:${title.toLowerCase()}`;if(emblemCache.has(key))return emblemCache.get(key);
  try{
    const headers={'user-agent':'ImperiumArchiveFanProject/8.0'};
    const qs=new URLSearchParams({action:'query',format:'json',generator:'images',titles:title,gimlimit:'40',prop:'imageinfo',iiprop:'url',iiurlwidth:'600',redirects:'1'});
    const r=await fetch(`${cfg.api}?${qs}`,netOpts(headers));if(!r.ok)throw 0;const j=await r.json();const pages=Object.values(j?.query?.pages||{});
    const scoreFile=file=>{let score=0,f=file.toLowerCase();if(/(chapter badge|badge|insignia|symbol|chapter symbol|heraldry|logo|icon|mark|device|emblem)/i.test(f))score+=12;if(/(shoulder|pauldron)/i.test(f))score+=6;if(/(map|cover|novel|miniature|artwork|battle|marine|model|portrait|screenshot|card)/i.test(f))score-=8;if(/svg|png/i.test(f))score+=2;return score};
    const ranked=pages.map(pg=>{const ii=pg?.imageinfo?.[0],file=String(pg?.title||'');const src=ii?.thumburl||ii?.url;if(!src||badMediaName(file)||badMediaName(src))return null;return{src,file,score:scoreFile(file)}}).filter(Boolean).sort((a,b)=>b.score-a.score);
    const best=ranked.find(x=>x.score>2)||null;if(!best){emblemCache.set(key,null);return null}
    const source=`${cfg.page}${encodeURIComponent(title.replaceAll(' ','_')).replaceAll('%2F','/')}`;
    const out={src:best.src,source,sourceName:cfg.name,fileTitle:best.file.replace(/^File:/i,'')};emblemCache.set(key,out);return out;
  }catch{emblemCache.set(key,null);return null}
}

async function sourcePreview(rawUrl){
  try{
    const u=new URL(rawUrl);
    if(!['https:','http:'].includes(u.protocol))return null;
    const h=u.hostname.toLowerCase();
    if(h==='localhost'||h==='127.0.0.1'||h==='::1'||/^10\.|^192\.168\.|^169\.254\.|^172\.(1[6-9]|2\d|3[01])\./.test(h))return null;
    const key=u.toString();if(sourcePreviewCache.has(key))return sourcePreviewCache.get(key);
    const r=await fetch(u,netOpts({'user-agent':'ImperiumArchiveFanProject/12.0','accept':'text/html,application/xhtml+xml'},7000));
    if(!r.ok){sourcePreviewCache.set(key,null);return null}
    const type=r.headers.get('content-type')||'';if(!type.includes('text/html')){sourcePreviewCache.set(key,null);return null}
    const html=(await r.text()).slice(0,2_000_000);
    const meta=(name)=>{const a=html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["'][^>]+content=["']([^"']+)`,`i`))||html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["']`,`i`));return a?.[1]?.replaceAll('&amp;','&')||''};
    let img=meta('og:image')||meta('twitter:image')||meta('twitter:image:src');
    let title=meta('og:title')||meta('twitter:title');
    if(!title){const m=html.match(/<title[^>]*>([^<]+)<\/title>/i);title=m?.[1]?.trim()||u.hostname}
    if(img){try{img=new URL(img,u).toString()}catch{img=''}}
    if(img&&badMediaName(img))img='';
    if(img){try{dynamicMediaHosts.add(new URL(img).hostname)}catch{}}
    const out=img?{src:img,source:u.toString(),sourceName:u.hostname.replace(/^www\./,''),title}:null;
    sourcePreviewCache.set(key,out);return out;
  }catch{return null}
}

async function proxyImage(url){
  try{
    const u=new URL(url);if(!['https:','http:'].includes(u.protocol)||(!proxyAllowHosts.some(h=>u.hostname===h||u.hostname.endsWith('.'+h))&&!dynamicMediaHosts.has(u.hostname)))return null;
    const r=await fetch(u,netOpts({'user-agent':'ImperiumArchiveFanProject/10.0','accept':'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'},8500));if(!r.ok)return null;
    const type=r.headers.get('content-type')||'';if(!type.startsWith('image/'))return null;
    const len=Number(r.headers.get('content-length')||0);if(len>12*1024*1024)return null;
    const buf=Buffer.from(await r.arrayBuffer());if(buf.length>12*1024*1024)return null;
    return{buf,type};
  }catch{return null}
}

async function youtubeOEmbed(rawUrl){
  try{
    const u=new URL(rawUrl);
    const host=u.hostname.toLowerCase().replace(/^www\./,'');
    if(!['youtube.com','m.youtube.com','youtu.be'].includes(host))return null;
    const endpoint='https://www.youtube.com/oembed?format=json&url='+encodeURIComponent(u.toString());
    const r=await fetch(endpoint,netOpts({'user-agent':'ImperiumArchiveFanProject/13.0','accept':'application/json'},7000));
    if(!r.ok)return null;
    const j=await r.json();
    return{
      title:String(j.title||'').slice(0,300),
      authorName:String(j.author_name||'').slice(0,160),
      authorUrl:String(j.author_url||'').slice(0,1000),
      thumbnailUrl:String(j.thumbnail_url||'').slice(0,2000),
      width:Number(j.width||0)||null,
      height:Number(j.height||0)||null,
      source:u.toString()
    };
  }catch{return null}
}

function send(res,status,body,type='text/plain; charset=utf-8',headers={}){res.writeHead(status,{'content-type':type,...headers});res.end(body)}
createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');

    if(offlineMedia && url.pathname.startsWith('/api/'))return send(res,503,JSON.stringify({error:'runtime media disabled'}),'application/json');
    if(url.pathname==='/api/youtube-oembed'){
      const target=String(url.searchParams.get('url')||'').slice(0,3000);
      if(!target)return send(res,400,JSON.stringify({error:'url required'}),'application/json');
      const result=await youtubeOEmbed(target);
      if(!result)return send(res,404,JSON.stringify({error:'youtube metadata unavailable'}),'application/json');
      return send(res,200,JSON.stringify(result),'application/json',{'cache-control':'public, max-age=21600'});
    }
    if(url.pathname==='/api/source-preview'){
      const target=String(url.searchParams.get('url')||'').slice(0,5000);if(!target)return send(res,400,JSON.stringify({error:'url required'}),'application/json');
      const result=await sourcePreview(target);if(!result)return send(res,404,JSON.stringify({error:'preview unavailable'}),'application/json');
      return send(res,200,JSON.stringify(result),'application/json',{'cache-control':'public, max-age=21600'});
    }
    if(url.pathname==='/api/media-proxy'){
      const target=String(url.searchParams.get('url')||'').slice(0,4000);if(!target)return send(res,400,'Missing url');
      const result=await proxyImage(target);if(!result)return send(res,404,'Image unavailable');
      return send(res,200,result.buf,result.type,{'cache-control':'public, max-age=604800','cross-origin-resource-policy':'cross-origin'});
    }
    if(url.pathname==='/api/wiki-emblem'){
      const title=String(url.searchParams.get('title')||'').slice(0,180).trim();if(!title)return send(res,400,JSON.stringify({error:'title required'}),'application/json');
      const preferred=url.searchParams.get('site')==='fandom'?'fandom':'lexicanum';let result=await wikiEmblem(preferred,title);if(!result)result=await wikiEmblem(preferred==='fandom'?'lexicanum':'fandom',title);if(!result)return send(res,404,JSON.stringify({error:'emblem not found'}),'application/json');
      return send(res,200,JSON.stringify(result),'application/json',{'cache-control':'public, max-age=86400'});
    }
    if(url.pathname==='/api/wiki-gallery'){
      const title=String(url.searchParams.get('title')||'').slice(0,180).trim();if(!title)return send(res,400,JSON.stringify({error:'title required'}),'application/json');
      const preferred=url.searchParams.get('site')==='fandom'?'fandom':'lexicanum';const kind=String(url.searchParams.get('kind')||'generic').slice(0,30);let result=await wikiGallery(preferred,title,kind);if(!result.length&&preferred!=='lexicanum')result=await wikiGallery('lexicanum',title,kind);
      return send(res,200,JSON.stringify({items:result}),'application/json',{'cache-control':'public, max-age=86400'});
    }
    if(url.pathname==='/api/wiki-image'){
      const title=String(url.searchParams.get('title')||'').slice(0,180).trim();if(!title)return send(res,400,JSON.stringify({error:'title required'}),'application/json');
      const preferred=url.searchParams.get('site')==='fandom'?'fandom':'lexicanum';let result=await wikiImage(preferred,title);if(!result)result=await wikiImage(preferred==='fandom'?'lexicanum':'fandom',title);if(!result)return send(res,404,JSON.stringify({error:'image not found'}),'application/json');
      return send(res,200,JSON.stringify(result),'application/json',{'cache-control':'public, max-age=86400'});
    }
    let rel=decodeURIComponent(url.pathname);if(rel==='/'||rel==='')rel='/index.html';
    const safe=normalize(rel).replace(/^([.][.][/\\])+/, '').replace(/^[/\\]+/,'');
    const path=join(root,safe);if(!path.startsWith(root))return send(res,403,'Forbidden');
    const info=await stat(path).catch(()=>null);if(!info||!info.isFile())return send(res,404,'Not found');
    const body=await readFile(path);send(res,200,body,types[extname(path).toLowerCase()]||'application/octet-stream',{'cache-control':extname(path)==='.html'?'no-cache':'public, max-age=3600'});
  }catch(e){send(res,500,'Internal server error')}
}).listen(port,()=>console.log(`Imperium Archive v14: http://localhost:${port}`));
