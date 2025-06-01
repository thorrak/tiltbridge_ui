<template>
  <div>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Calibrating {{ colorName }} Tilt
        </h1>
      </div>
    </header>
    <main>
      
      <!-- Charts Section -->
      <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Calibration Chart
        </h3>
        <div class="w-full flex flex-col">
          <div class="w-full max-w-2xl aspect-square">
            <Line v-if="combinedChartData" :data="combinedChartData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- Current Values Section -->
      <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Current Values
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 px-4 py-3 rounded-lg">
            <div class="text-sm font-medium text-gray-500">Raw Gravity</div>
            <div class="text-lg font-bold text-gray-900">{{ currentRawGravity }}</div>
          </div>
          <div class="bg-gray-50 px-4 py-3 rounded-lg">
            <div class="text-sm font-medium text-gray-500">Calibration Function</div>
            <div class="text-lg font-bold text-gray-900">{{ calibrationFunction }}</div>
          </div>
          <div class="bg-gray-50 px-4 py-3 rounded-lg">
            <div class="text-sm font-medium text-gray-500">Calibrated Gravity</div>
            <div class="text-lg font-bold text-gray-900">{{ calibratedGravity }}</div>
          </div>
        </div>
      </div>

      <!-- Calibration Points Table -->
      <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Calibration Points
          </h3>
          <button 
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            @click="openAddPointModal"
          >
            Add Calibration Point
          </button>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raw Gravity</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Gravity</th>
              <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(point, index) in calibrationStore.calibrationPoints" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ point[0] }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ point[1] }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="deletePoint(point[0])"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="calibrationStore.calibrationPoints.length === 0">
              <td colspan="3" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                No calibration points added yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Calibration Controls -->
      <div class="bg-white px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Generate Calibration Equation
        </h3>
        <div class="flex items-center space-x-4">
          <div>
            <label for="polynomial-degree" class="block text-sm font-medium text-gray-700">Polynomial Degree</label>
            <select 
              id="polynomial-degree" 
              v-model="selectedDegree"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              :disabled="calibrationStore.calibrationPoints.length === 0"
            >
              <option v-for="degree in availableDegrees" :key="degree" :value="degree">
                {{ degree === 0 ? 'Constant Offset' : `${degree}${degree === 1 ? 'st' : degree === 2 ? 'nd' : 'th'} Degree Polynomial` }}
              </option>
            </select>
          </div>
          <div class="pt-6">
            <button 
              @click="calculateCalibration"
              :disabled="calibrationStore.calibrationPoints.length === 0"
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
            >
              Calculate Calibration Equation
            </button>
          </div>
        </div>
      </div>

    </main>
    
    <!-- Add Calibration Point Modal -->
    <AddCalibrationPointModal
      :is-visible="showAddPointModal"
      :color-number="colorNumber"
      :prepopulated-raw-gravity="currentRawGravity"
      @close="showAddPointModal = false"
      @saved="onPointSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useTiltStore } from '@/stores/TiltStore';
import { useCalibrationStore } from '@/stores/CalibrationStore';
import { Line } from 'vue-chartjs';
import AddCalibrationPointModal from './AddCalibrationPointModal.vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps(['color']);
const route = useRoute();
const tiltStore = useTiltStore();
const calibrationStore = useCalibrationStore();

const showAddPointModal = ref(false);
const selectedDegree = ref(1);

const colorName = computed(() => {
  return props.color.charAt(0).toUpperCase() + props.color.slice(1);
});

const colorNumber = computed(() => {
  return tiltStore.getColorNumber(props.color);
});

const maxDegree = computed(() => {
  const points = calibrationStore.calibrationPoints.length;
  return Math.max(0, points - 1);
});

const availableDegrees = computed(() => {
  const degrees = [];
  if (calibrationStore.calibrationPoints.length >= 1) {
    degrees.push(0); // Constant offset - always available when we have at least one point
  }
  for (let i = 1; i <= Math.min(maxDegree.value, 2); i++) {
    degrees.push(i);
  }
  return degrees;
});

const currentTilt = computed(() => {
  return tiltStore.tilts.find(tilt => tilt.color.toLowerCase() === props.color.toLowerCase());
});

const currentRawGravity = computed(() => {
  return currentTilt.value ? currentTilt.value.gravity : '--';
});

const calibrationFunction = computed(() => {
  const coeffs = calibrationStore.calibrationCoefficients;
  if (coeffs.x2 !== 0) {
    return `${coeffs.x0.toFixed(4)} + ${coeffs.x1.toFixed(4)}x + ${coeffs.x2.toFixed(6)}x²`;
  } else if (coeffs.x1 !== 1 || coeffs.x0 !== 0) {
    return `${coeffs.x0.toFixed(4)} + ${coeffs.x1.toFixed(4)}x`;
  }
  return 'No calibration applied';
});

const calibratedGravity = computed(() => {
  if (!currentTilt.value) return '--';
  const x = parseFloat(currentTilt.value.gravity);
  const coeffs = calibrationStore.calibrationCoefficients;
  const result = coeffs.x0 + coeffs.x1 * x + coeffs.x2 * x * x;
  return result.toFixed(3);
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: 'linear',
      position: 'bottom',
      title: {
        display: true,
        text: 'Raw Gravity'
      },
      min: 0.990,
      max: 1.130
    },
    y: {
      type: 'linear',
      title: {
        display: true,
        text: 'Actual Gravity'
      },
      min: 0.990,
      max: 1.130
    }
  },
  plugins: {
    legend: {
      display: true
    }
  }
};

const combinedChartData = computed(() => {
  const datasets = [];
  
  // Add calibration points if they exist
  if (calibrationStore.calibrationPoints.length > 0) {
    datasets.push({
      label: 'Calibration Points',
      data: calibrationStore.calibrationPoints.map(point => ({
        x: point[0],
        y: point[1]
      })),
      backgroundColor: 'rgb(59, 130, 246)',
      borderColor: 'rgb(59, 130, 246)',
      showLine: false,
      pointRadius: 6,
      pointHoverRadius: 8
    });
  }
  
  // Add calibration equation line if coefficients are set
  const coeffs = calibrationStore.calibrationCoefficients;
  if (coeffs.x1 !== 1 || coeffs.x0 !== 0 || coeffs.x2 !== 0) {
    const points = [];
    for (let x = 1.000; x <= 1.125; x += 0.005) {
      const y = coeffs.x0 + coeffs.x1 * x + coeffs.x2 * x * x;
      points.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
    }
    
    datasets.push({
      label: 'Calibration Equation',
      data: points,
      backgroundColor: 'rgb(34, 197, 94)',
      borderColor: 'rgb(34, 197, 94)',
      showLine: true,
      pointRadius: 0,
      tension: 0.1,
      fill: false
    });
  }
  
  return datasets.length > 0 ? { datasets } : null;
});

async function deletePoint(rawGravity) {
  await calibrationStore.deleteCalibrationPoint(colorNumber.value, rawGravity);
}

function openAddPointModal() {
  showAddPointModal.value = true;
}

async function onPointSaved() {
  // Modal will automatically reload points through the store
  // No additional action needed
}

async function calculateCalibration() {
  const coefficients = calibrationStore.calculateCalibrationCoefficients(
    calibrationStore.calibrationPoints, 
    selectedDegree.value
  );
  if (coefficients) {
    await calibrationStore.saveCalibrationCoefficients(colorNumber.value, coefficients);
  }
}

watch(() => maxDegree.value, (newMaxDegree) => {
  if (selectedDegree.value > newMaxDegree && selectedDegree.value !== 0) {
    selectedDegree.value = Math.max(0, newMaxDegree);
  }
});

watch(() => calibrationStore.calibrationPoints.length, (newLength) => {
  if (newLength >= 1 && availableDegrees.value.length > 0) {
    selectedDegree.value = 0; // Default to constant offset when points are available
  }
});

onMounted(async () => {
  await calibrationStore.loadCalibrationPoints(colorNumber.value);
  await calibrationStore.getCalibrationCoefficients(colorNumber.value);
  await tiltStore.getTilts();
});
</script>

<style scoped>
</style>