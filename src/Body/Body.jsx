import React from 'react';
import { NotificationContainer } from 'react-notifications';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Dashboard from '../Dashboard/Dashboard';
import Settings from '../Settings/Settings';
import Scheduler from '../Scheduler/Scheduler';
import './Body.css'

const Body = () => (
    <div className="m-3">
        <Scheduler />
        <Settings />

        <NotificationContainer />

        {/* <Tabs> */}

        {/* <TabList> */}
        {/* <Tab>Dashboard</Tab> */}
        {/* <Tab>Scheduler</Tab> */}

        {/* <Tab>Settings</Tab> */}
        {/* </TabList> */}

        {/* <TabPanel>
                <Dashboard />
            </TabPanel> */}

        {/* <TabPanel>
            </TabPanel> */}

        {/* <TabPanel>
            </TabPanel> */}

        {/* </Tabs> */}

    </div>
)

export default Body
