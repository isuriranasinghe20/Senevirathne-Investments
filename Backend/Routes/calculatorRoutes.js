const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { loan, period, rate, type } = req.body;

  const L = Number(loan);
  const P = Number(period);
  const R = Number(rate);
  const monthlyRate = R / 12 / 100;

  if (type === "INSTALLMENT") {
    const monthlyPrincipal = L / P;
    let remaining = L;
    let totalInterest = 0;

    for (let i = 1; i <= P; i++) {
      const interest = remaining * monthlyRate;
      totalInterest += interest;
      remaining -= monthlyPrincipal;
    }

    return res.json({
      monthlyPrincipal: Number(monthlyPrincipal.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      totalPayment: Number((L + totalInterest).toFixed(2)),
    });
  }

  if (type === "INTEREST_ONLY") {
    const monthlyInterest = L * monthlyRate;
    const totalInterest = monthlyInterest * P;

    return res.json({
      monthlyInterest: Number(monthlyInterest.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      totalPayment: Number((L + totalInterest).toFixed(2)),
    });
  }

  res.status(400).json({ message: "Invalid loan type" });
});

module.exports = router;
