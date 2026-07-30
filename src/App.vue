<template>
  <main class="app-layout">
    <header class="app-header">
      <h1>Mortgage Calculator</h1>
      <p>Annuity payment and repayment schedule</p>
    </header>

    <form class="calculator-form" @submit.prevent="recalculate">
      <InputGroup
        label="Loan amount, ₽"
        v-model="principal"
        :error="errors.principal"
      />
      <InputGroup
        label="Annual interest rate, %"
        v-model="ratePercent"
        :error="errors.ratePercent"
      />
      <InputGroup
        label="Term, months"
        v-model="months"
        :error="errors.months"
      />

      <button type="submit" class="btn-submit">Calculate</button>
    </form>

    <div v-if="showFormula" class="formula-block">
      <h4>Annuity Payment Formula</h4>
      <p><code>A = S * (r * (1 + r)^n) / ((1 + r)^n - 1)</code></p>
      <ul>
        <li><b>S</b> — loan amount</li>
        <li><b>r</b> — monthly rate (annual / 12 / 100)</li>
        <li><b>n</b> — number of months</li>
      </ul>
      <p><b>Example:</b> 3,000,000 ₽, 12% annual, 240 months → ~33,033 ₽/month.</p>
    </div>

    <button type="button" class="btn-secondary" @click="showFormula = !showFormula">
      {{ showFormula ? 'Hide formula' : 'Show formula' }}
    </button>

    <div v-if="result" class="results-block">
      <div class="summary-card">
        <h2>Monthly Payment</h2>
        <p class="amount">{{ formatCurrency(result.payment) }}</p>
        <p class="note">Total overpayment: {{ formatCurrency(totalOverpayment) }}</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import InputGroup from './components/InputGroup.vue';
import { useMortgageLogic } from './composables/useMortgageLogic.js';
import { formatCurrency } from './utils/formatCurrency.js';

const { generateSchedule } = useMortgageLogic();

const principal = ref(3000000);
const ratePercent = ref(12);
const months = ref(240);

const errors = ref({
  principal: '',
  ratePercent: '',
  months: '',
});

const result = ref(null);
const showFormula = ref(false);

const validateInputs = () => {
  let isValid = true;
  const p = Number(principal.value);
  const r = Number(ratePercent.value);
  const m = Number(months.value);

  if (!p || p <= 0) {
    errors.value.principal = 'Loan amount must be a positive number';
    isValid = false;
  } else {
    errors.value.principal = '';
  }

  if (!r || r < 0) {
    errors.value.ratePercent = 'Interest rate cannot be negative';
    isValid = false;
  } else {
    errors.value.ratePercent = '';
  }

  if (!m || m <= 0 || !Number.isInteger(m)) {
    errors.value.months = 'Term must be a positive integer';
    isValid = false;
  } else {
    errors.value.months = '';
  }

  return isValid;
};

const recalculate = () => {
  if (!validateInputs()) return;

  const p = Number(principal.value);
  const r = Number(ratePercent.value);
  const m = Number(months.value);

  result.value = generateSchedule(p, r, m);

  localStorage.setItem('mortgage-inputs', JSON.stringify({
    principal: p,
    ratePercent: r,
    months: m,
  }));
};

const totalOverpayment = computed(() => {
  if (!result.value) return 0;
  return result.value.payment * result.value.schedule.length - Number(principal.value);
});
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
}
.btn-secondary {
  background: transparent;
  border: 1px solid #d1d5db;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1.5rem;
}
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
</style>