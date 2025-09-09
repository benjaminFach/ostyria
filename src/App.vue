<template>
  <div>
    <nav class="bg-gray-100 p-4 flex gap-4 shadow">
      <RouterLink
        to="/"
        class="text-gray-700 hover:text-blue-600 font-medium"
      >
        Home
      </RouterLink>
      <RouterLink
        to="/treasury"
        class="text-gray-700 hover:text-blue-600 font-medium"
      >
        Treasury
      </RouterLink>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts"></script>