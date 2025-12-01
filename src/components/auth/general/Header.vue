<script setup lang="ts">
  const props = defineProps({
    header : String
  });
</script>

<template>
  <h2 class="text-center mb-4 fw-bold">
    <span class="text-primary">{{ props.header }}</span>
  </h2>
</template>

<style scoped>

</style>