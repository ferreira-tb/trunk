import "@tb-dev/vue-sonner/style.css";
import "@/assets/style.css";
import "@tb-dev/prototype-dom";
import App from "@/App.vue";
import { createApp } from "vue";
import { router } from "@/router";
import { createPinia } from "pinia";
import { handleError } from "@/lib/error";
import { setCurrentApp, setErrorHandler } from "@tb-dev/vue";

const app = createApp(App);
const pinia = createPinia();

setCurrentApp(app);
setErrorHandler(handleError, app);

app.use(router);
app.use(pinia);

app.mount("#app");
