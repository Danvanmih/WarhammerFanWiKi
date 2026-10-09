(()=>{
  const L=window.LORE;
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const proxy=u=>/^https?:/i.test(String(u||''))?'/api/media-proxy?url='+encodeURIComponent(u):u;
  const mediaCache=new Map(), emblemCache=new Map();
  const wikiTitle=o=>o?.wikiTitle||o?.en||o?.name||'';
  const siteFor=o=>o?.mediaSite||'fandom';
  const record=(t,id)=>window.getRecord?.(t,id) || ({character:L.characters,legion:L.legions,chapter:L.chapters,faction:L.factions,location:L.locations,event:L.events,organization:L.organizations,arsenal:L.arsenal}[t]||[]).find(x=>x.id===id);

  async function apiJson(url){try{const r=await fetch(url);if(!r.ok)return null;return await r.json()}catch{return null}}
  async function bestMedia(o){
    if(!o)return null;const site=siteFor(o),title=wikiTitle(o),key=`${site}:${title}`;if(mediaCache.has(key))return mediaCache.get(key);
    const g=await apiJson('/api/wiki-gallery?site='+encodeURIComponent(site)+'&title='+encodeURIComponent(title));
    let item=g?.items?.find(x=>x?.src);
    if(!item){const m=await apiJson('/api/wiki-image?site='+encodeURIComponent(site)+'&title='+encodeURIComponent(title));if(m?.src)item=m}
    if(!item && site!=='lexicanum'){const m=await apiJson('/api/wiki-image?site=lexicanum&title='+encodeURIComponent(title));if(m?.src)item=m}
    mediaCache.set(key,item||null);return item||null;
  }
  async function bestEmblem(o){
    if(!o)return null;const site=siteFor(o),title=wikiTitle(o),key=`${site}:${title}`;if(emblemCache.has(key))return emblemCache.get(key);
    const j=await apiJson('/api/wiki-emblem?site='+encodeURIComponent(site)+'&title='+encodeURIComponent(title));
    emblemCache.set(key,j?.src?j:null);return j?.src?j:null;
  }

  function setCardArt(card,type,o,item){
    const art=q('.card-art',card);if(!art||!item?.src)return;
    const local=window.assetFor?.(type,o)||'/assets/imperium-city.jpg';
    art.style.backgroundImage=`linear-gradient(180deg,rgba(5,6,7,.02),#0c0d0e 96%),url("${proxy(item.src)}"),url("${local}")`;
    art.style.backgroundSize='cover,cover,cover';
    art.style.backgroundPosition='center,center,center';
    art.dataset.realMedia='1';
    let badge=q('.real-media-badge',card);if(!badge){badge=document.createElement('span');badge.className='real-media-badge';card.appendChild(badge)}
    badge.textContent=(item.sourceName||'WIKI').toUpperCase().includes('FANDOM')?'FANDOM · MEDIA':'LEXICANUM · MEDIA';
    if(item.source) badge.title='Источник изображения: '+item.source;
  }
  async function hydrateCard(card){
    if(card.dataset.v8media==='1')return;card.dataset.v8media='1';
    const type=card.dataset.detail,id=card.dataset.id,o=record(type,id);if(!o)return;
    if(type==='faction'){const h=q('.sigil',card);if(h&&!h.dataset.v8neutral){h.dataset.v8neutral='1';h.innerHTML='<b class="neutral-heraldry">✦</b>';}}
    if(type==='chapter'){const h=q('.chapter-crest',card);if(h&&!h.dataset.v8neutral){h.dataset.v8neutral='1';const initials=(o.en||o.name||'CH').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();h.innerHTML=`<b class="neutral-heraldry">${esc(initials)}</b>`;}}
    const m=await bestMedia(o);if(m)setCardArt(card,type,o,m);
    if(['chapter','faction'].includes(type)){
      const e=await bestEmblem(o);if(e){
        const host=type==='chapter'?q('.chapter-crest',card):q('.sigil',card);
        if(host){host.innerHTML=`<img class="real-emblem" src="${proxy(e.src)}" alt="${esc(o.name)} — эмблема">`;host.classList.add('real-emblem-host');}
      }
    }
  }
  const mediaObserver='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;mediaObserver.unobserve(e.target);hydrateCard(e.target)}),{rootMargin:'450px 0px'}):null;
  function observeCards(){qa('.illustrated[data-detail][data-id]').forEach(c=>{if(c.dataset.v8observed)return;c.dataset.v8observed='1';mediaObserver?mediaObserver.observe(c):hydrateCard(c)})}

  function proxyExternalImgs(root=document){
    qa('img',root).forEach(img=>{const src=img.getAttribute('src')||'';if(/^https?:/i.test(src)&&!img.dataset.proxied){img.dataset.proxied='1';img.src=proxy(src)}});
  }

  // DETAIL: media references + books/games + real heraldry ///////////////////////////////////
  const oldDetail=window.renderDetail;
  window.renderDetail=function(type,o){
    const r=oldDetail(type,o);const page=q('#detailPage');if(!page)return r;
    proxyExternalImgs(page);
    const guide=window.MEDIA_GUIDE?.[`${type}:${o.id}`];
    const ex=window.EXPANDED_LORE?.[type]?.[o.id];
    const books=[...(guide?.books||[]),...(ex?.reading||[])].filter((x,i,a)=>x&&a.indexOf(x)===i).slice(0,10);
    const games=(guide?.games||[]).slice(0,8), quotes=(guide?.quotes||[]).slice(0,5);
    const main=q('.detail-main',page);
    if(main && (books.length||games.length||quotes.length)){
      const old=q('.v8-media-guide',main);old?.remove();
      const cards=[];
      if(books.length)cards.push(`<article><span>BLACK LIBRARY / READING</span><h3>Книги и серии</h3><ol>${books.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><a href="https://www.blacklibrary.com/" target="_blank" rel="noreferrer">Black Library ↗</a></article>`);
      if(games.length)cards.push(`<article><span>GAMES / ADAPTATIONS</span><h3>Игры и адаптации</h3><ol>${games.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><p>Игры используются как дополнительная точка входа в атмосферу; конкретные сюжетные детали лучше проверять по профилю игры и лорным источникам.</p></article>`);
      if(quotes.length)cards.push(`<article><span>SHORT PHRASES</span><h3>Девизы и короткие формулы</h3><div class="v8-quotes">${quotes.map(x=>`<blockquote>${esc(x)}</blockquote>`).join('')}</div><p>Короткие фразы используются как атмосферные маркеры, а не как большие цитаты из книг.</p></article>`);
      const html=`<section class="detail-block v8-media-guide"><div class="block-head"><div><p class="eyebrow">MEDIA / READING MATRIX</p><h2>Что читать, во что играть и куда идти дальше</h2></div><small>Книги, игры и связанные материалы собраны вокруг конкретной записи.</small></div><div class="v8-media-grid">${cards.join('')}</div></section>`;
      const gallery=q('.gallery-block',main);(gallery||main.lastElementChild)?.insertAdjacentHTML('beforebegin',html);
    }
    // Replace synthetic faction/chapter symbols with externally sourced heraldry when available.
    if(type==='chapter'||type==='faction'){
      const host=type==='chapter'?q('.chapter-heraldry',page):q('.dossier-seal',page);if(host){const initials=(o.en||o.name||'WH').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();host.innerHTML=`<b class="neutral-heraldry detail-neutral">${esc(initials)}</b>`;}
      bestEmblem(o).then(e=>{if(!e)return;const host2=type==='chapter'?q('.chapter-heraldry',page):q('.dossier-seal',page);if(host2){host2.innerHTML=`<img class="detail-real-emblem" src="${proxy(e.src)}" alt="${esc(o.name)} — эмблема">`;host2.title='Эмблема из внешнего wiki-источника';}});
    }
    // Exact media for lineage nodes: Primarch -> Legion -> Chapter -> heroes.
    qa('.lineage-flow button[data-detail][data-id]',page).forEach(btn=>{
      const t=btn.dataset.detail,id=btn.dataset.id,rr=record(t,id),thumb=q('i',btn);if(!rr||!thumb)return;
      bestMedia(rr).then(m=>{if(m)thumb.style.backgroundImage=`url("${proxy(m.src)}"),url("${window.assetFor?.(t,rr)||'/assets/imperium-city.jpg'}")`});
    });
    return r;
  };

  // MAP ///////////////////////////////////////////////////////////////////////////////////////
  const routes=[
    {id:'horus',name:'Хорус: путь к Терре',era:'30k',side:'traitor',nodes:['isstvan-iii','isstvan-v','molech','terra']},
    {id:'russ',name:'Русс и Просперо',era:'30k',side:'loyal',nodes:['fenris','prospero','terra']},
    {id:'guilliman30',name:'Жиллиман / Ультрамар',era:'30k',side:'loyal',nodes:['calth-world','macragge','sotha','terra']},
    {id:'lion30',name:'Лион / Разлом Ереси',era:'30k',side:'loyal',nodes:['caliban','macragge','terra']},
    {id:'indomitus',name:'Индомитус — стратегическая линия',era:'40k',side:'imperium',nodes:['terra','cadia','vigilus','ultramar','macragge']},
    {id:'behemoth',name:'Флот-улей Бегемот',era:'40k',side:'xenos',nodes:['behemoth-route','macragge']},
    {id:'kraken',name:'Флот-улей Кракен',era:'40k',side:'xenos',nodes:['kraken-route','iyanden']},
    {id:'leviathan',name:'Флот-улей Левиафан',era:'40k',side:'xenos',nodes:['leviathan-route','baal']}
  ];
  function routePath(nodes){
    const pts=nodes.map(id=>L.locations.find(x=>x.id===id)).filter(Boolean).map(p=>({x:+p.x*12,y:+p.y*7.8}));if(pts.length<2)return'';
    let d=`M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],dx=b.x-a.x,dy=b.y-a.y,bend=(i%2?1:-1)*Math.min(38,Math.hypot(dx,dy)*.12);d+=` C ${(a.x+dx*.35).toFixed(1)} ${(a.y+dy*.18+bend).toFixed(1)} ${(a.x+dx*.68).toFixed(1)} ${(a.y+dy*.82-bend).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;}
    return d;
  }
  function buildRoutes(){
    const svg=q('#routeLayer');if(!svg)return;
    svg.innerHTML=routes.map(r=>`<path class="route-v8 ${r.side}" data-route-id="${r.id}" data-era="${r.era}" d="${routePath(r.nodes)}"/>`).join('');
    svg.classList.add('v8-route-layer','visible');
    const shell=q('.galaxy-shell');if(shell&&!q('.map-route-panel',shell)){
      shell.insertAdjacentHTML('beforeend',`<div class="map-route-panel"><div><b>МАРШРУТЫ / CAMPAIGN LINES</b><small>Схематические линии для навигации, не точные траектории перелётов.</small></div>${routes.map(r=>`<label><input type="checkbox" data-v8-route="${r.id}" checked><i class="${r.side}"></i><span>${esc(r.name)}</span></label>`).join('')}<button id="mapRoutesAll">Скрыть все</button></div>`);
      qa('[data-v8-route]',shell).forEach(c=>c.addEventListener('change',()=>{q(`[data-route-id="${c.dataset.v8Route}"]`,svg)?.classList.toggle('hidden',!c.checked)}));
      q('#mapRoutesAll',shell)?.addEventListener('click',e=>{const boxes=qa('[data-v8-route]',shell),any=boxes.some(x=>x.checked);boxes.forEach(x=>{x.checked=!any;x.dispatchEvent(new Event('change'))});e.currentTarget.textContent=any?'Показать все':'Скрыть все'});
    }
  }
  function updateRouteEra(){const stage=q('#galaxyStage');const era=stage?.classList.contains('era-30k')?'30k':'40k';qa('.route-v8').forEach(p=>p.classList.toggle('era-muted',p.dataset.era!==era));}
  const stage=q('#galaxyStage');
  if(stage){
    const scaleObs=new MutationObserver(()=>{const m=(stage.style.transform||'').match(/scale\(([-\d.]+)\)/);const s=m?+m[1]:1;stage.classList.toggle('map-overview',s<.98);stage.classList.toggle('map-detail',s>=1.18);updateRouteEra()});
    scaleObs.observe(stage,{attributes:true,attributeFilter:['style','class']});
  }
  buildRoutes();updateRouteEra();
  qa('[data-map-era]').forEach(b=>b.addEventListener('click',()=>setTimeout(updateRouteEra,0)));

  // Add a second, clearer source/usage note to the map.
  const ref=q('.map-reference');if(ref&&!q('.v8-map-credit',ref)){
    ref.insertAdjacentHTML('beforeend','<div class="v8-map-credit"><b>DATA NOTE</b><span>Jambonium используется как внешний картографический референс для структуры слоёв и относительных положений. Маркеры Imperium Archive собраны как собственная схема и ведут в статьи архива.</span></div>');
  }

  // Exact media on map selected-card preview.
  const oldSelect=window.selectMapRecord;
  window.selectMapRecord=function(id){const r=oldSelect(id);const o=record('location',id),side=q('#mapSide');if(o&&side){bestMedia(o).then(m=>{const img=q('.map-preview',side);if(m&&img){img.src=proxy(m.src);img.alt=o.name+' — изображение из wiki-источника';}});}return r};

  // Observers //////////////////////////////////////////////////////////////////////////////////
  const rootObs=new MutationObserver(()=>{observeCards();proxyExternalImgs();});
  window.addEventListener('load',()=>{observeCards();proxyExternalImgs();rootObs.observe(document.body,{childList:true,subtree:true});buildRoutes();});
})();
