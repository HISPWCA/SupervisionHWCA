import React from 'react';
import { NotificationContainer } from 'react-notifications';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Dashboard from '../Dashboard/Dashboard';
import Settings from '../Settings/Settings';
import Scheduler from '../Scheduler/Scheduler';

const Body = () => (
    <React.Fragment>
        <Tabs>

            <TabList>
                {/* <Tab>Dashboard</Tab> */}
<<<<<<< HEAD
                <Tab>Table View</Tab>
=======

                <Tab>Scheduler</Tab>

>>>>>>> mises a jour
                <Tab>Settings</Tab>
            </TabList>

            {/* <TabPanel>
                <Dashboard />
            </TabPanel> */}

            <TabPanel>
                <Scheduler />
            </TabPanel>

            <TabPanel>
                <Settings />
            </TabPanel>

        </Tabs>

        <NotificationContainer />
    </React.Fragment>
)

export default Body
