<script setup lang="ts">
const password = defineModel('password', {});
const props = defineProps<{
  errors:any,
}>()
</script>

<template>
  <div class="mb-3">
    <label class="form-label fw-semibold">Mật khẩu</label>
    <input
        type="password"
        class="form-control"
        :class="{ 'is-invalid': props.errors.password }"
        v-model="password"
        placeholder="Nhập mật khẩu"
    />
    <div class="invalid-feedback" v-if="props.errors.password">
      {{ props.errors.password[0] }}
    </div>
  </div>
</template>

<style scoped>

</style>