
import App from './App.vue'
import VueRouter from 'vue-router'
import store from './store'
import Vue from 'vue'
import firebase from 'firebase/app'

Vue.use(VueRouter)
Vue.config.productionTip = false

import Category from './components/Category'
import HomePage from './components/HomePage'
import Me from './components/Me'
import Contact from './components/Contact'
import GoodPost from './components/GoodPost'
import Post from './components/Post'
import AdminPage from './components/AdminPage'



const routes = [
  { path: '/', component: HomePage , name: 'home'},
  { path: '/me', component: Me , name: 'me'},
  { path: '/contact', component: Contact , name: 'contact'},
  { path: '/good_post', component: GoodPost , name: 'good_post'},
  { path: '/category_page', component: Category , name: 'category_page'},
  { path: '/post', component: Post , name: 'post'},
  { path: '/admin_page', component: AdminPage , name: 'admin_page'},

]

firebase.initializeApp({
  apiKey: "AIzaSyAGDYXuYXawC4cFuSE_jXX9k1lZrgjTcqk",
  authDomain: "my-blog-image.firebaseapp.com",
  projectId: "my-blog-image",
  storageBucket: "my-blog-image.appspot.com",
  messagingSenderId: "152620509589",
  appId: "1:152620509589:web:e978b16d1fc4f1bedfee9c",
  measurementId: "G-3XZKSTHX5D"
});



const router = new VueRouter({
  mode: 'history', //bo dau /# tren thanh dia chi
  routes 
})

new Vue({
  router,
  render: h => h(App),
  store,
}).$mount('#app')

