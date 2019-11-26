export const AXES_DEF = {
    x: 'Pitch',
    y: 'Roll',
    z: 'Yaw',
};

export const PUBNUB_MESSAGES = {
    ARM: () => 'arm',
    LAND: () => 'land',
    RETURN_TO_LAUNCH: () => 'rtl',
    ALT: h => `alt ${h}`,
    GOTO: (lat, lng) => `goto ${lat} ${lng}`,
    CIRCLE: (radius, turnRate) => `circle ${radius} ${turnRate}`,
    FIRE: () => 'fire',
    MOVE: (dir) => `move ${dir}`,
    CAMERA: (dir, param) => `cam ${dir} ${param}`, // Camera Controls
    CLICK_FRAME: (x, y) => `clickframe ${x} ${y}`, // Clicking on the video frame
    CAPTURE_IMAGE: () => `capture`, // Capture a still image

};

export const PUBNUB_RETURNS = {
    ISARMABLE: 'isarmable',
    ARMED: 'armed',
    ALTITUDE: 'alt',
    GPSLOG: 'gpslog',
    // BATTERY: 'bat',
    // HEADING: 'heading',
    STATUS: 'telemetry',
    CAPTURED: 'captured', // Image captured
}


export const PUBNUB_CONFIG = {
    DEFAULT_CHANNEL: 'vasu',
    PUB_KEY: 'pub-c-95e02854-dc3f-4ba2-991f-48756b9475b0',
    SUB_KEY: 'sub-c-69075804-3f59-11e9-82f9-d2a672cc1cb7',
}

export const VIDEO_SERVER_URL = "http://ec2-13-233-133-20.ap-south-1.compute.amazonaws.com:8080"