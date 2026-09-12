import {assumptions,calculate} from './model.js';
const $=id=>document.getElementById(id),eur=x=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(x),pct=x=>x===null?'—':(x*100).toFixed(1)+'%';
const params=new URLSearchParams(location.search);const initial=Object.hasOwn(assumptions.homes,params.get('size'))?params.get('size'):'95';$('size').value=initial;
function defaults(){const a=assumptions.homes[$('size').value];$('price').value=a.price;$('kit').value=Math.round(a.kit);}
function update(){
 const inputs=['price','kit','land','infrastructure','costChange'];const valid=inputs.every(id=>$(id).value.trim()!==''&&$(id).checkValidity());$('input-error').hidden=valid;if(!valid){$('results').innerHTML='';return;}
 const size=$('size').value,v=Object.fromEntries(inputs.map(id=>[id,Number($(id).value)]));
 // Preserve the exact scaled default while displaying whole euros.
 const kit=v.kit===Math.round(assumptions.homes[size].kit)?assumptions.homes[size].kit:v.kit;
 const r=calculate(size,{...v,kit,buildFactor:1+v.costChange/100});
 const fields=[['Sales revenue',eur(r.revenue)],['Total cost including land',eur(r.total)],['Project profit before tax',eur(r.profit),r.profit<0?'negative':'positive'],['Profit as share of sales',pct(r.margin),r.profit<0?'negative':'positive'],['Break-even sale / home',eur(r.breakEven)],['Land budget at 20% margin',eur(r.residualLand20),r.residualLand20<0?'negative':'']];
 $('results').innerHTML='<div class="result-grid">'+fields.map(([label,val,cl=''])=>`<div><small>${label}</small><strong class="${cl}">${val}</strong></div>`).join('')+'</div><p class="assumption-note">A negative land budget means that a 20% margin is not reached even with no land cost. No land valuation or planning approval is implied.</p>';
 $('back-to-homes').href='../?size='+encodeURIComponent(size);const url=new URL(location.href);url.searchParams.set('size',size);history.replaceState({},'',url);
}
$('scenario').addEventListener('submit',e=>e.preventDefault());$('scenario').addEventListener('input',update);$('size').addEventListener('change',()=>{defaults();update();});$('reset').onclick=()=>{$('land').value=assumptions.land;$('infrastructure').value=assumptions.infrastructure;$('costChange').value=0;defaults();update();};defaults();update();

$('contents-toggle').onclick=()=>{const b=$('contents-toggle'),open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));b.textContent=open?'Close contents ↑':'Contents ↓';};
