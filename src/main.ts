import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import vTooltip from "@/directive/tooltip/tooltip.ts";
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('tooltip', vTooltip);
app.mount('#app')

export { app }
