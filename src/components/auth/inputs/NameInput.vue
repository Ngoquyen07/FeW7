<script setup lang="ts">
  const name = defineModel('name', {})
  const props = defineProps<{
    errors : any,
  }>();
</script>

<template>
  <div class="mb-3">
    <label class="form-label fw-semibold">Họ và tên</label>
    <input
        type="text"
        class="form-control"
        :class="{ 'is-invalid': props.errors.name }"
        v-model="name"
        placeholder="Cho xin cái la me đê ..."
    />
    <div class="invalid-feedback" v-if="props.errors.name">
      {{ props.errors.name[0] }}
    </div>
  </div>
</template>

<style scoped>

</style>