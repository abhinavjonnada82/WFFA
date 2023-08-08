// import firebase from "firebase/app"
// import 'firebase/auth';
import { message } from 'ant-design-vue';

// const auth = firebase.auth();

// export const getIdTokenBase = async () => {
//     const user = auth.currentUser;
//     const token = await user.getIdToken();
//     return token
// }

export const getUserInfo = async (token) => {
    const response = await fetch(`https://us-central1-wffa25444.cloudfunctions.net/teamData?api=getUserData&type=user`, {
      method:'GET',
      headers:{
          Authorization:"Bearer "+token,
          "Content-Type": "application/json"
          }
    })
  
    if (response.status === 200) {
      return response.json()
      }
    else { 
          message.error({
                        content: `ERROR`,
                        duration: 2,
            }); 
        }
    }


export const humanReadableFromISO = (registrationDates) => {
      let timeStamp = ``
      for (const registrationDate of registrationDates ) {
          const submittedDate = new Date(String(registrationDate));
          timeStamp += `${submittedDate.toLocaleString('en-US', { month: 'long' }) + ' ' 
                          + submittedDate.getDate() + ',' + submittedDate.getFullYear() + ' '} - `
      }
      return timeStamp.slice(0, -2); // January 28, 2021 16:11:54
  }

export const formatTournamentDays = (days) => { 
  let listOfDays = ``
  for(let day of days) {  listOfDays += `${day}, ` }
  return listOfDays.slice(0, -2);
}

export const formatGameTime = (time) => { return `${time[0]} - ${time[1]}`}

export const formatPayment = (payment) => { return `$${payment}`}