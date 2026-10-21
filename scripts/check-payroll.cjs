const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const assert = require('node:assert/strict');
// Execute the actual pure functions used by the UI and salary landing pages.
function functions(file, start, end, names) {
 const text=fs.readFileSync(file,'utf8');
 const code=text.slice(text.indexOf(start),text.indexOf(end));
 const js=ts.transpileModule(code,{compilerOptions:{target:ts.ScriptTarget.ES2020}}).outputText;
 return vm.runInNewContext(js+'\n({'+names.join(',')+'})');
}
const ui=functions('components/PAYECalculator.tsx','const TAX_BANDS','// Animated',['fullCalculation','calculatePAYE','calculateGrossFromNet']);
const salary=functions('app/salary/[amount]/page.tsx','const TAX_BANDS','const fmt =',['calcAll']);
const near=(a,b)=>assert(Math.abs(a-b)<0.01,`${a} != ${b}`);
for (const [gross,tax,net] of [[50000,5845.85,39029.15],[100000,19308.35,70441.65],[150000,33526.85,103618.15],[200000,47889.35,137130.65]]) {
 for(const c of [ui.fullCalculation(gross),salary.calcAll(gross)]) {near(c.paye,tax);near(c.netSalary??c.net,net)}
}
const base=ui.fullCalculation(100000);
const pension=ui.fullCalculation(100000,{pensionContribution:30000});
near(pension.maxPension,24000);near(pension.netSalary,base.netSalary-30000+7200);
near(ui.fullCalculation(100000,{helbRepayment:5000}).paye,base.paye);
near(ui.fullCalculation(100000,{helbRepayment:5000}).netSalary,base.netSalary-5000);
near(ui.calculatePAYE(200000,true),ui.calculatePAYE(50000));
near(ui.fullCalculation(100000,{carBenefit:20000,housingBenefit:30000}).totalBenefits,50000);
near(ui.fullCalculation(0).netSalary,0);
for(const target of [40000,100000,200000]) assert(Math.abs(ui.fullCalculation(ui.calculateGrossFromNet(target,{})).netSalary-target)<1);
console.log('PASS: actual UI and salary functions, standard examples, pension cap/cash, HELB, disability, benefits, zero and reverse salary.');
