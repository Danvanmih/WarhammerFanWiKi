(()=>{
  const L=window.LORE,D=window.V10_DOSSIERS||{};
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rec=(t,id)=>window.getRecord?.(t,id)||({character:L.characters,legion:L.legions,chapter:L.chapters,faction:L.factions,location:L.locations,event:L.events,organization:L.organizations,arsenal:L.arsenal}[t]||[]).find(x=>x.id===id);
  const proxy=u=>/^https?:/i.test(String(u||''))?'/api/media-proxy?url='+encodeURIComponent(u):u;
  const dossier=(type,id)=>D[`${type}:${id}`]||null;
  const wikiTitle=o=>o?.wikiTitle||o?.en||o?.name||'';
  const mediaCache=new Map();
  async function json(url){try{const r=await fetch(url);if(!r.ok)return null;return await r.json()}catch{return null}}
  async function exactPageImage(o){
    if(!o)return null;const title=wikiTitle(o),key=title.toLowerCase();if(mediaCache.has(key))return mediaCache.get(key);
    let m=await json('/api/wiki-image?site=fandom&title='+encodeURIComponent(title));
    if(!m?.src)m=await json('/api/wiki-image?site=lexicanum&title='+encodeURIComponent(title));
    mediaCache.set(key,m?.src?m:null);return m?.src?m:null;
  }

  function relationTone(label,note){const s=(label+' '+note).toLowerCase();if(/враг|ненавист|убийц|смерт|охот|войн|конфликт|противник/.test(s))return'hostile';if(/довер|друг|уважен|союз|близ|пониман|привязан/.test(s))return'allied';return'complex'}
  function dossierHtml(type,o,d){
    if(!d)return'';
    const fields=type==='character'?[
      ['Эпитет',d.epithet],['Родной мир',d.home],['Легион',d.legion],['Сторона',d.allegiance],['Статус',d.status],['Флагман',d.flagship]
    ]:[
      ['Номер',d.number],['Примарх',rec('character',d.primarch)?.name||d.primarch],['Родной мир',d.home],['Раннее имя',d.former],['Доктрина',d.doctrine],['Судьба',d.fate]
    ];
    const chips=type==='character'?(d.relics||[]):(d.notables||[]);
    const chipTitle=type==='character'?'Оружие и реликвии':'Командиры и заметные фигуры';
    return `<section class="detail-block v10-dossier"><div class="block-head"><div><p class="eyebrow">ARCHIVUM PERSONAE / LEGIONIS</p><h2>${type==='character'?'Расширенное досье примарха':'Профиль легиона'}</h2></div><small>Структурированная карточка для быстрого чтения перед длинной статьёй.</small></div><div class="v10-dossier-grid">${fields.filter(x=>x[1]).map(([k,v])=>`<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('')}</div>${chips.length?`<div class="v10-relics"><span>${chipTitle}</span>${chips.map(x=>`<i>${esc(x)}</i>`).join('')}</div>`:''}${d.campaigns?.length?`<div class="v10-campaigns"><span>Ключевые кампании</span><div>${d.campaigns.map((x,i)=>`<b><em>${String(i+1).padStart(2,'0')}</em>${esc(x)}</b>`).join('')}</div></div>`:''}</section>`;
  }
  function relationsHtml(o,d){
    if(!d?.relations?.length)return'';
    return `<section class="detail-block v10-relations"><div class="block-head"><div><p class="eyebrow">PRIMARCH RELATIONS</p><h2>Отношения с братьями</h2></div><small>Не «шкала дружбы», а конкретные узлы, которые меняли решения и войны.</small></div><div class="v10-relation-grid">${d.relations.map(([id,label,note])=>{const r=rec('character',id);if(!r)return'';const tone=relationTone(label,note);return`<button class="v10-relation-card illustrated ${tone}" data-detail="character" data-id="${id}"><div class="card-art" style="background-image:linear-gradient(180deg,rgba(8,9,10,.18),#0d0f10 90%),url('${window.assetFor?.('character',r)||'/assets/primarchs.jpg'}')"></div><span>${esc(label)}</span><h3>${esc(r.name)}</h3><p>${esc(note)}</p><b>Открыть досье →</b></button>`}).join('')}</div></section>`;
  }
  function miniMapHtml(type,o,d){
    const nodes=(d?.mapNodes||[]).map(id=>rec('location',id)).filter(Boolean);if(nodes.length<2)return'';
    const pts=nodes.map(x=>`${+x.x},${+x.y}`).join(' ');
    return `<section class="detail-block v10-astro"><div class="block-head"><div><p class="eyebrow">ASTROGRAPHICA / PATH</p><h2>${type==='character'?'Схематический путь примарха':'Ключевые театры легиона'}</h2></div><small>Линия показывает последовательность связанных театров войны, а не точную траекторию варп-перелётов.</small></div><div class="v10-mini-map"><img src="/assets/galaxy-atlas.webp" alt="Галактический атлас"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${pts}"/><g>${nodes.map((n,i)=>`<circle cx="${+n.x}" cy="${+n.y}" r="${i===0||i===nodes.length-1?1.25:.85}"/>`).join('')}</g></svg>${nodes.map((n,i)=>`<button style="--x:${+n.x};--y:${+n.y}" data-detail="location" data-id="${n.id}"><i>${i+1}</i><span>${esc(n.name)}</span></button>`).join('')}</div><div class="v10-route-sequence">${nodes.map((n,i)=>`<button data-detail="location" data-id="${n.id}"><em>${String(i+1).padStart(2,'0')}</em><span>${esc(n.name)}</span></button>`).join('')}</div><button class="ghost small v10-open-map-route" data-v10-map-route="${type}:${o.id}">Показать путь на полной карте →</button></section>`;
  }
  function booksHtml(d){
    if(!d?.books?.length)return'';
    return `<section class="detail-block v10-bibliography"><div class="block-head"><div><p class="eyebrow">BLACK LIBRARY / ORIENTATION</p><h2>Маршрут чтения</h2></div><a href="https://www.blacklibrary.com/series/primarchs_" target="_blank" rel="noreferrer">Primarchs series ↗</a></div><div class="v10-book-grid">${d.books.map((b,i)=>`<article><em>${String(i+1).padStart(2,'0')}</em><div><b>${esc(b)}</b><small>${i===0?'Хорошая точка входа':i===1?'Следующий слой контекста':'Расширяет связанные события и персонажей'}</small></div></article>`).join('')}</div>${d.official?.length?`<div class="v10-official-links"><span>Официальные / первичные страницы</span>${d.official.map(([n,u])=>`<a href="${esc(u)}" target="_blank" rel="noreferrer">${esc(n)} ↗</a>`).join('')}</div>`:''}<p class="source-note">Названия приведены как библиографический маршрут. Текст произведений сайт не копирует; для чтения используй Black Library и легальные издания.</p></section>`;
  }
  function legionIdentityHtml(o,d){if(!d||!d.doctrine)return'';return`<section class="detail-block v10-legion-identity"><p class="eyebrow">LEGION DNA</p><h2>Как читать этот легион</h2><div class="v10-identity-grid"><article><span>ВОЙНА</span><h3>Доктрина</h3><p>${esc(d.doctrine)}</p></article><article><span>КУЛЬТУРА</span><h3>Внутренний язык</h3><p>${esc(d.culture)}</p></article><article><span>ПОСЛЕ ЕРЕСИ</span><h3>Наследие</h3><p>${esc(d.fate)}</p></article></div></section>`}
  function quoteHtml(type,o){const a=window.V10_QUOTES?.[`${type}:${o.id}`]||[];if(!a.length)return'';return`<section class="detail-block v10-book-quotes"><p class="eyebrow">SHORT QUOTATIONS</p><h2>Короткие цитаты из источников</h2><div>${a.map(x=>`<blockquote>“${esc(x.text)}”<cite>${esc(x.source)}</cite></blockquote>`).join('')}</div><p class="source-note">Приведены только короткие фрагменты; полные тексты книг на сайте не воспроизводятся.</p></section>`}

  // Wrap detail after all previous upgrades. --------------------------------------------------
  const oldDetail=window.renderDetail;
  window.renderDetail=function(type,o){
    const r=oldDetail(type,o),d=dossier(type,o.id),page=q('#detailPage'),main=q('.detail-main',page);if(!main||!d)return r;
    qa('.v10-dossier,.v10-relations,.v10-astro,.v10-bibliography,.v10-legion-identity',main).forEach(x=>x.remove());
    const intro=q('.intro-block',main),matrix=q('.v9-matrix',main),anchor=matrix||intro;
    anchor?.insertAdjacentHTML('afterend',dossierHtml(type,o,d)+(type==='legion'?legionIdentityHtml(o,d):'')+relationsHtml(o,d)+miniMapHtml(type,o,d));
    const gallery=q('.gallery-block',main);gallery?.insertAdjacentHTML('beforebegin',booksHtml(d)+quoteHtml(type,o));
    setTimeout(()=>hydrateExactDetail(type,o,page),40);
    return r;
  };

  async function hydrateExactDetail(type,o,page){
    const m=await exactPageImage(o);if(!m?.src)return;const hero=q('.detail-cinematic',page);if(hero){hero.style.setProperty('--hero',`url("${proxy(m.src)}")`);let a=q('.v10-source-pill',hero);if(!a){a=document.createElement('a');a.className='v10-source-pill';a.target='_blank';a.rel='noreferrer';hero.appendChild(a)}a.href=m.source||'#';a.textContent=`Основное изображение · ${m.sourceName||'Wiki'} ↗`;}
  }

  // Force cards to use the page's primary image first, not a random gallery file. -------------
  async function exactCard(card){
    if(card.dataset.v10exact==='1')return;card.dataset.v10exact='1';const type=card.dataset.detail,id=card.dataset.id;if(!['character','legion','chapter','faction'].includes(type))return;const o=rec(type,id);if(!o)return;const m=await exactPageImage(o);const art=q('.card-art',card);if(!m?.src||!art)return;const local=window.assetFor?.(type,o)||'/assets/imperium-city.jpg';art.style.backgroundImage=`linear-gradient(180deg,rgba(5,6,7,.02),#0c0d0e 96%),url("${proxy(m.src)}"),url("${local}")`;art.style.backgroundSize='cover,cover,cover';art.style.backgroundPosition='center,center,center';art.classList.add('v10-real-loaded');let b=q('.v10-media-badge',card);if(!b){b=document.createElement('span');b.className='v10-media-badge';card.appendChild(b)}b.textContent=(m.sourceName||'WIKI').toUpperCase().includes('FANDOM')?'FANDOM · PRIMARY':'LEXICANUM · PRIMARY';b.title=m.source||'';
  }
  const cardObs='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){cardObs.unobserve(e.target);exactCard(e.target)}}),{rootMargin:'500px 0px'}):null;
  function watchCards(){qa('.illustrated[data-detail][data-id]').forEach(c=>{if(c.dataset.v10watched)return;c.dataset.v10watched='1';cardObs?cardObs.observe(c):exactCard(c)})}
  new MutationObserver(watchCards).observe(document.body,{subtree:true,childList:true});

  // Full map: selectable route for every Primarch. --------------------------------------------
  const primarchEntries=Object.entries(D).filter(([k,d])=>k.startsWith('character:')&&(d.mapNodes||[]).filter(id=>rec('location',id)).length>1);
  const routeLayer=q('#routeLayer'),vp=q('#galaxyViewport');
  function routeCoords(d){return(d.mapNodes||[]).map(id=>rec('location',id)).filter(Boolean).map(n=>({id:n.id,name:n.name,x:+n.x*12,y:+n.y*7.8,px:+n.x,py:+n.y}))}
  function routeD(a){if(a.length<2)return'';let d=`M ${a[0].x} ${a[0].y}`;for(let i=1;i<a.length;i++){const p=a[i-1],n=a[i],bend=(i%2?1:-1)*Math.min(45,Math.hypot(n.x-p.x,n.y-p.y)*.1);d+=` C ${p.x+(n.x-p.x)*.34} ${p.y+(n.y-p.y)*.2+bend} ${p.x+(n.x-p.x)*.68} ${p.y+(n.y-p.y)*.8-bend} ${n.x} ${n.y}`;}return d}
  function renderPrimarchRoute(key,fit=true){
    if(!routeLayer)return;qa('.v10-primarch-route,.v10-primarch-node',routeLayer).forEach(x=>x.remove());if(!key)return;const d=D[key],a=routeCoords(d);if(a.length<2)return;
    routeLayer.insertAdjacentHTML('beforeend',`<path class="v10-primarch-route" d="${routeD(a)}"/>${a.map((p,i)=>`<circle class="v10-primarch-node" cx="${p.x}" cy="${p.y}" r="${i===0||i===a.length-1?6:4}"/>`).join('')}`);
    if(fit&&vp){const r=vp.getBoundingClientRect(),xs=a.map(x=>x.x),ys=a.map(x=>x.y),minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys),maxy=Math.max(...ys),w=Math.max(170,maxx-minx),h=Math.max(130,maxy-miny);const target=Math.min(1.65,Math.max(mapState.minScale||.7,Math.min((r.width-180)/w,(r.height-160)/h)));mapState.scale=target;mapState.x=r.width/2-((minx+maxx)/2)*target;mapState.y=r.height/2-((miny+maxy)/2)*target;window.updateMapTransform?.();}
    const side=q('#mapSide');if(side){const [type,id]=key.split(':');const o=rec(type,id);side.innerHTML=`<p class="eyebrow">PRIMARCH ROUTE</p><h3>${esc(o?.name||'Маршрут')}</h3><p>${esc(d.epithet||'')}</p><div class="v10-map-route-list">${a.map((p,i)=>`<button data-detail="location" data-id="${p.id}"><em>${i+1}</em><span>${esc(p.name)}</span></button>`).join('')}</div><small class="v10-map-disclaimer">Маршрут схематический и предназначен для навигации по связанным статьям, а не для точного воспроизведения всех перемещений флота.</small>`;}
  }
  function installRouteSelector(){const bar=q('.map-modebar');if(!bar||q('.v10-route-picker',bar))return;const div=document.createElement('div');div.className='v10-route-picker';div.innerHTML=`<span>Путь примарха</span><select id="v10PrimarchRoute"><option value="">Не выбран</option>${primarchEntries.map(([key])=>{const [,id]=key.split(':');const o=rec('character',id);return`<option value="${key}">${esc(o?.name||id)}</option>`}).join('')}</select><button id="v10ClearRoute">×</button>`;bar.appendChild(div);q('#v10PrimarchRoute',div).addEventListener('change',e=>renderPrimarchRoute(e.target.value,true));q('#v10ClearRoute',div).addEventListener('click',()=>{q('#v10PrimarchRoute',div).value='';renderPrimarchRoute('',false)});}
  document.addEventListener('click',e=>{const b=e.target.closest('[data-v10-map-route]');if(!b)return;window.setRoute?.('map');setTimeout(()=>{installRouteSelector();const s=q('#v10PrimarchRoute');if(s){s.value=b.dataset.v10MapRoute;s.dispatchEvent(new Event('change'))}},120)});

  // Polish image failures: no grey placeholder blocks. ----------------------------------------
  document.addEventListener('error',e=>{const img=e.target;if(!(img instanceof HTMLImageElement))return;if(img.closest('.media-figure')){img.closest('.media-figure').classList.add('media-error');return}const local=img.dataset.localFallback;if(local&&!img.dataset.v10fallback){img.dataset.v10fallback='1';img.src=local}},true);

  let charMode='all';
  function characterBucket(o){
    if(D[`character:${o.id}`])return'primarch';
    const f=rec('faction',o.faction),leg=o.legion&&rec('legion',o.legion);
    if(o.faction==='chaos'||leg?.allegiance==='traitor'||/демон|хаос/i.test(String(o.status||'')+' '+String(o.title||'')))return'chaos';
    if(f?.group==='Xenos'||['orks','necrons','tyranids','tau','aeldari','drukhari'].includes(o.faction))return'xenos';
    return'imperium';
  }
  function applyCharacterFilter(){const grid=q('#characterGrid');if(!grid)return;qa('.character-card[data-id]',grid).forEach(c=>{const o=rec('character',c.dataset.id);c.hidden=charMode!=='all'&&characterBucket(o)!==charMode});const visible=qa('.character-card:not([hidden])',grid).length;const count=q('#v10CharacterCount');if(count)count.textContent=`Показано: ${visible} / ${L.characters.length}`;}
  function installCharacterFilters(){const page=q('#characters .content-section'),grid=q('#characterGrid');if(!page||!grid||q('.v10-character-filters',page))return;const tabs=document.createElement('div');tabs.className='v10-character-filters category-tabs';tabs.innerHTML='<button class="chip active" data-v10-char="all">Все</button><button class="chip" data-v10-char="primarch">Примархи</button><button class="chip" data-v10-char="imperium">Империум</button><button class="chip" data-v10-char="chaos">Хаос</button><button class="chip" data-v10-char="xenos">Ксеносы</button><span id="v10CharacterCount"></span>';grid.before(tabs);tabs.addEventListener('click',e=>{const b=e.target.closest('[data-v10-char]');if(!b)return;qa('[data-v10-char]',tabs).forEach(x=>x.classList.toggle('active',x===b));charMode=b.dataset.v10Char;applyCharacterFilter()});new MutationObserver(()=>setTimeout(applyCharacterFilter,0)).observe(grid,{childList:true});applyCharacterFilter();}

  window.addEventListener('load',()=>{watchCards();installRouteSelector();installCharacterFilters();setTimeout(()=>{watchCards();applyCharacterFilter()},300)});
})();
