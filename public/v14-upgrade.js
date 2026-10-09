(()=>{
const V=window.IA_V14||{};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tx=x=>typeof x==='string'?x:(x?.[(localStorage.getItem('ia-lang')||'ru')]||x?.ru||x?.en||'');

function decorateChronicle(){
  const root=$('#timelineList');
  if(!root) return;

  // remove visible scrollbar feel / mark timeline as enhanced
  root.classList.add('v14-chronicle-ready');

  // Add deeper lore blocks for each era.
  Object.entries(V.eraExpansions||{}).forEach(([id,data])=>{
    const article=$('#chron-'+id,root);
    if(!article || $('.chron-deep',article)) return;
    const lang=localStorage.getItem('ia-lang')||'ru';
    const d=data?.[lang]||data?.ru||data?.en;
    if(!d) return;
    const learn=(d.learn||[]).map(item=>`<li>${esc(item)}</li>`).join('');
    article.insertAdjacentHTML('beforeend',`
      <section class="chron-deep">
        <div class="chron-deep-grid">
          <article class="chron-deep-card">
            <small>${lang==='ru'?'ПОЧЕМУ ЭПОХА ВАЖНА':'WHY THIS ERA MATTERS'}</small>
            <p>${esc(d.why||'')}</p>
          </article>
          <article class="chron-deep-card">
            <small>${lang==='ru'?'ЧТО НУЖНО УСВОИТЬ':'CORE TAKEAWAYS'}</small>
            <ul>${learn}</ul>
          </article>
          <article class="chron-deep-card">
            <small>${lang==='ru'?'КУДА ИДТИ ДАЛЬШЕ':'WHERE TO GO NEXT'}</small>
            <p>${esc(d.next||'')}</p>
          </article>
        </div>
      </section>
    `);
  });

  // highlight active era in the left index
  const buttons=$$('[data-chron-jump]',root);
  const articles=$$('.chron-era',root);
  buttons.forEach(btn=>btn.classList.remove('active'));
  if(window.__iaChronicleObserverV14) window.__iaChronicleObserverV14.disconnect();
  if(!('IntersectionObserver' in window) || !buttons.length || !articles.length) return;
  const map=new Map(buttons.map(btn=>[btn.dataset.chronJump,btn]));
  window.__iaChronicleObserverV14=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible) return;
    const id=visible.target.id.replace(/^chron-/,'');
    buttons.forEach(btn=>btn.classList.toggle('active',btn.dataset.chronJump===id));
  },{rootMargin:'-18% 0px -62% 0px',threshold:[0.15,0.35,0.6]});
  articles.forEach(a=>window.__iaChronicleObserverV14.observe(a));
}

const oldRenderTimeline=window.renderTimeline;
if(oldRenderTimeline){
  window.renderTimeline=function(){
    const result=oldRenderTimeline.apply(this,arguments);
    decorateChronicle();
    return result;
  };
}

const oldSetRoute=window.setRoute;
if(oldSetRoute){
  window.setRoute=function(route,updateHash=true){
    const result=oldSetRoute.call(this,route,updateHash);
    if(route==='timeline') setTimeout(decorateChronicle,10);
    return result;
  };
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(decorateChronicle,20));
else setTimeout(decorateChronicle,20);
})();
