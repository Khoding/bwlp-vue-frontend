<template>
  <div>
    <template v-if="['ImageList', 'ImageDetail'].includes($route.name as string)">
      <ErrorMessage
        v-if="error"
        :error="error"
        default-message="There's been an error of some kind"
      />

      <SortableTable
        v-if="imageList.length > 0"
        :items="imageList"
        :columns="columns"
        item-key="imageBaseId"
        item-label="Images"
        @row-click="openModal"
        :footer-colspan="columns.length - 2"
        create-route="ImageCreate"
      />

      <DetailDialog
        v-if="selectedImage"
        id="image-dialog"
        :title="selectedImage?.imageName"
        :edit-route="{
          name: 'ImageEdit',
          params: {id: selectedImage?.imageBaseId},
        }"
        :is-open="showModal"
        :tabs="
          imageTabs.map(tab => ({
            ...tab,
            props: tab.props(selectedImage, imagePermissions),
          }))
        "
        @close-wanted="handleCloseDialog"
      />
    </template>

    <!-- <template v-if="$route.matched.some(x => x.children && x.children.length > 0)"> -->
    <RouterView v-slot="{Component}">
      <Transition name="page-slide" mode="out-in">
        <template v-if="!['ImageList', 'ImageDetail'].includes($route.name as string)">
          <component :is="Component"></component>
        </template>
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from '@vue/runtime-core';
import {useRouter, useRoute, onBeforeRouteUpdate} from 'vue-router';
import {useAuthStore} from '@/stores/auth-store';
import {useSatServer} from '@/composables/useSatServer';
import {useDateFormat} from '@vueuse/core';

import ErrorMessage from '@/components/error/ErrorMessage.vue';
import SortableTable from '@/components/SortableTable.vue';

/// TODO: But for in a long time, we could make it a setting that the user can decide for themselves
const columns = [
  {
    field: 'imageName',
    label: 'Image Name',
  },
  {
    field: 'osId',
    label: 'OS',
    class: 'min',
  },
  {
    field: 'ownerId',
    label: 'Owner',
    class: 'min',
  },
  {
    field: 'expireTime',
    label: 'Expire Time',
    class: 'min',
    formatter: value => (value > 0 ? formatDate(value * 1000, 'DD.MM.YYYY, HH:mm') : '-'),
  },
  {
    field: 'virtId',
    class: 'min',
  },
];

import DetailDialog from '@/components/dialog/DetailDialog.vue';
import ImageDetailsTab from '@/components/dialog/ImageTabs/ImageDetailsTab.vue';
import ImageVersionsTab from '@/components/dialog/ImageTabs/ImageVersionsTab.vue';
import ImageLecturePermissionsTab from '@/components/dialog/ImageLecturePermissionsTab.vue';

const formatDate = (timestamp: number, format: string) => {
  return useDateFormat(timestamp, format).value;
};

const imageTabs = [
  {
    id: 'details',
    icon: 'info',
    label: 'Details',
    component: ImageDetailsTab,
    props: image => ({image}),
  },
  {
    id: 'versions',
    icon: 'history',
    label: 'Versions',
    component: ImageVersionsTab,
    props: image => ({versions: image?.versions}),
  },
  {
    id: 'permissions',
    icon: 'key',
    label: 'Permissions',
    component: ImageLecturePermissionsTab,
    props: (image, imagePermissions) => ({
      permissions: imagePermissions,
      defaultPermissions: image?.defaultPermissions,
    }),
  },
];
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const sat = useSatServer();

const imageList = ref([]);
const error = ref('');
const showModal = ref(false);
const selectedImage = ref(null);
const imagePermissions = ref({});

onMounted(() => {
  if (!authStore.authToken) {
    router.push('/login');
  } else {
    fetchImages().then(() => {
      if (route.name === 'ImageDetail' && route.params.id) {
        loadImageById(route.params.id as string);
      }
    });
  }
});

const fetchImages = async () => {
  try {
    const response = await sat.getImageList(authStore.authToken, [], 0);
    imageList.value = response;
    return response;
  } catch (e) {
    error.value = e.message;
    return [];
  }
};

const loadImageById = async (imageId: string) => {
  try {
    const image = imageList.value.find(img => img.imageBaseId === imageId);

    if (image) {
      await openModal(image);
    } else {
      selectedImage.value = await sat.getImageDetails(authStore.authToken, imageId);
      imagePermissions.value = await sat.getImagePermissions(authStore.authToken, imageId);
      showModal.value = true;
    }
  } catch (e) {
    error.value = e.message;
  }
};

const openModal = async image => {
  try {
    selectedImage.value = await sat.getImageDetails(authStore.authToken, image.imageBaseId);
    imagePermissions.value = await sat.getImagePermissions(authStore.authToken, image.imageBaseId);
    showModal.value = true;

    if (route.name !== 'ImageDetail' || route.params.id !== image.imageBaseId) {
      router.push({
        name: 'ImageDetail',
        params: {id: image.imageBaseId},
      });
    }
  } catch (e) {
    error.value = e.message;
  }
};

const handleCloseDialog = () => {
  showModal.value = false;
  selectedImage.value = null;
};

watch(
  () => route.params,
  newParams => {
    if (route.name === 'ImageDetail' && newParams.id) {
      const imageId = newParams.id as string;
      if (!showModal.value || selectedImage.value?.imageBaseId !== imageId) {
        loadImageById(imageId);
      }
    }
  },
);

watch(
  () => route.name,
  (newRouteName, oldRouteName) => {
    if (newRouteName === 'ImageDetail' && route.params.id) {
      const imageId = route.params.id as string;
      if (!showModal.value || selectedImage.value?.imageBaseId !== imageId) {
        loadImageById(imageId);
      }
    } else if (newRouteName === 'ImageList' && oldRouteName === 'ImageDetail') {
      // Only close if we're navigating from detail to list
      handleCloseDialog();
    }
  },
  {immediate: true},
);

onBeforeRouteUpdate(() => {
  handleCloseDialog();
});
</script>
