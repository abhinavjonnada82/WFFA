<template>
  <div id="payment-status-container"></div>
  <div>
    <form id="payment-form">
      <a-spin :spinning="spinning">
        <div id="cash-app-pay"></div>
      </a-spin>
    </form>
  </div>
</template>



<script>
import { onBeforeMount, inject, ref } from 'vue';
import firebase from "firebase/app"
import 'firebase/auth';
import { message } from 'ant-design-vue';
import { baseAPI, roundInitalPayment } from '../utils.js';
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
    const spinning = ref(false);

    onBeforeMount(async () => {
      spinning.value = true;
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
        spinning.value = false;
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
        const response =  await fetch(`${baseAPI}paymentPivot/cashapp-payment`, {
            method: 'POST',
            headers: {
                Authorization:"Bearer "+idToken,
                'Content-Type': 'application/json',
            },
            body,
            });
            if (response.ok) {
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
                        } })

              return response.json();
            }
            else {
              message.error({
                  content: await response.text(),
                  duration: 5,
              });
              const errorBody = await response.text();
              throw new Error(errorBody);
            }
            
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
          const error_msg = e.message
          if(error_msg.match('already rendered')){
            message.error({
                content: 'Reload your browser page to re-enable Cash App.',
                duration: 15,
            });
          }
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

    return {
          spinning
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