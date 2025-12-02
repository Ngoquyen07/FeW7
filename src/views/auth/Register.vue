<script setup>
import { ref } from "vue";
import auth from "/src/api/auth/auth.ts";
import { useRouter } from "vue-router";
import ButtonBackToLogin from "../../components/auth/general/ButtonBackToLogin.vue";
import SubmitBtn from "../../components/auth/general/SubmitBtn.vue";
import Notice from "../../components/auth/general/Notice.vue";
import Header from "../../components/auth/general/Header.vue";
import EmailInPut from "../../components/auth/inputs/EmailInPut.vue";
import PasswordInput from "../../components/auth/inputs/PasswordInput.vue";
import NameInput from "../../components/auth/inputs/NameInput.vue";
import CFPasswordInput from "../../components/auth/inputs/CFPasswordInput.vue";
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
        message.value = "Đợi ri đì rếc về hô me"; }, 500);
      message.value = "Đăn rồi đấy ông cháu ơi!";
      setTimeout(() => {
        router.push("/home"); }, 2000);
    } else {
      message.value = "Ông cháu đăng xuất ra hộ phát rồi đăng ký nhé!" ;
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

      <Header header="Đăng ký đê"/>
      <!-- THÔNG BÁO -->
      <Notice :message="message"></Notice>
      <!-- FORM -->
      <div class="card shadow-sm border-0 rounded-3">
        <div class="card-body p-4">

          <form @submit.prevent="register">

            <!-- Name -->
            <NameInput :errors="errors" v-model:name="form.name" />

            <!-- Email -->
            <EmailInPut :errors="errors" parent="register" v-model:email="form.email" />

            <!-- Password -->
            <PasswordInput errors="errors" v-model:password="form.password" />

            <!-- Confirm Password -->
            <CFPasswordInput :errors="errors" v-model:password_confirmation="form.password_confirmation" />

            <!-- SUBMIT -->
            <SubmitBtn :loading="loading" btnName="Đăng kí nuôn"/>
          </form>
          <ButtonBackToLogin/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
