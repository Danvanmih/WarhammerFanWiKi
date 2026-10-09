(()=>{
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const L=window.LORE, matrix=window.V9_MATRIX||{};
  const proxy=u=>/^https?:/i.test(String(u||''))?'/api/media-proxy?url='+encodeURIComponent(u):u;
  const rec=(t,id)=>window.getRecord?.(t,id)||({character:L.characters,legion:L.legions,chapter:L.chapters,faction:L.factions,location:L.locations,event:L.events,organization:L.organizations,arsenal:L.arsenal}[t]||[]).find(x=>x.id===id);
  const wikiTitle=o=>o?.wikiTitle||o?.en||o?.name||'';
  async function j(url){try{const r=await fetch(url);return r.ok?await r.json():null}catch{return null}}
  async function pageImage(o,site='fandom'){
    const title=wikiTitle(o);if(!title)return null;
    let x=await j(`/api/wiki-image?site=${encodeURIComponent(site)}&title=${encodeURIComponent(title)}`);
    if(!x?.src&&site!=='lexicanum')x=await j(`/api/wiki-image?site=lexicanum&title=${encodeURIComponent(title)}`);
    return x?.src?x:null;
  }
  async function mergedGallery(o){
    const title=wikiTitle(o);if(!title)return[];
    const [f,l]=await Promise.all([j(`/api/wiki-gallery?site=fandom&title=${encodeURIComponent(title)}`),j(`/api/wiki-gallery?site=lexicanum&title=${encodeURIComponent(title)}`)]);
    const seen=new Set();return [...(f?.items||[]),...(l?.items||[])].filter(x=>x?.src&&!seen.has(x.src)&&(seen.add(x.src),true)).slice(0,8);
  }
  const genericLocal=['/assets/imperium-city.jpg','/assets/primarchs.jpg','/assets/galaxy-atlas.webp','/assets/galaxy-map.jpg','/assets/factions.jpg'];

  function relationName(t,id){return rec(t,id)?.name||id}
  function matrixHtml(type,o){
    const m=matrix[`${type}:${o.id}`];if(!m)return'';
    const items=[['Доктрина',m.doctrine,'⚔'],['Культура',m.culture,'✦'],['Перелом',m.fracture,'⌛'],['Наследие',m.legacy,'◆']].filter(x=>x[1]);
    if(!items.length)return'';
    return `<section class="detail-block v9-matrix"><div class="block-head"><div><p class="eyebrow">LORE MATRIX</p><h2>Доктрина, культура и наследие</h2></div><small>Сжатая схема — ниже остаётся подробный текст и связанные статьи.</small></div><div class="v9-matrix-grid">${items.map(([h,t,i])=>`<article><i>${i}</i><span>${esc(h)}</span><p>${esc(t)}</p></article>`).join('')}</div></section>`;
  }
  function chronicleHtml(type,o){
    const evs=window.eventRelations?.(type,o)||[];if(!evs.length)return'';
    return `<section class="detail-block v9-chronicle"><div class="block-head"><div><p class="eyebrow">CHRONICLE PATH</p><h2>События, через которые лучше читать запись</h2></div><small>Нажми на событие, чтобы перейти в его собственное досье.</small></div><div class="v9-chronicle-rail">${evs.slice(0,8).map((e,i)=>`<button data-detail="event" data-id="${e.id}"><em>${String(i+1).padStart(2,'0')}</em><span><small>${esc(e.date||'')}</small><b>${esc(e.name)}</b><p>${esc(e.summary||'')}</p></span></button>`).join('')}</div></section>`;
  }
  function pathHtml(type,o){
    let groups=[];
    if(type==='character'&&o.legion){const leg=rec('legion',o.legion);const ch=L.chapters.filter(c=>c.parentLegion===o.legion).slice(0,8);groups=[['Легион и наследники',[[leg&&'legion',leg?.id,leg?.name],...ch.map(c=>['chapter',c.id,c.name])].filter(x=>x[0])]];}
    if(type==='legion'){const chars=L.characters.filter(c=>c.legion===o.id).slice(0,8),ch=L.chapters.filter(c=>c.parentLegion===o.id).slice(0,10);groups=[['Персонажи линии',chars.map(c=>['character',c.id,c.name])],['Ордена-наследники',ch.map(c=>['chapter',c.id,c.name])]];}
    if(type==='chapter'){const chars=L.characters.filter(c=>c.chapter===o.id).slice(0,8),leg=o.parentLegion&&rec('legion',o.parentLegion);groups=[['Происхождение',[[leg&&'legion',leg?.id,leg?.name]].filter(x=>x[0])],['Герои ордена',chars.map(c=>['character',c.id,c.name])]];}
    if(!groups.some(g=>g[1].length))return'';
    return `<section class="detail-block v9-path-index"><p class="eyebrow">KNOWLEDGE PATH</p><h2>Куда идти дальше</h2><div class="v9-path-grid">${groups.filter(g=>g[1].length).map(([h,a])=>`<article><h3>${esc(h)}</h3>${a.map(([t,id,n])=>`<button data-detail="${t}" data-id="${id}"><span>${esc(n)}</span><b>→</b></button>`).join('')}</article>`).join('')}</div></section>`;
  }

  async function enrichHero(type,o,page){
    const hero=q('.detail-cinematic',page);if(!hero)return;
    const img=await pageImage(o,o.mediaSite||'fandom');if(!img?.src)return;
    hero.style.setProperty('--hero',`url("${proxy(img.src)}")`);hero.dataset.mediaSource=img.source||'';
    let badge=q('.v9-hero-source',hero);if(!badge){badge=document.createElement('a');badge.className='v9-hero-source';badge.target='_blank';badge.rel='noreferrer';hero.appendChild(badge)}
    badge.href=img.source||'#';badge.textContent=`ИЗОБРАЖЕНИЕ: ${(img.sourceName||'WIKI').toUpperCase()} ↗`;
  }
  async function enrichGallery(type,o,page){
    const grid=q('.detail-gallery',page);if(!grid)return;
    const items=await mergedGallery(o);if(!items.length)return;
    const seen=new Set(qa('img',grid).map(x=>x.src));let added=0;
    for(const item of items){if(added>=6)break;const src=proxy(item.src);if(seen.has(src)||seen.has(item.src))continue;seen.add(src);const f=document.createElement('figure');f.className='media-figure v9-wiki-media';f.innerHTML=`<div class="media-source-ribbon">${(item.sourceName||'WIKI').toUpperCase().includes('FANDOM')?'FANDOM':'LEXICANUM'} · MEDIA</div><img data-lightbox loading="lazy" alt="${esc(o.name)} — иллюстрация"><figcaption><b>${esc(item.fileTitle||o.name)}</b><small>${esc(item.sourceName||'Wiki')} / соответствующий правообладатель</small><a target="_blank" rel="noreferrer">Источник ↗</a></figcaption>`;f.querySelector('img').src=src;f.querySelector('a').href=item.source||'#';grid.prepend(f);added++;}
    if(added>=2){qa('figure',grid).forEach(f=>{const img=q('img',f),s=img?.getAttribute('src')||'';if(genericLocal.some(x=>s.endsWith(x))&&!f.classList.contains('v9-wiki-media'))f.classList.add('v9-generic-hidden')})}
  }

  const oldDetail=window.renderDetail;
  window.renderDetail=function(type,o){
    const r=oldDetail(type,o),page=q('#detailPage');if(!page)return r;const main=q('.detail-main',page);if(!main)return r;
    qa('.v9-matrix,.v9-chronicle,.v9-path-index',main).forEach(x=>x.remove());
    const intro=q('.intro-block',main);if(intro)intro.insertAdjacentHTML('afterend',matrixHtml(type,o)+chronicleHtml(type,o));
    const gallery=q('.gallery-block',main);if(gallery)gallery.insertAdjacentHTML('beforebegin',pathHtml(type,o));
    setTimeout(()=>{enrichHero(type,o,page);enrichGallery(type,o,page)},20);
    installTabSpy(page);return r;
  };

  function installTabSpy(page){
    const nav=q('.detail-tabs',page);if(!nav||nav.dataset.v9spy)return;nav.dataset.v9spy='1';const links=qa('a[href^="#"]',nav);const sections=links.map(a=>q(a.getAttribute('href'),page)).filter(Boolean);if(!sections.length)return;
    const io=new IntersectionObserver(es=>{const top=es.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(!top)return;links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+top.target.id))},{rootMargin:'-120px 0px -62% 0px',threshold:[0,.2,.5]});sections.forEach(s=>io.observe(s));
  }

  // MAP — LOD, focus, clamping and a proper hover dossier ////////////////////////////////////
  const critical=new Set(['terra','cadia','macragge','ultramar','baal','armageddon','eye-of-terror','pariah-nexus','tau','commorragh','ulthwe','vigilus','prospero','fenris']);
  const major=new Set(['mars','calth-world','ishtvaan-iii','isstvan-iii','isstvan-v','molech','sotha','caliban','medusa','nocturne','chogoris','solemnace','iyanden','alaitoc','biel-tan','saim-hann','krieg','catachan','necromunda']);
  function classifyPoints(){qa('.map-point').forEach(p=>{const o=rec('location',p.dataset.id),score=(o?.connections?.length||0)+(critical.has(p.dataset.id)?20:0)+(major.has(p.dataset.id)?8:0);p.classList.remove('v9-p0','v9-p1','v9-p2');p.classList.add(score>=12?'v9-p2':score>=5?'v9-p1':'v9-p0')})}
  classifyPoints();

  const vp=q('#galaxyViewport'),st=q('#galaxyStage');
  const oldUpdate=window.updateMapTransform;
  window.updateMapTransform=function(){
    if(!vp||!st)return oldUpdate?.();const r=vp.getBoundingClientRect(),s=mapState.scale,w=1200*s,h=780*s,pad=60;
    if(w<=r.width)mapState.x=(r.width-w)/2;else mapState.x=Math.min(pad,Math.max(r.width-w-pad,mapState.x));
    if(h<=r.height)mapState.y=(r.height-h)/2;else mapState.y=Math.min(pad,Math.max(r.height-h-pad,mapState.y));
    st.style.transform=`translate(${mapState.x}px,${mapState.y}px) scale(${s})`;
    st.classList.remove('v9-z0','v9-z1','v9-z2');st.classList.add(s<.88?'v9-z0':s<1.18?'v9-z1':'v9-z2');
  };
  const oldFit=window.fitMap;
  window.fitMap=function(){const r=vp.getBoundingClientRect();if(!r.width)return;const base=Math.min(r.width/1200,r.height/780);mapState.minScale=base;mapState.scale=base;mapState.x=(r.width-1200*base)/2;mapState.y=(r.height-780*base)/2;window.updateMapTransform()};
  window.zoomMap=function(delta,cx=vp.clientWidth/2,cy=vp.clientHeight/2){const old=mapState.scale,min=mapState.minScale||Math.min(vp.clientWidth/1200,vp.clientHeight/780),next=Math.max(min,Math.min(3.25,old*delta)),wx=(cx-mapState.x)/old,wy=(cy-mapState.y)/old;mapState.scale=next;mapState.x=cx-wx*next;mapState.y=cy-wy*next;window.updateMapTransform()};
  q('#zoomIn')&&(q('#zoomIn').onclick=()=>window.zoomMap(1.18));q('#zoomOut')&&(q('#zoomOut').onclick=()=>window.zoomMap(.85));q('#zoomReset')&&(q('#zoomReset').onclick=()=>window.fitMap());

  function focusPoint(id){const o=rec('location',id);if(!o||!vp)return;const r=vp.getBoundingClientRect();const target=Math.max(mapState.minScale||.8,1.22);mapState.scale=target;mapState.x=r.width/2-(+o.x*12)*target;mapState.y=r.height/2-(+o.y*7.8)*target;window.updateMapTransform();q(`.map-point[data-id="${CSS.escape(id)}"]`)?.classList.add('v9-focus-pulse');setTimeout(()=>q(`.map-point[data-id="${CSS.escape(id)}"]`)?.classList.remove('v9-focus-pulse'),1800)}
  const oldSelect=window.selectMapRecord;
  window.selectMapRecord=function(id){const r=oldSelect(id),side=q('#mapSide');if(side&&!q('[data-v9-focus]',side)){const b=document.createElement('button');b.className='detail-open v9-focus-btn';b.dataset.v9Focus=id;b.textContent='Сфокусировать на карте ⊕';side.appendChild(b)}return r};
  document.addEventListener('click',e=>{const b=e.target.closest('[data-v9-focus]');if(b)focusPoint(b.dataset.v9Focus)});

  if(vp&&!q('.v9-map-tooltip',vp)){
    const tip=document.createElement('div');tip.className='v9-map-tooltip';vp.appendChild(tip);
    vp.addEventListener('pointermove',e=>{const p=e.target.closest('.map-point');if(!p){tip.classList.remove('show');return}const o=rec('location',p.dataset.id);if(!o)return;const rr=vp.getBoundingClientRect();tip.innerHTML=`<small>${esc(o.type||'OBJECT')} · ${esc(o.affiliation||'UNKNOWN')}</small><b>${esc(o.name)}</b><span>${esc(o.segmentum||'')}</span>`;tip.style.left=Math.min(rr.width-240,e.clientX-rr.left+18)+'px';tip.style.top=Math.max(12,e.clientY-rr.top-28)+'px';tip.classList.add('show')});
    vp.addEventListener('pointerleave',()=>tip.classList.remove('show'));
  }

  // map search suggestions
  const ms=q('#mapSearch');if(ms&&!q('.v9-map-search-results')){
    const host=document.createElement('div');host.className='v9-map-search-results';ms.parentElement.appendChild(host);
    const draw=()=>{const s=ms.value.trim().toLowerCase();if(s.length<2){host.classList.remove('open');host.innerHTML='';return}const a=L.locations.filter(x=>(x.name+' '+(x.segmentum||'')+' '+(x.type||'')).toLowerCase().includes(s)).slice(0,7);host.innerHTML=a.map(x=>`<button data-map-jump="${x.id}"><b>${esc(x.name)}</b><small>${esc(x.type||'')} · ${esc(x.segmentum||'')}</small></button>`).join('');host.classList.toggle('open',!!a.length)};ms.addEventListener('input',draw);host.addEventListener('click',e=>{const b=e.target.closest('[data-map-jump]');if(!b)return;ms.value=rec('location',b.dataset.mapJump)?.name||'';host.classList.remove('open');window.applyMapFilters?.();window.selectMapRecord(b.dataset.mapJump);focusPoint(b.dataset.mapJump)});
  }

  window.addEventListener('load',()=>{classifyPoints();setTimeout(()=>window.updateMapTransform?.(),100)});
})();
