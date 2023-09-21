import { createWebHistory, createRouter } from "vue-router"
import Home from "@/views/Home.vue"
import PageNotFound from '@/views/PageNotFound.vue'


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/approve",
    name: "Approve",
    component: () => import('../views/Approve.vue'),
  },
  {
    path: "/teamsignup",
    name: "Team Signup",
    component: () => import('../views/TeamSignup.vue'),
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/teamroster',
    name: 'Team Roster',
    component: () => import('../views/TeamRoster.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/forgot',
    name: 'Forgot Password',
    component: () => import('../views/ForgotPassword.vue')
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('../views/Onboarding.vue')
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('../views/Payment.vue')
  },
  {
    path: '/:catchAll(.*)*',
    name: "PageNotFound",
    component: PageNotFound,
  },
]

const router = createRouter({
    history: createWebHistory(),
    routes
  })

export default router
