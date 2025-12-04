import {createWebHistory , createRouter} from "vue-router";
import auth from "../api/auth/auth.ts";
import Home from "../views/task/pages/Home.vue";
import Create from "../views/task/pages/Create.vue";
import Update from "../views/task/pages/Update.vue";
import Register from "../views/auth/Register.vue";
import Login from "../views/auth/Login.vue";
import Profile from "../views/info/Profile.vue";
import {user} from "../stores/auth.ts";
import ForgotPassword from "../views/fogotpw/ForgotPassword.vue";
import ResetPassword from "../views/fogotpw/ResetPassword.vue";
import ErrNotFound from "../views/errors/ErrNotFound.vue";
import VerifyEmail from "../views/auth/VerifyEmail.vue";

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
        },
        {
            path:"/forgot-password",
            name :"forgot-password",
            component : ForgotPassword,
        },
        {
            path:"/password-reset/:token",
            name :"password-reset",
            component : ResetPassword,
        },
        {
            path:"/email-verify",
            name:"email-verify",
            component : VerifyEmail,
        },
        {
            path: "/:pathMatch(.*)*",
            name:"/404",
            component: ErrNotFound,
        }
    ]
});
router.beforeEach(async (to, _from, next) => {
    try {
        // lấy thử thôi giá trị vẫn có thể là null nếu chưa login
        if(!user.value){
            user.value = await (await auth.getUser()).data;
        }
    } catch (error) {
        user.value = null;
    }
    // CHƯA LOGIN
    if (!user.value) {
        if (to.name === "login" || to.name === "register" || to.name === "forgot-password" || to.name === "password-reset" ) {
            return next();
        }
        return next("/login");
    }
    // ĐÃ LOGIN
    else if(!user.value.email_verified_at){
        if (to.name === "email-verify") {
            return next();
        }
        // Không cho vào trang khác
        return next(`/email-verify`);
    }
    if (to.name === "login" || to.name === "register" || to.name === "forgot-password" || to.name === "password-reset" ) {
        return next("/");
    }
    next();
});

export default router;