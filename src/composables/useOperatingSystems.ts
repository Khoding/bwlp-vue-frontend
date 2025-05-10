import {ref} from '@vue/runtime-core';

import {useSatServer} from '@/composables/useSatServer';

export function useOperatingSystems() {
  const sat = useSatServer();
  const operatingSystems = ref([]);

  const fetchOperatingSystems = async () => {
    if (!operatingSystems.value.length) {
      try {
        operatingSystems.value = await sat.getOperatingSystems();
      } catch (err) {
        console.error('Failed to fetch operating systems:', err);
        return [];
      }
    }
    return operatingSystems.value;
  };

  const getOSName = operatingSystemId => {
    const operatingSystem = operatingSystems.value.find(
      o => o.osId === operatingSystemId,
    );
    return operatingSystem ? `${operatingSystem.osName}` : 'Unbekannt';
  };

  return {
    operatingSystems,
    fetchOperatingSystems,
    getOSName,
  };
}
