import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

const storeData = {
    plugins: [createPersistedState({  // dung de luu du lieu khi load lai trang
        storage: window.sessionStorage,
    })],
    state: {
        Post: [] ,
        Categories: [],
        CategoryId:  [], // lay ra id cua danh muc
        login_register_table: false,
        admin: true, // bat buoc gia tri la true de raload khong bi ve trang chu
        input_search: false,
    },
    mutations: {
        POST(state, post){
            state.Post = post
        },
        CATEGORY_ID(state, category_id){
            state.CategoryId = category_id

        },
        SIGNIN_TABLE(state){
            state.login_register_table = !state.login_register_table  // bat tat bang dang nhap , dang ki
        },
        ADMIN(state,admin){ // lay gia tri admin tu trang navbar 
            state.admin = admin
        },
        CATEGORY(state ,categories){
            state.Categories = categories;
        },
        INPUT_SEARCH(state){ // bat tat o tim kiem
            state.input_search = !state.input_search;
        }
    }
}

const store = new Vuex.Store(storeData)
export default store

