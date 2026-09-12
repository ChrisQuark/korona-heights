// Investor screening assumptions, EUR excluding VAT. No contractor quotes inferred.
export const assumptions={count:16,land:500000,road:165000,infrastructure:180000,amenities:150000,fees:.06,contingency:.12,selling:.03,
 homes:{'95':{kit:60000,other:109000,price:320000,finance:120000},'143.7':{kit:60000*143.7/95,other:141000,price:420000,finance:160000}}};
export function calculate(size,overrides={}){
 if(!Object.hasOwn(assumptions.homes,size))throw new Error('Unknown home size');
 const a={...assumptions,...assumptions.homes[size],...overrides};
 for(const k of ['count','land','road','infrastructure','amenities','fees','contingency','selling','kit','other','price','finance'])if(!Number.isFinite(a[k])||a[k]<0)throw new Error('Invalid '+k);
 if(a.count<=0||a.selling>=1)throw new Error('Invalid count or selling fee');
 const buildFactor=a.buildFactor??1;
 if(!Number.isFinite(buildFactor)||buildFactor<0)throw new Error('Invalid construction cost factor');
 const hard=(a.count*(a.kit+a.other)+a.road+a.infrastructure+a.amenities)*buildFactor;
 const revenue=a.count*a.price,fees=hard*a.fees,contingency=hard*a.contingency,sales=revenue*a.selling;
 const beforeLand=hard+fees+contingency+a.finance+sales,total=beforeLand+a.land,profit=revenue-total;
 return{hard,revenue,fees,contingency,sales,beforeLand,total,profit,margin:revenue?profit/revenue:null,costPerHome:total/a.count,
 breakEven:(hard+fees+contingency+a.finance+a.land)/(a.count*(1-a.selling)),
 residualLand20:revenue*(1-.20-a.selling)-hard-fees-contingency-a.finance};
}
