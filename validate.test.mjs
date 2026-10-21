import test from 'node:test';
import assert from 'node:assert/strict';
import {validate,pushEvent} from './validate.mjs';
const purchase=()=>({event:'purchase',ecommerce:{transaction_id:'ORDER-001',currency:'USD',value:35,items:[{item_id:'SKU-001',price:17.5,quantity:2}]}});
test('valid events',()=>{for(const event of ['view_item','add_to_cart','begin_checkout','purchase']){const p=purchase();p.event=event;if(event!=='purchase')delete p.ecommerce.transaction_id;assert.deepEqual(validate(p),[]);}});
test('required and invalid fields',()=>{for(const field of ['transaction_id','currency','value','items']){const p=purchase();delete p.ecommerce[field];assert.ok(validate(p).length);}});
test('invalid numerical values',()=>{for(const v of [NaN,Infinity,-1,'35']){const p=purchase();p.ecommerce.value=v;assert.ok(validate(p).length);}});
test('blocks unapproved personal-data fields',()=>{const p=purchase();p.ecommerce.email='demo@example.invalid';assert.ok(validate(p).some(x=>x.includes('unapproved')));});
test('rejects item and total errors',()=>{const p=purchase();p.ecommerce.items[0].quantity=1.5;assert.ok(validate(p).length);p.ecommerce.items=[];assert.ok(validate(p).length);});
test('clear state, deduplicate purchase, no mutation',()=>{const p=purchase(),layer=[],seen=new Set();assert.equal(pushEvent(layer,p,seen),true);assert.equal(pushEvent(layer,p,seen),false);assert.equal(layer.length,2);assert.deepEqual(layer[0],{ecommerce:null});p.ecommerce.value=0;assert.equal(layer[1].ecommerce.value,35);});
test('invalid events do not reach dataLayer',()=>{const layer=[];assert.throws(()=>pushEvent(layer,{event:'unknown'}));assert.equal(layer.length,0);});

test('unknown and inherited event names never throw',()=>{for(const event of ['toString','constructor','__proto__','unknown',null,42])assert.deepEqual(validate({event,ecommerce:{}}),['unsupported event']);assert.deepEqual(validate(null),['unsupported event']);});
test('documented examples and rejection are executable',async()=>{const {example,events}=await import('./examples.mjs');for(const event of events)assert.deepEqual(validate(example(event)),[]);const p=example('purchase');p.ecommerce.value=99;const layer=[];assert.throws(()=>pushEvent(layer,p),/value differs/);assert.equal(layer.length,0);});
