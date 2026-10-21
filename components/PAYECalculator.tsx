'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Hero from './Hero';
import EditorialHero from './EditorialHero';
import EditorialGuides from './EditorialGuides';
import SalaryStory from './SalaryStory';
import { PieChart, Pie, Cell, ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, Legend, Line, ComposedChart } from 'recharts';
import { Calculator, TrendingUp, Wallet, Heart, Shield, ChevronDown, ChevronUp, Info, Minus, PiggyBank, Home, Briefcase, GraduationCap, Gift, Building, BarChart3, RefreshCw, Download } from 'lucide-react';

// 2026 Kenya Tax Constants
const TAX_BANDS = [
  { min: 0, max: 24000, rate: 0.10, label: '10%', color: '#FFD9D3' },
  { min: 24000, max: 32333, rate: 0.25, label: '25%', color: '#F5B9B2' },
  { min: 32333, max: 500000, rate: 0.30, label: '30%', color: '#F04C40' },
  { min: 500000, max: 800000, rate: 0.325, label: '32.5%', color: '#C73B2F' },
  { min: 800000, max: Infinity, rate: 0.35, label: '35%', color: '#8A2820' }
];

const PERSONAL_RELIEF = 2400;
const DISABILITY_RELIEF = 150000;
const NSSF_RATE = 0.06;
// Upper Earnings Limit raised to KES 108,000 from 1 Feb 2026 (NSSF Phase 4).
// Max employee NSSF = 6% x 108,000 = KES 6,480/month (Tier I 540 + Tier II 5,940).
const NSSF_UPPER_LIMIT = 108000;
const SHIF_RATE = 0.0275;
const SHIF_MIN = 300;
const HOUSING_LEVY_RATE = 0.015;
const MAX_PENSION_DEDUCTION = 30000;
const MAX_MORTGAGE_DEDUCTION = 30000; // raised to KES 30,000/mo (360,000/yr) by Tax Laws (Amendment) Act 2024
const MAX_INSURANCE_RELIEF = 5000;


// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatCompact = (amount) => {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
  return amount.toString();
};

const calculateNSSF = (grossSalary) => {
  const pensionableEarnings = Math.min(grossSalary, NSSF_UPPER_LIMIT);
  return pensionableEarnings * NSSF_RATE;
};

const calculateSHIF = (grossSalary) => {
  if (grossSalary <= 0) return 0;
  const shif = grossSalary * SHIF_RATE;
  return Math.max(shif, SHIF_MIN);
};

const calculateHousingLevy = (grossSalary) => {
  return grossSalary * HOUSING_LEVY_RATE;
};

const calculatePAYE = (taxableIncome, hasDisability = false) => {
  let tax = 0;
  let remainingIncome = Math.max(0, taxableIncome - (hasDisability ? DISABILITY_RELIEF : 0));

  for (const band of TAX_BANDS) {
    if (remainingIncome <= 0) break;
    const taxableInBand = Math.min(remainingIncome, band.max - band.min);
    tax += taxableInBand * band.rate;
    remainingIncome -= taxableInBand;
  }

  // Apply personal relief
  let relief = PERSONAL_RELIEF;
  // Disability exemption reduces income before bands, not the tax bill.
  tax = Math.max(0, tax - relief);

  return tax;
};

const getTaxBandBreakdown = (taxableIncome) => {
  const breakdown: any[] = [];
  let remainingIncome = taxableIncome;

  for (const band of TAX_BANDS) {
    if (remainingIncome <= 0) {
      breakdown.push({ ...band, amount: 0, tax: 0 });
      continue;
    }
    const taxableInBand = Math.min(remainingIncome, band.max - band.min);
    const tax = taxableInBand * band.rate;
    breakdown.push({ ...band, amount: taxableInBand, tax });
    remainingIncome -= taxableInBand;
  }

  return breakdown;
};

// Reverse calculation - Net to Gross
const calculateGrossFromNet = (targetNet, deductions) => {
  let low = targetNet;
  let high = targetNet * 3;

  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const calc = fullCalculation(mid, deductions);

    if (Math.abs(calc.netSalary - targetNet) < 1) {
      return mid;
    }

    if (calc.netSalary > targetNet) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return (low + high) / 2;
};

// Full calculation function
const fullCalculation = (grossSalary, options: any = {}) => {
  const {
    pensionContribution = 0,
    mortgageInterest = 0,
    insurancePremium = 0,
    hasDisability = false,
    helbRepayment = 0,
    saccoContribution = 0,
    unionDues = 0,
    carBenefit = 0,
    housingBenefit = 0,
    otherTaxableBenefits = 0
  } = options;

  // Calculate benefits in kind
  const carBenefitAmount = Math.max(0, Number(carBenefit) || 0);
  const housingBenefitTaxable = Math.max(0, housingBenefit);
  const totalBenefits = carBenefitAmount + housingBenefitTaxable + otherTaxableBenefits;

  // Adjusted gross for tax purposes
  const adjustedGross = grossSalary + totalBenefits;

  const nssf = calculateNSSF(grossSalary);
  const shif = calculateSHIF(grossSalary);
  const housingLevy = calculateHousingLevy(grossSalary);

  // Calculate allowable deductions
  const pensionLimit = Math.min(grossSalary * 0.30, MAX_PENSION_DEDUCTION);
  const maxPension = Math.min(Math.max(0, pensionContribution), Math.max(0, pensionLimit - nssf));
  const maxMortgage = Math.min(mortgageInterest, MAX_MORTGAGE_DEDUCTION);
  const insuranceRelief = Math.min(insurancePremium * 0.15, MAX_INSURANCE_RELIEF);

  // Taxable income
  const taxableIncome = adjustedGross - nssf - shif - housingLevy - maxPension - maxMortgage;
  const paye = calculatePAYE(Math.max(0, taxableIncome), hasDisability);
  const finalPAYE = Math.max(0, paye - insuranceRelief);

  // Statutory deductions
  const statutoryDeductions = finalPAYE + nssf + shif + housingLevy;

  // Voluntary deductions (after tax)
  const voluntaryDeductions = helbRepayment + saccoContribution + unionDues + pensionContribution;

  const totalDeductions = statutoryDeductions + voluntaryDeductions;
  const netSalary = grossSalary - totalDeductions;

  const effectiveTaxRate = grossSalary > 0 ? (finalPAYE / grossSalary) * 100 : 0;
  const totalDeductionRate = grossSalary > 0 ? (totalDeductions / grossSalary) * 100 : 0;

  // Employer costs
  const employerNSSF = nssf; // Employer matches NSSF
  const employerHousingLevy = housingLevy; // Employer matches housing levy
  const totalEmployerCost = grossSalary + employerNSSF + employerHousingLevy;

  return {
    grossSalary,
    adjustedGross,
    nssf,
    shif,
    housingLevy,
    taxableIncome: Math.max(0, taxableIncome),
    paye: finalPAYE,
    statutoryDeductions,
    voluntaryDeductions,
    totalDeductions,
    netSalary,
    effectiveTaxRate,
    totalDeductionRate,
    taxBandBreakdown: getTaxBandBreakdown(Math.max(0, taxableIncome - (hasDisability ? DISABILITY_RELIEF : 0))),
    insuranceRelief,
    helbRepayment,
    saccoContribution,
    unionDues,
    carBenefitAmount,
    housingBenefitTaxable,
    totalBenefits,
    employerNSSF,
    employerHousingLevy,
    totalEmployerCost,
    maxPension,
    maxMortgage
  };
};

// Animated Counter Component
const AnimatedValue = ({ value, prefix = '', suffix = '' }) => (
  <span>{prefix}{formatCurrency(Math.round(value))}{suffix}</span>
);

// Progress Bar Component
const ProgressBar = ({ label, value, max, color, icon: Icon }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color }} />
          <span className="text-sm text-stone-300">{label}</span>
        </div>
        <span className="text-sm font-medium text-white">{formatCurrency(value)}</span>
      </div>
      <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const TOOL_HERO: Record<string, { h1: string; pre: string; em: string; post: string; desc: string }> = {
  reverse: {
    h1: 'Net to Gross Salary Calculator Kenya 2026',
    pre: 'Work it ', em: 'backwards', post: '.',
    desc: 'Know the take-home you want? Find the gross salary you need to negotiate for. Enter a target net pay and this reverses the 2026 PAYE, NSSF, SHIF and Housing Levy maths to show the matching gross.',
  },
  bonus: {
    h1: 'Bonus Tax Calculator Kenya 2026',
    pre: 'Keep more of your ', em: 'bonus', post: '.',
    desc: 'A bonus is taxed at your top marginal PAYE band, so it never lands whole. Enter your salary and bonus to see the tax, the net you actually receive, and the effective rate on the extra pay.',
  },
  raise: {
    h1: 'Pay Rise Calculator Kenya 2026',
    pre: 'See what a raise ', em: 'really', post: ' adds.',
    desc: 'A headline percentage is not what hits your account. This works out how much of a pay rise survives PAYE, NSSF, SHIF and Housing Levy, per month and per year, so you can judge an offer properly.',
  },
  employer: {
    h1: 'Employer Cost Calculator Kenya 2026',
    pre: 'The true cost to ', em: 'employ', post: '.',
    desc: 'Gross salary is only part of the bill. Employers also match NSSF and the Housing Levy. Enter a salary to see the full monthly cost of employment in Kenya under the 2026 rates.',
  },
  compare: {
    h1: 'Salary Comparison Calculator Kenya 2026',
    pre: 'Compare salaries ', em: 'side by side', post: '.',
    desc: 'See how PAYE, net pay and the effective tax rate change as gross salary rises across Kenya’s 2026 bands, from entry level to executive, in one chart and table.',
  },
};

// Main Component
export default function PAYECalculatorV2({ defaultTab = 'calculator', single = false }: { defaultTab?: string; single?: boolean }) {
  const [activeTab] = useState(defaultTab);
  const [grossSalary, setGrossSalary] = useState(100000);
  const [targetNetSalary, setTargetNetSalary] = useState(75000);
  const [bonusAmount, setBonusAmount] = useState(50000);
  const [raisePercent, setRaisePercent] = useState(10);

  // Deductions & Reliefs
  const [pensionContribution, setPensionContribution] = useState(0);
  const [mortgageInterest, setMortgageInterest] = useState(0);
  const [insurancePremium, setInsurancePremium] = useState(0);
  const [hasDisability, setHasDisability] = useState(false);

  // Voluntary Deductions
  const [helbRepayment, setHelbRepayment] = useState(0);
  const [saccoContribution, setSaccoContribution] = useState(0);
  const [unionDues, setUnionDues] = useState(0);

  // Benefits in Kind
  const [carBenefit, setCarBenefit] = useState(0);
  const [housingBenefit, setHousingBenefit] = useState(0);
  const [otherBenefits, setOtherBenefits] = useState(0);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  const deductionOptions = {
    pensionContribution,
    mortgageInterest,
    insurancePremium,
    hasDisability,
    helbRepayment,
    saccoContribution,
    unionDues,
    carBenefit,
    housingBenefit,
    otherTaxableBenefits: otherBenefits
  };

  const calculations = useMemo(() => fullCalculation(grossSalary, deductionOptions),
    [grossSalary, pensionContribution, mortgageInterest, insurancePremium, hasDisability,
     helbRepayment, saccoContribution, unionDues, carBenefit, housingBenefit, otherBenefits]);

  // Net to Gross calculation
  const grossFromNet = useMemo(() => calculateGrossFromNet(targetNetSalary, deductionOptions), [targetNetSalary, deductionOptions]);
  const reverseCalc = useMemo(() => fullCalculation(grossFromNet, deductionOptions), [grossFromNet, deductionOptions]);

  // Bonus calculation (taxed at marginal rate)
  const bonusCalc = useMemo(() => {
    const withBonus = fullCalculation(grossSalary + bonusAmount, deductionOptions);
    const bonusTax = withBonus.paye - calculations.paye;
    const netBonus = bonusAmount - bonusTax;
    const bonusTaxRate = (bonusTax / bonusAmount) * 100;
    return { bonusTax, netBonus, bonusTaxRate };
  }, [grossSalary, bonusAmount, calculations.paye, deductionOptions]);

  // Raise analyser — how much of a pay rise you keep after tax
  const raiseCalc = useMemo(() => {
    const newGross = Math.round(grossSalary * (1 + raisePercent / 100));
    const newCalc = fullCalculation(newGross, deductionOptions);
    const grossIncrease = newGross - grossSalary;
    const monthlyNetGain = newCalc.netSalary - calculations.netSalary;
    const keptPercent = grossIncrease > 0 ? (monthlyNetGain / grossIncrease) * 100 : 0;
    return { newGross, newNet: newCalc.netSalary, grossIncrease, monthlyNetGain, annualNetGain: monthlyNetGain * 12, keptPercent };
  }, [grossSalary, raisePercent, calculations.netSalary, deductionOptions]);

  const salaryProgression = [30000, 50000, 75000, 100000, 150000, 200000, 300000, 500000, 800000, 1000000].map(salary => {
    const calc = fullCalculation(salary, {});
    return {
      salary: formatCompact(salary),
      gross: salary,
      net: calc.netSalary,
      paye: calc.paye,
      effectiveRate: Math.round(calc.effectiveTaxRate * 10) / 10
    };
  });

  const employerCostData = [
    { name: 'Gross Salary', value: calculations.grossSalary, color: '#C73B2F' },
    { name: 'Employer NSSF', value: calculations.employerNSSF, color: '#F04C40' },
    { name: 'Employer Housing', value: calculations.employerHousingLevy, color: '#F5B9B2' },
  ];

  return (
    <div className={`paye-app min-h-screen bg-white overflow-x-hidden ${!single ? 'editorial-home' : ''}`}>

      {/* Hero — the single shared component, identical on every calculator page */}
      {!single ? <EditorialHero /> : <Hero
        h1={single && TOOL_HERO[activeTab] ? TOOL_HERO[activeTab].h1 : 'PAYE Calculator Kenya 2026 — Net Salary'}
        pre={single && TOOL_HERO[activeTab] ? TOOL_HERO[activeTab].pre : 'Calculate your '}
        em={single && TOOL_HERO[activeTab] ? TOOL_HERO[activeTab].em : 'take-home'}
        post={single && TOOL_HERO[activeTab] ? TOOL_HERO[activeTab].post : '.'}
        desc={single && TOOL_HERO[activeTab] ? TOOL_HERO[activeTab].desc : 'Free Kenya PAYE and salary calculator. Works out your monthly net pay after PAYE tax, NSSF pension, SHIF (former NHIF), Housing Levy, HELB, SACCO and benefits in kind, using 2026 KRA tax bands.'}
        active={activeTab}
      />}

      <div className="paye-calc-body relative z-10 px-4 md:px-6 pt-8 pb-16 bg-white">
        <div className="max-w-5xl mx-auto">

          {/* Main Calculator Tab */}
          {activeTab === 'calculator' && (
            <div className={`space-y-6 transition-all duration-500 ${animated ? 'opacity-100' : 'opacity-0'}`}>

              <section id="salary-calculator" className="salary-desk" aria-label="Salary calculator">
                <div className="salary-desk-input">
                  <label htmlFor="gross-monthly-salary">Monthly gross salary <span>· KES</span></label>
                  <div className="salary-entry"><span aria-hidden="true">KES</span><input id="gross-monthly-salary" type="number" inputMode="numeric" min="0" max="100000000" step="1000" value={grossSalary} onChange={(e) => setGrossSalary(Math.min(100000000, Math.max(0, Number(e.target.value) || 0)))} /></div>
                  <div className="salary-presets">{[50000, 100000, 150000, 250000].map(amount => <button type="button" key={amount} aria-pressed={grossSalary === amount} onClick={() => setGrossSalary(amount)}>{formatCompact(amount)}</button>)}</div>
                  <p>Updates instantly as you type. Add reliefs and deductions below.</p>
                </div>
                <div className="salary-desk-result" aria-live="polite" aria-atomic="true">
                  <span>Your take-home pay</span>
                  <strong>{formatCurrency(calculations.netSalary)}</strong>
                  <p>Estimated per month · {(100 - calculations.totalDeductionRate).toFixed(1)}% of gross</p>
                  <a href="#payroll-details">See your deductions <span aria-hidden="true">↓</span></a>
                </div>
              </section>
              {!single && <EditorialGuides />}
              <div id="payroll-details" className="payroll-detail-heading"><span className="editorial-kicker">The numbers behind your salary</span><h2>Your pay. Broken down.</h2></div>

              {/* Payslip — the polished, gated PDF lives on its own page */}
              <div className="flex justify-center">
                <a
                  href="/payslip-generator"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-medium transition-all"
                >
                  <Download className="w-4 h-4" />
                  Make a payslip (PDF)
                </a>
              </div>

              {/* Quick Results */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="col-span-2 bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-stone-400 text-sm">Net Salary</span>
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-emerald-400">
                    <AnimatedValue value={calculations.netSalary} />
                  </div>
                  <p className="text-stone-500 text-xs mt-1">{(100 - calculations.totalDeductionRate).toFixed(1)}% of gross</p>
                </div>

                <div className="bg-gradient-to-br from-red-600/20 to-red-900/20 backdrop-blur-xl rounded-2xl border border-red-500/20 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-4 h-4 text-red-400" />
                    <span className="text-stone-400 text-sm">PAYE</span>
                  </div>
                  <div className="text-xl font-bold text-red-400">{formatCurrency(calculations.paye)}</div>
                  <p className="text-stone-500 text-xs mt-1">{calculations.effectiveTaxRate.toFixed(1)}% rate</p>
                </div>

                <div className="bg-gradient-to-br from-amber-600/20 to-amber-900/20 backdrop-blur-xl rounded-2xl border border-amber-500/20 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Minus className="w-4 h-4 text-amber-400" />
                    <span className="text-stone-400 text-sm">Deductions</span>
                  </div>
                  <div className="text-xl font-bold text-amber-400">{formatCurrency(calculations.totalDeductions)}</div>
                  <p className="text-stone-500 text-xs mt-1">{calculations.totalDeductionRate.toFixed(1)}% total</p>
                </div>
              </div>

              {/* Statutory Deductions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'NSSF Pension', value: calculations.nssf, icon: Shield, color: '#C73B2F', desc: '6% to 108K' },
                  { label: 'SHIF Health', value: calculations.shif, icon: Heart, color: '#2a0f0c', desc: '2.75%' },
                  { label: 'Housing Levy', value: calculations.housingLevy, icon: Home, color: '#F5B9B2', desc: '1.5%' },
                  { label: 'Taxable Income', value: calculations.taxableIncome, icon: Briefcase, color: '#F04C40', desc: 'After allowable deductions' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className="w-4 h-4" style={{ color: item.color }} />
                      <span className="text-stone-400 text-xs">{item.label}</span>
                    </div>
                    <div className="text-lg font-bold text-white">{formatCurrency(item.value)}</div>
                    <p className="text-stone-600 text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Voluntary Deductions */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 flex items-center justify-between hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-pink-400" />
                  <span className="font-medium">HELB, SACCO & Other Deductions</span>
                </div>
                {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {showAdvanced && (
                <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-stone-400 mb-2">HELB Repayment</label>
                    <input
                      type="number"
                      value={helbRepayment}
                      onChange={(e) => setHelbRepayment(Number(e.target.value))}
                      className="w-full bg-stone-800/50 border border-stone-700 rounded-lg py-2.5 px-3 text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-400 mb-2">SACCO Contribution</label>
                    <input
                      type="number"
                      value={saccoContribution}
                      onChange={(e) => setSaccoContribution(Number(e.target.value))}
                      className="w-full bg-stone-800/50 border border-stone-700 rounded-lg py-2.5 px-3 text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-400 mb-2">Union Dues</label>
                    <input
                      type="number"
                      value={unionDues}
                      onChange={(e) => setUnionDues(Number(e.target.value))}
                      className="w-full bg-stone-800/50 border border-stone-700 rounded-lg py-2.5 px-3 text-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              {/* Tax Reliefs */}
              <button
                onClick={() => setShowBenefits(!showBenefits)}
                className="w-full bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 flex items-center justify-between hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <PiggyBank className="w-5 h-5 text-emerald-400" />
                  <span className="font-medium">Tax Reliefs & Benefits in Kind</span>
                </div>
                {showBenefits ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {showBenefits && (
                <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-stone-400 mb-2">Extra Pension (NSSF shares tax limit)</label>
                      <input
                        type="number"
                        value={pensionContribution}
                        onChange={(e) => setPensionContribution(Number(e.target.value))}
                        className="w-full bg-stone-800/50 border border-stone-700 rounded-lg py-2.5 px-3 text-white"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-stone-400 mb-2">Mortgage Interest (max 30K)</label>
                      <input
                        type="number"
                        value={mortgageInterest}
                        onChange={(e) => setMortgageInterest(Number(e.target.value))}
                        className="w-full bg-stone-800/50 border border-stone-700 rounded-lg py-2.5 px-3 text-white"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-stone-400 mb-2">Insurance Premium</label>
                      <input
                        type="number"
                        value={insurancePremium}
                        onChange={(e) => setInsurancePremium(Number(e.target.value))}
                        className="w-full bg-stone-800/50 border border-stone-700 rounded-lg py-2.5 px-3 text-white"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-sm font-medium text-stone-300 mb-3">Benefits in Kind (Taxable)</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="car-benefit" className="block text-sm text-stone-400 mb-2">Taxable car benefit (monthly KES)</label>
                        <input id="car-benefit" type="number" min="0" value={carBenefit}
                          onChange={(e) => setCarBenefit(Math.max(0, Number(e.target.value)))}
                          className="w-full bg-stone-800/50 border border-stone-700 rounded-lg py-2.5 px-3 text-white" />
                        <p className="text-xs text-stone-400 mt-2">Enter the taxable value confirmed by payroll, not the car cost. <a href="/blog/taxable-benefits-in-kind-that-kenyan-employers-must-declare" className="underline">Benefit valuation guide</a>.</p>
                      </div>
                      <div>
                        <label className="block text-sm text-stone-400 mb-2">Taxable Housing Benefit (monthly KES)</label>
                        <input
                          type="number"
                          value={housingBenefit}
                          onChange={(e) => setHousingBenefit(Number(e.target.value))}
                          className="w-full bg-stone-800/50 border border-stone-700 rounded-lg py-2.5 px-3 text-white"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-stone-400 mb-2">Other Taxable Benefits (monthly KES)</label>
                        <input
                          type="number"
                          value={otherBenefits}
                          onChange={(e) => setOtherBenefits(Number(e.target.value))}
                          className="w-full bg-stone-800/50 border border-stone-700 rounded-lg py-2.5 px-3 text-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="disability"
                      checked={hasDisability}
                      onChange={(e) => setHasDisability(e.target.checked)}
                      className="w-4 h-4 rounded bg-stone-800 border-stone-700"
                    />
                    <label htmlFor="disability" className="text-sm text-stone-300">
                      Valid KRA disability exemption certificate — KES 150,000 income exemption
                    </label>
                  </div>
                </div>
              )}

              <SalaryStory pay={calculations} pension={pensionContribution} />

            </div>
          )}

          {/* Net to Gross Tab */}
          {activeTab === 'reverse' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Net → Gross Calculator</h2>
                    <p className="text-stone-400 text-sm">Find out what gross you need for your desired take-home</p>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-stone-400 mb-2">I want to take home:</p>
                  <div className="text-5xl md:text-7xl font-black text-purple-400 mb-1 tabular-nums">
                    {formatCurrency(targetNetSalary)}
                  </div>
                </div>

                <input
                  type="range"
                  min="10000"
                  max="1500000"
                  step="5000"
                  value={targetNetSalary}
                  onChange={(e) => setTargetNetSalary(Number(e.target.value))}
                  className="w-full h-3 bg-stone-800 rounded-full appearance-none cursor-pointer mb-6"
                  style={{
                    background: `linear-gradient(to right, #8B5CF6 0%, #EC4899 ${(targetNetSalary - 10000) / (1500000 - 10000) * 100}%, #374151 ${(targetNetSalary - 10000) / (1500000 - 10000) * 100}%, #374151 100%)`
                  }}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-2xl p-5 text-center">
                    <p className="text-stone-400 mb-2">You need a gross salary of:</p>
                    <div className="text-4xl font-black text-white">{formatCurrency(grossFromNet)}</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5 text-center">
                    <p className="text-stone-400 mb-2">Total deductions will be:</p>
                    <div className="text-4xl font-black text-red-400">{formatCurrency(reverseCalc.totalDeductions)}</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-stone-400 text-sm">PAYE Tax</p>
                  <p className="text-xl font-bold text-red-400">{formatCurrency(reverseCalc.paye)}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-stone-400 text-sm">NSSF</p>
                  <p className="text-xl font-bold text-blue-400">{formatCurrency(reverseCalc.nssf)}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-stone-400 text-sm">SHIF</p>
                  <p className="text-xl font-bold text-purple-400">{formatCurrency(reverseCalc.shif)}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-stone-400 text-sm">Housing Levy</p>
                  <p className="text-xl font-bold text-amber-400">{formatCurrency(reverseCalc.housingLevy)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Raise Analyser Tab */}
          {activeTab === 'raise' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-900/20 backdrop-blur-xl rounded-3xl border border-indigo-500/20 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Pay Raise Analyser</h2>
                    <p className="text-stone-400 text-sm">See how much of a raise you actually keep after tax</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-stone-400 mb-2">Current monthly gross</label>
                    <input
                      type="number"
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(Number(e.target.value))}
                      className="w-full text-3xl font-bold bg-transparent border-b-2 border-brand py-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-2">Raise (%)</label>
                    <input
                      type="number"
                      value={raisePercent}
                      onChange={(e) => setRaisePercent(Number(e.target.value))}
                      className="w-full text-3xl font-bold bg-transparent border-b-2 border-brand py-2 text-white focus:outline-none"
                    />
                    <p className="text-stone-500 text-sm mt-1">New gross: {formatCurrency(raiseCalc.newGross)}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-600/30 to-emerald-900/30 rounded-2xl p-5 text-center">
                    <p className="text-stone-400 mb-2">Extra take-home / month</p>
                    <div className="text-4xl font-black text-emerald-400">{formatCurrency(raiseCalc.monthlyNetGain)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-600/30 to-amber-900/30 rounded-2xl p-5 text-center">
                    <p className="text-stone-400 mb-2">You keep</p>
                    <div className="text-4xl font-black text-amber-400">{raiseCalc.keptPercent.toFixed(0)}%</div>
                    <p className="text-stone-500 text-xs mt-1">of the gross increase</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-600/30 to-indigo-900/30 rounded-2xl p-5 text-center">
                    <p className="text-stone-400 mb-2">Extra per year</p>
                    <div className="text-4xl font-black text-indigo-300">{formatCurrency(raiseCalc.annualNetGain)}</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <p className="text-stone-400 text-sm">
                    <Info className="w-4 h-4 inline mr-2" />
                    A {raisePercent}% raise lifts your gross by {formatCurrency(raiseCalc.grossIncrease)}, but after PAYE, NSSF, SHIF and Housing Levy you take home about {formatCurrency(raiseCalc.monthlyNetGain)} more a month — roughly {raiseCalc.keptPercent.toFixed(0)}% of the increase.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bonus Calculator Tab */}
          {activeTab === 'bonus' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-pink-600/20 to-pink-900/20 backdrop-blur-xl rounded-3xl border border-pink-500/20 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Bonus & 13th Month Calculator</h2>
                    <p className="text-stone-400 text-sm">See how much you'll actually receive from your bonus</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-stone-400 mb-2">Your current monthly gross</label>
                    <input
                      type="number"
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(Number(e.target.value))}
                      className="w-full text-3xl font-bold bg-transparent border-b-2 border-brand py-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-2">Bonus amount</label>
                    <input
                      type="number"
                      value={bonusAmount}
                      onChange={(e) => setBonusAmount(Number(e.target.value))}
                      className="w-full text-3xl font-bold bg-transparent border-b-2 border-brand py-2 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-600/30 to-emerald-900/30 rounded-2xl p-5 text-center">
                    <p className="text-stone-400 mb-2">Net Bonus (Take Home)</p>
                    <div className="text-4xl font-black text-emerald-400">{formatCurrency(bonusCalc.netBonus)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-600/30 to-red-900/30 rounded-2xl p-5 text-center">
                    <p className="text-stone-400 mb-2">Tax on Bonus</p>
                    <div className="text-4xl font-black text-red-400">{formatCurrency(bonusCalc.bonusTax)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-600/30 to-amber-900/30 rounded-2xl p-5 text-center">
                    <p className="text-stone-400 mb-2">Effective Bonus Tax Rate</p>
                    <div className="text-4xl font-black text-amber-400">{bonusCalc.bonusTaxRate.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <p className="text-stone-400 text-sm">
                    <Info className="w-4 h-4 inline mr-2" />
                    Bonuses are taxed at your marginal tax rate (the rate of your highest tax band).
                    Based on your salary of {formatCurrency(grossSalary)}, your bonus is taxed at approximately {bonusCalc.bonusTaxRate.toFixed(0)}%.
                  </p>
                </div>
              </div>

              {/* Bonus split — one bold stacked bar: what you keep vs the taxman.
                  Inline colours bypass the light-theme .text-white / bg remap. */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
                <h3 className="text-lg font-bold mb-1">Where your bonus goes</h3>
                <p className="text-sm text-stone-400 mb-4">Splitting your {formatCurrency(bonusAmount)} bonus</p>
                {(() => {
                  const net = bonusCalc.netBonus
                  const tax = bonusCalc.bonusTax
                  const total = net + tax || 1
                  const netPct = Math.round((net / total) * 100)
                  const taxPct = 100 - netPct
                  return (
                    <>
                      <div className="flex h-16 w-full overflow-hidden rounded-xl shadow-sm">
                        <div
                          className="flex flex-col items-center justify-center transition-all duration-700"
                          style={{ width: `${netPct}%`, backgroundColor: '#F04C40' }}
                        >
                          <span className="text-base font-extrabold leading-none" style={{ color: '#fff' }}>{netPct}%</span>
                          <span className="mt-0.5 text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>You keep</span>
                        </div>
                        <div
                          className="flex flex-col items-center justify-center transition-all duration-700"
                          style={{ width: `${taxPct}%`, backgroundColor: '#8A2820' }}
                        >
                          <span className="text-base font-extrabold leading-none" style={{ color: '#fff' }}>{taxPct}%</span>
                          <span className="mt-0.5 text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>Tax</span>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-stone-200 p-3">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#F04C40' }} />
                            <span className="text-xs text-stone-500">Net you keep</span>
                          </div>
                          <p className="text-xl font-bold" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>{formatCurrency(net)}</p>
                        </div>
                        <div className="rounded-xl border border-stone-200 p-3">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#8A2820' }} />
                            <span className="text-xs text-stone-500">Lost to tax</span>
                          </div>
                          <p className="text-xl font-bold" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>{formatCurrency(tax)}</p>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}

          {/* Employer Cost Tab */}
          {activeTab === 'employer' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur-xl rounded-3xl border border-blue-500/20 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Total Employer Cost</h2>
                    <p className="text-stone-400 text-sm">What it actually costs to employ someone</p>
                  </div>
                </div>

                <div className="max-w-xs mx-auto mb-6">
                  <label className="block text-stone-400 mb-2 text-center text-sm">Monthly gross salary</label>
                  <input
                    type="number"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(Number(e.target.value))}
                    className="w-full text-3xl font-bold bg-transparent border-b-2 border-brand py-2 text-white text-center focus:outline-none"
                  />
                </div>

                <div className="text-center mb-6">
                  <div className="text-5xl md:text-7xl font-black text-blue-400">{formatCurrency(calculations.totalEmployerCost)}</div>
                  <p className="text-stone-500 mt-2">Total cost to employer per month</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-5 text-center">
                    <Wallet className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-stone-400 text-sm">Gross Salary</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(grossSalary)}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-5 text-center">
                    <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-stone-400 text-sm">Employer NSSF (6%)</p>
                    <p className="text-2xl font-bold text-blue-400">{formatCurrency(calculations.employerNSSF)}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-5 text-center">
                    <Home className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <p className="text-stone-400 text-sm">Employer Housing (1.5%)</p>
                    <p className="text-2xl font-bold text-amber-400">{formatCurrency(calculations.employerHousingLevy)}</p>
                  </div>
                </div>
              </div>

              {/* Employer cost pie */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
                <h3 className="text-lg font-bold mb-4">Employer Cost Breakdown</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={employerCostData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {employerCostData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                      <Legend formatter={(v) => <span className="text-stone-300 text-sm">{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-blue-300 text-sm">
                  <Info className="w-4 h-4 inline mr-2" />
                  Employers must match employee NSSF and Housing Levy contributions.
                  This adds {formatCurrency(calculations.employerNSSF + calculations.employerHousingLevy)} ({((calculations.employerNSSF + calculations.employerHousingLevy) / grossSalary * 100).toFixed(1)}%)
                  to the cost of employment beyond gross salary.
                </p>
              </div>
            </div>
          )}

          {/* Compare Tab */}
          {activeTab === 'compare' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-amber-400" />
                  Salary Comparison Guide
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={salaryProgression}>
                      <XAxis dataKey="salary" stroke="#888" />
                      <YAxis yAxisId="left" tickFormatter={(v) => formatCompact(v)} stroke="#888" />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} stroke="#888" />
                      <Tooltip formatter={(v, name) => name === 'effectiveRate' ? `${v}%` : formatCurrency(v)} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="gross" name="Gross" fill="#888" fillOpacity={0.3} radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="left" dataKey="net" name="Net" fill="#F04C40" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="effectiveRate" name="Effective Tax %" stroke="#8A2820" strokeWidth={3} dot={{ fill: '#8A2820' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Salary table */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-stone-400 font-medium">Gross Salary</th>
                      <th className="text-right py-3 px-4 text-stone-400 font-medium">PAYE Tax</th>
                      <th className="text-right py-3 px-4 text-stone-400 font-medium">Net Salary</th>
                      <th className="text-right py-3 px-4 text-stone-400 font-medium">Effective Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryProgression.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 font-medium">{formatCurrency(row.gross)}</td>
                        <td className="py-3 px-4 text-right text-red-400">{formatCurrency(row.paye)}</td>
                        <td className="py-3 px-4 text-right text-emerald-400">{formatCurrency(row.net)}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            row.effectiveRate < 15 ? 'bg-emerald-500/20 text-emerald-400' :
                            row.effectiveRate < 25 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {row.effectiveRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tax Bands Reference */}
          <div className="mt-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-stone-400" />
              2026 Kenya PAYE Tax Bands
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-3 text-stone-400 text-sm">Monthly Band</th>
                    <th className="text-center py-2 px-3 text-stone-400 text-sm">Rate</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {TAX_BANDS.map((band, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 px-3">
                        {band.max === Infinity
                          ? `Above ${formatCurrency(band.min)}`
                          : `${formatCurrency(band.min)} - ${formatCurrency(band.max)}`}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${band.color}20`, color: band.color }}>
                          {band.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-stone-500 text-xs mt-3">Personal Relief: KES 2,400/month automatically applied</p>
          </div>

        </div>
      </div>

      {/* Homepage-only marketing sections. Tool pages keep their own server-rendered content. */}
      {!single && (
      <>
      {/* ================= SALARY BENCHMARKS — dark contained panel ================= */}
      <div className="bg-white px-4 sm:px-6 pb-6">
        <section className="max-w-5xl mx-auto bg-[#111] text-white rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="px-5 sm:px-8 md:px-10 py-12 sm:py-14">
            <div className="flex items-baseline justify-between mb-4">
            </div>
            <h2 className="editorial-h text-[26px] sm:text-[32px] mb-8" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              Salary <span className="italic" style={{ color: '#F04C40' }}>benchmarks</span>
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { gross: 50000 },
                { gross: 75000 },
                { gross: 100000 },
                { gross: 150000 },
                { gross: 200000 },
                { gross: 300000 },
              ].map((row) => (
                <a
                  key={row.gross}
                  href={`/salary/${row.gross}`}
                  className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-[#F04C40]/50 transition-all"
                >
                  <div>
                    <p className="text-[14px] font-medium m-0 text-white">Ksh {row.gross.toLocaleString()}</p>
                    <p className="text-[10px] text-white/60 m-0 tracking-wider uppercase">Monthly gross</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-medium m-0" style={{ color: '#F04C40' }}>{Math.round(fullCalculation(row.gross).netSalary).toLocaleString()}</p>
                    <p className="text-[10px] text-white/60 m-0">take-home</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ================= TOOLS & GUIDES — cream contained panel ================= */}
      <div className="bg-white px-4 sm:px-6 pb-8">
        <section className="max-w-5xl mx-auto bg-brand-50 rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="px-5 sm:px-8 md:px-10 py-12 sm:py-14">
            <div className="flex items-baseline justify-between mb-4">
            </div>
            <h2 className="editorial-h text-[26px] sm:text-[32px] mb-8 text-brand-900" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              Guides & <span className="italic text-brand">explainers</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { href: '/blog/how-to-calculate-your-paye-tax-in-kenya', title: 'How to calculate your PAYE', desc: 'Step-by-step using 2026 KRA bands' },
                { href: '/blog/the-complete-guide-to-nssf-contributions-in-kenya', title: 'NSSF contributions 2026', desc: '6% rate, 108K cap, what changed' },
                { href: '/blog/understanding-shif-deductions-in-kenya-and-what-replaced-nhif', title: 'SHIF replaces NHIF', desc: 'The new 2.75% health deduction' },
                { href: '/blog/everything-you-need-to-know-about-kenyas-housing-levy', title: "Kenya's Housing Levy", desc: 'Why 1.5% comes out of every salary' },
                { href: '/blog/legal-ways-to-reduce-paye-in-kenya', title: 'Legal ways to reduce your PAYE', desc: 'Pension, mortgage, insurance relief' },
                { href: '/blog/how-kenyan-employers-tax-your-bonus-and-13th-month-pay', title: 'Bonus & 13th month pay', desc: 'How your extras get taxed' },
              ].map((g) => (
                <a
                  key={g.href}
                  href={g.href}
                  className="group block p-5 bg-white rounded-xl border border-brand-300/50 hover:border-brand hover:-translate-y-0.5 transition-all"
                >
                  <h3 className="editorial-h text-[16px] text-[#111] m-0 mb-1 group-hover:text-brand transition-colors leading-snug" style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}>
                    {g.title}
                  </h3>
                  <p className="text-[12px] text-[#666] m-0 leading-relaxed">{g.desc}</p>
                </a>
              ))}
            </div>

            <div className="text-center mt-8">
              <a href="/blog" className="inline-flex items-center gap-2 text-brand-700 hover:text-brand text-[13px] font-medium">
                See all 30 guides →
              </a>
            </div>
          </div>
        </section>
      </div>
      </>
      )}
    </div>
  );
}
