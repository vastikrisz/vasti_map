/* VastiMap 1.6 – profile features. Supabase RLS is the authority. */
(() => {
'use strict';
const db = window.supabaseClient || supabaseClient;
const overlay=document.getElementById('vmProfileOverlay'), body=document.getElementById('vmProfileBody');
let user=null, profile=null, marks=[], visitorsCache=new Map(), expandedCollection=null;
let hideVisitedOnMap=false;
window.vmShouldHideVisited=(placeId)=>Boolean(profile?.approved && hideVisitedOnMap && marks.some(m=>Number(m.place_id)===Number(placeId)&&m.mark_type==='visited'));
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials=s=>(String(s||'').trim().split(/\s+/).slice(0,2).map(w=>w[0]||'').join('')||'?').toLocaleUpperCase('hu-HU');
const safeMessage=e=>e?.message||'Ismeretlen hiba';
const button=(text,fn,cls='vm-action')=>{const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=text;b.addEventListener('click',fn);return b};
function info(t,good=false){let p=document.getElementById('vmMessage');if(!p){p=document.createElement('p');p.id='vmMessage';body.prepend(p)}p.className=good?'vm-success':'vm-error';p.textContent=t}
function setBody(html){body.innerHTML=html}
function open(){overlay.hidden=false;document.body.style.overflow='hidden';render()}
function close(){overlay.hidden=true;document.body.style.overflow=''}
document.getElementById('vmCloseProfile').addEventListener('click',close);
overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
document.querySelectorAll('.vm-profile-trigger').forEach(b=>b.addEventListener('click',open));
function updateIcon(){document.querySelectorAll('.vm-profile-symbol').forEach(el=>el.innerHTML=profile?.approved?escape(initials(profile.display_name)):'<svg class="vm-user-icon" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20v-1.5a6.5 6.5 0 0 1 13 0V20"/></svg>')}
async function refresh(){const {data:{user:u}}=await db.auth.getUser();user=u;profile=null;marks=[];if(user){const {data,error}=await db.from('user_profiles').select('user_id,display_name,approved,hide_profile,map_theme').eq('user_id',user.id).maybeSingle();if(error)console.warn('Profil lekérdezése:',error.message);profile=data;if(profile?.approved){const m=await db.from('user_place_marks').select('place_id,mark_type').eq('user_id',user.id);marks=m.data||[];}}hideVisitedOnMap=Boolean(profile?.approved && localStorage.getItem('vmHideVisitedMap')==='true');window.vmRefreshVisitedFilter?.();updateIcon();if(!overlay.hidden)render();const placeId=document.getElementById('vmPlaceMarkActions')?.dataset.placeId;if(placeId)renderPlaceExtras(Number(placeId))}
function render(){if(!user){setBody('<h2>Bejelentkezés</h2><form id="vmLogin"><label>Email<input type="email" name="email" autocomplete="email" required></label><label>Jelszó<input type="password" name="password" autocomplete="current-password" required></label><button class="vm-action">Bejelentkezés</button></form><div id="vmOther"></div>');document.getElementById('vmOther').append(button('Regisztráció',renderSignup,'vm-action vm-secondary'));document.getElementById('vmLogin').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const {error}=await db.auth.signInWithPassword({email:String(f.get('email')),password:String(f.get('password'))});if(error)info(safeMessage(error));else await refresh()};return}
if(!profile){setBody('<h2>Profiladatok betöltése</h2><p>A profil még nem érhető el. Próbáld újra később.</p>');body.append(button('Frissítés',refresh));return}
if(!profile.approved){setBody('<h2>Jóváhagyásra vár</h2><p>A regisztrációd megtörtént, de a profilfunkciókat csak az admin jóváhagyása után használhatod. A térképet addig is böngészheted.</p>');body.append(button('Állapot frissítése',refresh),button('Kijelentkezés',logout,'vm-action vm-secondary'));return}
const visited=marks.filter(m=>m.mark_type==='visited').length, bucket=marks.filter(m=>m.mark_type==='bucket_list').length;
setBody(`<h2 class="vm-profile-heading"><span class="vm-avatar">${escape(initials(profile.display_name))}</span> ${escape(profile.display_name)}</h2><p class="vm-profile-summary">${visited} bejárt hely · ${bucket} hely a Bakancslistán</p><div class="vm-collection-actions"><button class="vm-action vm-secondary" id="vmVisited">✓ Jártam itt (${visited})</button><button class="vm-action vm-secondary" id="vmBucket">☆ Bakancslista (${bucket})</button></div><div id="vmList"></div><section class="vm-profile-section"><h3>Beállítások</h3><label class="vm-switch"><input id="vmHideVisitedMap" type="checkbox" ${hideVisitedOnMap?'checked':''}><span>Bejárt helyek elrejtése a térképen és a listában</span></label><label class="vm-switch"><input id="vmHide" type="checkbox" ${profile.hide_profile?'checked':''}><span>Profilom elrejtése más felhasználók elől</span></label></section><section class="vm-profile-section"><h3>Visszajelzés</h3><div class="vm-feedback-choice"><button id="vmProblem" class="vm-action vm-secondary">⚑ Problémám van</button><button id="vmSuggest" class="vm-action vm-secondary">＋ Ajánlok egy helyet</button><a class="vm-action vm-secondary" target="_blank" rel="noopener noreferrer" href="https://discord.com/users/384776976591749121">◈ Egyéb, beszélek az adminnal (Discord)</a></div><div id="vmFeedbackForm"></div></section><div class="vm-profile-footer"><button id="vmLogout" class="vm-action vm-secondary">Kijelentkezés</button></div>`);
document.getElementById('vmHideVisitedMap').onchange=e=>{hideVisitedOnMap=e.target.checked;localStorage.setItem('vmHideVisitedMap',String(hideVisitedOnMap));window.vmRefreshVisitedFilter?.()};
document.getElementById('vmHide').onchange=async e=>{const val=e.target.checked;const {error}=await db.from('user_profiles').update({hide_profile:val}).eq('user_id',user.id);if(error){info(error.message);e.target.checked=!val;return}profile.hide_profile=val;visitorsCache.clear()};
document.getElementById('vmVisited').onclick=()=>showList('visited');document.getElementById('vmBucket').onclick=()=>showList('bucket_list');
if(expandedCollection)drawCollection(expandedCollection);
document.getElementById('vmProblem').onclick=()=>feedbackForm('problem');document.getElementById('vmSuggest').onclick=()=>feedbackForm('place_suggestion');document.getElementById('vmLogout').onclick=logout;
}
function showList(type){
 const el=document.getElementById('vmList');if(!el)return;
 if(expandedCollection===type){expandedCollection=null;el.replaceChildren();return}
 expandedCollection=type;drawCollection(type);
}
function drawCollection(type){
 const el=document.getElementById('vmList');if(!el)return;
 const rows=marks.filter(m=>m.mark_type===type);
 el.replaceChildren();
 const heading=document.createElement('h3');heading.textContent=type==='visited'?'Bejárt helyek':'Bakancslista';el.append(heading);
 const list=document.createElement('div');list.className='vm-profile-list';el.append(list);
 if(!rows.length){const empty=document.createElement('p');empty.textContent='Még nincs hely a listában.';list.append(empty);return}
 for(const mark of rows){
   const placeId=Number(mark.place_id);
   const place=window.vmGetPlaceById?.(placeId);
   const row=document.createElement('div');row.className='vm-profile-place-row';
   const go=document.createElement('button');go.type='button';go.className='vm-profile-place-link';go.textContent=place?.name||`Hely #${placeId}`;
   go.title='Hely megnyitása a térképen';go.onclick=()=>{if(!window.vmNavigateToPlace){info('A hely most nem nyitható meg.');return}close();window.vmNavigateToPlace(placeId)};
   const remove=document.createElement('button');remove.type='button';remove.className='vm-profile-place-remove';remove.title='Eltávolítás a listából';remove.setAttribute('aria-label',`${go.textContent} eltávolítása`);
   remove.innerHTML='<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 4h4M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>';
   remove.onclick=async()=>{remove.disabled=true;const {error}=await db.from('user_place_marks').delete().eq('user_id',user.id).eq('place_id',placeId).eq('mark_type',type);if(error){remove.disabled=false;info(error.message);return}marks=marks.filter(m=>!(Number(m.place_id)===placeId&&m.mark_type===type));visitorsCache.delete(placeId);window.vmRefreshVisitedFilter?.();render();const current=document.getElementById('vmPlaceMarkActions')?.dataset.placeId;if(Number(current)===placeId)renderPlaceExtras(placeId)};
   row.append(go,remove);list.append(row)
 }
}

function renderSignup(){setBody('<h2>Regisztráció</h2><form id="vmSignup"><label>Neved<input name="name" minlength="2" maxlength="60" required placeholder="V. Krisztián"></label><p class="vm-note">Kérlek, olyan normális, felismerhető nevet adj meg, amely alapján a többiek tudják, ki vagy (például V. Krisztián).</p><label>Email<input name="email" type="email" autocomplete="email" required></label><label>Jelszó<input name="password" type="password" autocomplete="new-password" minlength="8" required></label><p class="vm-note">Kérlek, olyan egyedi jelszót használj, amit sehol máshol nem használsz.</p><button class="vm-action">Regisztráció</button></form>');body.append(button('Vissza a bejelentkezéshez',render,'vm-action vm-secondary'));document.getElementById('vmSignup').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target), name=String(f.get('name')).trim();const {data,error}=await db.auth.signUp({email:String(f.get('email')),password:String(f.get('password')),options:{emailRedirectTo:'https://vastikrisz.github.io/vasti_map/',data:{display_name:name}}});if(error){info(error.message);return}if(data.user && !data.session){info('Regisztráció elküldve. Kérlek, erősítsd meg az emailcímedet a kapott levélben. Ezután az admin jóváhagyása is szükséges.',true)}else{await refresh();info('Regisztráció sikeres. A fiókod adminjóváhagyásra vár.',true)}}}
async function logout(){await db.auth.signOut();visitorsCache.clear();await refresh()}
function feedbackForm(type){
const el=document.getElementById('vmFeedbackForm');
const choices=type==='problem'?`<fieldset class="vm-problem-options"><legend>Milyen típusú a probléma?</legend><label class="vm-radio-option"><input type="radio" name="problem" value="bug" required><span>Bugot találtam</span></label><label class="vm-radio-option"><input type="radio" name="problem" value="incorrect_place"><span>Hibás helyinformáció</span></label><label class="vm-radio-option"><input type="radio" name="problem" value="other"><span>Egyéb probléma</span></label></fieldset>`:'';
el.innerHTML=`<form id="vmFeedback" class="vm-feedback-form"><h3>${type==='problem'?'Probléma bejelentése':'Hely ajánlása'}</h3>${choices}<div class="vm-message-field" ${type==='problem'?'hidden':''}><label for="vmFeedbackMessage">${type==='problem'?'Írd le a problémát':'Milyen helyet ajánlanál?'}</label><textarea id="vmFeedbackMessage" name="message" minlength="5" maxlength="4000" required placeholder="Írd le a részleteket…"></textarea><button class="vm-action">Beküldés</button></div></form>`;
if(type==='problem')el.querySelectorAll('input[name="problem"]').forEach(r=>r.addEventListener('change',()=>{el.querySelector('.vm-message-field').hidden=false}));
el.querySelector('form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const {error}=await db.from('user_feedback').insert({user_id:user.id,feedback_type:type,problem_type:type==='problem'?f.get('problem'):null,message:String(f.get('message')).trim()});if(error){info(error.message);return}el.innerHTML='<p class="vm-success">Köszönöm, megkaptam a visszajelzésedet.</p>'};
}
async function toggleMark(placeId,type){if(!profile?.approved){open();return}const exists=marks.some(m=>m.place_id===placeId&&m.mark_type===type);const q=db.from('user_place_marks');const {error}=exists?await q.delete().eq('user_id',user.id).eq('place_id',placeId).eq('mark_type',type):await q.insert({user_id:user.id,place_id:placeId,mark_type:type});if(error){alert('Nem sikerült menteni: '+error.message);return}if(exists)marks=marks.filter(m=>!(m.place_id===placeId&&m.mark_type===type));else marks.push({place_id:placeId,mark_type:type});visitorsCache.delete(placeId);window.vmRefreshVisitedFilter?.();renderPlaceExtras(placeId)}
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
async function renderPlaceExtras(placeId){
const actions=document.getElementById('vmPlaceMarkActions'),section=document.getElementById('vmPlaceVisitorsSection');
if(!actions||!section||Number(actions.dataset.placeId)!==Number(placeId))return;
if(!profile?.approved){actions.innerHTML='';section.innerHTML='';section.hidden=true;return}
const visited=marks.some(m=>m.place_id===placeId&&m.mark_type==='visited'),bucket=marks.some(m=>m.place_id===placeId&&m.mark_type==='bucket_list');
actions.innerHTML=`<div class="vm-mark-actions"><label class="vm-mark-checkbox"><input type="checkbox" data-mark="visited" ${visited?'checked':''}><span class="vm-mark-checkvisual" aria-hidden="true">✓</span><span>Bejárva</span></label><button type="button" data-mark="bucket_list" class="${bucket?'vm-active':''}" aria-pressed="${bucket}"><span aria-hidden="true">☆</span> ${bucket?'Bakancslistán':'Bakancslistára'}</button></div>`;
actions.querySelectorAll('[data-mark]').forEach(b=>{if(b.tagName==='INPUT')b.onchange=()=>toggleMark(placeId,b.dataset.mark);else b.onclick=()=>toggleMark(placeId,b.dataset.mark)});
section.hidden=false;section.innerHTML='<h3>Már bejárta</h3><p class="vm-visitor-empty">Betöltés…</p>';
let names=visitorsCache.get(placeId);
if(!names){const {data,error}=await db.rpc('vasti_place_visitors',{p_place_id:placeId});if(error){section.innerHTML='<h3>Már bejárta</h3><p class="vm-visitor-empty">A látogatók nem tölthetők be.</p>';console.warn(error.message);return}names=shuffle((data||[]).map(x=>x.display_name));visitorsCache.set(placeId,names)}
if(!section.isConnected||Number(section.dataset.placeId)!==Number(placeId))return;
if(!names.length){section.innerHTML='<h3>Már bejárta</h3><p class="vm-visitor-empty">Még senki nem jelölte be, hogy itt járt.</p>';return}
const shown=names.length>5?names.slice(0,4):names;
section.innerHTML=`<h3>Már bejárta <span class="vm-visitor-count">${names.length}</span></h3><button type="button" class="vm-visitor-bar" aria-expanded="false"><span class="vm-visitor-avatars">${shown.map(n=>`<span class="vm-avatar" title="${escape(n)}">${escape(initials(n))}</span>`).join('')}${names.length>5?`<span class="vm-avatar vm-more-avatar">+${names.length-4}</span>`:''}</span><span class="vm-visitor-chevron">⌄</span></button><div class="vm-visitor-names" hidden></div>`;
const bar=section.querySelector('.vm-visitor-bar'),list=section.querySelector('.vm-visitor-names');list.textContent=names.join(' · ');bar.onclick=()=>{list.hidden=!list.hidden;bar.setAttribute('aria-expanded',String(!list.hidden))};
}
window.vmRenderPlaceExtras=renderPlaceExtras;
// Re-read approval after sign-in or sign-out; do not trust localStorage for access.
db.auth.onAuthStateChange(()=>setTimeout(refresh,0));
refresh().catch(console.error);
})();
