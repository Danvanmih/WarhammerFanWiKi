/* Product polish: map layers, motion, source-aware gallery, bookmarks and UX details. */
(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const toastEl=$('#toast');
  function toast(msg){if(!toastEl)return;toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastEl._t);toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),2200)}

  // Keep a lightweight local reading trail. No account or external service involved.
  const originalOpenDetail=window.openDetail||openDetail;
  window.openDetail=openDetail=function(type,id,updateHash=true){
    originalOpenDetail(type,id,updateHash);
    const key='imperium-archive-recent';
    let recent=[];try{recent=JSON.parse(localStorage.getItem(key)||'[]')}catch{}
    recent=[`${type}:${id}`,...recent.filter(x=>x!==`${type}:${id}`)].slice(0,12);
    localStorage.setItem(key,JSON.stringify(recent));
    setTimeout(()=>{syncBookmarkButton();wireLightboxImages();observeReveals();hydrateDetailMedia(type,id);renderPersonalArchive();},0);
  };

  // Bookmark & deep-link tools on dossier pages.
  function readBookmarks(){try{return new Set(JSON.parse(localStorage.getItem('imperium-archive-bookmarks')||'[]'))}catch{return new Set()}}
  function writeBookmarks(s){localStorage.setItem('imperium-archive-bookmarks',JSON.stringify([...s]))}
  function syncBookmarkButton(){const b=$('[data-bookmark]');if(!b)return;const on=readBookmarks().has(b.dataset.bookmark);b.classList.toggle('active',on);b.textContent=on?'★ В избранном':'☆ В избранное'}
  document.addEventListener('click',async e=>{
    const b=e.target.closest('[data-bookmark]');if(b){const set=readBookmarks(),k=b.dataset.bookmark;if(set.has(k)){set.delete(k);toast('Удалено из избранного')}else{set.add(k);toast('Добавлено в избранное')}writeBookmarks(set);syncBookmarkButton();return}
    if(e.target.closest('[data-copy-link]')){try{await navigator.clipboard.writeText(location.href);toast('Ссылка на запись скопирована')}catch{toast('Не удалось скопировать ссылку')}return}
  });

  // Fan-site media enrichment. We use the entity's own Lexicanum source, ask MediaWiki for that page image,
  // and keep a visible attribution. If the remote API is unavailable, local art remains in place.
  const lexImageCache=new Map();
  function lexSource(o){return (o?.sources||[]).find(([n,u])=>/lexicanum/i.test(n)||/wh40k\.lexicanum\.com/.test(u))?.[1]||null}
  function lexTitle(o){if(o?.wikiTitle)return o.wikiTitle;const u=lexSource(o);if(u&&u.includes('/wiki/')){try{return decodeURIComponent(u.split('/wiki/')[1].split(/[?#]/)[0]).replaceAll('_',' ')}catch{}}return o?.en||o?.name||''}
  const badRemote=s=>/(placeholder|default-avatar|portrait_placeholder|noimage|wiki\.png|article-placeholder|logo|icon|symbol|badge|question\.(png|svg)|Wikia-Visualization-Main|MapIcon|Portal)/i.test(String(s||''));
  const preferredSite=o=>o?.mediaSite||((o?.sources||[]).some(([n,u])=>/fandom|warhammer40k\.fandom/i.test(String(n)+String(u)))?'fandom':'lexicanum');
  const proxify=u=>/^https?:/i.test(String(u||''))?'/api/media-proxy?url='+encodeURIComponent(u):u;
  async function fetchLexImage(o){
    const title=lexTitle(o);if(!title)return null;const site=preferredSite(o);const cacheKey=`${site}:${title.toLowerCase()}`;if(lexImageCache.has(cacheKey))return lexImageCache.get(cacheKey);
    try{
      const r=await fetch('/api/wiki-image?site='+encodeURIComponent(site)+'&title='+encodeURIComponent(title));if(!r.ok)throw 0;
      const j=await r.json();const src=j?.src;
      const val=src&&!badRemote(src)?{src,source:j.source||lexSource(o),credit:(j.sourceName||'Wiki')+' / соответствующий правообладатель'}:null;
      lexImageCache.set(cacheKey,val);return val;
    }catch{
      try{
        const base=site==='fandom'?'https://warhammer40k.fandom.com/api.php':'https://wh40k.lexicanum.com/mediawiki/api.php';
        const url=base+'?action=query&format=json&origin=*&prop=pageimages&piprop=original|thumbnail&pithumbsize=1400&redirects=1&titles='+encodeURIComponent(title);
        const r=await fetch(url,{mode:'cors'});if(!r.ok)throw 0;const j=await r.json();const page=Object.values(j?.query?.pages||{})[0];const src=page?.original?.source||page?.thumbnail?.source;
        const val=src&&!badRemote(src)?{src,source:lexSource(o)||j?.source||'',credit:(site==='fandom'?'Warhammer 40k Wiki / Fandom':'Lexicanum')+' / соответствующий правообладатель'}:null;
        lexImageCache.set(cacheKey,val);return val;
      }catch{lexImageCache.set(cacheKey,null);return null}
    }
  }
  async function fetchLexGallery(o){
    const title=lexTitle(o);if(!title)return[];const site=preferredSite(o);try{const r=await fetch('/api/wiki-gallery?site='+encodeURIComponent(site)+'&title='+encodeURIComponent(title));if(!r.ok)return[];const j=await r.json();return(j.items||[]).filter(x=>x?.src&&!badRemote(x.src)).map(x=>({src:x.src,source:x.source,credit:(x.sourceName||(site==='fandom'?'Warhammer 40k Wiki / Fandom':'Lexicanum'))+' / соответствующий правообладатель',caption:x.fileTitle||`${o.name} — архивная иллюстрация`}))}catch{return[]}
  }
  async function hydrateDetailMedia(type,id){
    const o=collections[type]?.find(x=>x.id===id),gallery=$('.detail-gallery');if(!o||!gallery||gallery.dataset.remoteHydrated)return;gallery.dataset.remoteHydrated='1';
    const [media,extra]=await Promise.all([fetchLexImage(o),fetchLexGallery(o)]);
    if(media){const hero=$('.detail-cinematic');if(hero){hero.dataset.mediaSource=media.source||hero.dataset.mediaSource||'';}}
    const existing=new Set($$('img',gallery).map(i=>i.src));
    const queue=[...(media?[{...media,caption:`${o.name} — главное изображение связанной статьи`}]:[]),...extra].filter(x=>x?.src&&!badRemote(x.src)).slice(0,5);
    let slot=1;
    for(const item of queue){if(existing.has(item.src))continue;existing.add(item.src);const f=document.createElement('figure');f.className='media-figure sourced-media exact-media';f.innerHTML=`<div class="media-source-ribbon">LEXICANUM · EXACT RECORD</div><img data-lightbox loading="lazy" referrerpolicy="no-referrer" alt="${o.name} — релевантная иллюстрация"><figcaption><b>${item.caption||`${o.name} — иллюстрация`}</b><small>${item.credit||'Lexicanum / соответствующий правообладатель'}</small><a target="_blank" rel="noreferrer">Источник изображения ↗</a></figcaption>`;f.querySelector('img').src=proxify(item.src);f.querySelector('a').href=item.source||lexSource(o)||'https://wh40k.lexicanum.com/';gallery.insertBefore(f,gallery.children[slot]||null);slot++;}
    wireLightboxImages();
  }
  const cardObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(async en=>{if(!en.isIntersecting)return;cardObserver.unobserve(en.target);const type=en.target.dataset.detail,id=en.target.dataset.id;if(!type||!id||!['location','event','organization','arsenal'].includes(type))return;const o=collections[type]?.find(x=>x.id===id);if(!o)return;const m=await fetchLexImage(o);const art=en.target.querySelector('.card-art');if(m&&art&&!badRemote(m.src)){art.style.backgroundImage=`linear-gradient(180deg,transparent,#0c0d0e),url("${proxify(m.src)}"),${getComputedStyle(art).backgroundImage}`;art.dataset.source=m.source||'';en.target.title=`Иллюстрация: wiki source · ${o.name}`;if(!en.target.querySelector('.card-source-badge')){const badge=document.createElement('span');badge.className='card-source-badge';badge.textContent=((m.credit||'').toLowerCase().includes('fandom'))?'FAN · SOURCE':'LEX · SOURCE';en.target.appendChild(badge)}}}),{rootMargin:'300px 0px'}):null;
  function hydrateCards(){if(!cardObserver)return;$$('[data-detail].illustrated').filter(c=>!c.dataset.mediaObserved).forEach(c=>{c.dataset.mediaObserved='1';cardObserver.observe(c)})}

  // Source-aware lightbox.
  const lb=$('#mediaLightbox');
  function wireLightboxImages(){ $$('[data-lightbox]').forEach(img=>img.style.cursor='zoom-in'); }
  document.addEventListener('click',e=>{
    const img=e.target.closest('[data-lightbox]');
    if(img&&lb){const cap=img.closest('figure')?.querySelector('figcaption')?.innerText||img.alt;lb.querySelector('img').src=img.src;lb.querySelector('img').alt=img.alt;lb.querySelector('figcaption').textContent=cap;lb.classList.add('open');lb.setAttribute('aria-hidden','false');}
    if(e.target===lb||e.target.closest('.lightbox-close')){lb?.classList.remove('open');lb?.setAttribute('aria-hidden','true')}
  });
  document.addEventListener('error',e=>{if(e.target.matches?.('.media-figure img')&&!e.target.dataset.fallback){e.target.dataset.fallback='1';e.target.src='/assets/imperium-city.jpg';const c=e.target.closest('figure')?.querySelector('small');if(c)c.textContent+=' · внешний файл недоступен, показан локальный резерв';}},true);

  // Reveal motion for newly rendered cards and dossier blocks.
  const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('revealed');observer.unobserve(en.target)}}),{threshold:.08,rootMargin:'0px 0px -30px'}):null;
  function observeReveals(){if(!observer)return;$$('.module-card,.spot-card,.archive-card,.character-card,.legion-card,.chapter-card,.world-card,.detail-block,.timeline article,.map-reference,.map-modebar').filter(x=>!x.dataset.observed).forEach(x=>{x.dataset.observed='1';x.classList.add('reveal');observer.observe(x)})}
  observeReveals();new MutationObserver(()=>{observeReveals();hydrateCards()}).observe(document.querySelector('main'),{childList:true,subtree:true});

  // Mild pointer tilt: enough movement to make cards feel physical, not a theme-park effect.
  document.addEventListener('pointermove',e=>{
    const card=e.target.closest('.module-card,.archive-card,.character-card,.legion-card,.chapter-card,.world-card,.related-card,.spot-card');
    if(!card||matchMedia('(pointer:coarse)').matches)return;
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.setProperty('--rx',`${(-y*2.2).toFixed(2)}deg`);card.style.setProperty('--ry',`${(x*3).toFixed(2)}deg`);card.style.setProperty('--mx',`${((x+.5)*100).toFixed(0)}%`);card.style.setProperty('--my',`${((y+.5)*100).toFixed(0)}%`);
  });
  document.addEventListener('pointerout',e=>{const card=e.target.closest?.('.module-card,.archive-card,.character-card,.legion-card,.chapter-card,.world-card,.related-card,.spot-card');if(card&&!card.contains(e.relatedTarget)){card.style.removeProperty('--rx');card.style.removeProperty('--ry')}});

  // Global cursor glow.
  addEventListener('pointermove',e=>{document.documentElement.style.setProperty('--cursor-x',`${e.clientX}px`);document.documentElement.style.setProperty('--cursor-y',`${e.clientY}px`)});

  // Reading progress on long dossier pages.
  const progress=document.createElement('div');progress.className='reading-progress';progress.innerHTML='<i></i>';document.body.appendChild(progress);
  addEventListener('scroll',()=>{const detail=$('#detail.active-page');if(!detail){progress.classList.remove('active');return}progress.classList.add('active');const max=document.documentElement.scrollHeight-innerHeight;progress.style.setProperty('--progress',`${max?scrollY/max*100:0}%`)},{passive:true});

  // Sidebar personal archive: bookmarks + recently opened dossiers live only in this browser.
  const personal=document.createElement('div');personal.className='side-personal';personal.innerHTML='<div class="side-divider"><span>ЛИЧНЫЙ АРХИВ</span></div><div id="sidePersonalList"></div>';$('.side-links')?.after(personal);
  function parseKey(k){const [t,id]=String(k).split(':');return [t,id,collections[t]?.find(x=>x.id===id)]}
  function renderPersonalArchive(){const box=$('#sidePersonalList');if(!box)return;const fav=[...readBookmarks()].slice(0,4);let recent=[];try{recent=JSON.parse(localStorage.getItem('imperium-archive-recent')||'[]').slice(0,4)}catch{}const render=(k,icon)=>{const [t,id,o]=parseKey(k);return o?`<button data-detail="${t}" data-id="${id}"><i>${icon}</i><span>${o.name}</span></button>`:''};box.innerHTML=`<small>ИЗБРАННОЕ</small>${fav.map(k=>render(k,'★')).join('')||'<em>Пока пусто</em>'}<small>ПОСЛЕДНИЕ ПРОСМОТРЫ</small>${recent.map(k=>render(k,'↺')).join('')||'<em>Открой любую запись</em>'}`}
  renderPersonalArchive();

  // MAP //////////////////////////////////////////////////////////////////////////////////////
  const stage=$('#galaxyStage'), viewport=$('#galaxyViewport'), coord=$('#mapCoords'), routeLayer=$('#routeLayer');
  const important=new Set(['terra','cadia','macragge','ultramar','eye-of-terror','baal','armageddon','commorragh','tau','pariah-nexus','isstvan-iii','isstvan-v','calth-world','vraks']);
  $$('.map-point').forEach(p=>{if(important.has(p.dataset.id))p.classList.add('major');const rec=window.LORE.locations.find(x=>x.id===p.dataset.id);if(rec){p.dataset.tip=`${rec.name} · ${rec.segmentum||''}`;p.dataset.confidence=['terra','mars','cadia','macragge','baal','fenris','prospero','armageddon'].includes(rec.id)?'high':'reference'}});
  viewport?.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();if(!coord||!r.width)return;const x=Math.max(0,Math.min(999,Math.round((e.clientX-r.left)/r.width*999)));const y=Math.max(0,Math.min(999,Math.round((e.clientY-r.top)/r.height*999)));coord.textContent=`X ${String(x).padStart(3,'0')} · Y ${String(y).padStart(3,'0')}`});

  function setMapEra(era){
    $$('.era-switch button').forEach(b=>b.classList.toggle('active',b.dataset.mapEra===era));stage?.classList.toggle('era-30k',era==='30k');stage?.classList.toggle('era-40k',era==='40k');
    if(routeLayer)routeLayer.classList.toggle('visible',era==='30k'||$('#toggleRoutes')?.checked);
    toast(era==='30k'?'Карта: эпоха Ереси Хоруса':'Карта: современная эпоха 40K');
  }
  $$('.era-switch button').forEach(b=>b.addEventListener('click',()=>setMapEra(b.dataset.mapEra)));
  $('#toggleRoutes')?.addEventListener('change',e=>routeLayer?.classList.toggle('visible',e.target.checked||stage.classList.contains('era-30k')));
  $$('[data-incursion]').forEach(c=>c.addEventListener('change',()=>{const id=c.dataset.incursion;$$(`[data-incursion-area="${id}"]`).forEach(x=>x.classList.toggle('hidden',!c.checked));}));
  setMapEra('40k');

  // Enrich selected-map card with attribution/confidence and related jump points.
  const oldSelect=window.selectMapRecord||selectMapRecord;
  window.selectMapRecord=selectMapRecord=function(id){oldSelect(id);const p=window.LORE.locations.find(x=>x.id===id),side=$('#mapSide');if(!p||!side)return;const confidence=['terra','mars','cadia','macragge','baal','fenris','prospero','armageddon'].includes(id)?'Высокая / общеизвестное положение':'Референсная / относительное положение';const related=(p.connections||[]).slice(0,4).filter(([t,i])=>collections[t]?.some(x=>x.id===i));side.insertAdjacentHTML('beforeend',`<div class="map-confidence"><span>Точность положения</span><b>${confidence}</b></div><div class="map-source-mini"><b>Картографическая методика</b><p>Положение показано относительно нашей схемы и сверяется с внешними картографическими источниками. Jambonium отдельно маркирует уверенность в расположении объектов — тот же принцип используем здесь.</p><a href="https://jambonium.co.uk/40kmap/" target="_blank" rel="noreferrer">Jambonium 40K Map ↗</a></div>${related.length?`<div class="map-related"><span>Связанные записи</span>${related.map(([t,i,l])=>`<button data-detail="${t}" data-id="${i}">${l||i} →</button>`).join('')}</div>`:''}`)};
  // existing map points were wired to old function in closures, so also listen at the container level.
  $('#mapPoints')?.addEventListener('click',e=>{const p=e.target.closest('.map-point');if(p)setTimeout(()=>window.selectMapRecord(p.dataset.id),0)});

  // Slow autonomous map shimmer and parallax, only while visible.
  let raf=0;viewport?.addEventListener('pointermove',e=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const r=viewport.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;viewport.style.setProperty('--px',`${x*10}px`);viewport.style.setProperty('--py',`${y*7}px`)})});

  wireLightboxImages();syncBookmarkButton();hydrateCards();renderPersonalArchive();
})();
