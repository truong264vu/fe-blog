<template>
<div>
    <div id="background-opacity" v-if="login_register_table">background</div>
    <div id="login-register">


       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
      <div id="table">
          <div class="head-table">
              <div>
                <ul>
                        <li id="logo"><img src="../assets/logo.png" alt=""></li>
                        <li id="login" @click="isActive = true" :class="{isActive: isActive == true}" >Login</li>
                        <li id="register" @click="isActive = false" :class="{isActive: isActive == false}">Register</li>
                </ul>
                <ul>
                       <li id="close-table" @click="SIGNIN_TABLE()">close</li>
                </ul>
              </div>
          </div>
          <div class="body-table">
              <div class="body">
                    

                    <div>
                        <input type="email" v-model="account.email" placeholder="Enter email@gmail.com">
                    </div>

                    <div v-show="isActive == false"> 
                        <input type="text" v-model="account.name" placeholder="Enter name">

                    </div>

                    <div class="input-password">
                        <input id="password" v-model="account.password" type="password" placeholder="Enter password">
                        <span class="show-btn" @click="showPassword()"><i class="fas fa-eye"></i></span>

                            <input type="submit" id="showError" v-if="errors" value="this.errors" v-model="errors">

                             <p >Password should be the combination of 6-20 characters and numbers</p>
                       
                    </div>
                    <div class="sign-in">
                        <input type="submit" value="Register" v-show="isActive == false" @click="register()">
                        <input type="submit" value="Login" v-show="isActive == true" @click="login()">
                    </div>
              </div>
          </div>
      </div>
  </div>
</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

import network from '../core/network'
// const axios = require('axios');

export default {
    data() {
        return{
            isActive: true,
            account:{
                email: '',
                password: '',
                name: '',
            },
            errors: '',
        }
    },
    computed: mapState(['login_register_table']),

    methods: {
        ...mapMutations(['SIGNIN_TABLE']),
        showPassword: function(){
        const passField = document.getElementById("password");
        const showBtn = document.querySelector("span i");
                if(passField.type === "password"){
                passField.type = "text";
                showBtn.classList.add("hide-btn");
                }else{
                passField.type = "password";
                showBtn.classList.remove("hide-btn");
                }
        },
            validEmail: function (email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
            },


        login: function(){ //dang nhap
            network.post('login', this.account)
            .then(response => {
                window.localStorage.setItem('token' , response.data.token);
                window.localStorage.setItem('name' , response.data.name);
                window.localStorage.setItem('email' , response.data.email);
                window.localStorage.setItem('role' , response.data.role);
                window.localStorage.setItem('id' , response.data.id);
                location.reload();
            })
            .catch( error => {
                // if(!this.account.name) this.errors.push("Tên người dùng là bắt buộc");
                if(!this.account.email) {
                    this.errors = "Email is required";
                } else if(!this.validEmail(this.account.email)) {
                    this.errors = "Email is not valid";        
                }
                else{
                    this.errors = "Email or password is incorrect"
                }
                console.log(error.response.data.errors)
                setTimeout(() => this.errors = '', 2000); //an thong bao loi sau 2s
            })
        },

        // dang ky
        register: function(){
            network.post('register', this.account)
            .then( () => {
                this.isActive = true;
            })
            .catch( () => {
                 if(!this.account.name) this.errors = "Username is required";
                if(!this.account.email) {
                    this.errors = "Email is required";
                } else if(!this.validEmail(this.account.email)) {
                    this.errors = "Email is not valid";        
                }
                else {
                    this.errors = "Email or username already used"
                }
            setTimeout(() => this.errors = '', 2000); // an thong bao loi sau 2s

            })
             
        }
       

       
    }

}
</script>

<style scpoed>
    #background-opacity {
    text-indent: -10000px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    opacity: 20%;
    z-index: 1;
    background: white;
    background-size: 100% 100vh;
    }
    #login-register {
        height: 600px;
        width: 500px;
        background: url('../assets/login.jpg') no-repeat;
        background-size: 500px 600px;
        border-radius: 20px;
        position: fixed;
        top: 50%;
        left: 50%;
        /* color: white; */
        transform: translate(-50%, -50%);
        z-index: 2;
    }
    input:hover {
        cursor: pointer;
    }


    /* header  */
    .head-table{
        height: 70px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid rgb(202, 186, 186);
    }
    .head-table > div {
        width: 600px;
        height: 70px;
        display: flex;
        justify-content: space-between;
    }
    .head-table > div ul {
        display: flex;
        align-items: center;
    }
    .head-table #logo img{
            width: 100px;
            height: 60px;
            margin-top: 10px;
    }
    .head-table #close-table{
        color: black;
        margin-top: -40px;
        margin-right: -90px;
    }
    .head-table > div ul li {
        margin-right: 40px;
        padding: 3px 5px;
        font-weight: 500;
        height: 70px;
        line-height: 70px;
        color: rgb(201, 166, 166);
    }
    .head-table  .isActive  {
        border-bottom: 2px solid rgb(185, 162, 162);
        /* color:  white; */
        font-weight: 600;
        color: rgb(255, 255, 255);
    }

    .head-table > div ul li:hover {
        cursor: pointer;
    }
    .head-table div ul > #close-table{
        text-indent: -100000px;

    }
    .head-table div ul #close-table::before{
        content: ' ';
        position: absolute;
        width: 20px;
        height: 20px;
        background: url('../assets/cancel.png') no-repeat;
        top: 16px;
        right: 20px;
        background-size: 20px 20px;
    }


    /* body */
    .body-table{
        position: absolute;
        display: flex;
        top: 20%;
        left: 12%;
    }
    .body-table #showError {
        position: fixed;
        bottom: 170px;
        left: 140px;
        width: 300px;
        height: 40px;
        background: white;
        color: black;
        text-align: center;
        line-height: 40px;
        border-radius: 4px;
        transition: width 2s;
    }
    /* show password */

    .body div > input{
    width: 380px;
    height: 50px;
    padding-left: 15px;
    font-size: 16px;
    outline: none;
    color: black;
    border-radius: 5px;
    margin: 15px 0px;
    background: #e1dde4;
    outline: none;
    border: none;

    }
    .body  input::placeholder{
    font-size: 17px;
    }
    /* icon showbtn */
    .input-password .show-btn{ 
    position: absolute;
    right: -40px;
    top: 65%;
    transform: translateY(-50%);
    font-size: 20px;
    color: black;
    cursor: pointer;
    display: none;
    }

    .input-password{
    position: relative;
    height: 55px;
    width: 320px;
    border-radius: 5px;
    box-shadow: 0px 3px 3px rgba(0,0,0,0.1);
    }
    .input-password input:valid ~ span{
    display: block;
    position: absolute;
    bottom: 0px;
    }
    .input-password span i.hide-btn::before{
    content: "\f070";
    }
    .input-password p {
        color: rgb(155, 184, 184);
        font-style: italic;
    }

    /* sign-in  */
    .body .sign-in > input {
        background: rgb(75 75 82);
        color: white;
        font-size: 18px;
        font-weight: 600;
        bottom: 100px;
        position: fixed;
    }


    /* responsive */

    @media (max-width: 900px){
    #login-register {
        height: 500px;
        width: 400px;
        background-size: 400px 500px;
        border-radius: 10px;
    }
    .head-table > div {
        width: 300px;
        height: 50px;
    }
    .head-table #logo{
        margin-top: -20px;
    }
    .head-table #logo img{
            width: 80px;
            height: 60px;
            margin-left: -60px;
    }
    .head-table #close-table{
        color: black;
        margin-top: -40px;
        margin-right: -90px;
    }
    .head-table > div ul li {
        margin-right: 20px;
        padding: 3px 5px;
        font-weight: 500;
        height: 70px;
        font-size: 14px;
        line-height: 90px;
        color: rgb(201, 166, 166);
    }
    .body-table #showError {
        bottom: 170px;
        left: 100px;
        width: 280px;
        height: 30px;
        background: white;
        color: black;
        line-height: 30px;
    }
    .body div > input{
        width: 300px;
        height: 40px;
        padding-left: 15px;
        font-size: 14px;
        margin: 15px 0px;
    }
    .input-password input:valid ~ span{ 
    display: block;
    right: 30px;
    bottom: -10px;
    }
    .input-password p {
        font-size: 14px;
    }
    .body .sign-in > input {
        background: rgb(75 75 82);
        color: white;
        font-size: 18px;
        font-weight: 600;
        bottom: 80px;
        position: fixed;
    }


    }


    @media (max-width: 600px){
    #login-register {
        height: 400px;
        width: 300px;
        background-size: 300px 400px;
        border-radius: 10px;
    }
    .head-table {
        height: 50px;
    }
    .head-table > div {
        width: 2500px;
        height: 30px;
    }
    .head-table #logo{
        margin-top: 0px;
        margin-left: 40px;
    }
    .head-table #logo img{
            width: 50px;
            height: 40px;
    }
    .head-table #close-table{
        color: black;
        margin-top: -40px;
        margin-right: -90px;
    }
    .head-table > div ul li {
        margin-right: 20px;
        padding: 3px 5px;
        font-weight: 500;
        height: 50px;
        font-size: 14px;
        line-height: 50px;
        color: rgb(201, 166, 166);
    }
    .body-table #showError {
        bottom: 120px;
        left: 60px;
        width: 200px;
        height: 30px;
        background: white;
        color: black;
        line-height: 30px;
    }
    .body div > input{
        width: 250px;
        height: 40px;
        padding-left: 10x;
        font-size: 12px;
        margin: 6px 0px;
        margin-left: -10px;
    }
    .input-password input:valid ~ span{ 
    display: block;
    right: 20px;
    bottom: -30px;
    }
    .input-password {
        width: 250px;
    }
    .input-password p {
        font-size: 12px;
    }
    .body .sign-in > input {
        background: rgb(75 75 82);
        color: white;
        font-size: 14px;
        font-weight: 600;
        bottom: 60px;
        position: fixed;
    }
    }
</style>