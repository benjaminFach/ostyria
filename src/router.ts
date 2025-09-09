import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from './components/Home.vue'
import Treasury from './components/Treasury.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home },
  { path: '/treasury', name: 'treasury', component: Treasury },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})