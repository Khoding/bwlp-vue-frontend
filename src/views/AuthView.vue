  <template>
    <div>
      <SatelliteSelectionModal
        :isVisible="showModal"
        :options="options"
        @close="showModal = false"
        @submit-choice="submitChoice"
      />
    </div>
  </template>
    
  <script setup lang="ts">
    import {useRouter} from 'vue-router';
    import {useAuthStore} from '@/stores/auth-store';
    import { useSatelliteStore } from '@/stores/satellites';

    import { Thrift } from "@/assets/js/thrift/thrift.js";
    import { MasterServerClient } from "@/assets/js/bwlp/bwlp.js";


    import { getJsonFromURLParams, UserAuthInfo } from '@/auth/auth';
    import { onMounted, ref } from 'vue';
    import { SatelliteServer } from '@/satellites/satellite';
    import SatelliteSelectionModal from '@/components/SatelliteSelectionModal.vue';
    
    const router = useRouter()
    const authStore = useAuthStore()
    const satelliteStore = useSatelliteStore()

    let showModal = ref(false)
    let options = ref(null)
    

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
          satelliteStore.setSatellites(userAuthInfo.satellites2);
          options = ref(createOptions(userAuthInfo.satellites2))
          showModal.value = true;
        } else {
          // REDIRECT TO SOME ERROR PAGE PERHAPS
        }
      } catch (error) {
        console.log("Could not handle thrift request");
        console.log(error);
        // Seite anzeigen, dass etwas fehlgeschlagen ist
      }
    } else {
      if (authStore.authToken) {
        if (satelliteStore.selectedSatellite) {
            router.push("/images")
        } else {
          if(satelliteStore.satellites.length > 0) {
            showModal.value = true
          } else {
            // user authenticated but no satellitesServer found
            // maybe redirect them back to /login?
            // TODO: find out if there is a better wa to do this:
            authStore.clearToken()
            router.push("/login")
          }
        }
      } else {
        // No auth token found, back to login with you
        router.push("/login")
      }
    }
  
  });

  function submitChoice() {
    router.push("/image")
  }

  function createOptions(satellites: SatelliteServer[]): Record<string, SatelliteServer> {
  let sats: Record<string, SatelliteServer> = {}
  satellites.forEach((sat) => {
    sats[sat.name] = sat
  })
  return sats
}
  </script>