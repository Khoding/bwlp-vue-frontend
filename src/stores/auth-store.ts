import {defineStore} from 'pinia';
import {ref} from '@vue/runtime-core';

export const useAuthStore = defineStore('auth', () => {
  const authToken = ref(sessionStorage.getItem('authToken') || '');

  function setToken(token: any) {
    authToken.value = token;
    sessionStorage.setItem('authToken', token);
  }

  function clearToken() {
    authToken.value = '';
    sessionStorage.removeItem('authToken');
  }

  return {authToken, setToken, clearToken};
});
