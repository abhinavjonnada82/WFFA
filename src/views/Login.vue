<template>
  <div id="login">
    <Header title='Wichita Flag Football Association'/>
    <h1>Login</h1>
    <a-form
      layout="inline"
      :model="formState"
      @finish="login"
      @finishFailed="handleFinishFailed"
    >
    <div style="margin-left: auto; margin-right: auto;">
      <a-form-item style="width: 500px;">
        <a-input  v-model:value="formState.email" placeholder="Username">
          <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
        </a-input>
      </a-form-item>
              <br />
      <a-form-item >
        <a-input  v-model:value="formState.password" type="password" placeholder="Password">
          <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
        </a-input>
      </a-form-item>
              <br />
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          :disabled="formState.email === '' || formState.password === ''"
        >
          Log in
        </a-button>
      </a-form-item>
    </div>
    </a-form>
     <br />
     <div id="socialButton">
      <a-button :style="{fontSize: '20px'}" @click="fbLogin"> <FacebookOutlined /> </a-button>
      <div class="divider"/>
      <a-button  :style="{fontSize: '20px'}" @click="gLogin"> <GoogleOutlined /> </a-button>
     </div>
     <br />
      <p>Have an email account? <router-link to="/register">Register Here</router-link></p>
    </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined, FacebookOutlined, GoogleOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive } from 'vue';
import firebase from "firebase/app"
import 'firebase/auth';
import Header from '../components/Header.vue';



export default defineComponent({
  setup() {
    const auth = firebase.auth();
    const formState = reactive({
      email: '',
      password: '',
    });

    const login = () => {
      auth
                .signInWithEmailAndPassword(formState.email, formState.password)
                .then(() => {
                        message.success({
                            content: 'Logged in!',
                            duration: 2,
                });
                      })
                .catch((error) => {
                   message.error({
                              content: `${error.message}`,
                              duration: 2,
                  });   
                })
        
    };

  const fbLogin = () => {
    let provider = new firebase.auth.FacebookAuthProvider();
    auth
        .signInWithPopup(provider)
        .then(() => {
          /** @type {firebase.auth.OAuthCredential} */
          message.success({
                              content: 'Success!',
                              duration: 2,
            });
        })
        .catch((error) => {
          message.error({
                              content: `${error}`,
                              duration: 2,
            });
        });
    }

  const gLogin = () => {
      let provider = new firebase.auth.GoogleAuthProvider();
      auth
        .signInWithPopup(provider)
        .then(() => {
          /** @type {firebase.auth.OAuthCredential} */
            message.success({
                              content: 'Success!',
                              duration: 2,
                });
        })
        .catch((error) => {
           message.error({
                              content: `${error}`,
                              duration: 2,
            });
        });
      }

    const handleFinishFailed = errors => {
      console.log(errors);
    };

    return {
      formState,
      login,
      fbLogin,
      gLogin,
      handleFinishFailed,
    };
  },

  components: {
    Header,
    UserOutlined,
    LockOutlined,
    FacebookOutlined,
    GoogleOutlined
  },
});
</script>

<style>
  #socialButton {
        display: inline-block;
  }
  .divider{
    width:5px;
    height:auto;
    display:inline-block;
}
</style>