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
