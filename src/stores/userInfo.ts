import {defineStore} from 'pinia';
import {ref} from '@vue/runtime-core';
import { LocalUserInfo, UserAuthInfo } from '@/auth/auth';


export const useUserInfoStore = defineStore('userInfo', () => {
  const userInfo = ref<LocalUserInfo>(JSON.parse(localStorage.getItem('userInfo') || '{}'));

  function setUserInfo(userAuthInfo: UserAuthInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userAuthInfo as LocalUserInfo));
  }

  function clearUserInfo() {
    userInfo.value = null;
    localStorage.removeItem('authToken');
  }

  return {userInfo, setUserInfo, clearUserInfo};
});

