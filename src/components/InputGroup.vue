<template>
  <label class="input-group">
    <span class="label">{{ label }}</span>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input-field"
      type="number"
      min="0"
      step="any"
      :class="{ 'input-invalid': !!error }"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </label>
</template>

<script setup>
defineProps({
  label: String,
  error: String,
});

const modelValue = defineModel({ required: true });
</script>

<style scoped>
.input-group { display: flex; flex-direction: column; gap: 0.4rem; }
.label { color: #374151; font-weight: 500; }
.input-field {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}
.input-field:focus { outline: none; border-color: #3b82f6; }
.input-invalid { border-color: #ef4444; }
.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 4px;
}
</style>