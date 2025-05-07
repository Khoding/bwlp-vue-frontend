<template>
    <div class="auth-view">
        <p> Sie werden weitergeleitet. Bitte warten ... </p>
        <p>You are being redirected. Please wait ...</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import {LocationQuery, useRouter} from 'vue-router';
  import {useAuthStore} from '@/stores/auth-store';
  import { useSatelliteStore } from '@/stores/satellites';

  import { getJsonFromURLParams } from '@/auth/auth';
  
  const router = useRouter()
  const authStore = useAuthStore()
  const satelliteStore = useSatelliteStore()

  const query = router.currentRoute.value.fullPath
  const userAuthInfo = getJsonFromURLParams(query)

  if (userAuthInfo) {
    try {
        //TODO: Validate Received Token against the masterserver.
        authStore.setToken(userAuthInfo.sessionId)
        satelliteStore.setSatellites(userAuthInfo.satellites2)
        router.push("/image")
    } catch (error) {
      console.log("Could not handle thrift request")
      // Seite anzeigen, dass etwas fehlgeschlagen ist
    }
    
  } else {
    // Seite anzeigen die Sagt, dass redirect fehlgeschlagen ist
  }
  </script>
  
  <style scoped>
  .login-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    inline-size: 320px;
    margin-inline: auto;
  
    button {
      display: flex;
      margin-inline: auto;
    }
  }
  </style>
  