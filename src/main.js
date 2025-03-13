// console.log('Happy developing ✨')
import { createApp } from 'vue'; // Vue 3 中用于创建 Vue 应用实例的函数
import App from './App.vue'; //整个应用的入口组件
// import router from './router';
import store from './store';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export const EventBus = createApp({}).config.globalProperties.$eventBus = {};//一个空的 Vue 应用实例，并将其配置为事件总线。通过 globalProperties 属性将事件总线暴露给全局，以便在其他组件中访问。

const app = createApp(App);
app.use(store);  
// app.use(router);
app.use(ElementPlus);
app.mount('#app'); //调用 app.mount('#app') 将 Vue 应用挂载到 HTML 中的 id="app" 的元素上
