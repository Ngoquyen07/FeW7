<script setup lang="ts">
import {inject, type Ref} from "vue";
import type { User } from "../../interfaces/User";

// user được provide ở main.ts
const user = inject<Ref<User | null>>("user");
console.log("USer from profile " ,user?.value?.name);
// user là ref<User|null>, nên dùng user.value
</script>

<template>
  <div class="container py-4">

    <h2 class="mb-4 fw-bold text-primary text-center">
      Thông tin tài khoản
    </h2>

    <!-- Nếu chưa login -->
    <div v-if="!user?.id" class="alert alert-warning text-center">
      Bạn chưa đăng nhập!
    </div>

<!--     Nếu đã login -->
    <div v-else class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg rounded-4 border-0">
          <div class="card-body p-4">

            <div class="text-center mb-3">
              <div class="avatar bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                   style="width: 90px; height: 90px; font-size: 32px;">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <h4 class="fw-bold">{{ user.name }}</h4>
              <small class="text-muted">{{ user.email }}</small>
            </div>

            <hr>

            <div class="px-2">
              <p class="mb-2">
                <strong>Mã người dùng:</strong> {{ user.id }}
              </p>
              <p class="mb-2">
                <strong>Ngày tạo:</strong>
                {{ new Date(user.created_at).toLocaleString() }}
              </p>
              <p class="mb-2">
                <strong>Cập nhật lần cuối:</strong>
                {{ new Date(user.updated_at).toLocaleString() }}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.avatar {
  user-select: none;
}
</style>
