import {defineStore} from 'pinia';
import {ref} from '@vue/runtime-core';
import { LocalUserInfo, UserAuthInfo } from '@/auth/auth';


export const useUserInfoStore = defineStore('userInfo', () => {
  const userInfo = ref<LocalUserInfo>(JSON.parse(sessionStorage.getItem('userInfo') || '{}'));

  function setUserInfo(userAuthInfo: UserAuthInfo) {
    userInfo.value = userAuthInfo as LocalUserInfo
    sessionStorage.setItem('userInfo', JSON.stringify(userAuthInfo as LocalUserInfo));
  }

  function clearUserInfo() {
    userInfo.value = null;
    sessionStorage.removeItem('authToken');
  }

  return {userInfo, setUserInfo, clearUserInfo};
});

