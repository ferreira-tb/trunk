import "@/assets/style.css";
import App from "@/App.vue";
import { createApp } from "vue";
import { router } from "@/router";
import { setCurrentApp } from "@tb-dev/vue";

const app = createApp(App);

setCurrentApp(app);

app.use(router);
app.mount("#app");
