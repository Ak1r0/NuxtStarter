<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

const user = useUser()
if (user.value)
  await navigateTo('/app')

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

const errorMessage = ref('')
const state = reactive({
  email: undefined,
  password: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const res = await $fetch('/api/auth/login', {
    ignoreResponseError: true,
    method: 'POST',
    body: event.data,
    redirect: 'manual',
  })
  if (res.success)
    await navigateTo('/app')
  else
    errorMessage.value = res.message
}
</script>

<template>
  <UCard class="max-w-sm mx-auto mt-52">
    <UAlert v-if="errorMessage" :title="errorMessage" class="mb-2" variant="soft" color="orange" />
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton type="submit">
        Submit
      </UButton>
    </UForm>
  </UCard>
</template>