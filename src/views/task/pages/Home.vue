<template>
  <div class="container mt-4">

    <SideBar :logout="logout" />

    <div
        class="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
        style="z-index: 1055;"
    >
    <div
          id="liveToast"
          class="toast align-items-center text-white border-0"
          :class="messageType === 'success' ? 'bg-success' : 'bg-danger'"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">
            {{ message }}
          </div>
          <button
              type="button"
              class="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
          ></button>
        </div>
      </div>
    </div>
    <div
        class="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
        style="z-index: 1100;"
    >
      <div
          id="logoutToast"
          class="toast align-items-center text-white bg-primary border-0"
          role="alert"
      >
        <div class="d-flex">
          <div class="toast-body">
            Logging out...
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto"
                  data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">

        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0">List of tasks</h4>
          <button class="btn btn-primary" @click="goCreate">+ New</button>
        </div>

        <input
            v-model="search"
            @keyup.enter="loadTasks(1)"
            class="form-control mb-3"
            placeholder="Search..."
        />

        <TaskTable
            :tasks="tasks"
            :currentPage="currentPage"
            :pagination="pagination"
            :goEdit="goEdit"
            :removeTask="openDeleteModal"
            :loading="loading"
        />

<!--        <LoadCircle :loading="loading" />-->

        <div class="d-flex justify-content-between mt-3" v-if="!loading && tasks.length > 0">
          <button
              class="btn btn-secondary"
              @click="prevPage"
              :disabled="currentPage <= 1"
          >
            Prev
          </button>

          <span>Page {{ currentPage }} / {{ pagination.last_page || 1 }}</span>

          <button
              class="btn btn-secondary"
              @click="nextPage"
              :disabled="currentPage >= (pagination.last_page || 1)"
          >
            Next
          </button>
        </div>

      </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">

          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            Are you sure to delete this task?<br>
            <strong class="text-danger">This action can not be undone!</strong>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>

            <button type="button" class="btn btn-danger" @click="confirmDelete">
              Delete
            </button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Modal, Toast } from "bootstrap";
import { useRouter } from "vue-router";

// Import API & Stores
import taskAPI from "../../../api/task/taskAPI";
import auth from "../../../api/auth/auth";
import { user } from "../../../stores/auth";

// Import Interfaces
import type { Task } from "../../../interfaces/Task";

// Import Components
import SideBar from "../../../components/task/home/SideBar.vue";
import TaskTable from "../../../components/task/home/TaskTable.vue";
// import LoadCircle from "../../../components/task/general/LoadCircle.vue";

// Define Pagination Interface
interface PaginationData {
  current_page: number;
  last_page: number;
  total: number;
  [key: string]: any;
}

const router = useRouter();

// State
const tasks = ref<Task[]>([]);
const pagination = ref<PaginationData>({ current_page: 1, last_page: 1, total: 0 });
const search = ref("");
const currentPage = ref(1);
const loading = ref(false);

// Toast & Modal Instances
const message = ref("");
const messageType = ref<"success" | "danger" | "">("");
let toastInstance: Toast | null = null;
let deleteModal: Modal | null = null;
const deleteId = ref<number | null>(null);

/* =============================
    LIFECYCLE
=============================== */

let logoutToast: Toast | null = null;

onMounted(() => {
  // Init Modal
  const modalEl = document.getElementById("deleteModal");
  if (modalEl) {
    deleteModal = new Modal(modalEl);
  }

  // Init Toast
  const toastEl = document.getElementById("liveToast");
  if (toastEl) {
    toastInstance = new Toast(toastEl);
  }
  const lg = document.getElementById("logoutToast");
  if (lg) logoutToast = new Toast(lg);

  loadTasks();
});

/* =============================
    LOAD TASKS
=============================== */
async function loadTasks(page = 1): Promise<void> {
  loading.value = true;
  try {
    const res = await taskAPI.getAll({
      page: page,
      search: search.value,
    });

    tasks.value = res.data.data;
    pagination.value = res.data;
    currentPage.value = res.data.current_page;
  } catch (error) {

  } finally {
    loading.value = false;
  }
}

/* =============================
    TOAST HELPER (NEW)
=============================== */
function showToast(msg: string, type: "success" | "danger") {
  message.value = msg;
  messageType.value = type;

  // đảm bảo DOM toast đã được render xong trước khi show
  requestAnimationFrame(() => {
    if (toastInstance) {
      toastInstance.show();
    }
  });
}

watch(message, (val) => {
  if (val && toastInstance) {
    toastInstance.show();
  }
});

/* =============================
    DELETE LOGIC
=============================== */
function openDeleteModal(id: number) {
  deleteId.value = id;
  deleteModal?.show();
}

async function confirmDelete() {
  if (!deleteId.value) return;

  try {
    const res = await taskAPI.delete(deleteId.value);

    if (res.status === 200) {
      showToast("Task deleted successfully!", "success");

      // FIX LOGIC: Nếu trang hiện tại chỉ còn 1 item và không phải trang 1
      // thì lùi về trang trước sau khi xóa
      if (tasks.value.length === 1 && currentPage.value > 1) {
        currentPage.value--;
      }

      await loadTasks(currentPage.value);
    }
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || "Delete failed!";
    showToast(errorMsg, "danger");
  }

  deleteModal?.hide();
}

/* =============================
    PAGINATION
=============================== */
function nextPage() {
  if (currentPage.value < pagination.value.last_page) {
    loadTasks(currentPage.value + 1);
  }
}
function prevPage() {
  if (currentPage.value > 1) {
    loadTasks(currentPage.value - 1);
  }
}

/* =============================
    SEARCH WATCHER
=============================== */
// Tự động reload về trang 1 khi xóa trắng ô search
watch(search, (newVal) => {
  if (!newVal) {
    loadTasks(1);
  }
});

/* =============================
    NAVIGATION & AUTH
=============================== */
function goCreate() {
  router.push("/tasks/create");
}

function goEdit(id: number) {
  router.push(`/tasks/edit/${id}`);
}

async function logout() {
  try {
    if (logoutToast) logoutToast.show();

    await auth.logout();
    user.value = null;

    setTimeout(() => {
      router.push("/login");
    }, 800);  // delay nhẹ để toast hiển thị
  } catch {
    router.push("/login");
  }
}
</script>

<style scoped>
</style>