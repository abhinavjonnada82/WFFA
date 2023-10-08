<template>
    <div>
      <form id="payment-form">
        <a-spin :spinning="spinning">
            <div id="paypal-button-container"></div>
        </a-spin>
      </form>
    </div>
</template>


<script>
import { onBeforeMount, inject, ref } from 'vue';
import { loadScript } from '@paypal/paypal-js';
import firebase from "firebase/app"
import 'firebase/auth';
import { message } from 'ant-design-vue';
import { baseAPI, roundInitalPayment } from '../utils';
import { store } from '../store';
import { useRouter } from 'vue-router'

export default {
    name: 'Venmo',
    setup() {
        let paypal = ``
        const auth = firebase.auth();
        let payment = ``
        const paymentMethod = store.paymentMethod
        const swal = inject('$swal');
        const router = useRouter();
        const spinning = ref(false);

        if (paymentMethod === `initalDeposit`) { 
            payment = roundInitalPayment(store.leaguePayment)
        }
        else {
            payment = store.leaguePayment
        }
        
        onBeforeMount(async () => {
            spinning.value = true;
            paypal = await loadUpVenmo();
            if (!paypal) {
                alert('Failed to load venmo')
                return
            }
            triggerVenmoProcess(paypal);
        });

        const loadUpVenmo = async () => {
            try {
                return await loadScript({ clientId: "AZtjAieDZAoK4D4B53C1l9ZtKYXYdMb3WLMd7TZIxRpa9-MEXMWeLy4D8BfneRrbE9h95e0di0yMDYeB", 
                                            enableFunding: "venmo", disableFunding: ['paylater', 'card', 'credit']});
                } 
            catch (error) {
                console.error("failed to load the PayPal JS SDK script", error);
            }
        }

        const triggerVenmoProcess = async (paypal) => {
            const user = auth.currentUser;
            const idToken = await user.getIdToken();
            if (paypal) {
                try {
                    await paypal.Buttons({
                        createOrder: () => {
                            return fetch(`${baseAPI}paymentPivot/create-paypal-order`, {
                                method: "POST",
                                headers: {
                                    Authorization:"Bearer "+idToken,
                                    "Content-Type": "application/json",
                                },
                                body:  JSON.stringify({
                                   payment: payment
                                }),
                            })
                                .then((response) => response.json())
                                .then((order) => order.id);
                        },
                        onApprove: (data) => {
                            return fetch(`${baseAPI}paymentPivot/capture-paypal-order`, {
                                method: "POST",
                                headers: {
                                    Authorization:"Bearer "+idToken,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    orderID: data.orderID,
                                    paymentMethod,
                                    payment
                                }),
                            })
                            .then((response) => response.json())
                                .then((orderData) => {
                                    orderData.purchase_units[0].payments.captures[0];
                                    swal.fire({
                                        title: '<strong>Payment Success</strong>',
                                        icon: 'success',
                                        html: `Payment Successful! Your receipt will be available to you shortly via text.`,
                                        footer: `Note: <b><i>Please wait for 5-10 seconds or reload your page to see your updated payment timeline.</b></i>`,
                                        showCloseButton: false,
                                        showCancelButton: false,
                                        confirmButtonText: 'Back to Home 🏠',
                                        confirmButtonClass: 'custom-button-class',
                                        allowOutsideClick: false,
                                    }).then((result) => {
                                            if (result.isConfirmed) {
                                                router.push({path: '/'})
                                                swal.fire(
                                                    '',
                                                    'Refresh your browser if your payment timeline does not update within the next 5-10 seconds.',
                                                    'info'
                                                )
                                                setTimeout(() => {
                                                    window.location.reload();
                                                }, 8000);
                                            
                                            } 
                                            })
                                        });
                                            },
                    }).render("#paypal-button-container");
                    spinning.value = false;
                } 
                catch (error) {
                    console.error("failed to render the PayPal Buttons", error);
                    const error_msg = error.message
                    if(error_msg.match('already rendered')){
                        message.error({
                            content: 'Reload your browser page to re-enable Venmo/PayPal.',
                            duration: 15,
                        });
                    }
                }
            } 
            else {
                message.error({
                  content: 'Error!',
                  duration: 5,
              });
                console.log('Error!')
            }
        }
        return {
            spinning
        };
    },
    };
</script>

<style>

    #payment-form {
        max-width: 550px;
        min-width: 300px;
        margin: 150px auto;
        margin-top: -130px;
        margin-bottom: -10px;
    }

</style>