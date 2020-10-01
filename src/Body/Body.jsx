import React from 'react';
import { NotificationContainer } from 'react-notifications';
import Settings from '../Settings/Settings';
import Scheduler from '../Scheduler/Scheduler';
import './Body.css'

const Body = () =>
    <div className="m-3">
        <Scheduler />
        <Settings />

        <NotificationContainer />
    </div>

export default Body
