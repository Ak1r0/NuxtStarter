import process from 'node:process'

export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  runtimeConfig: {
    public: {
      url: 'http://localhost:3000',
    },
    stripe: {
      publishableKey: '',
      secretKey: '',
      webhookSecret: '',
    },
  },
  modules: ['@nuxt/ui', '@formkit/auto-animate/nuxt', '@nuxtjs/plausible'],
  ui: {
    global: true,
    icons: ['solar', 'tabler', 'octicon', 'devicon', 'logos'],
  },

  plausible: {
    domain: process.env.PLAUSIBLE_DOMAIN,
    apiHost: process.env.PLAUSIBLE_API_HOST ?? 'https://plausible.io',
    trackLocalhost: true,
  },
})
