<template>
    <div>
      <form id="payment-form">
        <div id="paypal-button-container"></div>
      </form>
    </div>
</template>


<script>
import { onBeforeMount } from 'vue';
import { loadScript } from '@paypal/paypal-js';
import firebase from "firebase/app"
import 'firebase/auth';
import { message } from 'ant-design-vue';
import { baseAPI } from '../utils';

export default {
    name: 'Venmo',
    setup() {
        let paypal = ``
        const auth = firebase.auth();
        const payment = localStorage.getItem('payment')
        onBeforeMount(async () => {
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
                                }),
                            })
                                .then((response) => response.json())
                                .then((orderData) => {
                                const transaction =
                                    orderData.purchase_units[0].payments.captures[0];
                                    message.success({
                                        content: 'Payment Success!',
                                        duration: 2,
                                    });
                                alert(
                                    `Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`
                                );
                                });
                            },
                    }).render("#paypal-button-container");
                } 
                catch (error) {
                    console.error("failed to render the PayPal Buttons", error);
                }
            } 
            else {
                console.log('Error!')
            }
        }
        return {};
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