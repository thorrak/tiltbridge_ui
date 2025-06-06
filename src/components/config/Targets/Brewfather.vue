<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="flex-initial md:container">
      <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow">

        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ $t('cloud_config.brewfather.header') }}
          </h3>
        </div>

        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h4 class="text-lg leading-6 font-medium text-gray-900">
            {{ $t('cloud_config.brewfather.about_header') }}
          </h4>
          <p>
            {{ $t('cloud_config.brewfather.about_text') }}
          </p>
        </div>

        <form @submit.prevent="submitForm">
          <div class="px-4 py-5">
            <!-- Stream Key Field -->
            <TextField v-model="brewfatherKey" placeholder="Your Brewfather Stream Key">
              <template #FieldName>{{ $t('cloud_config.brewfather.api_key') }}</template>
              <template #FieldDescription>{{ $t('cloud_config.brewfather.api_key_desc') }}</template>
            </TextField>

            <FormErrorMsg :form_error_message="form_error_message" v-if="form_error_message.length > 0" />
          </div>

          <!-- Card Footer -->
          <div class="bg-white px-4 py-5 border-t border-gray-200 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
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
import { ref } from "vue";
import { useConfigStore } from "@/stores/ConfigStore";
import TextField from "@/components/config/form_elements/TextField.vue";
import FormErrorMsg from "@/components/generic/FormErrorMsg.vue";
import UpdateSuccessfulModal from "@/components/config/UpdateSuccessfulModal.vue";
import {useLoading} from "vue-loading-overlay";
import {i18n} from "@/main";

const configStore = useConfigStore();
const brewfatherKey = ref(configStore.brewfatherKey);
let form_error_message = ref("");

const updateSuccessful = ref(false);
const alertOpen = ref(false);

const $loading = useLoading({
  // options
});

function updateCachedSettings() {
  brewfatherKey.value = configStore.brewfatherKey;
}

async function submitForm() {
  form_error_message.value = "";

  // if (!brewfatherKey.value) {
  //   form_error_message.value = i18n.global.t('cloud_config.brewfather.error_missing_api_key');
  //   return;
  // }

  // Check if brewfatherKey.value is a URL (starts with http:// or https://)
  if (brewfatherKey.value.match(/^https?:\/\//)) {
    // The user is supposed to have extracted the ID from the URL, but if they didn't, we can try to extract it for them
    const urlParams = new URLSearchParams(brewfatherKey.value.split('?')[1]);
    const id = urlParams.get('id');
    if (id) {
      // If the ID is found, set brewfatherKey.value to the ID
      brewfatherKey.value = id;
    } else {
      // If the ID is not found, show an error message
      form_error_message.value = i18n.global.t('cloud_config.brewfather.error_invalid_stream_key');
      return;
    }
  }


  let loader = $loading.show({});

  configStore.updateBrewfatherConfig(brewfatherKey.value).then(() => {
    // updateCachedSettings();
    loader.hide();
    updateSuccessful.value = !configStore.configUpdateError;  // configUpdateError is inverted from what we want here
    alertOpen.value = true;
  });

}
</script>
