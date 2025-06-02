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
                // TODO - Fix this if I implement temperature calibration
                const tilt = new TiltDevice(tiltData.color, tiltData.temp, tiltData.tempUnit, tiltData.calibratedGravity, tiltData.weeks_on_battery, tiltData.sends_battery, tiltData.high_resolution, tiltData.fw_version, tiltData.rssi, tiltData.gsheets_name, tiltData.gsheets_link, 0, tiltData.latestGravity);
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

    function getColorNumber(colorName) {
        const colorMap = {
            'red': 0,
            'green': 1,
            'black': 2,
            'purple': 3,
            'orange': 4,
            'blue': 5,
            'yellow': 6,
            'pink': 7
        };
        return colorMap[colorName.toLowerCase()];
    }

    function getColorName(colorNumber) {
        const colorNames = ['Red', 'Green', 'Black', 'Purple', 'Orange', 'Blue', 'Yellow', 'Pink'];
        return colorNames[colorNumber] || 'Unknown';
    }

    return {
        tilts,
        loaded,
        tiltsError,
        tiltUpdateError,

        getTilts,
        clearTilts,
        getColorNumber,
        getColorName
    };
});
