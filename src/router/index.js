import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import AssociationView from '@/views/Association/AssociationView.vue'
import MembersView from '@/views/Association/MembersView.vue'
import { projectAuth } from '@/firebase/config'
import MeetingView from '@/views/meeting/MeetingView.vue'

// route guard
const requiredAuth = (to, from, next) => {
  let user = projectAuth.currentUser
  if (!user) {
    next({ name: 'home' })
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/Welcome',
    name: 'welcome',
    component: WelcomeView,
    beforeEnter: requiredAuth
  },
  {
    path: '/Association/:id/members',
    name: 'members',
    component: MembersView,
    beforeEnter: requiredAuth,
    props: true
  },
  {
    path: '/Association/:id/home',
    name: 'Association',
    component: AssociationView,
    beforeEnter: requiredAuth,
    props: true
  },
  {
    path: '/Meeting/:id/meeting_home',
    name: 'Meetings',
    component: MeetingView,
    beforeEnter: requiredAuth,
    props: true
  },
  // {
  //   path: '/Meeting/:id',
  //   name: 'NewMeeting',
  //   component: NewMeetingView,
  //   beforeEnter: requiredAuth,
  //   props: true
  // },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
