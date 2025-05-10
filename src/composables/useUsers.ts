import {ref} from '@vue/runtime-core';

import {useAuthStore} from '@/stores/auth-store';
import {useSatServer} from '@/composables/useSatServer';

export function useUsers() {
  const authStore = useAuthStore();
  const sat = useSatServer();
  const userList = ref([]);

  const fetchUsers = async () => {
    if (!userList.value.length) {
      try {
        userList.value = await sat.getUserList(authStore.authToken, 0);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        return [];
      }
    }
    return userList.value;
  };

  const getUserFullName = userId => {
    const user = userList.value.find(u => u.userId === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unbekannt';
  };

  return {
    userList,
    fetchUsers,
    getUserFullName,
  };
}
