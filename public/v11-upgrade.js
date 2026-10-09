(()=>{
  const L=window.LORE||{}, GUIDE=window.V11_GUIDE||{};
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const record=(t,id)=>window.getRecord?.(t,id)||({character:L.characters,legion:L.legions,chapter:L.chapters,faction:L.factions,location:L.locations,event:L.events,organization:L.organizations,arsenal:L.arsenal}[t]||[]).find(x=>x.id===id);
  const proxy=u=>/^https?:/i.test(String(u||''))?'/api/media-proxy?url='+encodeURIComponent(u):u;
  const typeName={character:'Персонаж',legion:'Легион',chapter:'Орден',faction:'Фракция',location:'Мир / регион',event:'Событие',organization:'Организация',arsenal:'Арсенал'};

  // ---------------------------------------------------------------------------
  // Responsive / navigation hardening.
  // ---------------------------------------------------------------------------
  const menuShade=document.createElement('button');
  menuShade.className='v11-menu-shade';menuShade.type='button';menuShade.setAttribute('aria-label','Закрыть меню');document.body.appendChild(menuShade);
  menuShade.addEventListener('click',()=>document.body.classList.remove('menu-open'));
  addEventListener('resize',()=>{if(innerWidth>900)document.body.classList.remove('menu-open')},{passive:true});

  // ---------------------------------------------------------------------------
  // SEARCH V11 — explain every result and highlight why it matched.
  // ---------------------------------------------------------------------------
  const norm=s=>String(s??'').toLowerCase().replace(/ё/g,'е').replace(/[«»“”„"'’]/g,'').replace(/\s+/g,' ').trim();
  const tokens=s=>norm(s).split(/[^\p{L}\p{N}]+/u).filter(x=>x.length>1);
  const joinValues=v=>Array.isArray(v)?v.map(joinValues).join(' · '):typeof v==='object'&&v?v.name||v.title||JSON.stringify(v):String(v??'');
  function fieldIndex(type,o){
    const ex=window.EXPANDED_LORE?.[type]?.[o.id]||{}, v10=window.V10_DOSSIERS?.[`${type}:${o.id}`]||{}, guide=GUIDE[`${type}:${o.id}`]||{};
    const con=(o.connections||[]).map(([t,id,label])=>label||record(t,id)?.name||id);
    return [
      ['Название',o.name,120],['Оригинальное название',o.en,100],['Титул / роль',o.title||o.type||o.group||o.category,85],
      ['Краткое описание',o.summary||o.tagline,70],['Статус',o.status,48],['Родной мир / база',o.home||o.segmentum,55],
      ['История',(o.history||[]).join(' · '),44],['Ключевые факты',(o.facts||o.knownFor||[]).join(' · '),43],['Связи',con.join(' · '),56],
      ['Лор',(ex.sections||[]).map(x=>x.join(' — ')).join(' · '),38],['Книги',(ex.reading||[]).join(' · '),34],
      ['Досье',Object.values(v10).map(joinValues).join(' · '),42],['Глубокий архив',[...(guide.pillars||[]).flat(),...(guide.books||[]),...(guide.games||[])].join(' · '),36]
    ].filter(x=>x[1]);
  }
  function snippet(text,terms){
    const raw=String(text||'').replace(/\s+/g,' ').trim();if(!raw)return'';const n=norm(raw);let pos=-1;for(const t of terms){const p=n.indexOf(t);if(p>=0&&(pos<0||p<pos))pos=p;}if(pos<0)return raw.slice(0,170)+(raw.length>170?'…':'');const start=Math.max(0,pos-55),end=Math.min(raw.length,pos+125);return(start?'…':'')+raw.slice(start,end)+(end<raw.length?'…':'');
  }
  function highlight(text,query){
    const terms=[...new Set(tokens(query))].sort((a,b)=>b.length-a.length);const raw=String(text??'');if(!terms.length)return e(raw);
    const re=new RegExp(terms.map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'giu');let out='',last=0,m;
    while((m=re.exec(raw))){out+=e(raw.slice(last,m.index))+`<mark>${e(m[0])}</mark>`;last=m.index+m[0].length;if(re.lastIndex===m.index)re.lastIndex++;}
    return out+e(raw.slice(last));
  }
  window.searchRecords=searchRecords=function(query){
    const qt=tokens(query),phrase=norm(query),out=[];
    for(const [type,arr] of Object.entries(collections))for(const o of arr){
      let score=0;const matches=[];
      for(const [label,value,weight] of fieldIndex(type,o)){
        const nv=norm(value);if(!nv)continue;let hit=0;if(phrase&&nv.includes(phrase))hit+=3;for(const t of qt)if(nv.includes(t))hit++;if(!hit)continue;
        score+=weight*hit;matches.push({label,value:String(value),weight,hit});
      }
      if(score)out.push({type,o,score,matches:matches.sort((a,b)=>(b.weight*b.hit)-(a.weight*a.hit))});
    }
    return out.sort((a,b)=>b.score-a.score||String(a.o.name).localeCompare(String(b.o.name),'ru')).slice(0,50);
  };
  window.renderGlobalResults=renderGlobalResults=function(query){
    const box=q('#globalSearchResults');if(!box)return;const queryTrim=String(query||'').trim();const results=searchRecords(queryTrim);
    if(!queryTrim){box.innerHTML='<div class="v11-search-empty"><b>Поиск по архиву</b><p>Введи имя, мир, событие, книгу, фракцию или даже часть описания. Результат покажет, почему он найден.</p><span>Пример: «Калт», «мельта», «Сангвиний», «Чумные войны»</span></div>';return;}
    if(!results.length){box.innerHTML=`<div class="v11-search-empty"><b>Совпадений нет</b><p>Запрос «${e(queryTrim)}» не найден в текущем архиве.</p><span>Попробуй другое написание или более короткую форму.</span></div>`;return;}
    const terms=tokens(queryTrim);
    box.innerHTML=`<div class="v11-search-summary">Найдено: <b>${results.length}</b><span>Подсветка показывает, почему запись попала в выдачу.</span></div>`+results.map(({type,o,matches})=>{
      const best=matches[0],why=matches.slice(0,3);const sn=snippet(best?.value||o.summary||'',terms);
      return `<button class="global-result v11-result" data-detail="${type}" data-id="${o.id}"><div class="v11-result-body"><div class="v11-result-top"><span class="v11-result-type">${e(typeName[type]||type)}</span><b>${highlight(o.name,queryTrim)}</b></div><p>${highlight(sn,queryTrim)}</p><div class="v11-match-reasons">${why.map(m=>`<span><i>${e(m.label)}</i>${highlight(snippet(m.value,terms).slice(0,80),queryTrim)}</span>`).join('')}</div></div><strong>→</strong></button>`;
    }).join('');
  };

  // ---------------------------------------------------------------------------
  // Detail depth: visualised knowledge pillars for already existing records.
  // ---------------------------------------------------------------------------
  function guideHtml(type,o){
    const d=GUIDE[`${type}:${o.id}`];if(!d?.pillars?.length)return'';
    return `<section class="detail-block v11-guide"><div class="block-head"><div><p class="eyebrow">KNOWLEDGE LAYERS</p><h2>Как понимать эту запись</h2></div><small>Короткая структура перед длинным чтением.</small></div><div class="v11-guide-grid">${d.pillars.map(([h,t],i)=>`<article><em>${String(i+1).padStart(2,'0')}</em><span>${e(h)}</span><p>${e(t)}</p></article>`).join('')}</div>${d.games?.length?`<div class="v11-game-strip"><span>Игровые точки входа</span>${d.games.map(g=>`<i>${e(g)}</i>`).join('')}</div>`:''}</section>`;
  }
  const oldDetail=window.renderDetail;
  window.renderDetail=function(type,o){
    const r=oldDetail(type,o),page=q('#detailPage'),main=q('.detail-main',page);if(!main)return r;
    qa('.v11-guide',main).forEach(x=>x.remove());
    const d=GUIDE[`${type}:${o.id}`];if(d){const anchor=q('.v10-dossier',main)||q('.v9-matrix',main)||q('.intro-block',main);anchor?.insertAdjacentHTML('afterend',guideHtml(type,o));}
    q('.detail-aside',page)?.classList.add('v11-aside-safe');
    setTimeout(()=>hydrateBetterMedia(type,o,page),70);
    return r;
  };

  // ---------------------------------------------------------------------------
  // Better image selection — artwork first, symbols/models last.
  // ---------------------------------------------------------------------------
  const mediaCache=new Map();
  async function j(url){try{const r=await fetch(url);return r.ok?await r.json():null}catch{return null}}
  async function bestArtwork(type,o){
    if(!o)return null;const title=o.wikiTitle||o.en||o.name,key=`${type}:${title}`;if(mediaCache.has(key))return mediaCache.get(key);
    const kind=type==='character'?'character':type==='chapter'||type==='legion'?'chapter':type==='faction'?'faction':type==='location'?'location':'generic';
    const requests=[`/api/wiki-gallery?site=fandom&kind=${kind}&title=${encodeURIComponent(title)}`,`/api/wiki-gallery?site=lexicanum&kind=${kind}&title=${encodeURIComponent(title)}`];
    const [a,b]=await Promise.all(requests.map(j));const pool=[...(a?.items||[]),...(b?.items||[])].sort((x,y)=>(y.score||0)-(x.score||0));
    let m=pool.find(x=>(x.score||0)>0)||pool[0];if(!m){m=await j('/api/wiki-image?site=fandom&title='+encodeURIComponent(title))||await j('/api/wiki-image?site=lexicanum&title='+encodeURIComponent(title));}
    mediaCache.set(key,m||null);return m||null;
  }
  async function hydrateCardV11(card){
    if(card.dataset.v11media==='1')return;card.dataset.v11media='1';const type=card.dataset.detail,id=card.dataset.id;if(!['character','legion','chapter','faction'].includes(type))return;const o=record(type,id),art=q('.card-art',card);if(!o||!art)return;
    const m=await bestArtwork(type,o);if(!m?.src)return;const local=window.assetFor?.(type,o)||'/assets/imperium-city.jpg';
    art.style.backgroundImage=`linear-gradient(180deg,rgba(5,6,7,.03),rgba(12,13,14,.14) 54%,#0c0d0e 97%),url("${proxy(m.src)}"),url("${local}")`;
    art.style.backgroundSize='cover,cover,cover';art.style.backgroundPosition='center,center 22%,center';
    let badge=q('.v10-media-badge',card);if(!badge){badge=document.createElement('span');badge.className='v10-media-badge';card.appendChild(badge)}badge.textContent=(m.sourceName||'WIKI').toUpperCase().includes('FANDOM')?'FANDOM · ART':'LEXICANUM · ART';badge.title=m.fileTitle||m.source||'';
  }
  async function hydrateBetterMedia(type,o,page){
    if(!['character','legion','chapter','faction'].includes(type))return;const m=await bestArtwork(type,o);if(!m?.src)return;
    const hero=q('.detail-cinematic',page);if(hero){hero.style.setProperty('--hero',`url("${proxy(m.src)}")`);hero.classList.add('v11-hero-loaded');let link=q('.v11-image-credit',hero);if(!link){link=document.createElement('a');link.className='v11-image-credit';link.target='_blank';link.rel='noreferrer';hero.appendChild(link)}link.href=m.source||'#';link.textContent=`Иллюстрация: ${m.sourceName||'Wiki'} · ${m.fileTitle||o.name} ↗`;}
  }
  const mediaObs='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){mediaObs.unobserve(x.target);hydrateCardV11(x.target)}}),{rootMargin:'600px 0px'}):null;
  function watchMedia(){qa('.illustrated[data-detail][data-id]').forEach(c=>{if(c.dataset.v11watch)return;c.dataset.v11watch='1';mediaObs?mediaObs.observe(c):hydrateCardV11(c)})}
  new MutationObserver(watchMedia).observe(document.body,{childList:true,subtree:true});

  // ---------------------------------------------------------------------------
  // Device-aware performance and map readability.
  // ---------------------------------------------------------------------------
  function deviceClass(){document.body.classList.toggle('v11-compact-device',innerWidth<1100);document.body.classList.toggle('v11-phone',innerWidth<620)}
  addEventListener('resize',deviceClass,{passive:true});deviceClass();
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.body.classList.add('reduced-motion');

  // Close mobile menu after any navigation action.
  document.addEventListener('click',ev=>{if(innerWidth<=900&&ev.target.closest('[data-route],[data-detail]'))document.body.classList.remove('menu-open')});

  // Improve map zoom state without touching the data itself.
  const oldUpdate=window.updateMapTransform;
  if(oldUpdate)window.updateMapTransform=updateMapTransform=function(){const r=oldUpdate();const st=q('#galaxyStage');if(st){st.classList.toggle('v11-map-far',mapState.scale<(mapState.minScale||.6)*1.15);st.classList.toggle('v11-map-near',mapState.scale>1.25)}return r};

  window.addEventListener('load',()=>{watchMedia();deviceClass();if(window.updateMapTransform)window.updateMapTransform()});
})();
