(function(){var g=[].slice.call(document.querySelectorAll('#jos-campaign .jg a')),lb,im,cp,i=0,x0=0;if(!g.length)return;
function mk(){lb=document.createElement('div');lb.className='jl';lb.hidden=true;lb.innerHTML='<button class="jx" aria-label="Close">&times;</button><button class="jp" aria-label="Previous photo">&#8249;</button><img alt=""><p></p><button class="jn" aria-label="Next photo">&#8250;</button>';document.body.appendChild(lb);im=lb.querySelector('img');cp=lb.querySelector('p');
lb.addEventListener('click',function(e){var c=e.target.className;if(c==='jx'||e.target===lb)h();else if(c==='jp')s(-1);else if(c==='jn')s(1)});
lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX});lb.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>50)s(d<0?1:-1)});
document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')h();if(e.key==='ArrowLeft')s(-1);if(e.key==='ArrowRight')s(1)})}
function s(d){i=(i+d+g.length)%g.length;im.src=g[i].href;im.alt=g[i].querySelector('img').alt;cp.textContent=g[i].dataset.cap}
function h(){lb.hidden=true;document.documentElement.style.overflow=''}
g.forEach(function(a,n){a.addEventListener('click',function(e){e.preventDefault();if(!lb)mk();i=n-1;s(1);lb.hidden=false;document.documentElement.style.overflow='hidden'})})})();
