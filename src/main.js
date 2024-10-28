import '@/assets/css/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/lara';
import KeyFilter from 'primevue/keyfilter';
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';

const app = createApp(App)
app.directive('keyfilter', KeyFilter);
app.use(ToastService);
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Lara,
        options: {
            darkModeSelector: '.my-app-dark',
        }
    }
})

app.mount('#app')
