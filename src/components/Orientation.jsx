import React, { useState, useContext } from 'react'
import { PUBNUB_MESSAGES, PUBNUB_RETURNS, AXES_DEF } from '../constants';

import droneImg from '../../images/drone.png';

const Orientation = () => {
    const [axes, setAxes] = useState({
        x: 0,
        y: 0,
        z: 0
    })


    const handleAxesUpdate = ({ target: { name, value } }) => {
        setAxes({ ...axes, [name]: parseInt(value) })
    }

    // const handleAxesReset = (name) => {
    //     setAxes({ ...axes, [name]: 0 })
    //     // console.log(name)
    // }

    const img_size = 200;
    const styles = {
        tiltDrone: {
            // border: '1px red dotted',

            width: `${img_size}px`,
            height: `${img_size}px`,
            margin: '0 auto',

            backgroundImage: droneImg,
            backgroundImage: `url(${droneImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center',
            backgroundSize: 'contain',

            transform: `rotateX(${axes.x}deg) rotateY(${axes.y}deg) rotateZ(${axes.z}deg)`,
        }
    }


    return (
        <div style={{ paddingRight: '20px' }}>
            <div style={styles.tiltDrone} />
        </div>
    )
}

export default Orientation
