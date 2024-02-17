<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Configure TiltBridge
      </h1>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 sm:mt-4">
      <div class="sm:hidden pb-2">
        <label for="current-tab" class="sr-only">Select a group of settings to edit</label>
        <select id="current-tab" name="current-tab" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" @change="routeChange">
<!--          <option v-for="tab in tabs" :key="tab.name" :selected="isCurTab(tab.name)">{{ tab.name }}</option>-->
          <router-link v-for="tab in tabs" :key="tab.name" :to="{name: tab.route_name}" v-slot="{ href, isActive }" custom>
            <option :value="href" :selected="isActive">{{ tab.name }}</option>
<!--            <a :href="href" :class="[isActive ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm']" :aria-current="isActive ? 'page' : undefined" @click="navigate">-->
<!--              {{ tab.name }}-->
<!--            </a>-->
          </router-link>


        </select>
      </div>
      <div class="hidden sm:block">
        <nav class="-mb-px flex space-x-8">
<!--          <a v-for="tab in tabs" :key="tab.name" :href="tab.href" :class="[isCurTab(tab.name) ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm']" :aria-current="isCurTab(tab.name) ? 'page' : undefined">-->
<!--            {{ tab.name }}-->
<!--          </a>-->

          <router-link v-for="tab in tabs" :key="tab.name" :to="{name: tab.route_name}" v-slot="{ href, navigate, isActive }" custom>
            <a :href="href" :class="[isActive ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm']" :aria-current="isActive ? 'page' : undefined" @click="navigate">
              {{ tab.name }}
            </a>
          </router-link>
        </nav>
      </div>
    </div>

  </header>

  <main v-if="configStore.loaded">
    <router-view></router-view>
  </main>
  <!-- TODO - Add an error message here if the config fails to load -->

</template>

<script setup>
import { onMounted, defineProps, onBeforeUnmount } from "vue";
import { useConfigStore } from "@/stores/ConfigStore";
import { useLoading } from 'vue-loading-overlay'

const $loading = useLoading({
  // options
});

const tabs = [
  { name: 'General Settings', route_name: 'TiltBridgeConfig' },
  // { name: 'Data Target Settings', route_name: 'KegtronConfig' },
  // { name: 'KegScreen TV Settings', route_name: 'KSTVConfig' },
];

const props = defineProps({
  currentTab: {
    type: String,
    required: false,
    default: 'General Settings',
  },
  headerText: {
    type: String,
    required: false,
    default: "Configure Device",
  }
});

function routeChange(e) {
  this.$router.push(e.target.value)
}

let intervalObject = null;
const configStore = useConfigStore();

onMounted(() => {
  // Retrieve initial data
  let loader = $loading.show({});
  configStore.getConfig().then(() => {
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