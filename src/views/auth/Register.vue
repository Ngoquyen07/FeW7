<script setup>
import { ref } from "vue";
import auth from "/src/api/auth/auth.ts";
import { useRouter } from "vue-router";
import ButtonBackToLogin from "../../components/auth/general/ButtonBackToLogin.vue";
import SubmitBtn from "../../components/auth/general/SubmitBtn.vue";
import Notice from "../../components/auth/general/Notice.vue";
import Header from "../../components/auth/general/Header.vue";
const router = useRouter();
const form = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const loading = ref(false);
const message = ref("");
const errors = ref({});

async function register() {
  loading.value = true;
  message.value = "";
  errors.value = {};

  try {
    const res = await auth.register(form.value);

    if (res.status === 201) {
      setTimeout(() => {
        message.value = "Redirect to home"; }, 500);
      message.value = "Register success!";
      setTimeout(() => {
        router.push("/home"); }, 2000);
    } else {
      message.value = "Something went wrong, please try again" ;
    }
    form.value = {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    };

  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors;
    } else {
      message.value = error.response?.data?.message ?? "Server Error!";
    }
  } finally {
    loading.value = false;
  }
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
</script>

<template>
  <div class="container mt-5 d-flex justify-content-center" style="min-height: 85vh;">
    <div class="w-100" style="max-width: 480px;">

      <Header header="Register"/>
      <!-- THÔNG BÁO -->
      <Notice :message="message"></Notice>
      <!-- FORM -->
      <div class="card shadow-sm border-0 rounded-3">
        <div class="card-body p-4">

          <form @submit.prevent="register">

            <!-- Name -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Name</label>
              <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.name }"
                  v-model="form.name"
                  placeholder="Enter your name ..."
              />
              <div class="invalid-feedback" v-if="errors.name">
                {{ errors.name[0] }}
              </div>
            </div>

            <!-- Email -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Email</label>
              <input
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  v-model="form.email"
                  placeholder="Enter your email ..."
              />
              <div class="invalid-feedback" v-if="errors.email">
                {{ errors.email[0] }}
              </div>
            </div>

            <!-- Password -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Password</label>
              <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  v-model="form.password"
                  placeholder="Enter password ..."
              />
              <div class="invalid-feedback" v-if="errors.password">
                {{ errors.password[0] }}
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="mb-4">
              <label class="form-label fw-semibold">Confirm password</label>
              <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password_confirmation }"
                  v-model="form.password_confirmation"
                  placeholder="Confirm password ..."
              />
              <div class="invalid-feedback" v-if="errors.password_confirmation">
                {{ errors.password_confirmation[0] }}
              </div>
            </div>

            <!-- SUBMIT -->
            <SubmitBtn :loading="loading" btnName="Register"/>
          </form>
          <ButtonBackToLogin/>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
</style>
