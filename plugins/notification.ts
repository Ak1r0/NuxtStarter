import Vue3Toasity, {type ToastContainerOptions, toast} from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

/**
 * @see https://vue3-toastify.js-bridge.com/
 *
 * Declare default configuration for vue3-toastify toasters
 */
export default defineNuxtPlugin({
    name: 'notification',
    enforce: 'pre', // or 'post'
    async setup (nuxtApp) {
        // this is the equivalent of a normal functional plugin
        // do something in the hook
        nuxtApp.vueApp.use(Vue3Toasity,
            {
                transition: 'zoom',
                autoClose: 5000,
                position: toast.POSITION.TOP_RIGHT,
            } satisfies ToastContainerOptions,
        );
    },
    hooks: {
        // You can directly register Nuxt app runtime hooks here
        'app:created'() {

        }
    },
    env: {
        // Set this value to `false` if you don't want the plugin to run when rendering server-only or island components.
        islands: false
    },
})
