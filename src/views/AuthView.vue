  <template>
    <div>
      <SatelliteSelectionModal
        :isVisible="showModal"
        :keyValuePairs="options"
        @close="showModal = false"
        @selected="handleSelection"
        @choice-sumbit="submitChoice"
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
    let satelliteSelected = ref(false)

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
          options.value = createOptions(userAuthInfo.satellites2);
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
      // Seite anzeigen die Sagt, dass redirect fehlgeschlagen ist
    }
  });

  function handleSelection(key: string) {
    satelliteStore.setSelectedSatellite(options.value[key])
    satelliteSelected = ref(true)
  }

  function createOptions(satellites: SatelliteServer[]): Record<string, SatelliteServer> {
    let sats: Record<string, SatelliteServer> = {}
    satellites.forEach((sat) => {
      sats[sat.name] = sat
    })
    return sats
  }

  function submitChoice() {
    router.push("/image")
  }
  </script>