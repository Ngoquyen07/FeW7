<script setup lang="ts">
import { ref } from "vue";
import auth from "../../api/auth/auth.ts";
import ButtonBackToLogin from "../../components/auth/general/ButtonBackToLogin.vue";
import FgHeader from "../../components/auth/forgot/FgHeader.vue";
import BtnGetMail from "../../components/auth/forgot/BtnGetMail.vue";

const email = ref("");
const message = ref("");
const messageType = ref<"success" | "danger" | "">("");
const loading = ref(false);

async function forgotPassword() {
  if (!email.value) {
    messageType.value = "danger";
    message.value = "Please enter valid email";
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    const res = await auth.forgotPassword(email.value);
    console.log(res);
    messageType.value = "success";
    message.value = "Email has been sent. Please check your inbox!";
  } catch (err: any) {
    messageType.value = "danger";
    message.value = err.response?.data?.message ?? "Something went wrong!";
  }

  loading.value = false;

  // Tự động ẩn message sau 4s
  setTimeout(() => {
    message.value = "";
    messageType.value = "";
  }, 4000);
}
</script>
<template>
  <div class="container d-flex justify-content-center align-items-center" style="min-height: 70vh;">
    <div class="card shadow p-3 card-forgot">

      <!-- FgHeader -->
        <FgHeader/>

      <!-- Thông báo -->
      <div v-if="message" :class="`alert alert-${messageType}`">
        {{ message }}
      </div>

      <!-- Form Email -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Email</label>
        <input
            type="email"
            class="form-control"
            placeholder="Enter your email ..."
            v-model="email"
        />
      </div>

      <!-- Button gửi -->
          <BtnGetMail :loading="loading" :forgotPassword="forgotPassword" />
      <!-- Back -->
      <ButtonBackToLogin/>
    </div>
  </div>
</template>

<style scoped>
/* Card rộng hơn để header không bị vỡ font */
.card-forgot {
  width: 480px !important;      /* tăng từ 380px → 480px */
  max-width: 95%;               /* responsive */
  border-radius: 12px;
}

/* Tăng font header cho đẹp */
h1, h2 {
  font-family: "Segoe UI", sans-serif;
}
</style>
