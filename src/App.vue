<template>
  <main class="app-layout">
    <header class="app-header">
      <h1>Калькулятор ипотеки</h1>
      <p>Аннуитетный платёж и график выплат</p>
    </header>

    <form class="calculator-form" @submit.prevent="recalculate">
      <InputGroup
        label="Сумма кредита, ₽"
        v-model="principal"
        :error="errors.principal"
      />
      <InputGroup
        label="Ставка, % годовых"
        v-model="ratePercent"
        :error="errors.ratePercent"
      />
      <InputGroup
        label="Срок, месяцев"
        v-model="months"
        :error="errors.months"
      />

      <button type="submit" class="btn-submit">Рассчитать</button>
    </form>

    <div v-if="showFormula" class="formula-block">
      <h4>Формула аннуитетного платежа</h4>
      <p><code>A = S * (r * (1 + r)^n) / ((1 + r)^n - 1)</code></p>
      <ul>
        <li><b>S</b> — сумма кредита</li>
        <li><b>r</b> — месячная ставка (годовая / 12 / 100)</li>
        <li><b>n</b> — количество месяцев</li>
      </ul>
      <p><b>Пример:</b> при 3 000 000 ₽, 12% годовых, 240 мес. платёж ≈ 33 033 ₽.</p>
    </div>

    <button
      type="button"
      class="btn-formula"
      @click="showFormula = !showFormula"
    >
      {{ showFormula ? 'Скрыть формулу' : 'Показать формулу' }}
    </button>

    <div v-if="result" class="results-block">
      <div class="summary-card">
        <h2>Ежемесячный платёж</h2>
        <p class="amount">{{ formatCurrency(result.payment) }}</p>
        <p class="note">Общая переплата: {{ formatCurrency(totalOverpayment) }}</p>
      </div>

      <PaymentChart :rows="result.schedule.slice(0, 5)" />
      <PaymentTable :rows="result.schedule.slice(0, 15)" />

      <button
        type="button"
        class="btn-getcsv"
        @click="downloadSchedule"
        :disabled="!result"
      >
        📥 Скачать график (CSV)
      </button>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import InputGroup from './components/InputGroup.vue';
import PaymentTable from './components/PaymentTable.vue';
import PaymentChart from './components/PaymentChart.vue';
import useMortgageLogic from './composables/useMortgageLogic.js';
import { validateInputs } from './utils/validateInputs.js';
import { saveInputs, loadInputs } from './utils/localStorageManager.js';
import { formatCurrency } from './utils/formatCurrency.js';
import { generateCsv } from './utils/generateCsv.js';

const { generateSchedule } = useMortgageLogic();

const defaultPrincipal = 3000000;
const defaultRatePercent = 12;
const defaultMonths = 240;

const principal = ref(defaultPrincipal);
const ratePercent = ref(defaultRatePercent);
const months = ref(defaultMonths);

const errors = ref({ principal: '', ratePercent: '', months: '' });
const result = ref(null);
const showFormula = ref(false);

// Сохранение при изменении
watch([principal, ratePercent, months], () => {
  saveInputs({
    principal: principal.value,
    ratePercent: ratePercent.value,
    months: months.value,
  });
});

// Восстановление при монтировании
onMounted(() => {
  const data = loadInputs();
  if (!data) return;
  if (data.principal != null) principal.value = data.principal;
  if (data.ratePercent != null) ratePercent.value = data.ratePercent;
  if (data.months != null) months.value = data.months;
});

const recalculate = () => {
  const { errors: newErrors, isValid } = validateInputs(
    principal.value,
    ratePercent.value,
    months.value
  );
  errors.value = newErrors;
  if (!isValid) return;

  result.value = generateSchedule(
    Number(principal.value),
    Number(ratePercent.value),
    Number(months.value)
  );
};

const totalOverpayment = computed(() => {
  if (!result.value) return 0;
  const payment = Number(result.value.payment) || 0;
  const length = result.value.schedule?.length || 0;
  const principalValue = Number(principal.value) || 0;
  return payment * length - principalValue;
});

const downloadSchedule = () => {
  if (!result.value?.schedule?.length) {
    console.warn('Нет данных для экспорта');
    return;
  }
  try {
    const csv = generateCsv(result.value.schedule);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mortgage-schedule-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Ошибка при экспорте CSV:', err);
  }
};
</script>

<style scoped>
.app-layout { max-width: 700px; margin: 0 auto; padding: 1.5rem; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
.app-header { margin-bottom: 2rem; text-align: center; }
.calculator-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
@media (max-width: 600px) { .calculator-form { grid-template-columns: 1fr; } }
.btn-submit {
  grid-column: 1 / -1;
  padding: 14px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-submit:hover { background: #2563eb; }
.btn-formula {
  background: transparent;
  border: 1px solid #d1d5db;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1.5rem;
}
.btn-formula:hover { border-color: #3b82f6; color: #3b82f6; }
.results-block { margin-top: 2rem; }
.summary-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
}
.amount { font-size: 2rem; font-weight: 700; color: #111827; margin: 0.5rem 0 0; }
.note { color: #6b7280; margin-top: 0.5rem; }
.formula-block {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  code { background: #1f2937; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.9rem; }
  ul { margin: 0.5rem 0 0 1.2rem; color: #4b5563; }
}
.btn-getcsv {
  margin-top: 2rem;
  padding: 10px 16px;
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-getcsv:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}
.btn-getcsv:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>