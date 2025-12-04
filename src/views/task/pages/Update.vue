<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import taskAPI from "../../../api/task/taskAPI";
import LoadCircle from "../../../components/task/general/LoadCircle.vue";
import { Toast } from "bootstrap";

const route = useRoute();
const router = useRouter();

const form = ref({
  title: "",
  description: "",
  status: "active",
});

const loading = ref(false);

// Error fields
const titleErr = ref<string | null>(null);
const descriptionErr = ref<string | null>(null);
const statusErr = ref<string | null>(null);

// Toast instance
let updateToast: Toast | null = null;

/* ===============================
      LOAD TASK
================================ */
async function loadTask() {
  loading.value = true;

  try {
    const id = Number(route.params.id);
    const res = await taskAPI.getById(id);

    form.value.title = res.data.data.title;
    form.value.description = res.data.data.description;
    form.value.status = res.data.data.status;
  } catch (e: any) {
    if (e.response?.status === 404) {
      router.push("/404");
    }
  } finally {
    loading.value = false;
  }
}

/* ===============================
      UPDATE FUNCTION
================================ */
async function updateTask() {
  loading.value = true;

  // reset error fields
  titleErr.value = null;
  descriptionErr.value = null;
  statusErr.value = null;

  try {
    const id = Number(route.params.id);

    const res = await taskAPI.update(id, {
      title: form.value.title,
      description: form.value.description,
      status: form.value.status,
    });

    if (res.status === 200) {
      if (updateToast) updateToast.show();

      setTimeout(() => {
        router.push("/home");
      }, 1200);
    }
  } catch (e: any) {
    const data = e.response?.data?.errors;

    if (e.response?.status === 422) {
      titleErr.value = data?.title?.[0] ?? null;
      descriptionErr.value = data?.description?.[0] ?? null;
      statusErr.value = data?.status?.[0] ?? null;
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadTask();

  // Init toast
  const toastEl = document.getElementById("updateToast");
  if (toastEl) updateToast = new Toast(toastEl);
});
</script>

<template>
  <div class="container mt-4">

    <!-- SUCCESS TOAST -->
    <div
        class="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
        style="z-index: 1099;"
    >
      <div
          id="updateToast"
          class="toast align-items-center text-white bg-success border-0"
          role="alert"
      >
        <div class="d-flex">
          <div class="toast-body">
            Task updated successfully!
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>

    <!-- CARD -->
    <div class="card shadow-sm">
      <div class="card-body">

        <h4 class="mb-4 fw-bold text-primary">Update Task</h4>

        <LoadCircle :loading="loading" />

        <form v-if="!loading" @submit.prevent="updateTask">

          <!-- TITLE -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Title</label>
            <input
                v-model="form.title"
                type="text"
                class="form-control"
                placeholder="Enter title"
                readonly
            />
            <div v-if="titleErr" class="text-danger small mt-1">{{ titleErr }}</div>
          </div>

          <!-- DESCRIPTION -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Description</label>
            <textarea
                v-model="form.description"
                rows="4"
                class="form-control"
                placeholder="Edit description..."
            ></textarea>
            <div v-if="descriptionErr" class="text-danger small mt-1">{{ descriptionErr }}</div>
          </div>

          <!-- STATUS -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Status</label>
            <select v-model="form.status" class="form-select">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div v-if="statusErr" class="text-danger small mt-1">{{ statusErr }}</div>
          </div>

          <!-- BUTTONS -->
          <div class="d-flex gap-3 mt-4">
            <button class="btn btn-primary px-4" :disabled="loading">
              Save changes
            </button>

            <button type="button" class="btn btn-outline-secondary px-4" @click="router.back()">
              Back
            </button>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>

<style scoped></style>
