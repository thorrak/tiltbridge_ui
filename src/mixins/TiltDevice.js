
export const TiltColors = [
    "Red",
    "Green",
    "Black",
    "Purple",
    "Orange",
    "Blue",
    "Yellow",
    "Pink"
]

export const TiltColorHTML = [
    "bf3636",  // Red
    "579d42",  // Green
    "333f48",  // Black (displays as dark grey)
    "551155",  // Purple
    "bf5700",  // Hook 'em Horns!
    "005f86",  // Blue
    "ffd600",  // Yellow
    "f7a399"   // Pink
]


export class TiltDevice {
    color;
    temp;
    temp_unit;
    gravity;
    weeks_on_battery;
    sends_battery = false;
    high_resolution = false;
    fw_version;
    rssi;
    gsheets_name = "";
    gsheets_link = "";

    constructor(color, temp, temp_unit, gravity, weeks_on_battery, sends_battery, high_resolution, fw_version, rssi, gsheets_name, gsheets_link) {
        this.color = color;
        this.temp = temp;
        this.temp_unit = temp_unit;
        this.gravity = gravity;
        this.weeks_on_battery = weeks_on_battery;
        this.sends_battery = sends_battery;
        this.high_resolution = high_resolution;
        this.fw_version = fw_version;
        this.rssi = rssi;
        this.gsheets_name = gsheets_name;
        this.gsheets_link = gsheets_link;
    }

    get colorHTML() {
        // Returns the HTML color code for the Tilt color
        return TiltColorHTML[TiltColors.indexOf(this.color)];
    }

    get colorStyle() {
        // Return a style string that can be used to set the background color of an element
        return "background-color: #" + this.colorHTML + ";";
    }
}
