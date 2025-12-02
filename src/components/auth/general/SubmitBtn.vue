<script setup lang="ts">
  const props = defineProps({
    loading : Boolean,
    btnName : String,
  })
</script>

<template>
  <button
      type="submit"
      class="btn btn-primary w-100 py-2 fw-semibold"
      :disabled="props.loading"
  >
    <span v-if="props.loading">Loading ...</span>
    <span v-else>{{props.btnName}}</span>
  </button>
</template>

<style scoped>

</style>