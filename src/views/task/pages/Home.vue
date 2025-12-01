<template>
  <div class="container mt-4">

    <!-- BUTTON MỞ SIDEBAR -->
    <SideBar :message="message" :messageType="messageType" :logout="logout"></SideBar>
    <!-- CONTENT -->
    <!--    Header-->
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
<!--        Loading-->

        <!-- Task List -->
        <TaskTable :tasks="tasks" :currentPage="currentPage" :pagination="pagination" :goEdit="goEdit" :removeTask="removeTask"/>
        <LoadCircle :loading="loading"/>
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
import {ref, onMounted} from "vue";
import { useRouter } from "vue-router";
import taskAPI from "../../../api/task/taskAPI.ts";
import auth from "../../../api/auth/auth.ts";
import type {Task} from "../../../interfaces/Task.ts";
import {user} from "../../../stores/auth.ts";
import SideBar from "../../../components/task/home/SideBar.vue";
import TaskTable from "../../../components/task/home/TaskTable.vue";
import LoadCircle from "../../../components/task/general/LoadCircle.vue";

const router = useRouter();
const tasks = ref<Task[]>([]);
const pagination = ref<any>({});
const search = ref("");
const currentPage = ref(1);
const loading = ref(false);

async function loadTasks(page = 1): Promise<void> {
  loading.value = true;
  try{
    const res = await taskAPI.getAll({
      page,
      search: search.value,
    });

    tasks.value = res.data.data;        // Sửa products → tasks
    pagination.value = res.data;
    currentPage.value = res.data.current_page;
  }
  finally{
    loading.value = false;
  }

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