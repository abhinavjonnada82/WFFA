<template>
  <div>
    <a-menu mode="horizontal">
        <a-menu-item>
            <template #icon>
            <home-outlined />
            </template>
            <router-link to="/">Home</router-link>
        </a-menu-item>
        <div v-if="admin === true">
          <a-menu-item>
              <template #icon>
              <check-outlined />
              </template>
              <router-link to="/approve">Approve</router-link>
          </a-menu-item>
        </div>

        <a-menu-item>
            <template #icon>
            <edit-outlined />
            </template>
            <router-link :to="{
              path: '/teamsignup',
             }">
              Team Signup  </router-link>
        </a-menu-item>
        <a-menu-item>
            <template #icon>
            <container-outlined />
            </template>
            <router-link to="/teamroster">Team Roster</router-link>
        </a-menu-item>
        <a-menu-item>
            <template #icon>
            <appstore-outlined />
            </template>
            <router-link to="/about">About</router-link>
        </a-menu-item>
        <a-menu-item @click="logout">
            <template #icon>
            <logout-outlined />
            </template>
            Logout
        </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue';
import firebase from "firebase/app"
import 'firebase/auth';
import { message } from 'ant-design-vue';
import { AppstoreOutlined, EditOutlined, LogoutOutlined, ContainerOutlined, HomeOutlined, CheckOutlined  } from '@ant-design/icons-vue';

export default {
  name: 'Menu',
  props: {

  },
  setup() {
    const admin = ref(``);
    const auth = firebase.auth();
    const logout = () => {
      auth.signOut()
        .then(() => console.log('Signed out') )
        .catch(err => alert(err.message))
      localStorage.removeItem('admin');
      localStorage.removeItem('records');
    }

    onBeforeMount(async () =>  {
       await getToken() 
    })

    const getToken = () => {
      admin.value = localStorage.getItem('admin') === 'true' ? true : false
      if (localStorage.getItem('admin') !== 'true') {
        auth.onAuthStateChanged(async (user) => {
        if (user) {
          let token = await user.getIdToken();
          const res = await getUserInfo(token);
          if(res.data.length != 0 && res.data[0]?.admin) { 
            admin.value = res.data[0]?.admin
            localStorage.setItem('admin', res.data[0]?.admin)
          }
        }
      })  
    }
  }

    const getUserInfo = async (token) => {
      const response = await fetch(`https://us-central1-wffa25444.cloudfunctions.net/teamData?api=getUserData&type=user`, {
        method:'GET',
        headers:{
            Authorization:"Bearer "+token,
            "Content-Type": "application/json"
            }
      })
      if (response.status === 200) {
        return response.json()
        }
      else { 
            message.error({
                          content: `ERROR`,
                          duration: 2,
              }); 
          }
      }
    return {
      logout,
      admin
    };
  },
  components: {
    AppstoreOutlined,
    HomeOutlined, 
    EditOutlined,
    ContainerOutlined,
    LogoutOutlined,
    CheckOutlined
  }
}
</script>