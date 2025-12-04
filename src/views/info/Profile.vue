<script setup lang="ts">
import {inject, onMounted, ref, type Ref, watchEffect} from "vue";
import type { User } from "../../interfaces/User";
import userApi from "../../api/user/userApi.ts";

// 1. Lấy user từ Global State
const user = inject<Ref<User | null>>("user");

// 2. Tạo các biến tạm (Draft) để chỉnh sửa mà không ảnh hưởng dữ liệu thật ngay lập tức
const draftName = ref("");
const draftAvatarPreview = ref<string | null>(null); // Dùng để hiển thị ảnh preview
const selectedFile = ref<File | null>(null); // Lưu file user vừa chọn
const fileInput = ref<HTMLInputElement | null>(null);
const isSaving = ref(false);
import { Toast } from "bootstrap";
let profileToast: Toast | null = null;

onMounted(() => {
  const toastEl = document.getElementById("profileToast");
  if (toastEl) profileToast = new Toast(toastEl);
});

// Đồng bộ dữ liệu từ user gốc vào biến tạm khi component load hoặc user thay đổi
watchEffect(() => {
  if (user?.value) {
    draftName.value = user.value.name;
    draftAvatarPreview.value = user.value.imgurl || null;
  }
});

// 3. Xử lý khi chọn file (Chỉ Preview, chưa Upload)
const triggerSelectFile = () => fileInput.value?.click();

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];

    // Validate size
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must under 2MB.");
      return;
    }

    // Lưu file vào biến để lát nữa gửi
    selectedFile.value = file;

    // TẠO URL ẢNH PREVIEW (Quan trọng)
    // Giúp hiển thị ảnh vừa chọn ngay lập tức mà chưa cần upload
    draftAvatarPreview.value = URL.createObjectURL(file);
  }
};

// 4. Hàm Lưu thay đổi (Gửi cả Tên và Ảnh)
const saveChanges = async () => {
  if (!user?.value) return;

  try {
    isSaving.value = true;
    const formData = new FormData();

    // Luôn gửi tên
    formData.append('name', draftName.value);

    if (selectedFile.value) {
      formData.append('avatar', selectedFile.value);
    }
    // Gọi API
    const response = await userApi.update(formData);

    // Cập nhật lại User gốc sau khi thành công
    user.value = response.data.data;

    if (profileToast) profileToast.show();

    // Reset file đã chọn
    selectedFile.value = null;

  } catch (error) {
    console.error(error);
    alert("Lỗi khi cập nhật.");

  } finally {
    isSaving.value = false;
  }
};
const clickImage = () => {
  if (draftAvatarPreview?.value) {
    window.open(draftAvatarPreview.value, "_blank");
  }
}
</script>

<template>
  <div class="container py-4">
    <div v-if="user" class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg rounded-4 border-0">
          <div class="card-body p-4">
            <!-- SUCCESS TOAST -->
            <div
                class="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
                style="z-index: 2000;"
            >
              <div
                  id="profileToast"
                  class="toast align-items-center text-white bg-success border-0"
                  role="alert"
                  aria-live="assertive"
                  aria-atomic="true"
              >
                <div class="d-flex">
                  <div class="toast-body">
                    Profile updated successfully!
                  </div>
                  <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
              </div>
            </div>

            <h4 class="text-center fw-bold text-primary mb-4">Profile</h4>

            <form @submit.prevent="saveChanges">

              <div class="text-center mb-4">
                <div class="avatar-container d-inline-block position-relative mb-3">

                  <img
                      v-if="draftAvatarPreview"
                      :src="draftAvatarPreview"
                      alt="Avatar"
                      class="rounded-circle shadow-sm object-fit-cover"
                      style="width: 120px; height: 120px;"
                      @click="clickImage"
                  >
                  <div
                      v-else
                      class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm mx-auto"
                      style="width: 120px; height: 120px; font-size: 40px;"
                  >
                    {{ draftName.charAt(0).toUpperCase() }}
                  </div>

                  <button
                      type="button"
                      class="btn btn-light border position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                      style="width: 36px; height: 36px;"
                      @click="triggerSelectFile"
                      title="Đổi ảnh"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"  class="bi bi-camera-fill text-primary" viewBox="0 0 16 16">
                      <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                      <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                    </svg>
                  </button>

                  <input
                      type="file"
                      ref="fileInput"
                      accept="image/*"
                      hidden
                      @change="handleFileChange"
                  >
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Name</label>
                <input
                    v-model="draftName"
                    type="text"
                    class="form-control"
                    placeholder="Enter your name here ..."
                    required
                >
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Email</label>
                <input
                    type="text"
                    class="form-control bg-light"
                    :value="user.email"
                    readonly
                    disabled
                >
                <small class="text-muted">Email cannot be changed!</small>
              </div>

              <hr class="my-4">

              <div class="d-flex justify-content-end gap-2">
                <RouterLink
                    class="btn btn-secondary"
                    type="button"
                    to="/"
                >
                 Back
                </RouterLink>
                <button
                    type="submit"
                    class="btn btn-primary d-flex align-items-center gap-2"
                    :disabled="isSaving"
                >
                  <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
                  <span>{{ isSaving ? 'Saving ...' : 'Save' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
.avatar-container:hover .btn {
  background-color: #e9ecef;
}
</style>