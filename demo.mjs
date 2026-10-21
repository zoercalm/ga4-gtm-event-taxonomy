import {pushEvent,validate} from './validate.mjs';
import {example,events} from './examples.mjs';
const layer=[],seen=new Set();
for(const event of events)pushEvent(layer,example(event),seen);
console.log(JSON.stringify(layer,null,2));
console.log('Repeated purchase accepted:',pushEvent(layer,example('purchase'),seen));
for(const payload of [{event:'constructor'}, {...example('purchase'),ecommerce:{...example('purchase').ecommerce,value:99}}, {event:'purchase',ecommerce:{}}])console.log('Rejected:',validate(payload));
