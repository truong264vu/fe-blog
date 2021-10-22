<template>
  <div>

      <!-- navbar  -->

    <!-- content  -->

    <!-- header  -->
    <!-- css trangsition o app.vue -->
    <transition name="fade"> 
            <div id="search" v-show="input_search">
                <input type="text" placeholder="Search ..." v-model="search.key_search" @keypress.enter="findPost()">
                <input type="submit" @click="INPUT_SEARCH()" >
            </div>
     </transition>
    <div class="header"> 
            <div id="pic-header" >
                    <div class="main-header">
                        <div id="slogan">
                            <h1>Time Write</h1>
                            <p>Write everything you think... </p>
                         </div>
                         <div id="category">
                            <ul v-for="category in categories" :key="category.id" >
                                    <li @click="CATEGORY_ID(category.id), categoryPage()">{{category.name}}</li>

                            </ul>
                         </div>
 
                    </div>
            </div>
 
    </div>

    <!-- container  -->
    <div class="container" v-bind:postId="filter.postId = Post.id" >
        <div>
            <div v-for="post in posts" :key="post.id" id="post">
                <!-- lay ra id cua bai viet  -->
                    <h3 @click="POST(post) ,postPage()" :title="post.title">{{post.title}}</h3> 
                    <p>{{post.short_content}}</p>
            </div>

            <div id="page" >
                <div v-for="page in totalPage" :key="page">
                            <button  :class="{ isPage: currentPage==page }" @click.prevent="currentPage = page " >{{page}}</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>

import network from '../core/network'
import { mapState, mapMutations } from 'vuex'
import _ from 'lodash';

export default {
    name: 'HomePage',
    data() {
        return {
            currentPage: 1,
            posts: [],
            categories: [1],
            totalPage: 0,
            filter: {
                postId: [2],
            },
            search: {
                key_search: ''
             }
        }
    },
    computed: mapState(['Post' , 'CategoryId','input_search']),
    mounted() {
        this.getPosts(); // truy van du lieu tu api,

    },
    watch: {
        currentPage: function() { //hien du lieu khi thay doi currentPage
            this.getPosts();
        },
    },
    created() {  
  
            network.get('category' , this.categories)
                .then( response => {
                this.categories = response.data;
                this.CATEGORY(response.data);
                })
                .catch( error => {
                    console.log(error);
            });
            // document.cookie = this.posts
            
    },
    methods: {
        ...mapMutations(['POST','CATEGORY_ID','CATEGORY','INPUT_SEARCH']),
        getPosts: _.debounce(function(){
            network.get('post?page=' + this.currentPage)
            .then( response => {
                this.posts = response.data.data;
                this.totalPage = response.data.last_page;
            })
            .catch( error => {
                console.log(error);
            })
        },1000),
        categoryPage: function() {
            this.$router.push({name: 'category_page'});
        },
        postPage: function() {
            this.$router.push({name: 'post'});
        },
        findPost: function(){ // tim kiem bai viet
            network.get('findPost' , this.search)
            .then(response => {
                    this.posts = response.data
                    console.log(response.data)
            })
        },

    }
}
</script>

<style scoped>

    
    #search {
        position: fixed;
        background: white;
        top: 10%;
        right: 15%;
        padding: 10px;
        z-index: 1000;
        width: 550px;
    }
    #search input[type=text] {
        width: 500px;
        height: 20px;
        border: none;
        border-bottom: 1px solid rgb(223, 207, 207);
        padding: 0px 10px;
        outline: none;
        position: relative;
    }
    #search input[type=submit] {
        content: ' ........';
        position: absolute;
        right: 10px;
        width: 30px;
        height: 30px;
        background:url('../assets/close_input.png') no-repeat;
        background-size: 12px 12px;
        border: none;
        outline: none;
        text-indent: -10000px;
    }
/* header  */
     .header #pic-header {
        width: 100%;
        height: 500px;
        background: url('../assets/header.jpg') no-repeat ;
        background-size: 100% 500px;
        display: flex;
        padding-left: 25%;
        align-items: center;
        position: relative;
    } 
    .header .main-header #slogan h1{
        font-size: 70px;
        margin-bottom: 20px;
        font-family: Courier;
        color: white;
    }
    .header .main-header #slogan p {
        font-size: 16px;
        margin-bottom: 100px;
        margin-left: 30px;
        color: white;
        font-style: italic;

    }
    .header .main-header #category {
        display: flex;
        /* margin-left: -50%; */
        position: absolute;
        left: 10%;
        bottom: 25%;
        /* transform: translate(-50%,-50%); */
        /* background: rgb(100, 36, 36); */
        }
    .header .main-header #category ul li  {
        font-size: 20px;
        padding: 5px 20px;
        font-family: Courier;
        /* background: rgb(255, 255, 255); */
        border-bottom: 2px solid white;
        border-radius: 10px;
        color: rgb(255, 255, 255);
        font-family: monospace;
    }

    .header .main-header #category ul li:hover {
        cursor: pointer;
        color: rgb(221, 209, 209);
    }

    /* container  */
    .container {
        width: 60%;
        margin: 0px auto;
        text-align: left;
    }
    .container #post {
        margin: 50px 0px;
    }
    .isPage{
      background: rgb(90, 75, 75);
      color: white;
    }
    #page  { 
          width: 70%;
          margin: 20px auto;
          display: flex;
          justify-content: center
    }
    #page button {
      width: 30px;
      height: 40px;
      margin: 0px 5px;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      
    }
    #page button:hover {
        cursor: pointer;
    }

    /* post */
    #post {
        border-bottom: 1px solid rgb(219, 205, 205);
        padding: 50px;
    }
     #post h3:hover {
         cursor: pointer;
     }


     /* responsive */
     @media  (max-width: 900px) {
    #search {
        position: fixed;
        background: white;
        top: 10%;
        right: 30%;
        padding: 10px;
        z-index: 1000;
        width: 300px;
    }
    #search input[type=text] {
        width: 250px;
        height: 18px;
    }

    .header #pic-header {
        height: 300px;
        background-size: 100% 300px;
    } 
    .header .main-header #slogan h1{
        font-size: 30px;
        margin-bottom: 10px; 
        margin-left: -30px;

    }
    .header .main-header #slogan p {
        font-size: 14px;
        margin-bottom: 50px;
        margin-left: -20px;
        font-style: italic;
    }

    .header .main-header #category ul li  {
        font-size: 14px;
        padding: 2px 5px;
        border-radius: 5px;
        margin: 0px -6px;
        font-weight: 600;
        border-bottom: 2px solid rgb(252, 239, 239);
    }
    .container {
        width: 96%;
        margin: 0px auto;
        text-align: left;
    }
    .container #post {
        margin: 50px 0px;
    }
    }
     @media  (max-width: 600px) {
    #search {
        position: fixed;
        background: rgb(100 83 83);
        top: 10%;
        left: 30px;
        padding: 10px;
        z-index: 1000;
        width: 300px;
    }
    #search input[type=text] {
        width: 250px;
        height: 30px;
        font-size: 12px;
        background: rgb(100 83 83);
        border-bottom: 1px solid white;
        color: white;
    }

    .header #pic-header {
        height: 200px;
        background-size: 100% 200px;
        text-align: center;
    } 
    .header .main-header #slogan h1{
        font-size: 20px;
        margin-top: 50px;
        margin-bottom: 5px; 
        margin-left: -30px;
    }
    .header .main-header #slogan p {
        font-size: 14px;
        margin-bottom: 70px;
        margin-left: -50px;
        font-style: italic;
        border-bottom: 1px solid white;

    }
    .header .main-header #category {
        bottom: -30%;
        left: 50%;
        background: rgb(255, 255, 255);
        width: 100%;
        transform: translate(-50%,-50%);
        justify-content: center;
        height: 40px;
        line-height: 40px;
        margin-left: -10px;
    }
    .header .main-header #category ul li  {
        font-size: 14px;
        padding: 0px 6px;
        margin: 0px 2px;
        border-radius: 0px;
        border: none;
        color: black;
        border-bottom: 2px solid black;
    }
    .header .main-header #category ul li:hover  {
        color: rgb(49, 44, 44);
    }
    .container {
        width: 100%;
        margin: 0px auto;
        text-align: left;
    }
    .container #post {
        margin: 50px 0px;
        padding: 30px;
     }
     }
</style>