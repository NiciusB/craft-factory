import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/craftbook',
      name: 'craftbook',
      component: () => import('../views/CraftbookView.vue'),
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../views/InventoryView.vue'),
    },
    {
      path: '/craft',
      name: 'craft',
      component: () => import('../views/CraftView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/CraftView.vue'),
    },
  ],
})

export default router
