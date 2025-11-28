<script setup>
import { ref } from "vue";
import auth from "/src/api/auth/auth.ts";
import { useRouter } from "vue-router";
const router = useRouter();
const form = ref({
  email: "",
  password: "",
})
const loading = ref(false);
const message = ref("");
const errors = ref({});
async function login() {
  loading.value = true;
  message.value = "";
  errors.value = {};

  try {
    const res = await auth.login(form.value);

    if (res.status === 200 || res.status === 204) {
      message.value = res.status;
      router.push("/home");

    } else {
      message.value = res.status ;
    }

    form.value = {
      name: "",
      email: "",
    };

  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors;
    } else {
      message.value = error.response?.data?.message ?? "Lỗi server!";
    }
  } finally {
    loading.value = false;
  }
}

</script>

<template>
  <div class="container mt-5 d-flex justify-content-center" style="min-height: 85vh;">
    <div class="w-100" style="max-width: 480px;">

      <h2 class="text-center mb-4 fw-bold">
        Chưa có tài khoản à? <br>
        <span class="text-primary">Đăng ký đê!</span>
      </h2>

      <!-- THÔNG BÁO -->
      <div v-if="message" class="alert alert-info text-center">
        {{ message }}
      </div>

      <!-- FORM -->
      <div class="card shadow-sm border-0 rounded-3">
        <div class="card-body p-4">

          <form @submit.prevent="login">
            <!-- Email -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Email</label>
              <input
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  v-model="form.email"
                  placeholder="Nổ cái i mew ..."
              />
              <div class="invalid-feedback" v-if="errors.email">
                {{ errors.email[0] }}
              </div>
            </div>

            <!-- Password -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Mật khẩu</label>
              <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  v-model="form.password"
                  placeholder="Nổ mật khẩu lẹ ..."
              />
              <div class="invalid-feedback" v-if="errors.password">
                {{ errors.password[0] }}
              </div>
            </div>


            <!-- SUBMIT -->
            <button
                type="submit"
                class="btn btn-primary w-100 py-2 fw-semibold"
                :disabled="loading"
            >
              <span v-if="loading">Đang quay ...</span>
              <span v-else>Đăng nhập</span>
            </button>

          </form>
        </div>
      </div>

    </div>
  </div>

</template>

<style scoped>

</style>