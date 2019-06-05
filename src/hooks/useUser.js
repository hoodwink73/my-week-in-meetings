import firebase from "@firebase/app";
import "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

window.firebase = firebase;

export default function useUser() {
  const { user } = useAuthState(firebase.auth());

  const handleLogout = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut();
    firebase.auth().signOut();
  };

  return { user, logout: handleLogout };
}
