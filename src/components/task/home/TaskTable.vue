<script setup lang="ts">
    import type {Task} from "../../../interfaces/Task.ts";
    import LoadCircle from "../general/LoadCircle.vue";
    const props = defineProps<{
      tasks: Task[];
      currentPage: number;
      goEdit: (id : number) => void;
      removeTask: (id : number) => void;
      pagination: any;
      loading : boolean ;
    }>();
    function capitalize(text: string) {
      if (!text) return "";
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
</script>

<template>

  <table class="table table-bordered">
    <thead>
    <tr>
      <th>No.</th>
      <th>Title</th>
      <th>Description</th>
      <th>Status</th>
      <th colspan="2"  class="text-center" >Action</th>
    </tr>
    </thead>
    <tbody>
    <tr v-if="props.loading" >
      <td colspan="5" class="text-center text-muted py-3">
        <LoadCircle :loading="props.loading" />
      </td>
    </tr>
    <tr v-else v-for="(task, index) in props.tasks" :key="task.id">
      <td>{{ index + 1 + (props.currentPage - 1) * (props.pagination.per_page ??props.tasks.length) }}</td>
      <td>{{ task.title }}</td>
      <td>{{ task.description }}</td>
      <td>{{  capitalize(task.status) }}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" @click="props.goEdit(task.id)">
          Edit
        </button>
      </td>
      <td>
        <button class="btn btn-sm btn-danger" @click="props.removeTask(task.id)">
          Delete
        </button>
      </td>
    </tr>

    <tr v-if="props.tasks.length === 0">
      <td colspan="5" class="text-center text-muted py-3">
        There are no tasks yet.
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>

</style>