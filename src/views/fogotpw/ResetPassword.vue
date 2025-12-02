<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import auth from "../../api/auth/auth.ts";

const route = useRoute();
const router = useRouter();

// Lấy token và email từ URL
const token = route.params.token;
const email = ref(route.query.email ?? "");
const password = ref("");
const password_confirmation = ref("");

// UI state
const loading = ref(false);
const message = ref("");
const messageType = ref<"success" | "danger" | "">("");

// Object chứa lỗi từng field
const errors = ref<any>({
  email: "",
  password: "",
  password_confirmation: ""
});

async function resetPassword() {
  // Clear lỗi cũ
  errors.value = {
    email: "",
    password: "",
    password_confirmation: ""
  };
  message.value = "";
  messageType.value = "";

  loading.value = true;

  try {
    const payload = {
      token,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value
    };

    const res = await auth.resetPassword(payload);
    console.log(res);

    messageType.value = "success";
    message.value = "Reset password success! Redirecting...";

    setTimeout(() => router.push("/"), 800);
  }

  catch (err: any) {
    if (err.response?.status === 422) {
      const e = err.response.data.errors;
      errors.value.email = e.email?.[0] ?? "";
      errors.value.password = e.password?.[0] ?? "";
      errors.value.password_confirmation = e.password_confirmation?.[0] ?? "";
    }
    else {
      message.value = "Something went wrong!";
    }
  }

  loading.value = false;
}
</script>

<template>
  <div class="reset-bg d-flex justify-content-center align-items-center">
    <div class="card shadow-sm border-0 rounded-4 p-4 reset-card">

      <h3 class="text-center fw-bold mb-2 text-primary">Reset Password</h3>
      <p class="text-center text-muted mb-4">Enter your email and new password</p>

      <!-- Global Message -->
      <div v-if="message" :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-danger']">
        {{ message }}
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Email</label>
        <input
            v-model="email"
            type="email"
            class="form-control"
            :class="{'is-invalid': errors.email}"
            placeholder="Enter your email"
        />
        <div v-if="errors.email" class="invalid-feedback">
          {{ errors.email }}
        </div>
      </div>

      <!-- Password -->
      <div class="mb-3">
        <label class="form-label fw-semibold">New Password</label>
        <input
            v-model="password"
            type="password"
            class="form-control"
            :class="{'is-invalid': errors.password}"
            placeholder="Enter new password"
        />
        <div v-if="errors.password" class="invalid-feedback">
          {{ errors.password }}
        </div>
      </div>

      <!-- Confirm Password -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Confirm Password</label>
        <input
            v-model="password_confirmation"
            type="password"
            class="form-control"
            :class="{'is-invalid': errors.password_confirmation}"
            placeholder="Confirm new password"
        />
        <div v-if="errors.password_confirmation" class="invalid-feedback">
          {{ errors.password_confirmation }}
        </div>
      </div>

      <!-- Reset Button -->
      <button
          class="btn btn-primary w-100 fw-bold py-2"
          :disabled="loading"
          @click="resetPassword"
      >
        <span v-if="loading">Processing...</span>
        <span v-else>Reset Password</span>
      </button>

      <!-- Back -->
      <button
          class="btn btn-link w-100 mt-3"
          @click="router.push('/login')"
      >
        Back to Login
      </button>

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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
