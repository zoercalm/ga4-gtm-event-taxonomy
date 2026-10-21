import {pushEvent} from './validate.mjs';
import {example,events} from './examples.mjs';
window.dataLayer=[];
const seen=new Set(),status=document.querySelector('#status'),output=document.querySelector('#output');
function send(payload){
 try{status.textContent=pushEvent(window.dataLayer,payload,seen)?'Accepted: '+payload.event:'Duplicate purchase suppressed';}
 catch(error){status.textContent='Rejected: '+error.message;}
 output.textContent=JSON.stringify(window.dataLayer,null,2);
}
for(const event of events){const button=document.createElement('button');button.textContent=event;button.onclick=()=>send(example(event));document.querySelector('#actions').append(button);}
document.querySelector('#failed').onclick=()=>{status.textContent='Payment failed: no event sent';};
document.querySelector('#invalid').onclick=()=>{const p=example('purchase');p.ecommerce.value=99;send(p);};
document.querySelector('#reset').onclick=()=>{window.dataLayer.length=0;seen.clear();output.textContent='[]';status.textContent='Page session reset';};
