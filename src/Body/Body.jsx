import React, { Component } from 'react'
import Overview from '../Overview/Overview'
import SidebarForm from '../SidebarForm/SidebarForm'
import DataConfig from '../DataConfig/DataConfig'
import Settings from '../Settings/Settings'

export class Body extends Component {
    render() {
        return (
            <div className="container-fluid">
                <Overview />

                <div className="row">
                    <SidebarForm />
                    <DataConfig />
                    <Settings />
                </div>
            </div>
        )
    }
}

export default Body
