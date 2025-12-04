<script setup lang="ts">
import { onMounted, ref } from "vue";
import { user } from "../../stores/auth.ts";
import auth from "../../api/auth/auth.ts";
import router from "../../router";

const loading = ref(false);
const loadingCancel = ref(false);
const message = ref("");
const errorMessage = ref("");
const email = user.value?.email;

async function resendEmail() {
  loading.value = true;
  message.value = "";
  errorMessage.value = "";

  try {
    const res = await auth.resendEmailVerify();
    message.value = res.data.message ?? "Verification email has been resent!";
    if (res.data.success) { setTimeout(() => { router.push("/"); }, 500); // 500ms
    }
  } catch (err: any) {
    errorMessage.value = "Unable to send verification email. Please try again.";
  } finally {
    loading.value = false;
  }
}

async function cancel() {
  loadingCancel.value = true;
  message.value = "";
  errorMessage.value = "";

  try {
    user.value = null;
    await auth.logout();

    setTimeout(() => {
      router.push("/login");
    }, 600);
  } catch (e) {
    console.log("Logout error", e);
  }
}

onMounted(() => {
  auth.resendEmailVerify();
});
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center" style="min-height: 80vh;">
    <div class="card shadow p-4" style="max-width: 500px; width: 100%; border-radius: 15px;">

      <h3 class="text-center mb-3">Verify Your Email</h3>

      <p class="text-center text-muted">
        A verification email has been sent to:
        <strong>{{ email }}</strong>
      </p>

      <p class="text-center text-muted mb-3">
        Please check your inbox and click the verification link to activate your account.
      </p>

      <div v-if="message" class="alert alert-success text-center">{{ message }}</div>
      <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>

      <div class="d-grid gap-2 mt-3">
        <button class="btn btn-primary" @click="resendEmail" :disabled="loading || loadingCancel">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Resend Verification Email
        </button>

        <button class="btn btn-secondary" @click="cancel" :disabled="loading || loadingCancel">
          <span v-if="loadingCancel" class="spinner-border spinner-border-sm me-2"></span>
          Cancel
        </button>
      </div>

    </div>

    <!-- OVERLAY LOADING -->
    <div v-if="loadingCancel" class="overlay-loading d-flex justify-content-center align-items-center">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
    </div>
  </div>
</template>

<style scoped>
.overlay-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  z-index: 9999;
}
</style>
