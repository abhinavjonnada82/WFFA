<template>

    <div>
      <form id="payment-form">
        <div id="paypal-button-container"></div>
      </form>
    </div>
    <div id="payment-status-container"></div>
</template>


<script>
import { onBeforeMount } from 'vue';
import { loadScript } from '@paypal/paypal-js';
import firebase from "firebase/app"
import 'firebase/auth';
import { message } from 'ant-design-vue';
// import { baseAPI } from '../utils';

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
                            return fetch(`http://127.0.0.1:5001/wffa25444/us-central1/paymentPivot/create-paypal-order`, {
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
                            return fetch(`http://127.0.0.1:5001/wffa25444/us-central1/paymentPivot/capture-paypal-order`, {
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
                                        content: 'Payment Success! Your receipt will be available to you shortly via text.',
                                        duration: 10,
                                    });
                                    displayPaymentResults('SUCCESS');
                                alert(
                                    `Transaction ${transaction.status}: ${transaction.id}\n\n`
                                );
                                //location.reload();
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

        const displayPaymentResults = (status) => {
            const statusContainer = document.getElementById('payment-status-container');
            if (status === 'SUCCESS') {
            statusContainer.classList.remove('is-failure');
            statusContainer.classList.add('is-success');
            } else {
            statusContainer.classList.remove('is-success');
            statusContainer.classList.add('is-failure');
            }
            statusContainer.style.visibility = 'visible';
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
    #payment-status-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    width: 0px;
    height: 0px;
    visibility: hidden;
    }

    #payment-status-container.is-success:before {
    content: '';
    background-color: #00b23b;
    width: 16px;
    height: 16px;
    margin-right: 16px;
    -webkit-mask: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7071 6.70711C12.0968 6.31744 12.0978 5.68597 11.7093 5.29509C11.3208 4.90422 10.6894 4.90128 10.2973 5.28852L11 6C10.2973 5.28852 10.2973 5.28853 10.2973 5.28856L10.2971 5.28866L10.2967 5.28908L10.2951 5.29071L10.2886 5.29714L10.2632 5.32224L10.166 5.41826L9.81199 5.76861C9.51475 6.06294 9.10795 6.46627 8.66977 6.90213C8.11075 7.4582 7.49643 8.07141 6.99329 8.57908L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E");
    mask: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7071 6.70711C12.0968 6.31744 12.0978 5.68597 11.7093 5.29509C11.3208 4.90422 10.6894 4.90128 10.2973 5.28852L11 6C10.2973 5.28852 10.2973 5.28853 10.2973 5.28856L10.2971 5.28866L10.2967 5.28908L10.2951 5.29071L10.2886 5.29714L10.2632 5.32224L10.166 5.41826L9.81199 5.76861C9.51475 6.06294 9.10795 6.46627 8.66977 6.90213C8.11075 7.4582 7.49643 8.07141 6.99329 8.57908L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E");
    }

    #payment-status-container.is-success:after {
    content: 'Payment successful';
    font-size: 14px;
    line-height: 16px;
    }

    #payment-status-container.is-failure:before {
    content: '';
    background-color: #cc0023;
    width: 16px;
    height: 16px;
    margin-right: 16px;
    -webkit-mask: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L6.58579 8L4.29289 10.2929C3.90237 10.6834 3.90237 11.3166 4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071L8 9.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L9.41421 8L11.7071 5.70711C12.0976 5.31658 12.0976 4.68342 11.7071 4.29289C11.3166 3.90237 10.6834 3.90237 10.2929 4.29289L8 6.58579L5.70711 4.29289Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E%0A");
    mask: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L6.58579 8L4.29289 10.2929C3.90237 10.6834 3.90237 11.3166 4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071L8 9.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L9.41421 8L11.7071 5.70711C12.0976 5.31658 12.0976 4.68342 11.7071 4.29289C11.3166 3.90237 10.6834 3.90237 10.2929 4.29289L8 6.58579L5.70711 4.29289Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E%0A");
    }

    #payment-status-container.is-failure:after {
    content: 'Payment failed';
    font-size: 14px;
    line-height: 16px;
    }

    #afterpay-button {
    height: 40px;
    }


</style>