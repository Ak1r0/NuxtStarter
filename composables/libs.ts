export async function useOrgs() {
  return useFetch('/api/me/libs')
}

export async function useLibData() {
  const route = useRoute()
  return useFetch(() => `/api/libs/${route.params.slug}`)
}
