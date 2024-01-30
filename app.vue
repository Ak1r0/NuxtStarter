<script setup lang="ts">
const route = useRoute()
const layout = () => route?.path?.startsWith('/app') ? 'app' : 'default'
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout :name="layout()">
    <NuxtPage />
  </NuxtLayout>
</template>
