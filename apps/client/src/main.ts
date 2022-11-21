import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vfmPlugin } from 'vue-final-modal'
import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(
  vfmPlugin({
    key: '$vfm',
    componentName: 'VueFinalModal',
    dynamicContainerName: 'ModalsContainer',
  })
)
app.use(router)

app.mount('#app')
