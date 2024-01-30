<script setup lang="ts">
const emit = defineEmits(['complete'])
const slug = useRoute().params.slug as string
const modalOpen = ref(false)
const formState = reactive({
  title: undefined,
  url: undefined,
  description: undefined,
  tags: [],
})

function resetForm() {
  formState.title = undefined
  formState.url = undefined
  formState.description = undefined
  formState.tags = []
}

async function onSubmit() {
  modalOpen.value = false
  await $fetch(`/api/links/${slug}/add`, {
    method: 'POST',
    body: formState,
  })
  emit('complete')
  resetForm()
}
</script>

<template>
  <UButton block class="max-w-24" @click="modalOpen = true">
    Add
  </UButton>
  <UModal v-model="modalOpen" @close="resetForm">
    <UCard>
      <template #header>
        <h2>Add new link</h2>
      </template>
      <UForm :state="formState" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="URL" name="url">
          <UInput v-model="formState.url" placeholder="Url" />
        </UFormGroup>
        <UFormGroup label="Title" name="title">
          <UInput v-model="formState.title" placeholder="Title"/>
        </UFormGroup>
        <UFormGroup label="Tags" name="tags">
          <UInput v-model="formState.tags" placeholder="Tags"/>
        </UFormGroup>
        <UFormGroup label="Description" name="description">
          <UTextarea v-model="formState.description" placeholder="Description"/>
        </UFormGroup>
        <UButton type="submit">
          Submit
        </UButton>
      </UForm>
    </UCard>
  </UModal>
</template>

<style scoped>

</style>