<template>
  <div class="chart-container">
    <h3>Структура платежа (по первым 5 месяцам)</h3>
    <div v-for="row in rows" :key="row.month" class="chart-row">
      <span class="chart-label">{{ row.month }} мес.</span>
      <div class="chart-bar">
        <div
          class="bar-segment bar-interest"
          :style="{ width: percent(row.interest, row.payment) }"
        />
        <div
          class="bar-segment bar-principal"
          :style="{ width: percent(row.principalPart, row.payment) }"
        />
      </div>
      <span class="chart-value">{{ formatCurrency(row.payment) }}</span>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '../utils/formatCurrency.js';

defineProps({
  rows: {
    type: Array,
    required: true,
  },
});

const percent = (part, total) => {
  if (total === 0) return '0%';
  return ((part / total) * 100).toFixed(1) + '%';
};
</script>

<style scoped>
.chart-container { margin-top: 2rem; }
.chart-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
.chart-label { min-width: 60px; color: #6b7280; }
.chart-bar {
  flex-grow: 1;
  height: 20px;
  background: #f3f4f6;
  border-radius: 10px;
  overflow: hidden;
  display: flex; /* вместо float — используем flex */
}
.bar-segment { height: 100%; }
.bar-interest { background: #ef4444; }
.bar-principal { background: #10b981; }
.chart-value { font-weight: 600; white-space: nowrap; }
</style>