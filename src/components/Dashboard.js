import { useState, useEffect } from 'react';
import { Card, Col, DatePicker, Row, Select, Table } from 'antd';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import ReactEchart from 'echarts-for-react';
import axios from 'axios';
import {
      DATA_ELEMENT_OPTION_SETS,
      ORGANISATION_UNITS_ROUTE,
      SERVER_URL,
      TRACKED_ENTITY_INSTANCES_ROUTE,
      USERS_ROUTE
} from '../utils/api.routes';
import OrganisationUnitsTree from './OrganisationUnitsTree';
import {
      CANCELED,
      DESCENDANTS,
      NOTICE_BOX_DEFAULT,
      NOTIFICATION_CRITICAL,
      PENDING_VALIDATION,
      PLANIFICATION_PAR_MOI,
      PLANIFICATION_PAR_TOUS,
      PLANIFICATION_PAR_UN_USER,
      COMPLETED,
      SCHEDULED,
      TYPE_GENERATION_AS_ENROLMENT,
      TYPE_GENERATION_AS_EVENT,
      TYPE_GENERATION_AS_TEI,
      NA,
      PAYMENT_DONE,
      PENDING_PAYMENT,
      AGENT,
      MES_PLANIFICATIONS
} from '../utils/constants';
import MapView from './MapView';
import { loadDataStore } from '../utils/functions';
import { IoMdOpen } from 'react-icons/io';
import { BLACK, BLUE, GRAY_DARK, GREEN, ORANGE, RED, WHITE } from '../utils/couleurs';
import { AiOutlineSearch } from 'react-icons/ai';
import { MyNoticeBox } from './MyNoticeBox';
import MyNotification from './MyNotification';
import { Button } from '@dhis2/ui';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import translate from '../utils/translator';
import { v1 as uuid } from 'uuid';

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
      const [users, setUsers] = useState([]);

      const [dataStoreSupervisionsConfigs, setDataStoreSupervisionsConfigs] = useState([]);
      const [dataStoreMissions, setDataStoreMissions] = useState([]);

      const [selectedMission, setSelectedMission] = useState(null);

      const [_, setDataStoreSupervisionPlanifications] = useState([]);
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
      const [calendarDate, setCalendarDate] = useState(dayjs().format('YYYY-MM-DD'));
      const [statusSupervisionOptions, setStatusSupervisionOptions] = useState([]);
      const [statusPaymentOptions, setStatusPaymentOptions] = useState([]);

      const [selectedOrganisationUnit, setSelectedOrganisationUnit] = useState(null);
      const [selectedPlanification, setSelectedPlanification] = useState(MES_PLANIFICATIONS);
      const [selectedPeriod, setSelectedPeriod] = useState(dayjs(new Date()));
      const [selectedProgram, setSelectedProgram] = useState(null);

      const [loadingOrganisationUnits, setLoadingOrganisationUnits] = useState(false);
      const [loadingUsers, setLoadingUsers] = useState(false);
      const [loadingDataStoreSupervisionPlanifications, setLoadingDataStoreSupervisionPlanifications] = useState(false);
      const [loadingDataStoreSupervisionsConfigs, setLoadingDataStoreSupervisionsConfigs] = useState(false);
      const [loadingTeiList, setLoadingTeiList] = useState(false);

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
                  setSelectedPeriod(dayjs());
                  if (progs.length > 0) {
                        const currentProgram = progs[0];
                        const currentOrgUnit = orgUnits.find(ou => ou.id === me?.organisationUnits?.[0]?.id);
                        const currentPeriod = dayjs();
                        const currentPlanification = MES_PLANIFICATIONS;

                        if (currentProgram) {
                              setSelectedProgram(currentProgram);
                              setSelectedOrganisationUnit(currentOrgUnit);
                              setSelectedPeriod(currentPeriod);
                              setSelectedPlanification(currentPlanification);
                              loadTeisPlanifications(currentProgram.program.id, currentOrgUnit?.id, null, DESCENDANTS);
                              loadOptions(
                                    currentProgram?.programStageConfigurations?.[0]?.statusSupervisionField?.id,
                                    setStatusSupervisionOptions
                              );
                              // loadOptions(
                              //   currentProgram.statusPayment?.dataElement?.id,
                              //   setStatusPaymentOptions
                              // );
                        }
                  }
                  loadUsers(me?.organisationUnits?.[0]?.id);
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

      const loadTeisPlanifications = async (program_id, orgUnit_id, period, ouMode = DESCENDANTS) => {
            try {
                  setLoadingTeiList(true);
                  const response = await axios.get(
                        `${TRACKED_ENTITY_INSTANCES_ROUTE}.json?program=${program_id}&ou=${orgUnit_id}&ouMode=${ouMode}&order=created:DESC&fields=trackedEntityInstance,created,program,orgUnit,enrollments[*],attributes&pageSize=10000`
                  );
                  const trackedEntityInstances = response.data.trackedEntityInstances;
                  setTeiList(trackedEntityInstances);
                  setLoadingTeiList(false);
                  setCalendarDate(period ? period : selectedPeriod);
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
                  setLoadingTeiList(false);
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

      const loadDataStoreSupervisionPlanifications = async () => {
            try {
                  setLoadingDataStoreSupervisionPlanifications(true);
                  const response = await loadDataStore(process.env.REACT_APP_SUPERVISIONS_KEY, null, null, null);

                  let supervisionList = [];
                  const eventList = [];

                  for (let planification of response) {
                        for (let sup of planification.supervisions) {
                              if (!supervisionList.map(s => s.id).includes(sup.id)) {
                                    supervisionList.push(sup);
                              }
                        }
                  }

                  for (let sup of supervisionList) {
                        const payload = {
                              id: sup.id,
                              title: 'Supervision',
                              allDay: true,
                              start: new Date(2015, 3, 0),
                              end: new Date(2015, 3, 1)
                        };

                        eventList.push(payload);
                  }

                  setDataStoreSupervisionPlanifications(response);
                  setLoadingDataStoreSupervisionPlanifications(false);
            } catch (err) {
                  setLoadingDataStoreSupervisionPlanifications(false);
            }
      };

      const loadUsers = async userOrgUnitId => {
            try {
                  if (userOrgUnitId) {
                        setLoadingUsers(true);

                        const route = `${USERS_ROUTE}&filter=organisationUnits.path:like:${userOrgUnitId}`;
                        const response = await axios.get(route);

                        setUsers(response.data.users);
                        setLoadingUsers(false);
                  }
            } catch (err) {
                  setLoadingUsers(false);
            }
      };

      const handleSelectedPeriod = event => {
            setSelectedPeriod(dayjs(event));
      };


      const handleSearch = () => {
            if (selectedPeriod && selectedOrganisationUnit && selectedProgram) {
                  loadTeisPlanifications(selectedProgram.program?.id, selectedOrganisationUnit.id);
            }
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

                              <Col sm={24} md={1}>
                                    <div style={{ marginTop: '20px' }}>
                                          <Button
                                                onClick={handleSearch}
                                                loading={loadingTeiList}
                                                primary
                                                icon={<AiOutlineSearch style={{ fontSize: '20px' }} />}
                                          >
                                                {translate('Appliquer')}
                                          </Button>
                                    </div>
                              </Col>
                        </Row>
                  </div>
            </>
      );

      useEffect(() => {
            if (me) {
                  loadDataStoreSupervisionsConfigs();
                  loadDataStoreMissions();
            }
      }, [me]);

      return (
            <>
                  <div style={{ padding: '10px', width: '100%' }}>
                        {RenderFilters()}

                        <MyNotification notification={notification} setNotification={setNotification} />
                  </div>
            </>
      );
};

export default Dashboard;
