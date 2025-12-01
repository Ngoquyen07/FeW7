<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import auth from "../../api/auth/auth.ts";
import ButtonBackToLogin from "../../components/auth/general/ButtonBackToLogin.vue";
import BtnReset from "../../components/auth/resetPw/BtnReset.vue";

const route = useRoute();
const router = useRouter();

const token = route.params.token;  // token từ URL

const email = ref(route.query.email ?? "");   // email trong URL
const password = ref("");
const password_confirmation = ref("");

const loading = ref(false);
const message = ref("");
const messageType = ref<"success" | "danger" | "">("");

async function resetPassword() {
  if (!email.value || !password.value || !password_confirmation.value) {
    messageType.value = "danger";
    message.value = "Vui lòng nhập đầy đủ thông tin!";
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    const data = {
      token: token,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value
    };

    const res = await auth.resetPassword(data);
    console.log(res);

    messageType.value = "success";
    message.value = "Đổi mật khẩu thành công! Đang chuyển hướng...";

    setTimeout(() => {
      router.push("/login");
    }, 1500);

  } catch (err: any) {
    messageType.value = "danger";
    message.value = err.response?.data?.message ?? "Có lỗi xảy ra!";
  }

  loading.value = false;
}
</script>

<template>
  <div class="reset-bg d-flex justify-content-center align-items-center">
    <div class="card shadow-sm border-0 rounded-4 p-4 reset-card">

      <h3 class="text-center fw-bold mb-2 text-primary">
        Đặt lại mật khẩu
      </h3>
      <p class="text-center text-muted mb-4">
        Nhập mật khẩu mới cho tài khoản của bạn.
      </p>

      <!-- Message -->
      <div v-if="message" :class="`alert alert-${messageType} text-center mb-3`">
        {{ message }}
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Email</label>
        <input
            type="email"
            class="form-control form-control-lg"
            v-model="email"
            placeholder="Nhập email ..."
        />
      </div>

      <!-- Password -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Mật khẩu mới</label>
        <input
            type="password"
            class="form-control form-control-lg"
            v-model="password"
            placeholder="Nhập mật khẩu mới ..."
        />
      </div>

      <!-- Confirm Password -->
      <div class="mb-4">
        <label class="form-label fw-semibold">Nhập lại mật khẩu</label>
        <input
            type="password"
            class="form-control form-control-lg"
            v-model="password_confirmation"
            placeholder="Nhập lại mật khẩu ..."
        />
      </div>

      <!-- Reset Button -->
      <BtnReset :loading="loading"  :resetPassword="resetPassword" />
      <!-- Back -->
      <ButtonBackToLogin/>
    </div>
  </div>
</template>

<style scoped>
.reset-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd, #ffffff);
  padding: 20px;
}

.reset-card {
  width: 100%;
  max-width: 440px;
  background: #fff;
  animation: fadeIn .3s ease-in-out;
}

.form-control-lg {
  padding: 10px 14px;
  border-radius: 10px;
}

.btn-lg {
  padding: 10px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
