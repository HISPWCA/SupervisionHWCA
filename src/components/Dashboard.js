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

import { IoIosArrowRoundForward } from 'react-icons/io'
import { IoIosArrowRoundBack } from 'react-icons/io'

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
      const [concerningOUs, setConcerningOUs] = useState([]);
      const [currentPosition, setCurrentPosition] = useState(0);
      const [numberOfGeneration, setNumberOfGeneration] = useState(1);
      const [currentIntervalTime, setCurrentIntervalTime] = useState(null)


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
      const [selectedPeriods, setSelectedPeriods] = useState([dayjs().startOf('month'), dayjs()]);
      const [selectedProgram, setSelectedProgram] = useState(null);

      const [loadingOrganisationUnits, setLoadingOrganisationUnits] = useState(false);
      const [loadingDataStoreVisualizations, setLoadingDataStoreVisualizations] = useState(false);
      const [loadingDataStoreSupervisionsConfigs, setLoadingDataStoreSupervisionsConfigs] = useState(false);
      const [loadingInjection, setLoadingInjection] = useState(false);
      const [loadingTeiList, setLoadingTeiList] = useState(false);
      const [loadingOrganisationUnitLevels, setLoadingOrganisationUnitLevels] = useState(false);
      const [loadingPrint, setLoadingPrint] = useState(false)


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

                  setOrganisationUnits(orgUnits);
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

      const handleSelectPeriodRange = period => {
            setSelectedPeriods(period);
      };

      const printReportAsPDF = async () => {
            try {
                  setLoadingPrint(true)
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
                  setLoadingPrint(false)
            } catch (err) {
                  console.log("error  print :  ", err )
                  setLoadingPrint(false)
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
                  setCurrentPosition(0)
            }
      };

      const filterAndGetConcerningOrgUnits = () => {
            const rightOUList = teiList.reduce((prev, current) => {
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

                        return [...prev, ...eventList];
                  }

                  return prev;
            }, []);

            setConcerningOUs(
                  rightOUList.map(event => {
                        const currO = organisationUnits.find(o => o.id === event.orgUnit);
                        return {
                              id: currO?.id,
                              displayName: currO?.displayName,
                              name: currO?.name,
                              level: currO?.level,
                              path: currO?.path,
                              event: event
                        };
                  }).filter(o => o.level === selectedLevel?.level)
            );
      };

      const handleGoPrevious = () => {
            setCurrentPosition(currentPosition - +numberOfGeneration);
      };

      const handleGotoNext = () => {
            setCurrentPosition(currentPosition + +numberOfGeneration);
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
                                    <Col sm={24} md={4}>
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

                              <Col sm={24} md={4}>
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

                              <Col sm={24} md={9}>
                                    <div
                                          style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginTop: '20px'
                                          }}
                                    >
                                          <div style={{ display: 'flex' }}>
                                                <div style={{ marginRight: '20px' }}>
                                                      <Button
                                                            onClick={handleSearch}
                                                            icon={<FaSearch style={{ fontSize: '20px' }} />}
                                                            loading={loadingTeiList || loadingInjection}
                                                            disabled={
                                                                  selectedLevel?.level &&
                                                                        selectedOrganisationUnit &&
                                                                        selectedPeriods.length > 0 &&
                                                                        selectedProgram
                                                                        ? false
                                                                        : true
                                                            }
                                                            primary
                                                      >
                                                            {translate('Apply')}
                                                      </Button>
                                                </div>
                                                <div>
                                                      <Button
                                                            loading={loadingPrint}
                                                            onClick={printReportAsPDF}
                                                            icon={<ImPrinter style={{ fontSize: '20px' }} />}
                                                      >
                                                            {translate('Print_Dashboard')}
                                                      </Button>
                                                </div>
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'end' }}>
                                                {concerningOUs?.length > 0 && <div style={{
                                                      marginRight: '20px', fontWeight: 'bold',
                                                      padding: '1px', background: 'green', color: '#fff', fontSize: '18px'
                                                }}>
                                                      {`Page:    ${currentPosition + 1}/${concerningOUs?.length}`}
                                                </div>}
                                                <div>
                                                      <Button
                                                            small
                                                            icon={
                                                                  <IoIosArrowRoundBack
                                                                        style={{ fontSize: '20px', color: '#fff' }}
                                                                  />
                                                            }
                                                            disabled={currentPosition === 0 || currentPosition < 0 ? true : false}
                                                            primary
                                                            onClick={handleGoPrevious}
                                                      >
                                                            {translate('Prev')}
                                                      </Button>
                                                </div>
                                                <div style={{ marginLeft: '5px' }}>
                                                      <Button
                                                            small
                                                            icon={
                                                                  <IoIosArrowRoundForward
                                                                        style={{ fontSize: '20px', color: '#fff' }}
                                                                  />
                                                            }
                                                            disabled={
                                                                  +currentPosition + +numberOfGeneration >=
                                                                        concerningOUs?.length
                                                                        ? true
                                                                        : false
                                                            }
                                                            primary
                                                            onClick={handleGotoNext}
                                                      >
                                                            {translate('Next')}
                                                      </Button>
                                                </div>
                                          </div>
                                    </div>
                              </Col>
                        </Row>
                  </div>
            </>
      );

      const RenderNoOrganisationUnitsAtThisLevel = () =>
            concerningOUs?.filter(m => m?.level === selectedLevel?.level)?.length === 0 && (
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
                        {translate('No_Planification_Done_On_An_OU')}
                  </div>
            );

      const RenderVisualizationForEachStructure = () =>
            concerningOUs.slice(currentPosition, currentPosition + +numberOfGeneration).map(ou => (
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
                                          border: 'none',
                                          borderRadius: '10px'
                                    }}
                              >
                                    {ou.displayName}
                              </span>

                              <span style={{ margin: '0px 10px' }}>{` - `}</span>

                              {ou.event?.eventDate && (
                                    <span
                                          style={{
                                                fontSize: '18px',
                                                backgroundColor: 'orange',
                                                color: '#fff',
                                                padding: '3px 10px',
                                                border: 'none',
                                                borderRadius: '10px'
                                          }}
                                    >
                                          {dayjs(ou.event?.eventDate).format('YYYY-MM-DD')}
                                    </span>
                              )}
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
                                                id={`${v.id}-${ou?.id}-${ou?.event?.event}`}
                                          />
                                    ))}
                        </Row>
                  </div>
            ))

      const RenderVisualizationForGlobalStructure = () => {
            return (
                  selectedLevel?.level > 1 &&
                  concerningOUs.length > 1 && concerningOUs.length === (+currentPosition + 1) && (
                        <div style={{ marginTop: '20px' }}>
                              <div key={uuid()} style={{ marginBottom: '40px' }}>
                                    <div
                                          style={{
                                                fontWeight: 'bold',
                                                marginBottom: '10px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                flexWrap: 'wrap'
                                          }}
                                    >
                                          <span style={{ fontSize: '15px' }}>{`${translate(
                                                'Global_Analysis_For'
                                          )}  - `}</span>

                                          {concerningOUs.map(ou => (
                                                <span
                                                      key={uuid()}
                                                      style={{
                                                            marginLeft: '10px',
                                                            fontSize: '18px',
                                                            backgroundColor: 'orange',
                                                            color: '#fff',
                                                            padding: '2px 10px',
                                                            border: 'none',
                                                            borderRadius: '10px',
                                                            marginTop: '5px'
                                                      }}
                                                >
                                                      {`${ou.displayName} ( ${dayjs(ou.event?.eventDate).format(
                                                            'YYYY-MM-DD'
                                                      )} )`}
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
            } catch (err) { }
      }

      const RenderVisualizations = () =>
            selectedProgram &&
            selectedLevel &&
            selectedOrganisationUnit && (
                  <div id="visualizations-container">
                        {RenderVisualizationForEachStructure()}
                        {RenderVisualizationForGlobalStructure()}
                        {RenderNoOrganisationUnitsAtThisLevel()}
                  </div>
            )

      const handleReplaceIndicatorName = (elementHTML, config, output) => {
            let countTimer = 0;
            let interval = setInterval(() => {
                  countTimer = countTimer + 1;

                  // if (countTimer >= 10) {
                  //       console.log("Interval timer destroyed")
                  //       return clearInterval(interval);
                  // }

                  const foundElement = elementHTML.querySelector('iframe');
                  if (foundElement) {
                        const listItems = foundElement.contentWindow?.document?.body?.querySelectorAll(
                              '.highcharts-legend-item.highcharts-column-series'
                        );

                        if (listItems) {
                              for (let item of listItems) {
                                    const tspan = item.querySelector('tspan');
                                    if (tspan) {

                                          const text = tspan.innerHTML;
                                          const texts = text?.split('-');
                                          const textsIndex1 = texts?.[0];

                                          // Remplacement des noms pour l'indicateur
                                          if (textsIndex1?.toLowerCase()?.includes('indicat') && textsIndex1?.split(' ')?.[1] && config?.indicators?.length > 0) {
                                                const index = +textsIndex1?.split(' ')?.[1]
                                                const currentIndicator = config?.indicators?.find(ind => +ind?.position === +index);
                                                const indicatorName = currentIndicator &&
                                                      output.event?.dataValues?.find(dv => dv.dataElement === currentIndicator?.value?.id)?.value;

                                                if (indicatorName) {
                                                      return tspan.innerHTML = indicatorName + ' - ' + texts?.[1];
                                                }
                                          }

                                          // Remplacement des noms pour le cross check
                                          if ((textsIndex1?.toLowerCase()?.includes('cross checks') || textsIndex1?.toLowerCase()?.includes('recoupements')) && textsIndex1?.[1] && config?.recoupements?.length > 0) {
                                                console.log("cross check ")
                                                let index = textsIndex1?.toLowerCase()?.split('cross checks ')?.[1] || textsIndex1?.toLowerCase()?.split('recoupements ')?.[1]
                                                const currentRecoupement = config?.recoupements?.find(ind => +ind?.position === +index);

                                                console.log("currentRecoupement : ", currentRecoupement)

                                                const primaryCrosscheckName = currentRecoupement &&
                                                      output.event?.dataValues?.find(dv => dv.dataElement === currentRecoupement?.primaryValue?.id)?.value;

                                                const secondaryCrosscheckName = currentRecoupement &&
                                                      output.event?.dataValues?.find(dv => dv.dataElement === currentRecoupement?.secondaryValue?.id)?.value;

                                                console.log("Cross check primary : ", primaryCrosscheckName)
                                                console.log("Cross check secondaire : ", secondaryCrosscheckName)

                                                if (primaryCrosscheckName && secondaryCrosscheckName) {
                                                      return tspan.innerHTML = `( ${primaryCrosscheckName}:${secondaryCrosscheckName} ) - ${texts?.[1]}`;
                                                }
                                          }

                                    }
                              }
                        }
                  }
            }, 5000);
      };

      const pause = milliseconds => {
            var dt = new Date();
            while (new Date() - dt <= milliseconds) {
                  /* Do nothing */
            }
      };

      const loadAndInjectVisualizations = async () => {
            try {
                  setLoadingInjection(true);

                  // generation for specifique ou
                  concerningOUs
                        .slice(currentPosition, currentPosition + +numberOfGeneration)
                        .forEach(output => {
                              let elementList = [];
                              const config = selectedProgram?.programStageConfigurations?.find(
                                    stage => stage?.programStage?.id === output?.event?.programStage
                              )

                              dataStoreVisualizations.find(
                                    vis =>
                                          selectedProgram?.program?.id &&
                                          vis.program?.id === selectedProgram?.program?.id
                              )?.visualizations?.forEach(v => {
                                    console.log("each event : ", output)
                                    const responseString = ReactDOMServer.renderToString(
                                          <MyFrame
                                                type={v.type}
                                                base_url={SERVER_URL}
                                                id={v.id}
                                                style={{
                                                      width: '100%',
                                                      height: '450px'
                                                }}
                                                periods={[dayjs(output.event?.eventDate).format('YYYYMMDD')].join(',')}
                                                orgUnitIDs={[output?.id].join(',')}
                                                baseLineTitle={v.baseLineTitle}
                                                baseLineValue={v.baseLineValue}
                                                targetLineTitle={v.targetLineTitle}
                                                targetLineValue={v.targetLineValue}
                                          />
                                    );

                                    const rightElement = document.getElementById(
                                          `${v.id}-${output?.id}-${output?.event?.event}`
                                    );

                                    if (rightElement) {
                                          rightElement.innerHTML = responseString;
                                          elementList.push({ rightElement, output });
                                          handleReplaceIndicatorName(rightElement, config, output);
                                    }
                              })
                        })


                  // generation for all ou
                  if (selectedLevel?.level > 1) {

                        dataStoreVisualizations.find(
                              vis =>
                                    selectedProgram?.program?.id &&
                                    vis.program?.id === selectedProgram?.program?.id
                        )?.visualizations?.forEach(v => {
                              const responseString = ReactDOMServer.renderToString(
                                    <MyFrame
                                          type={v.type}
                                          base_url={SERVER_URL}
                                          id={v.id}
                                          style={{
                                                width: '100%',
                                                height: '450px'
                                          }}
                                          periods={concerningOUs?.map(r => dayjs(r.event?.eventDate)?.format('YYYYMMDD'))?.join(',')}
                                          orgUnitIDs={concerningOUs.reduce((p, c) => {
                                                if (!p.includes(c?.id)) {
                                                      p.push(c?.id)
                                                }
                                                return p
                                          }, [])?.join(',')}
                                          baseLineTitle={v.baseLineTitle}
                                          baseLineValue={v.baseLineValue}
                                          targetLineTitle={v.targetLineTitle}
                                          targetLineValue={v.targetLineValue}
                                    />
                              )

                              const rightElement = document.getElementById(`${v.id}`)
                              if (rightElement) {
                                    rightElement.innerHTML = responseString;
                                    for (let output of concerningOUs) {
                                          const config = selectedProgram?.programStageConfigurations?.find(
                                                stage => stage?.programStage?.id === output?.event?.programStage
                                          );
                                          handleReplaceIndicatorName(rightElement, config, output)
                                    }
                              }

                        })

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

            return () => currentIntervalTime && clearInterval(currentIntervalTime);
      }, [me]);

      useEffect(() => {
            if (concerningOUs.length > 0) {
                  loadAndInjectVisualizations();
            }
      }, [concerningOUs, currentPosition]);

      useEffect(() => {
            if (selectedPeriods.length > 0 && selectedProgram && selectedLevel) {
                  filterAndGetConcerningOrgUnits();
            }
      }, [teiList]);

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
