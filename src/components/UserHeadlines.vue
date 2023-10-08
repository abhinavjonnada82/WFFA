<template>
    <div>
        <a-card :style="{ textAlign: 'center' }">
            <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
                <template #renderItem="{ item }">
                <a-list-item>
                    <a-card :title="item.title"> 
                        <p>
                            {{ item.description }}
                        </p> 
                    </a-card>
                </a-list-item>
                </template>
            </a-list>
        </a-card>
    </div>
  </template>
  
  <script>
  import { onBeforeMount, ref } from 'vue';
 // import { message } from 'ant-design-vue';
  import firebase from "firebase/app"
  import 'firebase/auth';
  import { getUserInfo, formatTournamentDays, formatGameTime, formatPayment } from '../utils.js';

  export default {
    name: 'User Headlines',
    setup() {
        const data = ref([
                        {
                            title: 'Elmination Format',
                            description: 'Loading...'
                        },
                        {
                            title: 'Game Location',
                            description: 'Loading...'
                        },
                        {
                            title: 'Game Time',
                            description: 'Loading...'
                        },
                        {
                            title: 'League Type',
                            description: 'Loading...'
                        },
                        {
                            title: 'Payment',
                            description: 'Loading...'
                        },
                        {
                            title: 'Registration Dates',
                            description: 'Loading...'
                        },
                        {
                            title: 'Roster Limit',
                            description: 'Loading...'
                        },
                        {
                            title: 'Tournament Days',
                            description: 'Loading...'
                        },
                        {
                            title: 'Tournament Format',
                            description: 'Loading...'
                        },
                    ]);
        const rules = ref({});
        const auth = firebase.auth();
        onBeforeMount(() => {
            getIdToken();
        })

        const getIdToken = async () => {
            const user = auth.currentUser;
            const token = await user.getIdToken();
            const res = await getUserInfo(token);
            
            rules.value = res.data[0]?.rules;
            const rulesFields = ['elminationFormat', 'gameLocation', 'gameTime',
                                  'leagueType', 'payment', 'registrationDates', 'rosterLimit',
                                  'tournamentDays', 'tournamentFormat']

            for (let i=0; i<9; i++) {
                if (rulesFields[i] === 'gameTime') {
                    data.value[i].description = formatGameTime(rules.value[rulesFields[i]]);
                }
                else if (rulesFields[i] === 'payment') {
                    data.value[i].description = formatPayment(rules.value[rulesFields[i]]);
                }
                else if (rulesFields[i] === 'tournamentDays') {
                    data.value[i].description = formatTournamentDays(rules.value[rulesFields[i]]);
                }
                else if (rulesFields[i] === 'registrationDates') {
                    data.value[i].description = humanReadableDays(rules.value[rulesFields[i]]);
                }
                else {
                    data.value[i].description = rules.value[rulesFields[i]];
                }
            }
        }

        const humanReadableDays = (registrationDates) => {
            if (new Date(String(registrationDates[0])) >= new Date()) {
                return `Registration begins in ${daysConversion(registrationDates[0], new Date())} day(s)`
            }
            else {
                if (daysConversion(registrationDates[1], new Date()) >= 0) return `Registration Ends in ${daysConversion(registrationDates[1], new Date())} day(s)`
                else return `Registration closed`
            }
        }

        const daysConversion = (processDate, currentDate) => {
            const difference = new Date(processDate).getTime() - currentDate.getTime();
            const TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
            return TotalDays;
        }

        return {
            rules,
            data,
        };
    },


  }
  </script>
  
  <style scoped>

  </style>