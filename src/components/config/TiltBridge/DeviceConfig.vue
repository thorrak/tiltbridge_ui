<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="flex-initial md:container">
      <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow">

        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            TiltBridge General Settings
          </h3>
        </div>

        <form @submit.prevent="submitForm">

          <div class="px-4 py-5">
            <!-- mDNS ID Field -->
            <TextField v-model="mdnsID" placeholder="tiltbridge">
              <template #FieldName>mDNS ID</template>
              <template #FieldDescription>Host name (the xxxx in http://xxxx.local/). Must be 8-31 characters.</template>
            </TextField>

            <!-- Time Zone Offset Field -->
            <!-- TODO - Move this to google sheets config -->
            <TextField v-model="TZoffset" placeholder="-5">
              <template #FieldName>Time Zone Offset</template>
              <template #FieldDescription>Time Zone Offset from GMT (in hours). Used for Google Sheets.</template>
            </TextField>


            <!-- Temperature Default Unit Selector -->
            <SelectField v-model="tempUnit">
              <template #FieldName>Default Temperature Units</template>
              <template #FieldDescription>Default temperature units to display</template>
              <template #FieldOptions>
                <option value="C">Celsius</option>
                <option value="F">Fahrenheit</option>
              </template>
            </SelectField>


            <!-- Specific Gravity Averaging Field -->
            <TextField v-model="smoothFactor" placeholder="60">
              <template #FieldName>Specific Gravity Averaging</template>
              <template #FieldDescription>
                Valid range is 0 to 99. Setting affects time constant of exponentially weighted
                moving average filter applied to specific gravity reading. In response to a step
                change, the filtered value should reach steady state after ~ 5 time constants.
                A setting of 0 gives no smoothing (filtering off) while higher values mean more
                smoothing.  A setting of 60 gives time constant of just over 5 seconds while 99
                results in ~ 5 minutes.
              </template>
            </TextField>


            <!-- Invert TFT Selector -->
            <fieldset class="space-y-5" v-if="configStore.have_lcd">
              <legend class="sr-only">Hardware Options</legend>
              <CheckboxField v-model="invertTFT">
                <template #FieldName>Invert TFT Display</template>
                <template #FieldDescription> - Use if the screen is upside-down</template>
              </CheckboxField>
            </fieldset>

            <FormErrorMsg :form_error_message="form_error_message" v-if="form_error_message.length > 0" />

          </div>

          <!-- Card Footer -->
          <div class="bg-white px-4 py-5 border-t border-gray-200 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" >
                Update
              </button>
          </div>

        </form>

      </div>
    </div>
  </div>

  <UpdateSuccessfulModal update-successful="update-successful" v-model="alertOpen" />

</template>

<script setup>
import FormErrorMsg from "@/components/generic/FormErrorMsg.vue";
import { useConfigStore } from "@/stores/ConfigStore";
import { useLoading } from 'vue-loading-overlay'
import TextField from "@/components/config/form_elements/TextField.vue";
import SelectField from "@/components/config/form_elements/SelectField.vue";
import CheckboxField from "@/components/config/form_elements/CheckboxField.vue";
import UpdateSuccessfulModal from "@/components/config/UpdateSuccessfulModal.vue";
import { ref } from "vue";

const $loading = useLoading({
  // options
});

const updateSuccessful = ref(false);
const alertOpen = ref(false);
const configStore = useConfigStore();

let form_error_message = "";

let mdnsID = configStore.mdnsID;
let TZoffset = configStore.TZoffset;
let tempUnit = configStore.tempUnit;
let smoothFactor = configStore.smoothFactor;
let invertTFT = configStore.invertTFT;


function updateCachedSettings() {
  mdnsID = configStore.mdnsID;
  TZoffset = configStore.TZoffset;
  tempUnit = configStore.tempUnit;
  smoothFactor = configStore.smoothFactor;
  invertTFT = configStore.invertTFT;
}


async function submitForm() {
  // Validate the information in the form
  form_error_message = "";
  let mdns_re = new RegExp("^[a-zA-Z0-9]+[-a-zA-Z0-9]*$");

  if(!mdnsID.match(mdns_re)) {
    form_error_message = "mDNS ID can only consist of the letters a-z, a hyphen, or numbers, and must not start with a hyphen";
    return;
  }

  if(mdnsID.length > 31 || mdnsID.length < 8) {
    form_error_message = "mDNS ID must be between 8 and 31 characters";
    return;
  }

  if(parseInt(smoothFactor) > 99 || parseInt(smoothFactor) < 0) {
    form_error_message = "Specific gravity smoothing factor must be between 0 and 99";
    return;
  }

  if(parseInt(TZoffset) > 14 || parseInt(TZoffset) < -12) {
    form_error_message = "Timezone offset must be between -12 and 14";
    return;
  }

  // If there isn't a validation error, submit the form
  let loader = $loading.show({});
  configStore.updateDeviceConfig(
    mdnsID,
    parseInt(TZoffset),
    tempUnit,
    parseInt(smoothFactor),
    invertTFT,
  ).then(() => {
    updateCachedSettings();
    loader.hide();
    updateSuccessful.value = !configStore.configUpdateError;  // configUpdateError is inverted from what we want here
    alertOpen.value = true;
  });
}

</script>


<style scoped>

</style>