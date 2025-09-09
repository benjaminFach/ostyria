<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Treasury</h2>

    <table class="min-w-full border border-gray-300 text-left">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 border-b">Item</th>
          <th class="px-4 py-2 border-b">Holder</th>
          <th class="px-4 py-2 border-b">Source</th>
          <th class="px-4 py-2 border-b">Session Found</th>
          <th class="px-4 py-2 border-b">Weight</th>
          <th class="px-4 py-2 border-b">Description</th>
          <th class="px-4 py-2 border-b">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.id" class="odd:bg-white even:bg-gray-50">
          <td class="px-4 py-2 border-b">{{ r.item }}</td>
          <td class="px-4 py-2 border-b">{{ r.holder ?? '' }}</td>
          <td class="px-4 py-2 border-b">{{ r.source ?? '' }}</td>
          <td class="px-4 py-2 border-b">{{ r.sessionFound ?? '' }}</td>
          <td class="px-4 py-2 border-b">{{ r.weight ?? '' }}</td>
          <td class="px-4 py-2 border-b">{{ r.description ?? '' }}</td>
          <td class="px-4 py-2 border-b">{{ r.value ?? '' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

type ItemRow = {
  id: number
  item: string
  holder: string | null
  source: string | null
  sessionFound: number | null
  weight: number | null
  description: string | null
  value: number | null
}

const rows = ref<ItemRow[]>([])

// Replace with your API Gateway invoke URL base (no trailing slash)
const API_BASE = import.meta.env.VITE_API_BASE as string

onMounted(async () => {
  const res = await fetch(`${API_BASE}/items`)
  if (!res.ok) return
  rows.value = await res.json()
  console.log('mounted')
})
</script>