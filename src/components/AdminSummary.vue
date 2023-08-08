<template>
    <div>
        <a-card title="Tournment" :style="{ textAlign: 'center' }">
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
  import { message } from 'ant-design-vue';
  import firebase from "firebase/app"
  import 'firebase/auth';

  export default {
    name: 'Admin Summary',
    setup() {
        const data = ref([
                        {
                            title: 'PIN',
                            description: 'Loading...'
                        },
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
            const res = await getAdminRules(token);
            rules.value = res.data[0];
            const rulesFields = ['PIN', 'elminationFormat', 'gameLocation', 'gameTime',
                                  'leagueType', 'payment', 'registrationDates', 'rosterLimit',
                                  'tournamentDays', 'tournamentFormat']

            for (let i=0; i<10; i++) {
                if (rulesFields[i] === 'gameTime') {
                    data.value[i].description = formatTime(rules.value[rulesFields[i]]);
                }
                else if (rulesFields[i] === 'payment') {
                    data.value[i].description = formatPayment(rules.value[rulesFields[i]]);
                }
                else if (rulesFields[i] === 'tournamentDays') {
                    data.value[i].description = formatTournamentDays(rules.value[rulesFields[i]]);
                }
                else if (rulesFields[i] === 'registrationDates') {
                    data.value[i].description = humanReadableFromISO(rules.value[rulesFields[i]]);
                }
                else {
                    data.value[i].description = rules.value[rulesFields[i]];
                }
            }
        }

        const formatTime = (time) => { return `${time[0]} - ${time[1]}`}

        const formatPayment = (payment) => { return `$${payment}`}

        const formatTournamentDays = (days) => { 
            let listOfDays = ``
            for(let day of days) {  listOfDays += `${day}, ` }
            return listOfDays.slice(0, -2);
        }

        const humanReadableFromISO = (registrationDates) => {
            let timeStamp = ``
            for (const registrationDate of registrationDates ) {
                const submittedDate = new Date(String(registrationDate));
                timeStamp += `${submittedDate.toLocaleString('en-US', { month: 'long' }) + ' ' 
                                + submittedDate.getDate() + ',' + submittedDate.getFullYear() + ' '} - `
            }
            return timeStamp.slice(0, -2); // January 28, 2021 16:11:54
        }


        const getAdminRules = async (token) => {
            const response = await (await fetch(`https://us-central1-wffa25444.cloudfunctions.net/teamData?api=getRules&type=admin`, {
                method:'GET',
                headers:{
                    Authorization:"Bearer "+token,
                    "Content-Type": "application/json"
                    }
                }))
                if (response.status === 200) {
                    console.log('123')
                    return response.json()
                }
                else { 
                    message.error({
                                content: `ERROR`,
                                duration: 2,
                    }); 
                }
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