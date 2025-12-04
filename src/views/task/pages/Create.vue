<script setup lang="ts">
import {onMounted, ref} from "vue";
import { useRouter } from "vue-router";
import taskAPI from "../../../api/task/taskAPI.ts";
import { Toast } from "bootstrap";

const router = useRouter();

const form = ref({
  title: "",
  description: "",
  status: "active",
});

// const errors = ref<any>({});
const loading = ref(false);
const message = ref("");
const  titleErr = ref<string | null>(null);
const   descriptionErr = ref<string | null>(null);
const   statusErr = ref<string | null>(null);
let successToast: Toast | null = null;
async function handleSubmit() {
  loading.value = true;

  message.value = "";

  try {
    const res = await taskAPI.create(form.value);

    // Nếu backend trả 201 / 200 đều ok
    if (res.status === 201 || res.status === 200) {
      titleErr.value = null ;
      descriptionErr.value = null
      statusErr.value = null ;
      if (successToast) successToast.show();
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    }
  } catch (e: any) {
    if (e.response.status === 422 ) {
      titleErr.value = e.response.data.error?.title?.[0] ?? null ;
      descriptionErr.value = e.response.data.error?.description?.[0]  ?? null ;
      statusErr.value = e.response.data.error?.status?.[0] ?? null;
    } else {
      console.error(e);
      message.value = e.response.data.message;
    }
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  const toastEl = document.getElementById("successToast");
  if (toastEl) successToast = new Toast(toastEl);
});
function goBack() {
  router.push("/home"); // quay lại list
}
</script>

<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h4 class="mb-3">Create new task</h4>

<!--        <Notice :message="message" />-->
        <!-- SUCCESS TOAST -->
        <div
            class="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
            style="z-index: 1055;"
        >
          <div
              id="successToast"
              class="toast align-items-center text-white bg-success border-0"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
          >
            <div class="d-flex">
              <div class="toast-body">
                Task created successfully!
              </div>
              <button
                  type="button"
                  class="btn-close btn-close-white me-2 m-auto"
                  data-bs-dismiss="toast"
              ></button>
            </div>
          </div>
        </div>


        <form @submit.prevent="handleSubmit">
          <!-- Title -->
          <div class="mb-3">
            <label class="form-label">Title</label>
            <input
                type="text"
                class="form-control"
                v-model="form.title"
                placeholder="Type the title"
            />
            <div v-if="titleErr" class="text-danger small mt-1">
              {{ titleErr }}
            </div>
          </div>

          <!-- Description -->
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea
                class="form-control"
                rows="3"
                v-model="form.description"
                placeholder="Short description of the task"
            ></textarea>
            <div v-if="descriptionErr" class="text-danger small mt-1">
              {{ descriptionErr }}
            </div>
          </div>

          <!-- Status -->
          <div class="mb-3">
            <label class="form-label">Status</label>
            <select class="form-select" v-model="form.status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div v-if="statusErr" class="text-danger small mt-1">
              {{ statusErr}}
            </div>
          </div>

          <!-- Buttons -->
          <div class="d-flex gap-2">
            <button class="btn btn-primary" type="submit" :disabled="loading">
              {{ loading ? "Loading..." : "Save task" }}
            </button>

            <button
                class="btn btn-secondary"
                type="button"
                @click="goBack"
                :disabled="loading"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
