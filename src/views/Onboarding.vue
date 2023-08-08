<template>
    <Menu />
    <img alt="logo" src="../assets/logo.png">
   
        <h1><b>Set up your next sports event</b></h1>

        <transition name="fade" mode="out-in">
            <div>
                <Question
                  @response-captured="getResponseCaptured"
                  :questionSet="questionSet"
                  :index="currentQuestion"
                  />
            </div>
        </transition>

        <a-modal
          v-model:visible="visible"
          title="Confirm Onboarding?"
          width="100%"
          wrap-class-name="full-modal"
          @ok="handleSubmission"
        >
      <div v-html="modalText"></div>
    </a-modal>

</template>

<script>

import { defineComponent, onBeforeMount } from 'vue';
import Menu from '../components/Menu.vue';
import Question from '../components/Question.vue';
import { ref } from 'vue';
import { getUserInfo } from '../utils.js';
import firebase from "firebase/app"
import 'firebase/auth';
import { message } from 'ant-design-vue';

const auth = firebase.auth();

export default defineComponent({
  components: {
    Menu,
    Question
  },
  data() {
    const currentQuestion = ref(0);
    const emittedValue = ref('');
    const questionSet = ref({
      question: 'Hosting a Season or Tournament?',
      options: ['Season', 'Tournament'],
      type: 'button',
      keyId: 'leagueType',
      response: '',
    });
    const onboardingResponse = ref({});
    const modalText = ref('default');
    const visible = ref(false);
    const rulesResponse = ref({});
    const userId = ref('');

    onBeforeMount(() => {
      getUserProfileInfo();
    })

    const getResponseCaptured = (keyId, responseCaptured, index) => {
      if (keyId === 'leagueType' && responseCaptured === 'Tournament') {
        emittedValue.value = 'tournamentQ1';
        currentQuestion.value += 1;
        questionSet.value.question = 'Choose format?';
        questionSet.value.options = ['5 Man No Contact', '5 Man Screen', '7 Man No Contact', '7 Man Screen'];
        questionSet.value.type = 'button';
        questionSet.value.keyId = 'tournamentFormat';
        questionSet.value.response = responseCaptured;
        onboardingResponse.value[keyId] = responseCaptured;
      }
      if (keyId === 'tournamentFormat') {
        emittedValue.value = 'tournamentQ2';
        currentQuestion.value += 1;
        questionSet.value.question = 'Choose elmination format?';
        questionSet.value.options = [ "Round Robin",
                    "Single Elmination",
                    "Double Elmination"];
        questionSet.value.type = 'button';
        questionSet.value.keyId = 'elminationFormat';
        questionSet.value.response = responseCaptured;
        onboardingResponse.value[keyId] = responseCaptured;
      }
      if (keyId === 'elminationFormat') {
        emittedValue.value = 'tournamentQ3';
        currentQuestion.value += 1;
        questionSet.value.question = "Pick tournament days?",
        questionSet.value.options = [
                    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                ],
        questionSet.value.type = 'checkbox';
        questionSet.value.keyId = 'tournamentDays';
        questionSet.value.response = responseCaptured;
        onboardingResponse.value[keyId] = responseCaptured;
      }
      if (keyId === 'tournamentDays') {
        emittedValue.value = 'tournamentQ4';
        currentQuestion.value += 1;
        questionSet.value.question =  "Set game start & end time?"
        questionSet.value.options = [  ],
        questionSet.value.type = 'timePicker';
        questionSet.value.keyId = 'gameTime';
        questionSet.value.response = responseCaptured;
        onboardingResponse.value[keyId] = responseCaptured;
      }
      if (keyId === 'gameTime') {
        emittedValue.value = 'tournamentQ5';
        currentQuestion.value += 1;
        questionSet.value.question =  "Select game location?"
        questionSet.value.options = [  ],
        questionSet.value.type = 'maps';
        questionSet.value.keyId = 'gameLocation';
        questionSet.value.response = responseCaptured;
        onboardingResponse.value[keyId] = responseCaptured;
      }
      if (keyId === 'gameLocation') {
        emittedValue.value = 'tournamentQ6';
        currentQuestion.value += 1;
        questionSet.value.question = "Registration start & end dates?"
        questionSet.value.options = [  ],
        questionSet.value.type = 'datePicker';
        questionSet.value.keyId = 'registrationDates';
        questionSet.value.response = responseCaptured;
        onboardingResponse.value[keyId] = responseCaptured;
      }
      if (keyId === 'registrationDates') {
        emittedValue.value = 'tournamentQ7';
        currentQuestion.value += 1;
        questionSet.value.question = "Set roster limit?"
        questionSet.value.options = [  ],
        questionSet.value.type = 'numberSlider';
        questionSet.value.keyId = 'rosterLimit';
        questionSet.value.response = responseCaptured;
        onboardingResponse.value[keyId] = responseCaptured;
      }
      if (keyId === 'rosterLimit') {
        emittedValue.value = 'tournamentQ8';
        currentQuestion.value = index;
        questionSet.value.question = "Set payment?"
        questionSet.value.options = [  ],
        questionSet.value.type = 'inputBox';
        questionSet.value.keyId = 'payment';
        questionSet.value.response = responseCaptured;
        onboardingResponse.value[keyId] = responseCaptured;
      }
      if (keyId === 'payment') {
        emittedValue.value = 'tournamentQ9';
        currentQuestion.value += 1;
        questionSet.value.question = "Set payment?"
        questionSet.value.options = [  ],
        questionSet.value.type = 'inputBox';
        questionSet.value.keyId = 'payment';
        questionSet.value.response = responseCaptured;
        onboardingResponse.value[keyId] = responseCaptured;
        visible.value = true;
        rulesResponse.value = onboardingResponse.value
        modalText.value = `<div style="align: center"><h3>Onboarding Selection </h3> 
                          <p>${JSON.stringify(onboardingResponse.value)}</p>`

      }
    };

    const getUserProfileInfo = async () => {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const userInfo = await getUserInfo(token);
      userId.value = userInfo.data[0].uid
    }

    const handleSubmission = async () => {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      rulesResponse.value['userId'] = userId.value;
      rulesResponse.value['PIN'] = Math.floor(10000 + Math.random() * 90000);
      console.log('rulesResponse.value', rulesResponse.value)
      const rosterPayload = { "rules": rulesResponse.value}
      rosterPayload["userId"] = userId.value
      console.log('token', token)
      console.log('rosterPayload', JSON.stringify(rosterPayload))
      const response = await (await fetch(`https://us-central1-wffa25444.cloudfunctions.net/teamData?api=rulesEngine`, {
        method:'POST',
        body: JSON.stringify(rosterPayload),
        headers:{

            Authorization:"Bearer "+token,
            "Content-Type": "application/json"
            }
        }))
        if (response.status === 200) {
            message.success({
              content: 'Saved!',
              duration: 2,
            });
            location.replace(window.location.origin + `/`); //  direct user to team roster & disable signup
          
          }
        else { 
              message.error({
                        content: `ERROR`,
                        duration: 2,
            }); 
        }
      visible.value = false;
    }



    return {
        currentQuestion,
        emittedValue,
        questionSet,
        getResponseCaptured,
        visible,
        modalText,
        handleSubmission
    }
  }
});
</script>

<style>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>