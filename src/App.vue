<template>
  <div id="app">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
        <Navbar />
         <div>
            <router-view></router-view>
         </div>
        <Footer />
        <div v-if="login_register_table">
          <LoginRegister />
        </div>

  </div>
</template>

<script>



import Footer from './components/Footer.vue'
import Navbar from './components/Navbar.vue'
import LoginRegister from './components/LoginRegister.vue'

import { mapState } from 'vuex'

export default {
  components: { Navbar, Footer, LoginRegister},
  name: 'App',
  computed: {
    ...mapState(['login_register_table'])
  }


}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

}
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  text-decoration: none;
  list-style: none;
}
input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
font-style: italic;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}


</style>