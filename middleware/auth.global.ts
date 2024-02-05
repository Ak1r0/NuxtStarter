import type {User} from "lucia";

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUser()
  const { data} = await useFetch('/api/me') satisfies {data: Ref<{user: User}>}

  user.value = data.value?.user ?? null

  if (to.path.startsWith('/app') && !user.value) {
    return navigateTo('/login')
  }
})
