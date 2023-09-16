import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import "firebase/firestore";
import VueGoogleMaps from '@fawmi/vue-google-maps';


const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const app = createApp(App)

export const db = firebase.firestore();
app.use(Antd)
app.use(router)
app.use(VueGoogleMaps, {
  load: {
      v: 3.53,
      key: process.env.GOOGLE_MAPS_KEY,
      libraries: "places"
  },
}).mount('#app')
