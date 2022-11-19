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
      path: '/',
      name: 'inventory',
      component: () => import('../views/InventoryView.vue'),
    },
  ],
})

export default router
