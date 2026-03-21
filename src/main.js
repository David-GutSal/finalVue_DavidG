import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axiosInstance from './plugins/axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)

app.config.globalProperties.$axios = axiosInstance

app.use(router)

app.mount('#app')
