<template>
  <div v-show="type === 'button'">
    <div>
      <h3>{{ question }}</h3>
      <div>
        <a-space>
          <a-button v-for="(option, index) in options" :key="index" :value="option" @click="submitResponse(keyId, option)">
            {{ option }}
          </a-button>
        </a-space>
        <br/>
          <a-space>
            <div id="space-above">
              <a-button danger @click="goBack('leagueType', '')">Back</a-button>
            </div>
          </a-space>
      </div>
    </div>
  </div>
  <div v-show="type === 'checkbox'">
    <div>
      <h3>{{ question }}</h3>
      <div>
        <a-space>
          <a-checkbox @change="getDaysChecked(option)" v-for="(option, index) in options" :key="index" :options="options">
            {{ option }}
          </a-checkbox> 
        </a-space>
        <br />
      <a-space>
        <div id="space-above">
          <a-button danger @click="goBack('leagueType', '')">Back</a-button>
          <a-button type="primary" @click="processDayChecked(keyId, option)" style="margin-left: 10px">Confirm</a-button>
        </div>
      </a-space>
      </div>
    </div>
  </div>
  <div v-show="type === 'timePicker'">
    <div>
      <h3>{{ question }}</h3>
      <div>
        <label>From: </label>
        <vue-timepicker format="hh:mm A" v-model="start_time" placeholder="Start Time" @change="logSelectedTimeRange" required></vue-timepicker>
        <span> To: </span>
        <vue-timepicker format="hh:mm A" v-model="end_time" placeholder="End Time"  @change="logSelectedTimeRange" required></vue-timepicker>
        <a-space>
        
      </a-space>
      <br />
      <a-space>
        <div id="space-above">
          <a-button danger @click="goBack('leagueType', '')">Back</a-button>
          <a-button type="primary" @click="logSelectedTimeRange(keyId)" style="margin-left: 10px">Confirm</a-button>
        </div>
      </a-space>
      </div>
    </div>
  </div>
  <div v-show="type === 'maps'">
    <div>
      <h3>{{ question }}</h3>
      <div>
        <a-space>
          <AddressField @address="handleAddressResponse"/>
        </a-space>
      <br />
      <a-space>
        <div id="space-above">
          <a-button danger @click="goBack('tournamentDays', '')">Back</a-button>
          <a-button type="primary" @click="submitResponse(keyId, addressResponse)" style="margin-left: 10px">Confirm</a-button>
        </div>
      </a-space>
      </div>
    </div>
  </div>
  <div v-show="type === 'datePicker'">
    <div>
      <h3>{{ question }}</h3>
      <div>
        <a-space>
          <VueDatePicker v-model="registrationDates" range multi-calendars @change="logSelectedDateRange" :alt-position="customPosition"/>
      </a-space>
      <br />
            <h3><b>Registration Dates:</b> {{ registrationDates[0] }} - {{ registrationDates[1] }}</h3>
      <br />
      <a-space>
        <div id="space-above">
          <a-button danger @click="goBack('gameTime', '')">Back</a-button>
          <a-button type="primary" @click="logSelectedDateRange(keyId)" style="margin-left: 10px">Confirm</a-button>
        </div>
      </a-space>
      </div>
    </div>
  </div>
  
  <div v-show="type === 'numberSlider'">
    <div>
      <h3>{{ question }}</h3>
      <div>
        <a-space>
          <a-row>
          <a-col :span="12">
            <a-slider v-model:value="rosterValue" :min="1" :max="20" />
          </a-col>
          <a-col :span="4">
            <a-input-number v-model:value="rosterValue" :min="1" :max="20" style="margin-left: 16px" required/>
          </a-col>
        </a-row>
      </a-space>
      <br />
      <a-space>
        <div id="space-above">
          <a-button danger @click="goBack('gameLocation', '')">Back</a-button>
          <a-button type="primary" @click="getRosterLimit(keyId)" style="margin-left: 10px">Confirm</a-button>
        </div>
      </a-space>
      </div>
    </div>
  </div>

  <div v-show="type === 'inputBox'">
    <div>
      <h3>{{ question }}</h3>
      <div>
        <a-space>
          <a-input v-model:value="paymentLimit" prefix="$" suffix="USD" required/>
      </a-space>
      <br />
      <a-space>
        <div id="space-above">
          <a-button danger @click="goBack('registrationDates', '')">Back</a-button>
          <a-button type="primary" @click="getPayment(keyId)" style="margin-left: 10px">Confirm</a-button>
        </div>
      </a-space>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import VueTimePicker from "vue3-timepicker";
import "vue3-timepicker/dist/VueTimepicker.css";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { message } from 'ant-design-vue';
import AddressField from './AddressField.vue';

export default {
  components: {
    "vue-timepicker": VueTimePicker,
    VueDatePicker,
    AddressField
  },
  props: {
    questionSet: Object,
    index: Number,
  },
  emits: ["response-captured"],
  setup(props, { emit }) {
    const question = computed(() => props.questionSet.question);
    const options = computed(() => props.questionSet.options);
    const type = computed(() => props.questionSet.type);
    const keyId = computed(() => props.questionSet.keyId);
    const count = computed(() => props.index);
    const start_time = ref('')
    const end_time = ref('')
    const registrationDates = ref('')
    const storeDays = ref([])
    const rosterValue = ref(1);
    const paymentLimit = ref('');
    const addressResponse = ref('');
    const customPosition = () => ({ top: 0, left: 0 });

    const submitResponse = (keyId, optionSelected) => {
      emit('response-captured', keyId, optionSelected);
    };

    const getDaysChecked = (optionSelected) => {
      storeDays.value.push(optionSelected);
      if (storeDays.value.length === 0) {
        warningMessage();
      }
    };

    const processDayChecked = (keyId) => {
      submitResponse(keyId, storeDays.value);
    }

    const logSelectedTimeRange = (keyId) => {
      if (start_time.value || end_time.value) {
        const storeTimeOptions = [start_time.value, end_time.value]
        submitResponse(keyId, storeTimeOptions);
      }
      else {
        warningMessage(); 
      }
    };

    const logSelectedDateRange = (keyId) => {
      if (registrationDates.value[0] || registrationDates.value[1]) {
        const storeDateOptions = [registrationDates.value[0], registrationDates.value[1]];
        submitResponse(keyId, storeDateOptions)
      }
      else {
        warningMessage();
      }
    }

    const getRosterLimit = (keyId) => {
      if (rosterValue.value) {
        submitResponse(keyId, rosterValue.value)
      }
      else {
        warningMessage();
      }
    }

    const getPayment = (keyId) => {
      if (paymentLimit.value) {
        submitResponse(keyId, paymentLimit.value)
      }
      else {
        warningMessage();
      }
    }

    const warningMessage = () => {
      message.warning({
                        content: `Missing fields`,
                        duration: 2,
            }); 
    }

    const goBack = (keyId) => {
      emit('response-captured', keyId)
    }

    const handleAddressResponse = (response) => {
      addressResponse.value = response;
    };


    return {
      question,
      options,
      type,
      keyId,
      count,
      submitResponse,
      getDaysChecked,
      processDayChecked,
      checked: ref(false),
      logSelectedTimeRange,
      timeFormat: "hh:mm:ss a",
      start_time,
      end_time,
      registrationDates,
      logSelectedDateRange,
      rosterValue,
      getRosterLimit,
      getPayment,
      paymentLimit,
      goBack,
      handleAddressResponse,
      addressResponse,
      customPosition

    };
  },
};
</script>

<style>
  #space-above {
    margin-top:10px;
  }
</style>