<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import taskAPI from "../../../api/task/taskAPI.ts";

const router = useRouter();

const form = ref({
  title: "",
  description: "",
  status: "active", // hoặc "todo" tuỳ bạn
});

const errors = ref<any>({});
const loading = ref(false);
const message = ref("");

async function handleSubmit() {
  loading.value = true;
  errors.value = {};
  message.value = "";

  try {
    const res = await taskAPI.create(form.value);

    // Nếu backend trả 201 / 200 đều ok
    if (res.status === 201 || res.status === 200) {
      message.value = "Tạo task thành công! Đang chuyển về danh sách...";
      // Đợi 1 chút rồi quay lại list
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    }
  } catch (e: any) {
    // Lỗi validate từ Laravel (422)
    if (e.response && e.response.status === 422) {
      errors.value = e.response.data.errors || {};
      message.value = "Dữ liệu chưa hợp lệ, kiểm tra lại giúp nhé!";
    } else {
      console.error(e);
      message.value = "Có lỗi xảy ra, thử lại sau!";
    }
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push("/home"); // quay lại list
}
</script>

<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h4 class="mb-3">Tạo task mới</h4>

        <!-- Thông báo -->
        <div v-if="message" class="alert alert-info py-2">
          {{ message }}
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- Title -->
          <div class="mb-3">
            <label class="form-label">Tiêu đề</label>
            <input
                type="text"
                class="form-control"
                v-model="form.title"
                placeholder="Nhập tiêu đề task"
            />
            <div v-if="errors.title" class="text-danger small mt-1">
              {{ errors.title[0] }}
            </div>
          </div>

          <!-- Description -->
          <div class="mb-3">
            <label class="form-label">Mô tả</label>
            <textarea
                class="form-control"
                rows="3"
                v-model="form.description"
                placeholder="Mô tả ngắn gọn task"
            ></textarea>
            <div v-if="errors.description" class="text-danger small mt-1">
              {{ errors.description[0] }}
            </div>
          </div>

          <!-- Status -->
          <div class="mb-3">
            <label class="form-label">Trạng thái</label>
            <select class="form-select" v-model="form.status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div v-if="errors.status" class="text-danger small mt-1">
              {{ errors.status[0] }}
            </div>
          </div>

          <!-- Buttons -->
          <div class="d-flex gap-2">
            <button class="btn btn-primary" type="submit" :disabled="loading">
              {{ loading ? "Đang lưu..." : "Lưu task" }}
            </button>

            <button
                class="btn btn-secondary"
                type="button"
                @click="goBack"
                :disabled="loading"
            >
              Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
