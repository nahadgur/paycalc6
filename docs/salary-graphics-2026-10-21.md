# Editorial salary graphics

Replaced the homepage calculator's donut, running-balance bars, gauges, tax-efficiency radar, deduction bar chart and gradient area chart with a coordinated salary story.

- Coral take-home panel with a prominent percentage and a proportional salary strip.
- An interactive deduction ledger with exact amounts, shares of gross and bars scaled consistently to the largest deduction. Selecting an item highlights its segment in the salary strip.
- A cumulative 12-payday stacked chart, with take-home in coral and deductions in neutral ink. Each bar and the touch-friendly range control select an exact payday summary.
- Included actual additional pension cash, HELB, SACCO and union deductions in the visualization.
- Zero salary has no invalid chart percentages. Negative take-home shows a shortfall message and omits the positive annual projection.
- All figures use the existing calculator results; no payroll formulas changed.
- Clearly labels the 12-payday illustration as constant-salary/current-rate, not a prediction of future tax rules.
- Uses live HTML/CSS graphics, real buttons, direct labels, keyboard controls and reduced-motion handling. No generated chart imagery or new dependencies.

Validation: existing payroll examples and article audit, production build, and post-deployment browser checks of selection and payday controls.
