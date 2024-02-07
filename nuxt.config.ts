import process from 'node:process'

export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  runtimeConfig: {
    databaseUrl: '',
    public: {
      url: '',
      sentry: {
        dsn: '',
      }
    },
    google: {
      clientId: '',
      clientSecret: '',
    },
    stripe: {
      publishableKey: '',
      secretKey: '',
      webhookSecret: '',
    },
  },
  modules: [
    '@nuxt/ui',
    '@formkit/auto-animate/nuxt',
    '@nuxtjs/plausible',
    '@nuxtjs/i18n',
  ],
  ui: {
    global: true,
    icons: ['solar', 'tabler', 'octicon', 'devicon', 'logos'],
  },

  plausible: {
    domain: process.env.PLAUSIBLE_DOMAIN,
    apiHost: process.env.PLAUSIBLE_API_HOST ?? 'https://plausible.io',
    trackLocalhost: true,
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    baseUrl: process.env.NUXT_PUBLIC_URL,
    locales: [
      {
        code: 'en',
        iso: 'en-US'
      },
      {
        code: 'fr',
        iso: 'fr-FR'
      }
    ]
  }
})
