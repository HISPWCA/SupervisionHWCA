import React from 'react';
import Settings from '../pages/Settings';
import Scheduler from '../pages/Scheduler';
import './Body.css'

const Body = () =>
    <React.Fragment>
        <Scheduler />
        <Settings />
    </React.Fragment>

export default Body
