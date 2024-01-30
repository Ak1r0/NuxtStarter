<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type {Library} from "~/server/database/schema";

const modalOpen = ref(false)
const route = useRoute()
const { data, refresh } = await useFetch('/api/me/libs') satisfies { data: Ref<{libs: Library[]}>}
const items = computed(() => [
  data.value?.libs.map(lib => ({ label: lib.name, to: `/app/${lib.slug}` })) || [],
  [{ icon: 'i-solar-add-circle-line-duotone', label: 'Create new team', click: () => {
    modalOpen.value = true
  } }],
])
const lib = computed(() => data.value?.libs.find(lib => lib.slug === route.params.slug))

const formState = reactive({
  name: undefined,
})
async function onSubmit(event: FormSubmitEvent<any>) {
  modalOpen.value = false
  const lib = await $fetch('/api/libs', {
    method: 'post',
    body: event.data,
  }) satisfies Library
  // refresh()
  // navigateTo(`/app/${lib.slug}`)
}
</script>

<template>
  <div class="flex items-center gap-2">
    <UDropdown :items="items" class="border border-gray-200 dark:border-gray-800 rounded-xl py-1 px-2 text-sm">
      <span class="flex items-center gap-2 justify-between">{{ lib?.name }} <UIcon name="i-solar-alt-arrow-down-line-duotone" /> </span>
    </UDropdown>
  </div>

  <UModal v-model="modalOpen">
    <UCard>
      <template #header>
        <h2>Create new team</h2>
      </template>
      <UForm :state="formState" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Name" name="name">
          <UInput v-model="formState.name" placeholder="Name" required />
        </UFormGroup>

        <UButton type="submit">
          Submit
        </UButton>
      </UForm>
    </UCard>
  </UModal>
</template>
