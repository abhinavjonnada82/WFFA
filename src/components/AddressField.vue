 <template>
  <div>
    <GMapAutocomplete
                placeholder="Start typing" 
                @place_changed="getAddressData"
                :options="{
                          strictBounds: true,
                          country: 'us'
                      }"
              > 
              </GMapAutocomplete>
    <br />
    <h3>Address: {{ address }}</h3>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {

  emits: ['address'],
  setup(props, { emit }) {
    const address = ref('');

    const getAddressData = (placeResultData) => {
      address.value =  placeResultData.formatted_address
      emit('address', address.value);
    };

    return {
      address,
      getAddressData,
    };
  },
};
</script>
