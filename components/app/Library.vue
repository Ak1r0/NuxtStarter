<script setup lang="ts">
import type {Library} from "~/server/database/schema";

const props = defineProps<{lib: Library}>()
console.log(props.lib.slug)
const { pending, data, error } = await useLazyAsyncData('links', () => $fetch(`/api/libs/${props.lib.slug}/links`))
console.log(error)
</script>

<template>
  <UCard class="col-span-2 min-h-80">
    <h3>{{ lib.name }}</h3>
<!--    <UTable :rows="data.links" :loading="pending" />-->
  </UCard>
</template>

<style scoped>

</style>