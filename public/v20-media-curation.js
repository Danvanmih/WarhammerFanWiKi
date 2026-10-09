(()=>{
  const BAD=[
    '/assets/guilliman-hero.jpg',
    '/assets/primarchs.jpg',
    '/assets/factions.jpg',
    '/assets/imperium-city.jpg',
    '/assets/galaxy-map.jpg',
    '/assets/chaos-rift.jpg',
    '/assets/macragge.jpg',
    '/assets/terra.jpg'
  ];
  const CLEAN_ROUTE={
    map:'/assets/galaxy-atlas.webp',
    characters:'/assets/lion-hero.webp',
    factions:'/assets/tyranid-invasion.webp',
    legions:'/assets/horus-hero.webp',
    chapters:'/assets/ultramarines-parade.webp',
    worlds:'/assets/terra-panorama.webp',
    organizations:'/assets/mechanicus-forge.webp',
    arsenal:'/assets/tau-empire.webp',
    timeline:'/assets/great-rift-panorama.webp'
  };
  const ROUTE_SOURCE={
    map:['https://jambonium.co.uk/40kmap/','CARTOGRAPHY REFERENCE'],
    characters:['https://www.warhammer-community.com/en-gb/articles/o8hfXHxy/40-years-of-warhammer-the-first-loyalist-primarch-in-warhammer-40000/','OFFICIAL CHARACTER LORE'],
    factions:['https://www.warhammer-community.com/en-gb/articles/VQFlu0K2/what-is-warhammer-40000/','OFFICIAL SETTING GUIDE'],
    legions:['https://www.warhammer-community.com/en-gb/articles/wyKMcChX/exploring-the-primarchs/','OFFICIAL PRIMARCH GUIDE'],
    chapters:['https://www.warhammer-community.com/en-gb/articles/qWz90QUl/warhammer-40000-faction-focus-space-marine-chapters/','OFFICIAL CHAPTER GUIDE'],
    worlds:['https://www.warhammer-community.com/en-gb/articles/faggbycw/saturnine-lore-focus-the-imperial-palace/','OFFICIAL WORLD LORE'],
    organizations:['https://www.warhammer-community.com/en-gb/articles/z2otEyWJ/warhammer-40000-faction-focus-adeptus-mechanicus/','OFFICIAL ORGANISATION GUIDE'],
    arsenal:['https://www.warhammer-community.com/en-gb/articles/escfijsw/the-land-raider-at-25-celebrating-the-iconic-warhammer-tank/','OFFICIAL ARSENAL FEATURE'],
    timeline:['https://www.warhammer-community.com/en-gb/topics/warhammer-the-horus-heresy/','OFFICIAL ERA GUIDE']
  };
  const CLEAN_ENTITY={
    'character:guilliman':'/assets/ultramarines-parade.webp',
    'character:lion':'/assets/lion-hero.webp',
    'character:sanguinius':'/assets/sanguinius-hero.webp',
    'character:abaddon':'/assets/horus-hero.webp',
    'character:eldrad':'/assets/aeldari-craftworld.webp',
    'character:trazyn':'/assets/trazyn-hero.webp',
    'character:ghazghkull':'/assets/orks-war.webp',
    'character:gazghkull':'/assets/orks-war.webp',
    'character:farsight':'/assets/tau-empire.webp',
    'location:terra':'/assets/terra-panorama.webp',
    'location:macragge':'/assets/macragge-panorama.webp',
    'location:commorragh':'/assets/drukhari-commorragh.webp',
    'location:ulthwe':'/assets/aeldari-craftworld.webp',
    'location:armageddon':'/assets/orks-apocalypse.webp',
    'location:pariah-nexus':'/assets/trazyn-hero.webp',
    'organization:black-legion':'/assets/great-rift-panorama.webp',
    'organization:goffs':'/assets/orks-apocalypse.webp',
    'organization:szarekhan':'/assets/trazyn-hero.webp',
    'organization:farsight-enclaves':'/assets/tau-empire.webp',
    'organization:aspect-shrines':'/assets/aeldari-craftworld.webp',
    'event:horus-heresy':'/assets/horus-hero.webp',
    'event:fall-of-cadia':'/assets/great-rift-panorama.webp',
    'event:fall-aeldari':'/assets/aeldari-craftworld.webp',
    'event:pariah-nexus-war':'/assets/trazyn-hero.webp',
    'event:third-armageddon':'/assets/orks-war.webp',
    'event:damocles-crusade':'/assets/tau-sept.webp',
    'event:indomitus':'/assets/great-rift-panorama.webp',
    'chapter:ultramarines-chapter':'/assets/ultramarines-parade.webp'
  };
  const bad=src=>BAD.some(x=>String(src||'').includes(x));
  function fallback(type,o){
    const id=o?.id||'';
    const key=type+':'+id;
    if(CLEAN_ENTITY[key])return CLEAN_ENTITY[key];
    const n=(o?.name||'').toLowerCase();
    if(type==='character'){
      if(['abaddon','ahriman','kharn','typhus','lucius','huron','honsou','iskandar-khayon'].includes(id)||String(o?.faction||'').toLowerCase().includes('chaos'))return'/assets/horus-hero.webp';
      if(['trazyn','orikan','imotekh','szeras','szarekh'].includes(id))return'/assets/trazyn-hero.webp';
      if(['farsight','shadowsun','aunva'].includes(id))return'/assets/tau-empire.webp';
      if(['eldrad','yvraine'].includes(id))return'/assets/aeldari-craftworld.webp';
      if(['vected','lelith'].includes(id))return'/assets/drukhari-commorragh.webp';
      if(['ghazghkull','gazghkull','makari'].includes(id))return'/assets/orks-war.webp';
      return'/assets/imperial-fists-siege.webp';
    }
    if(type==='legion')return o?.allegiance==='traitor'?'/assets/horus-hero.webp':'/assets/imperial-fists-siege.webp';
    if(type==='chapter'){
      if(o?.parentLegion==='ultramarines')return'/assets/ultramarines-parade.webp';
      if(o?.parentLegion==='blood-angels')return'/assets/sanguinius-hero.webp';
      if(o?.parentLegion==='dark-angels')return'/assets/lion-hero.webp';
      if(o?.parentLegion==='space-wolves')return'/assets/space-wolves-fenris.webp';
      return'/assets/imperial-fists-siege.webp';
    }
    if(type==='faction'){
      if(id==='orks')return'/assets/orks-war.webp';
      if(id==='tyranids'||id==='genestealer-cults')return'/assets/tyranids-war.webp';
      if(id==='tau')return'/assets/tau-empire.webp';
      if(id==='necrons')return'/assets/trazyn-hero.webp';
      if(id==='aeldari'||id==='ynnari')return'/assets/aeldari-craftworld.webp';
      if(id==='drukhari')return'/assets/drukhari-commorragh.webp';
      return String(o?.group||'').toLowerCase().includes('chaos')?'/assets/great-rift-panorama.webp':'/assets/imperial-fists-siege.webp';
    }
    if(type==='location'){
      if(id==='terra')return'/assets/terra-panorama.webp';
      if(id==='macragge'||id==='ultramar')return'/assets/macragge-panorama.webp';
      if(id==='commorragh')return'/assets/drukhari-commorragh.webp';
      if(/craftworld|ulthwe|iyanden|biel|saim|alaitoc/.test(id+n))return'/assets/aeldari-craftworld.webp';
      if(/mars|ryza|graia|forge/.test(id+n))return'/assets/mechanicus-forge.webp';
      if(/tau|farsight|damocles|taros/.test(id+n))return'/assets/tau-sept.webp';
      if(/baal/.test(id+n))return'/assets/sanguinius-hero.webp';
      if(/rift|eye-of-terror|разлом|око ужаса/.test(id+n))return'/assets/great-rift-panorama.webp';
      return'/assets/galaxy-atlas.webp';
    }
    if(type==='event'){
      if(/макраг|ультрамар|калт/.test(n))return'/assets/ultramarines-parade.webp';
      if(/баал|тира|улей|кракен|левиафан/.test(n))return'/assets/tyranid-invasion.webp';
      if(/армагед|орк|октари/.test(n))return'/assets/orks-apocalypse.webp';
      if(/тау|дамокл|тарос/.test(n))return'/assets/tau-sept.webp';
      if(/кади|разлом|ерес|хаос|чум|готи/.test(n))return'/assets/great-rift-panorama.webp';
      return'/assets/galaxy-atlas.webp';
    }
    if(type==='organization'){
      const h=JSON.stringify(o||{}).toLowerCase();
      if(/орк|goff|evil sun|bad moon|deathskull|blood axe|snakebite/.test(h))return'/assets/orks-apocalypse.webp';
      if(/tyranid|behemoth|kraken|leviathan|kronos|gorgon|jormungandr/.test(h))return'/assets/tyranid-invasion.webp';
      if(/aeldari|craftworld|ulth|iyanden|biel|saim|alaitoc/.test(h))return'/assets/aeldari-craftworld.webp';
      if(/drukhari|коммор/.test(h))return'/assets/drukhari-commorragh.webp';
      if(/тау|t’au|t'au|sept|farsight/.test(h))return'/assets/tau-sept.webp';
      if(/necron|некрон|dynasty/.test(h))return'/assets/trazyn-hero.webp';
      if(/mechanicus|механикус|titan/.test(h))return'/assets/mechanicus-forge.webp';
      if(/chaos|хаос|black legion|red corsair|plague|thousand sons/.test(h))return'/assets/great-rift-panorama.webp';
      return'/assets/terra-panorama.webp';
    }
    if(type==='arsenal'){
      if(/гаус|warscythe|некрон|blackstone|пилон/.test(n))return'/assets/trazyn-hero.webp';
      if(/pulse|crisis|тау|t’au|t'au/.test(n))return'/assets/tau-empire.webp';
      if(/carnifex|bio-titan|тира|био/.test(n))return'/assets/tyranids-war.webp';
      if(/stompa|орк/.test(n))return'/assets/orks-war.webp';
      return'/assets/imperial-fists-siege.webp';
    }
    return'/assets/galaxy-atlas.webp';
  }
  function installGlobalSanitizer(){
    const orig=window.assetFor;
    if(typeof orig==='function'&&!orig.__v20){
      const wrapped=function(type,o){const src=orig(type,o);return bad(src)?fallback(type,o):src};
      wrapped.__v20=true;
      window.assetFor=wrapped;
      try{assetFor=wrapped}catch{}
    }
    const origMedia=window.mediaFor;
    if(typeof origMedia==='function'&&!origMedia.__v20){
      const wrapped=function(type,o){
        const items=(origMedia(type,o)||[]).map(m=>bad(m?.src)?{...m,src:fallback(type,o),credit:'Imperium Archive · curated clean visual'}:m);
        const seen=new Set();
        return items.filter(m=>m?.src&&!seen.has(m.src)&&(seen.add(m.src),true));
      };
      wrapped.__v20=true;
      window.mediaFor=wrapped;
      try{mediaFor=wrapped}catch{}
    }
  }
  function setBg(el,src){
    if(!el||!src)return;
    el.style.backgroundImage="linear-gradient(180deg,rgba(5,7,8,.03),rgba(5,7,8,.18) 48%,rgba(5,7,8,.88) 100%),url('"+src+"')";
    el.style.backgroundSize='cover';
    el.style.backgroundRepeat='no-repeat';
  }
  function sourceTag(card,route){
    const cfg=ROUTE_SOURCE[route];if(!cfg||!card)return;
    let a=card.querySelector('.v20-source-link');
    if(!a){a=document.createElement('a');a.className='v20-source-link';a.target='_blank';a.rel='noreferrer';a.addEventListener('click',e=>e.stopPropagation());card.appendChild(a)}
    a.href=cfg[0];a.textContent=cfg[1]+' ↗';
  }
  function curateModules(){
    document.querySelectorAll('#moduleGrid .module-card').forEach(card=>{
      const route=card.dataset.route,src=CLEAN_ROUTE[route];if(!src)return;
      const art=card.querySelector('.home-card-art,.module-art');
      setBg(art,src);
      card.querySelectorAll('.home-remote-credit').forEach(x=>x.remove());
      sourceTag(card,route);
      card.dataset.v20Curated='1';
    });
  }
  function curateEntityCards(){
    document.querySelectorAll('#homeSpotlight [data-detail],#homeFocusGrid [data-detail],#homeVisualGrid [data-detail],#themeShowcaseGrid [data-detail],#homeGalleryGrid [data-detail]').forEach(card=>{
      const key=(card.dataset.detail||'')+':'+(card.dataset.id||'');
      const src=CLEAN_ENTITY[key];if(!src)return;
      setBg(card.querySelector('.home-card-art,.home-focus-art,.art,.spot-art'),src);
      card.querySelectorAll('.home-remote-credit').forEach(x=>x.remove());
      card.dataset.v20Curated='1';
    });
  }
  function scrubDirtyInline(root=document){
    root.querySelectorAll('[style*="/assets/"]').forEach(el=>{
      const style=el.getAttribute('style')||'';
      if(!BAD.some(x=>style.includes(x)))return;
      const card=el.closest('[data-detail][data-id],[data-route]');
      let src='';
      if(card?.dataset.route)src=CLEAN_ROUTE[card.dataset.route]||'';
      else if(card?.dataset.detail){
        const key=card.dataset.detail+':'+card.dataset.id;
        src=CLEAN_ENTITY[key]||'';
        if(!src&&typeof window.getRecord==='function'){
          try{const o=window.getRecord(card.dataset.detail,card.dataset.id);src=fallback(card.dataset.detail,o)}catch{}
        }
      }
      if(src)setBg(el,src);
    });
  }
  function apply(){installGlobalSanitizer();curateModules();curateEntityCards();scrubDirtyInline()}
  function init(){
    apply();
    setTimeout(apply,120);
    setTimeout(apply,650);
    new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['data-home-theme','data-theme']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();