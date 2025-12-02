<script setup lang="ts">
  const email = defineModel('email', {});
  const props = defineProps<{
    errors : any,
    parent : string
  }>();
</script>

<template>
  <div class="mb-3">
    <label class="form-label fw-semibold">Email</label>
    <input
        type="email"
        class="form-control"
        :class="{ 'is-invalid': props.errors.email }"
        v-model="email"
        placeholder="Nổ cái i mew ..."
    />
    <div class="invalid-feedback" v-if="props.errors.email">
      <!--                {{ errors.email[0] }}-->
      <span v-if="props.parent === 'login'">
        Sai thông tin rồi bố ạ !
      <br>
        Check lại tài khoản đê .
      </span>
      <span v-else-if="props.parent === 'register'">
        {{ props.errors.email[0] }}
      </span>


    </div>
  </div>
</template>

<style scoped>

</style>