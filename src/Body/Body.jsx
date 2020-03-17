import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Dashboard from '../Dashboard/Dashboard';
import Settings from '../Settings/Settings';

const Body = () => (
    <React.Fragment>
        <Tabs>

            <TabList>
                <Tab>Dashboard</Tab>

                <Tab>Settings</Tab>
            </TabList>

            <TabPanel>
                <Dashboard />
            </TabPanel>

            <TabPanel>
                <Settings />
            </TabPanel>

        </Tabs>
    </React.Fragment>
)

export default Body
