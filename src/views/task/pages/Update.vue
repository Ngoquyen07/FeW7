<script setup lang="ts">
import taskAPI from "../../../api/task/taskAPI.ts";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const title = ref("");
const status = ref("");
const description = ref("");
async function load() {
  const res = await taskAPI.getById(parseInt(<string>route.params.id));
  title.value = res?.data?.data?.title ;
  status.value = res?.data?.data?.status;
  description.value = res?.data?.data?.description ;
}
async function update() {
  if (!title.value || !status.value) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const res = await taskAPI.update(parseInt(<string>route.params.id), {
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
    <div class="card shadow-sm">
      <div class="card-body">

        <h4 class="mb-3">Chỉnh sửa Task</h4>

        <!-- Title -->
        <div class="mb-3">
          <label class="form-label">Tiêu đề</label>
          <input
              v-model="title"
              type="text"
              class="form-control"
              readonly
          />
        </div>

        <!-- Description -->
        <div class="mb-3">
          <label class="form-label">Mô tả</label>
          <textarea
              v-model="description"
              class="form-control"
              rows="3"
              placeholder="Nhập mô tả (tuỳ chọn)"
          ></textarea>
        </div>

        <!-- Status -->
        <div class="mb-3">
          <label class="form-label">Trạng thái</label>
          <select v-model="status" class="form-select">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Buttons -->
        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-primary" @click="update">
            Lưu thay đổi
          </button>

          <button class="btn btn-secondary" @click="router.back()">
            Quay lại
          </button>
        </div>

      </div>
    </div>
  </div>
</template>


<style scoped>

</style>