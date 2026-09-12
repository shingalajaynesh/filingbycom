// Test Income Tax Calculator Edge Cases for FY 2025-26 / AY 2026-27

const NEW_SLABS = [
  { upTo: 400000, rate: 0, label: "₹0 to ₹4,00,000" },
  { upTo: 800000, rate: 0.05, label: "₹4,00,001 to ₹8,00,000" },
  { upTo: 1200000, rate: 0.10, label: "₹8,00,001 to ₹12,00,000" },
  { upTo: 1600000, rate: 0.15, label: "₹12,00,001 to ₹16,00,000" },
  { upTo: 2000000, rate: 0.20, label: "₹16,00,001 to ₹20,00,000" },
  { upTo: 2400000, rate: 0.25, label: "₹20,00,001 to ₹24,00,000" },
  { upTo: Infinity, rate: 0.30, label: "Above ₹24,00,000" }
];

const OLD_SLABS = [
  { upTo: 250000, rate: 0, label: "₹0 to ₹2,50,000" },
  { upTo: 500000, rate: 0.05, label: "₹2,50,001 to ₹5,00,000" },
  { upTo: 1000000, rate: 0.20, label: "₹5,00,001 to ₹10,00,000" },
  { upTo: Infinity, rate: 0.30, label: "Above ₹10,00,000" }
];

function calculateSlabTax(taxableIncome, slabs) {
  let previousLimit = 0;
  let tax = 0;
  for (const slab of slabs) {
    if (taxableIncome <= previousLimit) break;
    const taxableInSlab = Math.min(taxableIncome, slab.upTo) - previousLimit;
    tax += taxableInSlab * slab.rate;
    previousLimit = slab.upTo;
  }
  return tax;
}

function calculateNewRegime(taxableIncome) {
  const baseTax = calculateSlabTax(taxableIncome, NEW_SLABS);
  let rebate = 0;
  let taxAfterRebate = baseTax;

  if (taxableIncome <= 1200000) {
    rebate = Math.min(baseTax, 60000);
    taxAfterRebate = Math.max(0, baseTax - rebate);
  } else {
    // Marginal relief under Section 87A: tax payable cannot exceed income exceeding ₹12,00,000
    const excessIncome = taxableIncome - 1200000;
    if (baseTax > excessIncome) {
      taxAfterRebate = excessIncome;
      rebate = baseTax - excessIncome;
    }
  }

  const cess = taxAfterRebate * 0.04;
  const total = taxAfterRebate + cess;
  return { taxableIncome, baseTax, rebate, taxAfterRebate, cess, total };
}

function calculateOldRegime(taxableIncome) {
  const baseTax = calculateSlabTax(taxableIncome, OLD_SLABS);
  let rebate = 0;
  if (taxableIncome <= 500000) {
    rebate = Math.min(baseTax, 12500);
  }
  const taxAfterRebate = Math.max(0, baseTax - rebate);
  const cess = taxAfterRebate * 0.04;
  const total = taxAfterRebate + cess;
  return { taxableIncome, baseTax, rebate, taxAfterRebate, cess, total };
}

const testCases = [
  { desc: "Taxable Income = ₹12,00,000 (Exact threshold)", taxable: 1200000 },
  { desc: "Taxable Income = ₹12,10,000 (Marginal Relief test)", taxable: 1210000 },
  { desc: "Taxable Income = ₹12,50,000 (Marginal Relief test)", taxable: 1250000 },
  { desc: "Taxable Income = ₹12,70,000 (Marginal Relief upper boundary)", taxable: 1270000 },
  { desc: "Taxable Income = ₹12,71,000 (Post Marginal Relief)", taxable: 1271000 },
  { desc: "Taxable Income = ₹13,00,000", taxable: 1300000 },
  { desc: "Taxable Income = ₹15,00,000", taxable: 1500000 }
];

console.log("=== NEW REGIME (AY 2026-27) EDGE CASE TEST RESULTS ===");
for (const tc of testCases) {
  const res = calculateNewRegime(tc.taxable);
  const oldRes = calculateOldRegime(tc.taxable);
  console.log(`\nCase: ${tc.desc}`);
  console.log(`  Taxable Income: ₹${tc.taxable.toLocaleString("en-IN")}`);
  console.log(`  Base Slab Tax: ₹${res.baseTax.toLocaleString("en-IN")}`);
  console.log(`  Section 87A Rebate / Marginal Relief: ₹${res.rebate.toLocaleString("en-IN")}`);
  console.log(`  Tax After Rebate: ₹${res.taxAfterRebate.toLocaleString("en-IN")}`);
  console.log(`  Health & Education Cess (4%): ₹${res.cess.toLocaleString("en-IN")}`);
  console.log(`  Total Tax Payable: ₹${res.total.toLocaleString("en-IN")}`);
  console.log(`  [Old Regime Total Tax for comparison]: ₹${oldRes.total.toLocaleString("en-IN")}`);
}
