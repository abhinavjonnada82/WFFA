<template>
  <div id="app">
      <Menu />

        <img alt="Vue logo" src="../assets/logo.png">
        <h1><b>Welcome</b></h1>
        <a-timeline mode="alternate">
          <div v-if="completeRoster === true">
            <a-timeline-item color="green">Complete Roster</a-timeline-item>
          </div>
          <div v-else>
            <a-timeline-item color="red">Complete Roster</a-timeline-item>
          </div>
          <div v-if="adminApproval === true">
            <a-timeline-item color="green">Admin Approval</a-timeline-item>
          </div>
          <div v-else>
            <a-timeline-item color="red">Admin Approval</a-timeline-item>
          </div>
             <div v-if="paymentSuccess === true">
            <a-timeline-item color="green">Payment</a-timeline-item>
          </div>
          <div v-else>
            <a-timeline-item color="red">Payment</a-timeline-item>
          </div>
          <div v-if="completeRoster === true && adminApproval === true && paymentSuccess === true">
            <a-timeline-item color="#00CCFF">
              <template #dot>
                <SmileOutlined />
              </template>
              <p>Get Ready to Play!</p>
            </a-timeline-item>
          </div>
          <div v-else>
            <a-timeline-item color="#00CCFF">
              <template #dot>
                <ClockCircleOutlined style="font-size: 16px" />
              </template>
              <p>In progress!</p>
            </a-timeline-item>
          </div>
        </a-timeline>
  </div>
</template>


<script>
import { ref, onBeforeMount } from 'vue';
import firebase from 'firebase';
import Menu from '../components/Menu.vue';
import { message } from 'ant-design-vue';
import { SmileOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';

export default {
  setup() {
      const completeRoster = ref(``);
      const adminApproval = ref(``);
      const paymentSuccess = ref(``);

    onBeforeMount(() => {
      getIdToken()
    })

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

    const getIdToken = async () => {
        firebase.auth().onAuthStateChanged(async (user) => {
          if (user) {
            const token = await user.getIdToken();
            const res = await getUserInfo(token);
            completeRoster.value = res.data[0].teamSignup
            adminApproval.value = res.data[0].approve
            paymentSuccess.value = res.data[0].payment
          }
      })
    }



    return {
      completeRoster,
      adminApproval,
      paymentSuccess,
    };
  },

  components: {
   Menu,
   SmileOutlined,
   ClockCircleOutlined
  },
};
</script>
<style>


img {
    width: 250px;
    height: 200px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}


</style>

