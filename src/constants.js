export const AXES_DEF = {
    x: 'Pitch',
    y: 'Roll',
    z: 'Yaw',
};

export const PUBNUB_MESSAGES = {
    ARM: () => 'arm',
    // DISARM: () => 'disarm',
    ALT: h => `alt ${h}`,
    LAND: () => 'land',
    GOTO: (lat, lng) => `goto ${lat} ${lng}`
    // One for custom typed commands
};

export const PUBNUB_RETURNS = {
    ARMING: 'arming',
    ARMED: 'armed',
    // DISARMING: 'disarming',
    // DISARMED: 'disarmed',
    ALTITUDE: 'alt',

    GPSLOG: 'gpslog',
}
