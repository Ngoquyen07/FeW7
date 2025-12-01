<script setup lang="ts">
  const props = defineProps({
    message : String,
    messageType : String,
    logout : Function
  })
</script>

<template>
  <!-- BUTTON MỞ SIDEBAR -->
  <button
      class="btn btn-outline-secondary mb-3"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#sidebar"
  >
    ☰
  </button>
  <!-- MESSAGE -->
  <div v-if="props.message" class="alert" :class="`alert-${props.messageType}`">
    {{ props.message }}
  </div>

  <!-- SIDEBAR (Bootstrap Offcanvas) -->
  <div
      class="offcanvas offcanvas-start text-bg-dark"
      tabindex="-1"
      id="sidebar"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Menu</h5>
      <button
          type="button"
          class="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
      ></button>
    </div>

    <div class="offcanvas-body">

      <RouterLink to="/profile" class="btn btn-outline-light w-100 mb-3">
        <i class="bi bi-person-circle me-2"></i> Profile
      </RouterLink>

      <button class="btn btn-danger w-100" @click="props.logout">
        <i class="bi bi-box-arrow-right me-2"></i> Logout
      </button>

    </div>
  </div>
</template>

<style scoped>

</style>