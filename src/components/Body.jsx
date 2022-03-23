import React from 'react';
import Settings from '../pages/Settings';
import Scheduler from '../pages/Scheduler'
// import Dashboard from '../pages/dashboard'
import './Body.css'

const Body = () =>
    <React.Fragment>
        <Scheduler />
        <Settings />
        {/* <Dashboard /> */}

    </React.Fragment>

export default Body
