import fs from 'node:fs';
export const taxonomy = JSON.parse(fs.readFileSync(new URL('./taxonomy.json', import.meta.url)));
// A deliberately strict project contract; not an exhaustive GA4 schema.
export function validate(payload) {
 const errors=[];
 const spec=taxonomy.events[payload?.event];
 if(!spec) return ['unsupported event'];
 const e=payload.ecommerce;
 if(!e || typeof e!=='object') return ['ecommerce object required'];
 const allowed=new Set([...spec.required]);
 for(const k of Object.keys(payload)) if(!['event','ecommerce'].includes(k)) errors.push(`unapproved top-level field: ${k}`);
 for(const k of Object.keys(e)) if(!allowed.has(k)) errors.push(`unapproved ecommerce field: ${k}`);
 for(const k of spec.required) if(e[k]===undefined || e[k]===null || e[k]==='') errors.push(`missing ${k}`);
 if(!/^[A-Z]{3}$/.test(e.currency||'')) errors.push('currency must be a three-letter uppercase code');
 if(!Number.isFinite(e.value)||e.value<0) errors.push('value must be non-negative finite number');
 if(payload.event==='purchase' && (typeof e.transaction_id!=='string'||!/^ORDER-[A-Za-z0-9-]+$/.test(e.transaction_id))) errors.push('transaction_id must be a non-PII ORDER-* string');
 if(!Array.isArray(e.items)||e.items.length===0) errors.push('non-empty items required');
 else {
   let total=0;
   for(const i of e.items) {
     if(!i||typeof i!=='object'){errors.push('item must be an object');continue;}
     if(typeof i.item_id!=='string'||!/^SKU-[A-Za-z0-9-]+$/.test(i.item_id)) errors.push('item_id must be SKU-*');
     for(const k of Object.keys(i)) if(!['item_id','price','quantity'].includes(k)) errors.push(`unapproved item field: ${k}`);
     if(!Number.isFinite(i.price)||i.price<0) errors.push('invalid item price');
     if(!Number.isInteger(i.quantity)||i.quantity<1) errors.push('invalid item quantity');
     total+=i.price*i.quantity;
   }
   if(!Number.isFinite(total)||Math.abs(total-e.value)>0.005) errors.push('value differs from sum(price * quantity)');
 }
 return errors;
}
export function pushEvent(layer, payload, seenTransactions=new Set()) {
 const errors=validate(payload);
 if(errors.length) throw new Error(errors.join('; '));
 if(payload.event==='purchase') {
   if(seenTransactions.has(payload.ecommerce.transaction_id)) return false;
   seenTransactions.add(payload.ecommerce.transaction_id);
 }
 layer.push({ecommerce:null});
 layer.push(structuredClone(payload));
 return true;
}
