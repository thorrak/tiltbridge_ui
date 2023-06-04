<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Available Tilt Hydrometers
      </h1>
    </div>
  </header>
  <main>

    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Detected Tilts
      </h3>
    </div>

    <div class="bg-white px-2 py-5 sm:px-6">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
          <th scope="col" class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">RSSI</th>
          <th scope="col" class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Battery Age</th>
          <th scope="col" class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gravity</th>
          <th scope="col" class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>

<!--          <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>-->
        </tr>
        </thead>
        <tbody>
        <tr v-for="(tilt, tiltIdx) in tiltStore.tilts" :key="tilt.color" :class="tiltIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
          <td class="relative px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            <div class="absolute inset-y-0 left-0 w-1.5 bg-indigo-600" :style="tilt.colorStyle"></div>
            {{ tilt.color }}
            <span v-if="tilt.gsheets_name.length > 0">
              <!-- TODO - Fix the link below -->
              <a :href="tilt.gsheets_link"><DocumentChartBarIcon class="h-4 w-4 text-green-700 inline" aria-hidden="true" /></a>
            </span>
          </td>
          <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden lg:table-cell">{{ tilt.rssi }}</td>
          <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden md:table-cell">
            <span v-if="tilt.sends_battery">{{ tilt.weeks_on_battery }} weeks</span>
            <span v-else>--</span>
          </td>
          <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ tilt.gravity }}</td>
          <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ tilt.temp }} {{ tilt.temp_unit }}</td>

<!--          <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">-->
<!--          </td>-->
        </tr>

        <tr v-if="tiltStore.tilts.length === 0">
          <td class="relative px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colspan="5">
            <div class="absolute inset-y-0 left-0 w-1.5 bg-red-500"></div>
            <ExclamationTriangleIcon class="h-5 w-5 inline text-red-500" /> No tilts have been detected
          </td>
        </tr>

        </tbody>
      </table>
    </div>

  </main>
</template>

<script setup>
import { useTiltStore } from "@/stores/TiltStore";
// import { ExclamationTriangleIcon } from "@heroicons/vue/20/solid";
import { DocumentChartBarIcon, ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import { onMounted, onBeforeUnmount } from "vue";

let intervalObject = null;
const tiltStore = useTiltStore();

onMounted(() => {
  // Retrieve initial data
  tiltStore.getTilts();

  // Set up periodic refreshes
  intervalObject = window.setInterval(() => {
    tiltStore.getTilts();
  }, 15000)  // Tilts send data a bit faster than once per second, but we don't need to update that fast
});

onBeforeUnmount(() => {
  clearInterval(intervalObject);
});

</script>


<style scoped>

</style>