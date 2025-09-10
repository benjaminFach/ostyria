<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Treasury</h2>

    <!-- DataTables component -->
    <DataTable
      :data="rows"
      :columns="columns"
      class="display stripe hover w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net'   // core engine

// hook the core into the Vue wrapper
DataTable.use(DataTablesCore)

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

// Column mapping for DataTables (titles match your headers)
const columns = [
  { title: 'Item', data: 'item' },
  { title: 'Holder', data: 'holder' },
  { title: 'Source', data: 'source' },
  { title: 'Session Found', data: 'sessionFound' },
  { title: 'Weight', data: 'weight' },
  { title: 'Description', data: 'description' },
  { title: 'Value', data: 'value' },
]


// Replace with your API Gateway invoke URL base (no trailing slash)
const API_BASE = 'https://70l9flyief.execute-api.us-east-2.amazonaws.com'

onMounted(async () => {
  const res = await fetch(`${API_BASE}/items`)
  if (!res.ok) return
  rows.value = await res.json()
  console.log('mounted')
})
</script>