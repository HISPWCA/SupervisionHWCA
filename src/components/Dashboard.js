import { useState, useEffect } from 'react';
import { Col, DatePicker, Row, Select } from 'antd';
import { dayjsLocalizer } from 'react-big-calendar';
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import { ORGANISATION_UNITS_ROUTE, SERVER_URL } from '../utils/api.routes';
import OrganisationUnitsTree from './OrganisationUnitsTree';
import { NOTICE_BOX_DEFAULT, NOTIFICATION_CRITICAL, NA, SCHEDULED, MES_PLANIFICATIONS } from '../utils/constants';
import { loadDataStore } from '../utils/functions';
import { AiOutlineSearch } from 'react-icons/ai';
import MyNotification from './MyNotification';
import { Button } from '@dhis2/ui';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import translate from '../utils/translator';
import VisualizationItem from './VisualizationItem';
import MyFrame from './MyFrame';
import { ImPrinter } from 'react-icons/im';

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

      const [dataStoreSupervisionsConfigs, setDataStoreSupervisionsConfigs] = useState([]);
      const [dataStoreMissions, setDataStoreMissions] = useState([]);
      const [dataStoreVisualizations, setDataStoreVisualizations] = useState([]);

      const [selectedMission, setSelectedMission] = useState(null);

      const [teiList, setTeiList] = useState([]);
      const [noticeBox, setNoticeBox] = useState({
            show: false,
            message: null,
            title: null,
            type: NOTICE_BOX_DEFAULT
      });
      const [notification, setNotification] = useState({
            show: false,
            message: null,
            type: null
      });
      const [statusSupervisionOptions, setStatusSupervisionOptions] = useState([]);

      const [selectedOrganisationUnit, setSelectedOrganisationUnit] = useState(null);
      const [selectedPlanification, setSelectedPlanification] = useState(MES_PLANIFICATIONS);
      const [selectedPeriod, setSelectedPeriod] = useState(dayjs(new Date()));
      const [selectedProgram, setSelectedProgram] = useState(null);

      const [loadingOrganisationUnits, setLoadingOrganisationUnits] = useState(false);
      const [loadingUsers, setLoadingUsers] = useState(false);
      const [loadingDataStoreVisualizations, setLoadingDataStoreVisualizations] = useState(false);
      const [loadingDataStoreSupervisionsConfigs, setLoadingDataStoreSupervisionsConfigs] = useState(false);
      const [loadingInjection, setLoadingInjection] = useState(false);

      const [loadingDataStoreMissions, setLoadingDataStoreMissions] = useState(false);

      const loadDataStoreMissions = async () => {
            try {
                  setLoadingDataStoreMissions(true);
                  const response = await loadDataStore(process.env.REACT_APP_MISSIONS_KEY, null, null, null);
                  setDataStoreMissions(response);
                  setLoadingDataStoreMissions(false);
                  return response;
            } catch (err) {
                  setLoadingDataStoreMissions(false);
            }
      };

      const loadOrganisationUnits = async () => {
            try {
                  setLoadingOrganisationUnits(true);
                  const response = await axios.get(ORGANISATION_UNITS_ROUTE);
                  const orgUnits = response.data.organisationUnits;
                  const progs = await loadDataStoreSupervisionsConfigs();

                  setOrganisationUnits(orgUnits);
                  if (progs.length > 0) {
                        const currentProgram = progs[0];
                        const currentOrgUnit = orgUnits.find(ou => ou.id === me?.organisationUnits?.[0]?.id);
                        const currentPeriod = dayjs();

                        if (currentProgram) {
                              setSelectedProgram(currentProgram);
                              setSelectedOrganisationUnit(currentOrgUnit);
                              setSelectedPeriod(currentPeriod);
                        }
                  }
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

      const handleSelectedPeriod = event => {
            setSelectedPeriod(dayjs(event));
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

      const handleSelectMission = value => setSelectedMission(dataStoreMissions.find(m => m.id === value));

      const handleSelectProgram = value => {
            if (value) {
                  const supFound = dataStoreSupervisionsConfigs.find(d => d.program?.id === value);
                  setTeiList([]);
                  setSelectedProgram(supFound);
                  loadOptions(
                        supFound?.programStageConfigurations?.[0]?.statusSupervisionField?.id,
                        setStatusSupervisionOptions
                  );
            }
      };

      const RenderFilters = () => (
            <>
                  <div
                        className="my-shadow"
                        style={{
                              backgroundColor: '#fff',
                              padding: '10px',
                              marginTop: '5px',
                              marginBottom: '20px',
                              borderRadius: '8px'
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

                              <Col sm={24} md={5}>
                                    <div style={{ marginBottom: '2px' }}>{translate('Unites_Organisation')}</div>
                                    <OrganisationUnitsTree
                                          meOrgUnitId={me?.organisationUnits[0]?.id}
                                          orgUnits={organisationUnits}
                                          currentOrgUnits={selectedOrganisationUnit}
                                          setCurrentOrgUnits={setSelectedOrganisationUnit}
                                          loadingOrganisationUnits={loadingOrganisationUnits}
                                          setLoadingOrganisationUnits={setLoadingOrganisationUnits}
                                    />
                              </Col>
                              <Col sm={24} md={3}>
                                    <div style={{ marginBottom: '2px' }}>{translate('Periode')}</div>
                                    <DatePicker
                                          picker="month"
                                          style={{ width: '100%' }}
                                          placeholder={translate('Periode')}
                                          onChange={handleSelectedPeriod}
                                          value={selectedPeriod}
                                          allowClear={false}
                                    />
                              </Col>

                              <Col sm={24} md={3}>
                                    <div style={{ marginTop: '20px' }}>
                                          <Button
                                                onClick={printReportAsPDF}
                                                primary
                                                icon={<ImPrinter style={{ fontSize: '20px' }} />}
                                          >
                                                {translate('Print_Dashboard')}
                                          </Button>
                                    </div>
                              </Col>
                        </Row>
                  </div>
            </>
      );

      const RenderVisualizations = () => (
            <div id="visualizations-container">
                  <Row gutter={[8, 8]}>
                        {dataStoreVisualizations?.map(v => (
                              <VisualizationItem
                                    key={v.id}
                                    id={`${v.id}-${selectedOrganisationUnit?.id}`}
                                    loading={loadingInjection}
                              />
                        ))}
                  </Row>
            </div>
      );

      const loadAndInjectVisualizations = async () => {
            try {
                  setLoadingInjection(true);
                  dataStoreVisualizations.forEach(v => {
                        const responseString = ReactDOMServer.renderToString(
                              <MyFrame
                                    type={v.type}
                                    base_url={SERVER_URL}
                                    id={v.id}
                                    style={{
                                          width: '100%',
                                          heigth: '100%',
                                          overflow: 'none'
                                    }}
                                    periods={[selectedPeriod.format('YYYYMM')].join(',')}
                                    orgUnitIDs={[selectedOrganisationUnit.id].join(',')}
                              />
                        );

                        const rightElement = document.getElementById(`${v.id}-${selectedOrganisationUnit?.id}`);
                        if (rightElement) {
                              rightElement.innerHTML = responseString;
                        }

                        const foundIframe = rightElement.querySelector('iframe');
                        if (foundIframe) {
                              foundIframe.onload = frame => {
                                    setTimeout(() => {
                                          foundIframe.style.height =
                                                foundIframe.contentWindow.document.body.scrollHeight + 'px';
                                          foundIframe.style.width =
                                                foundIframe.contentWindow.document.body.scrollWidth + 'px';
                                    }, 6000);
                              };
                        }
                  });
                  setLoadingInjection(false);
            } catch (err) {
                  console.log('Error: ', err);
                  setLoadingInjection(false);
            }
      };

      useEffect(() => {
            if (me) {
                  loadDataStoreSupervisionsConfigs();
                  loadDataStoreMissions();
                  loadOrganisationUnits();
                  loadDataStoreVisualizations();
            }
      }, [me]);

      useEffect(() => {
            if (dataStoreVisualizations.length > 0 && selectedPeriod && selectedOrganisationUnit) {
                  loadAndInjectVisualizations();
            }
      }, [selectedPeriod, selectedOrganisationUnit, dataStoreVisualizations]);

      return (
            <>
                  <div style={{ padding: '10px', width: '100%' }}>
                        {RenderFilters()}
                        {RenderVisualizations()}
                        <MyNotification notification={notification} setNotification={setNotification} />
                  </div>
            </>
      );
};

export default Dashboard;
