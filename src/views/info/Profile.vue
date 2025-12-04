<script setup lang="ts">
import { inject, onMounted, ref, type Ref, watchEffect } from "vue";
import type { User } from "../../interfaces/User";
import userApi from "../../api/user/userApi.ts";
import { Toast } from "bootstrap";

// GLOBAL USER
const user = inject<Ref<User | null>>("user");

// LOCAL STATES
const draftName = ref("");
const draftAvatarPreview = ref<string | null>(null);
const selectedFile = ref<File | null>(null);

const fileInput = ref<HTMLInputElement | null>(null);
const isSaving = ref(false);
const errors = ref<any>({});

let profileToast: Toast | null = null;

// Toast init
onMounted(() => {
  const toastEl = document.getElementById("profileToast");
  if (toastEl) profileToast = new Toast(toastEl);
});

// Đồng bộ dữ liệu từ user vào draft
watchEffect(() => {
  if (user?.value) {
    draftName.value = user.value.name;
    draftAvatarPreview.value = user.value.imgurl || null;
  }
});

// File selection
const triggerSelectFile = () => fileInput.value?.click();

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      errors.value = { avatar: ["Image must be under 2MB"] };
      return;
    }

    selectedFile.value = file;
    draftAvatarPreview.value = URL.createObjectURL(file);
  }
};

// Save changes
const saveChanges = async () => {
  if (!user?.value) return;

  errors.value = {};

  try {
    isSaving.value = true;

    const formData = new FormData();
    formData.append("name", draftName.value);

    if (selectedFile.value) {
      formData.append("avatar", selectedFile.value);
    }

    const response = await userApi.update(formData);
    user.value = response.data.data; // cập nhật store

    selectedFile.value = null;

    if (profileToast) profileToast.show();
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors;
      return;
    }
    console.error("Update error:", error);
  } finally {
    isSaving.value = false;
  }
};

// Open image when user clicks avatar
const clickImage = () => {
  if (draftAvatarPreview?.value) {
    window.open(draftAvatarPreview.value, "_blank");
  }
};
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
                  <div class="toast-body">Profile updated successfully!</div>
                  <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
              </div>
            </div>

            <h4 class="text-center fw-bold text-primary mb-4">Profile</h4>

            <form @submit.prevent="saveChanges">

              <!-- AVATAR -->
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

                  <!-- CHANGE AVATAR BUTTON -->
                  <button
                      type="button"
                      class="btn btn-light border position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                      style="width: 36px; height: 36px;"
                      @click="triggerSelectFile"
                      title="Change avatar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-camera-fill text-primary" viewBox="0 0 16 16">
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

              <!-- NAME -->
              <div class="mb-3">
                <label class="form-label fw-bold">Name</label>
                <input
                    v-model="draftName"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.name }"
                    placeholder="Enter your name here ..."
                >
                <div v-if="errors.name" class="invalid-feedback">
                  {{ errors.name[0] }}
                </div>
              </div>

              <!-- EMAIL -->
              <div class="mb-3">
                <label class="form-label fw-bold">Email</label>
                <input
                    type="text"
                    class="form-control bg-light"
                    :value="user.email"
                    readonly
                    disabled
                >
                <small class="text-muted">Email cannot be changed.</small>
              </div>

              <hr class="my-4">

              <!-- BUTTONS -->
              <div class="d-flex justify-content-end gap-2">
                <RouterLink class="btn btn-secondary" to="/">Back</RouterLink>

                <button
                    type="submit"
                    class="btn btn-primary d-flex align-items-center gap-2"
                    :disabled="isSaving"
                >
                  <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
                  <span>{{ isSaving ? 'Saving...' : 'Save' }}</span>
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
