import React from 'react';
import Settings from '../Settings/Settings';
import Scheduler from '../Scheduler/Scheduler';
import './Body.css'

const Body = () =>
    <React.Fragment>
        <Scheduler />
        <Settings />
    </React.Fragment>

export default Body
