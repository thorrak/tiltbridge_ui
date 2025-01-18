import { defineStore } from 'pinia';
import { mande } from 'mande';
import { genCSRFOptions } from './CSRF';
import { ref } from "vue";
import { TiltDevice, TiltColors } from "@/mixins/TiltDevice";

export const useTiltStore = defineStore("TiltStore", () => {

    const tilts = ref([]);
    const loaded = ref(false);
    const tiltsError = ref(false);
    const tiltUpdateError = ref(false);

    async function getTilts() {
        const remote_api = mande("/api/json/", genCSRFOptions());
        const response = await remote_api.get();
        if (response) {
            await clearTilts();
            // We got a response. Parse the list of Tilts
            // Response is a JSON Array. Loop over it.
            for (const tiltKey in response) {
                const tiltData = response[tiltKey];
                const tilt = new TiltDevice(tiltData.color, tiltData.temp, tiltData.temp_unit, tiltData.gravity, tiltData.weeks_on_battery, tiltData.sends_battery, tiltData.high_resolution, tiltData.fw_version, tiltData.rssi, tiltData.gsheets_name, tiltData.gsheets_link);
                tilts.value.push(tilt);
            }

            loaded.value = true;
            tiltsError.value = false;
        } else {
            // We weren't able to get a response.
            // TODO - Figure out what I want to do here
            tiltsError.value = true;
        }
    }

    async function clearTilts() {
        tilts.value = [];
        loaded.value = false;
        tiltUpdateError.value = false;
    }

    return {
        tilts,
        loaded,
        tiltsError,
        tiltUpdateError,

        getTilts,
        clearTilts
    };
});
