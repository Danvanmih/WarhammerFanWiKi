(()=>{
const V=window.IA_V13;if(!V)return;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let lang=localStorage.getItem('ia-lang')||'ru';
let theme=localStorage.getItem('ia-theme')||'imperium';
const tx=(x)=>typeof x==='string'?x:(x?.[lang]||x?.ru||x?.en||'');

// Fix all self-references globally, including records with accidental self-connections.
const oldFindRelationsV13=window.findRelations||findRelations;
window.findRelations=findRelations=function(type,o){return oldFindRelationsV13(type,o).filter(x=>!(x[0]===type&&x[1]===o.id));};

// Fix event self-references globally.
window.eventRelations=eventRelations=function(type,o){
 const names=[o.name,o.en].filter(Boolean).map(x=>String(x).toLowerCase());
 if(type==='character'){const last=String(o.name||'').split(/\s+/).pop();if(last&&last.length>4)names.push(last.toLowerCase())}
 return L.events.filter(ev=>{
   if(type==='event'&&ev.id===o.id)return false;
   if((ev.connections||[]).some(x=>x[0]===type&&x[1]===o.id))return true;
   const hay=JSON.stringify(ev).toLowerCase();
   return names.some(n=>n.length>4&&hay.includes(n));
 }).slice(0,12);
};

const ui={
 ru:{home:'Главная',map:'Карта галактики',factions:'Фракции',characters:'Персонажи',legions:'Легионы',chapters:'Ордена Астартес',worlds:'Миры и регионы',organizations:'Организации',arsenal:'Техника и оружие',timeline:'Хронология',search:'Поиск',settings:'Оформление',language:'Язык',theme:'Тема архива',close:'Закрыть',chronicle:'Хроника галактики',chronicleLead:'От древней Войны в Небесах до М42 — последовательный маршрут, по которому можно получить цельную картину лора.',read:'Читать эпоху',sources:'Видео и источники',keywords:'Ключевые понятия',events:'Связанные статьи',sourceNote:'Видео здесь — вторичный обзорный материал. Канон лучше сверять с кодексами, кампейнбуками, Black Library и официальными публикациями.'},
 en:{home:'Home',map:'Galaxy Map',factions:'Factions',characters:'Characters',legions:'Legions',chapters:'Astartes Chapters',worlds:'Worlds & Regions',organizations:'Organisations',arsenal:'Arsenal & Technology',timeline:'Chronology',search:'Search',settings:'Appearance',language:'Language',theme:'Archive Theme',close:'Close',chronicle:'Galactic Chronicle',chronicleLead:'From the ancient War in Heaven to M42 — a guided route designed to give a coherent overview of the setting.',read:'Read era',sources:'Video & Sources',keywords:'Key concepts',events:'Related records',sourceNote:'Videos are secondary overview material. For canon details, check codexes, campaign books, Black Library and official publications.'}
};
const T=k=>ui[lang]?.[k]||ui.ru[k]||k;

function installSettings(){
 if($('#iaSettings'))return;
 const actions=$('.top-actions'); if(!actions)return;
 const btn=document.createElement('button');btn.className='archive-settings-btn';btn.id='archiveSettingsBtn';btn.innerHTML='⚙ <span>'+T('settings')+'</span>';actions.prepend(btn);
 const panel=document.createElement('div');panel.id='iaSettings';panel.className='ia-settings';panel.innerHTML=`<div class="ia-settings-head"><div><small>COGITATOR PREFS</small><h3>${T('settings')}</h3></div><button data-settings-close>×</button></div><label><span>${T('language')}</span><select id="iaLanguage"><option value="ru">Русский</option><option value="en">English</option></select></label><label><span>${T('theme')}</span><select id="iaTheme"><optgroup label="Archive"><option value="imperium">Imperium Archive</option></optgroup><optgroup label="Legiones Astartes">${Object.entries(V.themes).filter(([k])=>!['imperium','tau','orks','aeldari','drukhari','necrons','tyranids'].includes(k)).map(([k,v])=>`<option value="${k}">${esc(v.name)}</option>`).join('')}</optgroup><optgroup label="Xenos">${['tau','orks','aeldari','drukhari','necrons','tyranids'].map(k=>`<option value="${k}">${esc(V.themes[k].name)}</option>`).join('')}</optgroup></select></label><div class="ia-theme-preview"><i></i><b id="iaThemeName"></b><small>THEME MATRIX // VISUAL PROFILE</small></div><p>${lang==='ru'?'Тема меняет не только цвет: фон, свечение, рамки, паттерны и декоративный ритм интерфейса подстраиваются под выбранную генолинию или ксенос-фракцию.':'Themes change the background, glow, borders, pattern language and decorative rhythm—not just the accent colour.'}</p>`;
 document.body.appendChild(panel);
 btn.onclick=()=>panel.classList.toggle('open');panel.querySelector('[data-settings-close]').onclick=()=>panel.classList.remove('open');
 $('#iaLanguage').value=lang;$('#iaTheme').value=theme;
 $('#iaLanguage').onchange=e=>{lang=e.target.value;localStorage.setItem('ia-lang',lang);applyLanguage();renderTimeline();refreshSettings();};
 $('#iaTheme').onchange=e=>{theme=e.target.value;localStorage.setItem('ia-theme',theme);applyTheme();};
 refreshSettings();
}
function refreshSettings(){const p=$('#iaSettings');if(!p)return;p.querySelector('h3').textContent=T('settings');p.querySelectorAll('label span')[0].textContent=T('language');p.querySelectorAll('label span')[1].textContent=T('theme');const b=$('#archiveSettingsBtn span');if(b)b.textContent=T('settings');}
function applyTheme(){
 const v=V.themes[theme]||V.themes.imperium;document.body.dataset.theme=theme;document.body.dataset.pattern=v.pattern||'aquila';
 document.documentElement.style.setProperty('--theme-accent',v.accent);document.documentElement.style.setProperty('--theme-accent2',v.accent2);document.documentElement.style.setProperty('--theme-bg',`url("${v.bg}")`);document.documentElement.style.setProperty('--gold',v.accent);document.documentElement.style.setProperty('--red',v.accent2);
 const name=$('#iaThemeName');if(name)name.textContent=v.name;const prev=$('.ia-theme-preview');if(prev){prev.style.setProperty('--preview',`url("${v.bg}")`);prev.style.setProperty('--pa',v.accent);prev.style.setProperty('--pb',v.accent2)}
}
function applyLanguage(){
 document.documentElement.lang=lang;
 const labels={home:'home',map:'map',factions:'factions',characters:'characters',legions:'legions',chapters:'chapters',worlds:'worlds',organizations:'organizations',arsenal:'arsenal',timeline:'timeline'};
 Object.entries(labels).forEach(([route,key])=>{const s=$(`[data-route="${route}"] span`,$('.side-nav'));if(s)s.textContent=T(key)});
 const search=$('#globalSearchBtn span');if(search)search.textContent=T('search');
 const pageTitles={map:['Карта галактики','Galaxy Map'],factions:['Фракции','Factions'],characters:['Персонажи','Characters'],legions:['Легионы Астартес','Astartes Legions'],chapters:['Ордена Космодесанта','Space Marine Chapters'],worlds:['Миры и регионы','Worlds & Regions'],organizations:['Организации','Organisations'],arsenal:['Техника и оружие','Technology & Weapons']};
 Object.entries(pageTitles).forEach(([id,pair])=>{const h=$(`#${id} .section-heading h2`);if(h)h.textContent=lang==='ru'?pair[0]:pair[1]});
 const ph={factionSearch:['Поиск фракции...','Search factions...'],characterSearch:['Поиск персонажа...','Search characters...'],chapterSearch:['Black Templars, Кровавые Вороны...','Black Templars, Blood Ravens...'],worldSearch:['Кадия, Баал, Сота, Терра...','Cadia, Baal, Sotha, Terra...'],organizationSearch:['Поиск организации...','Search organisations...'],arsenalSearch:['Болтер, Warlord, Crisis...','Bolter, Warlord, Crisis...'],globalSearchInput:['Поиск по персонажам, мирам, легионам, оружию...','Search characters, worlds, legions, weapons...']};
 Object.entries(ph).forEach(([id,pair])=>{const el=$('#'+id);if(el)el.placeholder=lang==='ru'?pair[0]:pair[1]});
 const active=$('.page.active-page')?.id;if(active&&active!=='detail'&&$('#currentSection'))$('#currentSection').textContent=(lang==='ru'?ui.ru[labels[active]]:ui.en[labels[active]])||$('#currentSection').textContent;
 refreshSettings();
}

function videoCard(v){return `<a class="chron-video" href="${v.url}" target="_blank" rel="noreferrer"><img src="${v.thumb}" alt=""><span><small>${esc(v.lang)} · YOUTUBE · ${esc(v.channel)}</small><b>${esc(v.title)}</b><p>${esc(lang==='ru'?v.ru:v.ru)}</p></span><em>↗</em></a>`}
function eventLinks(ids,current=null){return (ids||[]).filter(id=>id!==current).map(id=>{const e=getRecord('event',id);return e?`<button data-detail="event" data-id="${id}"><span>${esc(e.date||'')}</span><b>${esc(e.name)}</b><em>→</em></button>`:''}).join('')}
window.renderTimeline=renderTimeline=function(){
 const root=$('#timelineList'); if(!root)return;
 const videoIds=['wish','luetin1','luetin2','arbitorHeresy','alpharius'];
 root.innerHTML=`<div class="chronicle-shell"><aside class="chronicle-index"><div><small>CHRONOLOGICA</small><b>${T('chronicle')}</b><p>${T('chronicleLead')}</p></div><nav>${V.eras.map((e,i)=>`<button data-chron-jump="${e.id}"><span>${String(i+1).padStart(2,'0')}</span><b>${esc(tx(e.title))}</b><small>${esc(e.period)}</small></button>`).join('')}</nav></aside><div class="chronicle-main"><section class="chronicle-intro"><span class="chronicle-sigil">⌛</span><div><p class="eyebrow">GALACTIC HISTORY / GUIDED READING</p><h2>${T('chronicle')}</h2><p>${T('chronicleLead')}</p><div class="chronicle-stats"><span><b>${V.eras.length}</b>${lang==='ru'?' крупных эпох':' major eras'}</span><span><b>${L.events.length}</b>${lang==='ru'?' связанных событий':' linked events'}</span><span><b>М42</b>${lang==='ru'?' текущая эпоха':' current era'}</span></div></div></section><section class="chron-media"><div class="block-head"><div><p class="eyebrow">${T('sources')}</p><h2>${lang==='ru'?'Смотреть и слушать параллельно':'Watch alongside the archive'}</h2></div></div><div class="chron-video-grid">${videoIds.map(k=>videoCard(V.YT[k])).join('')}</div><p class="chron-source-note">${T('sourceNote')}</p></section>${V.eras.map((e,i)=>`<article class="chron-era" id="chron-${e.id}" style="--era:${e.color};--era-art:url('${e.art}')"><div class="chron-era-art"></div><header><div class="chron-number">${String(i+1).padStart(2,'0')}</div><div><small>${esc(e.period)}</small><h2>${esc(tx(e.title))}</h2><p>${esc(tx(e.lead))}</p></div></header><div class="chron-body">${tx(e.body).split(/\n\n/).map(p=>`<p>${esc(p)}</p>`).join('')}</div><div class="chron-meta"><section><small>${T('keywords')}</small><div class="chron-tags">${e.key.map(k=>`<span>${esc(k)}</span>`).join('')}</div></section><section><small>${T('events')}</small><div class="chron-event-links">${eventLinks(e.eventIds)}</div></section></div>${e.videos?.length?`<div class="chron-era-videos">${e.videos.map(k=>videoCard(V.YT[k])).join('')}</div>`:''}</article>`).join('')}</div></div>`;
 $$('[data-chron-jump]',root).forEach(b=>b.onclick=()=>$('#chron-'+b.dataset.chronJump)?.scrollIntoView({behavior:'smooth',block:'start'}));
};

// Decorate event detail without referring to itself.
const oldRenderDetail=window.renderDetail;
if(oldRenderDetail){window.renderDetail=renderDetail=function(type,o){const r=oldRenderDetail(type,o);if(type==='event'){const page=$('#detailPage');$$('[data-detail="event"]',page).forEach(btn=>{if(btn.dataset.id===o.id)btn.remove()});const blocks=$$('.relation-list,.related-grid,.event-strip',page);blocks.forEach(b=>{if(!b.children.length)b.closest('.detail-block')?.remove()});} translateDetailShell();return r;}}
function translateDetailShell(){if(lang!=='en')return;const map={'Кто это и почему важен':'Who this is and why they matter','Контекст записи':'Record context','История и этапы':'History and stages','Ключевые факты':'Key facts','События и кампании':'Events and campaigns','Связанные записи':'Related records','Иллюстративные материалы':'Visual archive','Что читать дальше':'Further reading','Краткая карточка':'Quick dossier','Миры и регионы':'Worlds and regions','Источники и проверка':'Sources and verification','Быстрые переходы':'Quick links'};$$('#detailPage h2').forEach(h=>{if(map[h.textContent.trim()])h.textContent=map[h.textContent.trim()]});}

const oldSetRouteV13=window.setRoute;
if(oldSetRouteV13){window.setRoute=setRoute=function(route,updateHash=true){const r=oldSetRouteV13(route,updateHash);if(route!=='detail'){const k={home:'home',map:'map',factions:'factions',characters:'characters',legions:'legions',chapters:'chapters',worlds:'worlds',organizations:'organizations',arsenal:'arsenal',timeline:'timeline'}[route];if(k&&$('#currentSection'))$('#currentSection').textContent=T(k).toUpperCase()}return r;}}
function ensureInitialRefresh(){renderTimeline();applyLanguage();applyTheme();const h=location.hash.match(/^#event\/(.+)$/);if(h)setTimeout(()=>openDetail('event',h[1]),20)}
installSettings();ensureInitialRefresh();
})();
