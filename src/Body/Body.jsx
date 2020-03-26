import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CalendarView from '../CalendarView/CalendarView';
import Dashboard from '../Dashboard/Dashboard';
import Settings from '../Settings/Settings';
import TableView from '../TableView/TableView';
import { NotificationContainer } from 'react-notifications';

const Body = () => (
    <React.Fragment>
        <Tabs>

            <TabList>
                <Tab>Dashboard</Tab>

                <Tab>Calendar View</Tab>

                <Tab>Table View</Tab>

                <Tab>Settings</Tab>
            </TabList>

            <TabPanel>
                <Dashboard />
            </TabPanel>

            <TabPanel>
                <CalendarView />
            </TabPanel>

            <TabPanel>
                <TableView />
            </TabPanel>

            <TabPanel>
                <Settings />
            </TabPanel>

        </Tabs>

        <NotificationContainer />
    </React.Fragment>
)

export default Body
