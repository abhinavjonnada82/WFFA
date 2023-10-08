const depositPayment = BigInt(Math.round(req.body.payment));
<template>
    <div id="app">
       <Menu />
            <img alt="logo" src="../assets/logo.png">
            <h1><b>Payment</b></h1> 
            <div v-if="initalPaymentSuccessFlag === false">
                <h2>Would you like to pay initial deposit or full amount?</h2>
                <a-radio-group v-model:value="value">
                    <a-radio :value="1" :disabled="disabled">Inital Deposit ${{  Math.round(parseInt(store.leaguePayment) * 0.333) }}</a-radio>
                    <a-radio :value="2" :disabled="disabled">Full Amount ${{ store.leaguePayment }}</a-radio>
                </a-radio-group>
                <br />
                <br />
                <a-button type="primary" :disabled="disabled" @click="loadUpPayment">Submit</a-button>
                <br />
            <br />
            </div>
            <div v-else>
                <h2>Pay remaining amount ${{ remainingPaymentBalance }}?</h2>
            </div>
            <br />
            <br />
            <div v-if="enablePayment === true">
                    <CashApp />
                    <Venmo />
            </div>
            <br />
            <br />
            <a-button type="dashed" @click="backToHome">Back to Home 🏠</a-button>
            </div>

    </template>
    

    <script>
    
    import Menu from '../components/Menu.vue';
    import { onMounted, onBeforeUnmount, ref } from 'vue';
    import CashApp from '../components/CashApp.vue';
    import Venmo from '../components/Venmo.vue';
    import { store } from '../store.js';
    import { useRouter } from 'vue-router'
    import { roundInitalPayment } from '../utils.js'
    
    export default {
      setup() {

        const error = ref(null);
        const loading = ref(true);
        const admin = ref(false);
        const enablePayment = ref(false);
        const visible = ref(false);
        const value = ref(1);
        const disabled = ref(false);
        const router = useRouter();
        const initalPaymentSuccessFlag = ref(false);
        const remainingPaymentBalance = ref(0);
    
        onMounted(() =>  {
            redirectToHome();
            setRemainingPayment();
            window.addEventListener("beforeunload", handleBeforeUnload);
        })

        // Add an event listener for beforeunload
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "Are you sure you want to leave this page?";
            // Redirect the user to the homepage
            window.location.href = "/";
        };

        onBeforeUnmount(() => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        });
        
        const loadUpPayment = () => {
            disabled.value = !disabled.value;
            if (value.value === 1) { store.paymentMethod = 'initalDeposit' }
            else if (value.value === 2) { store.paymentMethod = 'fullAmount' }
            enablePayment.value = true
        }

        const setRemainingPayment = () => {
            initalPaymentSuccessFlag.value = store.initalPaymentSuccessFlag
            remainingPaymentBalance.value = parseInt(store.leaguePayment) - parseInt(store.remainingPaymentBalance) || 0
            if (initalPaymentSuccessFlag.value === true) {
                enablePayment.value = true
                store.paymentMethod = 'fullAmount'
                store.leaguePayment = parseInt(store.leaguePayment) - parseInt(store.remainingPaymentBalance)
            }
        }

        const redirectToHome = () => { if (store.leaguePayment == 0)  router.push({ path: '/' }) }
        
        const backToHome = () => router.push({path: '/'})

        return {
          error,
          loading,
          visible,
          admin,
          value,
          loadUpPayment,
          disabled,
          enablePayment,
          store,
          backToHome,
          initalPaymentSuccessFlag,
          remainingPaymentBalance,
          roundInitalPayment
        };
      },
    
      components: {
        Menu,
        CashApp,
        Venmo
      },
    };
    </script>
    
    
    <style scoped>
    img {
        width: 220px;
        height: 180px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    
    </style>
