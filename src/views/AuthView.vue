  <template>
    <div>
      <ErrorMessage
      default-message="Something unexpected happened error while authenticating. Please try again later"
      :error="err">

      </ErrorMessage>
      <SatelliteSelectionModal
        :isVisible="showModal"
        :options="options"
        @close="showModal = false"
        @submit="submitChoice"
        @custom-ip-submit="submitCustomIp"
      />
    </div>
  </template>
    
  <script setup lang="ts">
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '@/stores/auth-store';
    import { useSatelliteStore } from '@/stores/satellites';

    import { Thrift } from "@/assets/js/thrift/thrift.js";
    import { MasterServerClient } from "@/assets/js/bwlp/bwlp.js";


    import { getJsonFromURLParams, UserAuthInfo } from '@/auth/auth';
    import { onMounted, ref } from 'vue';
    import { SatelliteServer } from '@/satellites/satellite';
    import SatelliteSelectionModal from '@/components/SatelliteSelectionModal.vue';
    import ErrorMessage from '@/components/error/ErrorMessage.vue';
    import { useUserInfoStore } from '@/stores/userInfo';
 
    const router = useRouter()
    const authStore = useAuthStore()
    const satelliteStore = useSatelliteStore()
    const userInfoStore = useUserInfoStore()

    let showModal = ref(false)
    let options = ref(null)
    
    let err = ref<Error | null>(null)

    const query = router.currentRoute.value.fullPath
    const userAuthInfo = getJsonFromURLParams(query)

    const masterServerURL = "bwlp-masterserver.ruf.uni-freiburg.de"
    const proto = new Thrift.Protocol(new Thrift.Transport(`https://${masterServerURL}/thrift/`))
    const masterServerClient = new MasterServerClient(proto)

    onMounted(async () => {
    if (userAuthInfo) {
      try {
        const ServerResponse = await masterServerClient.getUserFromToken(userAuthInfo.token) as UserAuthInfo;

        if (ServerResponse.userId === userAuthInfo.userId) {
          authStore.setToken(userAuthInfo.token);
          userInfoStore.setUserInfo(userAuthInfo)
          satelliteStore.setSatellites(userAuthInfo.satellites2);
          options = ref(createOptions(userAuthInfo.satellites2))
          showModal.value = true;
        } else {
          throw new Error("Unable to Authenticate")
        }
      } catch (error) {
        const errorMessage = `Could not handle server authentification :${error.message}`
        err.value = new Error(errorMessage)
      }
    } else {
      if (authStore.authToken) {
        // validate token against server
        try {
        if (satelliteStore.selectedSatellite) {
            router.push("/image")
        } else {
          if(satelliteStore.satellites.length > 0) {
            showModal.value = true
          } else {
            // user authenticated but no satellitesServer found
            // maybe redirect them back to /login?
            // TODO: find out if there is a better wa to do this:
            authStore.clearToken()
            userInfoStore.clearUserInfo()
            router.push("/login")
          }
        }
      } catch(e) {
        const errorMessage = `The authentication failed: ${e.message}`
        err.value = new Error(errorMessage)
      }
      } else {
        // No auth token found, back to login with you
        await router.push("/login")
      }
    }
  
  });

  function submitChoice() {
    showModal.value = false
    router.push("/image")
  }

  function createOptions(satellites: SatelliteServer[]): Record<string, SatelliteServer> {
    let sats: Record<string, SatelliteServer> = {}
    satellites.forEach((sat) => {
      sats[sat.name] = sat
    })
    return sats
  }
  
  async function submitCustomIp() {
    await router.push("/image")
  }
  </script>