// Eight completed homes for the landowner; the investor funds all sixteen.
// EUR before VAT. The land contribution is non-cash, never a second investor cost.
export const assumptions={count:16,ownerHomes:8,land:1200000,siteArea:7666,road:165000,infrastructure:180000,amenities:150000,fees:.06,contingency:.12,selling:.03,transaction:0,
 homes:{'95':{kit:60000,other:109000,price:320000,finance:120000,density:.20},'143.7':{kit:60000*143.7/95,other:141000,price:420000,finance:160000,density:.30}}};
const fields=['land','kit','other','price','finance','infrastructure','amenities','transaction','buildFactor'];
export function calculate(size,overrides={}){
 if(!Object.hasOwn(assumptions.homes,size))throw new Error('Unknown home size');
 for(const key of Object.keys(overrides))if(!fields.includes(key))throw new Error('Unsupported assumption: '+key);
 const a={...assumptions,...assumptions.homes[size],buildFactor:1,...overrides};
 for(const k of fields)if(!Number.isFinite(a[k])||a[k]<0)throw new Error('Invalid '+k);
 const investorHomes=a.count-a.ownerHomes;
 const hard=(a.count*(a.kit+a.other)+a.road+a.infrastructure+a.amenities)*a.buildFactor;
 const fees=hard*a.fees,contingency=hard*a.contingency;
 const deliveryCost=hard+fees+contingency+a.finance+a.transaction;
 const investorRevenue=investorHomes*a.price,salesCosts=investorRevenue*a.selling;
 const investorOutlay=deliveryCost+salesCosts,investorProfit=investorRevenue-investorOutlay;
 const ownerCompletedValue=a.ownerHomes*a.price;
 return{investorHomes,ownerHomes:a.ownerHomes,hard,fees,contingency,deliveryCost,investorRevenue,salesCosts,investorOutlay,investorProfit,
 investorMargin:investorRevenue?investorProfit/investorRevenue:null,returnOnCost:investorOutlay?investorProfit/investorOutlay:null,
 breakEven:deliveryCost/(investorHomes*(1-a.selling)),priceFor20Margin:deliveryCost/(investorHomes*(1-a.selling-.20)),
 maxDeliveryBreakEven:investorRevenue*(1-a.selling),maxDelivery20Margin:investorRevenue*(1-a.selling-.20),
 costReductionToBreakEven:Math.max(0,deliveryCost-investorRevenue*(1-a.selling)),
 ownerCompletedValue,landContribution:a.land,ownerGrossValueUplift:ownerCompletedValue-a.land,
 density:a.density,siteArea:a.siteArea,densityAllowance:a.siteArea*a.density,usableTotal:a.count*Number(size),arithmeticHeadroom:a.siteArea*a.density-a.count*Number(size)};
}
