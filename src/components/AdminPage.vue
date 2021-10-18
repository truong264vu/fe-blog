<template>

  
  <div id="admin">

  <div id="navbar">
    <div>
          <input type="text" placeholder="Enter your search here  ..." name="search" v-model="search.key_search" @keypress.enter="findPost()">    
          <input type="submit" value="Search" @click="findPost()">
    </div>
    <div>
          <input type="submit" value="Add post"  @click =" table = true, table_create = !table_edit "> 
    </div>
  </div>



  <table class="table table-striped table-bordered">
      <thead>
          <tr>
            <!-- <th >stt</th> -->
            <th scope="col" style="width:5%;">id</th>
            <th scope="col" style="width:40%;">Title</th>
            <th scope="col" style="width:15%;">Short Content</th>
            <th scope="col" style="width:10%;" >Content</th>
            <th scope="col" style="width:10%;">Category</th>
            <th scope="col" style="width:15%;">Operation</th>
            
          </tr>
      </thead>
      <tbody>
            <tr v-for="(data, index) in datas" :key="index" >
              <td> 
                <span v-show="index != 9">{{currentPage - 1}}</span>{{index + 1}} 
              </td>
              <td style="font-weight:600">
                  {{data.title}}
              </td>
              <td>
                  <p id="short-content">
                    {{data.short_content}}
                  </p>
              </td>
              <td >
                  <p v-html="data.content" id="content">
                    {{data.content}}
                  </p>

              </td>
              <td >
                <div v-for="category in data.categories" :key="category.id">
                  {{category.name}}
                </div>
              </td>
              <td style="text-align: center;">
                  <button  @click="id_post = data.id , filter.postId = data.id, notification = true" >Delete</button>
                  <button  @click="id_post = data.id , filter.postId = data.id, table = true, table_edit=true, editPost() ">Edit</button>
              </td>
            </tr>
      </tbody>
  </table>
    <div  v-show="notification" id="background-opacity-notification">background-opacity-notification</div>
    <div v-show="table_edit" id="table_edit">table_edit</div>
    <div v-show="notification" id="notification">
          <p> Are you sure you want to delete this post?</p>
          <button @click="deletePost(id_post), notification = false">Yes</button>
          <button @click="notification = false">No</button>
    </div>

          <!-- chuyen trang  -->
    <div id="page" >
          <div v-for="page in totalPage" :key="page">
                      <button  :class="{ isPage: currentPage==page }" @click.prevent="currentPage = page " >{{page}}</button>
          </div>
    </div>

    <div id="form" v-show="table">
      <div>
        <div>
          <h1 v-show="table_edit">Edit post</h1>
          <h1 v-show="table_create">Add post</h1>
 
        </div>
        <div>
            <label for="title">Title</label> <br>
            <textarea type="text" name="tieu de" id="title" placeholder="Enter title here..." v-model="post.title"></textarea>
            <p v-show="post.title.length < '6' && post.title.length > '0'" style="color:red;">(*)Title must be at least 6 characters</p>
        </div>


        <div>
            <label for="short_content">Short content</label> <br>
            <textarea type="text" name="short_content" id="short-content-input" placeholder="Enter short-content here" v-model="post.short_content"></textarea>
        </div>
        <div id="create-category">
          <input type="text" placeholder="Add Category..." v-model="category_data.name">
          <button @click="createCategory()">Add Category</button>
          <p>(*)Create only when the existing category does not match the article</p>
          <!-- <p>(*) chỉ tạo khi danh mục đã có không phù hợp với bài viết</p> -->
        </div>


        <div id="select-category"> 
                  <input id="input-category" type="submit" value="Select Category" @click="selecte_category = !selecte_category"> 
                  <div  v-show="selecte_category" > 
                      <div  
                      v-for="category in Categories" 
                      :key="category.id"
                      >
                          <span id="name-category" 
                          @click="post.categoryId = category.id , selecte_category = false, name_category_select = category.name, valueSelect()"
                          >
                            {{category.name}}  
                          </span>
                          <button @click="category_data.name_delete = category.name ,
                                          category_data.id = category.id, 
                                          notification_delete_category = true"
                                  title="Delete category"
                                          >x</button> 
                      </div>
                 </div>
        </div>


              <div id="notification-delete-category" v-show="notification_delete_category">
                  <div>
                    <h1>Delete Category</h1>
                    <p>Are you sure you want to delete the category : <span>{{category_data.name_delete}}</span> ?</p>
                  </div>
                  <div>
                    <button @click="notification_delete_category = false , deleteCategory()">Yes</button>
                    <button @click="notification_delete_category = false">No</button>
                  </div>
              </div>
              <div id="background-notification-delete-category" v-show="notification_delete_category"></div>



          <div>
          <label for="content">Content</label>
          <vue-editor style="border: 1px solid black;" v-model="post.content" name="content" ></vue-editor>
        </div>
        <div id="operation-form">
          <button @click="updatePost()" v-show="table_edit" >Save change</button>
          <button @click="createPost()" v-show="table_create">Add Post</button>
          <button @click="table = false , table_create= false , table_edit=false ,clearForm()">Close</button>
        </div>
    </div>
  </div>

</div>
</template>

<script >
import { mapState } from 'vuex';
import network from '../core/network';
import { VueEditor } from "vue2-editor";
import _ from 'lodash';



export default {
    components: {
    VueEditor,
  },
    data(){
        return {
          post: {
            title: '',
            short_content: '',
            content: '',
            postID: 0,
            categoryId: '',
            OldcategoryId: 0, //dung de detach khi update post
          },
          Categories: [],
          category_data: {
            id: '',
            name: '',
            name_delete: '',
          },
          table_edit: false,
          table_create: false,
          table:false,
          notification: false,
          notification_delete_category: false,
          id_post: 0,
          datas: [],
          currentPage: 1,
          totalPage: 0,
          filter: {
            postId: []
          },
          selecte_category: false,
          name_category_select: '',
          search: {
            key_search: ''
          },
        }
    },
    computed:{...mapState(['admin']),   

      }
      ,
    mounted() {
      this.getPageAdmin();
      this.getData();
      this.getCategory();
    },
    watch:{
      currentPage: function(){
        this.getData();
      },
      Categories: function(){
        this.getCategory();
      }
    },

    methods: {
    getPageAdmin: function(){
            let token = window.localStorage.getItem('token');
            if(token !== null && this.admin == true ){
            this.$router.push({name: 'admin_page'});
            }
            else{
            this.$router.push({name: 'home'});

            }
      },
    getData: function(){
        network.get('admin?page=' + this.currentPage)
        .then( response => {
            this.datas = response.data.data;
            this.totalPage = response.data.last_page;

        })
      },
    getCategory: _.debounce(function() {
          network.get('category')
          .then(response => {
            this.Categories = response.data;
          })
    }, 2000),
    createCategory: function (){
        network.post('category' , this.category_data)
        .then(
          this.category_data.name = ''
        )
        .catch()
    },
    deleteCategory: function(){
          network.delete('category/' + this.category_data.id)
          .then()
              this.category_data.name = ''
              this.Categories = this.Categories.filter(data => {
                return data.id != this.category_data.id
                          
              })
          .catch()
    },
    createPost: function () {  
                network.post('admin', this.post ) // tao moi post 
                        .then( reponse => {
                          this.post.postID = reponse.data.id //tao moi quan he post_category // tao moi quan he post_tag
                          network.post('CreateRelationshipPostCategory', this.post)
                          .then( () => {
                              location.reload();
                                this.post = {
                                  title: '',
                                  short_content: '',
                                  content: '',
                                 }
                            });
                        })
                        .catch( error => {
                          this.errors = error.response.data.errors;
                        })
      },


    editPost: function(){
      network.get('admin/' + this.id_post + '/edit' )
        .then( response => {
          console.log(this.id_post)
          this.post.title = response.data.title,
          this.post.content = response.data.content,
          this.post.short_content = response.data.short_content
          network.get('getCategory', this.filter) // lay ra category cua bai viet
               .then(response => {
              console.log(response.data[0].categories[0].name)
              var inputCategory = document.getElementById('input-category'); // lay ra value cua select
              inputCategory.value = response.data[0].categories[0].name; // thay value cua select thanh gia tri category cua bai viet
            })
        })
        .cacth( error => {
          console.log(error);
        })
      },


    updatePost: function() {
      network.put('admin/' + this.id_post , this.post)
                .then( () => {
                  console.log(this.id_post)
                  this.post.title = '',
                  this.post.content = '',
                  this.post.short_content = '' 
                        network.get('getCategory', this.filter) // lay ra category cua bai viet
                        .then(response => {
                          const inputCategory = document.getElementById('input-category');
                         if(inputCategory.value != response.data[0].categories[0].name){
                              this.post.postID = this.id_post
                              this.post.OldcategoryId = response.data[0].categories[0].id

                              network.post('UpdatePost_Category' ,this.post)// update post
                               .then( () => {
                                   location.reload();
                              })
                              .catch( ()=> {
                                console.log(this.post)
                              })
                         }
                        })

                })
                .cacth( () => {
                  console.log('a');
                });

        
      },
    deletePost: function(id_post){
          network.get('category/' + id_post)
            .then( response => {
              this.post.categoryId = response.data.id;
            });
            console.log(this.post)
          this.post.postID = id_post // lay ra id cua bai viet va luu vao post
          network.post('DeleteRelationshipPostCategory' , this.post)
          .then( () => {
            console.log(this.post)
          })
          network.delete('admin/' + id_post)
          .then(() => {
            this.datas = this.datas.filter(data => {
              return data.id != id_post;
            })
          })
          .catch( error => {
            console.log(error)
          })
        },
    findPost: function(){
      network.get('findPost' , this.search)
      .then(response => {
          this.datas = response.data
        })
      },
      
    clearForm(){
      this.post.title = '',
            this.post.content = '',
            this.post.short_content= '',
            this.table = false , 
            this.table_create= false ,
            this.table_edit=false
      },
    valueSelect: function(){
      var inputCategory = document.getElementById('input-category');
      inputCategory.value = this.name_category_select;

    },

    }
    

}
</script>
<style scoped>
    #admin {
        padding: 200px 0px;
    }
    .isPage{
      background: black;
      color: white;
    }
    #navbar {
      display: flex;
      justify-content: space-between;
      width: 80%;
      margin: 0px auto;
      margin-bottom: 20px;
    }
    #navbar input[type=submit]{
      background: rgb(0, 121, 235);
      padding: 5px 20px;
      color: rgb(255, 255, 255);
      border: 2px solid rgb(158, 143, 143);
      border-radius: 4px;
      font-weight: 600;
      outline: none;
    }
    #navbar input[type=submit]:hover {
      background: rgb(3, 62, 240);
    }
    #navbar input[type=text] {
      padding: 4px 20px;
      height:38px ;
      width: 400px;
      border: 2px solid rgb(219, 204, 204);
      outline: none;

    }
    .table {
        margin: 0px auto;
        width: 80%;
        text-align: left;
    }

    #background-opacity-notification {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        opacity: 30%;
        background: white;
        
    }
    #table_edit{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        opacity: 30%;
        background: white;
    }
    #notification  {
        height: 200px;
        width: 700px;
        background: white;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 5px solid rgb(53, 68, 133);
        text-align: center;
    
    }
    #notification  p {
        font-size: 20px;
        margin: 30px;
        font-weight: 600;
    }
    #notification  button {
      padding: 4px 20px;
      margin: 10px 20px;
      background: #8E4119;
      color: rgb(255, 255, 255);
      border-radius: 4px;
      font-weight: 600;
    }
    #notification  button:hover {
      background: #d6916c;
    }
    #form {
      width: 100%;
      height:100vh;
      background: white;
      border: 1px solid black;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      overflow: scroll;
      z-index: 2;

    }
    #form > div {
      margin: 20px;
    }
    #form h1 {
      text-align: center;
    }
    #form label {
      font-size: 25px;
    }
    #form textarea {
      width: 100%;
      margin-bottom: 10px;
      padding: 10px 20px;
      font-size: 16px;
      outline: none;
      border: 1px solid #8E4119;
      border-radius: 5px;
      word-wrap: break-word;
      word-break: break-all;
    }
    #form #short-content-input {
      height: 200px;
    }

    tbody   #content {
      white-space: nowrap; 
      width: 100px; 
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    tbody #short-content {
      white-space: nowrap; 
      width: 200px; 
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    tbody button {
      padding: 2px 10px;
      background: #8E4119;
      color: white;
      border-radius: 3px;
      margin: 4px 4px;
      width: 80px;
    }
    tbody button:hover {
      background: #af6238;
    }


    /* button phan trang  */
    #page  { 
          width: 70%;
          margin: 20px auto;
          display: flex;
          justify-content: center
    }
    #page button {
      width: 60px;
      height: 40px;
      margin: 0px 5px;
    }
    #select-category {
      width: 450px;
      position: relative;

    }
     #create-category button {
        height: 50px;
        background: blue;
        color: white;
        font-weight: 600;
        padding: 0px 10px;
        border-radius: 6px;   
        margin: 0px 10px;     
     }
     #create-category  p {
        color: red;
     }
    #select-category > #input-category ,   #create-category input {
        width: 450px;
        text-align: left;
        padding: 0px 20px;
        height: 50px;
        border-radius: 5px;
        outline: none;
        position: relative;
       font-size: 18px;
        margin: 10px 0px;
    }
    #select-category::after {
        content: ' ';
        position: absolute;
        top: 25px;
        right: 20px;
        width: 20px;
        height: 20px;
        background: url('../assets/down.png') no-repeat;
        background-size: 20px 20px;
    }
    #select-category > div  {
        width: 450px;
        text-align: center;
        position: absolute;
        background: white;
        border: 2px solid #1d0d05;
        z-index: 1;
        border-radius: 5px;
        transition: top 5s , opacity 1s;;
    }
    #select-category > div span{
       border-top: 1px solid #5e3e2d;
       height: 40px;
       display: block;
       padding: 0px 20px;
       width: 446px;
       line-height: 40px;
       font-size: 18px;
       text-align: left;
       border-radius: 2px;
    }
    #select-category > div span:hover {
      background: rgb(228, 233, 223);
    cursor: pointer;
    }
    #select-category button {
        height: 30px;
        width: 30px;
        position: absolute;
        background: rgb(67, 67, 128);
        right: 10px;
        margin-top: -35px;
        /* margin-top: 5px; */
        font-weight: 600;
        color: white;
        z-index: 3;
        outline: none;
        border: none;
        border-radius: 4px;
    }
     #notification-delete-category {
      width: 400px;
      height: 200px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid black;
      text-align: center;
      z-index: 5;
    }
     #notification-delete-category div button {
          margin: 10px;
          padding: 2px 10px;
          background: blue;
          color: white;
          font-weight: 600;
          
    }
     #notification-delete-category span {
       font-weight: 600;
       font-size: 20px;
     }
     #background-notification-delete-category {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        opacity: 30%;
        background: rgb(102, 16, 16);
        z-index: 4;
     }



    #operation-form {
      text-align: right;
    }
    #operation-form button {
        margin: 20px 10px;
        padding: 5px 15px;
        background: #8E4119;
        border: 1px solid black;
        font-size: 20px;
        font-weight: 600;
        color: white;
        border-radius: 5px;
    }
    #operation-form button:hover {
      background: #492411;
    }


/* responsive */

@media  (max-width: 900px) {
    #navbar input[type=submit]{
      padding: 2px 10px;
      border: 1px solid rgb(158, 143, 143);
      border-radius: 4px;
      font-size: 12px;
      height: 30px;
    }

    #navbar input[type=text] {
      padding: 2px 10px;
      font-size: 12px;
      height:30px ;
      width: 200px;
    }

    tbody   #content {
      white-space: nowrap; 
      width: 50px; 
      height: 40px;
      font-size: 12px;
    }
    tbody #short-content {
      width: 100px; 
      height: 40px;
      font-size: 14px;
    }
    tbody button {
      padding: 2px 5px;
      border-radius: 3px;
      font-size: 13px;
      width: 60px;
      margin-top: 10px;
      width: 60px;
    }
    thead th {
      font-size: 14px;
    }
    tbody tr {
      font-size: 14px;
    }

    #form > div {
      margin: 10px;
    }
    #form h1 {
      text-align: center;
      font-size: 14px;
    }
    #form label {
      font-size: 16px;
    }
    #form textarea {
      padding: 5px 10px;
      font-size: 14px;
    }
    #notification  {
        height: 150px;
        width: 400px;
    
    }
    #notification  p {
        font-size: 14px;
        margin: 13px;
        font-weight: 600;
    }
    #notification  button {
      padding: 2px 10px;
      margin: 4px 14px;
      font-size: 12px;
    }


    
    #select-category {
      width: 200px;
      position: relative;

    }

    #select-category::after {
        top: 18px;
        right: 20px;
        width: 15px;
        height: 15px;
        background-size: 15px 15px;
    }

    #select-category > div  {
        width: 200px;
        text-align: center;
        position: absolute;
        background: white;
        border: 2px solid #1d0d05;
        z-index: 1;
        border-radius: 5px;
        transition: top 5s , opacity 1s;;
    }

     #create-category button {
        height: 30px;
        background: blue;
        color: white;
        font-weight: 600;
        padding: 0px 6px;
        border-radius: 4px;   
        margin: 0px 6px;     
     }
    #select-category > #input-category ,   #create-category input {
        width: 200px;
        padding: 0px 10px;
        height: 30px;
        border-radius: 2px;
       font-size: 12px;
        margin: 10px 0px;
    }


     #notification-delete-category {
      width: 200px;
      height: 100px;

    }
     #notification-delete-category div button {
          margin: 10px;
          padding: 2px 10px;
          background: blue;
          color: white;
          font-weight: 600;
          
    }
     #notification-delete-category span {
       font-weight: 600;
       font-size: 14px;
     }
     #background-notification-delete-category {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        opacity: 30%;
        background: rgb(102, 16, 16);
        z-index: 4;
     }

    #create-category  p {
        color: red;
        font-size: 12px;
     }

    #page  { 
          width: 70%;
          margin: 20px auto;
          display: flex;
          justify-content: center
    }
    #page button {
      width: 30px;
      height: 30px;
      margin: 0px 5px;
      font-size: 14px;
    }

    
      
}

@media  (max-width: 500px) {
        #navbar input[type=submit]{
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 10px;
      height: 30px;
    }

    #navbar input[type=text] {
      padding: 1px 6px;
      font-size: 10px;
      height:30px ;
      width: 200px;
    }

    tbody   #content {
      white-space: nowrap; 
      width: 40px; 
      height: 40px;
      font-size: 10px;
    }
    tbody #short-content {
      width: 60px; 
      height: 40px;
      font-size: 12px;
    }
    tbody button {
      padding: 1px 4px;
      border-radius: 2px;
      font-size: 10px;
      margin-top: 8px;
    }
    thead th {
      font-size: 10px;
    }
    tbody tr {
      font-size: 10px;
    }

    #form > div {
      margin: 10px;
    }
    #form h1 {
      text-align: center;
      font-size: 14px;
    }
    #form label {
      font-size: 25px;
    }

        #form > div {
      margin: 10px;
    }

    #form textarea {
      padding: 5px 10px;
      font-size: 12px;
    }


    
    #select-category {
      width: 200px;
      position: relative;

    }

    #select-category::after {
        top: 18px;
        right: 20px;
        width: 15px;
        height: 15px;
        background-size: 15px 15px;
    }

    #select-category > div  {
        width: 200px;
        text-align: center;
        position: absolute;
        background: white;
        border: 2px solid #1d0d05;
        z-index: 1;
        border-radius: 5px;
        transition: top 5s , opacity 1s;;
    }

     #create-category button {
        height: 30px;
        background: blue;
        color: white;
        font-weight: 600;
        padding: 0px 6px;
        border-radius: 4px;   
        margin: 0px 6px;     
     }
    #select-category > #input-category ,   #create-category input {
        width: 200px;
        padding: 0px 10px;
        height: 30px;
        border-radius: 2px;
       font-size: 12px;
        margin: 10px 0px;
    }


     #notification-delete-category {
      width: 400px;
      height: 200px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid black;
      text-align: center;
      z-index: 5;
    }
     #notification-delete-category div button {
          margin: 10px;
          padding: 2px 10px;
          background: blue;
          color: white;
          font-weight: 600;
          
    }
     #notification-delete-category span {
       font-weight: 600;
       font-size: 20px;
     }
     #background-notification-delete-category {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        opacity: 30%;
        background: rgb(102, 16, 16);
        z-index: 4;
     }

    #create-category  p {
        color: red;
        font-size: 12px;
     }

    #page  { 
          width: 70%;
          margin: 20px auto;
          display: flex;
          justify-content: center
    }
    #page button {
      width: 25px;
      height: 25px;
      margin: 0px 5px;
      font-size: 12px;
    }

        #operation-form button {
        margin: 10px 5px;
        padding: 2px 10px;
        background: #8E4119;
        border: 1px solid black;
        font-size: 12px;
        font-weight: 600;
        color: white;
        border-radius: 5px;
    }

    #notification  {
        height: 100px;
        width: 300px;
    
    }
    #notification  p {
        font-size: 12px;
        margin: 10px;
        font-weight: 600;
    }
    #notification  button {
      padding: 2px 10px;
      margin: 4px 14px;
      font-size: 12px;
    }

      
}

</style>