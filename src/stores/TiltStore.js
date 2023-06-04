import { defineStore } from 'pinia';
import { mande } from 'mande'
import { genCSRFOptions } from './CSRF';

import { TiltDevice, TiltColors } from "@/mixins/TiltDevice";

export const useTiltStore = defineStore("TiltStore", {
    state: () => {
        return {
            tilts: [],
            loaded: false,
            tiltsError: false,
            tiltUpdateError: false,
        };
    },
    actions: {
        async getTilts() {
            const remote_api = mande("/json/", genCSRFOptions());  // TODO - Change this to an /api/ endpoint
            const response = await remote_api.get();
            if (response) {
                await this.clearTilts();
                // We got a response. Parse the list of Tilts (which are sent by color)
                for (const tiltColorsKey in TiltColors) {
                    const tiltColor = TiltColors[tiltColorsKey];
                    if (tiltColor in response) {
                        const tiltData = response[tiltColor];
                        const tilt = new TiltDevice(tiltColor, tiltData.temp, tiltData.temp_unit, tiltData.gravity, tiltData.weeks_on_battery, tiltData.sends_battery, tiltData.high_resolution, tiltData.fw_version, tiltData.rssi, tiltData.gsheets_name, tiltData.gsheets_link);
                        this.tilts.push(tilt);
                    }
                }
                this.loaded = true;
                this.tiltsError = false;
            } else {
                // We weren't able to get a response.
                // TODO - Figure out what I want to do here
                this.tiltsError = true;
            }
        },
        async clearTilts() {
            this.tilts = [];
            this.loaded = false;
            this.tiltUpdateError = false;
        }
    },
});