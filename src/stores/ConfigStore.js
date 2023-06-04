import { defineStore } from 'pinia';
import { mande } from 'mande'
import { genCSRFOptions } from './CSRF';

import { TiltDevice, TiltColors } from "@/mixins/TiltDevice";

export const useConfigStore = defineStore("ConfigStore", {
    state: () => {
        return {
            mdnsID: "",
            guid: "",
            invertTFT: false,
            cloudEnabled: false,
            cloudURL: "",
            cloudAppID: "",
            cloudClientKey: "",
            update_spiffs: false,
            TZoffset: 0,
            tempUnit: "F",
            smoothFactor: 0,
            applyCalibration: false,
            tempCorrect: false,
            localTargetURL: "",
            localTargetPushEvery: 0,
            brewstatusURL: "",
            brewstatusPushEvery: 0,
            taplistioURL: "",
            taplistioPushEvery: 0,
            scriptsURL: "",
            scriptsEmail: "",
            brewersFriendKey: "",
            brewfatherKey: "",
            userTargetURL: "",
            mqttBrokerHost: "",
            mqttBrokerPort: 0,
            mqttUsername: "",
            mqttPassword: "",
            mqttTopic: "",
            mqttPushEvery: 0,
            have_lcd: false,
            have_led: false,

            tiltConfig: [],

            loaded: false,
            configError: false,
            configUpdateError: false,
        };
    },
    actions: {
        async getConfig() {
            const remote_api = mande("/settings/json/", genCSRFOptions());  // TODO - Change this to an /api/ endpoint
            const response = await remote_api.get();
            if (response) {
                this.mdnsID = response.mdnsID;
                this.guid = response.guid;
                this.invertTFT = response.invertTFT;
                this.cloudEnabled = response.cloudEnabled;
                this.cloudURL = response.cloudURL;
                this.cloudAppID = response.cloudAppID;
                this.cloudClientKey = response.cloudClientKey;
                this.update_spiffs = response.update_spiffs;
                this.TZoffset = response.TZoffset;
                this.tempUnit = response.tempUnit;
                this.smoothFactor = response.smoothFactor;
                this.applyCalibration = response.applyCalibration;
                this.tempCorrect = response.tempCorrect;
                this.localTargetURL = response.localTargetURL;
                this.localTargetPushEvery = response.localTargetPushEvery;
                this.brewstatusURL = response.brewstatusURL;
                this.brewstatusPushEvery = response.brewstatusPushEvery;
                this.taplistioURL = response.taplistioURL;
                this.taplistioPushEvery = response.taplistioPushEvery;
                this.scriptsURL = response.scriptsURL;
                this.scriptsEmail = response.scriptsEmail;
                this.brewersFriendKey = response.brewersFriendKey;
                this.brewfatherKey = response.brewfatherKey;
                this.userTargetURL = response.userTargetURL;
                this.mqttBrokerHost = response.mqttBrokerHost;
                this.mqttBrokerPort = response.mqttBrokerPort;
                this.mqttUsername = response.mqttUsername;
                this.mqttPassword = response.mqttPassword;
                this.mqttTopic = response.mqttTopic;
                this.mqttPushEvery = response.mqttPushEvery;
                this.have_lcd = response.have_lcd;
                this.have_led = response.have_led;

                // We got a response. Parse the list of Tilts (which are sent by color)
                // for (const tiltColorsKey in TiltColors) {
                //     const tiltColor = TiltColors[tiltColorsKey];
                //     if (tiltColor in response) {
                //         const tiltData = response[tiltColor];
                //         const tilt = new TiltDevice(tiltColor, tiltData.temp, tiltData.temp_unit, tiltData.gravity, tiltData.weeks_on_battery, tiltData.sends_battery, tiltData.high_resolution, tiltData.fw_version, tiltData.rssi, tiltData.gsheets_name, tiltData.gsheets_link);
                //         this.tilts.push(tilt);
                //     }
                // }
                this.loaded = true;
                this.configError = false;
            } else {
                // We weren't able to get a response.
                // TODO - Figure out what I want to do here
                this.clearConfig();
                this.configError = true;
            }
        },
        async clearConfig() {
            this.mdnsID = "";
            this.guid = "";
            this.invertTFT = false;
            this.cloudEnabled = false;
            this.cloudURL = "";
            this.cloudAppID = "";
            this.cloudClientKey = "";
            this.update_spiffs = false;
            this.TZoffset = 0;
            this.tempUnit = "F";
            this.smoothFactor = 0;
            this.applyCalibration = false;
            this.tempCorrect = false;
            this.localTargetURL = "";
            this.localTargetPushEvery = 0;
            this.brewstatusURL = "";
            this.brewstatusPushEvery = 0;
            this.taplistioURL = "";
            this.taplistioPushEvery = 0;
            this.scriptsURL = "";
            this.scriptsEmail = "";
            this.brewersFriendKey = "";
            this.brewfatherKey = "";
            this.userTargetURL = "";
            this.mqttBrokerHost = "";
            this.mqttBrokerPort = 0;
            this.mqttUsername = "";
            this.mqttPassword = "";
            this.mqttTopic = "";
            this.mqttPushEvery = 0;
            this.have_lcd = false;
            this.have_led = false;




            this.tilts = [];
            this.loaded = false;
            this.configUpdateError = false;
        },
        async updateDeviceConfig(mdnsID, TZoffset, tempUnit, smoothFactor, invertTFT) {
            try {
                const remote_api = mande("/api/settings/controller/", genCSRFOptions());
                const response = await remote_api.put({
                    mdnsID: mdnsID,
                    tzOffset: TZoffset,
                    tempUnit: tempUnit,
                    smoothFactor: smoothFactor,
                    invertTFT: invertTFT,
                });
                if (response && response.message) {
                    // TODO - Check response.message
                    await this.getConfig();  // TODO - Decide if I want to await this here
                    this.configUpdateError = false;
                } else {
                    // await this.clearConfig();
                    this.configUpdateError = true;
                }
            } catch (error) {
                await this.clearConfig();
                this.configUpdateError = true;
            }
        }
    },
});