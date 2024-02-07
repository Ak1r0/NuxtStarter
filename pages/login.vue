<script setup lang="ts">
import type {FormSubmitEvent} from '#ui/types'
import {z} from 'zod'
import {useFormErrorMapper} from "~/composables/form";
import {isApiError} from "~/utils/isApiError";

const localePath = useLocalePath();
const user = useUser();
const toast = useToaster();

if (user.value) {
  await navigateTo(localePath('/app'));
}

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

const errorMessage = ref('')
const form = ref()
const state = reactive({
  email: undefined,
  password: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: event.data,
    });

    await navigateTo(localePath('/app'));
  }
  catch (error) {
    if(isApiError(error) && !useFormErrorMapper(form, error))  {
      errorMessage.value = error.data.message;
    }
  }
}
</script>

<template>
  <h1 class="text-3xl font-medium mb-4 text-center mt-12 my-8">
    {{ $t('signIn') }}
  </h1>
  <UCard class="max-w-sm mx-auto ">
    <UButton block class="mb-4" variant="outline" color="gray" to="/auth/google" external>
      <UIcon name="i-logos-google-icon" class="h-6 w-6 m-1"/>
      {{ $t('signInGoogle') }}
    </UButton>
    <UDivider class="my-4" label="OR"/>
    <UAlert v-if="errorMessage" :title="errorMessage" class="mb-2" variant="soft" color="orange"/>
    <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email"/>
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password"/>
      </UFormGroup>

      <UButton type="submit">
        {{ $t('submit') }}
      </UButton>
      <p class="text-sm mt-4">
        {{ $t('noAccount') }}
        <NuxtLink to="/signup" class="text-primary">
          {{ $t('signUp') }}
        </NuxtLink>
      </p>
    </UForm>
  </UCard>
</template>
