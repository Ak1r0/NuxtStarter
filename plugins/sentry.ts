import * as Sentry from "@sentry/vue";

/**
 * @see https://vue3-toastify.js-bridge.com/
 *
 * Declare default configuration for vue3-toastify toasters
 */
export default defineNuxtPlugin({
    name: 'sentry',
    enforce: 'pre', // or 'post'
    async setup (nuxtApp) {
        // this is the equivalent of a normal functional plugin
        // do something in the hook
        const runtimeConfig = useRuntimeConfig();

        Sentry.init({
            app: nuxtApp.vueApp,
            dsn: runtimeConfig.public.sentry.dsn,
            integrations: [
                new Sentry.BrowserTracing({
                    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
                    tracePropagationTargets: ["localhost", runtimeConfig.public.url],
                }),
                Sentry.replayIntegration({
                    maskAllText: false,
                    blockAllMedia: false,
                }),
            ],
            // Performance Monitoring
            tracesSampleRate: 1.0, //  Capture 100% of the transactions
            // Session Replay
            replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
            replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
        });
    },
    hooks: {
        // You can directly register Nuxt app runtime hooks here
        'app:created'() {

        }
    },
    env: {
    },
})
