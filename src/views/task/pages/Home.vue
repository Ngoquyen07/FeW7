<template>
  <div class="container mt-4">

    <!-- BUTTON MỞ SIDEBAR -->
    <button
        class="btn btn-outline-secondary mb-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebar"
    >
      ☰
    </button>
    <!-- MESSAGE -->
    <div v-if="message" class="alert" :class="`alert-${messageType}`">
      {{ message }}
    </div>

    <!-- SIDEBAR (Bootstrap Offcanvas) -->
    <div
        class="offcanvas offcanvas-start text-bg-dark"
        tabindex="-1"
        id="sidebar"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">Menu</h5>
        <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
        ></button>
      </div>

      <div class="offcanvas-body">

        <RouterLink to="/profile" class="btn btn-outline-light w-100 mb-3">
          <i class="bi bi-person-circle me-2"></i> Profile
        </RouterLink>

        <button class="btn btn-danger w-100" @click="logout">
          <i class="bi bi-box-arrow-right me-2"></i> Logout
        </button>

      </div>
    </div>

    <!-- CONTENT -->
    <div class="card shadow-sm">
      <div class="card-body">

        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0">Danh sách Task</h4>
          <button class="btn btn-primary" @click="goCreate">
            + Thêm Task
          </button>
        </div>

        <!-- Search -->
        <input
            v-model="search"
            @keyup.enter="loadTasks()"
            class="form-control mb-3"
            placeholder="Tìm kiếm task..."
        />

        <!-- Task List -->
        <table class="table table-bordered">
          <thead>
          <tr>
            <th>STT</th>
            <th>Tiêu đề</th>
            <th>Mô tả</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(task, index) in tasks" :key="task.id">
            <td>{{ index + 1 + (currentPage - 1) * (pagination.per_page ?? tasks.length) }}</td>
            <td>{{ task.title }}</td>
            <td>{{ task.description }}</td>
            <td>{{ task.status }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="goEdit(task.id)">
                Sửa
              </button>
              <button class="btn btn-sm btn-danger" @click="removeTask(task.id)">
                Xóa
              </button>
            </td>
          </tr>

          <tr v-if="tasks.length === 0">
            <td colspan="5" class="text-center text-muted py-3">
              Chưa có task nào luôn
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="d-flex justify-content-between mt-3">
          <button class="btn btn-secondary" @click="prevPage" :disabled="currentPage <= 1">
            Prev
          </button>

          <span>Trang {{ currentPage }} / {{ pagination.last_page }}</span>

          <button class="btn btn-secondary"
                  @click="nextPage"
                  :disabled="currentPage >= pagination.last_page">
            Next
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import taskAPI from "../../../api/task/taskAPI.ts";
import auth from "../../../api/auth/auth.ts";
import type {Task} from "../../../interfaces/Task.ts";
import {user} from "../../../stores/auth.ts";

const router = useRouter();
const tasks = ref<Task[]>([]);
const pagination = ref<any>({});
const search = ref("");
const currentPage = ref(1);

async function loadTasks(page = 1): Promise<void> {
  const res = await taskAPI.getAll({
    page,
    search: search.value,
  });

  tasks.value = res.data.data;        // Sửa products → tasks
  pagination.value = res.data;
  currentPage.value = res.data.current_page;
}

async function logout() {
  try {
    const res = await auth.logout();
    user.value = null
    console.log(res);
    await router.push("/login"); // chuyển về login
  } catch (error) {
    console.log("Logout error:", error);
    await router.push("/login");
  }
}

function nextPage() {
  loadTasks(currentPage.value + 1);
}

function prevPage() {
  loadTasks(currentPage.value - 1);
}

function goCreate() {
  router.push("/tasks/create");
}

function goEdit(id: number) {
  router.push(`/tasks/edit/${id}`);
}
const message = ref("");
const messageType = ref<"success" | "danger" | "">("");

async function removeTask(id: number): Promise<void> {
  if (!confirm("Bạn chắc chắn muốn xóa task này?")) return;

  try {
    const res = await taskAPI.delete(id);
    if(res.status == 200){
      messageType.value = "success";
      message.value = "Đã xóa task thành công!";
      await loadTasks(currentPage.value);
    }


  } catch (error: any) {
    console.log(error);

    messageType.value = "danger";
    message.value = error.response?.data?.message ?? "Xóa thất bại!";
  }

  // Tự động ẩn message sau 3 giây
  setTimeout(() => {
    message.value = "";
    messageType.value = "";
  }, 500);
}


onMounted(() => loadTasks());
</script>

<style scoped>

</style>