<script setup>
import { RouterLink, RouterView } from "vue-router";
import auth from "/src/api/auth/auth.ts";
import router from "./router/index.ts";

</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-3 border-bottom">

  </nav>

  <router-view></router-view>
</template>

<style scoped>
/* Không cần CSS, tất cả dùng bootstrap */
</style>
