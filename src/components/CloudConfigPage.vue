<template>
  <div>
    <!-- The configuration landing page just wraps other elements which are shown when the configuration data loads -->
    <TablessContainer v-if="configStore.loaded">
      <template v-slot:header>
        {{ $t('device_config.configure_tiltbridge_header') }}
      </template>
    </TablessContainer>
    <div v-else>
      <!-- TODO - Add an error message here if the config fails to load -->
    </div>
  </div>

</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { useConfigStore } from "@/stores/ConfigStore";
import { useLoading } from 'vue-loading-overlay'
import TablessContainer from "@/components/sitewide/TablessContainer.vue";

const $loading = useLoading({
  // options
});


const tabs = [
  { name: 'Fermentrack/BrewPi-Remix', route_name: 'FermentrackConfig' },
  { name: 'Google Sheets', route_name: 'FermentrackConfig' },
  { name: 'Brewers Friend', route_name: 'FermentrackConfig' },
  { name: 'Brewfather', route_name: 'FermentrackConfig' },
  { name: 'Grainfather', route_name: 'FermentrackConfig' },
  { name: 'Brewstatus', route_name: 'FermentrackConfig' },
  { name: 'Taplist.io', route_name: 'FermentrackConfig' },
  { name: 'MQTT', route_name: 'FermentrackConfig' },
  { name: 'Generic Target', route_name: 'FermentrackConfig' },
  // { name: 'Data Target Settings', route_name: 'KegtronConfig' },
  // { name: 'KegScreen TV Settings', route_name: 'KSTVConfig' },
];

let intervalObject = null;
const configStore = useConfigStore();

onMounted(() => {
  // Retrieve initial data
  let loader = $loading.show({});
  configStore.getConfig().finally(() => {
    loader.hide();
  });

  // Set up periodic refreshes
  intervalObject = window.setInterval(() => {
    configStore.getConfig();
  }, 1000*60*30)  // Re-pull once every 30 minutes just in case someone leaves a window open or something
});

onBeforeUnmount(() => {
  clearInterval(intervalObject);
});

</script>

<style scoped>

</style>