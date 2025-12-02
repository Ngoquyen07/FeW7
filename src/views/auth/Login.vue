<script setup>
import { ref } from "vue";
import auth from "/src/api/auth/auth.ts";
import { useRouter } from "vue-router";
import Notice from "../../components/auth/general/Notice.vue";
import ToForgot from "../../components/auth/login/ToForgot.vue";
import SubmitBtn from "../../components/auth/general/SubmitBtn.vue";
import Header from "../../components/auth/general/Header.vue";
import ToRegister from "../../components/auth/login/ToRegister.vue";
import EmailInPut from "../../components/auth/inputs/EmailInPut.vue";
import PasswordInput from "../../components/auth/inputs/PasswordInput.vue";
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
      message.value = "Đúng acc rồi đấy ông cháu";


      router.push("/home");

    } else {
      message.value = "Sai thông tin ròi bố ạ!" ;
    }

    form.value = {
      name: "",
      email: "",
    };

  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors;
      console.log(error.response);
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

      <Header header="Đăng nhập đê"/>

      <!-- THÔNG BÁO -->
      <Notice :message="message"></Notice>

      <!-- FORM -->
      <div class="card shadow-sm border-0 rounded-3">
        <div class="card-body p-4">
          <form @submit.prevent="login">
            <EmailInPut v-model:email="form.email" :errors="errors" parent="login" />
            <!-- Password -->
            <PasswordInput errors="errors" v-model:password="form.password" />
            <!-- 🔥 Link quên mật khẩu -->
            <ToForgot/>
            <!-- SUBMIT -->
            <SubmitBtn :loading="loading" btnName="Đăng nhập nuôn"/>
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