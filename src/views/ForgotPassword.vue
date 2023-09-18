<template>
    <div id="forgot">
      <Header title='Wichita Flag Football Association'/>
      <h1>Forgot Password</h1>
      <a-form
        layout="inline"
        :model="formState"
        @finish="forgotPassword"
        @finishFailed="handleFinishFailed"
      >
      <div style="margin-left: auto; margin-right: auto;">
        <a-form-item style="width: 500px;">
          <a-input  v-model:value="formState.email" placeholder="Email Address">
            <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
          </a-input>
        </a-form-item>
                <br />
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :disabled="formState.email === ''"
          >
            Submit
          </a-button>
        </a-form-item>
      </div>
      </a-form>
      <br />
      <p>Back to <router-link to="/login">Login</router-link></p>
      <br />
      </div>
  </template>
  
  <script>
  import { message } from 'ant-design-vue';
  import { UserOutlined } from '@ant-design/icons-vue';
  import { defineComponent, reactive } from 'vue';
  import firebase from "firebase/app"
  import 'firebase/auth';
  import Header from '../components/Header.vue';
  
  
  
  export default defineComponent({
    setup() {
   const auth = firebase.auth();
    const formState = reactive({
        email: '',
      });
  
    const forgotPassword = () => {
      const regex = /@/;
      if (regex.test(formState.email)) {
        auth.sendPasswordResetEmail(formState.email)
        .then(() => {
                message.success({
                    content: 'You will receive an email with a link to reset your password.',
                    duration: 10,
        });
              })
        .catch((error) => {
            message.error({
                      content: `${error.message}`,
                      duration: 4,
          });   
        })
      }
      else {
        message.warning({
                        content: `Invalid Email Address`,
                        duration: 2,
                    });   
      }
    }


  
      const handleFinishFailed = errors => {
        console.log(errors);
      };
  
      return {
        formState,
        handleFinishFailed,
        forgotPassword
      };
    },
  
    components: {
      Header,
      UserOutlined,
    },
  });
  </script>
  
  <style>

  </style>