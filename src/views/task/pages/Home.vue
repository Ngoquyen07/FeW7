<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div class="card-body">

        <!-- HEADER -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0">Danh sách Task</h4>

          <!-- CREATE BUTTON -->
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
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Mô tả</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
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

const router = useRouter();

const tasks = ref([]);
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

async function removeTask(id: number): Promise<void> {
  if (confirm("Xóa task này?")) {
    await taskAPI.delete(id);
    await loadTasks(currentPage.value);
  }
}

onMounted(() => loadTasks());
</script>