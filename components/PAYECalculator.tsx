'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Treemap, FunnelChart, Funnel, LabelList } from 'recharts';
import { Calculator, TrendingUp, Wallet, Building2, Heart, Shield, ChevronDown, ChevronUp, Info, Sparkles, ArrowRight, Minus, Plus, DollarSign, PiggyBank, Home, Briefcase, Car, Users, GraduationCap, Utensils, Gift, ArrowLeftRight, Building, Percent, Target, Zap, BarChart3, PieChartIcon, Activity, Gauge, TrendingDown, RefreshCw, CircleDollarSign, BadgePercent, Landmark, HandCoins, Download } from 'lucide-react';

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

// Car benefit rates based on CC
const CAR_BENEFIT_RATES = {
  'none': 0,
  'below1500': 3600,
  '1500to2000': 4800,
  '2000to3000': 7200,
  'above3000': 12000
};

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
  const shif = grossSalary * SHIF_RATE;
  return Math.max(shif, SHIF_MIN);
};

const calculateHousingLevy = (grossSalary) => {
  return grossSalary * HOUSING_LEVY_RATE;
};

const calculatePAYE = (taxableIncome, hasDisability = false) => {
  let tax = 0;
  let remainingIncome = taxableIncome;
  
  for (const band of TAX_BANDS) {
    if (remainingIncome <= 0) break;
    const taxableInBand = Math.min(remainingIncome, band.max - band.min);
    tax += taxableInBand * band.rate;
    remainingIncome -= taxableInBand;
  }
  
  // Apply personal relief
  let relief = PERSONAL_RELIEF;
  if (hasDisability) relief += DISABILITY_RELIEF;
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
    carBenefit = 'none',
    housingBenefit = 0,
    otherTaxableBenefits = 0
  } = options;

  // Calculate benefits in kind
  const carBenefitAmount = CAR_BENEFIT_RATES[carBenefit] || 0;
  const housingBenefitTaxable = Math.min(housingBenefit, grossSalary * 0.15);
  const totalBenefits = carBenefitAmount + housingBenefitTaxable + otherTaxableBenefits;
  
  // Adjusted gross for tax purposes
  const adjustedGross = grossSalary + totalBenefits;
  
  const nssf = calculateNSSF(grossSalary);
  const shif = calculateSHIF(grossSalary);
  const housingLevy = calculateHousingLevy(grossSalary);
  
  // Calculate allowable deductions
  const maxPension = Math.min(pensionContribution, MAX_PENSION_DEDUCTION);
  const maxMortgage = Math.min(mortgageInterest, MAX_MORTGAGE_DEDUCTION);
  const insuranceRelief = Math.min(insurancePremium * 0.15, MAX_INSURANCE_RELIEF);
  
  // Taxable income
  const taxableIncome = adjustedGross - nssf - maxPension - maxMortgage;
  const paye = calculatePAYE(Math.max(0, taxableIncome), hasDisability);
  const finalPAYE = Math.max(0, paye - insuranceRelief);
  
  // Statutory deductions
  const statutoryDeductions = finalPAYE + nssf + shif + housingLevy;
  
  // Voluntary deductions (after tax)
  const voluntaryDeductions = helbRepayment + saccoContribution + unionDues;
  
  const totalDeductions = statutoryDeductions + voluntaryDeductions;
  const netSalary = grossSalary - totalDeductions;
  
  const effectiveTaxRate = (finalPAYE / grossSalary) * 100;
  const totalDeductionRate = (totalDeductions / grossSalary) * 100;
  
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
    taxBandBreakdown: getTaxBandBreakdown(Math.max(0, taxableIncome)),
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
const AnimatedValue = ({ value, prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 500;
    const steps = 20;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{prefix}{formatCurrency(Math.round(displayValue))}{suffix}</span>;
};

// Gauge Component
const GaugeChart = ({ value, max = 50, label, color = '#8A2820' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const rotation = (percentage / 100) * 180;
  
  return (
    <div className="relative w-40 h-24 mx-auto">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#ececec"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Colored arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${percentage * 2.51} 251`}
          style={{ transition: 'stroke-dasharray 1s ease-out' }}
        />
        {/* Center text */}
        <text x="100" y="85" textAnchor="middle" className="fill-white text-2xl font-bold">
          {value.toFixed(1)}%
        </text>
        <text x="100" y="100" textAnchor="middle" className="fill-stone-400 text-xs">
          {label}
        </text>
      </svg>
    </div>
  );
};

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

// Waterfall Chart Component
const WaterfallChart = ({ data }) => {
  let cumulative = 0;
  const waterfallData = data.map((item, index) => {
    const start = cumulative;
    cumulative += item.value;
    return {
      ...item,
      start,
      end: cumulative,
      isPositive: item.value >= 0
    };
  });

  return (
    <div className="space-y-2">
      {waterfallData.map((item, index) => (
        <div key={index} className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-stone-400">{item.name}</span>
            <span className={`text-sm font-medium ${item.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {item.isPositive ? '+' : ''}{formatCurrency(item.value)}
            </span>
          </div>
          <div className="h-8 bg-stone-800/50 rounded-lg relative overflow-hidden">
            <div 
              className={`absolute h-full rounded-lg transition-all duration-700 ${
                item.isPositive ? 'bg-brand' : 'bg-[#8A2820]'
              }`}
              style={{ 
                left: `${(item.start / waterfallData[0].value) * 100}%`,
                width: `${(Math.abs(item.value) / waterfallData[0].value) * 100}%`
              }}
            />
            <div className="absolute inset-0 flex items-center justify-end pr-3">
              {/* Running balance. Positive row = full red bar (white reads), deductions sit on the light track (dark reads). Inline colour bypasses the light-theme .text-white remap. */}
              <span className="text-xs font-bold" style={{ color: item.isPositive ? '#ffffff' : '#8A2820' }}>{formatCurrency(item.end)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Tool registry — each tab also lives at its own URL. On a dedicated page the
// hero tab bar renders these as links; on the homepage they switch in place.
const TOOLS = [
  { key: 'calculator', href: '/', icon: Calculator, label: 'Calculator' },
  { key: 'reverse', href: '/net-gross-calculator', icon: RefreshCw, label: 'Net → Gross' },
  { key: 'bonus', href: '/bonus-calculator', icon: Gift, label: 'Bonus' },
  { key: 'raise', href: '/raise-calculator', icon: TrendingUp, label: 'Raise' },
  { key: 'employer', href: '/employer-cost-calculator', icon: Building, label: 'Employer Cost' },
  { key: 'compare', href: '/salary-comparison', icon: BarChart3, label: 'Compare' },
];

// Per-tool hero copy used when the component is rendered as a standalone page.
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
  const [carBenefit, setCarBenefit] = useState('none');
  const [housingBenefit, setHousingBenefit] = useState(0);
  const [otherBenefits, setOtherBenefits] = useState(0);
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [printDate, setPrintDate] = useState('');

  useEffect(() => {
    setAnimated(true);
    setMounted(true);
    setPrintDate(new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }));
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

  // Chart Data
  const pieData = [
    { name: 'Net Salary', value: calculations.netSalary, color: '#F04C40' },
    { name: 'PAYE Tax', value: calculations.paye, color: '#8A2820' },
    { name: 'NSSF', value: calculations.nssf, color: '#C73B2F' },
    { name: 'SHIF', value: calculations.shif, color: '#2a0f0c' },
    { name: 'Housing Levy', value: calculations.housingLevy, color: '#F5B9B2' },
    ...(calculations.helbRepayment > 0 ? [{ name: 'HELB', value: calculations.helbRepayment, color: '#F04C40' }] : []),
    ...(calculations.saccoContribution > 0 ? [{ name: 'SACCO', value: calculations.saccoContribution, color: '#06B6D4' }] : []),
  ].filter(d => d.value > 0);

  const waterfallData = [
    { name: 'Gross Salary', value: calculations.grossSalary },
    { name: 'PAYE Tax', value: -calculations.paye },
    { name: 'NSSF', value: -calculations.nssf },
    { name: 'SHIF', value: -calculations.shif },
    { name: 'Housing Levy', value: -calculations.housingLevy },
    ...(calculations.helbRepayment > 0 ? [{ name: 'HELB', value: -calculations.helbRepayment }] : []),
    ...(calculations.saccoContribution > 0 ? [{ name: 'SACCO', value: -calculations.saccoContribution }] : []),
    ...(calculations.unionDues > 0 ? [{ name: 'Union Dues', value: -calculations.unionDues }] : []),
  ];

  const salaryProgression = [30000, 50000, 75000, 100000, 150000, 200000, 300000, 500000, 800000, 1000000].map(salary => {
    const calc = fullCalculation(salary, {});
    return {
      salary: formatCompact(salary),
      gross: salary,
      net: calc.netSalary,
      paye: calc.paye,
      effectiveRate: calc.effectiveTaxRate
    };
  });

  const taxEfficiencyData = [
    { subject: 'Take Home', A: 100 - calculations.totalDeductionRate, fullMark: 100 },
    { subject: 'Tax Efficiency', A: 100 - calculations.effectiveTaxRate, fullMark: 100 },
    { subject: 'NSSF Max', A: calculations.nssf >= calculateNSSF(NSSF_UPPER_LIMIT) ? 100 : (calculations.nssf / calculateNSSF(NSSF_UPPER_LIMIT)) * 100, fullMark: 100 },
    { subject: 'Relief Used', A: ((calculations.insuranceRelief + calculations.maxPension + calculations.maxMortgage) / (MAX_INSURANCE_RELIEF + MAX_PENSION_DEDUCTION + MAX_MORTGAGE_DEDUCTION)) * 100, fullMark: 100 },
  ];

  const employerCostData = [
    { name: 'Gross Salary', value: calculations.grossSalary, color: '#C73B2F' },
    { name: 'Employer NSSF', value: calculations.employerNSSF, color: '#F04C40' },
    { name: 'Employer Housing', value: calculations.employerHousingLevy, color: '#F5B9B2' },
  ];

  const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    net: calculations.netSalary,
    gross: calculations.grossSalary,
    cumNet: calculations.netSalary * (i + 1),
    cumGross: calculations.grossSalary * (i + 1),
    cumTax: calculations.paye * (i + 1)
  }));

  const deductionBreakdown = [
    { name: 'PAYE', value: calculations.paye, fill: '#8A2820' },
    { name: 'NSSF', value: calculations.nssf, fill: '#C73B2F' },
    { name: 'SHIF', value: calculations.shif, fill: '#2a0f0c' },
    { name: 'Housing', value: calculations.housingLevy, fill: '#F5B9B2' },
    { name: 'HELB', value: calculations.helbRepayment, fill: '#F04C40' },
    { name: 'SACCO', value: calculations.saccoContribution, fill: '#06B6D4' },
    { name: 'Union', value: calculations.unionDues, fill: '#84CC16' },
  ].filter(d => d.value > 0);

  return (
    <div className="paye-app min-h-screen bg-white overflow-x-hidden">

      {/* Hero — Bold Poster red, contained with rounded corners */}
      <div className="bg-white pt-4 sm:pt-6 px-4 sm:px-6">
        <header className="max-w-5xl mx-auto bg-brand text-white rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="px-5 sm:px-8 md:px-10 pt-10 sm:pt-14 pb-10">
            <div className={`transition-all duration-1000 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {/* SEO H1 — keyword-rich, crawler-priority. Tool pages get their own H1. */}
              <h1 className="text-[22px] sm:text-[28px] font-medium leading-tight mb-3 max-w-3xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                {single && TOOL_HERO[activeTab]
                  ? TOOL_HERO[activeTab].h1
                  : <>Kenya PAYE Calculator 2026 — Net Salary, NSSF, SHIF &amp; Housing Levy</>}
              </h1>

              {/* Editorial tagline — visual anchor */}
              <p className="editorial-h text-[48px] sm:text-[80px] mb-5" style={{ fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1 }}>
                {single && TOOL_HERO[activeTab]
                  ? <>{TOOL_HERO[activeTab].pre}<span className="italic">{TOOL_HERO[activeTab].em}</span>{TOOL_HERO[activeTab].post}</>
                  : <>Calculate your <span className="italic">take-home</span>.</>}
              </p>

              <p className="text-[13px] sm:text-[15px] opacity-90 max-w-xl leading-relaxed">
                {single && TOOL_HERO[activeTab]
                  ? TOOL_HERO[activeTab].desc
                  : 'Free Kenya PAYE and salary calculator. Works out your monthly net pay after PAYE tax, NSSF pension, SHIF (former NHIF), Housing Levy, HELB, SACCO and benefits in kind — using 2026 KRA tax bands.'}
              </p>
              <div className="mt-8 h-px bg-white/40"></div>
            </div>

            {/* Tab Navigation — each calculator is its own page, so every tab is a link. */}
            <div className="flex flex-wrap gap-2 mt-6">
              {TOOLS.map((t) => (
                <Link
                  key={t.key}
                  href={t.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-[12px] transition-all duration-200 ${
                    activeTab === t.key
                      ? 'bg-white text-brand hover:bg-white/95'
                      : 'bg-transparent text-white border border-white/40 hover:bg-white/10 hover:border-white/70'
                  }`}
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </header>
      </div>

      <main className="paye-calc-body relative z-10 px-4 md:px-6 pt-8 pb-16 bg-white">
        <div className="max-w-5xl mx-auto">

          {/* Main Calculator Tab */}
          {activeTab === 'calculator' && (
            <div className={`space-y-6 transition-all duration-500 ${animated ? 'opacity-100' : 'opacity-0'}`}>
              
              {/* Salary Input */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-amber-500 rounded-2xl">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Monthly Gross Salary</h2>
                    <p className="text-stone-400 text-sm">Slide or enter your salary</p>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="text-5xl md:text-7xl font-black text-white mb-1 tabular-nums">
                    {formatCurrency(grossSalary)}
                  </div>
                </div>

                <input
                  type="range"
                  min="15000"
                  max="2000000"
                  step="5000"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Number(e.target.value))}
                  className="w-full h-3 bg-stone-800 rounded-full appearance-none cursor-pointer mb-4"
                  style={{
                    background: `linear-gradient(to right, #DC2626 0%, #F59E0B ${(grossSalary - 15000) / (2000000 - 15000) * 100}%, #374151 ${(grossSalary - 15000) / (2000000 - 15000) * 100}%, #374151 100%)`
                  }}
                />

                <div className="flex flex-wrap gap-2 justify-center">
                  {[50000, 100000, 150000, 250000, 500000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setGrossSalary(amount)}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                        grossSalary === amount 
                          ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white' 
                          : 'bg-white/5 text-stone-300 hover:bg-white/10'
                      }`}
                    >
                      {formatCompact(amount)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Download payslip */}
              <div className="flex justify-center no-print">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-medium transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download payslip (PDF)
                </button>
              </div>

              {/* Print-only payslip sheet — portaled to <body> so @media print can hide
                  every sibling with display:none (no leftover layout height = no blank pages). */}
              {mounted && createPortal(
              <div id="payslip-print-root" aria-hidden="true">
                <div style={{ maxWidth: '640px', margin: '0 auto', color: '#111', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #F04C40', paddingBottom: '12px', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 700 }}>Payslip estimate</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Kenya PAYE Calculator · 2026 KRA rates</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>
                      payecalculator.co.ke<br />{printDate}
                    </div>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <tbody>
                      <tr><td style={{ padding: '8px 0', fontWeight: 600 }}>Gross salary</td><td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(calculations.grossSalary)}</td></tr>
                      <tr><td style={{ padding: '6px 0', color: '#444' }}>PAYE (income tax)</td><td style={{ padding: '6px 0', textAlign: 'right' }}>− {formatCurrency(calculations.paye)}</td></tr>
                      <tr><td style={{ padding: '6px 0', color: '#444' }}>NSSF</td><td style={{ padding: '6px 0', textAlign: 'right' }}>− {formatCurrency(calculations.nssf)}</td></tr>
                      <tr><td style={{ padding: '6px 0', color: '#444' }}>SHIF</td><td style={{ padding: '6px 0', textAlign: 'right' }}>− {formatCurrency(calculations.shif)}</td></tr>
                      <tr><td style={{ padding: '6px 0', color: '#444' }}>Housing Levy</td><td style={{ padding: '6px 0', textAlign: 'right' }}>− {formatCurrency(calculations.housingLevy)}</td></tr>
                      {calculations.helbRepayment > 0 && <tr><td style={{ padding: '6px 0', color: '#444' }}>HELB</td><td style={{ padding: '6px 0', textAlign: 'right' }}>− {formatCurrency(calculations.helbRepayment)}</td></tr>}
                      {calculations.saccoContribution > 0 && <tr><td style={{ padding: '6px 0', color: '#444' }}>SACCO</td><td style={{ padding: '6px 0', textAlign: 'right' }}>− {formatCurrency(calculations.saccoContribution)}</td></tr>}
                      {calculations.unionDues > 0 && <tr><td style={{ padding: '6px 0', color: '#444' }}>Union dues</td><td style={{ padding: '6px 0', textAlign: 'right' }}>− {formatCurrency(calculations.unionDues)}</td></tr>}
                      <tr><td style={{ padding: '12px 0', borderTop: '1px solid #ddd', fontWeight: 700, fontSize: '16px' }}>Net pay (take-home)</td><td style={{ padding: '12px 0', borderTop: '1px solid #ddd', textAlign: 'right', fontWeight: 700, fontSize: '16px', color: '#F04C40' }}>{formatCurrency(calculations.netSalary)}</td></tr>
                    </tbody>
                  </table>
                  <p style={{ fontSize: '11px', color: '#888', marginTop: '20px' }}>
                    Estimate only, based on 2026 KRA tax bands, NSSF (max KES 6,480), SHIF (2.75%) and Housing Levy (1.5%). Not an official payslip. Consult a qualified tax professional for advice.
                  </p>
                </div>
              </div>,
              document.body
              )}

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
                  { label: 'NSSF Pension', value: calculations.nssf, icon: Shield, color: '#C73B2F', desc: '6% to 72K' },
                  { label: 'SHIF Health', value: calculations.shif, icon: Heart, color: '#2a0f0c', desc: '2.75%' },
                  { label: 'Housing Levy', value: calculations.housingLevy, icon: Home, color: '#F5B9B2', desc: '1.5%' },
                  { label: 'Taxable Income', value: calculations.taxableIncome, icon: Briefcase, color: '#F04C40', desc: 'After NSSF' },
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
                  <span className="font-medium">HELB, SACCO & Voluntary Deductions</span>
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
                      <label className="block text-sm text-stone-400 mb-2">Extra Pension (max 30K)</label>
                      <input
                        type="number"
                        value={pensionContribution}
                        onChange={(e) => setPensionContribution(Number(e.target.value))}
                        className="w-full bg-stone-800/50 border border-stone-700 rounded-lg py-2.5 px-3 text-white"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-stone-400 mb-2">Mortgage Interest (max 25K)</label>
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
                        <label className="block text-sm text-stone-400 mb-2">Company Car</label>
                        <select
                          value={carBenefit}
                          onChange={(e) => setCarBenefit(e.target.value)}
                          className="w-full bg-stone-800/50 border border-stone-700 rounded-lg py-2.5 px-3 text-white"
                        >
                          <option value="none">No car benefit</option>
                          <option value="below1500">Below 1500cc (KES 3,600)</option>
                          <option value="1500to2000">1500-2000cc (KES 4,800)</option>
                          <option value="2000to3000">2000-3000cc (KES 7,200)</option>
                          <option value="above3000">Above 3000cc (KES 12,000)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-stone-400 mb-2">Housing Benefit</label>
                        <input
                          type="number"
                          value={housingBenefit}
                          onChange={(e) => setHousingBenefit(Number(e.target.value))}
                          className="w-full bg-stone-800/50 border border-stone-700 rounded-lg py-2.5 px-3 text-white"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-stone-400 mb-2">Other Benefits</label>
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
                      Registered Person with Disability (NCPWD) - KES 150,000 relief
                    </label>
                  </div>
                </div>
              )}

              {/* Charts Section */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-amber-400" />
                    Salary Distribution
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                        <Legend formatter={(v) => <span className="text-stone-300 text-xs">{v}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Waterfall Chart */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    Gross → Net Breakdown
                  </h3>
                  <WaterfallChart data={waterfallData} />
                </div>
              </div>

              {/* More Charts Row */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Gauges */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-red-400" />
                    Tax Rates
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <GaugeChart value={calculations.effectiveTaxRate} max={40} label="Effective Tax" color="#8A2820" />
                    <GaugeChart value={calculations.totalDeductionRate} max={50} label="Total Deductions" color="#F5B9B2" />
                  </div>
                </div>

                {/* Radar Chart */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Tax Efficiency
                  </h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={taxEfficiencyData}>
                        <PolarGrid stroke="#ececec" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                        <Radar name="Score" dataKey="A" stroke="#C73B2F" fill="#C73B2F" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Deduction Breakdown Bar */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    Deduction Split
                  </h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deductionBreakdown} layout="vertical">
                        <XAxis type="number" tickFormatter={(v) => formatCompact(v)} stroke="#888" />
                        <YAxis type="category" dataKey="name" width={60} stroke="#888" tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {deductionBreakdown.map((entry, index) => (
                            <Cell key={index} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Annual Projection */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Annual Projection
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrend}>
                      <defs>
                        <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F04C40" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#F04C40" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorTax" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8A2820" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8A2820" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#888" />
                      <YAxis tickFormatter={(v) => formatCompact(v)} stroke="#888" />
                      <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="cumNet" name="Cumulative Net" stroke="#F04C40" fill="url(#colorNet)" />
                      <Area type="monotone" dataKey="cumTax" name="Cumulative Tax" stroke="#8A2820" fill="url(#colorTax)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
                  <div className="text-center">
                    <p className="text-stone-400 text-xs">Annual Gross</p>
                    <p className="text-lg font-bold">{formatCurrency(calculations.grossSalary * 12)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-stone-400 text-xs">Annual Net</p>
                    <p className="text-lg font-bold text-emerald-400">{formatCurrency(calculations.netSalary * 12)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-stone-400 text-xs">Annual Tax</p>
                    <p className="text-lg font-bold text-red-400">{formatCurrency(calculations.paye * 12)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-stone-400 text-xs">Annual NSSF</p>
                    <p className="text-lg font-bold text-blue-400">{formatCurrency(calculations.nssf * 12)}</p>
                  </div>
                </div>
              </div>
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
                      className="w-full text-3xl font-bold bg-transparent border-b-2 border-indigo-500 py-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-2">Raise (%)</label>
                    <input
                      type="number"
                      value={raisePercent}
                      onChange={(e) => setRaisePercent(Number(e.target.value))}
                      className="w-full text-3xl font-bold bg-transparent border-b-2 border-indigo-500 py-2 text-white focus:outline-none"
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
                      className="w-full text-3xl font-bold bg-transparent border-b-2 border-pink-500 py-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-2">Bonus amount</label>
                    <input
                      type="number"
                      value={bonusAmount}
                      onChange={(e) => setBonusAmount(Number(e.target.value))}
                      className="w-full text-3xl font-bold bg-transparent border-b-2 border-pink-500 py-2 text-white focus:outline-none"
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

              {/* Bonus comparison chart */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
                <h3 className="text-lg font-bold mb-4">Bonus Net vs Tax</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Gross Bonus', gross: bonusAmount, net: 0, tax: 0 },
                      { name: 'Breakdown', gross: 0, net: bonusCalc.netBonus, tax: bonusCalc.bonusTax }
                    ]}>
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis tickFormatter={(v) => formatCompact(v)} stroke="#888" />
                      <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                      <Bar dataKey="gross" name="Gross" fill="#888" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="net" name="Net" fill="#F04C40" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="tax" name="Tax" fill="#8A2820" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
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
                    className="w-full text-3xl font-bold bg-transparent border-b-2 border-blue-500 py-2 text-white text-center focus:outline-none"
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
      </main>

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
                { gross: 50000, net: 39128, label: 'Entry level' },
                { gross: 75000, net: 55436, label: 'Mid level' },
                { gross: 100000, net: 70343, label: 'Senior' },
                { gross: 150000, net: 102843, label: 'Lead' },
                { gross: 200000, net: 135343, label: 'Exec' },
                { gross: 300000, net: 200343, label: 'Executive' },
              ].map((row) => (
                <a
                  key={row.gross}
                  href={`/blog/take-home-pay-on-a-kes-${row.gross}-salary-in-kenya`}
                  className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-[#F04C40]/50 transition-all"
                >
                  <div>
                    <p className="text-[14px] font-medium m-0 text-white">Ksh {row.gross.toLocaleString()}</p>
                    <p className="text-[10px] text-white/60 m-0 tracking-wider uppercase">{row.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-medium m-0" style={{ color: '#F04C40' }}>{row.net.toLocaleString()}</p>
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
                { href: '/blog/the-complete-guide-to-nssf-contributions-in-kenya-for-2026', title: 'NSSF contributions 2026', desc: '6% rate, 72K cap, what changed' },
                { href: '/blog/understanding-shif-deductions-in-kenya-and-what-replaced-nhif', title: 'SHIF replaces NHIF', desc: 'The new 2.75% health deduction' },
                { href: '/blog/everything-you-need-to-know-about-kenyas-housing-levy', title: "Kenya's Housing Levy", desc: 'Why 1.5% comes out of every salary' },
                { href: '/blog/7-legal-ways-kenyan-employees-can-reduce-their-paye', title: '7 ways to reduce your PAYE', desc: 'Pension, mortgage, insurance relief' },
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
