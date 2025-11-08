<template>
  <div class="p-6">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-2xl font-bold mb-4">Treasury</h2>
      <button
        type="button"
        class="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        @click="open = true"
      >
        Add Item
      </button>
    </div>
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

    <!-- Modal (UI only for now) -->
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <!-- backdrop -->
      <div class="absolute inset-0 bg-black/40" @click="open = false"></div>

      <!-- panel -->
      <div class="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold">Add Treasury Item</h3>
          <button
            type="button"
            class="p-2 rounded hover:bg-gray-100"
            @click="open = false"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <!-- show minimal error -->
        <p v-if="errorMsg" class="mb-3 text-sm text-red-600">{{ errorMsg }}</p>

        <form class="space-y-4" @submit.prevent="submitNewItem">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="flex flex-col gap-1">
              <span class="text-sm text-gray-700">Item *</span>
              <input v-model="draft.item" type="text" class="border rounded px-3 py-2" required />
            </label>

            <label class="flex flex-col gap-1">
              <span class="text-sm text-gray-700">Holder</span>
              <input v-model="draft.holder" type="text" class="border rounded px-3 py-2" />
            </label>

            <label class="flex flex-col gap-1">
              <span class="text-sm text-gray-700">Source</span>
              <input v-model="draft.source" type="text" class="border rounded px-3 py-2" />
            </label>

            <label class="flex flex-col gap-1">
              <span class="text-sm text-gray-700">Session Found</span>
              <input v-model.number="draft.sessionFound" type="number" class="border rounded px-3 py-2" />
            </label>

            <label class="flex flex-col gap-1">
              <span class="text-sm text-gray-700">Weight</span>
              <input v-model.number="draft.weight" type="number" step="0.01" class="border rounded px-3 py-2" />
            </label>

            <label class="flex flex-col gap-1">
              <span class="text-sm text-gray-700">Value</span>
              <input v-model.number="draft.value" type="number" step="0.01" class="border rounded px-3 py-2" />
            </label>
          </div>

          <label class="flex flex-col gap-1">
            <span class="text-sm text-gray-700">Description</span>
            <textarea v-model="draft.description" rows="3" class="border rounded px-3 py-2"></textarea>
          </label>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" class="px-3 py-2 rounded border" @click="open = false" :disabled="saving">Cancel</button>
            <button
              type="submit"
              class="px-3 py-2 rounded bg-blue-600 text-white"
              :class="saving ? 'opacity-60 cursor-not-allowed' : ''"
              :disabled="saving"
            >
              {{ saving ? 'Saving…' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>


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
const API_BASE = 'https://70l9flyief.execute-api.us-east-2.amazonaws.com'

onMounted(async () => {
  const res = await fetch(`${API_BASE}/items`)
  if (!res.ok) return
  rows.value = await res.json()
  console.log('mounted')
})

/* Modal UI state only (no submission yet) */
const open = ref(false)
const saving = ref(false)
const errorMsg = ref<string | null>(null)
const draft = ref<Partial<ItemRow>>({
  item: '',
  holder: '',
  source: '',
  sessionFound: null,
  weight: null,
  description: '',
  value: null,
})

async function submitNewItem() {
  errorMsg.value = null
  if (!draft.value.item?.trim()) {
    errorMsg.value = '"Item" is required'
    return
  }

  saving.value = true
  try {
    const res = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item: draft.value.item,
        holder: draft.value.holder,
        source: draft.value.source,
        sessionFound: draft.value.sessionFound,
        weight: draft.value.weight,
        description: draft.value.description,
        value: draft.value.value,
      }),
    })
    if (!res.ok) {
      const t = await res.text()
      throw new Error(t || `HTTP ${res.status}`)
    }
    const created: ItemRow = await res.json()
    rows.value = [created, ...rows.value]   // show it immediately
    open.value = false                      // close modal
    // reset form
    draft.value = { item: '', holder: '', source: '', sessionFound: null, weight: null, description: '', value: null }
  } catch (e:any) {
    errorMsg.value = e?.message || 'Failed to save'
  } finally {
    saving.value = false
  }
}

</script>