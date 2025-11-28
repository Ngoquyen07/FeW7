import {createWebHistory , createRouter} from "vue-router";
import auth from "../api/auth/auth.ts";
import Register from "../views/auth/Register.vue";
import Login from "../views/auth/Login.vue";
import Home from "../views/task/pages/Home.vue";
import Create from "../views/task/pages/Create.vue";
import Update from "../views/task/pages/Update.vue";
const router = createRouter({
    history: createWebHistory(),
    routes :[
        {
            path:"/register",
            name :"register",
            component : Register,

        },
        {
            path:"/",
            redirect: "/home",
        },
        {
            path:"/login",
            name :"login",
            component : Login,

        },
        {
            path:"/home",
            name :"home",
            component : Home,

        },
        {
            path:"/tasks/create",
            name :"tasks.create",
            component : Create,
        },
        {
            path:"/tasks/edit/:id",
            name :"tasks.edit",
            component : Update,
        }
    ]
})
export default router;