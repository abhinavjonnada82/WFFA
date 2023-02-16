import firebase from 'firebase';

export const getIdTokenBase = async () => {
    const user = firebase.auth().currentUser;
    const token = await user.getIdToken();
    return token
}