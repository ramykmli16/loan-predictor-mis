// ---------------- BASE INTEREST RATES ----------------
const baseRates = {
  home: 8.5,
  education: 7.5,
  vehicle: 9.0,
  personal: 12.5
};

// ---------------- COLLATERAL DISCOUNTS ----------------
const collateralDiscount = {
  none: 0,
  gold: 1.0,
  property: 1.5,
  fd: 2.0
};

// ---------------- GET ELEMENTS ----------------
const loanAmountEl = document.getElementById("loanAmount");
const tenureEl = document.getElementById("tenure");
const loanTypeEl = document.getElementById("loanType");
const collateralEl = document.getElementById("collateral");

const interestRateEl = document.getElementById("interestRate");
const emiEl = document.getElementById("emi");
const totalInterestEl = document.getElementById("totalInterest");
const endDateEl = document.getElementById("endDate");
const insightText = document.getElementById("insightText");

// ---------------- MAIN CALCULATION ----------------
function calculateLoanMIS() {
  const loanAmount = Number(loanAmountEl.value);
  const tenureYears = Number(tenureEl.value);
  const loanType = loanTypeEl.value;
  const collateral = collateralEl.value;

  const tenureMonths = tenureYears * 12;

  // Final Interest Rate
  let interestRate =
    baseRates[loanType] - collateralDiscount[collateral];

  if (interestRate < 5) interestRate = 5; // safety cap

  // EMI Calculation
  const monthlyRate = interestRate / 12 / 100;

  let emi = 0;
  if (loanAmount > 0 && tenureMonths > 0) {
    emi =
      (loanAmount *
        monthlyRate *
        Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }

  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - loanAmount;

  // Loan End Date
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + tenureMonths);

  // ---------------- UPDATE UI ----------------
// Corrected lines to replace them with:
interestRateEl.innerText = `${interestRate.toFixed(2)}%`;
emiEl.innerText = `₹${Math.round(emi).toLocaleString()}`;
totalInterestEl.innerText = `₹${Math.round(totalInterest).toLocaleString()}`;
endDateEl.innerText = `${endDate.toLocaleDateString("en-IN")}`;
  // ---------------- INSIGHT LOGIC ----------------
  let insight = "";

  if (interestRate <= 7) {
    insight = "🟢 Very favorable loan terms. Low interest burden.";
  } else if (interestRate <= 9) {
    insight = "🟡 Moderate interest rate. Manageable repayment.";
  } else if (interestRate <= 11) {
    insight = "🟠 Higher interest rate. Consider collateral or shorter tenure.";
  } else {
    insight = "🔴 High interest loan. Strongly review affordability.";
  }

  insightText.innerText = insight;
}

// ---------------- LIVE UPDATE ----------------
document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("input", calculateLoanMIS);
});

// INITIAL RUN
calculateLoanMIS();