<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ msg: string }>();
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <p>
      Edit
      <code>components/Home.vue</code> to test HMR
    </p>
  </div>

  <p class="read-the-docs">Click on the logo to learn what's tracked</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
