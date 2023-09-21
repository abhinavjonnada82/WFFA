import { reactive } from 'vue'

export const store = reactive({
  paymentMethod: ``,
  leaguePayment: 0,
  initalPaymentSuccessFlag: false,
  remainingPaymentBalance: 0
})