<script setup lang="ts">
import type {Library} from "~/server/database/schema";

const { data } = await useFetch('/api/me/libs') satisfies { data: Ref<{libs: Library[]}>}
</script>

<template>
  <h1 class="text-lg font-medium">
    Dashboard
  </h1>

  <div class="mt-8 my-4">
    <AppAddLinkButton @complete="" />
  </div>

  <section class="pb-14">
    <div class="max-w-screen-xl mx-auto px-4 md:px-8">
      <div class="grid lg:grid-cols-2 gap-8 mt-8">
        <template v-for="lib in data.libs" :key="lib.slug" >
          <AppLibrary :lib="lib" />
        </template>
      </div>
    </div>
  </section>
</template>
