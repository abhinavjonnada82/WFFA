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
        <a-button type="primary" @click="submitResponse(keyId, 'saturday')">Confirm</a-button>
      </a-space>
      </div>
    </div>
  </div>
  <div v-show="type === 'timePicker'">
    <div>
      <h3>{{ question }}</h3>
      <div>
        <a-space>
          <a-time-picker show-time placeholder="Select Time" @change="onChange" @ok="onOk" />
          <a-range-picker
          :show-time="{ format: 'HH:mm',
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')] }"
            format="HH:mm"
            :placeholder="['Start Time', 'End Time']"
            @change="onChange"
            @ok="onOk"
          />
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
import moment from 'moment';
import { computed, ref } from 'vue';

export default {
  props: {
    questionSet: Object,
    currentQuestion: Number,
  },
  setup(props, { emit }) {
    const question = computed(() => props.questionSet.question);
    const options = computed(() => props.questionSet.options);
    const type = computed(() => props.questionSet.type);
    const keyId = computed(() => props.questionSet.keyId);
    const count = computed(() => props.currentQuestion);

    const submitResponse = (keyId, optionSelected) => {
      emit('response-captured', keyId, optionSelected);
    };

    const getDaysChecked = (optionSelected) => {
      console.log('dd', optionSelected)
    };

    const onChange = (value, dateString) => {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
    };
    const onOk = value => {
      console.log('onOk: ', value);
    };

    
    return {
      question,
      options,
      type,
      keyId,
      count,
      submitResponse,
      getDaysChecked,
      checked: ref(false),
      onChange,
      onOk,
      moment
    };
  },
};
</script>
