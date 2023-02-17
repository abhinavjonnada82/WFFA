import firebase from "firebase/app"
import 'firebase/auth';

const auth = firebase.auth();

export const getIdTokenBase = async () => {
    const user = auth.currentUser;
    const token = await user.getIdToken();
    return token
}