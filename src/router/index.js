import Vue from "vue";
import Router from "vue-router";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import ChatForm from "@/components/ChatForm";
import ProfileForm from "@/components/ProfileForm";
import HomePage from "@/components/HomePage";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Toasted from "vue-toasted";
import "@/assets/style.css";
Vue.use(Router);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Toasted);
library.add(faPencilAlt);
Vue.component("font-awesome-icon", FontAwesomeIcon);
export default new Router({
  routes: [
    {
      path: "/login",
      name: "LoginForm",
      component: LoginForm
    },
    {
      path: "/signup",
      name: "SignupForm",
      component: SignupForm
    },
    {
      path: "/chat",
      name: "ChatForm",
      component: ChatForm
    },
    {
      path: "/profile",
      name: "ProfileForm",
      component: ProfileForm
    },
    {
      path: "/",
      name: "home",
      component: HomePage
    }
  ]
});
