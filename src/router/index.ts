import {createWebHistory , createRouter} from "vue-router";
import auth from "../api/auth/auth.ts";
import Home from "../views/task/pages/Home.vue";
import Create from "../views/task/pages/Create.vue";
import Update from "../views/task/pages/Update.vue";
import Register from "../views/auth/Register.vue";
import Login from "../views/auth/Login.vue";
import Profile from "../views/info/Profile.vue";
import {user} from "../stores/auth.ts";

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
        },
        {
            path:"/profile",
            name :"profile",
            component : Profile,
        }
    ]
});
router.beforeEach(async (to, _from, next) => {
    console.log("Check trước khi điều hướng" , user.value);
    try {
        // lấy thử thôi giá trị vẫn có thể là null . Nếu chưa login
        if(!user.value){
            console.log("Gửi request lấy lại user từ serve")
            user.value = await (await auth.getUser()).data;
            console.log("user" ,user.value);
        }
        else{
            console.log("Đã có user ko cần lấy lại" ,user.value.name);
        }
    } catch (error) {
        console.log(error);
        user.value = null;
    }
    // console.log("user" ,user);

    // CHƯA LOGIN
    if (!user.value) {
        if (to.name === "login" || to.name === "register") {
            return next();
        }
        return next("/login");
    }

    // ĐÃ LOGIN
    if (to.name === "login" || to.name === "register") {
        return next("/");
    }

    next();

});

export default router;