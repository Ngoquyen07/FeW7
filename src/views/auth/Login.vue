<script setup>
import { ref } from "vue";
import auth from "/src/api/auth/auth.ts";
import { useRouter } from "vue-router";
import Notice from "../../components/auth/general/Notice.vue";
import ToForgot from "../../components/auth/login/ToForgot.vue";
import SubmitBtn from "../../components/auth/general/SubmitBtn.vue";
import Header from "../../components/auth/general/Header.vue";
import ToRegister from "../../components/auth/login/ToRegister.vue";
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
      message.value = "The account is correct !";
      router.push("/home");
    } else {
      message.value = "Something went wrong" ;
    }
    form.value = {
      name: "",
      email: "",
    };

  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors;
    } else {
      message.value = error.response?.data?.message ?? "Sever error!";
    }
  } finally {
    loading.value = false;
  }
}

</script>

<template>
  <div class="container mt-5 d-flex justify-content-center" style="min-height: 85vh;">
    <div class="w-100" style="max-width: 480px;">
      <Header header="Login"/>

      <!-- THÔNG BÁO -->
      <Notice :message="message"></Notice>

      <!-- FORM -->
      <div class="card shadow-sm border-0 rounded-3">
        <div class="card-body p-4">
          <form @submit.prevent="login">
            <div class="mb-3">
              <label class="form-label fw-semibold">Email</label>
              <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  v-model="form.email"
                  placeholder="Enter your email ..."
              />
              <div class="invalid-feedback" v-if="errors.email">
                <span >
                    {{ errors.email[0] }}
                  <br>
                </span>
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
                  placeholder="Enter your password ..."
              />
              <div class="invalid-feedback" v-if="errors.password">
                {{ errors.password[0] }}
              </div>
            </div>
            <!--  Link quên mật khẩu -->
            <ToForgot/>
            <!-- SUBMIT -->
            <SubmitBtn :loading="loading" btnName="Login"/>
            <!-- LINK ĐI ĐĂNG KÝ -->
            <ToRegister/>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>