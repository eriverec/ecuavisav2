import { canNavigate } from '@layouts/plugins/casl'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { isUserLoggedIn } from './utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/pages/password-recovery/forgot-password',
      name: 'forgot-password',
      component: () => import('@/pages/pages/password-recovery/forgot-password.vue'),
      meta: { requiresAuth: false}
    },
    {
      path: '/pages/password-recovery/reset-password',
      name: 'reset-password',
      component: () => import('@/pages/pages/password-recovery/reset-password.vue'),
      meta: { requiresAuth: false}
    },
    {
      path: '/pages/errors/not-authorized',
      name: 'not-authorized',
      component: () => import('@/pages/pages/errors/not-authorized.vue'),
      meta: { requiresAuth: false}
    },
    {
      path: '/',
      redirect: to => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        const userRole = userData && userData.role ? userData.role : null
        if (userRole || userData){
          if(userRole == "redaccion"){
            return { path: 'apps/mailing/tabs/edit' }
          }
          return { name: 'index' }
        }
          
        
        //if (userRole === 'visor')
        //  return { name: 'access-control' }
        
        return { name: 'login', query: to.query }
      },
    },
    ...setupLayouts(routes),
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards

router.beforeEach(to => {
  const isLoggedIn = isUserLoggedIn()

  /*
  
    ℹ️ Commented code is legacy code
  
    if (!canNavigate(to)) {
      // Redirect to login if not logged in
      // ℹ️ Only add `to` query param if `to` route is not index route
      if (!isLoggedIn)
        return next({ name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } })
  
      // If logged in => not authorized
      return next({ name: 'not-authorized' })
    }
  
    // Redirect if logged in
    if (to.meta.redirectIfLoggedIn && isLoggedIn)
      next('/')
  
    return next()
  
    */
  if (to.meta.requiresAuth === false) {
      // Bypass the route guard
  } else {
      // Perform the regular route guard logic
      // e.g., check authentication, user permissions, etc.
      // ...
    
  if (canNavigate(to)) {
    if (to.meta.redirectIfLoggedIn && isLoggedIn)
      return '/'
  }
  else {
    if (isLoggedIn)
      return { name: 'not-authorized' }
    else
      return { name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } }
  }
  }
})
export default router
