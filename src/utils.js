import { message } from 'ant-design-vue';

export const getUserInfo = async (token) => {
    const response = await fetch(`${baseAPI}teamData?api=getUserData&type=user`, {
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

export const urls = {
  'dev': 'wffa25444.web.app',
  'prod': 'wffa-live.web.app'
}

let api = ``;
if(location.host === urls.prod) api = 'https://us-central1-wffa-live.cloudfunctions.net/';
else api = 'https://us-central1-wffa25444.cloudfunctions.net/';
export const baseAPI = api;