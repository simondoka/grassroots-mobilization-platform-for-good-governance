(function(){var idx=null,box,inp,list,items=[],sel=0,back;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function load(){if(idx)return Promise.resolve();return fetch('search-index.json').then(function(r){return r.json()}).then(function(d){idx=d}).catch(function(){idx=[]})}
function build(){box=document.createElement('div');box.id='gx';box.hidden=true;
box.innerHTML='<div class="gx-card" role="dialog" aria-modal="true" aria-labelledby="gx-t"><button class="gx-x" aria-label="Close search">&times;</button><h2 id="gx-t">Search the Platform</h2><p>Find people, places, events and promises across the whole site.</p><input id="gx-q" type="search" placeholder="Try: Jos rally, join, promise, Kaduna\u2026" autocomplete="off" aria-label="Search the platform"><ul id="gx-r" role="listbox"></ul></div>';
document.body.appendChild(box);inp=box.querySelector('#gx-q');list=box.querySelector('#gx-r');
box.addEventListener('click',function(e){if(e.target===box||e.target.className==='gx-x')close()});
inp.addEventListener('input',function(){run(inp.value)});
inp.addEventListener('keydown',function(e){if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(items.length){sel=(sel+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;mark()}}else if(e.key==='Enter'&&items[sel]){location.href=items[sel].e.url}})}
function mark(){[].forEach.call(list.children,function(li,i){li.className=i===sel?'on':''})}
function run(q){var t=q.toLowerCase().split(/\s+/).filter(Boolean);items=[];sel=0;
if(!t.length){list.innerHTML='';return}
(idx||[]).forEach(function(e){var ti=e.title.toLowerCase(),tg=(e.tags||'').toLowerCase(),tx=(e.text||'').toLowerCase(),s=0;
for(var i=0;i<t.length;i++){var p=0;if(ti.indexOf(t[i])>-1)p+=5;if(tg.indexOf(t[i])>-1)p+=3;if(tx.indexOf(t[i])>-1)p+=1;if(!p){s=0;break}s+=p}
if(s)items.push({e:e,s:s})});
items.sort(function(a,b){return b.s-a.s});items=items.slice(0,8);
if(!items.length){list.innerHTML='<li class="gx-none">No matches for \u201c'+esc(q)+'\u201d. Try a shorter word, e.g. \u201cjoin\u201d, \u201crally\u201d or \u201cpromise\u201d.</li>';return}
var re=new RegExp('('+t.map(function(w){return w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}).join('|')+')','gi');
list.innerHTML=items.map(function(o){var e=o.e,sn=esc(e.text.length>120?e.text.slice(0,117)+'\u2026':e.text).replace(re,'<mark>$1</mark>');
return '<li><a href="'+esc(e.url)+'"><em>'+esc(e.page)+'</em><b>'+esc(e.title).replace(re,'<mark>$1</mark>')+'</b><small>'+sn+'</small></a></li>'}).join('');mark()}
function open(q,from){if(!box)build();back=from||document.activeElement;box.hidden=false;document.documentElement.style.overflow='hidden';inp.value=q||'';inp.focus();load().then(function(){run(inp.value)})}
function close(){if(!box||box.hidden)return;box.hidden=true;document.documentElement.style.overflow='';if(back&&back.focus)try{back.focus()}catch(x){}}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-search]');if(a){e.preventDefault();open('',a)}});
document.addEventListener('keydown',function(e){var tg=(e.target.tagName||'').toLowerCase();
if(e.key==='Escape')close();
else if((e.key==='/'&&tg!=='input'&&tg!=='textarea')||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')){e.preventDefault();open('',document.activeElement)}});
document.addEventListener('focusin',function(e){if(e.target.id==='sq'){var b=e.target;open(b.value,b);b.blur();b.value=''}});
})();
