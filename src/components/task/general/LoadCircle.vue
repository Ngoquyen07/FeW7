<script setup lang="ts">
  const props = defineProps<{
    loading: boolean;
  }>()
</script>

<template>
  <div v-if="props.loading" class="text-center py-4">
    <div class="spinner-border text-primary" role="status"></div>
    <p class="mt-2">Loading data...</p>
  </div>
</template>

<style scoped>

</style>