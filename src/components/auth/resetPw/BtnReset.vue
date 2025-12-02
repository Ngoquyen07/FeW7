<script setup lang="ts">
  const props = defineProps({
    loading: Boolean,
    resetPassword : Function,
  });
</script>

<template>
  <button
      class="btn btn-primary w-100 btn-lg fw-semibold"
      @click="props.resetPassword"
      :disabled="props.loading"
  >
    <span v-if="props.loading" class="spinner-border spinner-border-sm me-2"></span>
    Reset Password
  </button>
</template>

<style scoped>

</style>