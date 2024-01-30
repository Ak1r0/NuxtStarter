import type { Link } from "~/server/database/schema"

export async function useLinks() {
  return useFetch('/api/me/links') satisfies { data: Ref<{links: Link[]}>}
}

export async function useLinksData() {
  const route = useRoute()
  return useFetch(() => `/api/links/${route.params.slug}`)
}
