import {mediaMarkup} from './media.mjs?v=11';
export {reconcileBossSnapshot} from './boss-snapshot.mjs';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list=items=>`<ul>${(items||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
const tiers={recommended:'Recommended starting point',premium:'Premium / high investment',accessible:'F2P-friendly roster',alternative:'Alternative roster'};
export function bossGuidesMarkup(data){
 if(!data?.bosses?.some(b=>b.guide))return '';
 const elements=[...new Set(data.bosses.flatMap(b=>b.guide?.elements||[]))].sort();
 return `<section class="panel encounter-guides" id="encounter-guides" aria-labelledby="guide-heading"><div class="row-head"><div><span class="eyebrow">Version ${esc(data.version)} · encounter library</span><h2 id="guide-heading">Know the mechanic. Build the answer.</h2><p>Mechanic-focused team suggestions. These are starting points, not measured rankings or guaranteed Dire clears.</p></div></div><div class="guide-filters"><label class="field">Search bosses, characters or mechanics<input type="search" data-guide-search placeholder="Search guides…"></label><label class="field">Roster budget<select data-guide-tier><option value="">All rosters</option>${Object.entries(tiers).map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select></label><label class="field">Recommended element<select data-guide-element><option value="">All elements</option>${elements.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label></div><p data-guide-count role="status" aria-live="polite">${data.bosses.length} boss guides</p>${data.bosses.map(b=>guideMarkup(b)).join('')}<p class="guide-empty" hidden>No matching guides or teams. Clear a filter to see more options.</p>${data.rules?`<details class="guide-rules"><summary>Challenge requirements & rewards</summary>${typeof data.rules==='string'?`<p>${esc(data.rules)}</p>`:list(Array.isArray(data.rules)?data.rules:Object.values(data.rules).flat())}</details>`:''}</section>`;
}
function guideMarkup(b){const g=b.guide;if(!g)return '';return `<details class="encounter-guide" data-guide-boss data-guide-elements="${esc((g.elements||[]).join('|'))}"><summary><strong>${esc(b.name)}</strong><span>${esc((g.elements||[]).join(' · '))} · Strategy & teams</span></summary><div class="guide-body"><p>${esc(g.overview)}</p><div class="guide-strategy"><section><h3>Combat plan</h3><ol>${(g.strategy||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section><section><h3>Common mistakes</h3>${list(g.mistakes)}<h3>Higher difficulties</h3><p>${esc(g.higherDifficulty)}</p></section></div><div class="guide-team-grid">${(g.teams||[]).map(t=>`<article class="guide-team" data-guide-team data-guide-budget="${esc(t.tier)}"><span class="chip">${esc(tiers[t.tier]||t.tier)}</span><h3>${esc(t.name)}</h3><div class="guide-roster">${(t.characters||[]).map(c=>`<div>${mediaMarkup('characters',c.name,'mini')}<strong>${esc(c.name)}</strong><small>${esc(c.role)}</small></div>`).join('')}</div><p><strong>Reaction / approach:</strong> ${esc(t.reaction)}</p><p>${esc(t.why)}</p><details><summary>Rotation, substitutions & equipment</summary><h4>Suggested sequence</h4><ol>${(t.rotation||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ol><h4>Substitutions</h4>${list(t.replacements)}<h4>Equipment priorities</h4><p>${esc(t.equipment)}</p><p class="inline-note">${esc(t.confidence)}</p></details></article>`).join('')}</div>${/^https:\/\//.test(b.source||'')?`<a class="source" href="${esc(b.source)}" target="_blank" rel="noopener">Encounter mechanics source ↗</a>`:''}</div></details>`}
export function setupGuideFilters(){
 const update=e=>{
  if(!e.target.matches('[data-guide-search],[data-guide-tier],[data-guide-element]'))return;
  const root=e.target.closest('.encounter-guides'),query=root.querySelector('[data-guide-search]').value.trim().toLowerCase(),tier=root.querySelector('[data-guide-tier]').value,element=root.querySelector('[data-guide-element]').value;
  let count=0;
  for(const boss of root.querySelectorAll('[data-guide-boss]')){
   const bossMatch=boss.querySelector('summary').textContent.toLowerCase().includes(query),elementMatch=!element||boss.dataset.guideElements.split('|').includes(element);let teams=0;
   for(const card of boss.querySelectorAll('[data-guide-team]')){card.hidden=!(elementMatch&&(!tier||card.dataset.guideBudget===tier)&&(!query||bossMatch||card.textContent.toLowerCase().includes(query)||boss.querySelector('.guide-strategy').textContent.toLowerCase().includes(query)));if(!card.hidden)teams++;}
   boss.hidden=!elementMatch||teams===0;if(!boss.hidden){count++;if(query||tier||element)boss.open=true;}
  }
  root.querySelector('[data-guide-count]').textContent=`${count} matching boss guide${count===1?'':'s'}`;root.querySelector('.guide-empty').hidden=count>0;
 };
 document.addEventListener('input',update);document.addEventListener('change',update);
}
