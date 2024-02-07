<script setup lang="ts">
const localePath = useLocalePath();
const user = useUser();
const route = useRoute();
const items = computed(() => [
  [{
    label: user.value?.email ?? '',
    slot: 'account',
    disabled: true,
  }],
  [{
    label: $t('profile'),
    icon: 'i-heroicons-cog-8-tooth',
    to: '/app/profile',
  }],
  [{
    label: $t('signOut'),
    icon: 'i-heroicons-arrow-left-on-rectangle',
    external: true,
    to: '/logout',
  }],
]);
</script>

<template>
  <div v-if="user" class="flex items-center gap-2">
    <NuxtLink v-if="!route.path.startsWith('/app')" to="/app">
      Dashboard
    </NuxtLink>
    <span v-else class="text-sm">{{ user?.name }}</span>
    <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }">
      <UAvatar icon="i-solar-user-bold-duotone" />

      <template #account="{ item }">
        <div class="text-left">
          <p>
            {{ $t('signedWith') }}
          </p>
          <p class="truncate font-medium">
            {{ item.label }}
          </p>
        </div>
      </template>

      <template #item="{ item }">
        <span class="truncate">{{ item.label }}</span>

        <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 ms-auto" />
      </template>
    </UDropdown>
  </div>
  <div v-else>
    <NuxtLink
      :to="localePath('/login')"
      class="py-3 px-4 text-center border border-gray-200 dark:border-gray-800 rounded-md block lg:inline lg:border-0"
    >
      {{ $t('login') }}
    </NuxtLink>
  </div>
</template>
