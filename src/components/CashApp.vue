<template>
  <div id="payment-status-container"></div>
  <div>
    <form id="payment-form">
      <div id="cash-app-pay"></div>
    </form>
  </div>
</template>

<script>
import { onBeforeMount } from 'vue';
import firebase from "firebase/app"
import 'firebase/auth';
import { message } from 'ant-design-vue';
// import { baseAPI } from '../utils.js'

export default {
  name: 'CashApp',
  props: {
  },
  setup() {
    const appId = 'sandbox-sq0idb-mqU225mXO2Va1qKGI1P1cg';
    const locationId = 'LR72E4C5EYMQ6';
    const auth = firebase.auth();

    onBeforeMount(async () => {
        const response = await loadUpSquare();
        if(!response) {
            alert('Failed to load square script')
            return
        }
       triggerCashAppProcess()
    })

    const loadUpSquare = async () => {
        return new Promise(resolve => {
            const script = document.createElement('script')
            script.src = `https://sandbox.web.squarecdn.com/v1/square.js`
            script.id = "square-cdn";
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script)
        })

    }

    const initializeCashApp = async (payments) => {
        const paymentRequest = buildPaymentRequest(payments);
        const cashAppPay = await payments.cashAppPay(paymentRequest, {
          redirectURL: window.location.href,
        });
        const buttonOptions = {
          shape: 'semiround',
          width: 'full',
        };
        await cashAppPay.attach('#cash-app-pay', buttonOptions);
        return cashAppPay;
    }

    const buildPaymentRequest = (payments) => {
        const paymentRequest = payments.paymentRequest({
          countryCode: 'US',
          currencyCode: 'USD',
          total: {
            amount: localStorage.getItem('payment'),
            label: 'Total',
          },
        });
        return paymentRequest;
    }

    const createPayment = async (paymentToken) => {
      const user = auth.currentUser;
      const idToken = await user.getIdToken();
      const body = JSON.stringify({
        locationId,
        sourceId: paymentToken,
        payment: localStorage.getItem('payment')
      });
        const response =  await fetch(`http://127.0.0.1:5001/wffa25444/us-central1/paymentPivot/cashapp-payment`, {
            method: 'POST',
            headers: {
                Authorization:"Bearer "+idToken,
                'Content-Type': 'application/json',
            },
            body,
            });
            if (response.ok) {
              message.success({
                content: 'Payment Success! Your receipt will be available to you shortly via text.',
                duration: 10,
            });
              return response.json();
            }
            const errorBody = await response.text();
            throw new Error(errorBody);
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


    const triggerCashAppProcess = async () => {
        if (!window.Square)  throw new Error('Square.js failed to load properly');
        let payments;
        try {
          payments = window.Square.payments(appId, locationId);
        } 
        catch {
          const statusContainer = document.getElementById('payment-status-container');
          statusContainer.className = 'missing-credentials';
          statusContainer.style.visibility = 'visible';
          return;
        }

        let cashAppPay;
        try {
          cashAppPay = await initializeCashApp(payments);
        } catch (e) {
          console.error('Initializing Cash App Pay failed', e);
        }
        if (cashAppPay) {
          cashAppPay.addEventListener('ontokenization',
            async function ({ detail }) {
              const tokenResult = detail.tokenResult;
              if (tokenResult.status === 'OK') {
                    const paymentResults = await createPayment(tokenResult.token);
                    displayPaymentResults('SUCCESS');
                    console.debug('Payment Success', paymentResults);
              } else {
                    let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
                    if (tokenResult.errors) {
                    errorMessage += ` and errors: ${JSON.stringify(
                        tokenResult.errors
                    )}`;
                    }
                    displayPaymentResults('FAILURE');
                    throw new Error(errorMessage);
              }
            }
          );
        }
    }


  }
}
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');


body {
  font-family: Arial, sans-serif;
}


* {
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
}

#payment-form {
  max-width: 550px;
  min-width: 300px;
  margin: 150px auto;
  margin-top: -10px;
}


@media screen and (max-width: 500px) {
  /* #card-container {
    min-height: 140px;
  } */
}
#its-working {
  color: #737373;
}

h3 {
  margin: 0;
}

p {
  line-height: 24px;
}

label {
  font-size: 12px;
  width: 100%;
}


button {
  color: #ffffff;
  background-color: #006aff;
  border-radius: 5px;
  cursor: pointer;
  border-style: none;
  user-select: none;
  outline: none;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  padding: 12px;
  width: 100%;
  box-shadow: 1px;
}

button:active {
  background-color: rgb(0, 85, 204);
}

button:disabled {
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.3);
}

#payment-status-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  border-radius: 50px;
  margin: 0 auto;
  width: 225px;
  height: 48px;
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

#payment-status-container.missing-credentials:before {
  content: '';
  background-color: #cc0023;
  width: 16px;
  height: 16px;
  margin-right: 16px;
  -webkit-mask: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L6.58579 8L4.29289 10.2929C3.90237 10.6834 3.90237 11.3166 4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071L8 9.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L9.41421 8L11.7071 5.70711C12.0976 5.31658 12.0976 4.68342 11.7071 4.29289C11.3166 3.90237 10.6834 3.90237 10.2929 4.29289L8 6.58579L5.70711 4.29289Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E%0A");
  mask: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L6.58579 8L4.29289 10.2929C3.90237 10.6834 3.90237 11.3166 4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071L8 9.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L9.41421 8L11.7071 5.70711C12.0976 5.31658 12.0976 4.68342 11.7071 4.29289C11.3166 3.90237 10.6834 3.90237 10.2929 4.29289L8 6.58579L5.70711 4.29289Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E%0A");
}

#payment-status-container.missing-credentials:after {
  content: 'applicationId and/or locationId is incorrect';
  font-size: 14px;
  line-height: 16px;
}

#afterpay-button {
  height: 40px;
}

</style>