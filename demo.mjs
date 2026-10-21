import {pushEvent} from './validate.mjs';
const dataLayer=[], seen=new Set();
const purchase={event:'purchase',ecommerce:{transaction_id:'ORDER-DEMO-001',currency:'USD',value:35,items:[{item_id:'SKU-DEMO',price:17.5,quantity:2}]}};
pushEvent(dataLayer,purchase,seen);
pushEvent(dataLayer,purchase,seen);
console.log(JSON.stringify(dataLayer,null,2));
