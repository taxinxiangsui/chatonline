import { createApp } from 'vue'
import App from './App.vue'
import vConsole from 'vconsole'
const app = createApp(App)
// app.use((new vConsole()) as any)
app.mount('#app')
