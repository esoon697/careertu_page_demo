import Vue from 'vue'
import Router from 'vue-router'
import CareerTu from '@/pages/careertu'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CareerTu',
      component: CareerTu
    }
  ]
})
