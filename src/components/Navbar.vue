<template>
  <div>
        <div class="navbar">
            <div id="left">
                    <li title="facebook"><a href="https://www.facebook.com/truongvu264/">a</a></li>
                    <li title="instagram"><a href="https://www.instagram.com/Truong_2642K/">a</a></li>
                    <li title="twiter"><a href="#">a</a></li>
                    <li title="youtube"><a href="#">a</a></li>
                    <li title="tittok"><a href="#">a</a></li>
            </div>
          <div id="between">
              <ul>
                  <li @click="backHome(),reload()"><img src="../assets/logo.png" id="logo"></li>
              </ul>
          </div>
          
          <transition name="slide-fade">
            <div id="right" v-show="menu">
                <ul>
                  <li @click="backHome(),reload(),mene = false" title="Trở về trang chủ">HOME</li>  
                  <li @click="aboutMe()" title="Thông tin của tôi">ME</li>
                  <li @click="INPUT_SEARCH(),backHome() " title="Tìm kiếm bài viết" >
                      <!-- click thi hien input o trang homepage  -->
                      <input id="search" type="submit" value="tìm kiếm"  >
                  </li>
                <li @click="SIGNIN_TABLE()" v-if="userLogin == false">Sign In</li>

                  <li v-if="userLogin == true" id="user">
                        <div id="avatar">
                             <img :src="avatar_url.avatar" > 
                        </div>
                        <div id="info-user" >
                            <div id="name" @click="info = !info">{{user.username}}</div>
                        
                        <transition name="slide-fade">
                            <ul v-show="info">
                                <li >{{user.username}}</li>
                                <li >{{user.email}}</li>
                                <li @click="notification_change_avatar = true , info = false ">Change Avatar</li>
                                <li v-show="admin" @click="getPageAdmin(), info = false">Admin Page</li>
                                <li @click="logout() , info =false" >Log Out</li>
                            </ul>
                        </transition>
                         </div>
                    </li>

                </ul>
                </div>
            </transition>


        <!-- // man hinh max 900  -->
        <transition name="slide-fade">
            <div id="right" v-show="menu_max900">
                <ul>
                    <li v-if="userLogin == true" id="user">
                        <div id="avatar">
                             <img :src="avatar_url.avatar" > 
                        </div>
                        <div id="info-user">
                            <div id="name">{{user.username}}</div>
                         </div>
                    </li>
                  <li @click="backHome(),reload(),mene = false" title="Trở về trang chủ">HOME</li>  
                  <li @click="aboutMe(), menu_max900 = false" title="Thông tin của tôi">ME</li>
                  <li @click="INPUT_SEARCH(),backHome(), menu_max900 = false " title="Tìm kiếm bài viết" >
                      <!-- click thi hien input o trang homepage  -->
                      <input id="search" type="submit" value="tìm kiếm"  >
                  </li>
                <li v-if="info_max900px == true" @click="notification_change_avatar = true , menu_max900 = false">Change Avatar</li>
                <li v-if="info_max900px == true" v-show="admin" @click="getPageAdmin(), menu_max900 = false">Admin Page</li>
                <li v-if="info_max900px == true" v-show="userLogin == true" @click="logout(), menu_max900 = false" >Log Out</li>
                <li @click="SIGNIN_TABLE()" v-if="userLogin == false">Sign In</li>




                </ul>
                </div>
        </transition>
          <div id="menu">
              <button @click="menu_max900 = !menu_max900">Menu</button>
          </div>
      </div>

        <!-- thay avatar -->
        <transition name="fade">
        <div id="notification-change-avatar" v-show="notification_change_avatar">
            <div>background opacity</div>
            <div  v-show="notification_change_avatar" id="change-avatar">
                    <span @click="notification_change_avatar = false">hủy</span>
                    <div id="choose-avatar">
                        <img :src="avatar_url.avatar" alt="">
                        <input  type="file" @change="onFileChange" accept="image/*" >
                    </div>
                    <div v-show="progress">
                        <p>Upload: {{uploadValue.toFixed()+"%"}}
                        <progress id="progress" :value="uploadValue" max="100" ></progress>  </p>
                    </div>
                    <div v-if="imageData!=null">
                        <button @click="onUpload">Lưu thay đổi </button>
                    </div>
            </div>
        </div>
        </transition>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import network from '../core/network';
import firebase from 'firebase/app';
import 'firebase/storage'

export default {
    data() {
        return {
            userLogin: false,
            admin: true, // bat buoc gia tri la true de raload khong bi ve trang chu
            user: {
                email: '',
                username: '',
                role: ''
            },
            avatar_url:{
                idUser: 0,
                avatar: '',
            },
            change_avatar: false,      
            imageData: null,
            uploadValue: 0 ,
            notification_change_avatar: false,
            progress: false,
            info : false,
            info_max900px: false,
            menu: true ,
            menu_max900: false,
        }
    },
    created(){
        this.avatar_url.idUser = window.localStorage.getItem('id');
        network.get('getAvatar', this.avatar_url)
        .then( response => {
            this.avatar_url.avatar = response.data[0].avatar;
            window.localStorage.setItem('avatar' , response.data[0].avatar)
        })

        var media = window.matchMedia("(max-width: 900px)").matches;
        if(media){
            this.menu = false
            this.info_max900px = true
        }
        else{
            this.menu = true
            this.info_max900px = false
        }

    },
    mounted(){
        this.InforUser();
        this.$store.state.login_register_table = false;
        this.checkAdmin();
    },
    watch: {
        userLogin: function(){
            this.InforUser()

        },
        admin: function(){
            this.checkAdmin()
        }
    },
    methods: {
        ...mapMutations(['SIGNIN_TABLE','ADMIN','INPUT_SEARCH']),
        // previewFiles(event) {
        //     console.log(event.target.files);
        // },
        reload: function(){
                location.reload();
        },
        onFileChange(e) {
            this.uploadValue=0;
            this.progress = false ;
            this.avatar_url.avatar=URL.createObjectURL(e.target.files[0]);
            console.log(this.avatar_url.avatar)
            this.imageData = e.target.files[0];
        },
        onUpload(){
                this.progress = true;
                const storageRef=firebase.storage().ref(`${this.imageData.name}`).put(this.imageData);
                storageRef.on(`state_changed`,snapshot=>{
                    this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                }, error=>{console.log(error.message)},
                ()=>{this.uploadValue=100;
                    storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                    this.avatar_url.avatar =url;
                    this.notification_change_avatar = false;
                    this.avatar_url.idUser = window.localStorage.getItem('id'); 
                    
                    network.post('updateAvatar',  this.avatar_url)//luu url anh vao database
                    .then(response => {
                        this.avatar_url.avatar = response.data.avatar;
                        console.log(this.avatar_url.avatar)
                    })
                    .catch(()=> {
                        console.log('a');
                    })
                    });
                }
                );

                // update avatar trong database

        },


        
        
        backHome: function() {
            
            this.$router.push({name: 'home'});
        },
         aboutMe: function() {
            this.$router.push({name: 'me'});
        },
        contact: function() {
            this.$router.push({name: 'contact'});
        },
        goodPost: function() {
            this.$router.push({name: 'good_post'});
        }, 
        InforUser: function() {
            // check user da dang nhap chua
            // window.localStorage.setitem o thu muc LoginRegister.vue
            let token = window.localStorage.getItem('token');
            this.user.email = window.localStorage.getItem('email')
            this.user.username = window.localStorage.getItem('name')
            this.user.role = window.localStorage.getItem('role')
                if(token == null){
                this.userLogin = false// dong bang
                }
                else{
                    this.userLogin = true
                }
        },
        logout: function () {
                window.localStorage.removeItem('token')
                localStorage.removeItem('name');
                location.reload()
        },
        checkAdmin: function() {
                this.ADMIN(this.admin)
                //check tai khoan co phai admin hay khong
                if(this.user.role == 'admin'){
                    this.admin = true;
                }
                else{
                    this.admin = false
                }
        },
        getPageAdmin: function(){ //neu la admin thi moi vao duoc trang adminPage
            let token = window.localStorage.getItem('token');
            if(token !== null && this.admin == true ){
            this.$router.push({name: 'admin_page'});
            }
            else{
            this.$router.push({name: 'home'});
            }
        }
    }
}
</script>

<style scoped>
.navbar {
        height: 50px;
        width: 100%;
        display: flex;
        color: black;
        /* justify-content: space-around; */
        background: rgb(255, 255, 255);
        align-items: center;
        position: fixed;
        z-index: 1;
        border-bottom: 1px solid rgb(233, 220, 220);
    }
    #menu {
        display: none;
    }
    .navbar #left {
        display: flex;
        margin-left: 40px;

    }

    /* ben trai navbar */
    .navbar #left li {
        margin: 0px 5px;
        padding: 0px 5px;
    }
    .navbar #left li:hover {
        cursor: pointer;
    }
    .navbar #left a {
        opacity: 0;
    }
        .navbar #left li:nth-child(1)  {
        width: 25px;
        height: 25px;
        background: url('../assets/facebook.png') no-repeat;
        background-size: 25px 25px;
    }
        .navbar #left li:nth-child(2) {
        width: 25px;
        height: 25px;
        background: url('../assets/intagram.png') no-repeat;
        background-size: 25px 25px;
    }

        .navbar #left li:nth-child(3) {
        width: 25px;
        height: 25px;
        background: url('../assets/twitter.png') no-repeat;
        background-size: 25px 25px;
    }

        .navbar #left li:nth-child(4) {
        width: 25px;
        height: 25px;
        background: url('../assets/youtube.png') no-repeat;
        background-size: 25px 25px;
    }

        .navbar #left li:nth-child(5) {
        width: 25px;
        height: 25px;
        background: url('../assets/tiktok.png') no-repeat;
        background-size: 25px 25px;
    }

    .navbar #between {
        width: 150px;
        /* background: rebeccapurple; */
        margin: 0px auto;
    }
    .navbar #logo {
        width: 90px;
        height: 70px;
        margin-top: -20px;
        margin-left: 50px;
    }

    .navbar ul {
        display: flex;
        margin: 0px 40px;
        background: white;
    }
    .navbar  ul li  {
        margin: 0px 15px;
        padding: 4px 10px;
        line-height: 30px;
        font-size: 14px;
        /* font-weight: 700; */
        height: 40px;
    }
    .navbar  ul  li:hover {
            border-radius: 4px;
            cursor: pointer;
    }

    .slide-fade-enter-active {
    transition: all .3s ease;
    }
    .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateY(-20px);
    opacity: 0;
    }

    .navbar #search  {
        width: 20px;
        height: 20px;
        top: 5px;
        text-indent: -100000px;
        position: relative;
        background: url('../assets/search.png') no-repeat;
        background-size: 20px 20px;
        outline: none;
        border: none;
    }
    #right #user {
        display: flex;
        position: relative;
        border-radius: 30px;
        background: rgb(238, 236, 231);


    }
    #right #user:hover {
        cursor: pointer;
    }
     #right #user #avatar {
         width: 40px;
         height: 40px;
         border-radius: 30px;
         padding-right: 20px;
         line-height: 40px;
     }
    #right #user #avatar img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        margin-top: -10px;
        border-radius: 30px;
        /* position: relative; */
        /* cursor: pointer; */
        
    }
    #right #info-user #name {
        width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 10px;
        font-size: 20px;
        padding-bottom: 50px;

    }
    #right #user  ul {
        position: absolute;
        padding: 10px;
        top: 40px;
        right: -50px;
        margin-top: 20px;
        display:inline-block;
        text-align: center;
        border-radius: 10px;
        background: rgb(238, 236, 231);
    }
    #right #user  ul li {
        height: 40px;
        line-height: 40px;
        text-align: left;
        padding: 0px 10px;
    }
    #right #user  ul li:hover {
        height: 40px;
        background: rgb(226, 217, 217) ;
        border-bottom: 1px solid rgb(185, 156, 156);

    }
    #notification-change-avatar{
            position: fixed;

    }
    #notification-change-avatar > div:nth-child(1){
        position: fixed;
        width: 100%;
        height: 100vh;
        top: 0px;
        left: 0px;
        background: white;
        opacity: 0.3;
        z-index: 1;
        text-indent: -10000000px;
    }
    #notification-change-avatar > div:nth-child(2) {
            position: fixed;
            top: 40%;
            left: 50%;
            right: 100px;
            background: white;
            border: 1px solid black;
            width: 500px;
            height: 500px;
            opacity: 1;
            text-align: center;
            padding-left: 100px;
            padding-top: 80px;
            z-index: 2;
           transform: translate(-50%, -50%);
        }
    #notification-change-avatar > div:nth-child(2) #choose-avatar{
        width: 150px;
        height: 150px;
        background: wheat;
        position: relative;
    }
    #notification-change-avatar > div:nth-child(2) #choose-avatar img{
        width: 150px;
        height: 200px;
        background: rgb(26, 16, 16);
    }
    #notification-change-avatar > div:nth-child(2) #choose-avatar input{
        position: absolute;
        width: 200px;
        height: 200px;
        left: 0;
        opacity: 0;
        background: red;
    }
    #notification-change-avatar > div:nth-child(2) span {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 20px;
        height: 20px;
        text-indent: -100000px;
        background: url('../assets/close_input.png') no-repeat;
        background-size: 20px 20px;
        padding: 3px;
    }
    #notification-change-avatar > div:nth-child(2) span:hover {
        cursor: pointer;
    }

    #notification-change-avatar > div:nth-child(2)  p{
                padding-right: 100px;
                padding-top: 20px;

    }  
    #notification-change-avatar > div:nth-child(2)  button{
                padding:4px 10px;
                background: rgb(76, 90, 216);
                color: white;
                border-radius: 4px;
                position: fixed;
                bottom: 30px;
    }            
    #notification-change-avatar > div:nth-child(2)  button:hover{
                background: rgb(74, 153, 206);
    }   
    .fade-enter-active, .fade-leave-active {
     transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    }


    /* //responsive */
@media  (max-width: 1000px) {
        .navbar #left{
            display: none;
        }
        .navbar #between {
            margin-left: -100px;
        }
}

@media  (max-width: 700px) {

        .navbar {
        width: 100%;
        display: flex;
        justify-content: center;
        position: relative;
        }
        .navbar #between {
            position: absolute;
            right: 45%;
         } 
         .navbar #logo{
             margin-left: -20px;
         }
        #menu {
               position: absolute;
               display: block;
               right: 10px;
            }
        #menu button {
                text-indent: -10000px;
                width: 30px;
                height: 30px;
                background: url('../assets/menu.png') no-repeat;
                background-size: 30px 30px;
                border: none;
            }
        .navbar  #right > ul {
             display: block;
             position: absolute;
             right: -30px;
             top: 55px;
             border-radius: 4px;
             width: 300px;
             background: rgb(240, 237, 232);
         }
        .navbar  #right > ul li {
            height: 30px;
            margin: 10px 4px;   
            border-bottom: 1px solid rgb(209, 196, 196); 
            margin-left: -20px;     
            font-size: 14px;  
            padding: 4px 10px;
            line-height: 10px;
         }
            .slide-fade-enter-active {
            transition: all .3s ease;
            right: 0px;
            top: 0px;
            position: absolute;
            }
            .slide-fade-leave-active {
            transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
            /* right: 100px; */
            right: 0px;
            top: 0px;
            }
            .slide-fade-enter, .slide-fade-leave-to
            /* .slide-fade-leave-active below version 2.1.8 */ {
            transform: translateX(10px);
            opacity: 0;
            right: 0px;
            position: absolute;
            }

        #right #user  ul {
        display: none;
        }

        #right #user #avatar {
         width: 25px;
         height: 25px;
         border-radius: 30px;
         padding-right: 25px;
         }
         #right #user #avatar img {
        width: 25px;
        height: 25px;
        margin-right: 10px;
        margin-top: -28px;
        border-radius: 30px;
        /* position: relative; */
        /* cursor: pointer; */
        
         }
        #right #info-user #name {
            font-size: 17px;
            margin-top: -4px;
            padding-top: 8px;
            
        }
        .navbar #search  {
        width: 20px;
        height: 20px;
        top: -4px;
        text-indent: -100000px;
        position: relative;
        background: url('../assets/search.png') no-repeat;
        background-size: 20px 20px;
        outline: none;
        border: none;
    }
     }

    #notification-change-avatar > div:nth-child(2) {
            position: fixed;
            top: 40%;
            left: 50%;
            right: 100px;
            background: white;
            border: 1px solid black;
            width: 300px;
            height: 300px;
            opacity: 1;
            text-align: center;
            padding-left: 70px;
            padding-top: 40px;
            z-index: 2;
           transform: translate(-50%, -50%);
        }
    #notification-change-avatar > div:nth-child(2) #choose-avatar{
        width: 150px;
        height: 150px;
    }
    #notification-change-avatar > div:nth-child(2) #choose-avatar img{
        width: 150px;
        height: 150px;
    }
    #notification-change-avatar > div:nth-child(2)  p{
                padding-right: 80px;
                padding-top: 20px;
                font-size: 12px;

    } 
    #notification-change-avatar > div:nth-child(2) #choose-avatar input{
        position: absolute;
        width: 100px;
        height: 100px;
        left: 30px;
        top: -10px;
    }
    #notification-change-avatar > div:nth-child(2)  button{
        padding:2px 5px;
        background: rgb(76, 90, 216);
        color: white;
        border-radius: 4px;
        position: fixed;
        right: 30px;
        bottom: 20px;
        font-size: 12px;
    } 
</style>