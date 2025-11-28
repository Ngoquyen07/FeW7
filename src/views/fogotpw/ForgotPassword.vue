<script setup lang="ts">
import { ref } from "vue";
import auth from "../../api/auth/auth.ts";

const email = ref("");
const message = ref("");
const messageType = ref<"success" | "danger" | "">("");
const loading = ref(false);

async function forgotPassword() {
  if (!email.value) {
    messageType.value = "danger";
    message.value = "Email không được bỏ trống!";
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    const res = await auth.forgotPassword(email.value);
    console.log(res);
    messageType.value = "success";
    message.value = "Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư.";

  } catch (err: any) {
    messageType.value = "danger";
    message.value = err.response?.data?.message ?? "Có lỗi xảy ra!";
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

      <!-- Header giữ nguyên -->
      <h2 class="text-center mb-0">Có cái mật khẩu cũng không giữ được</h2>
      <h1 class="text-center title-red mb-4">SAO GIỮ ĐƯỢC EM</h1>

      <!-- Thông báo -->
      <div v-if="message" :class="`alert alert-${messageType}`">
        {{ message }}
      </div>

      <!-- Form Email -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Thồi nhập i meo vào đây</label>
        <input
            type="email"
            class="form-control"
            placeholder="Nhập email ..."
            v-model="email"
        />
      </div>

      <!-- Button gửi -->
      <button
          class="btn btn-primary w-100 py-2 fw-semibold"
          @click="forgotPassword"
          :disabled="loading"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        Gửi liên kết đặt lại mật khẩu
      </button>

      <!-- Back -->
      <div class="text-center mt-3">
        <RouterLink to="/login" class="small text-decoration-none">
          ← Quay lại đăng nhập
        </RouterLink>
      </div>

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

/* Dòng màu đỏ */
.title-red {
  color: #dc3545;               /* đỏ Bootstrap */
  font-weight: bold;
  letter-spacing: 1px;
}

/* Tăng font header cho đẹp */
h1, h2 {
  font-family: "Segoe UI", sans-serif;
}
</style>
