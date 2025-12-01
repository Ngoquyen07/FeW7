<script setup lang="ts">
    import type {Task} from "../../../interfaces/Task.ts";
    const props = defineProps<{
      tasks: Task[];
      currentPage: number;
      goEdit: (id : number) => void;
      removeTask: (id : number) => void;
      pagination: any
    }>();


</script>

<template>

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

    <tr v-for="(task, index) in props.tasks" :key="task.id">
      <td>{{ index + 1 + (props.currentPage - 1) * (props.pagination.per_page ??props.tasks.length) }}</td>
      <td>{{ task.title }}</td>
      <td>{{ task.description }}</td>
      <td>{{ task.status }}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" @click="props.goEdit(task.id)">
          Sửa
        </button>
        <button class="btn btn-sm btn-danger" @click="props.removeTask(task.id)">
          Xóa
        </button>
      </td>
    </tr>

    <tr v-if="props.tasks.length === 0">
      <td colspan="5" class="text-center text-muted py-3">
        Chưa có task nào luôn
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>

</style>