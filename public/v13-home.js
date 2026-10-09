(function(){
  const body=document.body, root=document.documentElement;
  const themes={
    imperium:{label:'Империум',glyph:'✠',gold:'#d5b673',gold2:'#8e6c2c',red:'#9f2d25',red2:'#5c1713',themeColor:'#0b0b0c',hero:"url('/assets/terra-panorama.webp')"},
    chaos:{label:'Хаос',glyph:'✹',gold:'#c79b63',gold2:'#7b4c2d',red:'#b13a2f',red2:'#54110f',themeColor:'#0f0909',hero:"url('/assets/great-rift-panorama.webp')"},
    aeldari:{label:'Аэльдари',glyph:'◈',gold:'#9ec8c7',gold2:'#3d7d80',red:'#7e2a49',red2:'#3d1630',themeColor:'#071011',hero:"url('/assets/aeldari-craftworld.webp')"},
    necrons:{label:'Некроны',glyph:'⟡',gold:'#7ee1c2',gold2:'#27886e',red:'#356153',red2:'#17352d',themeColor:'#06100e',hero:"url('/assets/trazyn-hero.webp')"},
    orks:{label:'Орки',glyph:'☣',gold:'#b1c868',gold2:'#617b2a',red:'#8f2f23',red2:'#47160f',themeColor:'#0b0f08',hero:"url('/assets/orks-war.webp')"},
    tau:{label:'Т’ау',glyph:'◌',gold:'#8fd0de',gold2:'#2c89c7',red:'#275773',red2:'#143248',themeColor:'#091016',hero:"url('/assets/tau-empire.webp')"}
  };
  const routeArt={
    map:'/assets/galaxy-atlas.webp',characters:'/assets/lion-hero.webp',factions:'/assets/tyranid-invasion.webp',
    legions:'/assets/horus-hero.webp',chapters:'/assets/ultramarines-parade.webp',worlds:'/assets/terra-panorama.webp',
    organizations:'/assets/mechanicus-forge.webp',arsenal:'/assets/tau-empire.webp',timeline:'/assets/great-rift-panorama.webp'
  };
  const focus={
    imperium:[
      ['character','guilliman','PRIMARCH','Робут Жиллиман','Возвращение примарха стало одним из главных символов современной эры.','/assets/ultramarines-parade.webp'],
      ['location','terra','THRONEWORLD','Священная Терра','Политическое, религиозное и символическое сердце человечества.','/assets/terra-panorama.webp'],
      ['chapter','ultramarines-chapter','ADEPTUS ASTARTES','Ультрамарины','Удобная точка входа в организацию, культуру и доктрину Космодесанта.','/assets/ultramarines-parade.webp'],
      ['event','indomitus','ERA INDOMITUS','Крестовый поход Индомитус','Кампания, которая связала падение Кадии, возвращение Жиллимана и новый порядок M42.','/assets/great-rift-panorama.webp']
    ],
    chaos:[
      ['character','abaddon','WARMASTER','Абаддон Разоритель','Ключевая фигура Долгой войны и современной эпохи Хаоса.','/assets/horus-hero.webp'],
      ['location','eye-of-terror','WARP STORM','Око Ужаса','Разлом между реальностью и Варпом, определивший стратегию Чёрных крестовых походов.','/assets/great-rift-panorama.webp'],
      ['organization','black-legion','TRAITOR HOST','Чёрный Легион','Главная наследница сил Хоруса и политический центр войны предателей.','/assets/great-rift-panorama.webp'],
      ['event','fall-of-cadia','BLACK CRUSADE','Падение Кадии','Событие, открывшее Великую Трещину и изменившее всю стратегическую карту галактики.','/assets/great-rift-panorama.webp']
    ],
    aeldari:[
      ['character','eldrad','FARSEER','Эльдрад Ультран','Один из самых влиятельных провидцев современной истории аэльдари.','/assets/aeldari-craftworld.webp'],
      ['location','ulthwe','CRAFTWORLD','Ультвэ','Мир-корабль, существующий в постоянной близости к угрозам Варпа.','/assets/aeldari-craftworld.webp'],
      ['organization','aspect-shrines','ASPECT WARRIORS','Храмы Аспектов','Воинские пути аэльдари раскрывают философию, дисциплину и боевую культуру расы.','/assets/aeldari-craftworld.webp'],
      ['event','fall-aeldari','CIVILIZATIONAL COLLAPSE','Падение Аэльдари','Историческая катастрофа, из которой выросли современные ветви народа.','/assets/aeldari-craftworld.webp']
    ],
    necrons:[
      ['character','trazyn','OVERLORD','Тразин Бесконечный','Коллекционер истории, через которого удобно знакомиться с масштабом некронской цивилизации.','/assets/trazyn-hero.webp'],
      ['location','solemnace','TOMB WORLD','Солемнейс','Мир-музей, хранящий трофеи и живые фрагменты истории галактики.','/assets/trazyn-hero.webp'],
      ['organization','szarekhan','DYNASTY','Династия Сарехан','Возвращение Безмолвного Короля создаёт новый центр силы среди некронов.','/assets/trazyn-hero.webp'],
      ['event','pariah-nexus-war','WAR ZONE','Пария Нексус','Зона, где некронские технологии изменяют саму связь материи с Варпом.','/assets/trazyn-hero.webp']
    ],
    orks:[
      ['character','ghazghkull','WARBOSS','Газгкулл Трака','Главный современный символ великого орочьего Вааагха.','/assets/orks-war.webp'],
      ['location','armageddon','WAR WORLD','Армагеддон','Классический символ бесконечной войны Империума и орков.','/assets/orks-apocalypse.webp'],
      ['organization','goffs','ORK KLAN','Гоффы','Жёсткая и воинственная культура, максимально близкая к архетипу орочьей силы.','/assets/orks-apocalypse.webp'],
      ['event','third-armageddon','WAAAGH!','Третья война за Армагеддон','Один из самых узнаваемых конфликтов орочьей истории.','/assets/orks-war.webp']
    ],
    tau:[
      ['character','farsight','COMMANDER','Командор Фарсайт','Политический и военный контраст официальной идеологии Т’ау.','/assets/tau-empire.webp'],
      ['location','tau','SEPT REALM','Империя Т’ау','Молодая сила с иной философией войны, технологий и государственного устройства.','/assets/tau-sept.webp'],
      ['organization','farsight-enclaves','SEPARATIST REALM','Анклавы Фарсайта','Независимый политический полюс, выросший внутри культуры Т’ау.','/assets/tau-empire.webp'],
      ['event','damocles-crusade','IMPERIUM vs TAU','Дамоклов крестовый поход','Ключевой ранний конфликт между Империумом и Империей Т’ау.','/assets/tau-sept.webp']
    ]
  };
  const visual=[
    ['character','guilliman','Робут Жиллиман','Возвращение примарха как символ эпохи Индомитус.','/assets/ultramarines-parade.webp'],
    ['character','lion','Лев Эль’Джонсон','Вторая крупная линия возвращения примархов в M42.','/assets/lion-hero.webp'],
    ['location','terra','Священная Терра','Центр власти, религии и памяти Империума.','/assets/terra-panorama.webp'],
    ['location','pariah-nexus','Пария Нексус','Некронская зона, в которой сама природа Варпа оказывается под давлением.','/assets/trazyn-hero.webp'],
    ['event','horus-heresy','Ересь Хоруса','Историческая ось, без которой невозможно понять современный 40K.','/assets/great-rift-panorama.webp'],
    ['organization','black-legion','Чёрный Легион','Наследники предательства и главный двигатель Долгой войны.','/assets/great-rift-panorama.webp']
  ];
  const sources=[
    ['Warhammer / Games Workshop','https://www.warhammer.com/','Официальный вход в бренд: фракции, миниатюры и базовый контекст.'],
    ['Warhammer Community','https://www.warhammer-community.com/','Актуальные статьи, кампании, анонсы и редакторские материалы.'],
    ['Black Library','https://www.blacklibrary.com/','Романы и циклы, через которые глубже всего раскрываются персонажи и эпохи.'],
    ['Lexicanum','https://wh40k.lexicanum.com/','Строгая энциклопедическая структура и быстрые перекрёстные связи.'],
    ['Warhammer 40K Wiki / Fandom','https://warhammer40k.fandom.com/','Широкий охват тем и удобная навигация по связанной информации.'],
    ['Warhammer 40000 Wiki (RU)','https://warhammer40k.fandom.com/ru/wiki/Warhammer_40000_Wiki','Русскоязычная база для читателя, которому удобнее изучать лор на русском.']
  ];
  function svgFavicon(t){
    const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="'+t.gold+'"/><stop offset="100%" stop-color="'+t.gold2+'"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="#070809"/><rect x="5" y="5" width="54" height="54" rx="10" fill="none" stroke="url(#g)" stroke-width="1.7"/><circle cx="32" cy="32" r="20" fill="none" stroke="'+t.gold+'" opacity=".23"/><text x="32" y="40" text-anchor="middle" font-size="28" font-family="Georgia,serif" fill="'+t.gold+'">'+t.glyph+'</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  }
  function currentTheme(){return localStorage.getItem('imperiumArchiveHomeTheme')||'imperium'}
  function bind(el){
    if(!el||el.dataset.homeBound)return;
    el.dataset.homeBound='1';
    if(el.dataset.route)el.addEventListener('click',()=>{if(typeof setRoute==='function')setRoute(el.dataset.route)});
    if(el.dataset.detail)el.addEventListener('click',()=>{if(typeof openDetail==='function')openDetail(el.dataset.detail,el.dataset.id)});
  }
  function applyTheme(key){
    const t=themes[key]||themes.imperium;
    body.dataset.homeTheme=key;
    root.style.setProperty('--gold',t.gold);root.style.setProperty('--gold2',t.gold2);root.style.setProperty('--red',t.red);root.style.setProperty('--red2',t.red2);root.style.setProperty('--home-hero-art',t.hero);
    const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=t.themeColor;
    const fav=document.getElementById('siteFavicon');if(fav)fav.href=svgFavicon(t);
    const eagle=document.querySelector('.side-brand .eagle');if(eagle)eagle.textContent=t.glyph;
    const seal=document.querySelector('.hero-seal div');if(seal)seal.textContent=t.glyph;
    const picker=document.getElementById('homeThemePicker');if(picker)picker.value=key;
    document.querySelectorAll('[data-home-theme-chip]').forEach(x=>x.classList.toggle('active',x.dataset.homeThemeChip===key));
    localStorage.setItem('imperiumArchiveHomeTheme',key);renderFocus(key);
  }
  function addThemePicker(){
    if(document.getElementById('homeThemePicker'))return;
    const top=document.querySelector('.top-actions');if(!top)return;
    const lab=document.createElement('label');lab.className='home-theme-menu';
    lab.innerHTML='<span>Тема</span><select id="homeThemePicker">'+Object.entries(themes).map(([k,v])=>'<option value="'+k+'">'+v.label+'</option>').join('')+'</select>';
    top.insertBefore(lab,document.getElementById('openAssistant'));
    lab.querySelector('select').addEventListener('change',e=>applyTheme(e.target.value));
  }
  function decorateExisting(){
    document.querySelectorAll('#moduleGrid .module-card').forEach(card=>{
      if(card.querySelector('.home-card-art'))return;
      const art=routeArt[card.dataset.route]||'/assets/terra-panorama.webp';
      card.classList.add('home-visual');
      card.insertAdjacentHTML('afterbegin','<div class="home-card-art" style="background-image:linear-gradient(180deg,rgba(6,7,8,.06),rgba(6,7,8,.92)),url(\''+art+'\')"></div>');
    });
    document.querySelectorAll('#homeSpotlight .spot-card').forEach(card=>{
      if(card.querySelector('.home-card-art'))return;
      let art='/assets/terra-panorama.webp';
      try{const rec=typeof getRecord==='function'?getRecord(card.dataset.detail,card.dataset.id):null;if(rec&&typeof assetFor==='function')art=assetFor(card.dataset.detail,rec)}catch(e){}
      card.classList.add('home-visual');
      card.insertAdjacentHTML('afterbegin','<div class="home-card-art" style="background-image:linear-gradient(180deg,rgba(6,7,8,.06),rgba(6,7,8,.92)),url(\''+art+'\')"></div>');
    });
  }
  function after(selector,html,id){
    if(document.getElementById(id))return document.getElementById(id);
    const el=document.querySelector(selector);if(!el)return null;el.insertAdjacentHTML('afterend',html);return document.getElementById(id);
  }
  function buildSections(){
    after('#home .content-section.compact',
      '<section class="content-section compact" id="homeThemeFocus"><div class="section-heading"><div><p class="eyebrow">THEMATIC ENTRY POINT</p><h2>Погружение через выбранную фракцию</h2><p class="sublead">Главная меняет стартовую подборку и визуальный акцент под выбранную сторону конфликта.</p></div></div><div class="home-theme-strip" id="homeThemeStrip"></div><div class="home-focus-grid" id="homeFocusGrid"></div></section>','homeThemeFocus');
    after('#homeThemeFocus',
      '<section class="content-section compact" id="homeVisualArchive"><div class="section-heading"><div><p class="eyebrow">VISUAL ARCHIVE</p><h2>Визуальный вход в лор</h2><p class="sublead">Ключевые лица, миры и события, которые сразу показывают масштаб сеттинга.</p></div></div><div class="home-visual-grid" id="homeVisualGrid"></div></section>','homeVisualArchive');
    after('#homeVisualArchive',
      '<section class="content-section compact" id="homeStart"><div class="section-heading"><div><p class="eyebrow">BEGIN HERE</p><h2>С чего начать изучение 40K</h2></div></div><div class="home-start-grid"><button class="home-start-card" data-route="timeline"><span>1 / КОНТЕКСТ</span><h3>Понять историческую ось</h3><p>Начни с Ереси Хоруса, Великой Трещины и эпохи Индомитус. Так отдельные имена и войны перестают быть набором разрозненных терминов.</p><b>Открыть хронологию →</b></button><button class="home-start-card" data-route="factions"><span>2 / СТОРОНЫ</span><h3>Разобраться в фракциях</h3><p>Империум, Хаос, Аэльдари, Некроны, Орки, Тираниды и Т’ау имеют собственную логику, историю и эстетику.</p><b>Открыть фракции →</b></button><button class="home-start-card" data-route="characters"><span>3 / ЛЮДИ И МИФЫ</span><h3>Связать персонажей с мирами</h3><p>После знакомства с Жиллиманом, Абаддоном, Террой, Кадией и Макраггом большая часть сеттинга начинает складываться в понятную сеть.</p><b>Открыть персонажей →</b></button></div></section>','homeStart');
    after('#homeStart',
      '<section class="content-section compact" id="homeSources"><div class="section-heading"><div><p class="eyebrow">SOURCE NETWORK</p><h2>На что опирается архив</h2><p class="sublead">Фанатский проект должен показывать источники сразу, а не прятать их в конце.</p></div></div><div class="home-source-grid" id="homeSourceGrid"></div></section>','homeSources');
    const strip=document.getElementById('homeThemeStrip');
    if(strip&&!strip.children.length){
      strip.innerHTML=Object.entries(themes).map(([k,v])=>'<button class="home-theme-chip" data-home-theme-chip="'+k+'"><i>'+v.glyph+'</i><span>'+v.label+'</span></button>').join('');
      strip.querySelectorAll('button').forEach(x=>x.addEventListener('click',()=>applyTheme(x.dataset.homeThemeChip)));
    }
    const vg=document.getElementById('homeVisualGrid');
    if(vg&&!vg.children.length){
      vg.innerHTML=visual.map(v=>'<button class="home-visual-card" data-detail="'+v[0]+'" data-id="'+v[1]+'"><div class="art" style="background-image:linear-gradient(180deg,rgba(6,7,8,.08),rgba(6,7,8,.88)),url(\''+v[4]+'\')"></div><div class="copy"><span>CURATED VISUAL</span><h3>'+v[2]+'</h3><p>'+v[3]+'</p><b>Открыть запись →</b></div></button>').join('');
      vg.querySelectorAll('[data-detail]').forEach(bind);
    }
    const sg=document.getElementById('homeSourceGrid');
    if(sg&&!sg.children.length)sg.innerHTML=sources.map(s=>'<a class="home-source-card" href="'+s[1]+'" target="_blank" rel="noreferrer"><span>EXTERNAL SOURCE</span><h3>'+s[0]+'</h3><p>'+s[2]+'</p><b>Открыть источник ↗</b></a>').join('');
    document.querySelectorAll('#homeStart [data-route]').forEach(bind);
  }
  function renderFocus(key){
    const grid=document.getElementById('homeFocusGrid');if(!grid)return;
    grid.innerHTML=(focus[key]||focus.imperium).map(v=>'<button class="home-focus-card" data-detail="'+v[0]+'" data-id="'+v[1]+'"><div class="home-focus-art" style="background-image:url(\''+v[5]+'\')"><span class="home-image-source">CURATED / LOCAL</span></div><div class="home-focus-copy"><span>'+v[2]+'</span><h3>'+v[3]+'</h3><p>'+v[4]+'</p><q>'+v[4]+'</q><b>Открыть материал →</b></div></button>').join('');
    grid.querySelectorAll('[data-detail]').forEach(bind);
  }
  function init(){
    addThemePicker();decorateExisting();buildSections();
    document.querySelectorAll('#home [data-route],#home [data-detail]').forEach(bind);
    applyTheme(currentTheme());
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();