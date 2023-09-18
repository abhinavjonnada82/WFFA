<template>
  <div id="app">
    <Menu />

    <div class="container">
      <div class="logo-container">
        <img alt="Vue logo" src="../assets/logo.png" />
      </div>
      <h1><b>Welcome, {{ nameField || `guest` }}!</b></h1>
      <a-spin v-if="loading" size="large"></a-spin>

      <!-- Timeline Div -->
      <div v-if="userType === `user`">
        <a-timeline mode="alternate">
          <!-- ... Timeline Items ... -->
                        <div v-if="completeRoster === true">
                          <a-timeline-item color="green">Complete Roster</a-timeline-item>
                        </div>
                        <div v-else>
                          <a-timeline-item color="red"><router-link to="/teamsignup">Complete Roster</router-link></a-timeline-item>
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

                        <div v-if="completeRoster === true && adminApproval === true && paymentSuccess === false">
                          <a-timeline-item color="#00CCFF">
                            <template #dot>
                              <DollarCircleOutlined style="font-size: 16px" />
                            </template>
                            <p>Make a payment $$$</p>
                          </a-timeline-item>
                        </div>
                        <div v-else-if="completeRoster === true && adminApproval === true && paymentSuccess === true">
                          <a-timeline-item color="#00CCFF">
                            <template #dot>
                              <SmileOutlined />
                            </template>
                            <p>Get Ready to Play!</p>
                          </a-timeline-item>
                        </div>
                        <div v-else-if="completeRoster === true && adminApproval === false && paymentSuccess === false">
                          <a-timeline-item color="#00CCFF">
                            <template #dot>
                              <ClockCircleOutlined />
                            </template>
                            <p>Waiting for admin approval!</p>
                          </a-timeline-item>
                        </div>
                        <div v-else>
                          <a-timeline-item color="#00CCFF">
                            <template #dot>
                              <FormOutlined />
                            </template>
                            <p>Signup your team!</p>
                          </a-timeline-item>
                        </div>
        </a-timeline>
      </div>

      <br />

            <!-- Payment Div -->
      <div v-if="completeRoster === true && adminApproval === true && paymentSuccess === false">
        <CashApp />
        <Venmo />
      </div>

      <div class="button-container">
        <!-- ... Button Divs ... -->
        <div v-if="roleAdmin === true && rulesEngineActive === true">
                <AdminSummary/>
                <br />
                <a-button type="primary" size="large" disabled>Host a season/tournment</a-button>
              </div>
              <div v-else-if="roleAdmin === true">
                <a-button type="primary" size="large" @click="redirectToOnboarding">Host a season/tournment</a-button>
              </div>
              <div v-else-if="role === 'user' && rulesEngineActive === false && nameField !== ''">
                <a-button type="primary" size="large" @click="integrateRulesEngine">Enter a season/tournment</a-button>
              </div>
              <div v-else-if="role === 'user' && rulesEngineActive === true">
                <UserHeadlines />
              </div>
      </div>

    </div>

    <!-- Modals -->
    <a-modal
      v-model:visible="visible"
      title="Details, please?"
      width="75%"
      wrap-class-name="full-modal"
      @ok="handleSubmission"
    >
    <template v-if="modalText || modalText2">
      <div v-if="modalText" v-html="modalText"></div>
      <a-input v-model:value="nameField" />
      <br />
      <div v-if="modalText2" v-html="modalText2"></div>
      <a-input v-model:value="phoneField" required/>
    </template>
    </a-modal>

    <a-modal
      v-model:visible="visiblePin"
      title="Enter a season/tournment"
      width="75%"
      wrap-class-name="full-modal"
      @ok="handlePINSubmission"
    >
      <div v-html="modalPINText"></div>
      <a-input type="number" v-model:value="uniquePIN" />
    </a-modal>
  </div>

</template>

<script>
import { ref, onBeforeMount, toRaw } from 'vue';
import firebase from "firebase/app"
import 'firebase/auth';
import Menu from '../components/Menu.vue';
import CashApp from '../components/CashApp.vue';
import Venmo from '../components/Venmo.vue';
import AdminSummary from '../components/AdminSummary.vue';
import { message } from 'ant-design-vue';
import { SmileOutlined, ClockCircleOutlined, FormOutlined, DollarCircleOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router'
import UserHeadlines from '../components/UserHeadlines.vue';
import { baseAPI } from '../utils';

export default {
  setup() {
      const completeRoster = ref(``);
      const adminApproval = ref(``);
      const paymentSuccess = ref(``);
      const modalText = ref('default');
      const modalText2 = ref('default');
      const visible = ref(false);
      const visiblePin = ref(false);
      const nameField = ref('');
      const phoneField = ref('');
      const loading = ref(true);
      const auth = firebase.auth();
      const router = useRouter();
      const roleAdmin = ref('');
      const userType = ref('');
      const rulesEngineActive = ref('');
      const role = ref('');
      const uniquePIN = ref('');
      const modalPINText = ref('default');
      const paymentValue = ref('');

    onBeforeMount(() => {
      getIdToken()
    })

    const getUserInfo = async (token) => {
      const response = await fetch(`${baseAPI}teamData?api=getUserData&type=user`, {
        method:'GET',
        headers:{
            Authorization:"Bearer "+token,
            "Content-Type": "application/json"
            }
      })
    
      if (response.status === 200) {
        return response.json();
        }
      else { 
            message.error({
                          content: `ERROR`,
                          duration: 2,
              }); 
          }
      }

    const getIdToken = async () => {
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            const token = await user.getIdToken();
            const res = await getUserInfo(token);
            if(res.data === false) window.location.reload();
            completeRoster.value = res.data[0]?.teamSignup
            adminApproval.value = res.data[0]?.approve
            paymentSuccess.value = res.data[0]?.payment
            roleAdmin.value = res.data[0]?.admin
            userType.value = res.data[0]?.role
            rulesEngineActive.value = res.data[0]?.rulesEngineActive
            role.value = res.data[0]?.role
            localStorage.setItem('payment', res.data[0]?.rules?.payment)
            console.log('21ssssssccccxxx3232', res.data[0]?.name)
            if (res.data[0]?.name === null) {
              console.log('213232')
              setNamePhone();
            } 
            else if (res.data[0]?.name !== null && res.data[0]?.phone === null) {
              console.log('21ccccsssssd32')
              nameField.value = res.data[0]?.name
              setPhone();
            }
            else if (res.data[0]?.name !== null || res.data[0]?.phone !== null) {
              console.log('21ccccc32')
              nameField.value = res.data[0]?.name
              loading.value = false
            }
          }
      })
    }

    const handlePINSubmission = async () => {
      const user = auth.currentUser;
      const idToken = await user.getIdToken();
      const rosterPayload = {
          "pin": toRaw(uniquePIN.value)
      }
      const response = await (await fetch(`${baseAPI}teamData?api=updateUserProfile&type=addRulesEngine`, {
        method:'POST',
        body: JSON.stringify(rosterPayload),
        headers:{
            Authorization:"Bearer "+idToken,
            "Content-Type": "application/json"
            }
        }))
        if (response.status === 200) {
            message.success({
              content: 'Thank you!',
              duration: 2,
            });
            location.reload();
          }
        if (response.status === 401) {
            message.warning({
              content: 'Incorrect PIN, try again!',
              duration: 4,
            }); 
          }
        if (response.status === 500) {
              message.error({
                content: `ERROR`,
                duration: 2,
            }); 
         }
        visiblePin.value = false;
    }

    const handleSubmission = async () => {
      const user = auth.currentUser;
      const idToken = await user.getIdToken();
      const rosterPayload = {}
      if(nameField.value === '') {
        message.error({
                content: `Missing name`,
                duration: 2,
            }); 
      }
      if(phoneField.value === '' || phoneField.value.length < 10 || phoneField.value.length > 12) {
        message.error({
                content: `Missing or invalid phone number`,
                duration: 2,
            });
      }
      else {
        rosterPayload["name"] = toRaw(processName(nameField.value))
        rosterPayload["phone"] = toRaw(phoneField.value)
  
        console.log('rosterPayload', rosterPayload)
        console.log('idToken', idToken)
      const response = await (await fetch(`http://127.0.0.1:5001/wffa25444/us-central1/teamData?api=updateUserProfile&type=addName`, {
        method:'POST',
        body: JSON.stringify(rosterPayload),
        headers:{
            Authorization:"Bearer "+idToken,
            "Content-Type": "application/json"
            }
        }))
        if (response.status === 200) {
            message.success({
              content: 'Thank you!',
              duration: 2,
            }); 
          }
        else { 
              message.error({
                content: `ERROR`,
                duration: 2,
            }); 
         }
        visible.value = false;
      }
    }
    

    const setNamePhone = () => {
      loading.value = false
      visible.value = true;
      modalText.value = `<div style="align: center"><h3>Enter your first name + last name:</h3> <br />`
      modalText2.value = `<br /><div style="align: center"><h3>Enter your phone number (without dashes & parenthesis):</h3> <br />`
    }

    const setPhone = () => {
      loading.value = false
      visible.value = true;
      modalText.value = `<div style="align: center"><h3>Enter your first name + last name:</h3> <br />`
      modalText2.value = `<br /><div style="align: center"><h3>Enter your phone number (without dashes & parenthesis):</h3> 
        Note: <i> Upon clicking OK, you consent to receive text messages from the WFFA team.</i>
        <br />`
    }

    const redirectToOnboarding = () => {
            router.push({
                path: '/onboarding'
            })
    }

    const integrateRulesEngine = () => {
      loading.value = false
      visiblePin.value = true;
      modalPINText.value = `<div style="align: center"><h3>Enter your unique 5-digit PIN:</h3> <br />`
    }

    const processName = (name) => {
      const splitName = name.split(' ');
      let capitalizedName = ``
      splitName.forEach( i => {
        capitalizedName += i.charAt(0).toUpperCase() + i.slice(1) + ' '
      })
      return capitalizedName.trim()

    }

    return {
      completeRoster,
      adminApproval,
      paymentSuccess,
      visible,
      handleSubmission,
      modalText,
      modalText2,
      nameField,
      phoneField,
      loading,
      redirectToOnboarding,
      roleAdmin,
      rulesEngineActive,
      role,
      uniquePIN,
      handlePINSubmission,
      integrateRulesEngine,
      modalPINText,
      visiblePin,
      paymentValue,
      userType,
      setPhone
    };
  },

  components: {
    Menu,
    CashApp,
    Venmo,
    SmileOutlined,
    ClockCircleOutlined,
    FormOutlined,
    DollarCircleOutlined,
    AdminSummary,
    UserHeadlines
},
};
</script>

<style scoped>

img {
    width: 250px;
    height: 200px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.container {
  text-align: center;
  padding: 20px;
}

.logo-container {
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Add more styles as needed */
</style>


