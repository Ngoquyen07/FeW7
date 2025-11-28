import {createApp} from 'vue'
import App from './App.vue'
import router from "../src/router/index.ts";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import {user} from "./stores/auth.ts";

const app = createApp(App);


app.provide("user", user);
app.use(router);
app.mount("#app");

