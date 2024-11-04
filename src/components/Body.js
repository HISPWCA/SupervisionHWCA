import { CircularLoader, NoticeBox } from '@dhis2/ui';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { ME_ROUTE, ME_SETTINGS_ROUTE, USER_GROUPS_ROUTE } from '../utils/api.routes';
import {
      PAGE_DASHBOARD,
      PAGE_SUPERVISIONS,
      PAGE_SETTINGS,
      PAGE_PAYMENT,
      PAGE_FAVORIS_CREATION,
      PAGE_SCHEDULE
} from '../utils/constants';
import { BORDER_COLOR } from '../utils/couleurs';
import { loadDataStore } from '../utils/functions';
import DashboardSchedule from './DashboardSchedule';
import Dashboard from './Dashboard';
import Setting from './Setting';
import Supervision from './Supervision';
import { AiOutlineSetting } from 'react-icons/ai';
import { RxDashboard } from 'react-icons/rx';
import { GrSchedule } from 'react-icons/gr';

import { MdOutlineEditNote } from 'react-icons/md';
import translate from '../utils/translator';
import Payment from './Payment';
import Favorites from './Favorites';
import { MdStars } from 'react-icons/md';

export const Body = () => {
      const [renderPage, setRenderPage] = useState(PAGE_DASHBOARD);
      const [isDataStoreInitialized, setDataStoreInitialized] = useState(false);
      const [errorMessage, setErrorMessage] = useState(null);
      const [me, setMe] = useState(null);

      const [loadingDataStoreInitialization, setLoadingDataStoreInitialization] = useState(false);
      const [_, setLoadingMe] = useState(false);

      const [appUserGroup, setAppUserGroup] = useState(null);

      const initDataStore = async () => {
            try {
                  setLoadingDataStoreInitialization(true);
                  loadUserSettings();
                  await loadDataStore(process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_INDICATORS_CONFIG_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_SUPERVISIONS_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_ANALYSES_CONFIG_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_PERFORMANCE_FAVORITS_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_BACKGROUND_INFORMATION_FAVORITS_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_MISSIONS_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_VISUALIZATION_KEY, null, null, []);

                  await loadDataStore(process.env.REACT_APP_CROSS_CUT_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_INDICATORS_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_DE_COMPLETNESS_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_INDICATORS_MAPPING_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_DS_COMPLETNESS_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_PERIODS_CONFIG_KEY, null, null, {
                        periods: [],
                        month1KeyWords: [],
                        month2KeyWords: [],
                        month3KeyWords: []
                  });
                  await loadDataStore(process.env.REACT_APP_GLOBAL_SETTING_KEY, null, null, {
                        DQR: {
                              nbrIndicator: 5,
                              nbrRecoupement: 3,
                              nbrConsistencyOverTime: 1,
                              nbrDataElementCompleteness: 6,
                              nbrSourceDocumentCompleteness: 7
                        },
                        ERDQ: { nbrIndicator: 3, nbrRecoupement: 3 }
                  });
                  await loadMe();
                  setDataStoreInitialized(true);
                  setLoadingDataStoreInitialization(false);
            } catch (err) {
                  setErrorMessage(err?.response?.data?.message || err.message);
                  setLoadingDataStoreInitialization(false);
            }
      };

      const initAppUserGroup = async () => {
            try {
                  const existedGroup = await axios.get(
                        `${USER_GROUPS_ROUTE}.json?fields=id&filter=name:eq:${process.env.REACT_APP_USER_GROUP}`
                  );
                  if (existedGroup.data.userGroups.length === 0) {
                        await axios.post(`${USER_GROUPS_ROUTE}.json`, { name: process.env.REACT_APP_USER_GROUP });
                        const createdUserGroup = await axios.get(
                              `${USER_GROUPS_ROUTE}.json?fields=id&filter=name:eq:${process.env.REACT_APP_USER_GROUP}`
                        );

                        if (createdUserGroup.data.userGroups.length === 0) {
                              throw new Error('User group creation error !');
                        }
                        setAppUserGroup(createdUserGroup.data.userGroups[0]);
                  } else {
                        setAppUserGroup(existedGroup.data.userGroups[0]);
                  }
            } catch (err) {
                  setErrorMessage(err?.response?.data?.message || err.message);
            }
      };

      const loadMe = async () => {
            try {
                  setLoadingMe(true);
                  const meResponse = await axios.get(
                        `${ME_ROUTE},username,organisationUnits[id,displayName],authorities,userGroups`
                  );
                  setMe(meResponse.data);
                  setLoadingMe(false);
            } catch (err) {
                  console.log(err);
                  setLoadingMe(false);
                  throw err;
            }
      };

      const loadUserSettings = async () => {
            try {
                  const response = await axios.get(`${ME_SETTINGS_ROUTE}`);
                  localStorage.setItem('userLang', response.data?.keyUiLocale ? response.data?.keyUiLocale : 'fr');
            } catch (err) {
                  console.log(err);
                  throw err;
            }
      };

      const handleClickMenu = currentRenderPage => {
            setRenderPage(currentRenderPage);
      };

      const isAuthorised = () => {
            if (me) {
                  if (me.authorities?.includes('ALL')) return true;

                  if (me.userGroups?.map(uGrp => uGrp.id)?.includes(appUserGroup?.id)) return true;
            }
            return false;
      };

      const RenderMenu = () => (
            <div
                  style={{
                        borderRight: `1px solid ${BORDER_COLOR}`,
                        width: '250px',
                        height: '100%',
                        padding: '2px 0px',
                        position: 'relative'
                  }}
            >
                  <div
                        className={`menu-item ${renderPage === PAGE_DASHBOARD ? 'active' : ''}`}
                        onClick={_ => handleClickMenu(PAGE_DASHBOARD)}
                  >
                        <span>
                              <RxDashboard style={{ fontSize: '22px' }} />
                        </span>
                        <span style={{ marginLeft: '10px' }}>{translate('Dashboard')}</span>
                  </div>
                  <div
                        className={`menu-item ${renderPage === PAGE_SCHEDULE ? 'active' : ''}`}
                        onClick={_ => handleClickMenu(PAGE_SCHEDULE)}
                  >
                        <span>
                              <GrSchedule style={{ fontSize: '22px' }} />
                        </span>
                        <span style={{ marginLeft: '10px' }}>{translate('Supervision_Schedule')}</span>
                  </div>

                  <div
                        className={`menu-item ${renderPage === PAGE_SUPERVISIONS ? 'active' : ''}`}
                        onClick={_ => handleClickMenu(PAGE_SUPERVISIONS)}
                  >
                        <span>
                              <MdOutlineEditNote style={{ fontSize: '22px' }} />
                        </span>
                        <span style={{ marginLeft: '10px' }}>{translate('Planifications')}</span>
                  </div>

                  {isAuthorised() && (
                        <div
                              className={`menu-item ${renderPage === PAGE_FAVORIS_CREATION ? 'active' : ''}`}
                              onClick={_ => handleClickMenu(PAGE_FAVORIS_CREATION)}
                        >
                              <span>
                                    <MdStars style={{ fontSize: '22px' }} />
                              </span>
                              <span style={{ marginLeft: '10px' }}>{translate('Create_Favorites')}</span>
                        </div>
                  )}

                  {isAuthorised() && (
                        <div
                              className={`menu-item ${renderPage === PAGE_SETTINGS ? 'active' : ''}`}
                              onClick={_ => handleClickMenu(PAGE_SETTINGS)}
                        >
                              <span>
                                    <AiOutlineSetting style={{ fontSize: '22px' }} />
                              </span>
                              <span style={{ marginLeft: '10px' }}>{translate('Parametres')}</span>
                        </div>
                  )}

                  <div
                        style={{
                              fontSize: '10px',
                              position: 'absolute',
                              bottom: '0px',
                              textAlign: 'center',
                              color: '#00000080',
                              marginBottom: '10px',
                              width: '100%'
                        }}
                  >
                        <a target="_blank" href="https://hispwca.org/hispwca/">
                              <span style={{ marginRight: '10px' }}>Hisp West and Central Africa</span>( Version :{' '}
                              {process.env.REACT_APP_VERSION} )
                        </a>
                  </div>
            </div>
      );

      const RenderContent = () => {
            switch (renderPage) {
                  case PAGE_DASHBOARD:
                        return (
                              <div
                                    className="my-scrollable"
                                    style={{ height: '100%', width: '100%', overflowY: 'scroll' }}
                              >
                                    <Dashboard me={me} />
                              </div>
                        );

                  case PAGE_SCHEDULE:
                        return (
                              <div
                                    className="my-scrollable"
                                    style={{ height: '100%', width: '100%', overflowY: 'scroll' }}
                              >
                                    <DashboardSchedule me={me} />
                              </div>
                        );

                  case PAGE_PAYMENT:
                        return (
                              <div
                                    className="my-scrollable"
                                    style={{ height: '100%', width: '100%', overflowY: 'scroll' }}
                              >
                                    <Payment me={me} />
                              </div>
                        );

                  case PAGE_SUPERVISIONS:
                        return (
                              <div
                                    className="my-scrollable"
                                    style={{ height: '100%', width: '100%', overflowY: 'scroll' }}
                              >
                                    <Supervision me={me} />
                              </div>
                        );

                  case PAGE_FAVORIS_CREATION:
                        return (
                              <div
                                    className="my-scrollable"
                                    style={{ height: '100%', width: '100%', overflowY: 'scroll' }}
                              >
                                    <Favorites me={me} />
                              </div>
                        );

                  case PAGE_SETTINGS:
                        return (
                              <div
                                    className="my-scrollable"
                                    style={{ height: '100%', width: '100%', overflowY: 'scroll' }}
                              >
                                    <Setting me={me} />
                              </div>
                        );

                  default:
                        return (
                              <div
                                    className="my-scrollable"
                                    style={{ height: '100%', width: '100%', overflowY: 'scroll' }}
                              >
                                    <Dashboard me={me} />
                              </div>
                        );
            }
      };

      useEffect(() => {
            initAppUserGroup();
            initDataStore();
      }, []);
      return (
            <>
                  <div className="app">
                        {loadingDataStoreInitialization && (
                              <div
                                    className="my-shadow"
                                    style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          maxWidth: '500px',
                                          padding: '10px',
                                          background: '#fff',
                                          borderRadius: '5px',
                                          margin: '0px auto'
                                    }}
                              >
                                    <CircularLoader small />
                                    <span style={{ marginLeft: '20px' }}>{translate('Config_Initialization')}...</span>
                                    {/* <span style={{ marginLeft: '20px' }}>Initialisation des Configurations...</span> */}
                              </div>
                        )}
                        {isDataStoreInitialized && (
                              <div style={{ display: 'flex', height: '100%', width: '100%' }}>
                                    {RenderMenu()}
                                    {RenderContent()}
                              </div>
                        )}

                        {errorMessage && (
                              <div style={{ margin: '30px auto', maxWidth: '500px' }}>
                                    <NoticeBox error title="Initialisation du dataStore">
                                          {errorMessage}
                                    </NoticeBox>
                              </div>
                        )}
                  </div>
            </>
      );
};

export default Body;
