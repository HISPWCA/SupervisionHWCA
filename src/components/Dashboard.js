import { useState, useEffect } from 'react';
import { Col, DatePicker, Row, Select } from 'antd';
import { dayjsLocalizer } from 'react-big-calendar';
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import {
      ORGANISATION_UNITS_LEVELS_ROUTE,
      ORGANISATION_UNITS_ROUTE,
      SERVER_URL,
      TRACKED_ENTITY_INSTANCES_ROUTE
} from '../utils/api.routes';
import {
      NOTICE_BOX_DEFAULT,
      NOTIFICATION_CRITICAL,
      NA,
      SCHEDULED,
      MES_PLANIFICATIONS,
      DESCENDANTS,
      TYPE_GENERATION_AS_EVENT
} from '../utils/constants';
import { loadDataStore } from '../utils/functions';
import MyNotification from './MyNotification';
import { Button } from '@dhis2/ui';
import { v4 as uuid } from 'uuid';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import translate from '../utils/translator';
import VisualizationItem from './VisualizationItem';
import MyFrame from './MyFrame';
import { ImPrinter } from 'react-icons/im';
import OrganisationUnitsTree from './OrganisationUnitsTree';
import { FaSearch } from 'react-icons/fa';

const quarterOfYear = require('dayjs/plugin/quarterOfYear');
const weekOfYear = require('dayjs/plugin/weekOfYear');

dayjs.extend(weekOfYear);
dayjs.extend(quarterOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.locale('fr-FR');

const localizer = dayjsLocalizer(dayjs);

export const getDefaultStatusSupervisionIfStatusIsNull = _ => SCHEDULED.value;
export const getDefaultStatusPaymentIfStatusIsNull = _ => NA.value;
export const Dashboard = ({ me }) => {
      const [organisationUnits, setOrganisationUnits] = useState([]);
      const [organisationUnitLevels, setOrganisationUnitLevels] = useState([]);
      const [teiList, setTeiList] = useState([]);

      const [dataStoreSupervisionsConfigs, setDataStoreSupervisionsConfigs] = useState([]);
      const [dataStoreMissions, setDataStoreMissions] = useState([]);
      const [dataStoreVisualizations, setDataStoreVisualizations] = useState([]);

      const [notification, setNotification] = useState({
            show: false,
            message: null,
            type: null
      });

      const [selectedMission, setSelectedMission] = useState(null);
      const [selectedOrganisationUnit, setSelectedOrganisationUnit] = useState(null);
      const [selectedLevel, setSelectedLevel] = useState(null);
      const [selectedPeriod, setSelectedPeriod] = useState(dayjs(new Date()));
      const [selectedPeriods, setSelectedPeriods] = useState([dayjs().startOf('month'), dayjs()]);
      const [selectedProgram, setSelectedProgram] = useState(null);

      const [loadingOrganisationUnits, setLoadingOrganisationUnits] = useState(false);
      const [loadingDataStoreVisualizations, setLoadingDataStoreVisualizations] = useState(false);
      const [loadingDataStoreSupervisionsConfigs, setLoadingDataStoreSupervisionsConfigs] = useState(false);
      const [loadingInjection, setLoadingInjection] = useState(false);

      const [loadingDataStoreMissions, setLoadingDataStoreMissions] = useState(false);
      const [loadingTeiList, setLoadingTeiList] = useState(false);
      const [loadingOrganisationUnitLevels, setLoadingOrganisationUnitLevels] = useState(false);

      const loadDataStoreMissions = async () => {
            try {
                  setLoadingDataStoreMissions(true);
                  const response = await loadDataStore(process.env.REACT_APP_MISSIONS_KEY, null, null, null);
                  setDataStoreMissions(response || []);
                  setLoadingDataStoreMissions(false);
                  return response;
            } catch (err) {
                  setLoadingDataStoreMissions(false);
            }
      };

      const loadOrganisationUnitLevels = async () => {
            try {
                  setLoadingOrganisationUnitLevels(true);
                  const response = await axios.get(ORGANISATION_UNITS_LEVELS_ROUTE);
                  setOrganisationUnitLevels(response.data.organisationUnitLevels || []);
                  setLoadingOrganisationUnitLevels(false);
                  return response;
            } catch (err) {
                  setLoadingOrganisationUnitLevels(false);
            }
      };

      const loadOrganisationUnits = async () => {
            try {
                  setLoadingOrganisationUnits(true);
                  const response = await axios.get(ORGANISATION_UNITS_ROUTE);
                  const orgUnits = response.data.organisationUnits;
                  // const progs = await loadDataStoreSupervisionsConfigs();

                  setOrganisationUnits(orgUnits);
                  // if (progs.length > 0) {
                  //       const currentProgram = progs[0];
                  //       const currentOrgUnit = orgUnits.find(ou => ou.id === me?.organisationUnits?.[0]?.id);
                  //       const currentPeriod = dayjs();

                  //       if (currentProgram) {
                  //             setSelectedProgram(currentProgram);
                  //             setSelectedOrganisationUnit(currentOrgUnit);
                  //             setSelectedPeriod(currentPeriod);
                  //       }
                  // }

                  setLoadingOrganisationUnits(false);
            } catch (err) {
                  setLoadingOrganisationUnits(false);
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const loadDataStoreSupervisionsConfigs = async () => {
            try {
                  setLoadingDataStoreSupervisionsConfigs(true);
                  const response = await loadDataStore(process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY, null, null, null);

                  const currentProgram = response[0];
                  if (currentProgram) {
                        setSelectedProgram(currentProgram);
                  }
                  setDataStoreSupervisionsConfigs(response);
                  setLoadingDataStoreSupervisionsConfigs(false);
                  return response;
            } catch (err) {
                  setLoadingDataStoreSupervisionsConfigs(false);
                  throw err;
            }
      };

      const loadDataStoreVisualizations = async () => {
            try {
                  setLoadingDataStoreVisualizations(true);
                  const response = await loadDataStore(process.env.REACT_APP_VISUALIZATION_KEY, null, null, null);

                  setDataStoreVisualizations(response);
                  setLoadingDataStoreVisualizations(false);
                  return response;
            } catch (err) {
                  setLoadingDataStoreVisualizations(false);
                  throw err;
            }
      };

      const handleSelectPeriodRange = (_, periodString) => {
            setSelectedPeriods(periodString);
      };

      const printReportAsPDF = async () => {
            let reportDocument = document.querySelector('[id="visualizations-container"]');

            reportDocument.querySelectorAll('canvas').forEach(cv => {
                  const current_canvas_parent = cv.parentElement;
                  const current_canvas_url = cv.toDataURL();
                  current_canvas_parent.innerHTML = "<img src='" + current_canvas_url + "' />";
            });

            const iframeList = reportDocument.querySelectorAll('iframe');
            for (let ifr of iframeList) {
                  const canvas = await window.html2canvas(ifr.contentWindow.document.body);
                  if (canvas) {
                        const current_iframe_parent = ifr.parentElement;
                        const current_iframe_url = canvas.toDataURL();
                        current_iframe_parent.innerHTML = "<img src='" + current_iframe_url + "' />";
                        ifr.replaceWith("<img src='" + current_iframe_url + "' />");
                  }
            }

            const win = window.open('', '', 'height=1000,width=1000');

            win.document.write(`<!DOCTYPE html><head></head>`);
            win.document.write(`<body lang="en">`);
            win.document.write(reportDocument.innerHTML);
            win.document.write(`</body></html>`);

            win.document.close();
            win.print();
      };

      const handleSelectMission = value => {
            if (value) {
                  setSelectedMission(dataStoreMissions.find(m => m.id === value));
            }
      };

      const handleSelectLevel = value => {
            if (value) {
                  setSelectedLevel(organisationUnitLevels.find(m => m.id === value));
            }
      };

      const handleSelectProgram = value => {
            if (value) {
                  const supFound = dataStoreSupervisionsConfigs.find(d => d.program?.id === value);
                  setSelectedMission(null);
                  setSelectedProgram(supFound);

                  setDataStoreMissions(dataStoreMissions.filter(m => m.program?.id === supFound?.program?.id) || []);
            }
      };

      const handleSearch = () => {
            if (selectedPeriods.length > 0 && selectedOrganisationUnit && selectedProgram && selectedLevel) {
                  loadTEIS(selectedProgram.program?.id, selectedOrganisationUnit.id);
            }
      };

      const filterAndGetPlanfications = () =>
            teiList
                  .reduce((prev, current) => {
                        if (selectedProgram.generationType === TYPE_GENERATION_AS_EVENT) {
                              const eventList = [];
                              const currentEnrollment = current.enrollments?.filter(
                                    en => en.program === selectedProgram?.program?.id
                              )[0];

                              for (let event of currentEnrollment?.events || []) {
                                    if (event.eventDate) {
                                          if (
                                                (dayjs(event.eventDate).isAfter(dayjs(selectedPeriods[0])) &&
                                                      dayjs(event.eventDate).isBefore(dayjs(selectedPeriods[1]))) ||
                                                (dayjs(event.eventDate).isSame(dayjs(selectedPeriods[0])) &&
                                                      dayjs(event.eventDate).isSame(dayjs(selectedPeriods[1])))
                                          )
                                                eventList.push(event);
                                    }
                              }

                              return [
                                    ...prev,
                                    ...eventList.map(ev => ({
                                          trackedEntityInstance: currentEnrollment?.trackedEntityInstance,
                                          period: ev.eventDate,
                                          orgUnit: currentEnrollment?.orgUnit
                                    }))
                              ];
                        }

                        return prev;
                  }, [])
                  .filter(planification => {
                        if (selectedPlanification === MES_PLANIFICATIONS)
                              return planification.superviseurs?.includes(me?.displayName);

                        if (selectedPlanification === PLANIFICATION_PAR_MOI)
                              return me?.username?.toLowerCase() === planification.storedBy?.toLowerCase();

                        if (selectedPlanification === PLANIFICATION_PAR_TOUS) return true;

                        if (selectedPlanification === PLANIFICATION_PAR_UN_USER) return false;

                        return true;
                  })
                  .sort((a, b) => parseInt(dayjs(b.period).valueOf()) - parseInt(dayjs(a.period).valueOf()));
                  
      const RenderFilters = () => (
            <>
                  <div
                        className="my-shadow"
                        style={{
                              backgroundColor: '#fff',
                              padding: '10px',
                              marginTop: '5px',
                              marginBottom: '20px',
                              borderRadius: '8px',
                              position: 'sticky',
                              top: '0px',
                              zIndex: '10'
                        }}
                  >
                        <Row gutter={[8, 8]} align="middle">
                              <Col sm={24} md={4}>
                                    <div style={{ marginBottom: '2px' }}>{translate('Programme')}</div>
                                    <Select
                                          placeholder={translate('Programme')}
                                          onChange={handleSelectProgram}
                                          value={selectedProgram?.program?.id}
                                          style={{ width: '100%' }}
                                          options={dataStoreSupervisionsConfigs.map(d => ({
                                                value: d.program?.id,
                                                label: d.program?.displayName
                                          }))}
                                          loading={loadingDataStoreSupervisionsConfigs}
                                    />
                              </Col>

                              {selectedProgram && (
                                    <Col sm={24} md={5}>
                                          <div style={{ marginBottom: '2px' }}>{translate('Unite_Organisation')}</div>
                                          <OrganisationUnitsTree
                                                meOrgUnitId={me?.organisationUnits[0]?.id}
                                                orgUnits={organisationUnits}
                                                currentOrgUnits={selectedOrganisationUnit}
                                                setCurrentOrgUnits={setSelectedOrganisationUnit}
                                                loadingOrganisationUnits={loadingOrganisationUnits}
                                                setLoadingOrganisationUnits={setLoadingOrganisationUnits}
                                          />
                                    </Col>
                              )}

                              <Col sm={24} md={3}>
                                    <div style={{ marginBottom: '2px' }}>{translate('Level')}</div>
                                    <Select
                                          placeholder={translate('Level')}
                                          onChange={handleSelectLevel}
                                          value={selectedLevel?.id}
                                          style={{ width: '100%' }}
                                          options={organisationUnitLevels.map(d => ({
                                                value: d.id,
                                                label: d.displayName
                                          }))}
                                          loading={loadingOrganisationUnitLevels}
                                    />
                              </Col>

                              <Col sm={24} md={5}>
                                    <div style={{ marginBottom: '2px' }}>{translate('Periode')}</div>
                                    <DatePicker.RangePicker
                                          picker="date"
                                          style={{ width: '100%' }}
                                          placeholder={translate('Periode')}
                                          onChange={handleSelectPeriodRange}
                                          value={selectedPeriods}
                                          allowClear={false}
                                    />
                              </Col>

                              <Col sm={24} md={7}>
                                    <div style={{ marginTop: '20px', display: 'flex' }}>
                                          <div style={{ marginRight: '20px' }}>
                                                <Button
                                                      onClick={handleSearch}
                                                      icon={<FaSearch style={{ fontSize: '20px' }} />}
                                                      loading={loadingTeiList}
                                                      disabled={
                                                            selectedLevel?.level &&
                                                            selectedOrganisationUnit &&
                                                            selectedPeriods.length > 0 &&
                                                            selectedProgram
                                                                  ? false
                                                                  : true
                                                      }
                                                >
                                                      {translate('Recherche')}
                                                </Button>
                                          </div>
                                          <div>
                                                <Button
                                                      onClick={printReportAsPDF}
                                                      primary
                                                      icon={<ImPrinter style={{ fontSize: '20px' }} />}
                                                >
                                                      {translate('Print_Dashboard')}
                                                </Button>
                                          </div>
                                    </div>
                              </Col>
                        </Row>
                  </div>
            </>
      );

      const RenderNoOrganisationUnitsAtThisLevel = () =>
            selectedMission?.output?.filter(m => m.organisationUnit?.level === selectedLevel?.level)?.length === 0 && (
                  <div
                        className="my-shadow"
                        style={{
                              backgroundColor: '#fff',
                              padding: '10px',
                              borderRadius: '8px',
                              textAlign: 'center',
                              color: '#00000090',
                              fontWeight: 'bold'
                        }}
                  >
                        {translate('No_Planification_Done_On_An_OU')} !
                  </div>
            );

      const RenderVisualizationForEachStructure = () =>
            selectedMission?.output
                  ?.filter(m => m.organisationUnit?.level === selectedLevel?.level)
                  ?.map(m => (
                        <div key={uuid()} style={{ marginBottom: '40px' }}>
                              <div
                                    style={{
                                          fontWeight: 'bold',
                                          marginBottom: '10px',
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center'
                                    }}
                              >
                                    <span style={{ fontSize: '15px' }}>{`${translate('Analysis_For')}  - `}</span>
                                    <span
                                          style={{
                                                marginLeft: '10px',
                                                fontSize: '18px',
                                                backgroundColor: 'orange',
                                                color: '#fff',
                                                padding: '3px 10px',
                                                border: '1px solid #00000090'
                                          }}
                                    >
                                          {m.organisationUnit.displayName}
                                    </span>
                              </div>
                              <Row gutter={[8, 8]}>
                                    {dataStoreVisualizations
                                          .find(
                                                vis =>
                                                      selectedProgram?.program?.id &&
                                                      vis.program?.id === selectedProgram?.program?.id
                                          )
                                          ?.visualizations?.map(v => (
                                                <VisualizationItem
                                                      key={uuid()}
                                                      id={`${v.id}-${m.organisationUnit?.id}`}
                                                      loading={loadingInjection}
                                                />
                                          ))}
                              </Row>
                        </div>
                  ));
      const RenderVisualizationForGlobalStructure = () => {
            const ouList =
                  selectedMission?.output
                        ?.filter(m => selectedLevel?.level > 1 && m.organisationUnit?.level === selectedLevel?.level)
                        .map(m => m.organisationUnit) || [];

            return (
                  selectedLevel?.level > 1 &&
                  ouList.length > 1 && (
                        <div style={{ marginTop: '20px' }}>
                              <div key={uuid()} style={{ marginBottom: '40px' }}>
                                    <div
                                          style={{
                                                fontWeight: 'bold',
                                                marginBottom: '10px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                          }}
                                    >
                                          <span style={{ fontSize: '15px' }}>{`${translate(
                                                'Global_Analysis_For'
                                          )}  - `}</span>

                                          {ouList.map(ou => (
                                                <span
                                                      key={uuid()}
                                                      style={{
                                                            marginLeft: '10px',
                                                            fontSize: '18px',
                                                            backgroundColor: 'orange',
                                                            color: '#fff',
                                                            padding: '3px 10px',
                                                            border: '1px solid #00000090'
                                                      }}
                                                >
                                                      {ou.displayName}
                                                </span>
                                          ))}
                                    </div>
                                    <Row gutter={[8, 8]}>
                                          {dataStoreVisualizations
                                                .find(
                                                      vis =>
                                                            selectedProgram?.program?.id &&
                                                            vis.program?.id === selectedProgram?.program?.id
                                                )
                                                ?.visualizations?.map(v => (
                                                      <VisualizationItem
                                                            key={uuid()}
                                                            id={v.id}
                                                            loading={loadingInjection}
                                                      />
                                                ))}
                                    </Row>
                              </div>
                        </div>
                  )
            );
      };

      const loadTEIS = async (program_id, orgUnit_id, ouMode = DESCENDANTS) => {
            try {
                  setLoadingTeiList(true);
                  const response = await axios.get(
                        `${TRACKED_ENTITY_INSTANCES_ROUTE}.json?program=${program_id}&ou=${orgUnit_id}&ouMode=${ouMode}&order=created:DESC&fields=trackedEntityInstance,created,program,orgUnit,enrollments[*],attributes&pageSize=100000`
                  );
                  const trackedEntityInstances = response.data.trackedEntityInstances;
                  setTeiList(trackedEntityInstances);
                  setLoadingTeiList(false);
            } catch (err) {}
      };

      const RenderVisualizations = () =>
            selectedMission &&
            selectedLevel && (
                  <div id="visualizations-container">
                        {RenderVisualizationForEachStructure()}
                        {RenderVisualizationForGlobalStructure()}
                        {RenderNoOrganisationUnitsAtThisLevel()}
                  </div>
            );

      const loadAndInjectVisualizations = async () => {
            try {
                  setLoadingInjection(true);

                  const concerningOUs =
                        selectedMission.output?.filter(m => m.organisationUnit?.level === selectedLevel?.level) || [];

                  // generation for specifique ou
                  concerningOUs.forEach(output => {
                        dataStoreVisualizations
                              .find(
                                    vis =>
                                          selectedProgram?.program?.id &&
                                          vis.program?.id === selectedProgram?.program?.id
                              )
                              ?.visualizations?.forEach(v => {
                                    const responseString = ReactDOMServer.renderToString(
                                          <MyFrame
                                                type={v.type}
                                                base_url={SERVER_URL}
                                                id={v.id}
                                                style={{
                                                      width: '100%',
                                                      height: '450px'
                                                }}
                                                periods={[selectedPeriod.format('YYYYMM')].join(',')}
                                                orgUnitIDs={[output.organisationUnit?.id].join(',')}
                                          />
                                    );

                                    const rightElement = document.getElementById(
                                          `${v.id}-${output.organisationUnit?.id}`
                                    );
                                    if (rightElement) {
                                          rightElement.innerHTML = responseString;
                                    }
                              });
                  });

                  // generation for all ou
                  if (selectedLevel?.level > 1) {
                        const rightOUs =
                              concerningOUs.filter(m => m.organisationUnit?.level > 1)?.map(m => m.organisationUnit) ||
                              [];
                        dataStoreVisualizations
                              .find(
                                    vis =>
                                          selectedProgram?.program?.id &&
                                          vis.program?.id === selectedProgram?.program?.id
                              )
                              ?.visualizations?.forEach(v => {
                                    const responseString = ReactDOMServer.renderToString(
                                          <MyFrame
                                                type={v.type}
                                                base_url={SERVER_URL}
                                                id={v.id}
                                                style={{
                                                      width: '100%',
                                                      height: '450px'
                                                }}
                                                periods={[selectedPeriod.format('YYYYMM')].join(',')}
                                                orgUnitIDs={rightOUs.map(r => r.id).join(',')}
                                          />
                                    );

                                    const rightElement = document.getElementById(`${v.id}`);
                                    if (rightElement) {
                                          rightElement.innerHTML = responseString;
                                    }
                              });
                  }

                  setLoadingInjection(false);
            } catch (err) {
                  console.log('Error: ', err);
                  setLoadingInjection(false);
            }
      };

      useEffect(() => {
            if (me) {
                  loadDataStoreSupervisionsConfigs();
                  loadDataStoreVisualizations();
                  loadOrganisationUnitLevels();
                  loadOrganisationUnits();
            }
      }, [me]);

      useEffect(() => {
            if (dataStoreVisualizations.length > 0 && selectedPeriod && selectedLevel && selectedLevel) {
                  loadAndInjectVisualizations();
            }
      }, [selectedPeriod, selectedProgram, selectedLevel, selectedMission, dataStoreVisualizations]);

      return (
            <>
                  <div style={{ padding: '10px', width: '100%' }}>
                        {RenderFilters()}
                        <pre>{JSON.stringify(teiList, null, 4)}</pre>
                        {/* {RenderVisualizations()} */}
                        <MyNotification notification={notification} setNotification={setNotification} />
                  </div>
            </>
      );
};

export default Dashboard;
