import type {User} from "lucia";

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUser()
  const { data, error } = await useFetch('/api/me') satisfies {data: Ref<{user: User}>}

  console.log('user', user);

  if (error.value)
    throw createError('Failed to fetch data')

  user.value = data.value?.user ?? null

  if (to.path.startsWith('/app') && !user.value)
    return navigateTo('/login')
})
