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

    <!-- <div>
      <p>Emitted Value: {{ emittedValue }}</p>
    </div>      -->
</template>

<script>

import { defineComponent } from 'vue';
import Menu from '../components/Menu.vue';
import Question from '../components/Question.vue';
import { ref } from 'vue';

export default defineComponent({
  components: {
    Menu,
    Question
  },
  data() {

    const currentQuestion = ref(0);
    const responses = ref({});
    const emittedValue = ref('');
    const questionSet = ref({
      question: 'Hosting a Season or Tournament?',
      options: ['Season', 'Tournament'],
      type: 'button',
      keyId: 'leagueType',
      response: '',
    });

    const getResponseCaptured = (keyId, responseCaptured) => {
     // this.responses[key] = value
      if (keyId === 'leagueType' && responseCaptured === 'Tournament') {
        console.log('vaxx', keyId)
        console.log('vaxsssssx', responseCaptured)
        emittedValue.value = 'tournamentQ1';
        currentQuestion.value += 1;
        questionSet.value.question = 'Choose format?';
        questionSet.value.options = ['5 Man No Contact', '5 Man Screen', '7 Man No Contact', '7 Man Screen'];
        questionSet.value.type = 'button';
        questionSet.value.keyId = 'tournamentFormat';
        questionSet.value.response = '';
      }
      if (keyId === 'tournamentFormat') {
        console.log('tournamentQ2', keyId)
        console.log('vatournamentQ2dxsssssx', responseCaptured)
        emittedValue.value = 'tournamentQ2';
        currentQuestion.value += 1;
        questionSet.value.question = 'Choose elmination format?';
        questionSet.value.options = [ "Round Robin",
                    "Single Elmination",
                    "Double Elmination"];
        questionSet.value.type = 'button';
        questionSet.value.keyId = 'elminationFormat';
        questionSet.value.response = '';
      }
      if (keyId === 'elminationFormat') {
        console.log('elminationFormat', keyId)
        console.log('elminationFormatdxsssssx', responseCaptured)
        emittedValue.value = 'tournamentQ3';
        currentQuestion.value += 1;
        questionSet.value.question = "Pick tournament days?",
        questionSet.value.options = [
                    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                ],
        questionSet.value.type = 'checkbox';
        questionSet.value.keyId = 'tournamentDays';
        questionSet.value.response = '';
      }
      if (keyId === 'tournamentDays') {
        console.log('tournamentDays', keyId)
        console.log('elmintournamentDaysFssx', responseCaptured)
        emittedValue.value = 'tournamentQ4';
        currentQuestion.value += 1;
        questionSet.value.question =  "Set game start & end time?"
        questionSet.value.options = [  ],
        questionSet.value.type = 'timePicker';
        questionSet.value.keyId = 'gameTime';
        questionSet.value.response = '';
      }
      if (keyId === 'gameTime') {
        console.log('gameTime', keyId)
        console.log('gameTimeysFssx', responseCaptured)
        emittedValue.value = 'tournamentQ5';
        currentQuestion.value += 1;
        questionSet.value.question =  "Select game location?"
        questionSet.value.options = [  ],
        questionSet.value.type = 'maps';
        questionSet.value.keyId = 'gameLocation';
        questionSet.value.response = '';
      }
      if (keyId === 'gameLocation') {
        console.log('gameLocation', keyId)
        console.log('ggameLocationsFssx', responseCaptured)
        emittedValue.value = 'tournamentQ6';
        currentQuestion.value += 1;
        questionSet.value.question = "Registration start & end dates?"
        questionSet.value.options = [  ],
        questionSet.value.type = 'datePicker';
        questionSet.value.keyId = 'registrationDates';
        questionSet.value.response = '';
      }
      if (keyId === 'registrationDates') {
        console.log('registrationDates', keyId)
        console.log('ggregistrationDatesssx', responseCaptured)
        emittedValue.value = 'tournamentQ7';
        currentQuestion.value += 1;
        questionSet.value.question = "Set roster limit?"
        questionSet.value.options = [  ],
        questionSet.value.type = 'numberSlider';
        questionSet.value.keyId = 'rosterLimit';
        questionSet.value.response = '';
      }
      if (keyId === 'rosterLimit') {
        console.log('rosterLimit', keyId)
        console.log('ggrrosterLimitnDatesssx', responseCaptured)
        emittedValue.value = 'tournamentQ8';
        currentQuestion.value += 1;
        questionSet.value.question = "Set payment?"
        questionSet.value.options = [  ],
        questionSet.value.type = 'inputBox';
        questionSet.value.keyId = 'payment';
        questionSet.value.response = '';
      }
    };

    return {
        currentQuestion,
        responses,
        emittedValue,
        questionSet,
        getResponseCaptured
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