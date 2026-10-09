(function(){
  const THEME_IMAGE_SOURCES={
    imperium:{page:'https://www.warhammer-community.com/en-gb/topics/space-marines/',label:'Warhammer Community · Space Marines'},
    chaos:{page:'https://www.warhammer-community.com/en-gb/topics/chaos-space-marines/',label:'Warhammer Community · Chaos Space Marines'},
    aeldari:{page:'https://www.warhammer-community.com/en-gb/topics/aeldari/',label:'Warhammer Community · Aeldari'},
    necrons:{page:'https://www.warhammer-community.com/en-gb/topics/necrons/',label:'Warhammer Community · Necrons'},
    orks:{page:'https://www.warhammer-community.com/en-gb/topics/orks/',label:'Warhammer Community · Orks'},
    tau:{page:'https://www.warhammer-community.com/en-gb/topics/tau-empire/',label:"Warhammer Community · T'au Empire"}
  };
  const ROUTE_IMAGE_SOURCES={
    map:'https://www.warhammer-community.com/en-gb/topics/warhammer-40000/',
    characters:'https://www.warhammer-community.com/en-gb/topics/space-marines/',
    factions:'https://www.warhammer-community.com/en-gb/topics/warhammer-40000/',
    legions:'https://www.warhammer-community.com/en-gb/topics/warhammer-the-horus-heresy/',
    chapters:'https://www.warhammer-community.com/en-gb/topics/space-marines/',
    worlds:'https://www.warhammer-community.com/en-gb/topics/warhammer-40000/',
    organizations:'https://www.warhammer-community.com/en-gb/topics/warhammer-40000/',
    arsenal:'https://www.warhammer-community.com/en-gb/topics/warhammer-40000/',
    timeline:'https://www.warhammer-community.com/en-gb/topics/warhammer-the-horus-heresy/'
  };
  const ENTITY_IMAGE_SOURCES={
    'character:guilliman':'https://www.warhammer-community.com/en-gb/topics/space-marines/',
    'character:lion':'https://www.warhammer-community.com/en-gb/topics/dark-angels/',
    'character:abaddon':'https://www.warhammer-community.com/en-gb/topics/chaos-space-marines/',
    'character:eldrad':'https://www.warhammer-community.com/en-gb/topics/aeldari/',
    'character:trazyn':'https://www.warhammer-community.com/en-gb/topics/necrons/',
    'character:ghazghkull':'https://www.warhammer-community.com/en-gb/topics/orks/',
    'character:farsight':'https://www.warhammer-community.com/en-gb/topics/tau-empire/',
    'location:terra':'https://www.warhammer-community.com/en-gb/topics/warhammer-40000/',
    'location:armageddon':'https://www.warhammer-community.com/en-gb/topics/orks/',
    'location:ulthwe':'https://www.warhammer-community.com/en-gb/topics/aeldari/',
    'location:solemnace':'https://www.warhammer-community.com/en-gb/topics/necrons/',
    'location:pariah-nexus':'https://www.warhammer-community.com/en-gb/topics/necrons/',
    'organization:black-legion':'https://www.warhammer-community.com/en-gb/topics/chaos-space-marines/',
    'organization:goffs':'https://www.warhammer-community.com/en-gb/topics/orks/',
    'organization:szarekhan':'https://www.warhammer-community.com/en-gb/topics/necrons/',
    'organization:farsight-enclaves':'https://www.warhammer-community.com/en-gb/topics/tau-empire/',
    'organization:aspect-shrines':'https://www.warhammer-community.com/en-gb/topics/aeldari/',
    'event:horus-heresy':'https://www.warhammer-community.com/en-gb/topics/warhammer-the-horus-heresy/',
    'event:fall-of-cadia':'https://www.warhammer-community.com/en-gb/topics/chaos-space-marines/',
    'event:fall-aeldari':'https://www.warhammer-community.com/en-gb/topics/aeldari/',
    'event:pariah-nexus-war':'https://www.warhammer-community.com/en-gb/topics/necrons/',
    'event:third-armageddon':'https://www.warhammer-community.com/en-gb/topics/orks/',
    'event:damocles-crusade':'https://www.warhammer-community.com/en-gb/topics/tau-empire/',
    'event:indomitus':'https://www.warhammer-community.com/en-gb/topics/warhammer-40000/',
    'chapter:ultramarines-chapter':'https://www.warhammer-community.com/en-gb/topics/space-marines/'
  };
  const MEDIA={
    cinematics:[
      {
        kind:'youtube',url:'https://www.youtube.com/watch?v=fIYcmYGSMog',
        fallbackTitle:'No Peace Amongst the Stars — официальный cinematic trailer',
        fallbackAuthor:'Warhammer 40,000',authorUrl:'https://www.youtube.com/@OfficialWarhammer40000',
        note:'Официальный короткий cinematic-трейлер по Warhammer 40,000. Хорошая визуальная точка входа в атмосферу сеттинга.',
        badge:'OFFICIAL CINEMATIC'
      },
      {
        kind:'youtube',url:'https://www.youtube.com/watch?v=g1ATSF2dUtU',
        fallbackTitle:'Warhammer 40,000: Mechanicus II — Launch Trailer',
        fallbackAuthor:'Warhammer',authorUrl:'https://www.youtube.com/@officialwarhammer',
        note:'Официальный трейлер игры с Адептус Механикус и Некронами — сильный пример визуального языка двух фракций.',
        badge:'OFFICIAL GAME TRAILER'
      }
    ],
    lore:[
      {
        kind:'youtube',url:'https://www.youtube.com/watch?v=M6M9-oFEKpk',
        fallbackTitle:"WTF IS WARHAMMER 40K? — Beginner's Guide",
        fallbackAuthor:'Luetin09',authorUrl:'https://www.youtube.com/@Luetin09',
        note:'Большой вводный разбор для новичка: Империум, ксеносы, Хаос и основные фракции.',
        badge:'COMMUNITY LORE'
      },
      {
        kind:'youtube',url:'https://www.youtube.com/watch?v=KyPjE1Sn-Ts',
        fallbackTitle:'The Emperor of Man — The Rise of Humanity',
        fallbackAuthor:'Luetin09',authorUrl:'https://www.youtube.com/@Luetin09',
        note:'Длинный исторический разбор ранней истории человечества, Императора и Великого крестового похода.',
        badge:'COMMUNITY LORE'
      },
      {
        kind:'youtube',url:'https://www.youtube.com/watch?v=lYCDDEn2AY4',
        fallbackTitle:'Warhammer 40,000 Expert Answers Your Questions',
        fallbackAuthor:'IGN · guest: Arbitor Ian',authorUrl:'https://www.youtube.com/@IGN',
        creatorUrl:'https://www.youtube.com/@ArbitorIan',
        creatorLabel:'Arbitor Ian',
        note:'Формат вопросов и ответов по лору с Arbitor Ian — удобно для читателя, который уже знает базовые термины.',
        badge:'COMMUNITY / Q&A'
      }
    ],
    games:[
      {
        kind:'youtube',url:'https://www.youtube.com/watch?v=g1ATSF2dUtU',
        fallbackTitle:'Warhammer 40,000: Mechanicus II — Launch Trailer',
        fallbackAuthor:'Warhammer',authorUrl:'https://www.youtube.com/@officialwarhammer',
        note:'Тактическая игра о конфликте Механикус и Некронов.',
        badge:'GAME'
      },
      {
        kind:'youtube',url:'https://www.youtube.com/watch?v=9gIMZ0WyY88',
        fallbackTitle:'Warhammer 40,000: Mechanicus — Teaser Trailer',
        fallbackAuthor:'Kasedo Games',authorUrl:'https://www.youtube.com/@KasedoGames',
        note:'Оригинальный визуальный тон первой Mechanicus — религия технологии, гробницы и некронская угроза.',
        badge:'GAME'
      }
    ],
    books:[
      {
        kind:'source',url:'https://www.blacklibrary.com/warhammer-40000/',
        title:'Black Library · Warhammer 40,000',
        note:'Основной официальный каталог художественной литературы по 40K.',
        badge:'BOOKS / AUDIO'
      },
      {
        kind:'source',url:'https://www.blacklibrary.com/the-horus-heresy',
        title:'Black Library · The Horus Heresy',
        note:'Книги и аудио по Ереси Хоруса и связанным событиям M31.',
        badge:'HORUS HERESY'
      },
      {
        kind:'source',url:'https://www.blacklibrary.com/new-titles',
        title:'Black Library · New & Exclusive',
        note:'Новые и актуальные релизы издательства Games Workshop.',
        badge:'NEW RELEASES'
      }
    ],
    art:[
      {
        kind:'source',url:'https://www.warhammer-community.com/en-gb/topics/space-marines/',
        title:'Space Marines · Official visual feed',note:'Официальный тематический раздел с актуальными изображениями, статьями и видео.',badge:'OFFICIAL ART'
      },
      {
        kind:'source',url:'https://www.warhammer-community.com/en-gb/topics/chaos-space-marines/',
        title:'Chaos Space Marines · Official visual feed',note:'Тематический поток по Еретикам Астартес и силам Хаоса.',badge:'OFFICIAL ART'
      },
      {
        kind:'source',url:'https://www.warhammer-community.com/en-gb/topics/aeldari/',
        title:'Aeldari · Official visual feed',note:'Официальная визуальная подборка и статьи по аэльдари.',badge:'OFFICIAL ART'
      },
      {
        kind:'source',url:'https://www.warhammer-community.com/en-gb/topics/necrons/',
        title:'Necrons · Official visual feed',note:'Официальные материалы по некронам, династиям и персонажам.',badge:'OFFICIAL ART'
      },
      {
        kind:'source',url:'https://www.warhammer-community.com/en-gb/topics/orks/',
        title:'Orks · Official visual feed',note:'Официальные материалы по оркам, Waaagh! и актуальным релизам.',badge:'OFFICIAL ART'
      },
      {
        kind:'source',url:'https://www.warhammer-community.com/en-gb/topics/tau-empire/',
        title:"T'au Empire · Official visual feed",note:"Официальные материалы по T'au, боекостюмам и новым кампаниям.",badge:'OFFICIAL ART'
      }
    ]
  };

  const cache=new Map();
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];
  function proxy(src){return '/api/media-proxy?url='+encodeURIComponent(src)}
  async function preview(page){
    if(cache.has(page))return cache.get(page);
    const task=fetch('/api/source-preview?url='+encodeURIComponent(page)).then(r=>r.ok?r.json():null).catch(()=>null);
    cache.set(page,task);return task;
  }
  function credit(parent,page,label){
    if(!parent||parent.querySelector('.home-remote-credit'))return;
    const a=document.createElement('a');a.className='home-remote-credit';a.href=page;a.target='_blank';a.rel='noreferrer';
    a.textContent=(label||'Источник изображения')+' ↗';parent.appendChild(a);
  }
  async function hydrateBg(el,page,label){
    if(!el||!page)return;
    const data=await preview(page);if(!data?.src)return;
    el.style.backgroundImage="linear-gradient(180deg,rgba(6,7,8,.06),rgba(6,7,8,.90)),url('"+proxy(data.src)+"')";
    el.dataset.remoteSource='1';
    credit(el.parentElement||el,page,label||data.sourceName);
  }
  async function hydrateHero(){
    const key=document.body.dataset.homeTheme||localStorage.getItem('imperiumArchiveHomeTheme')||'imperium';
    const cfg=THEME_IMAGE_SOURCES[key]||THEME_IMAGE_SOURCES.imperium;
    const data=await preview(cfg.page);if(!data?.src)return;
    document.documentElement.style.setProperty('--home-hero-art',"url('"+proxy(data.src)+"')");
    let a=q('.hero .home-hero-credit');
    if(!a){
      a=document.createElement('a');a.className='home-hero-credit';a.target='_blank';a.rel='noreferrer';
      q('#home .hero')?.appendChild(a);
    }
    if(a){a.href=cfg.page;a.textContent=cfg.label+' · изображение ↗'}
  }
  function hydrateHomeArt(){
    qa('#moduleGrid .module-card').forEach(card=>{
      const art=q('.home-card-art',card),page=ROUTE_IMAGE_SOURCES[card.dataset.route];hydrateBg(art,page,'Warhammer Community');
    });
    qa('#homeSpotlight .spot-card,#homeFocusGrid [data-detail],#homeVisualGrid [data-detail]').forEach(card=>{
      const key=(card.dataset.detail||'')+':'+(card.dataset.id||'');
      const page=ENTITY_IMAGE_SOURCES[key];if(!page)return;
      const art=q('.home-card-art,.home-focus-art,.art',card);hydrateBg(art,page,'Warhammer Community');
    });
  }
  function youtubeCard(item,index){
    const id='media-youtube-'+index+'-'+Math.random().toString(36).slice(2,7);
    return '<article class="media-hub-card media-youtube" id="'+id+'" data-youtube="'+item.url+'">'+
      '<a class="media-thumb" href="'+item.url+'" target="_blank" rel="noreferrer"><div class="media-thumb-fallback">▶</div><span>'+item.badge+'</span></a>'+
      '<div class="media-card-copy"><small class="media-author">'+item.fallbackAuthor+'</small><h3>'+item.fallbackTitle+'</h3><p>'+item.note+'</p>'+
      '<div class="media-actions"><a class="watch" href="'+item.url+'" target="_blank" rel="noreferrer">Смотреть на YouTube ↗</a>'+
      '<a class="author" href="'+item.authorUrl+'" target="_blank" rel="noreferrer">Автор / канал ↗</a>'+
      (item.creatorUrl?'<a class="creator" href="'+item.creatorUrl+'" target="_blank" rel="noreferrer">'+item.creatorLabel+' ↗</a>':'')+
      '</div></div></article>';
  }
  function sourceCard(item,index){
    const id='media-source-'+index+'-'+Math.random().toString(36).slice(2,7);
    return '<article class="media-hub-card media-source" id="'+id+'" data-source-page="'+item.url+'">'+
      '<a class="media-thumb" href="'+item.url+'" target="_blank" rel="noreferrer"><div class="media-thumb-fallback">✦</div><span>'+item.badge+'</span></a>'+
      '<div class="media-card-copy"><small class="media-author">External source</small><h3>'+item.title+'</h3><p>'+item.note+'</p>'+
      '<div class="media-actions"><a class="watch" href="'+item.url+'" target="_blank" rel="noreferrer">Открыть источник ↗</a></div></div></article>';
  }
  async function hydrateYoutube(card){
    const url=card.dataset.youtube;if(!url)return;
    const r=await fetch('/api/youtube-oembed?url='+encodeURIComponent(url)).catch(()=>null);if(!r?.ok)return;
    const d=await r.json().catch(()=>null);if(!d)return;
    const thumb=q('.media-thumb',card);if(thumb&&d.thumbnailUrl)thumb.style.backgroundImage="linear-gradient(180deg,rgba(5,6,7,.02),rgba(5,6,7,.46)),url('"+d.thumbnailUrl+"')";
    const title=q('h3',card);if(title&&d.title)title.textContent=d.title;
    const author=q('.media-author',card);if(author&&d.authorName)author.textContent=d.authorName;
    const authorLink=q('.media-actions .author',card);if(authorLink&&d.authorUrl)authorLink.href=d.authorUrl;
  }
  async function hydrateSourceCard(card){
    const page=card.dataset.sourcePage;if(!page)return;const d=await preview(page);if(!d?.src)return;
    const thumb=q('.media-thumb',card);if(thumb)thumb.style.backgroundImage="linear-gradient(180deg,rgba(5,6,7,.02),rgba(5,6,7,.54)),url('"+proxy(d.src)+"')";
    const author=q('.media-author',card);if(author)author.textContent=d.sourceName||'External source';
  }
  function mediaSection(){
    if(q('#homeMediaHub'))return;
    const anchor=q('#homeVisualArchive')||q('#homeThemeFocus')||q('#home .split-home');if(!anchor)return;
    anchor.insertAdjacentHTML('afterend',
      '<section class="content-section compact home-media-hub" id="homeMediaHub">'+
      '<div class="section-heading"><div><p class="eyebrow">MEDIA / VOX-ARCHIVE</p><h2>Медиа по Warhammer 40,000</h2><p class="sublead">Официальные синематики, видео по лору, игры, Black Library и визуальные источники. Видео и изображения не перезаливаются: архив подтягивает метаданные, превью и всегда оставляет ссылку на оригинал и автора.</p></div></div>'+
      '<div class="media-tabs" id="homeMediaTabs">'+
      '<button class="active" data-media-tab="cinematics">Синематики</button><button data-media-tab="lore">Лор / YouTube</button><button data-media-tab="games">Игры</button><button data-media-tab="books">Книги / аудио</button><button data-media-tab="art">Арт / визуал</button>'+
      '</div><div class="media-hub-grid" id="homeMediaGrid"></div>'+
      '<div class="media-ethics"><span>ATTRIBUTION PROTOCOL</span><p>Каждая карточка ведёт к оригинальному видео, странице или каналу. Превью YouTube загружаются через официальные метаданные oEmbed, изображения — с исходных страниц через серверный preview-parser.</p></div>'+
      '</section>');
    qa('#homeMediaTabs [data-media-tab]').forEach(b=>b.addEventListener('click',()=>{
      qa('#homeMediaTabs button').forEach(x=>x.classList.toggle('active',x===b));renderMedia(b.dataset.mediaTab);
    }));
    renderMedia('cinematics');
  }
  function renderMedia(cat){
    const grid=q('#homeMediaGrid');if(!grid)return;const items=MEDIA[cat]||[];
    grid.innerHTML=items.map((x,i)=>x.kind==='youtube'?youtubeCard(x,i):sourceCard(x,i)).join('');
    qa('.media-youtube',grid).forEach(hydrateYoutube);qa('.media-source',grid).forEach(hydrateSourceCard);
  }
  function watchTheme(){
    let last='';
    const sync=()=>{const k=document.body.dataset.homeTheme||'imperium';if(k===last)return;last=k;setTimeout(()=>{hydrateHero();hydrateHomeArt()},0)};
    sync();new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-home-theme']});
  }
  function init(){mediaSection();hydrateHomeArt();watchTheme()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();