<script setup lang="ts">
  const password_confirmation = defineModel('password_confirmation', {})
  const props = defineProps<{
    errors : any,
  }>();
</script>

<template>
  <div class="mb-4">
    <label class="form-label fw-semibold">Nhập lại mật khẩu</label>
    <input
        type="password"
        class="form-control"
        :class="{ 'is-invalid': props.errors.password_confirmation }"
        v-model="password_confirmation"
        placeholder="Confirm lại phát ..."
    />
    <div class="invalid-feedback" v-if="props.errors.password_confirmation">
      {{ props.errors.password_confirmation[0] }}
    </div>
  </div>
</template>

<style scoped>

</style>