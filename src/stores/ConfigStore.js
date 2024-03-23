import { defineStore } from 'pinia';
import { mande } from 'mande';
import { genCSRFOptions } from './CSRF';
import { ref } from "vue";

export const useConfigStore = defineStore("ConfigStore", () => {

    const mdnsID = ref("");
    const guid = ref("");
    const invertTFT = ref(false);
    const cloudEnabled = ref(false);
    const cloudURL = ref("");
    const cloudAppID = ref("");
    const cloudClientKey = ref("");
    const update_spiffs = ref(false);
    const TZoffset = ref(0);
    const tempUnit = ref("F");
    const smoothFactor = ref(0);
    const applyCalibration = ref(false);
    const tempCorrect = ref(false);

    const brewstatusURL = ref("");
    const brewstatusPushEvery = ref(0);
    const taplistioURL = ref("");
    const taplistioPushEvery = ref(0);

    // Google Sheets (Google Scripts)
    const scriptsURL = ref("");
    const scriptsEmail = ref("");
    const scriptsRedSheetName = ref("");
    const scriptsGreenSheetName = ref("");
    const scriptsBlackSheetName = ref("");
    const scriptsPurpleSheetName = ref("");
    const scriptsOrangeSheetName = ref("");
    const scriptsBlueSheetName = ref("");
    const scriptsYellowSheetName = ref("");
    const scriptsPinkSheetName = ref("");

    const brewersFriendKey = ref("");
    const brewfatherKey = ref("");
    const userTargetURL = ref("");
    const mqttBrokerHost = ref("");
    const mqttBrokerPort = ref(0);
    const mqttUsername = ref("");
    const mqttPassword = ref("");
    const mqttTopic = ref("");
    const mqttPushEvery = ref(0);
    const have_lcd = ref(false);
    const have_led = ref(false);

    const fermentrackTargetType = ref("none"); // none, legacy, ft2, or bpr
    const fermentrackUrl = ref("");
    const fermentrackPushFrequency = ref(30);

    const tiltConfig = ref([]);

    const loaded = ref(false);
    const configError = ref(false);
    const configUpdateError = ref(false);


    async function getConfig() {
        const remote_api = mande("/settings/json/", genCSRFOptions());  // TODO - Change this to an /api/ endpoint
        const response = await remote_api.get();
        if (response) {
            mdnsID.value = response.mdnsID;
            guid.value = response.guid;
            invertTFT.value = response.invertTFT;
            cloudEnabled.value = response.cloudEnabled;
            cloudURL.value = response.cloudURL;
            cloudAppID.value = response.cloudAppID;
            cloudClientKey.value = response.cloudClientKey;
            update_spiffs.value = response.update_spiffs;
            TZoffset.value = response.TZoffset;
            tempUnit.value = response.tempUnit;
            smoothFactor.value = response.smoothFactor;
            applyCalibration.value = response.applyCalibration;
            tempCorrect.value = response.tempCorrect;
            // TODO - Update the below when the keys change
            fermentrackUrl.value = response.localTargetURL;
            fermentrackPushFrequency.value = response.localTargetPushEvery;
            brewstatusURL.value = response.brewstatusURL;
            brewstatusPushEvery.value = response.brewstatusPushEvery;
            taplistioURL.value = response.taplistioURL;
            taplistioPushEvery.value = response.taplistioPushEvery;
            
            // Google Sheets Values
            scriptsURL.value = response.scriptsURL;
            scriptsEmail.value = response.scriptsEmail;
            scriptsRedSheetName.value = response.Red.name;
            scriptsGreenSheetName.value = response.Green.name;
            scriptsBlackSheetName.value = response.Black.name;
            scriptsPurpleSheetName.value = response.Purple.name;
            scriptsOrangeSheetName.value = response.Orange.name;
            scriptsBlueSheetName.value = response.Blue.name;
            scriptsYellowSheetName.value = response.Yellow.name;
            scriptsPinkSheetName.value = response.Pink.name;
            
            brewersFriendKey.value = response.brewersFriendKey;
            brewfatherKey.value = response.brewfatherKey;
            userTargetURL.value = response.userTargetURL;
            mqttBrokerHost.value = response.mqttBrokerHost;
            mqttBrokerPort.value = response.mqttBrokerPort;
            mqttUsername.value = response.mqttUsername;
            mqttPassword.value = response.mqttPassword;
            mqttTopic.value = response.mqttTopic;
            mqttPushEvery.value = response.mqttPushEvery;
            have_lcd.value = response.have_lcd;
            have_led.value = response.have_led;

            // We got a response. Parse the list of Tilts (which are sent by color)
            // for (const tiltColorsKey in TiltColors) {
            //     const tiltColor = TiltColors[tiltColorsKey];
            //     if (tiltColor in response) {
            //         const tiltData = response[tiltColor];
            //         const tilt = new TiltDevice(tiltColor, tiltData.temp, tiltData.temp_unit, tiltData.gravity, tiltData.weeks_on_battery, tiltData.sends_battery, tiltData.high_resolution, tiltData.fw_version, tiltData.rssi, tiltData.gsheets_name, tiltData.gsheets_link);
            //         tilts.value.push(tilt);
            //     }
            // }

            loaded.value = true;
            configError.value = false;
        } else {
            // We weren't able to get a response.
            // TODO - Figure out what I want to do here
            await clearConfig();
            configError.value = true;
        }
    }


    async function clearConfig() {
        mdnsID.value = "";
        guid.value = "";
        invertTFT.value = false;
        cloudEnabled.value = false;
        cloudURL.value = "";
        cloudAppID.value = "";
        cloudClientKey.value = "";
        update_spiffs.value = false;
        TZoffset.value = 0;
        tempUnit.value = "F";
        smoothFactor.value = 0;
        applyCalibration.value = false;
        tempCorrect.value = false;
        brewstatusURL.value = "";
        brewstatusPushEvery.value = 0;
        taplistioURL.value = "";
        taplistioPushEvery.value = 0;
        scriptsURL.value = "";
        scriptsEmail.value = "";
        scriptsRedSheetName.value = "";
        scriptsGreenSheetName.value = "";
        scriptsBlackSheetName.value = "";
        scriptsPurpleSheetName.value = "";
        scriptsOrangeSheetName.value = "";
        scriptsBlueSheetName.value = "";
        scriptsYellowSheetName.value = "";
        scriptsPinkSheetName.value = "";
        brewersFriendKey.value = "";
        brewfatherKey.value = "";
        userTargetURL.value = "";
        mqttBrokerHost.value = "";
        mqttBrokerPort.value = 0;
        mqttUsername.value = "";
        mqttPassword.value = "";
        mqttTopic.value = "";
        mqttPushEvery.value = 0;
        have_lcd.value = false;
        have_led.value = false;

        loaded.value = false;
        configUpdateError.value = false;
    }

    async function updateDeviceConfig(mdnsID, TZoffset, tempUnit, smoothFactor, invertTFT) {
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
                await getConfig();  // TODO - Decide if I want to await this here
                configUpdateError.value = false;
            } else {
                // await clearConfig();
                configUpdateError.value = true;
            }
        } catch (error) {
            await clearConfig();
            configUpdateError.value = true;
        }
    }


    async function updateFermentrackConfig(targetType, ft_url, pushFrequency) {
        try {
            const remote_api = mande("/api/settings/controller/", genCSRFOptions());
            const response = await remote_api.put({
                fermentrackURL: ft_url,
                fermentrackPushEvery: pushFrequency
            });
            if (response && response.message) {
                // TODO - Check response.message
                fermentrackUrl.value = ft_url;
                fermentrackPushFrequency.value = pushFrequency;
                configUpdateError.value = false;
            } else {
                // await clearConfig();
                configUpdateError.value = true;
            }
        } catch (error) {
            await clearConfig();
            configUpdateError.value = true;
        }
    }


    async function updateGoogleSheetsConfig(gs_url, gs_email, red_name, green_name, black_name, purple_name, orange_name, blue_name, yellow_name, pink_name) {
        try {
            const remote_api = mande("/api/settings/googlesheets/", genCSRFOptions());
            const response = await remote_api.put({
                scriptsURL: gs_url,
                scriptsEmail: gs_email,
                sheetName_red: red_name,
                sheetName_green: green_name,
                sheetName_black: black_name,
                sheetName_purple: purple_name,
                sheetName_orange: orange_name,
                sheetName_blue: blue_name,
                sheetName_yellow: yellow_name,
                sheetName_pink: pink_name,
            });
            if (response && response.message) {
                // TODO - Check response.message
                scriptsURL.value = gs_url;
                scriptsEmail.value = gs_email;
                scriptsRedSheetName.value = red_name;
                scriptsGreenSheetName.value = green_name;
                scriptsBlackSheetName.value = black_name;
                scriptsPurpleSheetName.value = purple_name;
                scriptsOrangeSheetName.value = orange_name;
                scriptsBlueSheetName.value = blue_name;
                scriptsYellowSheetName.value = yellow_name;
                scriptsPinkSheetName.value = pink_name;

                configUpdateError.value = false;
            } else {
                // await clearConfig();
                configUpdateError.value = true;
            }
        } catch (error) {
            await clearConfig();
            configUpdateError.value = true;
        }
    }

    async function updateBrewersFriendConfig(brewersFriendApiKey) {
        try {
            const remote_api = mande("/api/settings/brewersfriend/", genCSRFOptions());
            const response = await remote_api.put({
                brewersFriendKey: brewersFriendApiKey,
            });
            if (response && response.message) {
                brewersFriendKey.value = brewersFriendApiKey;
                configUpdateError.value = false;
            } else {
                configUpdateError.value = true;
            }
        } catch (error) {
            configUpdateError.value = true;
        }
    }

    async function updateBrewfatherConfig(brewfather_key) {
        try {
            const remote_api = mande("/api/settings/brewfather/", genCSRFOptions());
            const response = await remote_api.put({
                brewfatherKey: brewfather_key,
            });
            if (response && response.message) {
                brewfatherKey.value = brewfather_key;
                configUpdateError.value = false;
            } else {
                configUpdateError.value = true;
            }
        } catch (error) {
            configUpdateError.value = true;
        }
    }

    async function updateMQTTConfig(host, port, username, password, topic, pushEvery) {
        try {
            const remote_api = mande('/api/settings/mqtt/', genCSRFOptions());
            const response = await remote_api.put({
                mqttBrokerHost: host,
                mqttBrokerPort: port,
                mqttUsername: username,
                mqttPassword: password,
                mqttTopic: topic,
                mqttPushEvery: pushEvery,
            });
            if (response && response.message) {
                mqttBrokerHost.value = host;
                mqttBrokerPort.value = port;
                mqttUsername.value = username;
                mqttPassword.value = password;
                mqttTopic.value = topic;
                mqttPushEvery.value = pushEvery;

                configUpdateError.value = false;
            } else {
                configUpdateError.value = true;
            }
        } catch (error) {
            configUpdateError.value = true;
        }
    }



    return {
        mdnsID,
        guid,
        invertTFT,
        cloudEnabled,
        cloudURL,
        cloudAppID,
        cloudClientKey,
        update_spiffs,
        TZoffset,
        tempUnit,
        smoothFactor,
        applyCalibration,
        tempCorrect,
        brewstatusURL,
        brewstatusPushEvery,
        taplistioURL,
        taplistioPushEvery,
        scriptsURL,
        scriptsEmail,
        scriptsRedSheetName,
        scriptsGreenSheetName,
        scriptsBlackSheetName,
        scriptsPurpleSheetName,
        scriptsOrangeSheetName,
        scriptsBlueSheetName,
        scriptsYellowSheetName,
        scriptsPinkSheetName,
        brewersFriendKey,
        brewfatherKey,
        userTargetURL,
        mqttBrokerHost,
        mqttBrokerPort,
        mqttUsername,
        mqttPassword,
        mqttTopic,
        mqttPushEvery,
        have_lcd,
        have_led,
        fermentrackTargetType,
        fermentrackUrl,
        fermentrackPushFrequency,
        tiltConfig,
        loaded,
        configError,
        configUpdateError,

        getConfig,
        clearConfig,
        updateDeviceConfig,
        updateFermentrackConfig,
        updateGoogleSheetsConfig,
        updateBrewersFriendConfig,
        updateBrewfatherConfig,
        updateMQTTConfig
    };
});
