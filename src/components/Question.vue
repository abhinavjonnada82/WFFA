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
        <a-button type="primary" @click="processDayChecked(keyId, option)">Confirm</a-button>
      </a-space>
      </div>
    </div>
  </div>
  <div v-show="type === 'timePicker'">
    <div>
      <h3>{{ question }}</h3>
      <div>
        <label>Day {{ index + 1 }}: </label>
        <vue-timepicker v-model="start_time" placeholder="Start Time" @change="logSelectedTimeRange"></vue-timepicker>
        <span> to </span>
        <vue-timepicker v-model="end_time" placeholder="End Time"  @change="logSelectedTimeRange"></vue-timepicker>
        <a-space>
        
      </a-space>
      <br />
      <a-space>
        <a-button type="primary" @click="logSelectedTimeRange(keyId)">Confirm</a-button>
      </a-space>
      </div>
    </div>
  </div>
  <div v-show="type === 'maps'">
    <div>
      <h3>{{ question }}</h3>
      <div>
        <a-space>
          
      </a-space>
      <br />
      <a-space>
        <a-button type="primary" @click="submitResponse(keyId, '4:00p')">Confirm</a-button>
      </a-space>
      </div>
    </div>
  </div>
  <div v-show="type === 'maps'">
    <div>
      <h3>{{ question }}</h3>
      <div>
        <a-space>
          
      </a-space>
      <br />
      <a-space>
        <a-button type="primary" @click="submitResponse(keyId, '4:00p')">Confirm</a-button>
      </a-space>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import VueTimePicker from "vue3-timepicker";
import "vue3-timepicker/dist/VueTimepicker.css";

export default {
  components: {
    "vue-timepicker": VueTimePicker,
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
    const storeDays = ref([])

    const submitResponse = (keyId, optionSelected) => {
      emit('response-captured', keyId, optionSelected);
    };

    const getDaysChecked = (optionSelected) => {
      storeDays.value.push(optionSelected)
      console.log('dd', optionSelected)
    };

    const processDayChecked = (keyId) => {
      console.log('iffff', storeDays.value)
      submitResponse(keyId, storeDays.value)

    }

    const logSelectedTimeRange = (keyId) => {
      console.log('selectedTimeRange', start_time.value)
      console.log('cccc', end_time.value)
      const storeTimeOptions = [start_time.value, end_time.value]
      submitResponse(keyId, storeTimeOptions)
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
      end_time

    };
  },
};
</script>
