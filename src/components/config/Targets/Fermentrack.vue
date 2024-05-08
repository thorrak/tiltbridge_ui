<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="flex-initial md:container">
      <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow">

        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ $t('cloud_config.fermentrack.header') }}
          </h3>
        </div>

        <form @submit.prevent="submitForm">

          <div class="px-4 py-5">
            <!-- TODO - Add "Target Type" selector here -->


            <!-- Target URL Field -->
            <TextField v-model="ft_url" placeholder="https://www.fermentrack.net/">
              <template #FieldName>{{ $t('cloud_config.fermentrack.url') }}</template>
              <template #FieldDescription>{{ $t('cloud_config.fermentrack.url_desc') }}</template>
            </TextField>

            <!-- Target Push Frequency Field -->
            <TextField v-model="pushFrequency" placeholder="60">
              <template #FieldName>{{ $t('cloud_config.fermentrack.push_frequency') }}</template>
              <template #FieldDescription>{{ $t('cloud_config.fermentrack.push_frequency_desc') }}</template>
            </TextField>

            <FormErrorMsg :form_error_message="form_error_message" v-if="form_error_message.length > 0" />

          </div>

          <!-- Card Footer -->
          <div class="bg-white px-4 py-5 border-t border-gray-200 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" >
              {{ $t('sitewide.update') }}
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
import { i18n } from "@/main.js";

const $loading = useLoading({
  // options
});

const updateSuccessful = ref(false);
const alertOpen = ref(false);
const configStore = useConfigStore();

let form_error_message = ref("");


const targetType = ref(configStore.fermentrackTargetType);
const ft_url = ref(configStore.fermentrackHost);
const pushFrequency = ref(configStore.fermentrackPushFrequency);

function updateCachedSettings() {
  targetType.value = configStore.fermentrackTargetType;
  ft_url.value = configStore.fermentrackUrl;
  pushFrequency.value = configStore.fermentrackPushFrequency;
}


async function submitForm() {
  form_error_message.value = "";



  if (!ft_url.value) {
    // If the URL is blank, then we can assume that the user wants to disable the target. Set the pushFrequency to 60
    // and submit the form.
    ft_url.value = "";
    pushFrequency.value = 60;
  } else if ((!ft_url.value.startsWith("http://") && !ft_url.value.startsWith("https://")) || ft_url.value.length < 12) {
    // If the URL is not blank, but doesn't start with http:// or https://, or is too short, then it's invalid.
    form_error_message.value = i18n.global.t('cloud_config.fermentrack.url_invalid');
    return;
  } else {
    // We have a valid URL, so we need to make sure that the pushFrequency is set to a valid value.
    if (!pushFrequency.value || isNaN(parseInt(pushFrequency.value))) {
      form_error_message.value = i18n.global.t('cloud_config.fermentrack.push_frequency_invalid');
      return;
    }
    if(parseInt(pushFrequency.value) > 43200 || parseInt(pushFrequency.value) < 30) {
      form_error_message.value = i18n.global.t('cloud_config.fermentrack.push_frequency_out_of_range');
      return;
    }
  }

  // If there isn't a validation error, submit the form
  let loader = $loading.show({});
  configStore.updateFermentrackConfig(
      targetType.value,
      ft_url.value,
      parseInt(pushFrequency.value)
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