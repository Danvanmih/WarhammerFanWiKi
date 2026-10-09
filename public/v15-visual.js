(()=>{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const V=window.IA_V13||{};
const fallback={
  imperium:{name:'Imperium Archive',accent:'#d1b36b',accent2:'#8d2420',pattern:'aquila'},
  chaos:{name:'Chaos',accent:'#b04a3d',accent2:'#68110e',pattern:'blood'},
  aeldari:{name:'Aeldari',accent:'#8cc5c1',accent2:'#6c345e',pattern:'runes'},
  necrons:{name:'Necrons',accent:'#71d7b1',accent2:'#246c58',pattern:'glyphs'},
  orks:{name:'Orks',accent:'#a9be62',accent2:'#6f241c',pattern:'checks'},
  tau:{name:"T'au",accent:'#8bcbd8',accent2:'#2b698e',pattern:'circles'}
};
const themes=Object.keys(V.themes||{}).length?V.themes:fallback;
const glyphs={imperium:'✠',chaos:'✹',aeldari:'◈',drukhari:'◆',necrons:'⟡',orks:'☣',tau:'◌',tyranids:'⌁'};
function glyph(k){return glyphs[k]||(/^blood|angel|flesh/.test(k)?'◆':/^ultra|imperial|fist/.test(k)?'✠':'✦')}
function current(){return localStorage.getItem('ia-theme')||document.body.dataset.theme||'imperium'}
function currentLang(){return localStorage.getItem('ia-lang')||'ru'}
function syncLegacyTheme(key){
  localStorage.setItem('ia-theme',key);
  const old=$('#iaTheme');if(old){old.value=key;old.dispatchEvent(new Event('change',{bubbles:true}))}
  const h=$('#themePicker,#homeThemePicker');if(h&&[...h.options].some(o=>o.value===key)){h.value=key;h.dispatchEvent(new Event('change',{bubbles:true}))}
  const v=themes[key]||fallback.imperium;
  document.body.dataset.theme=key;
  document.body.dataset.pattern=v.pattern||document.body.dataset.pattern||'aquila';
  if(v.accent)document.documentElement.style.setProperty('--theme-accent',v.accent);
  if(v.accent2)document.documentElement.style.setProperty('--theme-accent2',v.accent2);
  if(v.bg){
    document.documentElement.style.setProperty('--theme-bg','url("'+v.bg+'")');
    document.documentElement.style.setProperty('--home-hero-art','url("'+v.bg+'")');
  }
  document.documentElement.style.setProperty('--gold',v.accent||'#d1b36b');
  document.documentElement.style.setProperty('--red',v.accent2||'#8d2420');
  updateActive();
}
function setLang(lang){
  localStorage.setItem('ia-lang',lang);
  const old=$('#iaLanguage');if(old){old.value=lang;old.dispatchEvent(new Event('change',{bubbles:true}))}
  updateActive();
}
function close(){const p=$('#v15AppearancePanel'),t=$('#v15AppearanceToggle');if(p)p.hidden=true;if(t)t.setAttribute('aria-expanded','false')}
function updateActive(){
  const key=current(),lang=currentLang(),v=themes[key]||fallback.imperium;
  const n=$('#v15CurrentTheme');if(n)n.textContent=v.name||key;
  const g=$('#v15CurrentGlyph');if(g)g.textContent=glyph(key);
  $$('[data-v15-theme]').forEach(b=>b.classList.toggle('active',b.dataset.v15Theme===key));
  $$('[data-v15-lang]').forEach(b=>b.classList.toggle('active',b.dataset.v15Lang===lang));
}
function install(){
  if($('#v15Appearance'))return;
  const actions=$('.top-actions');if(!actions)return;
  const wrap=document.createElement('div');wrap.id='v15Appearance';
  const cards=Object.entries(themes).map(([k,v])=>'<button type="button" class="v15-theme-card" data-v15-theme="'+k+'"><i>'+glyph(k)+'</i><b>'+String(v.name||k).replace(/</g,'&lt;')+'</b><small>'+String(v.pattern||'archive').toUpperCase()+'</small></button>').join('');
  wrap.innerHTML='<button type="button" class="v15-appearance-toggle" id="v15AppearanceToggle" aria-expanded="false"><i id="v15CurrentGlyph">✠</i><span><small>ОФОРМЛЕНИЕ</small><b id="v15CurrentTheme">Imperium</b></span><em>▾</em></button>'+
  '<section class="v15-appearance-panel" id="v15AppearancePanel" hidden><div class="v15-panel-head"><div><small>ARCHIVE VISUAL MATRIX</small><h3>Оформление архива</h3><p>Тема меняет фон, металл, свечение, паттерн и характер кнопок.</p></div><button class="v15-panel-close" type="button">×</button></div>'+
  '<div class="v15-lang-row"><span>ЯЗЫК ИНТЕРФЕЙСА</span><div class="v15-lang"><button type="button" data-v15-lang="ru">RU</button><button type="button" data-v15-lang="en">EN</button></div></div>'+
  '<div class="v15-theme-grid">'+cards+'</div></section>';
  actions.prepend(wrap);
  const toggle=$('#v15AppearanceToggle',wrap),panel=$('#v15AppearancePanel',wrap);
  toggle.onclick=e=>{e.stopPropagation();const open=panel.hidden;panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open))};
  $('.v15-panel-close',wrap).onclick=close;
  $$('[data-v15-theme]',wrap).forEach(b=>b.onclick=()=>{syncLegacyTheme(b.dataset.v15Theme);close()});
  $$('[data-v15-lang]',wrap).forEach(b=>b.onclick=()=>setLang(b.dataset.v15Lang));
  document.addEventListener('click',e=>{if(!wrap.contains(e.target))close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  updateActive();
}
function fixChronicle(){
  $$('.chron-body p').forEach(p=>{p.style.writingMode='horizontal-tb';p.style.whiteSpace='normal';p.style.wordBreak='normal';p.style.overflowWrap='normal'});
}
const obs=new MutationObserver(()=>{fixChronicle();updateActive()});
function init(){
  install();syncLegacyTheme(current());fixChronicle();
  const tl=$('#timelineList');if(tl)obs.observe(tl,{childList:true,subtree:true});
  obs.observe(document.body,{attributes:true,attributeFilter:['data-theme','data-pattern']});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();