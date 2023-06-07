import { CircularLoader, NoticeBox } from '@dhis2/ui'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { ME_ROUTE } from '../utils/api.routes'
import { PAGE_DASHBOARD, PAGE_SUPERVISIONS, PAGE_SETTINGS } from "../utils/constants"
import { BORDER_COLOR } from '../utils/couleurs'
import { loadDataStore } from '../utils/functions'
import Dashboard from './Dashboard'
import Setting from './Setting'
import Supervision from './Supervision'
import { AiOutlineSetting } from 'react-icons/ai'
import { RxDashboard } from 'react-icons/rx'
import { MdOutlineEditNote } from 'react-icons/md'



export const Body = () => {
    const [renderPage, setRenderPage] = useState(PAGE_DASHBOARD)
    const [isDataStoreInitialized, setDataStoreInitialized] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [me, setMe] = useState(null)

    const [loadingDataStoreInitialization, setLoadingDataStoreInitialization] = useState(false)
    const [_, setLoadingMe] = useState(false)

    const initDataStore = async () => {
        try {
            setLoadingDataStoreInitialization(true)
            await loadDataStore(process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY, null, null, [])
            await loadDataStore(process.env.REACT_APP_INDICATORS_CONFIG_KEY, null, null, [])
            await loadDataStore(process.env.REACT_APP_SUPERVISIONS_KEY, null, null, [])
            await loadDataStore(process.env.REACT_APP_ANALYSES_CONFIG_KEY, null, null, [])
            await loadMe()
            setDataStoreInitialized(true)
            setLoadingDataStoreInitialization(false)
        } catch (err) {
            setErrorMessage(err?.response?.data?.message || err.message)
            setLoadingDataStoreInitialization(false)
        }
    }

    const loadMe = async () => {
        try {
            setLoadingMe(true)
            const meResponse = await axios.get(`${ME_ROUTE},organisationUnits`)
            setMe(meResponse.data)
            setLoadingMe(false)
        }
        catch (err) {
            console.log(err)
            setLoadingMe(false)
            throw err
        }
    }

    const handleClickMenu = (currentRenderPage) => {
        setRenderPage(currentRenderPage)
    }

    const RenderMenu = () => (
        <div style={{ borderRight: `1px solid ${BORDER_COLOR}`, width: '250px', height: '100%', padding: '2px 0px' }}>
            <div className={`menu-item ${renderPage === PAGE_DASHBOARD ? 'active' : ''}`} onClick={_ => handleClickMenu(PAGE_DASHBOARD)}>
                <span><RxDashboard style={{ fontSize: '22px' }} /></span>
                <span style={{ marginLeft: '10px' }}>Dashboard</span>
            </div>

            <div className={`menu-item ${renderPage === PAGE_SUPERVISIONS ? 'active' : ''}`} onClick={_ => handleClickMenu(PAGE_SUPERVISIONS)}>
                <span><MdOutlineEditNote style={{ fontSize: '22px' }} /></span>
                <span style={{ marginLeft: '10px' }}>Planifications</span>
            </div>

            <div className={`menu-item ${renderPage === PAGE_SETTINGS ? 'active' : ''}`} onClick={_ => handleClickMenu(PAGE_SETTINGS)}>
                <span><AiOutlineSetting style={{ fontSize: '22px' }} /></span>
                <span style={{ marginLeft: '10px' }}>Settings</span>
            </div>
        </div>
    )

    const RenderContent = () => {
        switch (renderPage) {

            case PAGE_DASHBOARD:
                return (
                    <div className='my-scrollable' style={{ height: '100%', width: '100%', overflowY: 'scroll' }}>
                        <Dashboard />
                    </div>
                )

            case PAGE_SUPERVISIONS:
                return (
                    <div className='my-scrollable' style={{ height: '100%', width: '100%', overflowY: 'scroll' }}>
                        <Supervision me={me} />
                    </div>
                )

            case PAGE_SETTINGS:
                return (
                    <div className='my-scrollable' style={{ height: '100%', width: '100%', overflowY: 'scroll' }}>
                        <Setting />
                    </div>
                )

            default:
                return (
                    <div className='my-scrollable' style={{ height: '100%', width: '100%', overflowY: 'scroll' }}>
                        <Dashboard />
                    </div>
                )
        }
    }


    useEffect(() => {
        initDataStore()
    }, [])
    return (
        <>
            <div className='app'>
                {
                    loadingDataStoreInitialization && (
                        <div className='my-shadow' style={{ display: 'flex', alignItems: 'center', maxWidth: '500px', padding: '10px', background: '#fff', borderRadius: '5px', margin: '0px auto' }}>
                            <CircularLoader small />
                            <span style={{ marginLeft: '20px' }}>Initialization du dataStore...</span>
                        </div>
                    )
                }
                {
                    isDataStoreInitialized && (
                        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
                            {RenderMenu()}
                            {RenderContent()}
                        </div>
                    )
                }

                {
                    errorMessage && (
                        <div style={{ margin: '30px auto', maxWidth: '500px' }}>
                            <NoticeBox error title="Initialisation du dataStore">
                                {errorMessage}
                            </NoticeBox>
                        </div>
                    )
                }

            </div>
        </>
    )
}


export default Body