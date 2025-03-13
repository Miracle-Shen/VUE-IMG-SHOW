import { createRouter, createWebHistory } from 'vue-router';
import TaskPlan from '../component/TaskPlan.vue';
// import Result from '../component/Result.vue'; // 假设 Result.vue 是目标页面

const routes = [
    {
        path: '/',
        name: 'TaskPlan',
        component: TaskPlan
    },
    // {
    //     path: '/result',
    //     name: 'Result',
    //     component: Result
    // }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;

