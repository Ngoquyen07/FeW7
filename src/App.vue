<script setup>
import { RouterLink, RouterView } from "vue-router";
import auth from "/src/api/auth/auth.ts";
import router from "./router/index.ts";
async function logout() {
  try {
    await auth.logout();
    router.push("/login"); // chuyển về login
  } catch (error) {
    console.log("Logout error:", error);
  }
}

</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-3 border-bottom">

    <!-- Home bên trái -->
    <RouterLink class="navbar-brand btn btn-lg" style="background: bisque " to="/">Home</RouterLink>

    <!-- Đẩy các nút sang phải -->
    <div class="ms-auto d-flex gap-2">

      <RouterLink class="btn btn-primary" to="/login">
        Login
      </RouterLink>

      <RouterLink class="btn btn-success" to="/register">
        Register
      </RouterLink>
      <button class="btn btn-danger " @click="logout">
        Logout
      </button>
    </div>

  </nav>

  <router-view></router-view>
</template>

<style scoped>
/* Không cần CSS, tất cả dùng bootstrap */
</style>
