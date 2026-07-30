<template>
  <div class="payment-table-container">
    <h3>График платежей (первые 15 месяцев)</h3>
    <table class="payment-table">
      <thead>
        <tr>
          <th>Месяц</th>
          <th>Платёж</th>
          <th>Проценты</th>
          <th>Тело кредита</th>
          <th>Остаток</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.month">
          <td>{{ row.month }}</td>
          <td>{{ formatCurrency(row.payment) }}</td>
          <td class="color-interest">{{ formatCurrency(row.interest) }}</td>
          <td class="color-principal">{{ formatCurrency(row.principalPart) }}</td>
          <td>{{ formatCurrency(row.remaining) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { formatCurrency } from '../utils/formatCurrency.js';

defineProps({
  rows: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.payment-table-container { margin-top: 2rem; }
.payment-table { width: 100%; border-collapse: collapse; }
.payment-table th, .payment-table td {
  padding: 8px 12px;
  text-align: right;
  border-bottom: 1px solid #e5e7eb;
}
.payment-table th { color: #6b7280; font-weight: 600; }
.color-interest { color: #ef4444; }
.color-principal { color: #10b981; }
</style>