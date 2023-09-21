<template>
  <div id="payment-status-container"></div>
  <div>
    <form id="payment-form">
      <div id="cash-app-pay"></div>
    </form>
  </div>
</template>



<script>
import { onBeforeMount, inject } from 'vue';
import firebase from "firebase/app"
import 'firebase/auth';
import { message } from 'ant-design-vue';
import { roundInitalPayment } from '../utils.js';
import { store } from '../store';
import { useRouter } from 'vue-router'

export default {
  name: 'CashApp',
  props: {
  },
  setup() {
    const appId = 'sandbox-sq0idb-mqU225mXO2Va1qKGI1P1cg';
    const locationId = 'LR72E4C5EYMQ6';
    const auth = firebase.auth();
    const swal = inject('$swal');
    const router = useRouter();

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
            amount: (store.leaguePayment).toString(),
            label: 'Total',
          },
        });
        return paymentRequest;
    }

    const createPayment = async (paymentToken) => {
      let payment = ``
      const paymentMethod = store.paymentMethod

      if (paymentMethod === `initalDeposit`) { 
          payment = roundInitalPayment(store.leaguePayment)
      }
      else {
          payment = store.leaguePayment
      }
      const user = auth.currentUser;
      const idToken = await user.getIdToken();
      const body = JSON.stringify({
        locationId,
        sourceId: paymentToken,
        payment: payment,
        paymentMethod
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
            swal.fire({
                        title: '<strong>Payment Success</strong>',
                        icon: 'success',
                        html: `Payment Successful! Your receipt will be available to you shortly via text.`,
                        showCloseButton: false,
                        showCancelButton: false,
                        confirmButtonText: 'Back to Home',
                        confirmButtonClass: 'custom-button-class',
                        allowOutsideClick: false,
                    }).then((result) => {
                            if (result.isConfirmed) {
                                router.push({path: '/'})
                        } })

              return response.json();
            }
            const errorBody = await response.text();
            throw new Error(errorBody);
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
                    await createPayment(tokenResult.token);
              } else {
                    let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
                    if (tokenResult.errors) {
                    errorMessage += ` and errors: ${JSON.stringify(
                        tokenResult.errors
                    )}`;
                    }
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

    .custom-button-class {
      background-color: #ffffff; /* Change to your desired button color */
      color: #1b0303; /* Change to your desired text color */
      /* Add any other styles as needed */
    }

</style>