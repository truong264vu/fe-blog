<template>
<div id="post">
  <div id="main-content">
        <h1 >{{Post.title}}</h1> 
        <p>{{Post.short_content}}</p>
        <p v-html="Post.content">{{Post.content}}</p>  
  </div>
  <div id="like-post"> 
        <button v-show="like == false"  @click="CreateRalationshipUserPostLike(Post.id),like = true, total_like++">Like {{total_like}}</button> 
        <button v-show="like == true" @click="DeleteRalationshipUserPostLike(Post.id),like = false, total_like--">Unlike {{total_like}}</button> 
  </div>

    <!-- parent commnet -->
  <div class="comment-input open">
      <div>
            <div id="avatar">
                <img :src="avatar" alt="">
            </div>
            <textarea v-show="check_login !== null "  placeholder="Enter your comment here ..." v-model="comments.content"></textarea>
            <button id="check-login" v-show="check_login == null " @click="SIGNIN_TABLE()">Login to comment</button>
      </div>
      <div id="operation-parent" >
            <button @click="reply = false" v-show="check_login !== null">cancel</button>
            <button v-show="check_login !== null " @click="add_parent_comment()">Comment</button> 
      </div>
  </div>
<!-- hien thi commment  -->
  <div id="show-comment">
        <div>
            <div v-for="comment in dataComment" :key="comment.id" id="parent-comment">
                  <div id="avatar">
                      <img :src="comment.user.avatar" alt="">
                  </div>
                  <div >
                      <span id="user-name">{{comment.user.name}}</span> 
                      <p>{{comment.content}}</p>
                  <div id="operation-comment">
                    <button @click="reply = comment.id ">Reply</button>
                    <button @click="deleteCommnent(comment.id)" :class="{hide : comment.user.name != name_account}">Delete</button> 
                    <button v-show="admin == 'admin'" 
                            @click="deleteCommnent(comment.id)"
                            id="admin-delete"
                             >Admin Delete</button>
                  </div>
                            <div id="child-comment" v-for="child in comment.child_comment" :key="child.id" >
                                      <div id="avatar-comment">
                                        <div id="avatar">
                                        <img :src="child.user.avatar" alt="">
                                        </div>
                                        <div>
                                          <span id="user-name">{{child.user.name}}</span>
                                          <p>{{child.content}}</p>
                                        </div>
                                      </div>


                                  <div id="operation-comment"> 
  
                                        <button @click="reply = comment.id" >Reply</button>
                                        <button @click="deleteCommnent(child.id)" 
                                                      :class="{hide : child.user.name != name_account}" 
                                                      >
                                                      Delete
                                                      </button> 
                                        <button v-show="admin == 'admin'" 
                                                @click="deleteCommnent(child.id)"
                                                id="admin-delete"
                                                title="Delete comment"
                                                
                                                >Admin Delete</button>
                                 </div> 
                            </div>
                    <!-- child comment  -->
                  <div id="child-input" :class="{open : reply == comment.id }" class="comment-input " >
                          <div  >
                                <div id="avatar">
                                    <img :src="avatar" alt="">
                                </div>
                                <textarea  placeholder="Enter your comment here  ..." v-model="add_comment_child" v-show="check_login !== null"></textarea>
                                <button v-show="check_login == null " @click="SIGNIN_TABLE()">Login to comment</button>
                          </div>
                          <div id="operation">
                                <button @click="reply = false" v-show="check_login !== null">cancel</button>
                                <button @click="add_child_comment(comment.id) " id="check-Login" v-show="check_login !== null">Comment</button> 
                          </div>
                  </div>


                  </div>
            </div>
        </div>
  </div>
</div>

  
</template>

<script>
import { mapState , mapMutations} from 'vuex'
import network from '../core/network'
import _ from 'lodash';


export default {
    data() {
        return{
          dataComment: '',
          child_comment: [],
          comments: {
            content: '',
            parent_id: '',
            user_id: '',
            post_id: []
          },
          add_comment_child: '',
          name_account: '',
          reply: '',
          check_login: null,
          avatar: '',
          total_like: 0,
          like: false, // true: liked , false : unlike
          admin: ''
        }
    },

    computed: {...mapState(['Post','login_register_table']),

      },
    created() {
        this.get_comment();
        this.comments.user_id = window.localStorage.getItem('id') ; // lay ten nguoi binh luan
        this.name_account = window.localStorage.getItem('name'); // lay ten nguoi bl de check bl cua nguoi do , neu khac  => hide
        this.check_login = window.localStorage.getItem('token');
        this.avatar = window.localStorage.getItem('avatar'); // thay avatar cho input binh luan 
        this.admin = window.localStorage.getItem('role');

        network.get('likePost', this.comments) // lay ra id cua bai viet . neu id bai viet bang id bai viet da thich trong database => hien unlike
        .then(response => {
          response.data[0].likes.forEach(element => {
                if(element.id == this.Post.id){
                  this.like = true;
                }
                else{
                  this.like = false;
                }
          });
        });
        this.comments.post_id = this.Post.id
         network.get('getTotalLike', this.comments)
        .then(response => {
          this.total_like = response.data[0].likes.length
        })
} ,
    watch: {
        dataComment: function(){ // cap nhat du lieu comment
          this.get_comment();
        }
    },
    methods: {
        ...mapMutations(['SIGNIN_TABLE']),

        get_comment: _.debounce(function(){
          this.comments.post_id = this.Post.id;
        network.get('getComment' , this.comments)
        .then(response => {
          this.dataComment = response.data;
        });
        },2000),

        add_parent_comment:  function(){
          // this.comments.parent_id = id;
          network.post('comment' , this.comments)
          .then(   () => {
            this.comments.content = ''
          })
        },

        add_child_comment:  function(id){ // Khong viet chung 1 ham tao comment => khong  bi trung v-model
          this.comments.content = this.add_comment_child ;
          this.comments.parent_id = id;
          network.post('comment' , this.comments)
          .then(   () => {
            this.comments.content = ''
            this.add_comment_child = ''
          })
        },
        deleteCommnent(id){
            network.delete('comment/' + id)
            .then(() => {
              this.dataComment = this.dataComment.filter(data => {
              return data.id != id;
            })
            });
            this.comments.parent_id = id;
            network.post('destroyChildComment' , this.comments)
            .then( () => {
            })
        },
        CreateRalationshipUserPostLike(id){
            this.comments.user_id = window.localStorage.getItem('id')
            this.comments.post_id = id
            network.post('CreateRalationshipUserPostLike', this.comments)
            .then()
            .catch()
        },
        DeleteRalationshipUserPostLike(id){
            this.comments.user_id = window.localStorage.getItem('id')
            this.comments.post_id = id
            network.post('DeleteRalationshipUserPostLike', this.comments)
            .then()
            .catch()
        },
        


        likes(id) {
          this.comments_liked.push(id)
              console.log(this.comments_liked)
        },
        unlike(id) {
            this,this.comments_liked = this.comments_liked.filter(comment_id => {
                return comment_id != id;
            })
        }

    }
}
</script>

<style scoped>
        #avatar img {
            width: 40px;
            height: 40px;
            margin-top: 8px;
            margin-right: 8px;

        }
        #like-post button {
            padding: 5px 10px;
            padding-left: 40px;
            color: white;
            font-weight: 600;
            border-radius: 4px;
            position:relative;
           background: blue;
           outline: none;
           border: none;

        }
        #like-post button:nth-child(1)::before{
          content: ' ';
          position: absolute;
          width: 20px;
          height: 20px;
          background: url('../assets/like.png');
          background-size: 20px 20px;
          top: 4px;
          left: 10px;

        }
          #like-post button:nth-child(2)::before{
          content: ' ';
          position: absolute;
          width: 20px;
          height: 20px;
          background: url('../assets/unlike.png');
          background-size: 20px 20px;
          left: 10px;
          top: 4px;
        }
       #post {
        padding: 50px 0px;
        width: 60%;
        text-align: left;
        margin: 0px auto;
        }
        
        #post > #main-content h1 {
          margin: 30px 0px;
        }
        #post > #main-content p {
          margin: 30px 0px;
        }

        /* comment input  */
        .comment-input > div {
          display: flex;
        }
        .comment-input #avatar {
          width: 40px;
          height: 40px;
          margin:0px 10px;
          margin-top: -10px;
        }
        .comment-input {
          padding-top: 30px;
          width: 100%;
          height: 140px;
          background: rgb(243, 236, 236);
          bottom: 0px;
          margin: 20px auto;
          display: none;
        }
        #child-input {
          width: 600px;
          margin: 10px 0px;
        }

        .comment-input div textarea {
          height: 40px;
          width: 80%;
          border: 1px solid black;
          border-radius: 4px;
          padding: 0px 20px;
          line-height: 40px;
          outline: none;
        }
        .comment-input #operation { 
            /* position: absolute; */
            /* right: 4; */
            margin-top: 20px;
            margin-left: 60%;
        }
        .comment-input #operation button {

          background: rgb(84, 84, 209);
          color: white;
          padding: 4px 6px;
          /* width: 200px; */
          border-radius: 6px;
          margin-left:20px;
        }
        #operation-parent {
            margin-top: 20px;
          margin-left: 68%;
        }

        #operation-parent button {
          background: rgb(84, 84, 209);
          color: white;
          padding: 4px 6px;
          /* width: 200px; */
          border-radius: 6px;
          margin-left:20px;
        }
        #show-comment   #parent-comment {
          display: flex;
          margin: 20px;
        }
        
        #show-comment  #user-name {  
            color: black;
            font-weight: 600;
            font-size: 20px;
        }
        /* #show-comment #child-comment {
          display: flex;
        } */
        #show-comment #child-comment #avatar-comment {
            display: flex;
        }
        #show-comment #child-comment #avatar-comment div:nth-child(2) {
            background: rgb(235, 233, 231);
            padding: 0px 10px;
            border-radius: 10px;
        }
        #show-comment  #operation-comment {
          margin-bottom: 20px;
        }
        #show-comment #child-comment #operation-comment {
          margin-left: 50px;
        }
        #show-comment  #operation-comment button {
          color: rgb(101,103,107);
          border: none;
          margin: 0px 5px;
          font-weight: 600;
          background: white;
        } 
        .hide {
          display: none; 
        } 
        .open {
          display: block;
        }
        #check-login {
          padding: 2px 10px;
        }
        .active {
          color: blue;
        }

/* responsive */

@media  (max-width: 900px) {
        #post {
        padding: 50px 0px;
        width: 80%;
        text-align: left;
        margin: 0px auto;
        }

        #like-post button {
            padding: 2px 6px;
            padding-left: 25px;
            border-radius: 4px;
            font-size: 12px;
        }
        #like-post button:nth-child(1)::before{
          width: 15px;
          height: 15px;
          background-size: 15px 15px;
          top: 3px;
          left: 6px;

        }
          #like-post button:nth-child(2)::before{
          content: ' ';
          width: 15px;
          height: 15px;
          background-size: 15px 15px;
          left: 6px;
          top: 5px;
        }


        .comment-input #avatar {
          width: 20px;
          height: 20px;
          margin: 0px 15px;
          margin-top: -8px;
        }


        .comment-input #avatar img {
          width: 28px;
          height: 28px;
        }

        .comment-input {
          padding-top: 30px;
          width: 100%;
          height: 120px;
          background: rgb(243, 236, 236);
          bottom: 0px;
          margin: 20px auto;
          font-size: 14px;
          /* display: none; */
        }
         #child-input {
          width: 300px;
          margin: 10px 0px;
          font-size: 14px;
        }
        .comment-input div textarea {
          height: 30px;
          width: 80%;
          border: 1px solid black;
          border-radius: 4px;
          padding: 0px 10px;
          line-height: 30px;
          outline: none;
        } 


        .comment-input #operation { 
            /* position: absolute; */
            /* right: 4; */
            margin-top: 20px;
            margin-left: 54%;
        }
        .comment-input #operation button {
          padding: 2px 4px;
          border-radius: 4px;
          margin-left:6px;
          font-size: 12px;

        }

        #operation-parent {
          margin-top: 20px;
          margin-left: 54%;
        }

        #operation-parent button {
          padding: 2px 4px;
          /* width: 200px; */
          border-radius: 4px;
          margin-left:6px;
          font-size: 12px;
        }

        #show-comment  #user-name {  
            font-size: 12px;
        }
        #show-comment  #operation-comment button {
          color: rgb(101,103,107);
          border: none;
          margin: 0px 5px;
          font-weight: 600;
          background: white;
          font-size: 12px;
        } 

        #parent-comment p {
           font-size: 14px;
        }
}


        

</style>