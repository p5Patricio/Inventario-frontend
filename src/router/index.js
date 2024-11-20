import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/tiendas',
    name: 'tiendas',
    component: () => import(/* webpackChunkName: "about" */ '../views/Tiendas.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "about" */ '../views/DashBoard.vue')
  },
  {
    path: '/reportes',
    name: 'reportes',
    component: () => import(/* webpackChunkName: "about" */ '../views/Reportes.vue')
  },
  {
    path: '/proveedores',
    name: 'proveedores',
    component: () => import(/* webpackChunkName: "about" */ '../views/Proveedores.vue')
  },
  {
    path: '/ordenes',
    name: 'ordenes',
    component: () => import(/* webpackChunkName: "about" */ '../views/Ordenes.vue')
  },
  {
    path: '/inventario',
    name: 'inventario',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Inventario.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
