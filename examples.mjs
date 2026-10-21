export function example(event) {
 const payload={event,ecommerce:{currency:'USD',value:35,items:[{item_id:'SKU-001',price:17.5,quantity:2}]}};
 if(event==='purchase')payload.ecommerce.transaction_id='ORDER-001';
 return payload;
}
export const events=['view_item','add_to_cart','begin_checkout','purchase'];
