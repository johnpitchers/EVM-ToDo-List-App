import { createRouter, createWebHistory } from 'vue-router'
import TodosView from '../views/TodosView.vue'
import AboutView from "@/views/AboutView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TodosView
    },
    {
      path: '/help',
      name: 'help',
      component: AboutView
    }
  ]
})

export default router;
