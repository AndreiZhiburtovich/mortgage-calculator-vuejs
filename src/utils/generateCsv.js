export const generateCsv = (schedule) => {
  if (!schedule || schedule.length === 0) return '';

  // Заголовки (через точку с запятой — так лучше открывается в Excel на Windows)
  const headers = ['Месяц', 'Платёж', 'Проценты', 'Тело кредита', 'Остаток'];
  const rows = schedule.map((row) => [
    row.month,
    row.payment,
    row.interest,
    row.principalPart,
    row.remaining,
  ]);

  const csvContent = [
    headers.join(';'),
    ...rows.map((r) => r.join(';')),
  ].join('\n');

  return csvContent;
};