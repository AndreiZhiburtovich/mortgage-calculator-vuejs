export const validateInputs = (principal, ratePercent, months) => {
  const errors = {
    principal: '',
    ratePercent: '',
    months: '',
  };

  const p = Number(principal);
  const r = Number(ratePercent);
  const m = Number(months);

  if (!p || p <= 0) {
    errors.principal = 'Сумма должна быть положительным числом';
  }
  if (!r || r < 0) {
    errors.ratePercent = 'Ставка не может быть отрицательной';
  }
  if (!m || m <= 0 || !Number.isInteger(m)) {
    errors.months = 'Срок должен быть целым положительным числом';
  }

  const isValid = !errors.principal && !errors.ratePercent && !errors.months;
  return { errors, isValid };
};