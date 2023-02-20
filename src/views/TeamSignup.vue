<template>
<div id="app">
      <Menu />
            <img alt="Vue logo" src="../assets/logo.png">
            <h1><b> Team Signup  </b></h1>
             <a-spin v-if="loading" size="large"></a-spin>
<div v-if="status === false">
  <a-form ref="formRef" :model="formState" v-bind="formItemLayoutWithOutLabel" :label-col="labelCol"
            :wrapper-col="wrapperCol">

       <a-form-item ref="name" label="Team name" name="name">
            <a-input v-model:value="formState.teamName" />
          </a-form-item>
    
           <a-form-item ref="name" label="Captain Full name" name="name">
            <a-input v-model:value="formState.capFullName" />
          </a-form-item>
          <a-form-item has-feedback label="Jersey #" name="jerseyNum">
            <a-input-number v-model:value="formState.jersey" />
          </a-form-item>
           <a-form-item has-feedback label="Phone (only numbers)" name="phone">
            <a-input v-model:value="formState.phone" />
          </a-form-item>

    <a-form-item
      v-for="(player, index) in formState.players"
      :key="player.key"
      v-bind="index === 0 ? formItemLayout : formItemLayout"
      :label="index === 0 ? 'Player 1' : `Player ${index + 1}`"
      :name="['players', index]"
    >
     <a-input
         v-model:value="player.fullName"
         placeholder="please input full name"
         style="width: 40%; "
       />
        <br />
       <a-input-number  v-model:value="player.jerseyNum"
         placeholder="please input jersey #"
         style="width: 40%;"
         />
      <br />
       <a-input
         v-model:value="player.phoneNum"
         placeholder="please input phone number"
         style="width: 40%; margin-right: 4px"
       />
       <br />
      <MinusCircleOutlined
        v-if="formState.players.length > 1"
        class="dynamic-delete-button"
        :disabled="formState.players.length === 1"
        @click="removeDomain(player)"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayoutWithOutLabel">
      <a-button type="dashed" style="width: 40%" @click="addDomain">
        <PlusOutlined />
        Add Player(s)
      </a-button>
    </a-form-item>
    <a-form-item v-bind="formItemLayoutWithOutLabel" style="padding-bottom: 100px">
      <a-button type="primary" html-type="submit" @click="submitForm">Submit</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
    </a-form-item>
  
  </a-form>
    <a-modal
      v-model:visible="visible"
      title="Confirm Team Roster?"
      width="100%"
      wrap-class-name="full-modal"
      @ok="handleSubmission"
    >
      <div v-html="modalText"></div>
    </a-modal>
</div>
<div v-else>
  <h1><b>Signup disabled!</b></h1>
</div>

</div>
</template>

<script>
import { reactive, ref, toRaw, onBeforeMount } from 'vue';
import firebase from "firebase/app"
import 'firebase/auth';
import { message } from 'ant-design-vue';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import Menu from '../components/Menu.vue';

export default {
  props: {

  },
  setup() {
    const formRef = ref();
    const status = ref(``);
    const modalText = ref('default');
    const visible = ref(false);
    const loading = ref(true);
    const auth = firebase.auth();
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 4,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 20,
        },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 20,
          offset: 4,
        },
      },
    };
    const formState = reactive({
      players: [],
      teamName: '',
    });

    const getIdToken = async () => {
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            const token = await user.getIdToken();
            const res = await getUserInfo(token);
            status.value = res.data[0].teamSignup
            loading.value = false;
            return token
          }
      })
    }
    
    onBeforeMount(() => {
      getIdToken()
    })

    const submitForm = () => {
      formRef.value
        .validate()
        .then(() => {
          visible.value = true;
          modalText.value = `<div style="align: center"><h3>Team Name: ${toRaw(formState).teamName} </h3> 
                             <b>Captain Name:</b> ${toRaw(formState).capFullName} | <b>Jersey #:</b> ${toRaw(formState).jersey} | <b>Phone #:</b> ${toRaw(formState).phone} <br />
                             <b>Players: </b><br /> ${displayPlayers(toRaw(formState).players)}`
        })
        .catch(error => {
          console.log('error', error);
        });
    };

    const displayPlayers = (players) => {
      let returnPlayer = [];
      players.forEach(player => {
                  returnPlayer.push("<ul><b>Player Name:</b> " + player.fullName + " | <b>Jersey #:</b> " + player.jerseyNum  + " | <b>Phone #:</b> " +  player.phoneNum + "</ul></div>")
      })
      return returnPlayer
    }

    const resetForm = () => {
      formRef.value.resetFields();
    };

    const handleSubmission = async () => {

    const user = auth.currentUser;
    const idToken = await user.getIdToken();
    const rosterPayload = {
        "data": toRaw(formState)
      }
      const response = await (await fetch(`https://us-central1-wffa25444.cloudfunctions.net/teamData?api=addData`, {
        method:'POST',
        body: JSON.stringify(rosterPayload),
        headers:{
            Authorization:"Bearer "+idToken,
            "Content-Type": "application/json"
            }
        }))
        if (response.status === 200) {
            message.success({
              content: 'Saved!',
              duration: 2,
            }); 


            location.replace(window.location.origin + `/teamroster`); //  direct user to team roster & disable signup
          
          }
        else { 
              message.error({
                        content: `ERROR`,
                        duration: 2,
            }); 
         }
      visible.value = false;
    }

    const removeDomain = item => {
      let index = formState.players.indexOf(item);

      if (index !== -1) {
        formState.players.splice(index, 1);
      }
    };

    const addDomain = () => {
      formState.players.push({
        value: '',
        key: Date.now(),
      });
    };

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
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      }, 
     
      formRef,
      formItemLayout,
      formItemLayoutWithOutLabel,
      formState,
      submitForm,
      resetForm,
      removeDomain,
      addDomain,
      visible,
      handleSubmission,
      modalText,
      status,
      loading
    };
  },

  components: {
    Menu,
    MinusCircleOutlined,
    PlusOutlined,

  },
};
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}

img {
    width: 220px;
    height: 180px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

</style>

