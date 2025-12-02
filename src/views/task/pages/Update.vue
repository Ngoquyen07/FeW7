<script setup lang="ts">
import taskAPI from "../../../api/task/taskAPI.ts";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoadCircle from "../../../components/task/general/LoadCircle.vue";

const route = useRoute();
const router = useRouter();

const title = ref("");
const status = ref("");
const description = ref("");
const loading = ref(false);

async function load() {
  loading.value = true;
  const id = Number(route.params.id);

  if (!id) {
    alert("ID không hợp lệ!");
    router.back();
    return;
  }
  try{
    const res = await taskAPI.getById(id);

    title.value = res?.data?.data?.title;
    status.value = res?.data?.data?.status;
    description.value = res?.data?.data?.description;
  }
  catch (error : any) {
    if(error.response?.status === 404){
      router.push("/404");
    }
  }
  finally {
    loading.value = false;
  }
}

async function update() {
  if (!title.value || !status.value) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const id = Number(route.params.id);

  const res = await taskAPI.update(id, {
    title: title.value,
    description: description.value,
    status: status.value,
  });

  console.log(res);
  router.push("/home");
}

onMounted(load);
</script>
<template>
  <div class="container mt-4">
    <div class="card shadow">
      <div class="card-body">

        <h4 class="mb-4 fw-bold text-primary">Chỉnh sửa Task</h4>

        <!-- Loading -->
        <LoadCircle :loading="loading" />

        <!-- FORM START -->
        <form @submit.prevent="update">

          <!-- Title -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Tiêu đề</label>
            <input
                v-model="title"
                type="text"
                class="form-control"
                readonly
            />
          </div>

          <!-- Description -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Mô tả</label>
            <textarea
                v-model="description"
                class="form-control"
                rows="4"
                placeholder="Nhập mô tả..."
                required
            ></textarea>
          </div>

          <!-- Status -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Trạng thái</label>
            <select v-model="status" class="form-select">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-primary px-4">
              <i class="bi bi-save me-1"></i> Lưu thay đổi
            </button>

            <button type="button" class="btn btn-outline-secondary px-4" @click="router.back()">
              <i class="bi bi-arrow-left me-1"></i> Quay lại
            </button>
          </div>

        </form>

      </div>
    </div>
  </div>
</template>
