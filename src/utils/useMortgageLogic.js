export function useMortgageLogic() {
  // Формула аннуитетного платежа
  const calculateAnnuity = (principal, ratePercent, months) => {
    const r = ratePercent / 100 / 12;
    if (r === 0) return principal / months;
    return (principal * r) / (1 - Math.pow(1 + r, -months));
  };

  // Генерация графика платежей (месяц за месяцем)
  const generateSchedule = (principal, ratePercent, months) => {
    const r = ratePercent / 100 / 12;
    const payment = calculateAnnuity(principal, ratePercent, months);
    const schedule = [];
    let remaining = principal;

    for (let i = 1; i <= months; i++) {
      const interest = remaining * r;
      const principalPart = payment - interest;
      remaining -= principalPart;
      if (remaining < 0) remaining = 0;

      schedule.push({
        month: i,
        payment,
        interest,
        principalPart,
        remaining,
      });
    }

    return { payment, schedule };
  };

  return { calculateAnnuity, generateSchedule };
}