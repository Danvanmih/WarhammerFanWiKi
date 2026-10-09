(()=>{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const L=window.LORE||{}, D=window.V10_DOSSIERS||{};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rec=(t,id)=>{try{return window.getRecord?window.getRecord(t,id):({character:L.characters,legion:L.legions,chapter:L.chapters,faction:L.factions}[t]||[]).find(x=>x.id===id)}catch{return null}};
const emp=(L.characters||[]).find(x=>x.id==='emperor');if(emp){emp.en='Emperor of Mankind';emp.wikiTitle='Emperor of Mankind';emp.mediaSite='lexicanum'}

const INFER={
  emperor:['imperial-household','Имперский двор'],
  malcador:['imperial-household','Имперский двор'],
  dante:['blood-angels-chapter','Кровавые Ангелы'],mephiston:['blood-angels-chapter','Кровавые Ангелы'],sanguinor:['blood-angels-chapter','Кровавые Ангелы'],
  helbrecht:['black-templars','Чёрные Храмовники'],grimaldus:['black-templars','Чёрные Храмовники'],
  trajann:['adeptus-custodes','Адептус Кустодес'],celestine:['adepta-sororitas','Адепта Сороритас'],morvenn:['adepta-sororitas','Адепта Сороритас'],
  eisenhorn:['inquisition','Инквизиция'],cawl:['mechanicus','Адептус Механикус'],yarrick:['astra-militarum','Астра Милитарум'],
  abaddon:['black-legion','Чёрный Легион'],huron:['red-corsairs','Красные Корсары'],'fabius-bile':['emperors-children','Дети Императора'],
  cypher:['fallen','Падшие / Непрощённые'],vashtorr:['chaos','Силы Хаоса'],
  ghazghkull:['goffs','Гоффы'],gazghkull:['goffs','Гоффы'],makari:['goffs','Гоффы'],
  szarekh:['szarekhan','Династия Сарехан'],imotekh:['sautekh','Династия Саутех'],trazyn:['nihilakh','Династия Нихилах'],orikan:['sautekh','Династия Саутех'],szeras:['necron-crypteks','Некронские криптеки'],
  farsight:['farsight-enclaves','Анклавы Фарсайта'],shadowsun:['tau-empire','Империя Т’ау'],aunva:['tau-empire','Империя Т’ау'],
  eldrad:['ulthwe','Ультвэ'],yvraine:['ynnari','Иннари'],vected:['black-heart','Кабал Чёрного Сердца'],lelith:['cult-of-strife','Культ Раздора']
};
const FC={
  all:{name:'Все',icon:'✦',c:'#b99a5e'},imperium:{name:'Империум',icon:'✠',c:'#d4b56b'},chaos:{name:'Хаос',icon:'✹',c:'#b8473e'},
  aeldari:{name:'Аэльдари',icon:'◈',c:'#82c3c0'},drukhari:{name:'Друкхари',icon:'◆',c:'#a15b9b'},orks:{name:'Орки',icon:'☣',c:'#9bb154'},
  necrons:{name:'Некроны',icon:'⟡',c:'#69caa4'},tau:{name:'Т’ау',icon:'◌',c:'#70b4cf'}
};
const ROLE={all:'Все роли',primarch:'Примархи',leader:'Командиры / правители',astartes:'Астартес',psyker:'Псайкеры / колдуны',inquisitor:'Инквизиция',custodes:'Кустодес',saint:'Святые',other:'Другие фигуры'};
const STATUS={all:'Любой статус',active:'Активные / действующие',dead:'Погибшие',unknown:'Пропавшие / неясно'};
let state={faction:'all',affiliation:'all',role:'all',status:'all',sort:'importance',view:localStorage.getItem('ia-char-view')||'cards',q:''};

function faction(o){const f=String(o.faction||'').toLowerCase();if(['chaos','chaos-marines'].includes(f))return'chaos';if(['aeldari','ynnari'].includes(f))return'aeldari';if(f==='drukhari')return'drukhari';if(f==='orks')return'orks';if(f==='necrons')return'necrons';if(f==='tau')return'tau';return'imperium'}
function affiliation(o){
  if(o.chapter){const x=rec('chapter',o.chapter);return{id:o.chapter,name:x?.name||o.chapter,kind:'chapter'}}
  if(o.legion){const x=rec('legion',o.legion);return{id:o.legion,name:x?.name||o.legion,kind:'legion'}}
  if(INFER[o.id])return{id:INFER[o.id][0],name:INFER[o.id][1],kind:'organization'};
  if(D['character:'+o.id])return{id:'primarchs',name:'Примархи',kind:'primarch'};
  const f=faction(o);return{id:f+'-other',name:f==='imperium'?'Другие силы Империума':f==='chaos'?'Иные силы Хаоса':'Прочие',kind:'other'}
}
function role(o){const s=((o.type||'')+' '+(o.title||'')).toLowerCase();if(D['character:'+o.id]||/примарх/.test(s))return'primarch';if(/псайкер|библиар|колдун|провид|хрономант|астромант|рунн/.test(s))return'psyker';if(/инквизитор/.test(s))return'inquisitor';if(/кустод/.test(s))return'custodes';if(/свят/.test(s))return'saint';if(/капитул|магистр|маршал|гранд-мастер|командир|фаэрон|король|владыка|архонт|аббатиса|капитан-генерал|воитель/.test(s))return'leader';if(/астартес|космодесант|капеллан|дредноут|берсерк|апостол|чемпион|варсмит|легионер/.test(s))return'astartes';return'other'}
function status(o){const s=String(o.status||'').toLowerCase();if(/погиб|мёртв|мертв|уничтож/.test(s))return'dead';if(/пропал|неизвест|неяс|спорн|неопредел/.test(s))return'unknown';return'active'}
function depth(o){return window.EXPANDED_LORE?.character?.[o.id]?.sections?.length||0}
function weight(o){let n=depth(o)*3+(o.connections?.length||0)*2+(D['character:'+o.id]?48:0);if(['emperor','abaddon','guilliman','lion','sanguinius','horus','szarekh','ghazghkull','eldrad'].includes(o.id))n+=35;return n}
function hay(o){return [o.name,o.en,o.title,o.type,o.summary,o.status,affiliation(o).name,(o.facts||[]).join(' ')].join(' ').toLowerCase()}
function filtered(){let a=(L.characters||[]).filter(o=>(state.faction==='all'||faction(o)===state.faction)&&(state.affiliation==='all'||affiliation(o).id===state.affiliation)&&(state.role==='all'||role(o)===state.role)&&(state.status==='all'||status(o)===state.status)&&(!state.q||hay(o).includes(state.q)));if(state.sort==='az')a.sort((a,b)=>a.name.localeCompare(b.name,'ru'));else if(state.sort==='lore')a.sort((a,b)=>depth(b)-depth(a)||a.name.localeCompare(b.name,'ru'));else a.sort((a,b)=>weight(b)-weight(a)||a.name.localeCompare(b.name,'ru'));return a}
function allAff(f=state.faction){const m=new Map();(L.characters||[]).filter(o=>f==='all'||faction(o)===f).forEach(o=>{const a=affiliation(o),v=m.get(a.id);m.set(a.id,{...a,count:(v?.count||0)+1})});return [...m.values()].sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,'ru'))}
function color(o){return FC[faction(o)]?.c||'#b99a5e'}

const mediaCache=new Map();
async function getMedia(o){const title=o.wikiTitle||o.en||o.name,site=o.mediaSite||'fandom',key=site+':'+title;if(mediaCache.has(key))return mediaCache.get(key);const get=async s=>{try{const r=await fetch('/api/wiki-image?site='+s+'&title='+encodeURIComponent(title));return r.ok?await r.json():null}catch{return null}};let m=await get(site);if(!m?.src)m=await get(site==='fandom'?'lexicanum':'fandom');mediaCache.set(key,m||null);return m}
const io='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);hydrateCard(e.target)}}),{rootMargin:'450px'}):null;
async function hydrateCard(card){if(card.dataset.mediaLoaded)return;card.dataset.mediaLoaded='1';const o=rec('character',card.dataset.id);if(!o)return;const m=await getMedia(o);if(!m?.src)return;const art=$('.card-art',card);if(!art)return;art.style.backgroundImage='linear-gradient(180deg,rgba(5,6,7,.02),rgba(13,15,16,.18) 54%,#0d0f10 98%),url("/api/media-proxy?url='+encodeURIComponent(m.src)+'"),url("'+(window.assetFor?.('character',o)||'/assets/imperium-city.jpg')+'")';art.style.backgroundSize='cover,cover,cover';art.style.backgroundPosition='center,center 18%,center';if(m.source&&!$('[data-v19-source]',card)){const b=document.createElement('span');b.className='v19-source';b.dataset.v19Source=m.source;b.textContent=(m.sourceName||'Wiki')+' · изображение ↗';art.appendChild(b)}}
function watchMedia(root){$$('.v19-character',root).forEach(c=>io?io.observe(c):hydrateCard(c));const e=$('.v19-character[data-id="emperor"]',root);if(e)hydrateCard(e)}

function card(o){const a=affiliation(o),r=role(o);return '<button class="v19-character illustrated" style="--ca:'+color(o)+'" data-detail="character" data-id="'+o.id+'"><div class="card-art" style="background-image:linear-gradient(180deg,transparent,#0d0f10),url(\''+(window.assetFor?.('character',o)||'/assets/imperium-city.jpg')+'\')"></div><div class="v19-copy"><div class="v19-badges"><span>'+esc(FC[faction(o)]?.name||'')+'</span><span>'+esc(a.name)+'</span></div><h3>'+esc(o.name)+'</h3><span class="v19-title">'+esc(o.title||o.type||'')+'</span><p>'+esc(o.summary||'')+'</p><div class="v19-foot"><span>'+esc(ROLE[r]||o.type||'')+' · '+esc(o.status||'')+'</span><b>'+depth(o)+' лор-разд. →</b></div></div></button>'}
function render(){
 const root=$('#characterGrid');if(!root)return;root.className='v19-directory '+(state.view==='compact'?'compact':'');
 const arr=filtered();const counter=$('#v19Count');if(counter)counter.textContent='Показано '+arr.length+' из '+(L.characters||[]).length;
 if(!arr.length){root.innerHTML='<div class="v19-empty"><b>Ничего не найдено</b><span>Измени фракцию, принадлежность или поисковый запрос.</span></div>';return}
 const groups=new Map();arr.forEach(o=>{const f=faction(o),a=affiliation(o);if(!groups.has(f))groups.set(f,new Map());const sub=groups.get(f);if(!sub.has(a.id))sub.set(a.id,{name:a.name,items:[]});sub.get(a.id).items.push(o)});
 const order=['imperium','chaos','aeldari','drukhari','orks','necrons','tau'];
 root.innerHTML=order.filter(k=>groups.has(k)).map(k=>{const subs=[...groups.get(k).values()].sort((a,b)=>b.items.length-a.items.length||a.name.localeCompare(b.name,'ru'));return '<section class="v19-group" style="--gc:'+FC[k].c+'"><header class="v19-group-head"><i></i><div><small>FACTION / PERSONAE</small><h3>'+FC[k].name+'</h3></div><span>'+subs.reduce((n,x)=>n+x.items.length,0)+' записей</span></header>'+subs.map(s=>'<div class="v19-subgroup"><div class="v19-subtitle"><b>'+esc(s.name)+'</b><small>'+s.items.length+'</small></div><div class="v19-card-grid">'+s.items.map(card).join('')+'</div></div>').join('')+'</section>'}).join('');
 watchMedia(root)
}
function refreshAff(){const s=$('#v19Affiliation');if(!s)return;const a=allAff();s.innerHTML='<option value="all">Все ордены / легионы / организации</option>'+a.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name)+' ('+x.count+')</option>').join('');if(!a.some(x=>x.id===state.affiliation))state.affiliation='all';s.value=state.affiliation;refreshLineages()}
function refreshLineages(){const p=$('#v19Astartes'),r=$('#v19Lineages');if(!p||!r)return;p.classList.toggle('visible',['all','imperium','chaos'].includes(state.faction));const a=allAff().filter(x=>x.kind==='chapter'||x.kind==='legion'||['black-templars','blood-angels-chapter','dark-angels-chapter','space-wolves-chapter','salamanders-chapter','raptors','red-scorpions','lamenters','black-legion','red-corsairs','fallen'].includes(x.id));r.innerHTML='<button class="v19-lineage '+(state.affiliation==='all'?'active':'')+'" data-lineage="all"><b>Все линии</b><small>Сбросить</small></button>'+a.map(x=>'<button class="v19-lineage '+(state.affiliation===x.id?'active':'')+'" data-lineage="'+esc(x.id)+'"><b>'+esc(x.name)+'</b><small>'+x.count+' персонаж.</small></button>').join('');$$('[data-lineage]',r).forEach(b=>b.onclick=()=>{state.affiliation=b.dataset.lineage;$('#v19Affiliation').value=state.affiliation;refreshLineages();render()})}
function install(){
 const page=$('#characters .content-section'),grid=$('#characterGrid');if(!page||!grid||$('#v19Root'))return;
 const old=$('#characterSearch');if(old){old.style.display='none';const sub=old.closest('.section-heading')?.querySelector('.sublead');if(sub)sub.textContent='Большой индекс героев, правителей, примархов, командиров, ксеносов и антагонистов. Навигация строится по фракции, ордену/легиону, роли и статусу.'}
 const counts={};for(const k of Object.keys(FC))counts[k]=k==='all'?(L.characters||[]).length:(L.characters||[]).filter(o=>faction(o)===k).length;
 const prim=(L.characters||[]).filter(o=>role(o)==='primarch').length,ast=(L.characters||[]).filter(o=>['primarch','astartes'].includes(role(o))).length,xen=(L.characters||[]).filter(o=>!['imperium','chaos'].includes(faction(o))).length;
 grid.insertAdjacentHTML('beforebegin','<div id="v19Root"><section class="v19-overview"><article><small>PERSONAE / DIRECTORY SYSTEM</small><h3>Не список имён, а карта действующих лиц</h3><p>Сначала выбери сторону конфликта, затем орден, легион или организацию. После этого можно сузить выбор до примархов, командиров, псайкеров, Астартес и других ролей. Такая структура рассчитана на дальнейший рост базы до сотен персонажей.</p></article><div class="v19-stats"><div><b>'+(L.characters||[]).length+'</b><span>персонажей</span></div><div><b>'+prim+'</b><span>примархов</span></div><div><b>'+ast+'</b><span>Астартес / примархов</span></div><div><b>'+xen+'</b><span>ксеносов</span></div></div></section><nav class="v19-factions" id="v19Factions">'+Object.entries(FC).map(([k,v])=>'<button class="v19-faction '+(k==='all'?'active':'')+'" style="--fc:'+v.c+'" data-faction="'+k+'"><i>'+v.icon+'</i><b>'+v.name+'</b><small>'+(counts[k]||0)+' записей</small></button>').join('')+'</nav><section class="v19-astartes" id="v19Astartes"><div class="v19-astartes-head"><div><small>ADEPTUS ASTARTES / TRAITOR LEGIONES</small><b>Ордена, легионы и генолинии</b></div><span>Быстрый переход к героям конкретной линии</span></div><div class="v19-lineages" id="v19Lineages"></div></section><div class="v19-toolbar"><div class="v19-search"><span>⌕</span><input id="v19Search" placeholder="Император, Данте, Тразин, Ариман..."></div><select id="v19Affiliation"></select><select id="v19Role">'+Object.entries(ROLE).map(([k,n])=>'<option value="'+k+'">'+n+'</option>').join('')+'</select><select id="v19Status">'+Object.entries(STATUS).map(([k,n])=>'<option value="'+k+'">'+n+'</option>').join('')+'</select><select id="v19Sort"><option value="importance">Сначала ключевые</option><option value="lore">Сначала самые подробные</option><option value="az">По алфавиту</option></select><div class="v19-view"><button data-view="cards" title="Карточки">▦</button><button data-view="compact" title="Компактно">☷</button></div></div><div class="v19-directory-head"><div><small>FILTERED PERSONAE</small><b>Каталог персонажей</b></div><div><span id="v19Count"></span> · <button class="v19-reset" id="v19Reset">Сбросить</button></div></div></div>');
 $$('[data-faction]').forEach(b=>b.onclick=()=>{state.faction=b.dataset.faction;state.affiliation='all';$$('[data-faction]').forEach(x=>x.classList.toggle('active',x===b));refreshAff();render()});
 $('#v19Search').oninput=e=>{state.q=e.target.value.trim().toLowerCase();render()};$('#v19Affiliation').onchange=e=>{state.affiliation=e.target.value;refreshLineages();render()};$('#v19Role').onchange=e=>{state.role=e.target.value;render()};$('#v19Status').onchange=e=>{state.status=e.target.value;render()};$('#v19Sort').onchange=e=>{state.sort=e.target.value;render()};
 $$('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===state.view);b.onclick=()=>{state.view=b.dataset.view;localStorage.setItem('ia-char-view',state.view);$$('[data-view]').forEach(x=>x.classList.toggle('active',x===b));render()}});
 $('#v19Reset').onclick=()=>{state={faction:'all',affiliation:'all',role:'all',status:'all',sort:'importance',view:state.view,q:''};$('#v19Search').value='';$('#v19Role').value='all';$('#v19Status').value='all';$('#v19Sort').value='importance';$$('[data-faction]').forEach(x=>x.classList.toggle('active',x.dataset.faction==='all'));refreshAff();render()};
 refreshAff();render()
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
new MutationObserver(()=>{if($('#characters .content-section')&&!$('#v19Root'))install()}).observe(document.body,{childList:true,subtree:true});
})();