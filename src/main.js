import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import "firebase/firestore";
import VueGoogleMaps from '@fawmi/vue-google-maps';
import { urls } from './utils.js'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


window.onload = async () => {
  if(location.host === urls.prod) {
    const firebaseConfig = {
      apiKey: process.env.VUE_APP_PROD_API_KEY,
      authDomain: process.env.VUE_APP_PROD_AUTH_DOMAIN,
      projectId: process.env.VUE_APP_PROD_PROJECT_ID,
      storageBucket: process.env.VUE_APP_PROD_STORAGE_BUCKET,
      messagingSenderId: process.env.VUE_APP_PROD_MESSAGING_SENDER_ID,
      appId: process.env.VUE_APP_PROD_APP_ID,
      measurementId: process.env.VUE_APP_PROD_MEASUREMENT_ID
    };
    initializeWffaApp(firebaseConfig);
  } 
  else {
    const firebaseConfig = {
      apiKey: process.env.VUE_APP_API_KEY,
      authDomain: process.env.VUE_APP_AUTH_DOMAIN,
      projectId: process.env.VUE_APP_PROJECT_ID,
      storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
      appId: process.env.VUE_APP_APP_ID,
      measurementId: process.env.VUE_APP_MEASUREMENT_ID
    };
    initializeWffaApp(firebaseConfig);
  } 
}


const initializeWffaApp = (firebaseConfig) => {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const app = createApp(App)
  app.use(Antd)
  app.use(router)
  app.use(VueSweetalert2)
  app.use(VueGoogleMaps, {
    load: {
        v: 3.53,
        key: process.env.VUE_APP_GOOGLE_MAPS,
        libraries: "places"
    },
  }).mount('#app')
}