export function useMortgageLogic() {
  const calculateAnnuity = (principal, ratePercent, months) => {
    const r = ratePercent / 100 / 12;

    if (r === 0) {
      return principal / months;
    }

    const payment = (principal * r) / (1 - Math.pow(1 + r, -months));
    // Округляем до копеек (2 знака) — так считают банки
    return Math.round(payment * 100) / 100;
  };

  const generateSchedule = (principal, ratePercent, months) => {
    const r = ratePercent / 100 / 12;
    const payment = calculateAnnuity(principal, ratePercent, months);
    const schedule = [];
    let remaining = principal;

    for (let i = 1; i <= months; i++) {
      const interest = remaining * r;
      // Часть платежа, идущая на погашение тела кредита
      const principalPart = payment - interest;
      remaining -= principalPart;

      // Защита от отрицательного остатка из‑за ошибок округления
      if (remaining < 0) {
        remaining = 0;
      }

      schedule.push({
        month: i,
        payment,
        interest: Math.max(0, interest), // защита от -0 или микро‑отрицательных
        principalPart: Math.max(0, principalPart),
        remaining,
      });
    }

    return { payment, schedule };
  };

  return { calculateAnnuity, generateSchedule };
}