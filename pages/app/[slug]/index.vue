<script setup lang="ts">
const route = useRoute()
const { data } = await useOrgs()
if (data.value && !data.value.orgs.some(o => o.org.slug === route.params.slug)) {
  const slug = data.value.orgs.find(o => o.default)?.org.slug ?? '' as string
  if (!slug)
    await navigateTo('/')

  const path = route.path.split('/')
  path.splice(2, 0, slug)
  await navigateTo(path.join('/'))
}

const { data: links } = await useLinks();

const columns = [{
  key: 'title',
  label: 'Title',
  sortable: true,
}, {
  key: 'description',
  label: 'Description'
}, {
  key: 'tags',
  label: 'Tags',
  sortable: true,
}, {
  key: 'url',
  label: 'URL',
  sortable: true,
}]
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
        <UCard class="col-span-2 min-h-80">
          <UTable :rows="links" />
        </UCard>
      </div>
    </div>
  </section>
</template>
