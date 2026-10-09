(()=>{
  const L=window.LORE||{}, SOURCE_PAGES=window.V12_SOURCE_PAGES||{};
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const proxy=u=>/^https?:/i.test(String(u||''))?'/api/media-proxy?url='+encodeURIComponent(u):u;
  const collections12={character:L.characters,legion:L.legions,chapter:L.chapters,faction:L.factions,location:L.locations,event:L.events,organization:L.organizations,arsenal:L.arsenal};
  const rec=(t,id)=>collections12[t]?.find(x=>x.id===id);
  const wait=ms=>new Promise(r=>setTimeout(r,ms));

  // ---------------------------------------------------------------------------
  // Detail navigation must stay local. Hash anchors collide with the SPA router,
  // so detail tabs are real buttons and never change location.hash.
  // ---------------------------------------------------------------------------
  function repairDetailTabs(page=document){
    const nav=$('.detail-tabs',page);if(!nav)return;
    const tabs=[['overview','Обзор'],['history','История'],['relations','Связи'],['gallery','Галерея'],['sources','Источники']];
    nav.innerHTML=tabs.map(([id,label])=>`<button type="button" data-v12-scroll="${id}">${label}</button>`).join('');
  }
  document.addEventListener('click',ev=>{
    const b=ev.target.closest('[data-v12-scroll]');if(!b)return;ev.preventDefault();
    const target=document.getElementById(b.dataset.v12Scroll);if(!target)return;
    target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    $$('.detail-tabs [data-v12-scroll]').forEach(x=>x.classList.toggle('active',x===b));
  });

  // ---------------------------------------------------------------------------
  // Local gallery browser. Clicking a picture never leaves the site; the source
  // is a separate explicit link. New remote figures are absorbed automatically.
  // ---------------------------------------------------------------------------
  function galleryItems(gallery){
    const seen=new Set(),items=[];
    for(const f of $$('figure',gallery)){
      const img=$('img',f);if(!img)continue;const src=img.currentSrc||img.getAttribute('src')||'';if(!src||seen.has(src)||f.classList.contains('media-error'))continue;seen.add(src);
      const cap=$('figcaption b',f)?.textContent?.trim()||img.alt||'Архивная иллюстрация';
      const credit=$('figcaption small',f)?.textContent?.trim()||'Источник указан в записи';
      const link=$('figcaption a',f)?.href||'';
      items.push({src,cap,credit,link});
    }
    return items;
  }
  function mountLocalGallery(page,type,o){
    const gallery=$('.detail-gallery',page),block=gallery?.closest('.gallery-block');if(!gallery||!block)return;
    let viewer=$('.v12-gallery-viewer',block);
    if(!viewer){
      viewer=document.createElement('div');viewer.className='v12-gallery-viewer';viewer.innerHTML=`
        <div class="v12-gallery-stage"><button type="button" class="v12-gallery-image" aria-label="Открыть изображение"><img alt=""><span>УВЕЛИЧИТЬ ⛶</span></button><div class="v12-gallery-caption"><div><b></b><small></small></div><a target="_blank" rel="noreferrer">ИСТОЧНИК ↗</a></div></div>
        <div class="v12-gallery-rail" aria-label="Миниатюры галереи"></div>`;
      gallery.before(viewer);
    }
    let current=0,lastKey='';
    const refresh=()=>{
      const items=galleryItems(gallery),key=items.map(x=>x.src).join('|');if(!items.length||key===lastKey)return;lastKey=key;current=Math.min(current,items.length-1);
      const rail=$('.v12-gallery-rail',viewer);rail.innerHTML=items.map((it,i)=>`<button type="button" data-v12-gallery-index="${i}" class="${i===current?'active':''}"><img src="${esc(it.src)}" alt=""><span>${String(i+1).padStart(2,'0')}</span></button>`).join('');
      const show=i=>{current=i;const it=items[i];if(!it)return;const img=$('.v12-gallery-image img',viewer),caption=$('.v12-gallery-caption',viewer),link=$('a',caption);img.src=it.src;img.alt=it.cap;$('b',caption).textContent=it.cap;$('small',caption).textContent=it.credit;link.href=it.link||'#';link.style.display=it.link?'':'none';$$('[data-v12-gallery-index]',viewer).forEach((b,n)=>b.classList.toggle('active',n===i));};
      rail.onclick=e=>{const b=e.target.closest('[data-v12-gallery-index]');if(b)show(Number(b.dataset.v12GalleryIndex))};
      $('.v12-gallery-image',viewer).onclick=()=>{const it=items[current],lb=$('#mediaLightbox');if(!it||!lb)return;$('img',lb).src=it.src;$('img',lb).alt=it.cap;$('figcaption',lb).textContent=`${it.cap}\n${it.credit}`;lb.classList.add('open');lb.setAttribute('aria-hidden','false')};
      show(current);
    };
    refresh();
    if(!gallery.dataset.v12Observed){gallery.dataset.v12Observed='1';let timer=0;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(refresh,80)}).observe(gallery,{childList:true,subtree:true,attributes:true,attributeFilter:['src','class']});}
    block.classList.add('v12-gallery-local');
  }

  // ---------------------------------------------------------------------------
  // Use any public source already attached to the article. The server reads the
  // page OpenGraph preview; the image is shown in the local gallery with a clear
  // source link. Wiki galleries continue to work in parallel.
  // ---------------------------------------------------------------------------
  const sourceCache=new Map();
  async function sourcePreview(url){if(sourceCache.has(url))return sourceCache.get(url);try{const r=await fetch('/api/source-preview?url='+encodeURIComponent(url));const j=r.ok?await r.json():null;sourceCache.set(url,j);return j}catch{sourceCache.set(url,null);return null}}
  async function hydrateOpenWebMedia(type,o,page){
    const gallery=$('.detail-gallery',page);if(!gallery||gallery.dataset.v12WebHydrated==='1')return;gallery.dataset.v12WebHydrated='1';
    const extras=SOURCE_PAGES[`${type}:${o.id}`]||[],raw=[...(o.sources||[]),...extras];
    const sources=[];for(const pair of raw){const url=Array.isArray(pair)?pair[1]:pair?.url;if(!/^https?:/i.test(String(url||'')))continue;if(sources.includes(url))continue;sources.push(url);if(sources.length>=7)break;}
    const results=(await Promise.all(sources.map(sourcePreview))).filter(Boolean);
    const existing=new Set($$('img',gallery).map(i=>i.currentSrc||i.src));
    for(const m of results){if(!m?.src)continue;const src=proxy(m.src);if(existing.has(src)||existing.has(m.src))continue;existing.add(src);
      const domain=(()=>{try{return new URL(m.source).hostname.replace(/^www\./,'')}catch{return'web source'}})();
      const f=document.createElement('figure');f.className='media-figure sourced-media v12-open-web';f.innerHTML=`<div class="media-source-ribbon">WEB · ${esc(domain.toUpperCase())}</div><img data-lightbox loading="lazy" alt="${esc(o.name)} — материал внешнего источника"><figcaption><b>${esc(m.title||o.name)}</b><small>${esc(domain)} · соответствующий правообладатель</small><a href="${esc(m.source)}" target="_blank" rel="noreferrer">Источник ↗</a></figcaption>`;f.querySelector('img').src=src;gallery.appendChild(f);
    }
  }

  // ---------------------------------------------------------------------------
  // More useful article decoration: visible archival numbering and context strip.
  // ---------------------------------------------------------------------------
  function decorateDetail(page,type,o){
    $$('.detail-main>.detail-block',page).forEach((b,i)=>{b.dataset.archiveIndex=String(i+1).padStart(2,'0');b.classList.add('v12-engraved')});
    const aside=$('.detail-aside',page);if(aside){aside.classList.add('v12-aside');const dossier=$('.dossier',aside);if(dossier&&!$('.v12-aside-label',dossier)){dossier.insertAdjacentHTML('afterbegin','<div class="v12-aside-label">+++ ARCHIVAL DOSSIER +++</div>')}}
    const hero=$('.detail-cinematic',page);if(hero&&!$('.v12-hero-rail',hero)){hero.insertAdjacentHTML('beforeend',`<div class="v12-hero-rail"><span>${esc((type||'record').toUpperCase())}</span><i></i><b>${esc(o.name)}</b></div>`)}
  }

  const oldRender=window.renderDetail;
  window.renderDetail=function(type,o){
    const r=oldRender(type,o),page=$('#detailPage');if(!page)return r;
    repairDetailTabs(page);decorateDetail(page,type,o);mountLocalGallery(page,type,o);
    setTimeout(()=>{hydrateOpenWebMedia(type,o,page).then(()=>mountLocalGallery(page,type,o));},120);
    return r;
  };

  // Gallery and source links must never be interpreted as SPA navigation.
  document.addEventListener('click',ev=>{const a=ev.target.closest('.detail-gallery a,.v12-gallery-viewer a');if(a)ev.stopPropagation()},true);

  // Resize safety: a fixed desktop sidebar reduces the actual content width.
  function layoutClass(){document.body.classList.toggle('v12-narrow-desktop',innerWidth>1080&&innerWidth<1500);}
  addEventListener('resize',layoutClass,{passive:true});layoutClass();
})();
