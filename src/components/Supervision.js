import React, { useEffect, useState } from 'react';
import { MantineReactTable } from 'mantine-react-table';
import {
      Card,
      Col,
      DatePicker,
      Divider,
      FloatButton,
      Input,
      InputNumber,
      List,
      Popconfirm,
      Row,
      Select,
      Checkbox as AntCheckbox,
      Table,
      Popover,
      Tooltip
} from 'antd';
import { IoMdAdd } from 'react-icons/io';
import { IoListCircleOutline } from 'react-icons/io5';
import { MdOutlineSettingsBackupRestore } from 'react-icons/md';
import { FcInfo } from 'react-icons/fc';

import {
      Button,
      ButtonStrip,
      Checkbox,
      CircularLoader,
      Modal,
      ModalActions,
      ModalContent,
      ModalTitle,
      Radio
} from '@dhis2/ui';
import {
      AGENT,
      CANCELED,
      COMPLETED,
      DAY,
      DESCENDANTS,
      DIRECTE,
      DQR,
      FAVORIS,
      INDICATOR,
      MONTH,
      NA,
      NOTICE_BOX_DEFAULT,
      NOTICE_BOX_ERROR,
      NOTICE_BOX_WARNING,
      NOTIFICATION_CRITICAL,
      NOTIFICATION_SUCCESS,
      ORGANISATION_UNIT,
      PENDING_VALIDATION,
      QUARTER,
      RANDOM,
      SCHEDULED,
      TYPE_GENERATION_AS_ENROLMENT,
      TYPE_GENERATION_AS_EVENT,
      TYPE_GENERATION_AS_TEI,
      TYPE_SUPERVISION_AGENT,
      TYPE_SUPERVISION_ORGANISATION_UNIT,
      WEEK,
      YEAR
} from '../utils/constants';
import { goToNewPage, loadDataStore, saveDataToDataStore } from '../utils/functions';
import { MyNoticeBox } from './MyNoticeBox';
import {
      ANALYTICS_ROUTE,
      API_BASE_ROUTE,
      DATA_ELEMENT_GROUPS_ROUTE,
      ENROLLMENTS_ROUTE,
      EVENTS_ROUTE,
      ORGANISATION_UNITS_ROUTE,
      ORGANISATION_UNIT_GROUPS_ROUTE,
      ORGANISATION_UNIT_GROUP_SETS_ROUTE,
      PROGRAMS_STAGE_ROUTE,
      PROGS_ROUTE,
      SERVER_URL,
      TRACKED_ENTITY_ATTRIBUTES_ROUTE,
      TRACKED_ENTITY_INSTANCES_ROUTE,
      USERS_ROUTE
} from '../utils/api.routes';
import axios from 'axios';
import OrganisationUnitsTree from './OrganisationUnitsTree';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { RiDeleteBinLine } from 'react-icons/ri';
import MyNotification from './MyNotification';
import { v4 as uuid } from 'uuid';
import { BsArrowRight } from 'react-icons/bs';
import { BsArrowLeft } from 'react-icons/bs';
import { Stepper } from 'react-form-stepper';
import { FiSave } from 'react-icons/fi';
import { ImCancelCircle } from 'react-icons/im';
import { CgCloseO } from 'react-icons/cg';
import { TbSelect } from 'react-icons/tb';
import { DataDimension } from '@dhis2/analytics';
import { IoMdOpen } from 'react-icons/io';
import { MdStars } from 'react-icons/md';
import shuffle from 'shuffle-array';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { BLUE, GRAY_DARK, GREEN, ORANGE, RED, WHITE } from '../utils/couleurs';
import { getDefaultStatusPaymentIfStatusIsNull, getDefaultStatusSupervisionIfStatusIsNull } from './DashboardSchedule';
import translate, { translateDataStoreLabel } from '../utils/translator';
import { useConfig } from '@dhis2/app-runtime';
const quarterOfYear = require('dayjs/plugin/quarterOfYear');
const weekOfYear = require('dayjs/plugin/weekOfYear');

dayjs.extend(weekOfYear);
dayjs.extend(quarterOfYear);
dayjs.extend(customParseFormat);

const Supervision = ({ me }) => {
      const [dataStoreSupervisionConfigs, setDataStoreSupervisionConfigs] = useState([]);
      const [dataStoreIndicatorConfigs, setDataStoreIndicatorConfigs] = useState([]);

      const [dataStoreIndicators, setDataStoreIndicators] = useState([]);
      const [dataStoreCrosschecks, setDataStoreCrosschecks] = useState([]);
      const [dataStoreDECompletness, setDataStoreDECompletness] = useState([]);
      const [dataStoreDSCompletness, setDataStoreDSCompletness] = useState([]);
      const [dataStoreRegistres, setDataStoreRegistres] = useState([]);

      const [dataStoreIndicatorsMapping, setDataStoreIndicatorsMapping] = useState([]);
      const { apiVersion } = useConfig();

      const [isEditionMode, setEditionMode] = useState(false);

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

      const [organisationUnits, setOrganisationUnits] = useState([]);
      const [users, setUsers] = useState([]);
      const [organisationUnitGroupSets, setOrganisationUnitGroupSets] = useState([]);
      const [programStages, setProgramStages] = useState([]);
      const [isNewMappingMode, setIsNewMappingMode] = useState(false);
      const [mappingConfigs, setMappingConfigs] = useState([]);
      const [nonTranslateMappingConfigs, setNonTranslateMappingConfigs] = useState([]);
      const [analyticIndicatorResults, setAnalyticIndicatorResults] = useState([]);
      const [randomResults, setRandomResults] = useState([]);
      const [_, setAnalyticErrorMessage] = useState(null);
      const [teisList, setTeisList] = useState([]);
      const [isEmpty, setEmpty] = useState(false);
      const [allSupervisionsFromTracker, setAllSupervisionsFromTracker] = useState([]);
      const [organisationUnitGroups, setOrganisationUnitGroups] = useState([]);
      const [teisPerformanceList, setTeisPerformanceList] = useState([]);
      const [equipeList, setEquipeList] = useState([]);
      const [favoritPerformanceList, setFavoritPerformanceList] = useState([]);
      const [dataElementGroups, setDataElementGroups] = useState([]);
      const [favoritBackgroundInformationList, setFavoritBackgroundInformationList] = useState([]);

      const [visibleTeamLeadContent, setVisibleTeamLeadContent] = useState(false);
      const [visibleAnalyticComponentModal, setVisibleAnalyticComponentModal] = useState(false);
      const [visibleAnalyticComponentPerformanceModal, setVisibleAnalyticComponentPerformanceModal] = useState(false);
      const [visibleAddEquipeModal, setVisibleAddEquipeModal] = useState(false);
      const [visibleAddFavoritPerformanceModal, setVisibleAddFavoritPerformanceModal] = useState(false);

      const [selectedBackgroundInformationTypeConfiguration, setSelectedBackgroundInformationTypeConfiguration] =
            useState(DIRECTE);
      const [selectedBackgroundInformationFavorit, setSelectedBackgroundInformationFavorit] = useState([]);

      const [selectedTeamLead, setSelectedTeamLead] = useState(null);
      const [selectedStep, setSelectedStep] = useState(0);
      const [selectedSupervisionType, setSelectedSupervisionType] = useState(null);
      const [selectedProgram, setSelectedProgram] = useState(null);
      const [selectedPlanificationType, setSelectedPlanificationType] = useState(null);
      const [selectedOrganisationUnits, setSelectedOrganisationUnits] = useState([]);
      const [selectedIndicators, setSelectedIndicators] = useState([]);
      const [selectedPeriod, setSelectedPeriod] = useState(null);
      const [selectedOrganisationUnitGroupSet, setSelectedOrganisationUnitGroupSet] = useState(null);
      const [selectedOrganisationUnitGroup, setSelectedOrganisationUnitGroup] = useState(null);
      const [selectedPeriodType, setSelectedPeriodType] = useState(null);
      const [selectedProgramStage, setSelectedProgramStage] = useState(null);
      const [selectedDataElement, setSelectedDataElement] = useState(null);
      const [selectedMetaDatas, setSelectedMetaDatas] = useState([]);
      const [selectedOrganisationUnitSingle, setSelectedOrganisationUnitSingle] = useState(null);
      const [selectedAgents, setSelectedAgents] = useState([]);
      const [selectedSupervisionsConfigProgram, setSelectedSupervisionConfigProgram] = useState(null);
      const [selectedOrgUnitSupervisionFromTracker, setSelectedOrgUnitSupervisionFromTracker] = useState(null);
      const [selectedPeriodSupervisionConfig, setSelectedPeriodSupervisionConfig] = useState(null);
      const [selectedOrganisationUnitGroups, setSelectedOrganisationUnitGroups] = useState([]);
      const [selectedEquipeSuperviseurs, setSelectedEquipeSuperviseurs] = useState([]);
      const [selectedEquipeAutreSuperviseurs, setSelectedEquipeAutreSuperviseurs] = useState([]);
      const [selectedSelectionTypeForPerformance, setSelectedSelectionTypeForPerformance] = useState(DIRECTE);
      const [selectedElementForPerformances, setSelectedElementForPerformances] = useState([]);
      const [selectedFavoritForPerformance, setSelectedFavoritForPerformance] = useState(null);

      const [inputFavorisName, setInputFavoritName] = useState('');
      const [inputEquipeAutreSuperviseur, setInputEquipeAutreSuperviseur] = useState('');
      const [inputMeilleur, setInputMeilleur] = useState(0);
      const [inputMauvais, setInputMauvais] = useState(0);
      const [inputMeilleurPositif, setInputMeilleurPositif] = useState(true);
      const [inputFields, setInputFields] = useState([]);
      const [inputDataSourceDisplayName, setInputDataSourceDisplayName] = useState('');
      const [inputDataSourceID, setInputDataSourceID] = useState(null);
      const [inputEquipeName, setInputEquipeName] = useState('');
      const [inputNbrOrgUnit, setInputNbrOrgUnit] = useState(0);

      const [loadingDataStoreSupervisionConfigs, setLoadingDataStoreSupervisionConfigs] = useState(false);
      const [loadingDataStoreIndicatorConfigs, setLoadingDataStoreIndicatorConfigs] = useState(false);
      const [loadingOrganisationUnits, setLoadingOrganisationUnits] = useState(false);
      const [loadingOrganisationUnitGroupSets, setLoadingOrganisationUnitGroupSets] = useState(false);
      const [loadingUsers, setLoadingUsers] = useState(false);
      const [loadingProgramStages, setLoadingProgramStages] = useState(false);
      const [loadingSupervisionPlanification, setLoadingSupervisionPlanification] = useState(false);
      const [loadingAnalyticIndicatorResults, setLoadingAnalyticIndicatorResults] = useState(false);
      const [loadingTeiList, setLoadingTeiList] = useState(false);
      const [loadingAllSupervisionsFromTracker, setLoadingAllSupervisionsFromTracker] = useState(false);
      const [loadingOrgUnitsSupervisionsFromTracker, setLoadingOrgUnitsSupervisionsFromTracker] = useState(false);
      const [loadingOrganisationUnitGroups, setLoadingOrganisationUnitGroups] = useState(false);
      const [loadingPerformanceFavoritsConfigs, setLoadingPerformanceFavoritsConfigs] = useState(false);
      const [loadingBackgroundInformationFavoritsConfigs, setLoadingBackgroundInformationFavoritsConfigs] =
            useState(false);
      const [loadingDataElementGroups, setLoadingDataElementGroups] = useState(false);

      const periodTypesOptions = () => {
            return [
                  {
                        value: DAY,
                        label: DAY
                  },
                  {
                        value: WEEK,
                        label: WEEK
                  },
                  {
                        value: MONTH,
                        label: MONTH
                  },
                  {
                        value: QUARTER,
                        label: QUARTER
                  },
                  {
                        value: YEAR,
                        label: YEAR
                  }
            ];
      };

      const disabledDate = current => {
            return current && dayjs(new Date()).subtract(1, 'day').isBefore(current) ? false : true;
      };

      const handleCancelEvent = async rowEvent => {
            try {
                  const correctProgramStageFromDataStore =
                        selectedSupervisionsConfigProgram?.programStageConfigurations?.find(
                              p => p.programStage && p.programStage.id === rowEvent.programStageId
                        );

                  if (!correctProgramStageFromDataStore) throw new Error('No program Stage configurated');

                  const newDataValues = rowEvent.dataValues
                        ?.map(dv => dv.dataElement)
                        .includes(correctProgramStageFromDataStore.statusSupervisionField?.id)
                        ? rowEvent.dataValues.map(dvEl => {
                                if (correctProgramStageFromDataStore.statusSupervisionField?.id === dvEl) {
                                      return {
                                            ...dvEl,
                                            value: CANCELED.value
                                      };
                                } else {
                                      return dvEl;
                                }
                          })
                        : [
                                ...rowEvent.dataValues,
                                {
                                      dataElement: correctProgramStageFromDataStore.statusSupervisionField?.id,
                                      value: CANCELED.value
                                }
                          ];

                  const payload = {
                        events: [
                              {
                                    trackedEntityInstance: rowEvent.trackedEntityInstance,
                                    orgUnit: rowEvent.orgUnit,
                                    program: rowEvent.program,
                                    event: rowEvent.event,
                                    programStage: rowEvent.programStageId,
                                    eventDate: dayjs(rowEvent.period).format('YYYY-MM-DD'),
                                    status: 'COMPLETED',
                                    completedDate: dayjs().format('YYYY-MM-DD'),
                                    dataValues: newDataValues
                              }
                        ]
                  };
                  await axios.post(`${EVENTS_ROUTE}`, payload);
                  loadTeisPlanifications(
                        selectedSupervisionsConfigProgram?.program?.id,
                        selectedOrgUnitSupervisionFromTracker?.id
                  );
                  setNotification({
                        show: true,
                        message: translate('Operation_Success'),
                        type: NOTIFICATION_SUCCESS
                  });
            } catch (err) {
                  return setNotification({
                        show: true,
                        message: translate('Operation_Failed'),
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const columns = () => {
            return selectedSupervisionsConfigProgram?.planificationType === ORGANISATION_UNIT
                  ? [
                          {
                                accessorKey: 'libelle', //access nested data with dot notation
                                header: `${translate('Unite_Organisation')}`
                          },

                          {
                                accessorKey: 'teamLead', //access nested data with dot notation
                                header: `${translate('Team_Lead')}`,
                                Cell: ({ cell, row }) => (
                                      <>
                                            {cell.getValue()?.trim()?.length > 0 && (
                                                  <span
                                                        style={{
                                                              background: '#FFF4B0',
                                                              fontSize: '12px',
                                                              padding: '6px',
                                                              marginRight: '5px',
                                                              fontWeight: 'bold',
                                                              borderRadius: '6px',
                                                              marginTop: '2px',
                                                              border: '1px solid #ccc'
                                                        }}
                                                  >
                                                        {cell.getValue()}
                                                  </span>
                                            )}
                                      </>
                                )
                          },
                          {
                                accessorKey: 'superviseurs',
                                header: `${translate('Superviseurs')}`,
                                Cell: ({ cell, row }) =>
                                      cell.getValue()?.trim()?.length > 0 &&
                                      cell.getValue()?.trim()?.split(',')?.length > 0 ? (
                                            <div
                                                  style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        flexWrap: 'wrap'
                                                  }}
                                            >
                                                  {cell.getValue()?.split(',')?.length >= 3 ? (
                                                        <Popover
                                                              content={
                                                                    <div style={{ maxWidth: '400px' }}>
                                                                          <div
                                                                                style={{
                                                                                      display: 'flex',
                                                                                      alignItems: 'center',
                                                                                      flexWrap: 'wrap'
                                                                                }}
                                                                          >
                                                                                {cell
                                                                                      .getValue()
                                                                                      ?.split(',')
                                                                                      ?.map((sup, index) => (
                                                                                            <div
                                                                                                  key={index}
                                                                                                  style={{
                                                                                                        background:
                                                                                                              '#0A939640',
                                                                                                        fontSize: '12px',
                                                                                                        padding: '4px',
                                                                                                        border: '1px solid #ccc',
                                                                                                        marginRight:
                                                                                                              '5px',
                                                                                                        borderRadius:
                                                                                                              '6px',
                                                                                                        marginTop: '5px'
                                                                                                  }}
                                                                                            >
                                                                                                  {' '}
                                                                                                  {sup}
                                                                                            </div>
                                                                                      ))}
                                                                          </div>
                                                                    </div>
                                                              }
                                                              title={translate('Superviseurs')}
                                                              trigger="hover"
                                                        >
                                                              <div
                                                                    style={{
                                                                          display: 'flex',
                                                                          alignItems: 'center',
                                                                          flexWrap: 'wrap'
                                                                    }}
                                                              >
                                                                    {cell
                                                                          .getValue()
                                                                          ?.split(',')
                                                                          ?.map(
                                                                                (sup, index) =>
                                                                                      index < 3 && (
                                                                                            <div
                                                                                                  key={index}
                                                                                                  style={{
                                                                                                        background:
                                                                                                              '#0A939640',
                                                                                                        fontSize: '12px',
                                                                                                        border: '1px solid #ccc',
                                                                                                        padding: '4px',
                                                                                                        cursor: 'pointer',
                                                                                                        marginRight:
                                                                                                              '5px',
                                                                                                        borderRadius:
                                                                                                              '6px',
                                                                                                        marginTop: '5px'
                                                                                                  }}
                                                                                            >
                                                                                                  {' '}
                                                                                                  {sup}
                                                                                            </div>
                                                                                      )
                                                                          )}
                                                                    <div
                                                                          style={{
                                                                                cursor: 'pointer',
                                                                                marginLeft: '5px'
                                                                          }}
                                                                    >
                                                                          ...
                                                                    </div>
                                                              </div>
                                                        </Popover>
                                                  ) : (
                                                        cell
                                                              .getValue()
                                                              ?.split(',')
                                                              ?.map((sup, index) => (
                                                                    <div
                                                                          key={index}
                                                                          style={{
                                                                                background: '#0A939640',
                                                                                border: '1px solid #ccc',
                                                                                fontSize: '12px',
                                                                                padding: '4px',
                                                                                marginRight: '5px',
                                                                                borderRadius: '6px',
                                                                                marginTop: '5px'
                                                                          }}
                                                                    >
                                                                          {sup}
                                                                    </div>
                                                              ))
                                                  )}
                                            </div>
                                      ) : (
                                            <></>
                                      )
                          },
                          {
                                accessorKey: 'period',
                                header: `${translate('Periode')}`
                          },

                          {
                                accessorKey: 'statusSupervision', //normal accessorKey
                                header: `${translate('Status_Supervision')}`,
                                size: 150,
                                Cell: ({ cell, row }) => {
                                      return (
                                            <>
                                                  <span
                                                        title={getStatusNameAndColor(cell.getValue())?.name}
                                                        style={{
                                                              fontSize: '12px',
                                                              padding: '6px',
                                                              marginRight: '5px',
                                                              fontWeight: 'bold',
                                                              borderRadius: '6px',
                                                              marginTop: '2px',
                                                              border: '1px solid #000',
                                                              background: getStatusNameAndColor(cell.getValue())?.color
                                                                    ?.background,
                                                              color: getStatusNameAndColor(cell.getValue())?.color?.text
                                                        }}
                                                  >
                                                        {getStatusNameAndColor(cell.getValue())?.name}
                                                  </span>
                                            </>
                                      );
                                }
                          },
                          {
                                header: `${translate('Actions')}`,
                                size: 50,
                                Cell: ({ cell, row }) => {
                                      return (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                  <Tooltip
                                                        onClick={() =>
                                                              parseInt(apiVersion) >=
                                                              parseInt(process.env.REACT_APP_NEW_DHIS2_VERSION)
                                                                    ? goToNewPage(
                                                                            `${SERVER_URL}/dhis-web-capture/index.html#/enrollmentEventEdit?eventId=${row.original.event}&orgUnitId=${row.original.orgUnit}`
                                                                      )
                                                                    : goToNewPage(
                                                                            `${SERVER_URL}/dhis-web-tracker-capture/index.html#/dashboard?tei=${row.original.trackedEntityInstance}&program=${row.original.program}&ou=${row.original.orgUnit}`
                                                                      )
                                                        }
                                                        title={translate('Ouvrir_Dans_Le_Tracker')}
                                                  >
                                                        <IoMdOpen
                                                              style={{
                                                                    fontSize: '20px',
                                                                    color: BLUE,
                                                                    cursor: 'pointer'
                                                              }}
                                                        />
                                                  </Tooltip>
                                                  <div style={{ marginLeft: '10px' }}>
                                                        <Popconfirm
                                                              title={translate('Annuler_Planification')}
                                                              description={translate('Confirmation_Annulation_Event')}
                                                              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                              onConfirm={() => handleCancelEvent(row.original)}
                                                        >
                                                              <MdOutlineSettingsBackupRestore
                                                                    title={translate('Annuler_Planification')}
                                                                    style={{
                                                                          fontSize: '25px',
                                                                          color: ORANGE,
                                                                          cursor: 'pointer'
                                                                    }}
                                                              />
                                                        </Popconfirm>
                                                  </div>
                                            </div>
                                      );
                                }
                          }
                    ]
                  : [
                          {
                                accessorKey: 'agent', //access nested data with dot notation
                                header: `${translate('Agent')}`
                          },
                          {
                                accessorKey: 'libelle', //access nested data with dot notation
                                header: `${translate('Unite_Organisation')}`
                          },
                          {
                                accessorKey: 'teamLead', //access nested data with dot notation
                                header: `${translate('Team_Lead')}`,
                                Cell: ({ cell, row }) => (
                                      <>
                                            {cell.getValue()?.trim()?.length > 0 && (
                                                  <span
                                                        style={{
                                                              background: '#0A939640',
                                                              fontSize: '12px',
                                                              padding: '5px',
                                                              marginRight: '5px',
                                                              fontWeight: 'bold',
                                                              borderRadius: '6px',
                                                              marginTop: '2px'
                                                        }}
                                                  >
                                                        {' '}
                                                        {cell.getValue()}
                                                  </span>
                                            )}
                                      </>
                                )
                          },
                          {
                                accessorKey: 'superviseurs',
                                header: `${translate('Superviseurs')}`,
                                Cell: ({ cell, row }) =>
                                      cell.getValue()?.trim()?.length > 0 &&
                                      cell.getValue()?.trim()?.split(',')?.length > 0 ? (
                                            <div
                                                  style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        flexWrap: 'wrap'
                                                  }}
                                            >
                                                  {cell.getValue()?.split(',')?.length >= 3 ? (
                                                        <Popover
                                                              content={
                                                                    <div>
                                                                          {cell
                                                                                .getValue()
                                                                                ?.split(',')
                                                                                ?.map((sup, index) => (
                                                                                      <span
                                                                                            key={index}
                                                                                            style={{
                                                                                                  background:
                                                                                                        '#0A939640',
                                                                                                  fontSize: '12px',
                                                                                                  padding: '4px',
                                                                                                  marginRight: '5px',
                                                                                                  borderRadius: '6px',
                                                                                                  marginTop: '2px'
                                                                                            }}
                                                                                      >
                                                                                            {' '}
                                                                                            {sup}
                                                                                      </span>
                                                                                ))}
                                                                    </div>
                                                              }
                                                              title={translate('Superviseurs')}
                                                              trigger="hover"
                                                        >
                                                              {cell
                                                                    .getValue()
                                                                    ?.split(',')
                                                                    ?.map(
                                                                          (sup, index) =>
                                                                                index < 3 && (
                                                                                      <span
                                                                                            key={index}
                                                                                            style={{
                                                                                                  background:
                                                                                                        '#0A939640',
                                                                                                  fontSize: '12px',
                                                                                                  padding: '4px',
                                                                                                  marginRight: '5px',
                                                                                                  borderRadius: '6px',
                                                                                                  marginTop: '2px'
                                                                                            }}
                                                                                      >
                                                                                            {' '}
                                                                                            {sup}
                                                                                      </span>
                                                                                )
                                                                    )}
                                                        </Popover>
                                                  ) : (
                                                        cell
                                                              .getValue()
                                                              ?.split(',')
                                                              ?.map((sup, index) => (
                                                                    <span
                                                                          key={index}
                                                                          style={{
                                                                                background: '#0A939640',
                                                                                fontSize: '12px',
                                                                                padding: '4px',
                                                                                marginRight: '5px',
                                                                                borderRadius: '6px',
                                                                                marginTop: '2px'
                                                                          }}
                                                                    >
                                                                          {sup}
                                                                    </span>
                                                              ))
                                                  )}
                                            </div>
                                      ) : (
                                            <></>
                                      )
                          },
                          {
                                accessorKey: 'period',
                                header: `${translate('Periode')}`
                          },
                          {
                                accessorKey: 'statusSupervision', //normal accessorKey
                                header: `${translate('Status_Supervision')}`,
                                Cell: ({ cell, row }) => {
                                      return (
                                            <>
                                                  <span
                                                        title={getStatusNameAndColor(cell.getValue())?.name}
                                                        style={{
                                                              fontSize: '12px',
                                                              padding: '6px',
                                                              marginRight: '5px',
                                                              fontWeight: 'bold',
                                                              borderRadius: '6px',
                                                              marginTop: '2px',
                                                              border: '1px solid #000',
                                                              background: getStatusNameAndColor(cell.getValue())?.color
                                                                    ?.background,
                                                              color: getStatusNameAndColor(cell.getValue())?.color?.text
                                                        }}
                                                  >
                                                        {getStatusNameAndColor(cell.getValue())?.name}
                                                  </span>
                                            </>
                                      );
                                }
                          },

                          {
                                header: `${translate('Actions')}`,
                                size: 100,
                                Cell: ({ cell, row }) => {
                                      return (
                                            <div style={{ textAlign: 'center' }}>
                                                  {/* <Popconfirm
                                                        title={translate('Open_Event_With')}
                                                        okText={translate('Open_With_New_Tracker')}
                                                        cancelText={translate('Open_With_Old_Tracker')}
                                                        onCancel={() =>
                                                             
                                                        }
                                                        onConfirm={() =>
                                                            
                                                        }
                                                  > */}
                                                  <Tooltip title={translate('Ouvrir_Dans_Le_Tracker')}>
                                                        <IoMdOpen
                                                              onClick={() =>
                                                                    parseInt(apiVersion) >=
                                                                    parseInt(process.env.REACT_APP_NEW_DHIS2_VERSION)
                                                                          ? goToNewPage(
                                                                                  `${SERVER_URL}/dhis-web-capture/index.html#/enrollmentEventEdit?eventId=${row.original.event}&orgUnitId=${row.original.orgUnit}`
                                                                            )
                                                                          : goToNewPage(
                                                                                  `${SERVER_URL}/dhis-web-tracker-capture/index.html#/dashboard?tei=${row.original.trackedEntityInstance}&program=${row.original.program}&ou=${row.original.orgUnit}`
                                                                            )
                                                              }
                                                              style={{
                                                                    fontSize: '20px',
                                                                    color: BLUE,
                                                                    cursor: 'pointer'
                                                              }}
                                                        />
                                                  </Tooltip>
                                                  {/* </Popconfirm> */}
                                            </div>
                                      );
                                }
                          }
                    ];
      };

      const loadOrganisationUnits = async () => {
            try {
                  if (!me) throw new Error(translate('Erreur_Recuperation_Me'));

                  setLoadingOrganisationUnits(true);
                  setLoadingDataStoreSupervisionConfigs(true);

                  const userOrganisationUnitId = me.organisationUnits?.length > 0 && me.organisationUnits?.[0].id;

                  if (userOrganisationUnitId) {
                        const response = await axios.get(ORGANISATION_UNITS_ROUTE);
                        loadDataStoreSupervisionConfigs(response.data.organisationUnits);
                        setOrganisationUnits(response.data?.organisationUnits);
                        setLoadingOrganisationUnits(false);
                  }
            } catch (err) {
                  setLoadingOrganisationUnits(false);
            }
      };

      const loadDataElementGroups = async () => {
            try {
                  setLoadingDataElementGroups(true);
                  const response = await axios.get(`${DATA_ELEMENT_GROUPS_ROUTE}?paging=false&fields=id,displayName`);
                  setDataElementGroups(response.data?.dataElementGroups);
                  setLoadingDataElementGroups(false);
            } catch (err) {
                  setLoadingDataElementGroups(false);
            }
      };

      const loadOrganisationUnitGroups = async () => {
            try {
                  setLoadingOrganisationUnitGroups(true);

                  const response = await axios.get(ORGANISATION_UNIT_GROUPS_ROUTE);
                  setOrganisationUnitGroups(response.data.organisationUnitGroups);
                  setLoadingOrganisationUnitGroups(false);
            } catch (err) {
                  setLoadingOrganisationUnitGroups(false);
            }
      };

      const loadTeisPlanifications = async (program_id, orgUnit_id, ouMode = DESCENDANTS) => {
            try {
                  setLoadingAllSupervisionsFromTracker(true);
                  const response = await axios.get(
                        `${TRACKED_ENTITY_INSTANCES_ROUTE}.json?program=${program_id}&ou=${orgUnit_id}&ouMode=${ouMode}&order=created:DESC&fields=trackedEntityInstance,created,program,orgUnit,enrollments[*],attributes&pageSize=10000`
                  );
                  setAllSupervisionsFromTracker(response.data.trackedEntityInstances);
                  setLoadingAllSupervisionsFromTracker(false);
            } catch (err) {
                  setLoadingAllSupervisionsFromTracker(false);
                  throw err;
            }
      };

      const loadAllSupervisionsFromTracker = async (dataStoreprogramList, orgUnitList) => {
            try {
                  setLoadingAllSupervisionsFromTracker(true);
                  if (dataStoreprogramList.length > 0) {
                        const currentProgram = dataStoreprogramList[0];
                        const currentOrgUnit = orgUnitList.find(ou => ou.id === me?.organisationUnits?.[0]?.id);

                        if (currentProgram) {
                              setSelectedSupervisionConfigProgram(currentProgram);
                              setSelectedPeriodSupervisionConfig(dayjs());
                              setSelectedOrgUnitSupervisionFromTracker(currentOrgUnit);
                              loadProgramStages(currentProgram.program.id);
                              await loadTeisPlanifications(currentProgram.program.id, currentOrgUnit?.id, DESCENDANTS);
                        }
                  }

                  setLoadingAllSupervisionsFromTracker(false);
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
                  setLoadingAllSupervisionsFromTracker(false);
            }
      };

      const loadProgramStages = async (programID, setState = null) => {
            try {
                  !setState && setLoadingProgramStages(true);

                  let route = `${PROGRAMS_STAGE_ROUTE},program,programStageDataElements[dataElement[id,displayName,dataElementGroups]]`;
                  if (programID) route = `${route}&filter=program.id:eq:${programID}`;

                  const response = await axios.get(route);

                  !setState && setProgramStages(response.data.programStages);
                  setState && setState(response.data.programStages);
                  !setState && setLoadingProgramStages(false);
            } catch (err) {
                  !setState && setLoadingProgramStages(false);
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

      const loadOrganisationUnitsGroupSets = async () => {
            try {
                  setLoadingOrganisationUnitGroupSets(true);
                  const response = await axios.get(ORGANISATION_UNIT_GROUP_SETS_ROUTE);
                  setOrganisationUnitGroupSets(response.data.organisationUnitGroupSets);
                  setLoadingOrganisationUnitGroupSets(false);
            } catch (err) {
                  setLoadingOrganisationUnitGroupSets(false);
            }
      };

      const loadDataStoreSupervisionConfigs = async organisationUnitList => {
            try {
                  setLoadingDataStoreSupervisionConfigs(true);
                  const response = await loadDataStore(process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY, null, null, null);
                  if (!response || response.length === 0) {
                        setLoadingDataStoreSupervisionConfigs(false);
                        return setNoticeBox({
                              show: true,
                              message: translate('Aucun_Programme_Configurer'),
                              title: translate('Configuration'),
                              type: NOTICE_BOX_WARNING
                        });
                  }

                  await loadAllSupervisionsFromTracker(response, organisationUnitList);
                  setDataStoreSupervisionConfigs(response);
                  setLoadingDataStoreSupervisionConfigs(false);
            } catch (err) {
                  setLoadingDataStoreSupervisionConfigs(false);
            }
      };

      const loadDataStorePerformanceFavoritsConfigs = async () => {
            try {
                  setLoadingPerformanceFavoritsConfigs(true);
                  const response = await loadDataStore(process.env.REACT_APP_PERFORMANCE_FAVORITS_KEY, null, null, []);

                  setFavoritPerformanceList(response);
                  setSelectedFavoritForPerformance(null);
                  setLoadingPerformanceFavoritsConfigs(false);
            } catch (err) {
                  setLoadingPerformanceFavoritsConfigs(false);
            }
      };

      const loadDataStoreBackgroundInformationFavoritsConfigs = async () => {
            try {
                  setLoadingBackgroundInformationFavoritsConfigs(true);
                  const response = await loadDataStore(
                        process.env.REACT_APP_BACKGROUND_INFORMATION_FAVORITS_KEY,
                        null,
                        null,
                        []
                  );

                  setFavoritBackgroundInformationList(response);
                  setSelectedBackgroundInformationFavorit([]);
                  setLoadingBackgroundInformationFavoritsConfigs(false);
            } catch (err) {
                  setLoadingBackgroundInformationFavoritsConfigs(false);
            }
      };

      const loadDataStoreIndicatorsMapping = async () => {
            try {
                  const response = await loadDataStore(process.env.REACT_APP_INDICATORS_MAPPING_KEY, null, null, null);
                  setDataStoreIndicatorsMapping(response);
            } catch (err) {}
      };

      const loadDataStoreIndicatorsConfigs = async () => {
            try {
                  setLoadingDataStoreIndicatorConfigs(true);
                  const response = await loadDataStore(process.env.REACT_APP_INDICATORS_CONFIG_KEY, null, null, null);
                  setDataStoreIndicatorConfigs(response);
                  setLoadingDataStoreIndicatorConfigs(false);
            } catch (err) {
                  setLoadingDataStoreIndicatorConfigs(false);
            }
      };

      const loadDataStoreIndicators = async () => {
            try {
                  const response = await loadDataStore(process.env.REACT_APP_INDICATORS_KEY, null, null, []);
                  setDataStoreIndicators(response);
            } catch (err) {}
      };

      const loadDataStoreDECompletness = async () => {
            try {
                  const response = await loadDataStore(process.env.REACT_APP_DE_COMPLETNESS_KEY, null, null, []);
                  setDataStoreDECompletness(response);
            } catch (err) {}
      };

      const loadDataStoreDSCompletness = async () => {
            try {
                  const response = await loadDataStore(process.env.REACT_APP_DS_COMPLETNESS_KEY, null, null, []);
                  setDataStoreDSCompletness(response);
            } catch (err) {}
      };

      const loadDataStoreRegistres = async () => {
            try {
                  const response = await loadDataStore(process.env.REACT_APP_REGISTRES_KEY, null, null, []);
                  setDataStoreRegistres(response);
            } catch (err) {}
      };

      const loadDataStoreCrosschecks = async () => {
            try {
                  const response = await loadDataStore(process.env.REACT_APP_CROSS_CUT_KEY, null, null, []);
                  setDataStoreCrosschecks(response);
            } catch (err) {}
      };

      const getStatusNameAndColor = status => {
            if (status === NA.value) {
                  return {
                        name: translate(`${NA.name}`),
                        color: { background: GRAY_DARK, text: WHITE }
                  };
            }

            if (status === CANCELED.value) {
                  return {
                        name: translate(`${CANCELED.name}`),
                        color: { background: RED, text: WHITE }
                  };
            }

            if (status === PENDING_VALIDATION.value) {
                  return {
                        name: translate(`${PENDING_VALIDATION.name}`),
                        color: { background: ORANGE, text: WHITE }
                  };
            }

            if (status === COMPLETED.value) {
                  return {
                        name: translate(`${COMPLETED.name}`),
                        color: { background: GREEN, text: WHITE }
                  };
            }

            if (status === SCHEDULED.value) {
                  return {
                        name: translate(`${SCHEDULED.name}`),
                        color: { background: BLUE, text: WHITE }
                  };
            }

            return {
                  name: translate(`${SCHEDULED.name}`),
                  color: { background: BLUE, text: WHITE }
            };
      };

      const filterAndGetPlanfications = () =>
            allSupervisionsFromTracker
                  .reduce((prev, current) => {
                        if (selectedSupervisionsConfigProgram.generationType === TYPE_GENERATION_AS_TEI) {
                              if (
                                    selectedPeriodSupervisionConfig &&
                                    dayjs(current.created).format('YYYYMM') ===
                                          dayjs(selectedPeriodSupervisionConfig).format('YYYYMM') &&
                                    current.enrollments?.filter(
                                          en => en.program === selectedSupervisionsConfigProgram?.program?.id
                                    )
                              ) {
                                    if (
                                          current.enrollments?.filter(
                                                en => en.program === selectedSupervisionsConfigProgram?.program?.id
                                          )[0]?.events[0]?.programStage !==
                                          selectedSupervisionsConfigProgram?.statusSupervision?.programStage?.id
                                    ) {
                                          return prev;
                                    }

                                    const found_event = current.enrollments?.filter(
                                          en => en.program === selectedSupervisionsConfigProgram?.program?.id
                                    )[0]?.events[0];
                                    const eventDate = found_event?.eventDate;
                                    const trackedEntityInstance = current.trackedEntityInstance;
                                    const program = current.enrollments?.filter(
                                          en => en.program === selectedSupervisionsConfigProgram?.program?.id
                                    )[0]?.program;

                                    const superviseursEvents =
                                          selectedSupervisionsConfigProgram?.fieldConfig?.supervisor?.dataElements?.reduce(
                                                (prevEl, curr) => {
                                                      const foundedDataValue = current.enrollments
                                                            ?.filter(
                                                                  en =>
                                                                        en.program ===
                                                                        selectedSupervisionsConfigProgram?.program?.id
                                                            )[0]
                                                            ?.events[0]?.dataValues?.find(
                                                                  el => el.dataElement === curr.id
                                                            );
                                                      if (foundedDataValue) prevEl.push(foundedDataValue);
                                                      return prevEl;
                                                },
                                                []
                                          ) || [];

                                    const superviseurs = superviseursEvents
                                          .reduce((prevEl, curr) => {
                                                if (curr.value && curr.value?.trim()?.length > 0)
                                                      prevEl.push(curr.value);
                                                return prevEl;
                                          }, [])
                                          .join(',');

                                    return [
                                          ...prev,
                                          {
                                                trackedEntityInstance,
                                                agent: `${
                                                      current.attributes?.find(
                                                            att =>
                                                                  att.attribute ===
                                                                  selectedSupervisionsConfigProgram?.attributeName?.id
                                                      )?.value || ''
                                                } ${
                                                      current.attributes?.find(
                                                            att =>
                                                                  att.attribute ===
                                                                  selectedSupervisionsConfigProgram?.attributeFirstName
                                                                        ?.id
                                                      )?.value || ''
                                                }`,

                                                period: eventDate,
                                                programStageId: found_event?.programStage,
                                                event: found_event.event,
                                                dataValues: found_event.dataValues,
                                                superviseurs: superviseurs,
                                                enrollment: current.enrollments?.filter(
                                                      en =>
                                                            en.program ===
                                                            selectedSupervisionsConfigProgram?.program?.id
                                                )[0]?.enrollment,
                                                program: program,
                                                orgUnit: current.orgUnit,
                                                storedBy: current.enrollments?.filter(
                                                      en =>
                                                            en.program ===
                                                            selectedSupervisionsConfigProgram?.program?.id
                                                )[0]?.storedBy,
                                                libelle: current.enrollments?.filter(
                                                      en =>
                                                            en.program ===
                                                            selectedSupervisionsConfigProgram?.program?.id
                                                )[0]?.orgUnitName,
                                                statusSupervision:
                                                      found_event?.dataValues?.find(
                                                            dv =>
                                                                  dv.dataElement ===
                                                                  selectedSupervisionsConfigProgram?.statusSupervision
                                                                        ?.dataElement?.id
                                                      )?.value || getDefaultStatusSupervisionIfStatusIsNull(),
                                                statusPayment:
                                                      found_event?.dataValues?.find(
                                                            dv =>
                                                                  dv.dataElement ===
                                                                  selectedSupervisionsConfigProgram?.statusPayment
                                                                        ?.dataElement?.id
                                                      )?.value || getDefaultStatusPaymentIfStatusIsNull()
                                          }
                                    ].filter(ev => ev.period);
                              }
                        }

                        if (selectedSupervisionsConfigProgram.generationType === TYPE_GENERATION_AS_ENROLMENT) {
                              if (selectedPeriodSupervisionConfig) {
                                    const enrollmentsList = [];
                                    for (let en of current.enrollments?.filter(
                                          en => en.program === selectedSupervisionsConfigProgram?.program?.id
                                    )) {
                                          if (
                                                dayjs(en.enrollmentDate).format('YYYYMM') ===
                                                dayjs(selectedPeriodSupervisionConfig).format('YYYYMM')
                                          ) {
                                                if (
                                                      en?.events[0]?.programStage ===
                                                      selectedSupervisionsConfigProgram?.statusSupervision?.programStage
                                                            ?.id
                                                ) {
                                                      enrollmentsList.push(en);
                                                }
                                          }
                                    }
                                    return [
                                          ...prev,
                                          ...enrollmentsList
                                                .filter(en => en?.events[0]?.eventDate)
                                                .map(en => ({
                                                      trackedEntityInstance: en.trackedEntityInstance,
                                                      agent: `${
                                                            current.attributes?.find(
                                                                  att =>
                                                                        att.attribute ===
                                                                        selectedSupervisionsConfigProgram?.attributeName
                                                                              ?.id
                                                            )?.value || ''
                                                      } ${
                                                            current.attributes?.find(
                                                                  att =>
                                                                        att.attribute ===
                                                                        selectedSupervisionsConfigProgram
                                                                              ?.attributeFirstName?.id
                                                            )?.value || ''
                                                      }`,
                                                      period: en?.events[0]?.eventDate,

                                                      superviseurs:
                                                            selectedSupervisionsConfigProgram?.fieldConfig?.supervisor?.dataElements
                                                                  ?.reduce((prevEl, curr) => {
                                                                        const foundedDataValue =
                                                                              en?.events[0]?.dataValues?.find(
                                                                                    el => el.dataElement === curr.id
                                                                              );
                                                                        if (
                                                                              foundedDataValue &&
                                                                              foundedDataValue.value &&
                                                                              foundedDataValue.value?.trim()?.length > 0
                                                                        )
                                                                              prevEl.push(foundedDataValue.value);
                                                                        return prevEl;
                                                                  }, [])
                                                                  ?.join(','),

                                                      enrollment: en.enrollment,
                                                      program: en.program,
                                                      orgUnit: current.orgUnit,
                                                      storedBy: en.storedBy,
                                                      dataValues: en?.events[0]?.dataValues || [],
                                                      libelle: en.orgUnitName,
                                                      programStageId: en?.events[0]?.programStage,
                                                      event: en?.events[0]?.event,
                                                      statusSupervision:
                                                            en?.events[0]?.dataValues?.find(
                                                                  dv =>
                                                                        dv.dataElement ===
                                                                        selectedSupervisionsConfigProgram
                                                                              ?.statusSupervision?.dataElement?.id
                                                            )?.value || getDefaultStatusSupervisionIfStatusIsNull(),
                                                      statusPayment:
                                                            en?.events[0]?.dataValues?.find(
                                                                  dv =>
                                                                        dv.dataElement ===
                                                                        selectedSupervisionsConfigProgram?.statusPayment
                                                                              ?.dataElement?.id
                                                            )?.value || getDefaultStatusPaymentIfStatusIsNull()
                                                }))
                                    ];
                              }
                        }

                        if (selectedSupervisionsConfigProgram.generationType === TYPE_GENERATION_AS_EVENT) {
                              if (selectedPeriodSupervisionConfig) {
                                    const eventList = [];
                                    const currentEnrollment = current.enrollments?.filter(
                                          en => en.program === selectedSupervisionsConfigProgram?.program?.id
                                    )[0];
                                    for (let event of currentEnrollment?.events || []) {
                                          if (
                                                dayjs(event.eventDate).format('YYYYMM') ===
                                                dayjs(selectedPeriodSupervisionConfig).format('YYYYMM')
                                          ) {
                                                eventList.push(event);
                                          }
                                    }

                                    return [
                                          ...prev,
                                          ...eventList
                                                .filter(ev => ev.eventDate)
                                                .map(ev => ({
                                                      trackedEntityInstance: currentEnrollment?.trackedEntityInstance,
                                                      agent: `${
                                                            current.attributes?.find(
                                                                  att =>
                                                                        att.attribute ===
                                                                        selectedSupervisionsConfigProgram?.attributeName
                                                                              ?.id
                                                            )?.value || ''
                                                      } ${
                                                            current.attributes?.find(
                                                                  att =>
                                                                        att.attribute ===
                                                                        selectedSupervisionsConfigProgram
                                                                              ?.attributeFirstName?.id
                                                            )?.value || ''
                                                      }`,
                                                      period: ev.eventDate,
                                                      teamLead: ev.dataValues
                                                            ?.find(
                                                                  dv =>
                                                                        dv.dataElement ===
                                                                        selectedSupervisionsConfigProgram?.programStageConfigurations?.find(
                                                                              p =>
                                                                                    p.programStage?.id ===
                                                                                    ev.programStage
                                                                        )?.supervisorField?.[0]?.id
                                                            )
                                                            ?.value?.split(',')?.[0],

                                                      enrollment: currentEnrollment?.enrollment,
                                                      program: currentEnrollment?.program,
                                                      orgUnit: currentEnrollment?.orgUnit,
                                                      storedBy: currentEnrollment?.storedBy,
                                                      dataValues: ev.dataValues,
                                                      event: ev.event,
                                                      libelle: currentEnrollment?.orgUnitName,
                                                      superviseurs:
                                                            selectedSupervisionsConfigProgram?.programStageConfigurations
                                                                  ?.find(p => p.programStage?.id === ev.programStage)
                                                                  .supervisorField?.reduce((prevEl, curr) => {
                                                                        const foundedDataValue = ev?.dataValues?.find(
                                                                              el => el.dataElement === curr.id
                                                                        );
                                                                        if (
                                                                              foundedDataValue &&
                                                                              foundedDataValue.value &&
                                                                              foundedDataValue.value?.trim()?.length > 0
                                                                        )
                                                                              prevEl.push(foundedDataValue.value);

                                                                        return prevEl;
                                                                  }, [])
                                                                  ?.join(','),
                                                      programStageId: ev.programStage,
                                                      statusSupervision:
                                                            ev.dataValues?.find(
                                                                  dv =>
                                                                        dv.dataElement ===
                                                                        selectedSupervisionsConfigProgram?.programStageConfigurations?.find(
                                                                              p =>
                                                                                    p.programStage?.id ===
                                                                                    ev.programStage
                                                                        ).statusSupervisionField?.id
                                                            )?.value || getDefaultStatusSupervisionIfStatusIsNull(),
                                                      statusPayment:
                                                            ev.dataValues?.find(
                                                                  dv =>
                                                                        dv.dataElement ===
                                                                        selectedSupervisionsConfigProgram?.statusPayment
                                                                              ?.dataElement?.id
                                                            )?.value || getDefaultStatusPaymentIfStatusIsNull()
                                                }))
                                    ];
                              }
                        }

                        return prev;
                  }, [])
                  .sort((a, b) => parseInt(dayjs(b.period).valueOf()) - parseInt(dayjs(a.period).valueOf()));

      const handleChangeSupervisionType = ({ value }) => {
            setSelectedProgram(null);
            setSelectedAgents([]);
            setSelectedOrganisationUnitSingle(null);
            setSelectedSupervisionType(value);
      };

      const handleChangePlanificationType = ({ value }) => {
            setInputMauvais(0);
            setInputMeilleur(0);
            setInputMeilleurPositif(false);

            setSelectedIndicators([]);
            setSelectedPeriod(null);
            setSelectedPeriodType(null);
            setSelectedOrganisationUnits([]);
            setSelectedOrganisationUnitGroup(null);
            setSelectedOrganisationUnitGroupSet(null);
            setSelectedElementForPerformances([]);

            setSelectedOrganisationUnitSingle(null);
            setSelectedOrganisationUnitGroups([]);
            setInputNbrOrgUnit(0);
            setRandomResults([]);

            if (value === INDICATOR && organisationUnitGroupSets.length === 0) {
                  loadOrganisationUnitsGroupSets();
            }

            setSelectedPlanificationType(value);
      };

      const handleClickFloatingBtn = () => {
            setEditionMode(!isEditionMode);
      };

      const handleClickSupervisionItem = sup => {
            setSelectedProgramStage(null);
            setSelectedDataElement(null);
            setSelectedAgents([]);
            setSelectedOrganisationUnitSingle(null);
            setSelectedBackgroundInformationFavorit([]);
            setSelectedBackgroundInformationTypeConfiguration(DIRECTE);
            setMappingConfigs([]);
            setNonTranslateMappingConfigs([]);

            loadProgramStages(sup.program?.id);
            setSelectedProgram(sup);
            if (selectedSupervisionType === TYPE_SUPERVISION_AGENT && sup?.attributesToDisplay?.length === 0) {
                  return setNotification({
                        show: true,
                        message: translate('Attribute_Non_Configurer'),
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const handleDeleteOtherSupervisor = (item, index) => {
            if (item) {
                  setInputFields(
                        inputFields.map((inp, inputIndex) => {
                              if (inputIndex === index) {
                                    return {
                                          ...inp,
                                          otherSupervisors:
                                                inp.otherSupervisors?.filter(otherSup => otherSup !== item) || []
                                    };
                              }
                              return inp;
                        })
                  );
            }
      };

      const generatedAutoCode = async attr_id => {
            try {
                  const route = `${TRACKED_ENTITY_ATTRIBUTES_ROUTE}/${attr_id}/generate`; /// identifiant pev
                  const autoGenetedCodeResponse = await axios.get(route);
                  return autoGenetedCodeResponse.data;
            } catch (err) {
                  throw err;
            }
      };

      const createTei = async tei => {
            try {
                  const response = await axios.post(`${TRACKED_ENTITY_INSTANCES_ROUTE}`, tei);
                  return response.data;
            } catch (err) {
                  throw err;
            }
      };

      const createEnrollment = async enrollment => {
            try {
                  const response = await axios.post(`${ENROLLMENTS_ROUTE}`, enrollment);
                  return response.data;
            } catch (err) {
                  throw err;
            }
      };

      const createEvents = async events => {
            try {
                  const response = await axios.post(`${EVENTS_ROUTE}`, events);
                  return response.data;
            } catch (err) {
                  throw err;
            }
      };

      const generateTeiWithEnrollmentWithEvents = async payload => {
            try {
                  const currentProgram = await axios.get(
                        `${PROGS_ROUTE}/${selectedProgram?.program?.id}?fields=id,displayName,trackedEntityType,programStages[id,programStageDataElements[dataElement]],programTrackedEntityAttributes[trackedEntityAttribute]`
                  );
                  if (!currentProgram.data) throw new Error(translate('Programme_Non_Trouver'));

                  const autoGenerateUIDForSupervision =
                        selectedProgram?.selectedSupervisionAutoGenerateID?.id || 'WzghGqeASL5';

                  const generatedCode = await generatedAutoCode(autoGenerateUIDForSupervision);

                  const tei = {
                        trackedEntityType: currentProgram.data.trackedEntityType.id,
                        orgUnit: payload.orgUnit,
                        attributes: [{ attribute: generatedCode.ownerUid, value: generatedCode.value }]
                  };

                  const createdTEI = await createTei(tei);
                  const tei_id = createdTEI?.response?.importSummaries[0]?.reference;

                  if (!tei_id) throw new Error(translate('Erreur_Creation_TEI'));

                  const enrollment = {
                        orgUnit: payload.orgUnit,
                        trackedEntityInstance: tei_id,
                        program: payload.program
                  };

                  const createdEnrollment = await createEnrollment(enrollment);
                  const enrollment_id = createdEnrollment?.response?.importSummaries[0]?.reference;

                  if (!enrollment_id)
                        throw new Error(
                              createdEnrollment?.response?.importSummaries[0]?.description ||
                                    translate('Erreur_Creation_Enrollment')
                        );

                  // const availableProgramStages = [];
                  const newEventsList = [];

                  // for (let stage of availableProgramStages) {
                  const eventPayload = {
                        eventDate: payload.period
                              ? dayjs(payload.period).format('YYYY-MM-DD')
                              : dayjs().format('YYYY-MM-DD'),
                        program: payload.program,
                        orgUnit: payload.orgUnit,
                        enrollment: enrollment_id,
                        programStage: payload.programStage?.id,
                        trackedEntityInstance: tei_id,
                        dataValues: []
                  };

                  if (mappingConfigs?.length > 0) {
                        eventPayload.status = 'ACTIVE';
                        eventPayload.eventDate = payload.period
                              ? dayjs(payload.period).format('YYYY-MM-DD')
                              : dayjs().format('YYYY-MM-DD');
                        eventPayload.dueDate = payload.period
                              ? dayjs(payload.period).format('YYYY-MM-DD')
                              : dayjs().format('YYYY-MM-DD');
                        eventPayload.dataValues = mappingConfigs
                              .filter(ev => ev.programStage?.id === payload.programStage?.id)
                              .map(ev => ({
                                    dataElement: ev.dataElement?.id,
                                    value: ev.indicator?.displayName
                              }));
                  } else {
                        eventPayload.status = 'SCHEDULE';
                        eventPayload.dueDate = payload.period
                              ? dayjs(payload.period).format('YYYY-MM-DD')
                              : dayjs().format('YYYY-MM-DD');
                  }

                  // Ajoute des dataValues superviseurs
                  if (payload.programStageConfig?.supervisorField?.length > 0) {
                        const newDataValues = [];

                        /*
                         * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son INFÉRIEUR au nombres de superviseurs sélectionnés
                         */

                        let newSupervisorsList = [
                              ...payload.supervisors?.map(s => s.displayName),
                              ...payload.otherSupervisors
                        ];

                        if (payload?.equipe?.teamLead?.trim()?.length > 0) {
                              newSupervisorsList = [
                                    payload?.equipe?.teamLead,
                                    ...newSupervisorsList.filter(s => s !== payload?.equipe?.teamLead)
                              ];
                        }

                        if (payload.programStageConfig?.supervisorField?.length < newSupervisorsList?.length) {
                              const supervisorArrayCurrent = newSupervisorsList?.slice(
                                    0,
                                    payload.programStageConfig?.supervisorField?.length
                              );
                              const supervisorArraylast = newSupervisorsList?.slice(
                                    payload.programStageConfig?.supervisorField?.length
                              );

                              for (let i = 0; i < payload.programStageConfig?.supervisorField?.length; i++) {
                                    for (let j = 0; j < supervisorArrayCurrent.length; j++) {
                                          if (i === j) {
                                                const currentDE = payload.programStageConfig?.supervisorField[i];
                                                const currentSUP = supervisorArrayCurrent[j];

                                                if (
                                                      currentDE &&
                                                      currentSUP &&
                                                      !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)
                                                ) {
                                                      if (
                                                            i ===
                                                            payload.programStageConfig?.supervisorField?.length - 1
                                                      ) {
                                                            newDataValues.push({
                                                                  dataElement: currentDE.id,
                                                                  value: `${currentSUP},${supervisorArraylast?.join(
                                                                        ','
                                                                  )}`
                                                            });
                                                      } else {
                                                            newDataValues.push({
                                                                  dataElement: currentDE.id,
                                                                  value: currentSUP
                                                            });
                                                      }
                                                }
                                          }
                                    }
                              }
                        }

                        /*
                         * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son EGALE au nombres de superviseurs sélectionnés
                         */
                        if (payload.programStageConfig?.supervisorField?.length === newSupervisorsList?.length) {
                              for (let i = 0; i < payload.programStageConfig?.supervisorField?.length; i++) {
                                    for (let j = 0; j < newSupervisorsList.length; j++) {
                                          if (i === j) {
                                                const currentDE = payload.programStageConfig?.supervisorField[i];
                                                const currentSUP = newSupervisorsList[j];
                                                if (
                                                      currentDE &&
                                                      currentSUP &&
                                                      !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)
                                                ) {
                                                      newDataValues.push({
                                                            dataElement: currentDE.id,
                                                            value: currentSUP
                                                      });
                                                }
                                          }
                                    }
                              }
                        }

                        /*
                         * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son SUPERIEUR au nombres de superviseurs sélectionnés
                         */
                        if (payload.programStageConfig?.supervisorField?.length > newSupervisorsList?.length) {
                              for (let i = 0; i < payload.programStageConfig?.supervisorField?.length; i++) {
                                    for (let j = 0; j < newSupervisorsList?.length; j++) {
                                          if (i === j) {
                                                const currentDE = payload.programStageConfig?.supervisorField[i];
                                                const currentSUP = newSupervisorsList[j];
                                                if (
                                                      currentDE &&
                                                      currentSUP &&
                                                      !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)
                                                ) {
                                                      newDataValues.push({
                                                            dataElement: currentDE.id,
                                                            value: currentSUP
                                                      });
                                                }
                                          }
                                    }
                              }
                        }

                        if (newDataValues.length > 0) {
                              eventPayload.dataValues = [...eventPayload.dataValues, ...newDataValues];
                        }
                  }

                  // Period implémentation

                  let newDataValueAsListofArray = [];
                  if (payload.programStageConfig?.indicators?.length > 0 && payload.periodVerification) {
                        const indicatorsList = payload.programStageConfig?.indicators;

                        newDataValueAsListofArray = await Promise.all(
                              eventPayload.dataValues?.map(async dv => {
                                    const newDvList = [];
                                    const foundInd = indicatorsList.find(ind => ind.value?.id === dv.dataElement);

                                    if (foundInd) {
                                          const foundAggrageMappingElement = dataStoreIndicatorsMapping?.find(
                                                d =>
                                                      d.indicator ===
                                                      mappingConfigs
                                                            .filter(
                                                                  ev => ev.programStage?.id === payload.programStage?.id
                                                            )
                                                            .find(ev => ev.indicator?.displayName === dv.value)
                                                            ?.indicator?.id
                                          )?.dhis2;

                                          const periodType = dataStoreIndicatorsMapping?.find(
                                                d =>
                                                      d.indicator ===
                                                      mappingConfigs
                                                            .filter(
                                                                  ev => ev.programStage?.id === payload.programStage?.id
                                                            )
                                                            .find(ev => ev.indicator?.displayName === dv.value)
                                                            ?.indicator?.id
                                          )?.periodType;

                                          if (foundAggrageMappingElement) {
                                                const elementMONTH_1 = foundInd?.DHIS2MonthlyValue1;
                                                const elementMONTH_2 = foundInd?.DHIS2MonthlyValue2;
                                                const elementMONTH_3 = foundInd?.DHIS2MonthlyValue3;
                                                const elementMONTH_4 = foundInd?.DHIS2MonthlyValue4;
                                                const elementMONTH_5 = foundInd?.DHIS2MonthlyValue5;
                                                const elementMONTH_6 = foundInd?.DHIS2MonthlyValue6;
                                                const elementMONTH_7 = foundInd?.DHIS2MonthlyValue7;
                                                const elementMONTH_8 = foundInd?.DHIS2MonthlyValue8;
                                                const elementMONTH_9 = foundInd?.DHIS2MonthlyValue9;
                                                const elementMONTH_10 = foundInd?.DHIS2MonthlyValue10;
                                                const elementMONTH_11 = foundInd?.DHIS2MonthlyValue11;
                                                const elementMONTH_12 = foundInd?.DHIS2MonthlyValue12;
                                                const elementMONTH_13 = foundInd?.DHIS2MonthlyValue13;
                                                const elementMONTH_14 = foundInd?.DHIS2MonthlyValue14;
                                                const elementMONTH_15 = foundInd?.DHIS2MonthlyValue15;

                                                let periodPayload = {
                                                      eventDate: eventPayload.eventDate,
                                                      orgUnit: eventPayload.orgUnit,
                                                      trackedEntityInstance: eventPayload.trackedEntityInstance,
                                                      programStage: eventPayload.programStage
                                                };

                                                if (elementMONTH_1) {
                                                      const periodObject = getRightPeriodFormat(
                                                            1,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;

                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month1 = {
                                                            position: 1,
                                                            dataElement: elementMONTH_1,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };

                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_1.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                if (elementMONTH_2) {
                                                      const periodObject = getRightPeriodFormat(
                                                            2,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;
                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month2 = {
                                                            position: 2,
                                                            dataElement: elementMONTH_2,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };

                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_2.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                if (elementMONTH_3) {
                                                      const periodObject = getRightPeriodFormat(
                                                            3,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;
                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month3 = {
                                                            position: 3,
                                                            dataElement: elementMONTH_3,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };

                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_3.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                if (elementMONTH_4) {
                                                      const periodObject = getRightPeriodFormat(
                                                            4,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;
                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month4 = {
                                                            position: 4,
                                                            dataElement: elementMONTH_4,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };

                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_4.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                if (elementMONTH_5) {
                                                      const periodObject = getRightPeriodFormat(
                                                            5,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;
                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month5 = {
                                                            position: 5,
                                                            dataElement: elementMONTH_5,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };
                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_5.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                if (elementMONTH_6) {
                                                      const periodObject = getRightPeriodFormat(
                                                            6,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;
                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month6 = {
                                                            position: 6,
                                                            dataElement: elementMONTH_6,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };

                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_6.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                if (elementMONTH_7) {
                                                      const periodObject = getRightPeriodFormat(
                                                            7,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;
                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month7 = {
                                                            position: 7,
                                                            dataElement: elementMONTH_7,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };

                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_7.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                if (elementMONTH_8) {
                                                      const periodObject = getRightPeriodFormat(
                                                            8,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;
                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month8 = {
                                                            position: 8,
                                                            dataElement: elementMONTH_8,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };

                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_8.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                if (elementMONTH_9) {
                                                      const periodObject = getRightPeriodFormat(
                                                            9,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;
                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month9 = {
                                                            position: 9,
                                                            dataElement: elementMONTH_9,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };

                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_9.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                if (elementMONTH_10) {
                                                      const periodObject = getRightPeriodFormat(
                                                            10,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;
                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month10 = {
                                                            position: 10,
                                                            dataElement: elementMONTH_10,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };

                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_10.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                if (elementMONTH_11) {
                                                      const periodObject = getRightPeriodFormat(
                                                            11,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;
                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month11 = {
                                                            position: 11,
                                                            dataElement: elementMONTH_11,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };

                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_11.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                if (elementMONTH_12) {
                                                      const periodObject = getRightPeriodFormat(
                                                            12,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;
                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month12 = {
                                                            position: 12,
                                                            dataElement: elementMONTH_12,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };

                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_12.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                if (elementMONTH_13) {
                                                      const periodObject = getRightPeriodFormat(
                                                            13,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;
                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month13 = {
                                                            position: 13,
                                                            dataElement: elementMONTH_13,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };

                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_13.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                if (elementMONTH_14) {
                                                      const periodObject = getRightPeriodFormat(
                                                            14,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;
                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month14 = {
                                                            position: 14,
                                                            dataElement: elementMONTH_14,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };

                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_14.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                if (elementMONTH_15) {
                                                      const periodObject = getRightPeriodFormat(
                                                            15,
                                                            periodType,
                                                            payload.periodVerification
                                                      );

                                                      const orgUnitId = eventPayload.orgUnit;
                                                      const dx = foundAggrageMappingElement.id;
                                                      const value = await getAnalyticValue(
                                                            periodObject?.analytic,
                                                            orgUnitId,
                                                            dx
                                                      );

                                                      periodPayload.month15 = {
                                                            position: 15,
                                                            dataElement: elementMONTH_15,
                                                            value,
                                                            period: periodObject?.normal,
                                                            periodString: periodObject?.normal
                                                      };

                                                      if (value) {
                                                            newDvList.push({
                                                                  dataElement: elementMONTH_15.id,
                                                                  value: value
                                                            });
                                                      }
                                                }

                                                await updatePeriodsConfigs(periodPayload);
                                          }
                                    } else {
                                          newDvList.push(dv);
                                    }

                                    return newDvList;
                              }) || []
                        );
                  }

                  const newDataValueList = newDataValueAsListofArray.reduce(
                        (prev, curr) => (curr?.length > 0 ? prev.concat(curr) : prev),
                        []
                  );

                  eventPayload.dataValues = [...eventPayload.dataValues, ...newDataValueList];

                  if (!newEventsList.map(ev => ev.programStage).includes(payload.programStage?.id)) {
                        newEventsList.push(eventPayload);
                  }

                  await createEvents({ events: newEventsList });

                  const currentTEI = await axios.get(
                        `${TRACKED_ENTITY_INSTANCES_ROUTE}/${tei_id}?fields=*,enrollments`
                  );
                  return currentTEI.data;
            } catch (err) {
                  throw err;
            }
      };

      const updatePeriodsConfigs = async periodPayload => {
            try {
                  let configPayload = (await loadDataStore(
                        process.env.REACT_APP_PERIODS_CONFIG_KEY,
                        null,
                        null,
                        null
                  )) || { periods: [], month1KeyWords: [], month2KeyWords: [], month3KeyWords: [] };
                  if (configPayload && periodPayload) {
                        configPayload = { ...configPayload, periods: [periodPayload, ...configPayload.periods] };
                  }
                  await saveDataToDataStore(process.env.REACT_APP_PERIODS_CONFIG_KEY, configPayload, null, null, null);
            } catch (err) {}
      };

      const generateEventsAsNewSupervision = async payload => {
            try {
                  const existingTEI_List_response = await axios.get(
                        `${TRACKED_ENTITY_INSTANCES_ROUTE}?ou=${payload.orgUnit}&order=created:DESC&program=${selectedProgram?.program?.id}&fields=*&ouMode=SELECTED`
                  );
                  const existingTEI_List = existingTEI_List_response.data.trackedEntityInstances;

                  if (existingTEI_List.length === 0) {
                        return await generateTeiWithEnrollmentWithEvents(payload);
                  } else {
                        const current_tei = existingTEI_List[0];

                        const enrollment_id = current_tei?.enrollments.filter(
                              en => en.program === selectedProgram?.program?.id
                        )[0]?.enrollment;

                        if (!enrollment_id) throw new Error(translate('Erreur_Creation_Enrolement'));

                        const newEventsList = [];

                        const eventPayload = {
                              eventDate: payload.period
                                    ? dayjs(payload.period).format('YYYY-MM-DD')
                                    : dayjs().format('YYYY-MM-DD'),
                              program: payload.program,
                              orgUnit: payload.orgUnit,
                              enrollment: enrollment_id,
                              programStage: payload.programStage?.id,
                              trackedEntityInstance: current_tei.trackedEntityInstance,
                              dataValues: []
                        };

                        if (mappingConfigs?.length > 0) {
                              eventPayload.status = 'ACTIVE';
                              eventPayload.eventDate = payload.period
                                    ? dayjs(payload.period).format('YYYY-MM-DD')
                                    : dayjs().format('YYYY-MM-DD');
                              eventPayload.dueDate = payload.period
                                    ? dayjs(payload.period).format('YYYY-MM-DD')
                                    : dayjs().format('YYYY-MM-DD');

                              eventPayload.dataValues =
                                    selectedProgram?.configurationType === DQR
                                          ? mappingConfigs
                                                  .filter(ev => ev.programStage?.id === payload.programStage?.id)
                                                  .map(ev => ({
                                                        dataElement: ev.dataElement?.id,
                                                        value: ev.indicator?.displayName
                                                  }))
                                          : mappingConfigs.map(ev => ({
                                                  dataElement: ev.dataElement?.id,
                                                  value: ev.indicator?.displayName
                                            }));
                        } else {
                              eventPayload.status = 'SCHEDULE';
                              eventPayload.dueDate = payload.period
                                    ? dayjs(payload.period).format('YYYY-MM-DD')
                                    : dayjs().format('YYYY-MM-DD');
                        }

                        // Ajoute des dataValues superviseurs
                        if (payload.programStageConfig?.supervisorField?.length > 0) {
                              const newDataValues = [];

                              /*
                               * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son INFÉRIEUR au nombres de superviseurs sélectionnés
                               */

                              let newSupervisorsList = [
                                    ...payload.supervisors?.map(s => s.displayName),
                                    ...payload.otherSupervisors
                              ];

                              if (payload?.equipe?.teamLead?.trim()?.length > 0) {
                                    newSupervisorsList = [
                                          payload?.equipe?.teamLead,
                                          ...newSupervisorsList.filter(s => s !== payload?.equipe?.teamLead)
                                    ];
                              }

                              if (payload.programStageConfig?.supervisorField?.length < newSupervisorsList?.length) {
                                    const supervisorArrayCurrent = newSupervisorsList?.slice(
                                          0,
                                          payload.programStageConfig?.supervisorField?.length
                                    );
                                    const supervisorArraylast = newSupervisorsList?.slice(
                                          payload.programStageConfig?.supervisorField?.length
                                    );

                                    for (let i = 0; i < payload.programStageConfig?.supervisorField?.length; i++) {
                                          for (let j = 0; j < supervisorArrayCurrent.length; j++) {
                                                if (i === j) {
                                                      const currentDE = payload.programStageConfig?.supervisorField[i];
                                                      const currentSUP = supervisorArrayCurrent[j];
                                                      if (
                                                            currentDE &&
                                                            currentSUP &&
                                                            !newDataValues
                                                                  .map(dv => dv.dataElement)
                                                                  .includes(currentDE.id)
                                                      ) {
                                                            if (
                                                                  i ===
                                                                  payload.programStageConfig?.supervisorField?.length -
                                                                        1
                                                            ) {
                                                                  newDataValues.push({
                                                                        dataElement: currentDE.id,
                                                                        value: `${currentSUP},${supervisorArraylast?.join(
                                                                              ','
                                                                        )}`
                                                                  });
                                                            } else {
                                                                  newDataValues.push({
                                                                        dataElement: currentDE.id,
                                                                        value: currentSUP
                                                                  });
                                                            }
                                                      }
                                                }
                                          }
                                    }
                              }

                              /*
                               * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son EGALE au nombres de superviseurs sélectionnés
                               */
                              if (payload.programStageConfig?.supervisorField?.length === newSupervisorsList?.length) {
                                    for (let i = 0; i < payload.programStageConfig?.supervisorField?.length; i++) {
                                          for (let j = 0; j < newSupervisorsList.length; j++) {
                                                if (i === j) {
                                                      const currentDE = payload.programStageConfig?.supervisorField[i];
                                                      const currentSUP = newSupervisorsList[j];
                                                      if (
                                                            currentDE &&
                                                            currentSUP &&
                                                            !newDataValues
                                                                  .map(dv => dv.dataElement)
                                                                  .includes(currentDE.id)
                                                      ) {
                                                            newDataValues.push({
                                                                  dataElement: currentDE.id,
                                                                  value: currentSUP
                                                            });
                                                      }
                                                }
                                          }
                                    }
                              }

                              /*
                               * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son SUPERIEUR au nombres de superviseurs sélectionnés
                               */
                              if (payload.programStageConfig?.supervisorField?.length > newSupervisorsList?.length) {
                                    for (let i = 0; i < payload.programStageConfig?.supervisorField?.length; i++) {
                                          for (let j = 0; j < newSupervisorsList?.length; j++) {
                                                if (i === j) {
                                                      const currentDE = payload.programStageConfig?.supervisorField[i];
                                                      const currentSUP = newSupervisorsList[j];
                                                      if (
                                                            currentDE &&
                                                            currentSUP &&
                                                            !newDataValues
                                                                  .map(dv => dv.dataElement)
                                                                  .includes(currentDE.id)
                                                      ) {
                                                            newDataValues.push({
                                                                  dataElement: currentDE.id,
                                                                  value: currentSUP
                                                            });
                                                      }
                                                }
                                          }
                                    }
                              }

                              // insertAnalyticValues

                              if (newDataValues.length > 0) {
                                    eventPayload.dataValues = [...eventPayload.dataValues, ...newDataValues];
                              }
                        }

                        let newDataValueAsListofArray = [];
                        if (payload.programStageConfig?.indicators?.length > 0 && payload.periodVerification) {
                              const indicatorsList = payload.programStageConfig?.indicators;

                              newDataValueAsListofArray = await Promise.all(
                                    eventPayload.dataValues?.map(async dv => {
                                          const newDvList = [];
                                          const foundInd = indicatorsList.find(ind => ind.value?.id === dv.dataElement);
                                          if (foundInd) {
                                                const foundAggrageMappingElement = dataStoreIndicatorsMapping?.find(
                                                      d =>
                                                            d.indicator ===
                                                            mappingConfigs
                                                                  .filter(
                                                                        ev =>
                                                                              ev.programStage?.id ===
                                                                              payload.programStage?.id
                                                                  )
                                                                  .find(ev => ev.indicator?.displayName === dv.value)
                                                                  ?.indicator?.id
                                                )?.dhis2;

                                                const periodType = dataStoreIndicatorsMapping?.find(
                                                      d =>
                                                            d.indicator ===
                                                            mappingConfigs
                                                                  .filter(
                                                                        ev =>
                                                                              ev.programStage?.id ===
                                                                              payload.programStage?.id
                                                                  )
                                                                  .find(ev => ev.indicator?.displayName === dv.value)
                                                                  ?.indicator?.id
                                                )?.periodType;

                                                if (foundAggrageMappingElement) {
                                                      const elementMONTH_1 = foundInd?.DHIS2MonthlyValue1;
                                                      const elementMONTH_2 = foundInd?.DHIS2MonthlyValue2;
                                                      const elementMONTH_3 = foundInd?.DHIS2MonthlyValue3;
                                                      const elementMONTH_4 = foundInd?.DHIS2MonthlyValue4;
                                                      const elementMONTH_5 = foundInd?.DHIS2MonthlyValue5;
                                                      const elementMONTH_6 = foundInd?.DHIS2MonthlyValue6;
                                                      const elementMONTH_7 = foundInd?.DHIS2MonthlyValue7;
                                                      const elementMONTH_8 = foundInd?.DHIS2MonthlyValue8;
                                                      const elementMONTH_9 = foundInd?.DHIS2MonthlyValue9;
                                                      const elementMONTH_10 = foundInd?.DHIS2MonthlyValue10;
                                                      const elementMONTH_11 = foundInd?.DHIS2MonthlyValue11;
                                                      const elementMONTH_12 = foundInd?.DHIS2MonthlyValue12;
                                                      const elementMONTH_13 = foundInd?.DHIS2MonthlyValue13;
                                                      const elementMONTH_14 = foundInd?.DHIS2MonthlyValue14;
                                                      const elementMONTH_15 = foundInd?.DHIS2MonthlyValue15;

                                                      let periodPayload = {
                                                            eventDate: eventPayload.eventDate,
                                                            orgUnit: eventPayload.orgUnit,
                                                            trackedEntityInstance: eventPayload.trackedEntityInstance,
                                                            programStage: eventPayload.programStage
                                                      };

                                                      if (elementMONTH_1) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  1,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month1 = {
                                                                  position: 1,
                                                                  dataElement: elementMONTH_1,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };

                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_1.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      if (elementMONTH_2) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  2,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month2 = {
                                                                  position: 2,
                                                                  dataElement: elementMONTH_2,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };

                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_2.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      if (elementMONTH_3) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  3,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month3 = {
                                                                  position: 3,
                                                                  dataElement: elementMONTH_3,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };

                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_3.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      if (elementMONTH_4) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  4,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month4 = {
                                                                  position: 4,
                                                                  dataElement: elementMONTH_4,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };

                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_4.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      if (elementMONTH_5) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  5,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month5 = {
                                                                  position: 5,
                                                                  dataElement: elementMONTH_5,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };
                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_5.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      if (elementMONTH_6) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  6,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month6 = {
                                                                  position: 6,
                                                                  dataElement: elementMONTH_6,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };

                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_6.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      if (elementMONTH_7) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  7,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month7 = {
                                                                  position: 7,
                                                                  dataElement: elementMONTH_7,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };

                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_7.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      if (elementMONTH_8) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  8,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month8 = {
                                                                  position: 8,
                                                                  dataElement: elementMONTH_8,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };

                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_8.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      if (elementMONTH_9) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  9,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month9 = {
                                                                  position: 9,
                                                                  dataElement: elementMONTH_9,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };

                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_9.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      if (elementMONTH_10) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  10,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month10 = {
                                                                  position: 10,
                                                                  dataElement: elementMONTH_10,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };

                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_10.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      if (elementMONTH_11) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  11,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month11 = {
                                                                  position: 11,
                                                                  dataElement: elementMONTH_11,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };

                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_11.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      if (elementMONTH_12) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  12,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month12 = {
                                                                  position: 12,
                                                                  dataElement: elementMONTH_12,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };

                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_12.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      if (elementMONTH_13) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  13,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month13 = {
                                                                  position: 13,
                                                                  dataElement: elementMONTH_13,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };

                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_13.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      if (elementMONTH_14) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  14,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month14 = {
                                                                  position: 14,
                                                                  dataElement: elementMONTH_14,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };

                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_14.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      if (elementMONTH_15) {
                                                            const periodObject = getRightPeriodFormat(
                                                                  15,
                                                                  periodType,
                                                                  payload.periodVerification
                                                            );

                                                            const orgUnitId = eventPayload.orgUnit;
                                                            const dx = foundAggrageMappingElement.id;
                                                            const value = await getAnalyticValue(
                                                                  periodObject?.analytic,
                                                                  orgUnitId,
                                                                  dx
                                                            );

                                                            periodPayload.month15 = {
                                                                  position: 15,
                                                                  dataElement: elementMONTH_15,
                                                                  value,
                                                                  period: periodObject?.normal,
                                                                  periodString: periodObject?.normal
                                                            };

                                                            if (value) {
                                                                  newDvList.push({
                                                                        dataElement: elementMONTH_15.id,
                                                                        value: value
                                                                  });
                                                            }
                                                      }

                                                      await updatePeriodsConfigs(periodPayload);
                                                }
                                          } else {
                                                newDvList.push(dv);
                                          }

                                          return newDvList;
                                    }) || []
                              );
                        }

                        const newDataValueList = newDataValueAsListofArray.reduce(
                              (prev, curr) => (curr?.length > 0 ? prev.concat(curr) : prev),
                              []
                        );

                        eventPayload.dataValues = [...eventPayload.dataValues, ...newDataValueList];

                        if (!newEventsList.map(ev => ev.programStage).includes(payload.programStage?.id)) {
                              newEventsList.push(eventPayload);
                        }

                        await createEvents({ events: newEventsList });

                        const currentTEI = await axios.get(
                              `${TRACKED_ENTITY_INSTANCES_ROUTE}/${current_tei.trackedEntityInstance}?program=${selectedProgram.program?.id}&fields=*,enrollments`
                        );
                        const currentTEIData = currentTEI.data;
                        return currentTEIData;
                  }
            } catch (err) {
                  throw err;
            }
      };

      const handleSelectIndicators = values =>
            setSelectedIndicators(
                  values.map(val => dataStoreIndicatorConfigs.find(dsInd => dsInd.indicator?.id === val))
            );

      const handleSelectOrgUnitGroup = values =>
            setSelectedOrganisationUnitGroups(
                  values.map(val => organisationUnitGroups.find(orgGp => orgGp.id === val))
            );

      const savePanificationToDataStore = async payloadList => {
            try {
                  if (payloadList) {
                        const newPayload = payloadList.map(payload => ({
                              id: payload.id,
                              program: payload.program,
                              dataSources: payload.dataSources,
                              supervisions:
                                    payload.supervisions?.map(sup => ({
                                          id: sup.id,
                                          organisationUnit: sup.organisationUnit,
                                          program: sup.program,
                                          payment: sup.payment,
                                          period: sup.period,
                                          equipe: {
                                                ...sup.equipe,
                                                superviseurs:
                                                      sup.equipe?.superviseurs?.map(equipSup => ({
                                                            id: equipSup.id,
                                                            name: equipSup.name
                                                      })) || []
                                          },
                                          tei_event: sup.tei?.enrollments
                                                ? sup.tei.enrollments.reduce((prev, curr) => {
                                                        if (
                                                              curr.orgUnit === sup.tei.orgUnit &&
                                                              curr.program === sup.program?.id
                                                        ) {
                                                              const corresponding_event = curr.events?.find(
                                                                    ev =>
                                                                          dayjs(ev.eventDate).format('YYYY-MM-DD') ===
                                                                                dayjs(sup.period).format(
                                                                                      'YYYY-MM-DD'
                                                                                ) ||
                                                                          dayjs(ev.dueDate).format('YYYY-MM-DD') ===
                                                                                dayjs(sup.period).format('YYYY-MM-DD')
                                                              );

                                                              if (corresponding_event) {
                                                                    prev = {
                                                                          ...prev,
                                                                          event: corresponding_event.event,
                                                                          orgUnit: corresponding_event.orgUnit,
                                                                          enrollment: corresponding_event.enrollment,
                                                                          program: corresponding_event.program,
                                                                          programStage:
                                                                                corresponding_event.programStage,
                                                                          trackedEntityInstance:
                                                                                corresponding_event.trackedEntityInstance,
                                                                          orgUnitName: corresponding_event.orgUnitName,
                                                                          created: corresponding_event.created,
                                                                          dueDate: corresponding_event.dueDate,
                                                                          eventDate: corresponding_event.eventDate,
                                                                          storedBy: corresponding_event.storedBy,
                                                                          status: corresponding_event.status
                                                                    };
                                                              }
                                                        }
                                                        return prev;
                                                  }, {})
                                                : sup.tei_event
                                    })) || []
                        }));

                        await saveDataToDataStore(process.env.REACT_APP_SUPERVISIONS_KEY, newPayload);
                  }
            } catch (err) {
                  throw err;
            }
      };

      const savePerformanceFavoritsToDataStore = async payloads => {
            try {
                  if (payloads) {
                        await saveDataToDataStore(process.env.REACT_APP_PERFORMANCE_FAVORITS_KEY, payloads);
                  }
            } catch (err) {
                  throw err;
            }
      };

      const saveSupervisionAsEventStrategy = async inputFieldsList => {
            try {
                  if (inputFieldsList.length > 0) {
                        const supervisionsListByProgramStages = await Promise.all(
                              inputFieldsList?.map(async item => {
                                    let listByProgramStage = [];
                                    for (let progStageConfig of selectedProgram?.programStageConfigurations) {
                                          const found_organisationUnit = organisationUnits.find(
                                                ou => ou.id === item.organisationUnit?.id
                                          );

                                          let is_ok =
                                                (found_organisationUnit &&
                                                      progStageConfig?.programStage &&
                                                      found_organisationUnit.organisationUnitGroups
                                                            ?.map(ouG => ouG.id)
                                                            .includes(progStageConfig?.organisationUnitGroup?.id)) ||
                                                false;

                                          if (selectedProgram?.configurationType === DQR) {
                                                is_ok = true;
                                          }

                                          if (is_ok) {
                                                const payload = {
                                                      ...item,
                                                      orgUnit: item.organisationUnit?.id,
                                                      period: item.period && dayjs(item.period).format('YYYY-MM-DD'),
                                                      periodVerification:
                                                            item.periodVerification &&
                                                            dayjs(item.periodVerification).format('YYYY-MM-DD'),
                                                      program: item.program?.id,
                                                      fieldConfig: item.fieldConfig,
                                                      programStage: progStageConfig.programStage,
                                                      programStageConfig: progStageConfig
                                                };

                                                let createdTEIObject = null;
                                                createdTEIObject = await generateEventsAsNewSupervision(payload);

                                                if (createdTEIObject) {
                                                      listByProgramStage.push({
                                                            ...item,
                                                            id: uuid(),
                                                            planificationType: selectedPlanificationType,
                                                            indicators: selectedIndicators,
                                                            orgUnit: item.organisationUnit?.id,
                                                            period:
                                                                  item.period &&
                                                                  dayjs(item.period).format('YYYY-MM-DD'),
                                                            periodVerification:
                                                                  item.periodVerification &&
                                                                  dayjs(item.periodVerification).format('YYYY-MM-DD'),
                                                            program: item.program,
                                                            programStage: progStageConfig.programStage.id,
                                                            programStageConfig: progStageConfig,
                                                            fieldConfig: item.fieldConfig,
                                                            tei: createdTEIObject
                                                      });
                                                }
                                          }
                                    }

                                    return listByProgramStage;
                              }) || []
                        );

                        const supervisionsList = supervisionsListByProgramStages.reduce((prev, curr) => {
                              if (curr?.length > 0) {
                                    prev = prev.concat(curr);
                              }
                              return prev;
                        }, []);

                        // let planificationPayload = {
                        //       id: uuid(),
                        //       program: selectedProgram,
                        //       dataSources: mappingConfigs,
                        //       supervisions: supervisionsList
                        // };

                        // const newDataStoreSupervisionsPayload = [...newDataStoreSupervisions, planificationPayload];

                        // await savePanificationToDataStore(newDataStoreSupervisionsPayload);
                  }
            } catch (err) {
                  throw err;
            }
      };

      const cleanAllNewSupervisionState = () => {
            setIsNewMappingMode(false);
            setNonTranslateMappingConfigs([]);
            setMappingConfigs([]);
            setProgramStages([]);
            setSelectedAgents([]);
            setTeisList([]);
            setEmpty(false);
            setSelectedStep(0);
            setSelectedSupervisionType(null);
            setSelectedProgram(null);
            setSelectedPlanificationType(null);
            setSelectedOrganisationUnits([]);
            setSelectedIndicators([]);
            setSelectedPeriod(null);
            setSelectedOrganisationUnitGroupSet(null);
            setSelectedOrganisationUnitGroup(null);
            setSelectedPeriodType(null);
            setSelectedProgramStage(null);
            setSelectedDataElement(null);
            setSelectedMetaDatas([]);
            setInputMeilleur(0);
            setInputMauvais(0);
            setInputMeilleurPositif(true);
            setInputFields([]);
            setInputDataSourceDisplayName('');
            setInputDataSourceID(null);
            setSelectedOrganisationUnitSingle(null);
            setAnalyticIndicatorResults([]);
            setRandomResults([]);
            setAnalyticErrorMessage(null);
            setSelectedOrganisationUnitGroups([]);
            setInputNbrOrgUnit(0);
      };

      const validateForms = async inputFields => {
            inputFields.forEach(element => {
                  if (!element.period) throw new Error(translate('Veuillez_Remplire_Champ_Obligatoire'));

                  if (selectedProgram?.fieldConfig?.supervisor?.dataElements?.length > 0) {
                        if (
                              (!element.supervisors || element.supervisors?.length === 0) &&
                              (!element.otherSupervisors || element.otherSupervisors?.length === 0)
                        )
                              throw new Error(translate('Veuillez_Remplire_Champ_Obligatoire'));
                  }
            });
      };

      const getAnalyticValue = async (period, orgUnit, dx) => {
            try {
                  const response = await axios.get(
                        `${ANALYTICS_ROUTE}/dataValueSet.json?dimension=ou:${orgUnit}&dimension=dx:${dx}&dimension=pe:${period}&showHierarchy=false&hierarchyMeta=false&includeMetadataDetails=true&includeNumDen=true&skipRounding=false&completedOnly=false`
                  );
                  return response.data?.dataValues[0]?.value;
            } catch (error) {}
      };

      const handleSupervisionPlanificationSaveBtn = async () => {
            try {
                  await validateForms(inputFields);

                  setLoadingSupervisionPlanification(true);

                  if (
                        selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT &&
                        selectedProgram.generationType === TYPE_GENERATION_AS_EVENT
                  ) {
                        await saveSupervisionAsEventStrategy(inputFields);
                  }

                  loadDataStoreSupervisionConfigs(organisationUnits);
                  loadDataStorePerformanceFavoritsConfigs();

                  setLoadingSupervisionPlanification(false);
                  setNotification({
                        show: true,
                        message: translate('Planification_Effectuer'),
                        type: NOTIFICATION_SUCCESS
                  });
                  setEditionMode(false);
                  setEquipeList([]);
                  cleanAllNewSupervisionState();
            } catch (err) {
                  setLoadingSupervisionPlanification(false);
                  setNotification({
                        show: true,
                        type: NOTIFICATION_CRITICAL,
                        message: err.response?.data?.message || err.message
                  });
            }
      };

      const handleSelectSupervisionProgramConfigForTracker = value => {
            if (value) {
                  const supFound = dataStoreSupervisionConfigs.find(d => d.program?.id === value);
                  setAllSupervisionsFromTracker([]);
                  setSelectedSupervisionConfigProgram(supFound);
            }
      };

      const handleSelectPeriodSupervisionConfig = date => {
            setSelectedPeriodSupervisionConfig(dayjs(date));
      };

      const handleSearchAllSupervisionFromTracker = () => {
            if (
                  selectedSupervisionsConfigProgram &&
                  selectedOrgUnitSupervisionFromTracker &&
                  selectedSupervisionsConfigProgram
            ) {
                  setAllSupervisionsFromTracker([]);
                  loadTeisPlanifications(
                        selectedSupervisionsConfigProgram.program?.id,
                        selectedOrgUnitSupervisionFromTracker.id,
                        DESCENDANTS
                  );
            }
      };

      const RenderSupervisionList = () => (
            <>
                  <div style={{ marginTop: '10px' }}>
                        <Card size="small" className="my-shadow">
                              <Row gutter={[10, 10]}>
                                    <Col md={6}>
                                          <Select
                                                placeholder={translate('Programme')}
                                                onChange={handleSelectSupervisionProgramConfigForTracker}
                                                value={selectedSupervisionsConfigProgram?.program?.id}
                                                style={{ width: '100%' }}
                                                options={dataStoreSupervisionConfigs.map(d => ({
                                                      value: d.program?.id,
                                                      label: d.program?.displayName
                                                }))}
                                                loading={loadingDataStoreSupervisionConfigs}
                                          />
                                    </Col>
                                    <Col md={6}>
                                          <OrganisationUnitsTree
                                                meOrgUnitId={me?.organisationUnits[0]?.id}
                                                orgUnits={organisationUnits}
                                                currentOrgUnits={selectedOrgUnitSupervisionFromTracker}
                                                setCurrentOrgUnits={setSelectedOrgUnitSupervisionFromTracker}
                                                loadingOrganisationUnits={loadingOrgUnitsSupervisionsFromTracker}
                                                setLoadingOrganisationUnits={setLoadingOrgUnitsSupervisionsFromTracker}
                                          />
                                    </Col>
                                    <Col md={6}>
                                          <DatePicker
                                                onChange={handleSelectPeriodSupervisionConfig}
                                                picker="month"
                                                value={selectedPeriodSupervisionConfig}
                                                style={{ width: '100%' }}
                                                placeholder={translate('Periode')}
                                                allowClear={false}
                                          />
                                    </Col>

                                    <Col md={6}>
                                          <Button
                                                primary
                                                onClick={handleSearchAllSupervisionFromTracker}
                                                small
                                                loading={loadingAllSupervisionsFromTracker}
                                                disable={
                                                      loadingAllSupervisionsFromTracker
                                                            ? true
                                                            : selectedSupervisionsConfigProgram &&
                                                              selectedPeriodSupervisionConfig &&
                                                              selectedOrgUnitSupervisionFromTracker
                                                            ? false
                                                            : true
                                                }
                                          >
                                                Rechercher
                                          </Button>
                                    </Col>
                              </Row>
                        </Card>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                        <Card size="small" className="my-shadow">
                              {loadingAllSupervisionsFromTracker && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                          <CircularLoader small />
                                          <span style={{ marginLeft: '20px' }}>
                                                {translate('Chargement_Des_Supervisions')}
                                          </span>
                                    </div>
                              )}
                              {allSupervisionsFromTracker.length === 0 && (
                                    <div
                                          style={{
                                                fontWeight: 'bold',
                                                color: '#00000090',
                                                marginTop: '10px'
                                          }}
                                    >
                                          {translate('Aucune_Supervision_Disponible')}
                                    </div>
                              )}
                              {allSupervisionsFromTracker.length > 0 && (
                                    <MantineReactTable
                                          enableStickyHeader
                                          columns={columns()}
                                          data={filterAndGetPlanfications().map(d => ({
                                                ...d,
                                                period: dayjs(d.period).format('YYYY-MM-DD')
                                          }))}
                                          mantinePaperProps={{
                                                shadow: 'none',
                                                radius: '8px',
                                                withBorder: false
                                          }}
                                          initialState={{
                                                density: 'xs'
                                          }}
                                          mantineTableProps={{
                                                striped: true,
                                                highlightOnHover: true
                                          }}
                                    />
                              )}
                        </Card>
                  </div>
            </>
      );

      const RenderTopContent = () => (
            <>
                  <div
                        style={{
                              padding: '10px 20px',
                              borderBottom: '1px solid #ccc',
                              background: '#FFF',
                              position: 'sticky',
                              top: 0,
                              zIndex: 1000
                        }}
                  >
                        <Row gutter={[6, 6]}>
                              <Col sm={24} md={2}>
                                    <div
                                          style={{
                                                fontWeight: 'bold',
                                                fontSize: '18px',
                                                marginTop: '15px'
                                          }}
                                    >
                                          {translate('Supervisions')}
                                    </div>
                              </Col>
                              <Col sm={24} md={16}>
                                    {isEditionMode && RenderSteps()}
                              </Col>
                              <Col sm={24} md={2} style={{ textAlign: 'right' }}>
                                    {isEditionMode && inputFields.length > 0 && (
                                          <div style={{ marginTop: '15px' }}>
                                                <Button
                                                      onClick={cleanAllNewSupervisionState}
                                                      icon={
                                                            <ImCancelCircle
                                                                  style={{ color: '#fff', fontSize: '18px' }}
                                                            />
                                                      }
                                                      destructive
                                                >
                                                      {translate('Annuler')}
                                                </Button>
                                          </div>
                                    )}
                              </Col>
                              <Col sm={24} md={4} style={{ textAlign: 'left' }}>
                                    {isEditionMode && inputFields.length > 0 && (
                                          <div style={{ marginTop: '15px' }}>
                                                <Popconfirm
                                                      title={translate('Confirmation_Planification_Message')}
                                                      onConfirm={handleSupervisionPlanificationSaveBtn}
                                                >
                                                      <Button
                                                            icon={
                                                                  <FiSave
                                                                        style={{
                                                                              color: '#fff',
                                                                              fontSize: '18px'
                                                                        }}
                                                                  />
                                                            }
                                                            primary
                                                            disabled={loadingSupervisionPlanification}
                                                            loading={loadingSupervisionPlanification}
                                                      >
                                                            {translate('Planifier_Supervision')}
                                                      </Button>
                                                </Popconfirm>
                                          </div>
                                    )}
                              </Col>
                        </Row>
                  </div>
            </>
      );

      const RenderFloatingButton = () => (
            <>
                  <FloatButton
                        tooltip={isEditionMode ? translate('List_Supervisions') : translate('Nouvelle_Supervision')}
                        icon={
                              isEditionMode ? (
                                    <IoListCircleOutline style={{ color: '#FFF', fontSize: '20px' }} />
                              ) : (
                                    <IoMdAdd style={{ color: '#FFF' }} />
                              )
                        }
                        type="primary"
                        style={{
                              right: 50,
                              bottom: 50,
                              width: '60px',
                              height: '60px',
                              boxShadow: '10px 10px 20px #00000050'
                        }}
                        onClick={handleClickFloatingBtn}
                  />
            </>
      );

      const RenderNoticeBox = () => (
            <div style={{ padding: '10px' }}>
                  <MyNoticeBox
                        show={noticeBox.show}
                        message={noticeBox.message}
                        title={noticeBox.title}
                        type={noticeBox.type}
                  />
            </div>
      );

      const RenderSupervisionTypeContent = () => (
            <>
                  <div>
                        <Card className="my-shadow" size="small">
                              <div style={{ fontWeight: 'bold' }}>{translate('Que_Voulez_Vous_Superviser')}</div>
                              <div style={{ display: 'flex', marginTop: '10px' }}>
                                    <div>
                                          <Radio
                                                label={translate('Unite_Organisation')}
                                                className="cursor-pointer"
                                                onChange={handleChangeSupervisionType}
                                                value={TYPE_SUPERVISION_ORGANISATION_UNIT}
                                                checked={selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT}
                                          />
                                    </div>
                                    {0 > 1 && (
                                          <div style={{ marginLeft: '20px' }}>
                                                <Radio
                                                      label={translate('Agent')}
                                                      className="cursor-pointer"
                                                      onChange={handleChangeSupervisionType}
                                                      value={TYPE_SUPERVISION_AGENT}
                                                      checked={selectedSupervisionType === TYPE_SUPERVISION_AGENT}
                                                />
                                          </div>
                                    )}
                              </div>
                        </Card>
                  </div>
            </>
      );

      const RenderSelectedSupervisionTypeList = () => (
            <>
                  <div style={{ marginTop: '10px' }}>
                        <Card
                              className="my-shadow my-scrollable"
                              bodyStyle={{ padding: '0px', margin: '0px', maxHeight: '500px' }}
                              size="small"
                        >
                              <div
                                    style={{
                                          fontWeight: 'bold',
                                          padding: '10px',
                                          borderBottom: '1px solid #ccc'
                                    }}
                              >
                                    {translate('Fiches_Supervisions')}
                              </div>
                              <div style={{ padding: '10px' }}>
                                    {selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT &&
                                          dataStoreSupervisionConfigs
                                                .filter(sup => sup.planificationType === ORGANISATION_UNIT)
                                                .map((sup, index) => (
                                                      <div
                                                            key={index}
                                                            className={`supervision-item ${
                                                                  selectedProgram?.id === sup.id ? 'active' : ''
                                                            }`}
                                                            onClick={() => handleClickSupervisionItem(sup)}
                                                      >
                                                            {sup.program?.displayName}
                                                      </div>
                                                ))}
                                    {selectedSupervisionType === TYPE_SUPERVISION_AGENT &&
                                          dataStoreSupervisionConfigs
                                                .filter(
                                                      sup =>
                                                            sup.generationType === TYPE_GENERATION_AS_EVENT &&
                                                            sup.planificationType === AGENT
                                                )
                                                .map((sup, index) => (
                                                      <div
                                                            key={index}
                                                            className={`supervision-item ${
                                                                  selectedProgram?.id === sup.id ? 'active' : ''
                                                            }`}
                                                            onClick={() => handleClickSupervisionItem(sup)}
                                                      >
                                                            {sup.program?.displayName}
                                                      </div>
                                                ))}
                                    {selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT &&
                                          dataStoreSupervisionConfigs.filter(
                                                sup => sup.planificationType === ORGANISATION_UNIT
                                          ).length === 0 && (
                                                <div style={{ fontWeight: 'bold' }}>
                                                      {' '}
                                                      {translate('Aucun_Programme_Supervision')}{' '}
                                                </div>
                                          )}

                                    {selectedSupervisionType === TYPE_SUPERVISION_AGENT &&
                                          dataStoreSupervisionConfigs.filter(
                                                sup =>
                                                      sup.generationType === TYPE_GENERATION_AS_EVENT &&
                                                      sup.planificationType === AGENT
                                          ).length === 0 && (
                                                <div style={{ fontWeight: 'bold' }}>
                                                      {' '}
                                                      {translate('Aucun_Programme_Supervision')}
                                                </div>
                                          )}
                              </div>
                        </Card>
                  </div>
            </>
      );

      const RenderSupervisionPlanificationType = () => (
            <div>
                  <Card className="my-shadow" size="small">
                        <div style={{ fontWeight: 'bold' }}>{translate('Planification')}</div>
                        <div style={{ display: 'flex', marginTop: '10px' }}>
                              <div>
                                    <Radio
                                          label={translate('Directe')}
                                          className="cursor-pointer"
                                          onChange={handleChangePlanificationType}
                                          value={ORGANISATION_UNIT}
                                          checked={selectedPlanificationType === ORGANISATION_UNIT}
                                    />
                              </div>
                              <div style={{ marginLeft: '20px' }}>
                                    <Radio
                                          label={translate('Basee_Sur_Perfomances')}
                                          className="cursor-pointer"
                                          onChange={handleChangePlanificationType}
                                          value={INDICATOR}
                                          checked={selectedPlanificationType === INDICATOR}
                                    />
                              </div>
                              <div style={{ marginLeft: '20px' }}>
                                    <Radio
                                          label={translate('Aleatoire')}
                                          className="cursor-pointer"
                                          onChange={handleChangePlanificationType}
                                          value={RANDOM}
                                          checked={selectedPlanificationType === RANDOM}
                                    />
                              </div>
                        </div>
                  </Card>
            </div>
      );

      const handleDelelteEquipe = async value => {
            try {
                  if (value) {
                        setEquipeList(equipeList.filter(eq => eq.name !== value));
                        setInputEquipeName('');
                        setInputEquipeAutreSuperviseur('');
                        setSelectedEquipeAutreSuperviseurs([]);
                        setSelectedEquipeSuperviseurs([]);
                        setVisibleTeamLeadContent(false);
                        setSelectedTeamLead(null);
                        setNotification({
                              show: true,
                              message: translate('Suppression_Effectuee'),
                              type: NOTIFICATION_SUCCESS
                        });
                  }
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const handleAddNewEquipeClose = () => {
            setInputEquipeName('');
            setInputEquipeAutreSuperviseur('');
            setSelectedEquipeAutreSuperviseurs([]);
            setSelectedEquipeSuperviseurs([]);
            setVisibleAddEquipeModal(false);
            setVisibleTeamLeadContent(false);
            setSelectedTeamLead(null);
      };

      const handleAddNewEquipeSave = () => {
            try {
                  if (selectedEquipeAutreSuperviseurs.length === 0 && selectedEquipeSuperviseurs.length === 0)
                        throw new Error(translate('Please_Select_One_Supervisor_Or_Other_Supervisor'));

                  if (!selectedTeamLead || selectedTeamLead.trim()?.length === 0)
                        throw new Error(translate('Please_Select_Team_Lead'));

                  if (equipeList.map(e => e.name).includes(inputEquipeName))
                        throw new Error(translate('Equipe_Deja_Ajouter'));

                  const equipePayload = {
                        name: inputEquipeName,
                        teamLead: selectedTeamLead,
                        superviseurs: selectedEquipeSuperviseurs,
                        autreSuperviseurs: selectedEquipeAutreSuperviseurs
                  };
                  setEquipeList([equipePayload, ...equipeList]);
                  setInputEquipeAutreSuperviseur('');
                  setSelectedEquipeAutreSuperviseurs([]);
                  setSelectedEquipeSuperviseurs([]);
                  setInputEquipeName('');
                  setVisibleAddEquipeModal(false);
                  setVisibleTeamLeadContent(false);
                  setSelectedTeamLead(null);
                  setNotification({
                        show: true,
                        message: translate('Equipe_Ajouter'),
                        type: NOTIFICATION_SUCCESS
                  });
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const handleSelectSuperviseurs = values =>
            setSelectedEquipeSuperviseurs(values.map(value => users.find(u => u.id === value)));

      const handleAddEquipeAutreSuperviseurs = () => {
            if (
                  inputEquipeAutreSuperviseur &&
                  !selectedEquipeAutreSuperviseurs?.includes(inputEquipeAutreSuperviseur?.trim())
            ) {
                  setSelectedEquipeAutreSuperviseurs([...selectedEquipeAutreSuperviseurs, inputEquipeAutreSuperviseur]);
                  setInputEquipeAutreSuperviseur('');
            }
      };

      const RenderAddEquipeModal = () =>
            visibleAddEquipeModal && (
                  <>
                        <Modal onClose={() => handleAddNewEquipeClose()}>
                              <ModalTitle>{translate('Nouvelle_Equipe')}</ModalTitle>
                              <ModalContent>
                                    <div
                                          style={{
                                                padding: '20px',
                                                border: '1px solid #ccc',
                                                borderRadius: '5px'
                                          }}
                                    >
                                          {visibleTeamLeadContent ? (
                                                <>
                                                      <div>
                                                            <div style={{ marginBottom: '5px' }}>
                                                                  {translate('Who_Is_The_Team_Lead')}
                                                            </div>
                                                            <Select
                                                                  placeholder={translate('Team_Lead')}
                                                                  style={{ width: '100%' }}
                                                                  value={selectedTeamLead}
                                                                  onChange={value => setSelectedTeamLead(value)}
                                                                  optionFilterProp="label"
                                                                  showSearch
                                                                  allowClear
                                                                  options={[
                                                                        ...selectedEquipeSuperviseurs,
                                                                        ...selectedEquipeAutreSuperviseurs
                                                                  ].map(user =>
                                                                        user.id && user.id.length > 0
                                                                              ? {
                                                                                      label: user.displayName,
                                                                                      value: user.displayName
                                                                                }
                                                                              : { label: user, value: user }
                                                                  )}
                                                            />
                                                      </div>
                                                </>
                                          ) : (
                                                <>
                                                      <div>
                                                            <div style={{ marginBottom: '5px' }}>
                                                                  {translate('Nom_De_Equipe')}
                                                            </div>
                                                            <Input
                                                                  placeholder={translate('Nom_De_Equipe')}
                                                                  style={{ width: '100%' }}
                                                                  value={inputEquipeName}
                                                                  onChange={event =>
                                                                        setInputEquipeName(event.target.value)
                                                                  }
                                                            />
                                                      </div>

                                                      <div style={{ marginTop: '10px' }}>
                                                            <div style={{ marginBottom: '5px' }}>
                                                                  {translate('Superviseurs')}
                                                            </div>
                                                            <Select
                                                                  placeholder={translate('Superviseurs')}
                                                                  style={{ width: '100%' }}
                                                                  loading={loadingUsers}
                                                                  disabled={loadingUsers}
                                                                  value={selectedEquipeSuperviseurs.map(sup => sup.id)}
                                                                  onChange={handleSelectSuperviseurs}
                                                                  mode="multiple"
                                                                  optionFilterProp="label"
                                                                  showSearch
                                                                  allowClear
                                                                  options={users.map(user => ({
                                                                        label: user.displayName,
                                                                        value: user.id
                                                                  }))}
                                                            />
                                                      </div>
                                                      <div style={{ marginTop: '10px' }}>
                                                            <div style={{ marginBottom: '5px' }}>
                                                                  {translate('Autre_Superviseurs')}
                                                            </div>
                                                            <Row gutter={[10, 10]}>
                                                                  <Col md={19} sm={24}>
                                                                        <Input
                                                                              placeholder={translate(
                                                                                    'Autre_Superviseurs'
                                                                              )}
                                                                              value={inputEquipeAutreSuperviseur}
                                                                              style={{ width: '100%' }}
                                                                              onChange={event =>
                                                                                    setInputEquipeAutreSuperviseur(
                                                                                          event.target.value
                                                                                    )
                                                                              }
                                                                        />
                                                                  </Col>
                                                                  <Col flex="auto" style={{ textAlign: 'right' }}>
                                                                        <Button
                                                                              primary
                                                                              onClick={handleAddEquipeAutreSuperviseurs}
                                                                              disabled={
                                                                                    !inputEquipeAutreSuperviseur?.trim() ||
                                                                                    selectedEquipeAutreSuperviseurs
                                                                                          .map(e =>
                                                                                                e.displayName?.trim()
                                                                                          )
                                                                                          .includes(
                                                                                                inputEquipeAutreSuperviseur?.trim()
                                                                                          )
                                                                              }
                                                                        >
                                                                              + {translate('Ajouter')}{' '}
                                                                        </Button>
                                                                  </Col>
                                                            </Row>
                                                      </div>
                                                      {selectedEquipeAutreSuperviseurs.length > 0 && (
                                                            <div style={{ marginTop: '20px' }}>
                                                                  <table
                                                                        style={{
                                                                              width: '100%',
                                                                              borderCollapse: 'collapse'
                                                                        }}
                                                                  >
                                                                        {selectedEquipeAutreSuperviseurs.map(item => (
                                                                              <tr>
                                                                                    <td
                                                                                          style={{
                                                                                                padding: '5px',
                                                                                                border: '1px solid #ccc'
                                                                                          }}
                                                                                    >
                                                                                          <div>{item}</div>
                                                                                    </td>
                                                                                    <td
                                                                                          style={{
                                                                                                padding: '5px',
                                                                                                border: '1px solid #ccc',
                                                                                                width: '50px'
                                                                                          }}
                                                                                    >
                                                                                          <div>
                                                                                                <Popconfirm
                                                                                                      title={translate(
                                                                                                            'Suppression'
                                                                                                      )}
                                                                                                      description={translate(
                                                                                                            'Confirmation_Suppression_Superviseur'
                                                                                                      )}
                                                                                                      icon={
                                                                                                            <QuestionCircleOutlined
                                                                                                                  style={{
                                                                                                                        color: 'red'
                                                                                                                  }}
                                                                                                            />
                                                                                                      }
                                                                                                      onConfirm={() => {
                                                                                                            setInputEquipeAutreSuperviseur(
                                                                                                                  ''
                                                                                                            );
                                                                                                            setSelectedEquipeAutreSuperviseurs(
                                                                                                                  selectedEquipeAutreSuperviseurs.filter(
                                                                                                                        e =>
                                                                                                                              e !==
                                                                                                                              item
                                                                                                                  )
                                                                                                            );
                                                                                                      }}
                                                                                                >
                                                                                                      <RiDeleteBinLine
                                                                                                            style={{
                                                                                                                  color: 'red',
                                                                                                                  fontSize: '20px',
                                                                                                                  cursor: 'pointer'
                                                                                                            }}
                                                                                                      />
                                                                                                </Popconfirm>
                                                                                          </div>
                                                                                    </td>
                                                                              </tr>
                                                                        ))}
                                                                  </table>
                                                            </div>
                                                      )}
                                                </>
                                          )}
                                    </div>
                              </ModalContent>
                              <ModalActions>
                                    <ButtonStrip end>
                                          <Button
                                                destructive
                                                onClick={() => handleAddNewEquipeClose()}
                                                icon={<CgCloseO style={{ fontSize: '18px' }} />}
                                          >
                                                {translate('Annuler')}
                                          </Button>
                                          {visibleTeamLeadContent ? (
                                                <Button
                                                      primary
                                                      disabled={selectedTeamLead?.trim()?.length > 0 ? false : true}
                                                      onClick={() => handleAddNewEquipeSave()}
                                                      icon={<FiSave style={{ fontSize: '18px' }} />}
                                                >
                                                      {translate('Enregistrer')}
                                                </Button>
                                          ) : (
                                                <Button
                                                      primary
                                                      disabled={inputEquipeName?.trim()?.length > 0 ? false : true}
                                                      onClick={() => setVisibleTeamLeadContent(true)}
                                                      icon={<FiSave style={{ fontSize: '18px' }} />}
                                                >
                                                      {translate('Enregistrer')}
                                                </Button>
                                          )}
                                    </ButtonStrip>
                              </ModalActions>
                        </Modal>
                  </>
            );

      const handleCloseAddFavoritForPerformance = () => {
            setVisibleAddFavoritPerformanceModal(false);
      };

      const handleAddFavoritPerformanceSave = () => {
            try {
                  if (!inputFavorisName || inputFavorisName?.trim()?.length === 0)
                        throw new Error(translate('Nom_Obligatoire'));

                  if (
                        !selectedFavoritForPerformance &&
                        selectedSelectionTypeForPerformance === DIRECTE &&
                        favoritPerformanceList.map(f => f.name).includes(inputFavorisName)
                  )
                        throw new Error(translate('Favorit_Exist_Deja'));

                  let payload = {
                        name: inputFavorisName,
                        indicators: selectedIndicators,
                        createdAt: dayjs(),
                        updatedAt: dayjs()
                  };

                  let performanceList = [];

                  if (selectedSelectionTypeForPerformance === FAVORIS && selectedFavoritForPerformance) {
                        performanceList = favoritPerformanceList.map(ind => {
                              if (ind.id === selectedFavoritForPerformance?.id) {
                                    return {
                                          ...ind,
                                          ...payload,
                                          updatedAt: dayjs()
                                    };
                              }
                              return ind;
                        });
                  } else {
                        payload.id = uuid();
                        performanceList = [payload, ...favoritPerformanceList];
                  }

                  setFavoritPerformanceList(performanceList);
                  savePerformanceFavoritsToDataStore(performanceList);
                  setNotification({
                        show: true,
                        message: translate('Favorit_Enregistrer_Avec_Succes'),
                        type: NOTIFICATION_SUCCESS
                  });
                  setInputFavoritName('');
                  setVisibleAddFavoritPerformanceModal(false);
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
                  setVisibleAddFavoritPerformanceModal(false);
            }
      };

      const RenderAddFavoritPerformanceModal = () =>
            visibleAddFavoritPerformanceModal && (
                  <>
                        <Modal onClose={handleCloseAddFavoritForPerformance} dense small>
                              <ModalTitle>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                          {translate('Enregistrement_Favorit')}
                                    </div>
                              </ModalTitle>
                              <ModalContent>
                                    <div
                                          style={{
                                                marginTop: '10px',
                                                padding: '10px',
                                                border: '1px solid #ccc',
                                                background: '#CAF0F8',
                                                color: '#00000090',
                                                fontSize: '13px'
                                          }}
                                    >
                                          {translate('Nom_Claire_Favorit')}
                                    </div>
                                    <div
                                          style={{
                                                padding: '10px',
                                                border: '1px solid #ccc',
                                                borderRadius: '5px',
                                                marginTop: '10px'
                                          }}
                                    >
                                          <div>
                                                <div style={{ marginBottom: '5px' }}>{translate('Nom')}</div>
                                                <Input
                                                      placeholder={translate('Nom')}
                                                      style={{ width: '100%' }}
                                                      value={inputFavorisName}
                                                      onChange={event => setInputFavoritName(event.target.value)}
                                                />
                                          </div>
                                    </div>
                              </ModalContent>
                              <ModalActions>
                                    <ButtonStrip end>
                                          <Button
                                                destructive
                                                onClick={handleCloseAddFavoritForPerformance}
                                                icon={<CgCloseO style={{ fontSize: '18px' }} />}
                                                small
                                          >
                                                {translate('Annuler')}
                                          </Button>
                                          <Button
                                                small
                                                primary
                                                disabled={inputFavorisName?.trim()?.length > 0 ? false : true}
                                                onClick={handleAddFavoritPerformanceSave}
                                                icon={<FiSave style={{ fontSize: '18px' }} />}
                                          >
                                                {translate('Enregistrer')}
                                          </Button>
                                    </ButtonStrip>
                              </ModalActions>
                        </Modal>
                  </>
            );

      const handleAddNewEquipe = () => {
            setVisibleAddEquipeModal(true);
      };

      const RenderEquipePlanificationContent = () => (
            <div style={{ marginTop: '10px' }}>
                  <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size="small">
                        <div
                              style={{
                                    fontWeight: 'bold',
                                    padding: '10px',
                                    borderBottom: '1px solid #ccc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                              }}
                        >
                              {translate('Configuration_Equipes')}
                              <Button primary onClick={handleAddNewEquipe} small>
                                    + {translate('Ajouter')}
                              </Button>
                        </div>
                        <div style={{ padding: '10px' }}>
                              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                    <thead>
                                          <tr>
                                                <th style={{ padding: '5px', border: '1px solid #ccc' }}>
                                                      {translate('Nom')}
                                                </th>
                                                <th style={{ padding: '5px', border: '1px solid #ccc' }}>
                                                      {translate('Team_Lead')}
                                                </th>
                                                <th style={{ padding: '5px', border: '1px solid #ccc' }}>
                                                      {translate('Superviseurs')}
                                                </th>
                                                <th style={{ padding: '5px', border: '1px solid #ccc' }}>
                                                      {translate('Actions')}
                                                </th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {equipeList.length === 0 && (
                                                <tr style={{ color: '#00000080' }}>
                                                      <td
                                                            colSpan={3}
                                                            tyle={{ padding: '5px', border: '1px solid #ccc' }}
                                                      >
                                                            {translate('List_Vide')}
                                                      </td>
                                                </tr>
                                          )}

                                          {equipeList.map((eq, index) => (
                                                <tr key={index}>
                                                      <td
                                                            style={{
                                                                  padding: '5px',
                                                                  border: '1px solid #ccc',
                                                                  width: '100px'
                                                            }}
                                                      >
                                                            {' '}
                                                            {eq.name}
                                                      </td>
                                                      <td
                                                            style={{
                                                                  padding: '5px',
                                                                  border: '1px solid #ccc',
                                                                  width: '100px'
                                                            }}
                                                      >
                                                            <span
                                                                  style={{
                                                                        background: '#0a939640',
                                                                        padding: '5px',
                                                                        borderRadius: '8px',
                                                                        fontSize: '12px',
                                                                        marginRight: '2px',
                                                                        marginTop: '2px'
                                                                  }}
                                                            >
                                                                  {eq.teamLead}
                                                            </span>
                                                      </td>
                                                      <td style={{ padding: '5px', border: '1px solid #ccc' }}>
                                                            <div
                                                                  style={{
                                                                        display: 'flex',
                                                                        flexWrap: 'wrap',
                                                                        alignItems: 'center'
                                                                  }}
                                                            >
                                                                  {[...eq.superviseurs, ...eq.autreSuperviseurs].map(
                                                                        e =>
                                                                              e.displayName ? (
                                                                                    <span
                                                                                          key={e.displayName}
                                                                                          style={{
                                                                                                background: '#0a939640',
                                                                                                padding: '5px',
                                                                                                borderRadius: '8px',
                                                                                                fontSize: '12px',
                                                                                                marginRight: '2px',
                                                                                                marginTop: '2px'
                                                                                          }}
                                                                                    >
                                                                                          {e.displayName}
                                                                                    </span>
                                                                              ) : (
                                                                                    <span
                                                                                          key={e}
                                                                                          style={{
                                                                                                background: '#0a939640',
                                                                                                padding: '5px',
                                                                                                borderRadius: '8px',
                                                                                                fontSize: '12px',
                                                                                                marginRight: '2px',
                                                                                                marginTop: '2px'
                                                                                          }}
                                                                                    >
                                                                                          {e}
                                                                                    </span>
                                                                              )
                                                                  )}
                                                            </div>
                                                      </td>
                                                      <td
                                                            style={{
                                                                  padding: '5px',
                                                                  border: '1px solid #ccc',
                                                                  textAlign: 'center'
                                                            }}
                                                      >
                                                            <Popconfirm
                                                                  title={translate('Suppression')}
                                                                  description={translate(
                                                                        'Confirmation_De_Suppression_De_Equipe'
                                                                  )}
                                                                  icon={
                                                                        <QuestionCircleOutlined
                                                                              style={{ color: 'red' }}
                                                                        />
                                                                  }
                                                                  onConfirm={() => handleDelelteEquipe(eq.name)}
                                                            >
                                                                  <RiDeleteBinLine
                                                                        style={{
                                                                              color: 'red',
                                                                              fontSize: '20px',
                                                                              cursor: 'pointer'
                                                                        }}
                                                                  />
                                                            </Popconfirm>
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                  </Card>
            </div>
      );

      const RenderSupervisionPlanificationOrganisationUnitContent = () => (
            <div style={{ marginTop: '10px' }}>
                  <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size="small">
                        <div
                              style={{
                                    fontWeight: 'bold',
                                    padding: '10px',
                                    borderBottom: '1px solid #ccc'
                              }}
                        >
                              {translate('Planification_Sur_Org_Units')}{' '}
                        </div>
                        <div style={{ padding: '10px' }}>
                              <div>
                                    <div style={{ marginBottom: '5px' }}>{translate('Unites_Organisation')}</div>
                                    <OrganisationUnitsTree
                                          meOrgUnitId={me?.organisationUnits[0]?.id}
                                          orgUnits={organisationUnits}
                                          currentOrgUnits={selectedOrganisationUnits}
                                          setCurrentOrgUnits={setSelectedOrganisationUnits}
                                          loadingOrganisationUnits={loadingOrganisationUnits}
                                          multiple={true}
                                    />
                              </div>
                        </div>
                  </Card>
            </div>
      );

      const handleChangeSelectionTypeForPerformance = ({ value }) => {
            setSelectedIndicators([]);
            setSelectedElementForPerformances([]);
            setSelectedFavoritForPerformance(null);
            setSelectedSelectionTypeForPerformance(value);
      };

      const handleSaveAsFavorites = () => {
            setVisibleAddFavoritPerformanceModal(true);
      };

      const handleSelectFavoritForPerformance = value => {
            const currentFavorit = favoritPerformanceList.find(f => f.id === value);
            setSelectedFavoritForPerformance(currentFavorit);
            setInputFavoritName(currentFavorit.name);
            setSelectedElementForPerformances(currentFavorit?.indicators?.map(i => i.indicator));
            setSelectedIndicators(currentFavorit?.indicators || []);
      };

      const handleChangePoidsForFieldsPerformances = (event, index) => {
            setSelectedIndicators(
                  selectedIndicators.map((ind, indexInd) => {
                        if (indexInd === index) {
                              return {
                                    ...ind,
                                    weight: event
                              };
                        }
                        return ind;
                  })
            );
      };

      const RenderSupervisionPlanificationIndicatorContent = () => (
            <>
                  <div style={{ marginTop: '10px' }}>
                        <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size="small">
                              <div
                                    style={{
                                          fontWeight: 'bold',
                                          padding: '10px',
                                          borderBottom: '1px solid #ccc'
                                    }}
                              >
                                    {translate('Planification_Sur_Performances')}
                              </div>
                              <div style={{ padding: '10px' }}>
                                    <div>{translate('Selectionnez_Indicateurs_De_Performance')}</div>

                                    <div style={{ marginTop: '10px' }}>
                                          <div>
                                                <Radio
                                                      label={translate('Venant_Des_Favoris')}
                                                      className="cursor-pointer"
                                                      onChange={handleChangeSelectionTypeForPerformance}
                                                      value={FAVORIS}
                                                      checked={selectedSelectionTypeForPerformance === FAVORIS}
                                                />
                                          </div>
                                          <div>
                                                <Radio
                                                      label={translate('Directe') + ' ? '}
                                                      className="cursor-pointer"
                                                      onChange={handleChangeSelectionTypeForPerformance}
                                                      value={DIRECTE}
                                                      checked={selectedSelectionTypeForPerformance === DIRECTE}
                                                />
                                          </div>
                                    </div>
                                    <div>
                                          <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                    </div>

                                    {selectedSelectionTypeForPerformance === FAVORIS && (
                                          <>
                                                <div>
                                                      <div style={{ marginBottom: '5px' }}>
                                                            {translate('Selectionnez_La_Favorit')}
                                                      </div>
                                                      <Select
                                                            options={favoritPerformanceList.map(fav => ({
                                                                  label: fav.name,
                                                                  value: fav.id
                                                            }))}
                                                            showSearch
                                                            loading={loadingPerformanceFavoritsConfigs}
                                                            disabled={loadingPerformanceFavoritsConfigs}
                                                            placeholder={translate('Selectionnez_La_Favorit')}
                                                            style={{ width: '100%' }}
                                                            optionFilterProp="label"
                                                            onChange={handleSelectFavoritForPerformance}
                                                            value={selectedFavoritForPerformance?.id}
                                                            allowClear
                                                      />
                                                </div>
                                          </>
                                    )}

                                    {selectedSelectionTypeForPerformance === DIRECTE ? (
                                          <div
                                                style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'space-between',
                                                      marginTop: '10px'
                                                }}
                                          >
                                                <div>
                                                      <Button
                                                            small
                                                            primary
                                                            icon={
                                                                  <TbSelect
                                                                        style={{ fontSize: '18px', color: '#fff' }}
                                                                  />
                                                            }
                                                            onClick={() =>
                                                                  setVisibleAnalyticComponentPerformanceModal(true)
                                                            }
                                                      >
                                                            {translate('Selectionnez_Les_Indicateurs')}
                                                      </Button>
                                                </div>

                                                {selectedIndicators.length > 0 && (
                                                      <div style={{ marginLeft: '10px' }}>
                                                            <Popover
                                                                  trigger="hover"
                                                                  content={
                                                                        <>{translate('Enregistrer_Comme_Favorites')}</>
                                                                  }
                                                            >
                                                                  <Button
                                                                        disabled={
                                                                              selectedIndicators.length > 0
                                                                                    ? false
                                                                                    : true
                                                                        }
                                                                        small
                                                                        onClick={handleSaveAsFavorites}
                                                                        icon={
                                                                              <MdStars
                                                                                    style={{
                                                                                          color: 'red',
                                                                                          fontSize: '20px',
                                                                                          cursor: 'pointer'
                                                                                    }}
                                                                              />
                                                                        }
                                                                  >
                                                                        {translate('Enregistrer_Comme_Favorites')}
                                                                  </Button>
                                                            </Popover>
                                                      </div>
                                                )}
                                          </div>
                                    ) : (
                                          selectedIndicators.length > 0 && (
                                                <div
                                                      style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            marginTop: '10px'
                                                      }}
                                                >
                                                      <div>
                                                            <Button
                                                                  small
                                                                  primary
                                                                  icon={
                                                                        <TbSelect
                                                                              style={{
                                                                                    fontSize: '18px',
                                                                                    color: '#fff'
                                                                              }}
                                                                        />
                                                                  }
                                                                  onClick={() =>
                                                                        setVisibleAnalyticComponentPerformanceModal(
                                                                              true
                                                                        )
                                                                  }
                                                            >
                                                                  {translate('Selectionnez_Les_Indicateurs')}
                                                            </Button>
                                                      </div>

                                                      <div style={{ marginLeft: '10px' }}>
                                                            <Popover
                                                                  trigger="hover"
                                                                  content={
                                                                        <>{translate('Enregistrer_Comme_Favorites')}</>
                                                                  }
                                                            >
                                                                  <Button
                                                                        disabled={
                                                                              selectedIndicators.length > 0
                                                                                    ? false
                                                                                    : true
                                                                        }
                                                                        small
                                                                        onClick={handleSaveAsFavorites}
                                                                        icon={
                                                                              <MdStars
                                                                                    style={{
                                                                                          color: 'red',
                                                                                          fontSize: '20px',
                                                                                          cursor: 'pointer'
                                                                                    }}
                                                                              />
                                                                        }
                                                                  >
                                                                        {translate('Mise_A_Jour')}
                                                                  </Button>
                                                            </Popover>
                                                      </div>
                                                </div>
                                          )
                                    )}

                                    {selectedIndicators.length > 0 && (
                                          <>
                                                <div style={{ marginTop: '10px' }}>
                                                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                            <tr>
                                                                  <th
                                                                        style={{
                                                                              padding: '5px',
                                                                              border: '1px solid #ccc',
                                                                              fontSize: '14px'
                                                                        }}
                                                                  >
                                                                        {' '}
                                                                        {translate('Nom')}
                                                                  </th>
                                                                  <th
                                                                        style={{
                                                                              padding: '5px',
                                                                              border: '1px solid #ccc',
                                                                              fontSize: '14px'
                                                                        }}
                                                                  >
                                                                        {' '}
                                                                        {translate('Poids')}
                                                                  </th>
                                                                  <th
                                                                        style={{
                                                                              padding: '5px',
                                                                              border: '1px solid #ccc',
                                                                              fontSize: '14px'
                                                                        }}
                                                                  >
                                                                        {' '}
                                                                        {translate('Actions')}
                                                                  </th>
                                                            </tr>
                                                            {selectedIndicators.map((ind, index) => (
                                                                  <tr key={index}>
                                                                        <td
                                                                              style={{
                                                                                    padding: '5px',
                                                                                    border: '1px solid #ccc',
                                                                                    fontSize: '14px'
                                                                              }}
                                                                        >
                                                                              <div>{ind.name}</div>
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    padding: '5px',
                                                                                    border: '1px solid #ccc',
                                                                                    fontSize: '14px',
                                                                                    width: '30%'
                                                                              }}
                                                                        >
                                                                              <div>
                                                                                    <InputNumber
                                                                                          value={ind.weight}
                                                                                          onChange={event =>
                                                                                                handleChangePoidsForFieldsPerformances(
                                                                                                      event,
                                                                                                      index
                                                                                                )
                                                                                          }
                                                                                          style={{ width: '100%' }}
                                                                                          placeholder={translate(
                                                                                                'Poids'
                                                                                          )}
                                                                                    />
                                                                              </div>
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    padding: '5px',
                                                                                    border: '1px solid #ccc',
                                                                                    width: '10%',
                                                                                    textAlign: 'center'
                                                                              }}
                                                                        >
                                                                              <div>
                                                                                    <Popconfirm
                                                                                          title={translate(
                                                                                                'Suppression'
                                                                                          )}
                                                                                          description={translate(
                                                                                                'Confirmation_Suppression_Indicateur'
                                                                                          )}
                                                                                          icon={
                                                                                                <QuestionCircleOutlined
                                                                                                      style={{
                                                                                                            color: 'red'
                                                                                                      }}
                                                                                                />
                                                                                          }
                                                                                          onConfirm={() => {
                                                                                                const newArray =
                                                                                                      selectedIndicators.filter(
                                                                                                            e =>
                                                                                                                  e.id !==
                                                                                                                  ind.id
                                                                                                      );
                                                                                                setSelectedIndicators(
                                                                                                      newArray
                                                                                                );
                                                                                                setSelectedElementForPerformances(
                                                                                                      selectedElementForPerformances.filter(
                                                                                                            el =>
                                                                                                                  el.id !==
                                                                                                                  ind
                                                                                                                        .indicator
                                                                                                                        ?.id
                                                                                                      )
                                                                                                );
                                                                                          }}
                                                                                    >
                                                                                          <RiDeleteBinLine
                                                                                                style={{
                                                                                                      color: 'red',
                                                                                                      fontSize: '20px',
                                                                                                      cursor: 'pointer'
                                                                                                }}
                                                                                          />
                                                                                    </Popconfirm>
                                                                              </div>
                                                                        </td>
                                                                  </tr>
                                                            ))}
                                                      </table>
                                                </div>
                                          </>
                                    )}
                              </div>
                        </Card>
                  </div>
            </>
      );

      const handleInputPeriod = (period, index) => {
            setInputFields(
                  inputFields.map((field, fieldIndex) => {
                        if (index === fieldIndex) {
                              return {
                                    ...field,
                                    period
                              };
                        }
                        return field;
                  })
            );
      };

      const handleInputPeriodVerification = (period, index) => {
            setInputFields(
                  inputFields.map((field, fieldIndex) => {
                        if (index === fieldIndex) {
                              return {
                                    ...field,
                                    periodVerification: period
                              };
                        }
                        return field;
                  })
            );
      };

      const handleInputOtherSupervisor = (event, index) => {
            setInputFields(
                  inputFields.map((field, fieldIndex) => {
                        if (index === fieldIndex) {
                              return {
                                    ...field,
                                    inputOtherSupervisor: ''.concat(event.target.value)
                              };
                        }
                        return field;
                  })
            );
      };

      const handleInputAddOtherSupervisors = index => {
            setInputFields(
                  inputFields.map((field, fieldIndex) => {
                        if (index === fieldIndex) {
                              if (field.inputOtherSupervisor?.trim()) {
                                    if (
                                          !field.inputOtherSupervisor?.includes(
                                                inputOther =>
                                                      inputOther?.trim()?.toLocaleLowerCase() !==
                                                      field.inputOtherSupervisor?.trim()?.toLocaleLowerCase()
                                          )
                                    ) {
                                          return {
                                                ...field,
                                                inputOtherSupervisor: '',
                                                otherSupervisors: [
                                                      ...field.otherSupervisors,
                                                      field.inputOtherSupervisor?.trim()
                                                ]
                                          };
                                    }
                              }
                        }
                        return field;
                  })
            );
      };

      const handleInputSupervisors = (values, index) => {
            setInputFields(
                  inputFields.map((field, fieldIndex) => {
                        if (index === fieldIndex) {
                              const supervisorsList = values.map(val => users.find(user => user.id === val));
                              return {
                                    ...field,
                                    supervisors: supervisorsList.map(sup => ({
                                          id: sup.id,
                                          displayName: sup.displayName
                                    }))
                              };
                        }
                        return field;
                  })
            );
      };

      const handleInputEquipe = (value, index) => {
            try {
                  setInputFields(
                        inputFields.map((field, fieldIndex) => {
                              if (index === fieldIndex) {
                                    const equipe = equipeList.find(eq => eq.name === value);
                                    const superviseurs = equipe?.superviseurs || [];
                                    const autreSuperviseurs = equipe?.autreSuperviseurs || [];

                                    return {
                                          ...field,
                                          equipe: equipe,
                                          supervisors: superviseurs,
                                          otherSupervisors: autreSuperviseurs
                                    };
                              }
                              return field;
                        })
                  );
            } catch (err) {}
      };

      const handleCloseOrgUnitForm = (org, index) => {
            setSelectedOrganisationUnits(selectedOrganisationUnits.filter(ou => ou.id !== org.id));
            setInputFields(inputFields.filter(o => o.organisationUnit?.id !== org.id));
      };

      const RenderOrganisationUnitForm = (colMd = 12) => (
            <div>
                  <Row gutter={[10, 10]}>
                        {selectedOrganisationUnits.map((org, index) => (
                              <Col md={colMd} sm={24} key={index}>
                                    <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size="small">
                                          <div
                                                style={{
                                                      background: '#0A9396',
                                                      color: '#FFF',
                                                      fontWeight: 'bold',
                                                      padding: '10px',
                                                      position: 'relative'
                                                }}
                                          >
                                                <span>{translate('Formulaire_De_Planification')}</span>
                                                {org && (
                                                      <span
                                                            style={{
                                                                  marginLeft: '20px',
                                                                  background: '#fff',
                                                                  color: '#0A9396',
                                                                  fontWeight: 'bold',
                                                                  padding: '5px',
                                                                  borderRadius: '10px'
                                                            }}
                                                      >
                                                            {org?.displayName}
                                                      </span>
                                                )}

                                                <span className="delete-sup">
                                                      <Popconfirm
                                                            title={translate('Suppression')}
                                                            description={translate(
                                                                  'Confirmation_Suppression_Du_Formulaire'
                                                            )}
                                                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                            onConfirm={() => handleCloseOrgUnitForm(org, index)}
                                                      >
                                                            <span style={{ padding: '5px' }}>X</span>
                                                      </Popconfirm>
                                                </span>
                                          </div>
                                          <div style={{ padding: '10px' }}>
                                                <Row gutter={[10, 10]}>
                                                      <Col sm={24} md={24}>
                                                            <div>
                                                                  <div style={{ marginBottom: '5px' }}>
                                                                        {
                                                                              <span>
                                                                                    {translate('Periode')} (
                                                                                    <span style={{ color: RED }}>
                                                                                          {' '}
                                                                                          *{' '}
                                                                                    </span>
                                                                                    )
                                                                              </span>
                                                                        }
                                                                  </div>
                                                                  <DatePicker
                                                                        disabledDate={disabledDate}
                                                                        style={{ width: '100%' }}
                                                                        placeholder={translate('Periode')}
                                                                        value={inputFields[index]?.period}
                                                                        onChange={period =>
                                                                              handleInputPeriod(period, index)
                                                                        }
                                                                  />
                                                            </div>
                                                      </Col>{' '}
                                                      <Col sm={24} md={24}>
                                                            <div>
                                                                  <div
                                                                        style={{
                                                                              marginBottom: '5px',
                                                                              display: 'flex',
                                                                              alignItems: 'center',
                                                                              gap: '5px'
                                                                        }}
                                                                  >
                                                                        {
                                                                              <span>
                                                                                    {translate(
                                                                                          'Recent_Verification_Period'
                                                                                    )}{' '}
                                                                                    (
                                                                                    <span style={{ color: RED }}>
                                                                                          {' '}
                                                                                          *{' '}
                                                                                    </span>
                                                                                    )
                                                                              </span>
                                                                        }

                                                                        <Popover
                                                                              content={
                                                                                    <div
                                                                                          style={{
                                                                                                maxWidth: '300px',
                                                                                                border: '1px solid blue',
                                                                                                padding: '10px',
                                                                                                borderRadius: '10px'
                                                                                          }}
                                                                                    >
                                                                                          {translate(
                                                                                                'Recent_Verification_Period_Help'
                                                                                          )}
                                                                                    </div>
                                                                              }
                                                                        >
                                                                              <span style={{ cursor: 'pointer' }}>
                                                                                    <FcInfo
                                                                                          style={{
                                                                                                fontSize: '18px'
                                                                                          }}
                                                                                    />
                                                                              </span>
                                                                        </Popover>
                                                                  </div>
                                                                  <DatePicker
                                                                        style={{ width: '100%' }}
                                                                        placeholder={translate(
                                                                              'Recent_Verification_Period'
                                                                        )}
                                                                        value={inputFields[index]?.periodVerification}
                                                                        onChange={period =>
                                                                              handleInputPeriodVerification(
                                                                                    period,
                                                                                    index
                                                                              )
                                                                        }
                                                                  />
                                                            </div>
                                                      </Col>
                                                      <Col sm={24} md={24}>
                                                            <div>
                                                                  <div style={{ marginBottom: '5px' }}>
                                                                        {translate('Equipes')}
                                                                  </div>
                                                                  <Select
                                                                        placeholder={translate('Equipes')}
                                                                        style={{ width: '100%' }}
                                                                        value={inputFields[index]?.equipe?.name}
                                                                        onChange={value =>
                                                                              handleInputEquipe(value, index)
                                                                        }
                                                                        optionFilterProp="label"
                                                                        showSearch
                                                                        options={equipeList.map(eq => ({
                                                                              label: eq.name,
                                                                              value: eq.name
                                                                        }))}
                                                                        allowClear
                                                                  />
                                                            </div>
                                                      </Col>
                                                      <Col sm={24} md={24}>
                                                            <div>
                                                                  <div style={{ marginBottom: '5px' }}>
                                                                        {
                                                                              <span>
                                                                                    {translate('Superviseurs')} (
                                                                                    <span style={{ color: RED }}>
                                                                                          {' '}
                                                                                          *{' '}
                                                                                    </span>
                                                                                    )
                                                                              </span>
                                                                        }
                                                                  </div>
                                                                  <Select
                                                                        placeholder={translate('Superviseurs')}
                                                                        style={{ width: '100%' }}
                                                                        loading={loadingUsers}
                                                                        disabled={loadingUsers}
                                                                        value={inputFields[index]?.supervisors?.map(
                                                                              sup => sup.id
                                                                        )}
                                                                        onChange={values =>
                                                                              handleInputSupervisors(values, index)
                                                                        }
                                                                        mode="multiple"
                                                                        optionFilterProp="label"
                                                                        showSearch
                                                                        options={users.map(user => ({
                                                                              label: user.displayName,
                                                                              value: user.id
                                                                        }))}
                                                                        allowClear
                                                                  />
                                                            </div>
                                                      </Col>
                                                      <Col md={24}>
                                                            <div>
                                                                  <div style={{ marginBottom: '5px' }}>
                                                                        {translate('Autre_Superviseurs')}
                                                                  </div>
                                                                  <Row gutter={[10, 10]}>
                                                                        <Col md={19} sm={24}>
                                                                              <Input
                                                                                    placeholder={translate(
                                                                                          'Autre_Superviseurs'
                                                                                    )}
                                                                                    value={
                                                                                          inputFields[index]
                                                                                                ?.inputOtherSupervisor
                                                                                    }
                                                                                    onChange={event =>
                                                                                          handleInputOtherSupervisor(
                                                                                                event,
                                                                                                index
                                                                                          )
                                                                                    }
                                                                              />
                                                                        </Col>
                                                                        <Col flex="auto" style={{ textAlign: 'right' }}>
                                                                              <Button
                                                                                    primary
                                                                                    onClick={() =>
                                                                                          handleInputAddOtherSupervisors(
                                                                                                index
                                                                                          )
                                                                                    }
                                                                              >
                                                                                    + {translate('Ajouter')}{' '}
                                                                              </Button>
                                                                        </Col>
                                                                  </Row>
                                                            </div>
                                                      </Col>
                                                      {inputFields[index]?.otherSupervisors?.length > 0 && (
                                                            <Col md={24}>
                                                                  <div style={{ marginTop: '10px' }}>
                                                                        <List
                                                                              size="small"
                                                                              bordered
                                                                              dataSource={
                                                                                    inputFields[index]?.otherSupervisors
                                                                              }
                                                                              renderItem={item => (
                                                                                    <List.Item
                                                                                          style={{
                                                                                                padding: '2px 10px'
                                                                                          }}
                                                                                    >
                                                                                          <div
                                                                                                style={{
                                                                                                      display: 'flex',
                                                                                                      justifyContent:
                                                                                                            'space-between',
                                                                                                      width: '100%'
                                                                                                }}
                                                                                          >
                                                                                                <div>{item}</div>
                                                                                                <div>
                                                                                                      <Popconfirm
                                                                                                            title={translate(
                                                                                                                  'Suppression'
                                                                                                            )}
                                                                                                            description={translate(
                                                                                                                  'Confirmation_Suppression_Superviseur'
                                                                                                            )}
                                                                                                            icon={
                                                                                                                  <QuestionCircleOutlined
                                                                                                                        style={{
                                                                                                                              color: 'red'
                                                                                                                        }}
                                                                                                                  />
                                                                                                            }
                                                                                                            onConfirm={() =>
                                                                                                                  handleDeleteOtherSupervisor(
                                                                                                                        item,
                                                                                                                        index
                                                                                                                  )
                                                                                                            }
                                                                                                      >
                                                                                                            <RiDeleteBinLine
                                                                                                                  style={{
                                                                                                                        color: 'red',
                                                                                                                        fontSize: '20px',
                                                                                                                        cursor: 'pointer'
                                                                                                                  }}
                                                                                                            />
                                                                                                      </Popconfirm>
                                                                                                </div>
                                                                                          </div>
                                                                                    </List.Item>
                                                                              )}
                                                                        />
                                                                  </div>
                                                            </Col>
                                                      )}
                                                </Row>
                                          </div>
                                    </Card>
                              </Col>
                        ))}
                  </Row>
            </div>
      );

      const handleSelectOrganisationUnitGroupSet = value => {
            setSelectedOrganisationUnitGroup(null);
            setSelectedPeriodType(null);
            setSelectedPeriod(null);

            setSelectedOrganisationUnitGroupSet(organisationUnitGroupSets.find(org => org.id === value));
      };

      const handleSelectPeriodType = value => {
            setSelectedPeriod(null);
            setSelectedPeriodType(value);
      };

      const handleSelectPeriode = value => setSelectedPeriod(value);

      const handleSelectOrganisationUnitGroup = value => {
            setSelectedPeriodType(null);
            setSelectedPeriod(null);
            setSelectedOrganisationUnitGroup(
                  selectedOrganisationUnitGroupSet.organisationUnitGroups?.find(org => org.id === value)
            );
      };

      const handleSelectOrganisationUnitGroupForRandomCase = values => {
            setSelectedOrganisationUnitGroups(
                  values.map(value => organisationUnitGroups?.find(org => org.id === value))
            );
      };

      const formatPeriod = (period, periodType) => {
            let currentPeriod = dayjs(period).format('YYYY');

            if (periodType === MONTH) currentPeriod = dayjs(period).format('YYYYMM');

            if (periodType === DAY) currentPeriod = dayjs(period).format('YYYYMMDD');

            if (periodType === YEAR) currentPeriod = dayjs(period).format('YYYY');

            if (periodType === QUARTER) currentPeriod = `${dayjs(period).format('YYYY')}Q${dayjs(period).quarter()}`;

            if (periodType === WEEK) currentPeriod = `${dayjs(period).format('YYYY')}W${dayjs(period).week()}`;

            return currentPeriod;
      };

      const getRightPeriodFormat = (index, periodType, period) => {
            let result = {
                  normal: dayjs(period).subtract(+index, 'month').format('YYYY/MM'),
                  analytic: dayjs(period).subtract(+index, 'month').format('YYYYMM')
            };

            if (periodType === 'Monthly') {
                  result = result;
            }

            if (periodType === 'Daily') {
                  result = {
                        normal: dayjs(period).subtract(+index, 'day').format('YYYY/MM/DD'),
                        analytic: dayjs(period).subtract(+index, 'day').format('YYYYMMDD')
                  };
            }

            if (periodType === 'Yearly') {
                  result = {
                        normal: dayjs(period).subtract(+index, 'year').format('YYYY'),
                        analytic: dayjs(period).subtract(+index, 'year').format('YYYY')
                  };
            }

            if (periodType === 'Quarterly') {
                  const quarterPeriod = dayjs(period).subtract(+index, 'quarter');

                  result = {
                        normal: `${dayjs(quarterPeriod).format('YYYY')}-Q${dayjs(quarterPeriod).quarter()}`,
                        analytic: `${dayjs(quarterPeriod).format('YYYY')}Q${dayjs(quarterPeriod).quarter()}`
                  };
            }

            if (periodType === 'Weekly') {
                  const weeklyPeriod = dayjs(period).subtract(+index, 'week');

                  result = {
                        normal: `${dayjs(weeklyPeriod).format('YYYY')}-W${dayjs(weeklyPeriod).week()}`,
                        analytic: `${dayjs(weeklyPeriod).format('YYYY')}W${dayjs(weeklyPeriod).week()}`
                  };
            }

            return result;
      };

      const handleDisplayIndicatorResult = async () => {
            try {
                  setLoadingAnalyticIndicatorResults(true);
                  setAnalyticErrorMessage(null);

                  if (!selectedOrganisationUnitSingle) throw new Error(translate('Unite_Organisation_Obligatoire'));

                  if (!selectedIndicators || selectedIndicators.length === 0)
                        throw new Error(translate('Veuillez_Selectionner_Les_Indicateurs'));

                  if (!selectedOrganisationUnitGroupSet) throw new Error(translate('OrgUnitGroupSet_Obligatoire'));

                  if (!selectedOrganisationUnitGroup) throw new Error(translate('OrgUnitGroup_Obligatoire'));

                  if (!selectedPeriod) throw new Error(translate('Veuillez_Selectionner_Periode'));

                  const route = `${ANALYTICS_ROUTE}.json?dimension=dx:${selectedIndicators
                        .map(ind => ind.indicator?.id)
                        .join(';')},ou:${selectedOrganisationUnitSingle?.id};OU_GROUP-${
                        selectedOrganisationUnitGroup?.id
                  }&filter=pe:${formatPeriod(
                        selectedPeriod,
                        selectedPeriodType
                  )}&showHierarchy=false&hierarchyMeta=false&includeMetadataDetails=false&includeNumDen=false&skipRounding=false&completedOnly=false&outputIdScheme=UID`;
                  const response = await axios.get(route);

                  const analyticResult = response.data.rows || [];

                  const ouPayload = analyticResult.reduce((prev, cur) => {
                        const currentElement = cur[0];
                        const currentOrgUnit = cur[1];
                        const currentValue = cur[2];
                        const currentIndicator = selectedIndicators.find(i => i.indicator?.id === currentElement);
                        const score =
                              parseFloat(currentIndicator?.weight) > 0
                                    ? parseFloat(currentIndicator?.weight) * parseFloat(currentValue)
                                    : parseFloat(currentValue);

                        if (prev[currentOrgUnit]) {
                              prev[currentOrgUnit][currentElement] = {
                                    id: currentElement,
                                    score: parseFloat(score).toFixed(1)
                              };
                              prev[currentOrgUnit] = {
                                    ...prev[currentOrgUnit],
                                    scoreTotal: parseFloat(
                                          parseFloat(prev[currentOrgUnit].scoreTotal) + parseFloat(score)
                                    ).toFixed(1)
                              };
                        } else {
                              prev[currentOrgUnit] = {
                                    orgUnit: organisationUnits.find(ou => ou.id === currentOrgUnit),
                                    period: dayjs(selectedPeriod).format('DD-MM-YYYY'),
                                    scoreTotal: parseFloat(score).toFixed(1)
                              };
                              prev[currentOrgUnit][currentElement] = {
                                    id: currentElement,
                                    score: parseFloat(score).toFixed(1)
                              };
                        }

                        return prev;
                  }, {});

                  setAnalyticIndicatorResults(Object.values(ouPayload));
                  if (analyticResult.length === 0) {
                        setAnalyticErrorMessage(translate('Aucun_Donne_Trouver_Pour_Cette_Selection'));
                  }

                  setLoadingAnalyticIndicatorResults(false);
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
                  setLoadingAnalyticIndicatorResults(false);
                  setAnalyticErrorMessage(null);
            }
      };

      const handleDisplayIndicatorResultForRandomCase = async () => {
            try {
                  setLoadingAnalyticIndicatorResults(true);
                  setAnalyticErrorMessage(null);

                  if (!selectedOrganisationUnitSingle) throw new Error(translate('Unite_Organisation_Obligatoire'));

                  if (selectedOrganisationUnitGroups.length === 0)
                        throw new Error(translate('OrgUnitGroup_Obligatoire'));

                  const route = `${ORGANISATION_UNITS_ROUTE}&filter=path:like:${
                        selectedOrganisationUnitSingle.id
                  }&filter=organisationUnitGroups.id:in:[${selectedOrganisationUnitGroups.map(ou => ou.id).join(',')}]`;
                  const response = await axios.get(route);
                  const orgUnits = response.data.organisationUnits;

                  setRandomResults(shuffle(orgUnits));
                  setLoadingAnalyticIndicatorResults(false);
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
                  setLoadingAnalyticIndicatorResults(false);
                  setAnalyticErrorMessage(null);
            }
      };

      const RenderIndicatorForm = () => (
            <div>
                  <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size="small">
                        <div
                              style={{
                                    background: '#0A9396',
                                    color: '#FFF',
                                    fontWeight: 'bold',
                                    padding: '10px'
                              }}
                        >
                              <span>{translate('Criteres_De_Recherches')}</span>
                        </div>
                        <div style={{ marginTop: '5px', padding: '10px' }}>
                              <Row gutter={[10, 10]}>
                                    <Col sm={24} md={6}>
                                          <div>
                                                <div style={{ marginBottom: '5px' }}>
                                                      {translate('Unites_Organisation')}
                                                </div>
                                                <OrganisationUnitsTree
                                                      meOrgUnitId={me?.organisationUnits[0]?.id}
                                                      orgUnits={organisationUnits}
                                                      currentOrgUnits={selectedOrganisationUnitSingle}
                                                      setCurrentOrgUnits={setSelectedOrganisationUnitSingle}
                                                      loadingOrganisationUnits={loadingOrganisationUnits}
                                                />
                                          </div>
                                    </Col>
                                    <Col sm={24} md={6}>
                                          <div style={{ marginBottom: '5px' }}>{translate('Meilleur')}</div>
                                          <InputNumber
                                                style={{ width: '100%' }}
                                                placeholder={translate('Meilleur')}
                                                value={inputMeilleur}
                                                onChange={value => setInputMeilleur(value || 0)}
                                          />
                                    </Col>
                                    <Col sm={24} md={6}>
                                          <div style={{ marginBottom: '5px' }}>{translate('Mauvais')}</div>
                                          <InputNumber
                                                onChange={value => setInputMauvais(value || 0)}
                                                value={inputMauvais}
                                                style={{ width: '100%' }}
                                                placeholder={translate('Mauvais')}
                                          />
                                    </Col>
                                    <Col sm={24} md={6}>
                                          <div style={{ display: 'flex', marginTop: '30px' }}>
                                                <Checkbox
                                                      checked={inputMeilleurPositif}
                                                      onChange={() => setInputMeilleurPositif(!inputMeilleurPositif)}
                                                />
                                                <span
                                                      style={{ marginLeft: '5px', cursor: 'pointer' }}
                                                      onClick={() => setInputMeilleurPositif(!inputMeilleurPositif)}
                                                >
                                                      {translate('Meilleur_Positif')}
                                                </span>
                                          </div>
                                    </Col>
                                    <Col sm={24} md={6}>
                                          <div style={{ marginBottom: '5px' }}>{translate('OrgUnitGroupSet')}</div>
                                          <Select
                                                style={{ width: '100%' }}
                                                options={organisationUnitGroupSets.map(org => ({
                                                      label: org.displayName,
                                                      value: org.id
                                                }))}
                                                value={selectedOrganisationUnitGroupSet?.id}
                                                disabled={loadingOrganisationUnitGroupSets}
                                                loading={loadingOrganisationUnitGroupSets}
                                                placeholder={translate('OrgUnitGroups')}
                                                onChange={handleSelectOrganisationUnitGroupSet}
                                                optionFilterProp="label"
                                                showSearch
                                          />
                                    </Col>
                                    {selectedOrganisationUnitGroupSet && (
                                          <Col sm={24} md={6}>
                                                <div style={{ marginTop: '20px' }}>
                                                      <div style={{ marginBottom: '5px' }}>
                                                            {translate('OrgUnitGroups')}
                                                      </div>
                                                      <Select
                                                            style={{ width: '100%' }}
                                                            options={selectedOrganisationUnitGroupSet?.organisationUnitGroups?.map(
                                                                  org => ({ value: org.id, label: org.displayName })
                                                            )}
                                                            value={selectedOrganisationUnitGroup?.id}
                                                            onChange={handleSelectOrganisationUnitGroup}
                                                            placeholder={translate('OrgUnitGroups')}
                                                            optionFilterProp="label"
                                                            showSearch
                                                            allowClear
                                                      />
                                                </div>
                                          </Col>
                                    )}
                                    {selectedOrganisationUnitGroup && (
                                          <Col sm={24} md={6}>
                                                <div style={{ marginTop: '20px' }}>
                                                      <div style={{ marginBottom: '5px' }}>
                                                            {translate('Type_Periode')}
                                                      </div>
                                                      <Select
                                                            style={{ width: '100%' }}
                                                            options={periodTypesOptions()}
                                                            placeholder={translate('Type_Periode')}
                                                            onChange={handleSelectPeriodType}
                                                            value={selectedPeriodType}
                                                            showSearch
                                                      />
                                                </div>
                                          </Col>
                                    )}
                                    {selectedPeriodType && (
                                          <Col sm={24} md={6}>
                                                <div style={{ marginTop: '20px' }}>
                                                      <div style={{ marginBottom: '5px' }}>{translate('Periode')}</div>
                                                      <DatePicker
                                                            style={{ width: '100%' }}
                                                            placeholder={translate('Periode')}
                                                            onChange={handleSelectPeriode}
                                                            value={selectedPeriod}
                                                            picker={selectedPeriodType?.toLocaleLowerCase()}
                                                      />
                                                </div>
                                          </Col>
                                    )}
                                    <Col sm={24} md={24}>
                                          <Divider style={{ margin: '10px' }} />
                                          <Button
                                                loading={loadingAnalyticIndicatorResults}
                                                disabled={
                                                      selectedOrganisationUnitSingle &&
                                                      selectedOrganisationUnitGroup &&
                                                      selectedIndicators.length > 0 &&
                                                      selectedOrganisationUnitGroupSet &&
                                                      selectedPeriod &&
                                                      parseInt(inputMeilleur || 0) + parseInt(inputMauvais || 0) > 0
                                                            ? false
                                                            : true
                                                }
                                                primary
                                                onClick={handleDisplayIndicatorResult}
                                          >
                                                {translate('Afficher_Resultats')}
                                          </Button>
                                    </Col>
                              </Row>
                        </div>
                  </Card>
            </div>
      );

      const RenderRandomForm = () => (
            <div>
                  <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size="small">
                        <div
                              style={{
                                    background: '#0A9396',
                                    color: '#FFF',
                                    fontWeight: 'bold',
                                    padding: '10px'
                              }}
                        >
                              <span>{translate('Recherche_Aleatoire')}</span>
                        </div>
                        <div style={{ marginTop: '5px', padding: '10px' }}>
                              <Row gutter={[10, 10]}>
                                    <Col sm={24} md={9}>
                                          <div>
                                                <div style={{ marginBottom: '5px' }}>
                                                      {translate('Unites_Organisation')}
                                                </div>
                                                <OrganisationUnitsTree
                                                      meOrgUnitId={me?.organisationUnits[0]?.id}
                                                      orgUnits={organisationUnits}
                                                      currentOrgUnits={selectedOrganisationUnitSingle}
                                                      setCurrentOrgUnits={setSelectedOrganisationUnitSingle}
                                                      loadingOrganisationUnits={loadingOrganisationUnits}
                                                />
                                          </div>
                                    </Col>
                                    {0 > 1 && (
                                          <Col sm={24} md={9}>
                                                <div style={{ marginBottom: '5px' }}>
                                                      {translate('OrgUnitGroupSet')}
                                                </div>
                                                <Select
                                                      style={{ width: '100%' }}
                                                      options={organisationUnitGroupSets.map(org => ({
                                                            label: org.displayName,
                                                            value: org.id
                                                      }))}
                                                      value={selectedOrganisationUnitGroupSet?.id}
                                                      disabled={loadingOrganisationUnitGroupSets}
                                                      loading={loadingOrganisationUnitGroupSets}
                                                      placeholder={translate('OrgUnitGroups')}
                                                      onChange={handleSelectOrganisationUnitGroupSet}
                                                      allowClear
                                                />
                                          </Col>
                                    )}
                                    {
                                          <Col sm={24} md={9}>
                                                <div>
                                                      <div style={{ marginBottom: '5px' }}>
                                                            {translate('OrgUnitGroups')}
                                                      </div>
                                                      <Select
                                                            style={{ width: '100%' }}
                                                            options={organisationUnitGroups?.map(org => ({
                                                                  value: org.id,
                                                                  label: org.displayName
                                                            }))}
                                                            value={selectedOrganisationUnitGroups?.map(ou => ou.id)}
                                                            onChange={handleSelectOrganisationUnitGroupForRandomCase}
                                                            placeholder={translate('OrgUnitGroups')}
                                                            mode="multiple"
                                                            optionFilterProp="label"
                                                            showSearch
                                                            allowClear
                                                      />
                                                </div>
                                          </Col>
                                    }
                                    <Col sm={24} md={6}>
                                          <div style={{ marginBottom: '5px' }}>
                                                {translate('Nombres_Unites_Organisations')}
                                          </div>
                                          <InputNumber
                                                style={{ width: '100%' }}
                                                placeholder={translate('Nombres_Unites_Organisations')}
                                                value={inputNbrOrgUnit}
                                                onChange={value => setInputNbrOrgUnit(value || 0)}
                                          />
                                    </Col>
                                    <Col sm={24} md={6}>
                                          <div>
                                                <Button
                                                      loading={loadingAnalyticIndicatorResults}
                                                      disabled={
                                                            selectedOrganisationUnitSingle &&
                                                            selectedOrganisationUnitGroups.length > 0 &&
                                                            parseInt(inputNbrOrgUnit) > 0
                                                                  ? false
                                                                  : true
                                                      }
                                                      primary
                                                      onClick={handleDisplayIndicatorResultForRandomCase}
                                                >
                                                      {translate('Afficher_Resultats')}
                                                </Button>
                                          </div>
                                    </Col>
                              </Row>
                        </div>
                  </Card>
            </div>
      );

      const RenderPlanificationForm = () => (
            <>
                  {selectedPlanificationType === ORGANISATION_UNIT &&
                        selectedOrganisationUnits &&
                        RenderOrganisationUnitForm()}
                  {selectedPlanificationType === INDICATOR && selectedIndicators.length > 0 && RenderIndicatorForm()}
                  {selectedPlanificationType === RANDOM && RenderRandomForm()}
            </>
      );

      const RenderDataElementConfigList = () => (
            <>
                  {mappingConfigs.length > 0 && (
                        <div
                              className="my-shadow"
                              style={{
                                    padding: '10px',
                                    background: '#FFF',
                                    marginBottom: '2px',
                                    borderRadius: '8px',
                                    marginTop: '10px'
                              }}
                        >
                              <div
                                    style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center'
                                    }}
                              >
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                          {translate('Liste_Configuration_Element_De_Donnees')}
                                    </div>
                              </div>

                              <hr style={{ margin: '10px auto' }} />

                              <Table
                                    dataSource={mappingConfigs.map(mapConf => ({
                                          ...mapConf,
                                          programStageName: mapConf.programStage?.displayName,
                                          indicatorName: mapConf.indicator?.displayName,
                                          dataElementName: mapConf.dataElement?.displayName,
                                          programName: mapConf.program?.displayName,
                                          action: { id: mapConf.id }
                                    }))}
                                    columns={[
                                          {
                                                title: translate('Programme_Stage'),
                                                dataIndex: 'programStageName'
                                          },
                                          {
                                                title: translate('Data_Element_Name'),
                                                dataIndex: 'dataElementName'
                                          },
                                          {
                                                title: translate('Source_De_Donnée'),
                                                dataIndex: 'indicatorName'
                                          }
                                    ]}
                                    size="small"
                              />
                        </div>
                  )}
            </>
      );

      const RenderSteps = () => (
            <div style={{ width: '100%' }}>
                  <Stepper
                        style={{ margin: '0px', padding: '0px' }}
                        activeStep={selectedStep}
                        stepClassName="stepper__step"
                        styleConfig={{
                              activeBgColor: '#2c6693',
                              activeTextColor: '#fff',
                              inactiveBgColor: '#fff',
                              inactiveTextColor: '#2c6693',
                              completedBgColor: '#fff',
                              completedTextColor: '#2c6693',
                              size: '40px',
                              fontWeight: 'bold',
                              circleFontSize: '25px',
                              labelFontSize: '16px'
                        }}
                        className="stepper"
                        steps={[
                              {
                                    label: translate('Configuration')
                              },
                              {
                                    label: translate('Finalisation')
                              }
                        ]}
                  />
            </div>
      );

      const handleOkAnalyticComponentModal = () => {
            setInputDataSourceDisplayName(selectedMetaDatas[0]?.name);
            setInputDataSourceID(selectedMetaDatas[0]?.id);
            setSelectedMetaDatas([]);
            setVisibleAnalyticComponentModal(false);
      };

      const handleCancelAnalyticComponentModal = () => {
            setSelectedMetaDatas([]);
            setVisibleAnalyticComponentModal(false);
      };

      const RenderAnalyticComponentModal = () =>
            visibleAnalyticComponentModal ? (
                  <Modal onClose={() => handleCancelAnalyticComponentModal()} large>
                        <ModalTitle>
                              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    {translate('Source_De_Donnee')}
                              </div>
                        </ModalTitle>
                        <ModalContent>
                              <div>
                                    <DataDimension
                                          selectedDimensions={selectedMetaDatas.map(it => ({
                                                ...it,
                                                isDeactivated: true
                                          }))}
                                          onSelect={value => {
                                                setSelectedMetaDatas(value?.items?.length > 0 ? [value.items[0]] : []);
                                          }}
                                          displayNameProp="displayName"
                                    />
                              </div>
                        </ModalContent>
                        <ModalActions>
                              <ButtonStrip end>
                                    <Button
                                          destructive
                                          onClick={() => handleCancelAnalyticComponentModal()}
                                          icon={<CgCloseO style={{ fontSize: '18px' }} />}
                                    >
                                          {translate('Annuler')}
                                    </Button>
                                    <Button
                                          primary
                                          onClick={() => handleOkAnalyticComponentModal()}
                                          icon={<FiSave style={{ fontSize: '18px' }} />}
                                    >
                                          {translate('Enregistrer')}
                                    </Button>
                              </ButtonStrip>
                        </ModalActions>
                  </Modal>
            ) : (
                  <></>
            );

      const generateArrayOfFieldsInputForPerformances = indicatorList => {
            const newList = [];
            for (let ind of indicatorList) {
                  if (selectedIndicators.map(inp => inp.indicator?.id).includes(ind.id)) {
                        newList.push(selectedIndicators.find(inp => inp.indicator.id === ind.id));
                  } else {
                        newList.push({
                              id: uuid(),
                              name: ind.name,
                              weight: 0,
                              indicator: ind
                        });
                  }
            }
            return newList;
      };

      const handleOkAnalyticComponentForPerformanceModal = () => {
            setSelectedIndicators(generateArrayOfFieldsInputForPerformances(selectedElementForPerformances));
            setVisibleAnalyticComponentPerformanceModal(false);
      };

      const handleCancelAnalyticComponentForPerformanceModal = () => {
            setVisibleAnalyticComponentPerformanceModal(false);
            setSelectedElementForPerformances(selectedIndicators?.map(ind => ind.indicator));
      };

      const RenderAnalyticComponenPerformancetModal = () =>
            visibleAnalyticComponentPerformanceModal ? (
                  <Modal onClose={() => handleCancelAnalyticComponentForPerformanceModal()} large>
                        <ModalTitle>
                              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    {translate('Source_De_Donnee')}
                              </div>
                        </ModalTitle>
                        <ModalContent>
                              <div>
                                    <DataDimension
                                          selectedDimensions={selectedElementForPerformances}
                                          onSelect={value => {
                                                setSelectedElementForPerformances(
                                                      value?.items?.length > 0 ? value.items : []
                                                );
                                          }}
                                          displayNameProp="displayName"
                                    />
                              </div>
                        </ModalContent>
                        <ModalActions>
                              <ButtonStrip end>
                                    <Button
                                          destructive
                                          onClick={handleCancelAnalyticComponentForPerformanceModal}
                                          icon={<CgCloseO style={{ fontSize: '18px' }} />}
                                    >
                                          {translate('Annuler')}
                                    </Button>
                                    <Button
                                          primary
                                          onClick={handleOkAnalyticComponentForPerformanceModal}
                                          icon={<FiSave style={{ fontSize: '18px' }} />}
                                    >
                                          {translate('Enregistrer')}
                                    </Button>
                              </ButtonStrip>
                        </ModalActions>
                  </Modal>
            ) : (
                  <></>
            );

      // const handleSelectBackgroundInformationFavorit = values => {
      //       const currentFavs = values?.map(v => favoritBackgroundInformationList.find(b => b.id === v)) || [];
      //       let newList = [];
      //       setSelectedBackgroundInformationFavorit(currentFavs);

      //       for (let fav of currentFavs) {
      //             newList = newList.concat(fav.configs || []);
      //       }

      //       setNonTranslateMappingConfigs(newList || []);
      //       setMappingConfigs([]);
      // };

      const handleSelectBackgroundInformationFavorit = value => {
            const currentFavs = favoritBackgroundInformationList.find(b => b.id === value);
            setSelectedBackgroundInformationFavorit(currentFavs);
            setNonTranslateMappingConfigs(currentFavs.configs || []);
            setMappingConfigs([]);
      };

      const RenderDataElementConfigContent = () => (
            <div style={{ marginTop: '10px' }}>
                  <Card className="my-shadow my-scrollable" bodyStyle={{ padding: '0px' }} size="small">
                        <div
                              style={{
                                    fontWeight: 'bold',
                                    padding: '10px',
                                    borderBottom: '1px solid #ccc'
                              }}
                        >
                              {translate('Configurations_Globales')}
                        </div>
                        <div style={{ padding: '10px' }}>
                              <Row gutter={[10, 10]}>
                                    <Col md={24}>
                                          <div>
                                                <div style={{ marginBottom: '5px' }}>{translate('Select_Favorit')}</div>
                                                <Select
                                                      options={favoritBackgroundInformationList
                                                            .filter(f => f.program?.id === selectedProgram?.program?.id)
                                                            .map(favorit => ({
                                                                  label: favorit.name,
                                                                  value: favorit.id
                                                            }))}
                                                      placeholder={translate('Select_Favorit')}
                                                      style={{ width: '100%' }}
                                                      optionFilterProp="label"
                                                      loading={loadingBackgroundInformationFavoritsConfigs}
                                                      value={selectedBackgroundInformationFavorit?.id}
                                                      onChange={handleSelectBackgroundInformationFavorit}
                                                      showSearch
                                                      // mode="multiple"
                                                />
                                          </div>
                                    </Col>
                              </Row>
                        </div>
                  </Card>
            </div>
      );

      const handleSelectCheckbox = orgUnit => {
            if (selectedOrganisationUnits.map(ou => ou.id).includes(orgUnit.id)) {
                  setSelectedOrganisationUnits(selectedOrganisationUnits.filter(ou => ou.id !== orgUnit.id));
                  setInputFields(inputFields.filter(o => o.organisationUnit?.id !== orgUnit.id));
            } else {
                  setSelectedOrganisationUnits([
                        ...selectedOrganisationUnits,
                        organisationUnits.find(ou => ou.id === orgUnit.id)
                  ]);
            }
      };

      const RenderTableRow = (backgroundColor, an, index) => (
            <tr style={{ backgroundColor, color: '#000' }} key={index}>
                  <td style={{ border: '1px solid #ccc', padding: '5px' }}>
                        <AntCheckbox
                              onChange={() => handleSelectCheckbox(an?.orgUnit)}
                              checked={selectedOrganisationUnits.map(ou => ou.id).includes(an.orgUnit?.id)}
                        />
                  </td>
                  <td
                        style={{ border: '1px solid #ccc', padding: '5px' }}
                  >{`${an.orgUnit?.displayName} (  ${an.orgUnit?.parent?.displayName}  ) `}</td>
                  {selectedIndicators.map((ind, indIndex) => (
                        <td
                              key={indIndex}
                              style={{
                                    border: '1px solid #ccc',
                                    padding: '5px',
                                    textAlign: 'center'
                              }}
                        >
                              {an[ind.indicator?.id]?.score || ''}
                        </td>
                  ))}
                  {
                        <td
                              style={{
                                    border: '1px solid #ccc',
                                    padding: '5px',
                                    textAlign: 'center'
                              }}
                        >
                              {an.scoreTotal}
                        </td>
                  }
            </tr>
      );

      const RenderMauvaisPositifInputMeilleur = () => {
            if (analyticIndicatorResults.length < parseInt(inputMeilleur) + parseInt(inputMauvais)) {
                  return <></>;
            } else {
                  return (
                        !inputMeilleurPositif &&
                        parseInt(inputMeilleur) > 0 &&
                        analyticIndicatorResults
                              .sort((a, b) => parseFloat(a.scoreTotal) - parseFloat(b.scoreTotal))
                              .slice(0, parseInt(inputMeilleur || 0))
                              .map((an, index) => RenderTableRow('#D3FFF3', an, index))
                  );
            }
      };

      const RenderMauvaisPositifInputMauvais = () => {
            if (analyticIndicatorResults.length < parseInt(inputMeilleur) + parseInt(inputMauvais)) {
                  return <></>;
            } else {
                  return (
                        !inputMeilleurPositif &&
                        parseInt(inputMauvais) > 0 &&
                        analyticIndicatorResults
                              .sort((a, b) => parseFloat(a.scoreTotal) - parseFloat(b.scoreTotal))
                              .slice(-parseInt(inputMauvais || 0))
                              .map((an, index) => RenderTableRow('#FFDDD2', an, index))
                  );
            }
      };

      const RenderMeilleurPositifInputMeilleur = () => {
            if (analyticIndicatorResults.length < parseInt(inputMeilleur) + parseInt(inputMauvais)) {
                  return <></>;
            } else {
                  return (
                        inputMeilleurPositif &&
                        parseInt(inputMeilleur) > 0 &&
                        analyticIndicatorResults
                              .sort((a, b) => parseFloat(b.scoreTotal) - parseFloat(a.scoreTotal))
                              .slice(0, parseInt(inputMeilleur || 0))
                              .map((an, index) => RenderTableRow('#D3FFF3', an, index))
                  );
            }
      };

      const RenderMeilleurPositifInputMauvais = () => {
            if (analyticIndicatorResults.length < parseInt(inputMeilleur) + parseInt(inputMauvais)) {
                  return <></>;
            } else {
                  return (
                        inputMeilleurPositif &&
                        parseInt(inputMauvais) > 0 &&
                        analyticIndicatorResults
                              .sort((a, b) => parseFloat(b.scoreTotal) - parseFloat(a.scoreTotal))
                              .slice(-parseInt(inputMauvais || 0))
                              .map((an, index) => RenderTableRow('#FFDDD2', an, index))
                  );
            }
      };

      const RenderAnalyticIndicatorsResults = () => (
            <div style={{ marginTop: '10px' }}>
                  <Card size="small" className="my-shadow">
                        <div>
                              <div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                          <thead>
                                                <tr style={{ backgroundColor: '#fff' }}>
                                                      <th
                                                            style={{
                                                                  border: '1px solid #ccc',
                                                                  padding: '5px',
                                                                  textAlign: 'center'
                                                            }}
                                                      ></th>
                                                      <th
                                                            style={{
                                                                  border: '1px solid #ccc',
                                                                  padding: '5px',
                                                                  textAlign: 'center'
                                                            }}
                                                      >
                                                            {translate('Unite_Organisation')}
                                                      </th>
                                                      {selectedIndicators.map((ind, index) => (
                                                            <th
                                                                  key={index}
                                                                  style={{
                                                                        border: '1px solid #ccc',
                                                                        padding: '5px',
                                                                        textAlign: 'center'
                                                                  }}
                                                            >
                                                                  {ind.indicator?.name}
                                                            </th>
                                                      ))}
                                                      <th
                                                            style={{
                                                                  border: '1px solid #ccc',
                                                                  padding: '5px',
                                                                  textAlign: 'center'
                                                            }}
                                                      >
                                                            Scores
                                                      </th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {RenderMeilleurPositifInputMeilleur()}
                                                {RenderMeilleurPositifInputMauvais()}
                                                {RenderMauvaisPositifInputMeilleur()}
                                                {RenderMauvaisPositifInputMauvais()}
                                          </tbody>
                                    </table>
                                    {analyticIndicatorResults.length <
                                          parseInt(inputMeilleur) + parseInt(inputMauvais) && (
                                          <div style={{ marginTop: '20px' }}>
                                                <MyNoticeBox
                                                      message={translate('Best_Input_Is_Too_Gratter')}
                                                      title={translate('Recherche')}
                                                      type={NOTICE_BOX_ERROR}
                                                      show={true}
                                                />
                                          </div>
                                    )}
                              </div>
                        </div>
                  </Card>
            </div>
      );

      const RenderRandomTableBody = () =>
            randomResults.slice(0, inputNbrOrgUnit).map((an, index) => (
                  <tr key={index}>
                        <td
                              style={{
                                    border: '1px solid #ccc',
                                    padding: '5px',
                                    textAlign: 'center',
                                    width: '80px'
                              }}
                        >
                              <span>
                                    <AntCheckbox
                                          onChange={() => handleSelectCheckbox(an)}
                                          checked={selectedOrganisationUnits.map(ou => ou.id).includes(an?.id)}
                                    />
                              </span>
                        </td>
                        <td
                              style={{ border: '1px solid #ccc', padding: '5px' }}
                        >{`${an?.displayName} (  ${an?.parent?.displayName}  ) `}</td>
                  </tr>
            ));

      const RenderRandomResults = () => (
            <div style={{ marginTop: '10px' }}>
                  <Card size="small" className="my-shadow">
                        <div>
                              {randomResults.length < parseInt(inputNbrOrgUnit) && (
                                    <div style={{ marginTop: '20px' }}>
                                          <MyNoticeBox
                                                message={translate('Nombre_De_Structure_Trop_Grand')}
                                                type={NOTICE_BOX_WARNING}
                                                show={true}
                                          />
                                    </div>
                              )}
                              <div style={{ marginTop: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                          <thead>
                                                <tr style={{ background: '#CCC' }}>
                                                      <th
                                                            style={{
                                                                  border: '1px solid #ccc',
                                                                  padding: '5px',
                                                                  textAlign: 'center'
                                                            }}
                                                      >
                                                            {translate('Actions')}
                                                      </th>
                                                      <th
                                                            style={{
                                                                  border: '1px solid #ccc',
                                                                  padding: '5px',
                                                                  textAlign: 'center'
                                                            }}
                                                      >
                                                            {translate('Unite_Organisation')}
                                                      </th>
                                                </tr>
                                          </thead>
                                          <tbody>{RenderRandomTableBody()}</tbody>
                                    </table>
                              </div>
                        </div>
                  </Card>
            </div>
      );

      const loadTEIs = async orgUnitId => {
            try {
                  if (selectedProgram && orgUnitId) {
                        setLoadingTeiList(true);
                        setEmpty(false);

                        const route = `${TRACKED_ENTITY_INSTANCES_ROUTE}.json?ou=${orgUnitId}&ouMode=DESCENDANTS&program=${selectedProgram.program?.id}&fields=trackedEntityInstance,attributes,orgUnit,trackedEntityType,enrollments=[enrollment,orgUnit,orgUnitName,status,program,enrollmentDate,trackedEntityInstance]&order=created:DESC&pageSize=10000`;
                        const response = await axios.get(route);
                        setTeisList(response.data.trackedEntityInstances);
                        if (
                              !response.data.trackedEntityInstances ||
                              response.data.trackedEntityInstances?.length === 0
                        ) {
                              setEmpty(true);
                        }
                        setLoadingTeiList(false);
                  }
            } catch (err) {
                  setLoadingTeiList(false);
                  setEmpty(true);
            }
      };

      const onOrgUnitSelected = value => {
            return selectedPlanificationType === ORGANISATION_UNIT && loadTEIs(value.id);
      };

      const handleSelectCheckboxAgent = value => {
            if (selectedAgents.map(ag => ag.trackedEntityInstance).includes(value.trackedEntityInstance)) {
                  setSelectedAgents(
                        selectedAgents.filter(ag => ag.trackedEntityInstance !== value.trackedEntityInstance)
                  );
                  setInputFields(inputFields.filter(o => o.trackedEntityInstance !== value.trackedEntityInstance));
            } else {
                  setSelectedAgents([
                        ...selectedAgents,
                        teisList.find(tei => tei.trackedEntityInstance === value.trackedEntityInstance)
                  ]);
            }
      };

      const handleSelectCheckboxAgentForPerformance = value => {
            if (selectedAgents.map(ag => ag.trackedEntityInstance).includes(value.trackedEntityInstance)) {
                  setSelectedAgents(
                        selectedAgents.filter(ag => ag.trackedEntityInstance !== value.trackedEntityInstance)
                  );
                  setInputFields(inputFields.filter(o => o.trackedEntityInstance !== value.trackedEntityInstance));
            } else {
                  setSelectedAgents([
                        ...selectedAgents,
                        teisPerformanceList.find(tei => tei.trackedEntityInstance === value.trackedEntityInstance)
                  ]);
            }
      };

      const handleChangePlanificationTypeAgent = ({ value }) => {
            setSelectedOrganisationUnitSingle(null);
            setInputFields([]);
            setSelectedAgents([]);
            setSelectedPeriod(dayjs());
            setTeisList([]);
            setTeisPerformanceList([]);
            setSelectedIndicators([]);
            setSelectedOrganisationUnitGroups([]);
            setSelectedPlanificationType(value);
      };

      const handleSearchByPerformances = async () => {
            try {
                  setLoadingTeiList(true);

                  if (!selectedPeriod) throw new Error(translate('Veuillez_Selectionner_Periode'));

                  if (selectedIndicators.length === 0) throw new Error(translate('Indicateur_Obligatoire'));

                  if (!selectedOrganisationUnitSingle)
                        throw new Error(translate('Veuillez_Selectionner_Unite_Organisation'));

                  const routeLevel = `${API_BASE_ROUTE}/organisationUnitLevels.json?paging=false&fields=id,displayName,level&order=level:DESC`;
                  const responseLevels = await axios.get(routeLevel);
                  const postLevel = responseLevels.data.organisationUnitLevels[0];

                  const routeTeis = `${TRACKED_ENTITY_INSTANCES_ROUTE}.json?ou=${selectedOrganisationUnitSingle?.id}&ouMode=DESCENDANTS&program=${selectedProgram.program?.id}&fields=trackedEntityInstance,attributes,orgUnit,trackedEntityType,enrollments=[enrollment,orgUnit,orgUnitName,status,program,enrollmentDate,trackedEntityInstance]&order=created:DESC&pageSize=10000`;
                  const teiResponse = await axios.get(routeTeis);
                  const teis = teiResponse.data.trackedEntityInstances;

                  let ouGroupString = '';
                  if (selectedOrganisationUnitGroups.length > 0) {
                        for (let o of selectedOrganisationUnitGroups) {
                              ouGroupString = ouGroupString.concat(`OU_GROUP-${o.id};`);
                        }
                  }

                  let nouveauTeiList = [];

                  if (teis.length > 0) {
                        const routeAnalytic = `${API_BASE_ROUTE}/analytics/dataValueSet.json?dimension=dx:${selectedIndicators
                              .map(ind => ind.indicator?.id)
                              .join(';')}&dimension=ou:${selectedOrganisationUnitSingle?.id};LEVEL-${postLevel?.id}${
                              ouGroupString?.trim()?.length > 0 ? ';' + ouGroupString : ''
                        }&dimension=pe:${dayjs(selectedPeriod).format(
                              'YYYYMM'
                        )}&showHierarchy=false&hierarchyMeta=false&includeMetadataDetails=true&includeNumDen=true&skipRounding=false&completedOnly=false`;
                        const analyticResponse = await axios.get(routeAnalytic);
                        const dataValues = analyticResponse.data.dataValues || [];

                        nouveauTeiList = teis.reduce((prev, current) => {
                              const currentEnrollment = current.enrollments?.filter(
                                    en => en.program === selectedProgram?.program?.id
                              )?.[0];
                              if (currentEnrollment) {
                                    const payload = {
                                          ...current,
                                          agentName: `${
                                                current.attributes?.find(
                                                      att => att.attribute === selectedProgram?.attributeName?.id
                                                )?.value || ''
                                          } ${
                                                current.attributes?.find(
                                                      att => att.attribute === selectedProgram?.attributeFirstName?.id
                                                )?.value || ''
                                          }`
                                    };
                                    const indicatorPayload = {};

                                    for (let ind of selectedIndicators) {
                                          const dValues =
                                                dataValues.filter(
                                                      dv =>
                                                            ind.indicator?.id === dv.dataElement &&
                                                            dv.orgUnit === currentEnrollment.orgUnit &&
                                                            dayjs(selectedPeriod).format('YYYYMM') ===
                                                                  dayjs(dv.period).format('YYYYMM')
                                                ) || [];
                                          const dValue = dValues.reduce((pv, cr) => cr.value + cr.value, 0) || 0;

                                          indicatorPayload[`${ind.indicator?.id}`] = {
                                                indicatorDataValues: dValues,
                                                indicatorValue: dValue,
                                                indicatorName: ind.nom,
                                                indicatorScore: dValue * (ind.weight && ind.weight > 0 ? ind.weight : 1)
                                          };
                                    }

                                    prev.push({ ...payload, ...indicatorPayload });
                              }

                              return prev;
                        }, []);
                  }

                  setTeisPerformanceList(nouveauTeiList);
                  setLoadingTeiList(false);
            } catch (err) {
                  setLoadingTeiList(false);
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const RenderAgentConfigList = () => (
            <>
                  <div>
                        <Card size="small" className="my-shadow">
                              <div>
                                    <div style={{ fontWeight: 'bold' }}>{translate('Planification')}</div>
                                    <div style={{ display: 'flex', marginTop: '10px' }}>
                                          <div>
                                                <Radio
                                                      label={translate('Directe')}
                                                      className="cursor-pointer"
                                                      onChange={handleChangePlanificationTypeAgent}
                                                      value={ORGANISATION_UNIT}
                                                      checked={selectedPlanificationType === ORGANISATION_UNIT}
                                                />
                                          </div>
                                          <div style={{ marginLeft: '20px' }}>
                                                <Radio
                                                      label={translate('Basee_Sur_Perfomances')}
                                                      className="cursor-pointer"
                                                      onChange={handleChangePlanificationTypeAgent}
                                                      value={INDICATOR}
                                                      checked={selectedPlanificationType === INDICATOR}
                                                />
                                          </div>
                                    </div>
                              </div>
                              {selectedPlanificationType && (
                                    <>
                                          <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                          <Row gutter={[8, 8]}>
                                                <Col md={8} sm={24}>
                                                      <div style={{ marginBottom: '5px' }}>
                                                            {translate('Unites_Organisation')}
                                                      </div>
                                                      <OrganisationUnitsTree
                                                            meOrgUnitId={me?.organisationUnits[0]?.id}
                                                            orgUnits={organisationUnits}
                                                            currentOrgUnits={selectedOrganisationUnitSingle}
                                                            setCurrentOrgUnits={setSelectedOrganisationUnitSingle}
                                                            loadingOrganisationUnits={loadingOrganisationUnits}
                                                            onChange={onOrgUnitSelected}
                                                      />
                                                </Col>

                                                {selectedPlanificationType === INDICATOR && (
                                                      <Col md={8} sm={24}>
                                                            <div>
                                                                  <div style={{ marginBottom: '5px' }}>
                                                                        {' '}
                                                                        {translate('Indicateurs')}
                                                                  </div>
                                                                  <Select
                                                                        options={dataStoreIndicatorConfigs.map(ind => ({
                                                                              label: ind.indicator?.displayName,
                                                                              value: ind.indicator?.id
                                                                        }))}
                                                                        loading={loadingDataStoreIndicatorConfigs}
                                                                        disabled={loadingDataStoreIndicatorConfigs}
                                                                        showSearch
                                                                        placeholder={translate('Indicateurs')}
                                                                        style={{ width: '100%' }}
                                                                        optionFilterProp="label"
                                                                        mode="multiple"
                                                                        onChange={handleSelectIndicators}
                                                                        value={selectedIndicators?.map(
                                                                              ind => ind.indicator?.id
                                                                        )}
                                                                        allowClear
                                                                  />
                                                            </div>
                                                      </Col>
                                                )}
                                                {selectedPlanificationType === INDICATOR && (
                                                      <Col md={8} sm={24}>
                                                            <div>
                                                                  <div style={{ marginBottom: '5px' }}>
                                                                        {' '}
                                                                        {translate('Groupe_Unite_Organisations')}
                                                                  </div>
                                                                  <Select
                                                                        options={organisationUnitGroups.map(org => ({
                                                                              label: org.displayName,
                                                                              value: org.id
                                                                        }))}
                                                                        loading={loadingOrganisationUnitGroups}
                                                                        disabled={loadingOrganisationUnitGroups}
                                                                        showSearch
                                                                        placeholder={translate(
                                                                              'Groupe_Unite_Organisations'
                                                                        )}
                                                                        style={{ width: '100%' }}
                                                                        optionFilterProp="label"
                                                                        mode="multiple"
                                                                        onChange={handleSelectOrgUnitGroup}
                                                                        value={selectedOrganisationUnitGroup?.map(
                                                                              org => org?.id
                                                                        )}
                                                                  />
                                                            </div>
                                                      </Col>
                                                )}

                                                {selectedPlanificationType === INDICATOR && (
                                                      <Col md={6} sm={24}>
                                                            <div>
                                                                  <div style={{ marginBottom: '5px' }}>
                                                                        {translate('Periode')}
                                                                  </div>
                                                                  <DatePicker
                                                                        style={{ width: '100%' }}
                                                                        placeholder={translate('Periode')}
                                                                        onChange={handleSelectPeriode}
                                                                        value={selectedPeriod}
                                                                        picker="month"
                                                                  />
                                                            </div>
                                                      </Col>
                                                )}

                                                {selectedPlanificationType === INDICATOR && (
                                                      <Col md={4} sm={24}>
                                                            <div style={{ marginTop: '22px' }}>
                                                                  <Button
                                                                        loading={loadingTeiList}
                                                                        disabled={
                                                                              selectedPeriod &&
                                                                              selectedIndicators.length > 0 &&
                                                                              selectedOrganisationUnitSingle
                                                                                    ? false
                                                                                    : true
                                                                        }
                                                                        primary
                                                                        onClick={handleSearchByPerformances}
                                                                  >
                                                                        {translate('Recherche')}
                                                                  </Button>
                                                            </div>
                                                      </Col>
                                                )}
                                          </Row>
                                    </>
                              )}
                        </Card>
                  </div>

                  {selectedOrganisationUnitSingle && (
                        <div style={{ marginTop: '10px' }}>
                              <Card size="small" className="my-shadow">
                                    <>
                                          <div style={{ fontWeight: 'bold' }}>{translate('Liste_Des_Agents')}</div>
                                          {loadingTeiList && (
                                                <div style={{ marginTop: '20px' }}>
                                                      <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <CircularLoader small />
                                                            <span style={{ marginLeft: '20px' }}>
                                                                  {translate('Chargement')}...
                                                            </span>
                                                      </div>
                                                </div>
                                          )}

                                          {selectedPlanificationType === ORGANISATION_UNIT && teisList.length > 0 && (
                                                <MantineReactTable
                                                      enableStickyHeader
                                                      columns={[
                                                            {
                                                                  accessorKey: 'tei',
                                                                  header: translate('Actions'),
                                                                  Cell: ({ cell, row }) => {
                                                                        return (
                                                                              <>
                                                                                    <div>
                                                                                          <AntCheckbox
                                                                                                onChange={() =>
                                                                                                      handleSelectCheckboxAgent(
                                                                                                            cell.getValue()
                                                                                                      )
                                                                                                }
                                                                                                checked={selectedAgents
                                                                                                      .map(
                                                                                                            ag =>
                                                                                                                  ag.trackedEntityInstance
                                                                                                      )
                                                                                                      .includes(
                                                                                                            cell.getValue()
                                                                                                                  ?.trackedEntityInstance
                                                                                                      )}
                                                                                          />
                                                                                    </div>
                                                                              </>
                                                                        );
                                                                  }
                                                            },
                                                            ...selectedProgram.attributesToDisplay.map(att => ({
                                                                  header: att.displayName,
                                                                  accessorKey: att.displayName
                                                            }))
                                                      ]}
                                                      data={teisList.map(tei => {
                                                            let payload = {
                                                                  tei
                                                            };
                                                            for (let att of selectedProgram.attributesToDisplay) {
                                                                  for (let teiAttr of tei.attributes) {
                                                                        if (att.id === teiAttr.attribute) {
                                                                              payload[`${att.displayName}`] =
                                                                                    teiAttr.value;
                                                                        }
                                                                  }
                                                            }
                                                            return payload;
                                                      })}
                                                      mantinePaperProps={{
                                                            shadow: 'none',
                                                            radius: '8px',
                                                            withBorder: false
                                                      }}
                                                      initialState={{
                                                            density: 'xs'
                                                      }}
                                                      mantineTableProps={{
                                                            striped: true,
                                                            highlightOnHover: true
                                                      }}
                                                />
                                          )}

                                          {selectedPlanificationType === INDICATOR &&
                                                teisPerformanceList.length > 0 && (
                                                      <MantineReactTable
                                                            enableStickyHeader
                                                            columns={[
                                                                  {
                                                                        header: translate('Actions'),
                                                                        Cell: ({ cell, row }) => {
                                                                              return (
                                                                                    <>
                                                                                          <div>
                                                                                                <AntCheckbox
                                                                                                      onChange={() =>
                                                                                                            handleSelectCheckboxAgentForPerformance(
                                                                                                                  row.original
                                                                                                            )
                                                                                                      }
                                                                                                      checked={selectedAgents
                                                                                                            .map(
                                                                                                                  ag =>
                                                                                                                        ag.trackedEntityInstance
                                                                                                            )
                                                                                                            .includes(
                                                                                                                  row
                                                                                                                        .original
                                                                                                                        .trackedEntityInstance
                                                                                                            )}
                                                                                                />
                                                                                          </div>
                                                                                    </>
                                                                              );
                                                                        }
                                                                  },
                                                                  {
                                                                        accessorKey: 'agentName',
                                                                        header: translate('Agent')
                                                                  },
                                                                  ...selectedIndicators.map(ind => ({
                                                                        header: ind.indicator?.displayName,
                                                                        accessorKey: `${ind.indicator?.id}.indicatorValue`
                                                                  }))
                                                            ]}
                                                            data={teisPerformanceList}
                                                            mantinePaperProps={{
                                                                  shadow: 'none',
                                                                  radius: '8px',
                                                                  withBorder: false
                                                            }}
                                                            initialState={{
                                                                  density: 'xs'
                                                            }}
                                                            mantineTableProps={{
                                                                  striped: true,
                                                                  highlightOnHover: true
                                                            }}
                                                      />
                                                )}

                                          {isEmpty && (
                                                <div style={{ marginTop: '20px' }}>
                                                      <span style={{ fontWeight: 'bold', color: '#00000090' }}>
                                                            {' '}
                                                            {translate('Aucun_Agent_Trouve')}
                                                      </span>
                                                </div>
                                          )}
                                    </>
                              </Card>
                        </div>
                  )}
            </>
      );

      const RenderStepsContent = () => (
            <>
                  {selectedStep === 0 && (
                        <>
                              <Row gutter={[12, 12]}>
                                    {selectedProgram && (
                                          <Col md={24}>
                                                <div
                                                      style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'right'
                                                      }}
                                                >
                                                      <div>
                                                            <Button
                                                                  primary
                                                                  small
                                                                  disabled={selectedStep === 0 ? true : false}
                                                                  icon={
                                                                        <BsArrowLeft
                                                                              style={{
                                                                                    color: '#fff',
                                                                                    fontSize: '18px'
                                                                              }}
                                                                        />
                                                                  }
                                                                  onClick={() => setSelectedStep(selectedStep - 1)}
                                                            >
                                                                  {translate('Precedent')}
                                                            </Button>
                                                      </div>
                                                      <div
                                                            style={{
                                                                  marginLeft: '10px',
                                                                  display: `${
                                                                        selectedSupervisionType ===
                                                                        TYPE_SUPERVISION_AGENT
                                                                              ? selectedAgents.length > 0
                                                                                    ? 'block'
                                                                                    : 'none'
                                                                              : 'block'
                                                                  }`
                                                            }}
                                                      >
                                                            <Button
                                                                  icon={
                                                                        <BsArrowRight
                                                                              style={{
                                                                                    color: '#fff',
                                                                                    fontSize: '18px'
                                                                              }}
                                                                        />
                                                                  }
                                                                  primary
                                                                  small
                                                                  onClick={() => setSelectedStep(selectedStep + 1)}
                                                            >
                                                                  {translate('Suivant')}
                                                            </Button>
                                                      </div>
                                                </div>
                                          </Col>
                                    )}
                                    <Col sm={24} md={8}>
                                          {RenderSupervisionTypeContent()}
                                          {selectedSupervisionType && RenderSelectedSupervisionTypeList()}
                                          {selectedProgram && RenderDataElementConfigContent()}
                                    </Col>
                                    <Col sm={24} md={16}>
                                          {selectedProgram &&
                                                selectedSupervisionType === TYPE_SUPERVISION_AGENT &&
                                                selectedProgram.attributesToDisplay?.length > 0 &&
                                                RenderAgentConfigList()}
                                          {selectedProgram && RenderDataElementConfigList()}
                                    </Col>
                              </Row>
                        </>
                  )}

                  {selectedStep === 1 && (
                        <>
                              <Row gutter={[10, 10]}>
                                    {selectedProgram && (
                                          <Col md={24}>
                                                <div
                                                      style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'right'
                                                      }}
                                                >
                                                      <div>
                                                            <Button
                                                                  primary
                                                                  small
                                                                  icon={
                                                                        <BsArrowLeft
                                                                              style={{
                                                                                    color: '#fff',
                                                                                    fontSize: '18px'
                                                                              }}
                                                                        />
                                                                  }
                                                                  onClick={() => setSelectedStep(selectedStep - 1)}
                                                            >
                                                                  {translate('Precedent')}
                                                            </Button>
                                                      </div>
                                                      <div
                                                            style={{
                                                                  marginLeft: '10px',
                                                                  display: `${selectedStep === 1 ? 'none' : 'block'}`
                                                            }}
                                                      >
                                                            <Button
                                                                  disabled={selectedStep === 1 ? true : false}
                                                                  icon={
                                                                        <BsArrowRight
                                                                              style={{
                                                                                    color: '#fff',
                                                                                    fontSize: '18px'
                                                                              }}
                                                                        />
                                                                  }
                                                                  primary
                                                                  small
                                                                  onClick={() => setSelectedStep(selectedStep + 1)}
                                                            >
                                                                  {translate('Suivant')}
                                                            </Button>
                                                      </div>
                                                </div>
                                          </Col>
                                    )}

                                    {selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT && (
                                          <Col sm={24} md={8}>
                                                {selectedProgram && RenderSupervisionPlanificationType()}
                                                {selectedPlanificationType === INDICATOR &&
                                                      RenderSupervisionPlanificationIndicatorContent()}
                                                {selectedPlanificationType === INDICATOR &&
                                                      selectedIndicators.length > 0 &&
                                                      RenderEquipePlanificationContent()}
                                                {selectedProgram &&
                                                      (selectedPlanificationType === ORGANISATION_UNIT ||
                                                            selectedPlanificationType === RANDOM) &&
                                                      RenderEquipePlanificationContent()}
                                                {selectedPlanificationType === ORGANISATION_UNIT &&
                                                      RenderSupervisionPlanificationOrganisationUnitContent()}
                                          </Col>
                                    )}

                                    {selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT && (
                                          <Col sm={24} md={16}>
                                                {RenderPlanificationForm()}
                                          </Col>
                                    )}

                                    {selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT &&
                                          selectedPlanificationType === INDICATOR &&
                                          selectedIndicators.length > 0 &&
                                          selectedOrganisationUnitSingle &&
                                          selectedOrganisationUnitGroup &&
                                          selectedPeriod &&
                                          analyticIndicatorResults.length > 0 && (
                                                <Col md={24}>{RenderAnalyticIndicatorsResults()} </Col>
                                          )}

                                    {selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT &&
                                          selectedPlanificationType === RANDOM &&
                                          selectedOrganisationUnitSingle &&
                                          selectedOrganisationUnitGroups.length > 0 &&
                                          randomResults.length > 0 && <Col md={24}>{RenderRandomResults()} </Col>}

                                    {selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT &&
                                          selectedPlanificationType === INDICATOR &&
                                          selectedIndicators.length > 0 &&
                                          selectedOrganisationUnits.length > 0 && (
                                                <Col md={24}>{RenderOrganisationUnitForm(8)}</Col>
                                          )}
                                    {selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT &&
                                          selectedPlanificationType === RANDOM &&
                                          selectedOrganisationUnits.length > 0 && (
                                                <Col md={24}>{RenderOrganisationUnitForm(8)}</Col>
                                          )}
                              </Row>
                        </>
                  )}
            </>
      );

      const RenderSupervisionForm = () => (
            <>
                  <div style={{ width: '100%' }}>{RenderStepsContent()}</div>
            </>
      );

      const initInputOrganisation = ouList => {
            const newList = [];
            for (let org of ouList) {
                  if (inputFields.map(inp => inp.organisationUnit?.id).includes(org.id)) {
                        newList.push(inputFields.find(inp => inp.organisationUnit.id === org.id));
                  } else {
                        newList.push({
                              organisationUnit: { id: org.id, displayName: org.displayName, level: org.level },
                              program: {
                                    id: selectedProgram.program?.id,
                                    displayName: selectedProgram.program?.displayName
                              },
                              fieldConfig: selectedProgram.fieldConfig,
                              generationType: selectedProgram.generationType,
                              libelle: '',
                              payment: null,
                              period: null,
                              periodVerification: null,
                              equipe: null,
                              supervisors: [],
                              otherSupervisors: [],
                              inputOtherSupervisor: ''
                        });
                  }
            }
            return newList;
      };

      const initInputFields = () => {
            let newList = [];

            if (
                  selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT &&
                  selectedOrganisationUnits &&
                  selectedOrganisationUnits?.length > 0
            ) {
                  newList = initInputOrganisation(selectedOrganisationUnits);
            }

            setInputFields(newList);
      };

      const translateAllFavorisConfig = () => {
            let cumulateList = [];

            for (let el of dataStoreCrosschecks) {
                  cumulateList = cumulateList.concat(el.children);
            }
            for (let el of dataStoreIndicators) {
                  cumulateList = cumulateList.concat(el.children);
            }
            for (let el of dataStoreDECompletness) {
                  cumulateList = cumulateList.concat(el.children);
            }
            for (let el of dataStoreDSCompletness) {
                  cumulateList = cumulateList.concat(el.children);
            }
            for (let el of dataStoreRegistres) {
                  cumulateList = cumulateList.concat(el.children);
            }

            const translatedList =
                  nonTranslateMappingConfigs.map(mapConf => {
                        const foundElement = cumulateList.find(c => c.id === mapConf.indicator.id);

                        return {
                              ...mapConf,
                              indicator: mapConf.indicator && {
                                    ...mapConf.indicator,
                                    displayName: foundElement
                                          ? translateDataStoreLabel(foundElement)
                                          : mapConf.indicator.displayName
                              }
                        };
                  }) || [];

            setMappingConfigs(translatedList);
            setNonTranslateMappingConfigs([]);
      };

      useEffect(() => {
            if (me) {
                  loadDataStoreCrosschecks();
                  loadDataStoreIndicators();
                  loadDataStoreDECompletness();
                  loadDataStoreDSCompletness();
                  loadDataStoreRegistres();
                  loadOrganisationUnits();
                  loadOrganisationUnitGroups();
                  loadDataStorePerformanceFavoritsConfigs();
                  loadDataStoreBackgroundInformationFavoritsConfigs();
                  loadDataStoreIndicatorsConfigs();
                  loadDataStoreIndicatorsMapping();
                  loadDataElementGroups();
                  loadUsers(me?.organisationUnits?.[0]?.id);
            }
      }, [me]);

      useEffect(() => {
            initInputFields();
      }, [selectedOrganisationUnits, selectedAgents]);

      useEffect(() => {
            if (
                  nonTranslateMappingConfigs?.length > 0 &&
                  dataStoreCrosschecks?.length > 0 &&
                  dataStoreIndicators?.length > 0 &&
                  dataStoreDECompletness?.length > 0 &&
                  dataStoreDSCompletness?.length > 0 &&
                  dataStoreRegistres?.length > 0
            ) {
                  translateAllFavorisConfig();
            }
      }, [
            nonTranslateMappingConfigs,
            dataStoreCrosschecks,
            dataStoreIndicators,
            dataStoreDECompletness,
            dataStoreDSCompletness,
            dataStoreRegistres
      ]);

      return (
            <>
                  {RenderTopContent()}
                  {loadingDataStoreSupervisionConfigs && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                              <CircularLoader small />
                              <span style={{ marginLeft: '10px' }}>{translate('Chargement')}...</span>
                        </div>
                  )}

                  {!loadingDataStoreSupervisionConfigs && dataStoreSupervisionConfigs?.length > 0 && (
                        <>
                              <div style={{ padding: '10px', marginBottom: '10px' }}>
                                    {!isEditionMode && RenderSupervisionList()}
                                    {isEditionMode && RenderSupervisionForm()}
                              </div>
                              {RenderFloatingButton()}
                        </>
                  )}

                  {RenderAddEquipeModal()}
                  {RenderAnalyticComponenPerformancetModal()}
                  {RenderAddFavoritPerformanceModal()}
                  {RenderAnalyticComponentModal()}
                  {RenderNoticeBox()}
                  <MyNotification notification={notification} setNotification={setNotification} />
            </>
      );
};

export default Supervision;
