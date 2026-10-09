(()=>{
  const svgUri=svg=>`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(String(svg).replace(/>\s+</g,'><').trim())}`;
  const EMBLEMS={
    chapter:{
      'ultramarines-chapter':svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#0f1720"/><path d="M27 22v33c0 13 9 22 23 22s23-9 23-22V22H60v31c0 8-4 13-10 13s-10-5-10-13V22H27z" fill="#f0c85d"/><path d="M27 55c0 18 11 29 23 29s23-11 23-29v15c0 18-11 30-23 30S27 88 27 70V55z" fill="#2d67d1" opacity=".95"/></svg>'),
      'dark-angels-chapter':svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#12231d"/><path d="M50 12l7 12h-4v40h-6V24h-4l7-12z" fill="#efe8d8"/><path d="M44 60l6 20 6-20z" fill="#b73936"/><path d="M23 41c9-15 18-18 24-16-8 8-12 16-13 28-7-1-11-5-11-12zM77 41c-9-15-18-18-24-16 8 8 12 16 13 28 7-1 11-5 11-12z" fill="#efe8d8"/></svg>'),
      'blood-angels-chapter':svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#1a0e10"/><path d="M50 18c10 12 16 21 16 31 0 11-7 18-16 18s-16-7-16-18c0-10 6-19 16-31z" fill="#bf2028"/><path d="M19 37c10-5 21-4 28 4-8 1-13 6-18 14-7-4-10-10-10-18zM81 37c-10-5-21-4-28 4 8 1 13 6 18 14 7-4 10-10 10-18z" fill="#f0e7d2"/></svg>'),
      'space-wolves-chapter':svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#1a2026"/><path d="M23 50l12-20 15 7 15-7 12 20-7 3-7-8-4 15H31l-4-15-7 8z" fill="#d4b566"/><path d="M39 63h22l-4 11H43z" fill="#f3eee3"/></svg>'),
      'imperial-fists-chapter':svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#161616"/><path d="M26 57V36h10v9h5V33h10v12h5V35h10v19c0 10-8 18-18 18H42c-9 0-16-7-16-15z" fill="#e8bf2f"/><path d="M40 72V58h20v14" fill="#d7a622"/></svg>'),
      'white-scars-chapter':svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#201314"/><path d="M56 16L30 55h15l-5 29 30-44H54z" fill="#eee8dd"/><path d="M63 22l8 8-37 47-6-5z" fill="#ba1f27" opacity=".85"/></svg>'),
      'salamanders-chapter':svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#101511"/><path d="M50 18c12 13 20 23 20 36 0 13-9 22-20 22S30 67 30 54c0-13 8-23 20-36z" fill="#2c8a55"/><path d="M50 30c6 7 9 13 9 20 0 6-4 10-9 10s-9-4-9-10c0-7 3-13 9-20z" fill="#f0b14c"/></svg>'),
      'raven-guard-chapter':svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#141619"/><path d="M20 50c14-16 28-23 44-21-10 7-16 15-18 24 11 1 21 7 34 19-22-4-40-3-60 1 8-8 13-15 15-23-6-1-10-1-15 0z" fill="#ececec"/></svg>'),
      'iron-hands-chapter':svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#111214"/><path d="M32 58V35h8v16h5V33h8v18h5V36h8v22c0 10-7 18-16 18H46c-8 0-14-6-14-14z" fill="#d8d8d8"/><path d="M30 70h40v8H30z" fill="#7e8488"/></svg>'),
      'black-templars':svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#141414"/><path d="M42 18h16v20h20v16H58v28H42V54H22V38h20z" fill="#ece7da"/><path d="M34 18h8v8h-8zm24 0h8v8h-8zm-24 56h8v8h-8zm24 0h8v8h-8z" fill="#bfa05a"/></svg>'),
      'crimson-fists':svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#13254d"/><path d="M26 57V36h10v9h5V33h10v12h5V35h10v19c0 10-8 18-18 18H42c-9 0-16-7-16-15z" fill="#b9242d"/><path d="M40 72V58h20v14" fill="#911c23"/></svg>')
    },
    faction:{
      imperium:svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#111315"/><path d="M50 18l7 14h16l-11 11 5 17-17-8-17 8 5-17-11-11h16z" fill="#d8bc6a"/><path d="M50 42v34" stroke="#f1ead5" stroke-width="5"/><path d="M39 58h22" stroke="#f1ead5" stroke-width="5"/></svg>'),
      chaos:svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#151112"/><path d="M50 18l6 18 19-10-10 19 18 5-18 5 10 19-19-10-6 18-6-18-19 10 10-19-18-5 18-5-10-19 19 10z" fill="#b13a35"/></svg>'),
      orks:svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#151712"/><path d="M24 61l18-30 9 13 13-16 12 26-13 17H36z" fill="#6aa04b"/><path d="M36 56l11-9 7 8 13-11" stroke="#0f110e" stroke-width="5" fill="none"/></svg>'),
      tau:svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#12171d"/><circle cx="50" cy="46" r="16" fill="none" stroke="#c7b792" stroke-width="7"/><path d="M50 14v18M32 70h36M50 62v18" stroke="#c7b792" stroke-width="7" stroke-linecap="round"/></svg>'),
      necrons:svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#0f1314"/><path d="M50 18l12 14v14l-12 10-12-10V32z" fill="none" stroke="#8fd1b2" stroke-width="5"/><path d="M50 56v24M38 70h24" stroke="#8fd1b2" stroke-width="5" stroke-linecap="round"/></svg>'),
      tyranids:svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#141216"/><path d="M50 20c11 9 16 18 16 29 0 13-7 23-16 31-9-8-16-18-16-31 0-11 5-20 16-29z" fill="#b78ed8"/><path d="M50 33v35M40 48l10 10 10-10" stroke="#201625" stroke-width="5" fill="none" stroke-linecap="round"/></svg>'),
      aeldari:svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#11161a"/><path d="M50 18c14 10 20 22 20 34 0 17-9 24-20 30-11-6-20-13-20-30 0-12 6-24 20-34z" fill="none" stroke="#5ab7d5" stroke-width="5"/><circle cx="50" cy="48" r="7" fill="#5ab7d5"/></svg>'),
      drukhari:svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#171117"/><path d="M50 16l18 18-8 34H40l-8-34z" fill="none" stroke="#c8c2de" stroke-width="5"/><path d="M41 44h18" stroke="#c8c2de" stroke-width="5"/></svg>'),
      admech:svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#151212"/><circle cx="50" cy="50" r="16" fill="none" stroke="#d6d6d6" stroke-width="6"/><path d="M50 24v12M50 64v12M24 50h12M64 50h12M33 33l8 8M59 59l8 8M67 33l-8 8M41 59l-8 8" stroke="#b63a36" stroke-width="5" stroke-linecap="round"/></svg>'),
      mechanicus:svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#151212"/><circle cx="50" cy="50" r="16" fill="none" stroke="#d6d6d6" stroke-width="6"/><path d="M50 24v12M50 64v12M24 50h12M64 50h12M33 33l8 8M59 59l8 8M67 33l-8 8M41 59l-8 8" stroke="#b63a36" stroke-width="5" stroke-linecap="round"/></svg>')
    }
  };

  const badImg=s=>/(placeholder|default-avatar|noimage|blank\.png|wiki\.png|article-placeholder|Portrait_Placeholder)/i.test(String(s||''));
  const safeEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const emblemFor=(type,id)=>EMBLEMS[type]?.[id]||'';
  const relLink=(type,id,label)=>`<a class="relation-link" href="#${type}/${id}" data-detail="${type}" data-id="${id}"><span>${safeEsc(label||getRecord(type,id)?.name||id)}</span><b>→</b></a>`;
  const relationBlock=(title, items)=>items.length?`<article><h3>${safeEsc(title)}</h3><div class="relation-list">${items.map(i=>relLink(i[0],i[1],i[2])).join('')}</div></article>`:'';

  const originalAssetFor = assetFor;
  assetFor = function(type,o){
    if(type==='character'){
      if(o?.id==='lion') return '/assets/lion-hero.webp';
      if(o?.id==='horus') return '/assets/horus-hero.webp';
      if(o?.id==='sanguinius') return '/assets/sanguinius-hero.webp';
    }
    return originalAssetFor(type,o);
  };

  function applyChapterEmblems(){
    document.querySelectorAll('#chapterGrid .chapter-card[data-id]').forEach(card=>{
      const id=card.dataset.id, em=emblemFor('chapter',id), crest=card.querySelector('.chapter-crest');
      if(!crest || !em || crest.dataset.deepDone==='1') return;
      crest.dataset.deepDone='1';
      const b=crest.querySelector('b'); if(b) b.remove();
      const img=document.createElement('img'); img.className='crest-emblem'; img.alt=''; img.src=em; crest.appendChild(img);
    });
  }

  function applyFactionEmblems(){
    document.querySelectorAll('#factionGrid .archive-card[data-id]').forEach(card=>{
      const id=card.dataset.id, em=emblemFor('faction',id), sig=card.querySelector('.sigil');
      if(!sig || !em || sig.dataset.deepDone==='1') return;
      sig.dataset.deepDone='1'; sig.classList.add('sigil-art'); sig.innerHTML='';
      const img=document.createElement('img'); img.alt=''; img.src=em; sig.appendChild(img);
    });
  }

  function cleanupPlaceholderMedia(root=document){
    root.querySelectorAll('img').forEach(img=>{
      const src=img.getAttribute('src')||'';
      if(badImg(src)){
        const fig=img.closest('figure');
        if(fig) fig.remove();
      }
    });
  }

  const originalRenderChapters=renderChapters;
  renderChapters=function(...args){ const r=originalRenderChapters.apply(this,args); applyChapterEmblems(); return r; };
  const originalRenderFactions=renderFactions;
  renderFactions=function(...args){ const r=originalRenderFactions.apply(this,args); applyFactionEmblems(); return r; };

  const originalFitMap=fitMap;
  fitMap=function(){
    const viewport=document.getElementById('galaxyViewport');
    const stage=document.getElementById('galaxyStage');
    if(!viewport||!stage) return originalFitMap();
    const r=viewport.getBoundingClientRect();
    if(!r.width) return;
    const base=Math.min(r.width/1200,r.height/780);
    mapState.minScale=base;
    mapState.scale=base;
    mapState.x=(r.width-1200*mapState.scale)/2;
    mapState.y=(r.height-780*mapState.scale)/2;
    updateMapTransform();
  };
  zoomMap=function(delta,cx=viewport.clientWidth/2,cy=viewport.clientHeight/2){
    const old=mapState.scale;
    const min=mapState.minScale||0.4;
    const next=Math.max(min,Math.min(3.2,old*delta));
    const wx=(cx-mapState.x)/old, wy=(cy-mapState.y)/old;
    mapState.scale=next; mapState.x=cx-wx*next; mapState.y=cy-wy*next; updateMapTransform();
  };

  function autoSection(title,text){
    return `<section class="detail-block prose-block lore-section deep-added"><h2>${safeEsc(title)}</h2><p>${safeEsc(text)}</p></section>`;
  }

  function buildCuratedHtml(type,o){
    const blocks=[];
    const add=(title,items)=>{ if(items.length) blocks.push(relationBlock(title,items)); };
    if(type==='faction' && o.id==='imperium'){
      add('Примархи и верховные фигуры',['emperor','guilliman','lion','sanguinius','rogal-dorn','leman-russ','jaghatai','ferrus-manus','vulkan','corax'].filter(id=>getRecord('character',id)).map(id=>['character',id]));
      add('Адептус Астартес',['ultramarines-chapter','dark-angels-chapter','blood-angels-chapter','space-wolves-chapter','imperial-fists-chapter','black-templars','salamanders-chapter','raven-guard-chapter'].filter(id=>getRecord('chapter',id)).map(id=>['chapter',id]));
      add('Институты Империума',L.organizations.filter(x=>(x.connections||[]).some(c=>c[0]==='faction'&&c[1]==='imperium')).slice(0,8).map(x=>['organization',x.id]));
    }
    if(type==='chapter'){
      const leg=o.parentLegion && byId(L.legions,o.parentLegion);
      add('Генетическая линия', [leg?.primarch&&['character',leg.primarch], leg&&['legion',leg.id], ['chapter',o.id]].filter(Boolean));
      add('Герои ордена', L.characters.filter(c=>c.chapter===o.id).slice(0,8).map(c=>['character',c.id]));
      add('Кампании и узловые события', eventRelations(type,o).slice(0,6).map(ev=>['event',ev.id]));
    }
    if(type==='legion'){
      add('Путь примарха',[o.primarch&&['character',o.primarch],['legion',o.id],...L.chapters.filter(c=>c.parentLegion===o.id).slice(0,6).map(c=>['chapter',c.id])].filter(Boolean));
      add('Командиры и наследники', L.characters.filter(c=>c.legion===o.id).slice(0,8).map(c=>['character',c.id]));
    }
    if(type==='character' && /примарх/i.test(String(o.type||'')) && o.legion){
      add('Путь примарха', [['character',o.id], ['legion',o.legion], ...L.chapters.filter(c=>c.parentLegion===o.legion).slice(0,6).map(c=>['chapter',c.id])]);
      add('Связанные командиры', L.characters.filter(c=>c.legion===o.legion && c.id!==o.id).slice(0,8).map(c=>['character',c.id]));
    }
    if(!blocks.length) return '';
    return `<section class="detail-block curated-pathways deep-added"><div class="block-head"><div><p class="eyebrow">CURATED PATHS</p><h2>Пути чтения и связи</h2></div><small>Больше глубины по уже существующим темам, без лишнего разрастания вширь.</small></div><div class="curated-grid">${blocks.join('')}</div></section>`;
  }

  function buildDepthHtml(type,o){
    const rel=findRelations(type,o), evs=eventRelations(type,o), worlds=worldRelations(type,o);
    const parts=[];
    if(type==='character'){
      parts.push(autoSection('Положение в истории', `${o.name} относится к категории «${o.type||'персонаж'}». Запись важна не только сама по себе: она связана с ${o.legion?`легионом «${byId(L.legions,o.legion)?.name||o.legion}»`:o.chapter?`орденом «${byId(L.chapters,o.chapter)?.name||o.chapter}»`:'военной или политической структурой'}, ${o.faction?`фракцией «${byId(L.factions,o.faction)?.name||o.faction}»`:'общим историческим контекстом'} и эпохой ${o.era||'без точного указания'}.`));
      parts.push(autoSection('Связанные линии и конфликты', `Миры: ${worlds.slice(0,4).map(w=>w.name).join(', ')||'данные уточняются'}. События: ${evs.slice(0,4).map(e=>e.name).join(', ')||'нет явных кампаний в краткой карточке'}. Другие фигуры: ${rel.filter(x=>x[0]==='character').slice(0,5).map(x=>relationLabel(x[0],x[1])).join(', ')||'ключевые связи пока минимальны'}.`));
    }
    if(type==='chapter'){
      parts.push(autoSection('Рекрутирование и культура', `Основание: ${o.founding||'не установлено'}. База: ${o.home||'не указана'}. Генетическая линия: ${o.parentLegion?byId(L.legions,o.parentLegion)?.name||o.parentLegion:'особая или неизвестная'}. Для ордена важны не только сражения, но и ритуалы, рекрутские традиции, отношение к Codex Astartes и собственная память о примархе.`));
      parts.push(autoSection('Практическая роль в архиве', `Через запись удобно изучать конкретный срез Астартес: героев ордена (${rel.filter(x=>x[0]==='character').slice(0,4).map(x=>relationLabel(x[0],x[1])).join(', ')||'не указаны'}), родственные события (${evs.slice(0,4).map(e=>e.name).join(', ')||'крупные кампании не перечислены'}) и связанные миры (${worlds.slice(0,4).map(w=>w.name).join(', ')||'база и походные зоны не раскрыты'}).`));
    }
    if(type==='legion'){
      parts.push(autoSection('Военная идентичность', `${o.name} — ${o.allegiance==='traitor'?'предательский':'лояльный'} легион эпохи Великого крестового похода. Родной мир / база: ${o.home||'не указана'}. Значение записи в том, что через неё читается и эпоха Великого крестового похода, и то, как именно Ересь Хоруса изменила будущее этой генетической линии.`));
      parts.push(autoSection('Наследие после Ереси', `Даже после распада легионов их доктрина продолжает жить через ордена-наследники, миф о примархе и войны, в которых повторяются старые сильные и слабые стороны.`));
    }
    if(type==='faction'){
      parts.push(autoSection('Структура влияния', `Фракция «${o.name}» читается не через один тезис, а через сеть институтов, командиров, миров и войн. Группа: ${o.group||'не указана'}. Именно поэтому ниже вынесены не только общие связи, но и тематические пути чтения.`));
      parts.push(autoSection('Ключевые фронты', `Персонажи: ${rel.filter(x=>x[0]==='character').slice(0,5).map(x=>relationLabel(x[0],x[1])).join(', ')||'список формируется'}. Организации: ${rel.filter(x=>x[0]==='organization').slice(0,5).map(x=>relationLabel(x[0],x[1])).join(', ')||'нет явных подструктур'}. Миры и события дают более точную картину, чем короткий общий абзац.`));
    }
    return parts.join('');
  }

  const originalRenderDetail=renderDetail;
  renderDetail=function(type,o){
    const out=originalRenderDetail(type,o);
    const page=document.getElementById('detail');
    const main=page.querySelector('.detail-main');
    if(!main) return out;
    main.querySelectorAll('.deep-added').forEach(n=>n.remove());
    page.querySelectorAll('.detail-aside .detail-block h2').forEach(h2=>{
      if(h2.textContent.trim()==='Быстрые переходы') h2.textContent='Выверенные переходы';
    });
    if(type==='chapter'){
      const heraldry=main.querySelector('.chapter-heraldry');
      const em=emblemFor('chapter',o.id);
      if(heraldry && em && !heraldry.querySelector('img')){
        const old=heraldry.querySelector('b'); if(old) old.remove();
        const img=document.createElement('img'); img.className='crest-emblem crest-emblem-large'; img.alt=''; img.src=em; heraldry.appendChild(img);
      }
    }
    const anchor=main.querySelector('.lineage-flow-block') || main.querySelector('.chapter-lineage-block') || main.querySelector('.detail-hero');
    if(anchor){
      anchor.insertAdjacentHTML('afterend', buildCuratedHtml(type,o)+buildDepthHtml(type,o));
    }
    cleanupPlaceholderMedia(page);
    return out;
  };

  const obs=new MutationObserver(()=>cleanupPlaceholderMedia(document));
  window.addEventListener('load',()=>{
    applyFactionEmblems();
    applyChapterEmblems();
    cleanupPlaceholderMedia(document);
    obs.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
    if(document.getElementById('map')?.classList.contains('active-page')) fitMap();
  });
})();
