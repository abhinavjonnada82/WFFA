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
                          <div v-if="initalPaymentSuccess === true">
                              <a-timeline-item color="green">Inital Payment Successful</a-timeline-item>
                              </div>
                              <div v-else>
                                <a-timeline-item color="red">Payment</a-timeline-item>
                            </div>
                        </div>

                        <div v-if="completeRoster === true && adminApproval === true && paymentSuccess === false">
                          <a-timeline-item color="#00CCFF"><router-link to="/payment">
                            <template #dot>
                              <DollarCircleOutlined style="font-size: 16px" />
                            </template>
                              <div v-if="initalPaymentSuccess === true">
                              <p> Make remaining payment $$$</p>
                              </div>
                              <div v-else>
                                <p> Make a payment $$$ </p>
                              </div>
                          </router-link>
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

      <div class="button-container">
        <!-- ... Button Divs ... -->
        <div v-if="roleAdmin === true && rulesEngineActive === true">
          <a-collapse>
              <a-collapse-panel header="Tournament Summary">
                <AdminSummary/>
              </a-collapse-panel>
            </a-collapse>
                <br />
                <a-button type="primary" size="large" disabled>Host a season/tournament</a-button>
              </div>
              <div v-else-if="roleAdmin === true">
                <a-button type="primary" size="large" @click="redirectToOnboarding">Host a season/tournament</a-button>
              </div>
              <div v-else-if="role === 'user' && rulesEngineActive === false && nameField !== ''">
                <a-button type="primary" size="large" @click="integrateRulesEngine">Enter a season/tournament</a-button>
              </div>
              <div v-else-if="role === 'user' && rulesEngineActive === true">
                <a-collapse>
                  <a-collapse-panel header="Tournament Summary">
                    <UserHeadlines />
                  </a-collapse-panel>
                  </a-collapse>
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
      title="Enter a season/tournament"
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
import AdminSummary from '../components/AdminSummary.vue';
import { message } from 'ant-design-vue';
import { SmileOutlined, ClockCircleOutlined, FormOutlined, DollarCircleOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router'
import UserHeadlines from '../components/UserHeadlines.vue';
import { baseAPI } from '../utils';
import { store } from '../store.js';


export default {
  setup() {
      const completeRoster = ref(``);
      const adminApproval = ref(``);
      const paymentSuccess = ref(``);
      const initalPaymentSuccess = ref(``);
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
      getIdToken();
      activityCheckController();
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
            initalPaymentSuccess.value = res.data[0]?.initalPaymentDepositFlag
            roleAdmin.value = res.data[0]?.admin
            userType.value = res.data[0]?.role
            rulesEngineActive.value = res.data[0]?.rulesEngineActive
            role.value = res.data[0]?.role
            store.leaguePayment = parseInt(res.data[0]?.rules?.payment)
            store.initalPaymentSuccessFlag = res.data[0]?.initalPaymentDepositFlag || false
            store.remainingPaymentBalance = res.data[0]?.initalDepositPayment
            localStorage.setItem('leaguePayment', res.data[0]?.rules?.payment)
            localStorage.setItem('PIN', res.data[0]?.rules?.PIN || res.data[0]?.PIN )
            if (res.data[0]?.name === null) { setNamePhoneHtml(); } 
            else if (res.data[0]?.name !== null && res.data[0]?.phone === null) {
              nameField.value = res.data[0]?.name
              setNamePhoneHtml();
            }
            else if (res.data[0]?.name !== null || res.data[0]?.phone !== null) {
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
        const response = await (await fetch(`${baseAPI}teamData?api=updateUserProfile&type=addName`, {
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
              duration: 4,
            }); 
          }
        else { 
              message.error({
                content: `ERROR`,
                duration: 4,
            }); 
         }
        visible.value = false;
      }
    }
    

    const setNamePhoneHtml = () => {
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

    const activityCheckController = () => {
      setTimeout(() => {
            setTimeout(() => {
                  clearLocalStorage();
              }, 5000)
              // Show warning after 20 minutes of no activity & logout.
              message.warning({
                content: `You have been inactive for 20 minutes. You will be logged out in 5 seconds.`,
                duration: 5,
            });
        }, 1200000);
    };

    const clearLocalStorage = () => {
      firebase.auth().signOut();
      delete localStorage.admin;
      delete localStorage.leaguePayment;
      delete localStorage.PIN;
      delete localStorage.records;
      window.location.hash = '#';
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
      setNamePhoneHtml,
      initalPaymentSuccess,
      activityCheckController
    };
  },

  components: {
    Menu,
    SmileOutlined,
    ClockCircleOutlined,
    FormOutlined,
    DollarCircleOutlined,
    AdminSummary,
    UserHeadlines,
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

</style>


