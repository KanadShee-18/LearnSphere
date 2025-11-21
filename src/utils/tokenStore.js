import store from "../reducer/store";
import { setToken } from "../slices/authSlice";

export function getAccessToken() {
  console.log(store.getState().auth);
  return store.getState().auth.token;
}

export function saveAccessToken(token) {
  store.dispatch(setToken(token));
}
