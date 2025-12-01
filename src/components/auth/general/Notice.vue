<script setup lang="ts">
defineProps({
  message : String,
})
</script>

<template>
  <div v-if="message" class="alert alert-info text-center">
    {{ message }}
  </div>
</template>

<style scoped>

</style>