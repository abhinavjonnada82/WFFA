<template>
  <div class="register">
    <Header />
    <h1>Register</h1>
     <a-form
      name="custom-validation"
      ref="formRef"
      layout="horizontal"
      :model="formState"
      :rules="rules"
      v-bind="layout"
      @finish="register"
      @finishFailed="handleFinishFailed"
    >
   <div style="margin: auto;
width: 30%;
padding: 10px;">
     <a-form-item has-feedback label="Email" name="email" style="width: 500px;">
        <a-input v-model:value="formState.email">
          <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
        </a-input>
      </a-form-item>
      <a-form-item has-feedback label="Password" name="pass" style="width: 500px;">
        <a-input v-model:value="formState.pass" type="password" autocomplete="off" >
         <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
        </a-input>
      </a-form-item>
      <a-form-item has-feedback label="Confirm" name="checkPass" style="width: 500px;">
        <a-input v-model:value="formState.checkPass" type="password" autocomplete="off" >
          <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
        </a-input>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 10, offset: 8 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
      </a-form-item>
    </div>
    </a-form>
      <p>Already have an (social) account? <router-link to="/login">Login Here</router-link></p>
  </div>

</template>

<script>
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref } from 'vue';
import Header from '../components/Header.vue';
import firebase from "firebase/app"
import 'firebase/auth';


export default defineComponent({
  setup() {
    const formRef = ref();
    const auth = firebase.auth();
    const formState = reactive({
      email: '',
      pass: '',
      checkPass: ''
    });
   

    let validatePass = async (rule, value) => {
      if (value === '') {
        return Promise.reject('Please input the password');
      } else {
        if (formState.checkPass !== '') {
          formRef.value.validateFields('checkPass');
        }

        return Promise.resolve();
      }
    }

    let validatePass1 = async (rule, value) => {
      if (value === '') {
        return Promise.reject('Please input the email address');
      } 
    };

    let validatePass2 = async (rule, value) => {
      if (value === '') {
        return Promise.reject('Please input the password again');
      } else if (value !== formState.pass) {
        return Promise.reject("Two inputs don't match!");
      } else {
        return Promise.resolve();
      }
    };

    const rules = {
       email: [
        {
          required: true,
          validator: validatePass1,
          trigger: 'change',
        },
      ],
      pass: [
        {
          required: true,
          validator: validatePass,
          trigger: 'change',
        },
      ],
      checkPass: [
        {
          validator: validatePass2,
          trigger: 'change',
        },
      ]
    };
    
    const layout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    };

    const register = () => {
      auth
          .createUserWithEmailAndPassword(formState.email, formState.pass)
          .then(() => {
                        message.success({
                              content: 'Registered!',
                              duration: 2,
                });
      })
      .catch((error) => {
          message.error({
                          content: `${error.message}`,
                          duration: 2,
          });
        });
    }

    const handleFinishFailed = errors => {
      console.log(errors);
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    return {
      formState,
      formRef,
      rules,
      layout,
      handleFinishFailed,
      register,
      resetForm,
      
    };
  },
    components: {
      Header,
      UserOutlined,
      LockOutlined,
  },
});
</script>


