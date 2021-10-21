<template>
  <div id="category">
           <div v-bind:CategoryId="filter.categoryId = CategoryId" > 
                <div v-for="post in postOfCategory[0].posts" :key="post.id" id="post" title="Read">
                      <h1 @click="POST(post),postPage()">{{post.title}}</h1> 
                      <p>{{post.short_content}}</p>
                  </div>           
           </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import network from '../core/network'
export default {
  data() {
    return {
      postOfCategory: [],
      filter: {
                categoryId: [0],
            }
    }
  },
  computed: {
    ...mapState(['CategoryId'])
  },
  mounted() {
        this.getPost() // truy van du lieu tu api
    },
  watch: {
        filter: function() { //hien du lieu khi thay doi currentPage
            this.getPost();
        }
  },
  methods: {
        ...mapMutations(['POST']),
        getPost(){ //lay ra id category va bai viet thuoc category do.
        network
        .get('categoryId', this.filter  )
        .then( (reponse) => {
            this.postOfCategory = reponse.data
        })
        .catch(error => {
            console.log(error);
        })
        },

        postPage: function() {
            this.$router.push({name: 'post'});
        }
  }

}
</script>

<style scoped>
        #category {
        padding: 200px 0px;
        margin: 0px auto;
        width: 60%;
        text-align: left;
       
    }

    #category h1 {
      cursor: pointer;
      padding: 3px;
      margin-top: 100px;
    }
    #post {
      border-bottom: 1px solid rgb(163, 143, 143);
    }

    @media (max-width: 900px){
        #category {
        padding: 40px 0px;
        margin: 0px auto;
        width: 80%;
        text-align: left;
        }
    }

</style>