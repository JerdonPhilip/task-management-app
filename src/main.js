import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index.js"; // add this line

const app = createApp(App);
app.use(router); // register the router
app.mount("#app");
