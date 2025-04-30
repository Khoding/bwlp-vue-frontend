<template>
    <div class="auth-view">
        <p> Sie werden weitergeleitet. Bitte warten ... </p>
        <p>You are being redirected. Please wait ...</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import {LocationQuery, useRouter} from 'vue-router';
  import {useAuthStore} from '@/stores/auth-store';
  
  import {MasterServerClient} from '@/assets/js/bwlp/bwlp.js';
  import {Thrift} from '@/assets/js/thrift/thrift.js';
  
  const router = useRouter();
  const authStore = useAuthStore();

  const query = router.currentRoute.value.query
  if (query.token) {
    const token = query.token
    const mainServer = 'bwlp-masterserver.ruf.uni-freiburg.de';
    const proto = new Thrift.Protocol(new Thrift.Transport(`https://${mainServer}/thrift/`));
    const main = new MasterServerClient(proto)
    console.log("SENDING THRIFT STUFF")
    try {
        const response = await main.isServerAuthenticated(token)
        console.log("response:", response)
    } catch (error) {
        console.error(error)
    }
    // TODO: validate token via whoami
  } else {
    // Show message that explains that login failed
    // router.push("/login")
  }
  
  // https://bwlp-masterserver.ruf.uni-freiburg.de/webif/shib/client_auth.php?token=daas-schrott&dest=https://ca5.de/
    //   const proto = new Thrift.Protocol(new Thrift.Transport(`https://${mainServer}/thrift/`));
    //   const main = new MasterServerClient(proto);
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
  