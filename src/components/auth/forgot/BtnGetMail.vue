<script setup lang="ts">
  const props = defineProps({
    loading : Boolean,
    forgotPassword : Function
  })
</script>

<template>
  <button
      class="btn btn-primary w-100 py-2 fw-semibold"
      @click="props.forgotPassword"
      :disabled="props.loading"
  >
    <span v-if="props.loading" class="spinner-border spinner-border-sm me-2"></span>
    Xin lại mật khẩu
  </button>
</template>

<style scoped>

</style>