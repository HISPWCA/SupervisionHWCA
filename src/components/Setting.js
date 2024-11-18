import { useEffect, useState } from 'react';
import { Button, Radio, Tab, TabBar } from '@dhis2/ui';
import {
      AGGREGATE_INDICATOR,
      NOTIFICATION_CRITICAL,
      NOTIFICATION_SUCCESS,
      PAGE_CONFIGURATION_TYPE_SUPERVISIONS,
      PAGE_CONFIGURATION_USER_AUTHORIZATIONS,
      PAGE_CONFIG_INDICATORS,
      PAGE_CONFIG_SUPERVISION,
      PROGRAM_INDICATOR,
      TYPE_GENERATION_AS_ENROLMENT,
      TYPE_GENERATION_AS_EVENT,
      TYPE_GENERATION_AS_TEI,
      TYPE_ANALYSE_DATA_ELEMENT,
      PAGE_CONFIG_ANALYSE,
      TYPE_ANALYSE_INDICATOR,
      ORGANISATION_UNIT,
      AGENT,
      PAGE_CONFIG_VISUALIZATION,
      DQR,
      PAGE_INDICATORS_MAPPING,
      RDQA,
      ERDQ
} from '../utils/constants';
import { Card, Checkbox, Col, Divider, Input, InputNumber, Popconfirm, Row, Select, Table } from 'antd';
import {
      DATA_ELEMENTS_ROUTE,
      INDICATORS_GROUP_ROUTE,
      INDICATORS_ROUTE,
      MAPS_ROUTE,
      ORGANISATION_UNIT_GROUPS_ROUTE,
      PROGRAMS_ROUTE,
      PROGRAMS_STAGE_ROUTE,
      PROGRAM_INDICATOR_GROUPS,
      VISUALIZATIONS_ROUTE
} from '../utils/api.routes';
import axios from 'axios';
import { v1 as uuid } from 'uuid';
import { FiSave } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineCancel } from 'react-icons/md';
import { GiCancel } from 'react-icons/gi';

import { loadDataStore, saveDataToDataStore } from '../utils/functions';
import { BLUE } from '../utils/couleurs';
import MyNotification from './MyNotification';
import translate from '../utils/translator';
import GenerateIndicatorsFieldsDQR from './GenerateIndicatorsFieldsDQR';
import SettingIndicatorsMapping from './SettingIndicatorsMapping';
import { TagsInput } from 'react-tag-input-component';
import GenerateIndicatorsFieldsRDQA from './GenerateIndicatorsFieldsRDQA';

const Setting = () => {
      const [currentItem, setCurrentItem] = useState(null);
      const [notification, setNotification] = useState({
            show: false,
            message: null,
            type: null
      });
      const [renderPage, setRenderPage] = useState(PAGE_CONFIGURATION_TYPE_SUPERVISIONS);
      const [programs, setPrograms] = useState([]);
      const [indicatorGroups, setIndicatorGroups] = useState([]);
      const [mappingConfigs, setMappingConfigs] = useState([]);
      const [mappingConfigSupervisions, setMappingConfigSupervisions] = useState([]);
      const [indicators, setIndicators] = useState([]);
      const [dataElements, setDataElements] = useState([]);
      const [analyseConfigs, setAnalyseConfigs] = useState([]);
      const [programStages, setProgramStages] = useState([]);
      const [paymentConfigList, setPaymentConfigList] = useState([]);
      const [isEditModePayment, setEditModePayment] = useState(false);
      const [currentPaymentConfig, setCurrentPaymentConfig] = useState(null);
      const [dataStoreVisualizations, setDataStoreVisualizations] = useState([]);
      const [currentVisualizationProgram, setCurrentVisualizationProgram] = useState(null);
      const [indicatorsFieldsConfigsForRDQA, setIndicatorsFieldsConfigsForRDQA] = useState([]);
      const [currentVisualizationConfig, setCurrentVisualizationConfig] = useState(null);
      const [dataStorePeriodConfigs, setDataStorePeriodConfigs] = useState(null);

      const [visualizations, setVisualizations] = useState([]);
      const [maps, setMaps] = useState([]);
      const [favorisItems, setFavorisItems] = useState([]);
      const [dataStoreGlobalSettings, setDataStoreGlobalSettings] = useState(null);

      const [numberOfIndicatorAndRecoupement, setNumberOfIndicatorAndRecoupement] = useState({
            DQR: {
                  nbrIndicator: 1,
                  nbrRecoupement: 1,
                  nbrConsistencyOverTime: 1,
                  nbrDataElementCompleteness: 1,
                  nbrSourceDocumentCompleteness: 1
            },

            ERDQ: {
                  nbrIndicator: 1,
                  nbrRecoupement: 1
            }
      });

      const [indicatorName, setIndicatorName] = useState('');
      const [indicatorEtiquette, setIndicatorEtiquette] = useState('');
      const [indicatorWeight, setIndicatorWeight] = useState(0);
      const [indicatorBestPositive, setIndicatorBestPositive] = useState(true);

      const [organisationUnitGroups, setOrganisationUnitGroups] = useState([]);
      const [loadingOrganisationUnitGroups, setLoadingOrganisationUnitGroups] = useState(false);
      const [programStageConfigurations, setProgramStageConfigurations] = useState([]);
      const [currentProgramstageConfiguration, setCurrentProgramstageConfiguration] = useState(null);
      const [currentProgramstageConfigurationForRDQA, setCurrentProgramstageConfigurationForRDQA] = useState(null);

      const [selectedStatusSupervisionDataElement, setSelectedStatusSupervisionDataElement] = useState(null);
      const [selectedIndicator, setSelectedIndicator] = useState(null);
      const [selectedIndicatorGroup, setSelectedIndicatorGroup] = useState(null);
      const [selectedIndicatorType, setSelectedIndicatorType] = useState(PROGRAM_INDICATOR);
      const [selectedTEIProgram, setSelectedTEIProgram] = useState(null);
      const [selectedProgram, setSelectedProgram] = useState(null);
      const [selectedTypeSupervisionPage, setSelectedTypeSupervisionPage] = useState(PAGE_CONFIG_SUPERVISION);
      const [selectedAnalyseType, setSelectedAnalyseType] = useState(TYPE_ANALYSE_DATA_ELEMENT);

      const [selectedAnalyseIndicator, setSelectedAnalyseIndicator] = useState(null);
      const [selectedAnalyseDataElement, setSelectedAnalyseDataElement] = useState(null);
      const [selectedAttributesToDisplay, setSelectedAttributesToDisplay] = useState([]);
      const [selectedPlanificationType, setSelectedPlanificationType] = useState(ORGANISATION_UNIT);
      const [selectedProgramForVisualization, setSelectedProgramForVisualization] = useState(null);
      const [selectedTypeForVisualization, setSelectedTypeForVisualization] = useState('VISUALIZATION');
      const [selectedMaps, setSelectedMaps] = useState([]);
      const [selectedVisualizations, setSelectedVisualizations] = useState([]);

      const [inputLibellePayment, setInputLibellePayment] = useState('');
      const [inputMontantConstantPayment, setInputMontantConstantPayment] = useState(0);
      const [inputFraisMobileMoneyPayment, setInputFraisMobileMoneyPayment] = useState(0);

      const [loadingPrograms, setLoadingPrograms] = useState(false);
      const [loadingIndicatorGroups, setLoadingIndicatorGroups] = useState(false);
      const [loadingSaveSupervionsConfig, setLoadingSaveSupervionsConfig] = useState(false);
      const [loadingSaveIndicatorsConfig, setLoadingSaveIndicatorsConfig] = useState(false);
      const [loadingIndicators, setLoadingIndicators] = useState(false);
      const [loadingDataElements, setLoadingDataElements] = useState(false);
      const [loadingAddAnalyseConfigs, setLoadingAddAnalyseConfigs] = useState(false);
      const [loadingProgramStages, setLoadingProgramStages] = useState(false);
      const [loadingSaveVisualizationInDatastore, setLoadingSaveVisualizationInDatastore] = useState(false);
      const [loadingDataStoreVisualizations, setLoadingDataStoreVisualizations] = useState(false);

      const [updateAllFieldsWhenHaveOneStage, setUpdateAllFieldsWhenHaveOneStage] = useState(false);

      const [formState, setFormState] = useState({
            selectedConfigurationType: DQR,
            selectedSupervisionGenerationType: TYPE_GENERATION_AS_EVENT,
            selectedPlanificationType: ORGANISATION_UNIT,
            selectedProgramStageForConfiguration: null,
            selectedOrganisationUnitGroup: null,
            selectedTEIProgram: null,
            selectedSupervisorDataElements: [],
            selectedStatusSupervisionDataElement: null,
            selectedSupervisionAutoGenerateID: null,
            selectedNbrIndicatorsToShow: null,
            indicators: [],
            recoupements: [],
            completeness: {
                  dataElements: [],
                  sourceDocuments: [],
                  margin: null,
                  programAreaDOC: null,
                  programAreaDE: null
            },
            consistencyOvertimes: [],
            isFieldEditingMode: false
      });

      const [formStateForRDQA, setFormStateForRDQA] = useState({
            selectedProgramStageForConfiguration: null,
            selectedOrganisationUnitGroup: null,
            selectedSupervisorDataElements: [],
            selectedStatusSupervisionDataElement: null,
            selectedSupervisionAutoGenerateID: null
      });

      const [periodFormState, setPeriodFormState] = useState({
            month1KeyWords: [],
            month2KeyWords: [],
            month3KeyWords: [],
            month4KeyWords: [],
            month5KeyWords: [],
            month6KeyWords: [],
            month7KeyWords: [],
            month8KeyWords: [],
            month9KeyWords: [],
            month10KeyWords: [],
            month11KeyWords: [],
            month12KeyWords: [],
            month13KeyWords: [],
            month14KeyWords: [],
            month15KeyWords: []
      });

      const initialiserNumberOfIndicatorAndRecoupement = data => {
            setNumberOfIndicatorAndRecoupement({
                  ...numberOfIndicatorAndRecoupement,
                  DQR: {
                        ...data[DQR],
                        nbrIndicator: data[DQR]?.nbrIndicator || 1,
                        nbrRecoupement: data[DQR]?.nbrRecoupement || 1
                  },
                  ERDQ: {
                        ...data[ERDQ],
                        nbrIndicator: data[ERDQ]?.nbrIndicator || 1,
                        nbrRecoupement: data[ERDQ]?.nbrRecoupement || 1
                  }
            });
      };

      const initFields = (fieldList = null) => {
            const dqrConfig = numberOfIndicatorAndRecoupement.DQR;
            const newIndicators = [];
            const newRecoupements = [];
            const newConsistencyOverTimes = [];
            const newDataElementCompleteness = [];
            const newSourceDocumentCompleteness = [];

            for (let i = 1; i <= +dqrConfig.nbrIndicator; i++) {
                  newIndicators.push({
                        id: uuid(),
                        position: i,
                        value: fieldList?.indicators?.find(ind => ind.position === i)?.value || null,
                        margin: fieldList?.indicators?.find(ind => ind.position === i)?.margin || null,
                        viewMonthlyValue: fieldList?.indicators?.find(ind => ind.position === i)?.viewMonthlyValue || 3,
                        DHIS2MonthlyValue1:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue1 || null,
                        DHIS2MonthlyValue2:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue2 || null,
                        DHIS2MonthlyValue3:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue3 || null,
                        DHIS2MonthlyValue4:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue4 || null,
                        DHIS2MonthlyValue5:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue5 || null,
                        DHIS2MonthlyValue6:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue6 || null,
                        DHIS2MonthlyValue7:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue7 || null,
                        DHIS2MonthlyValue8:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue8 || null,
                        DHIS2MonthlyValue9:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue9 || null,
                        DHIS2MonthlyValue10:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue10 || null,
                        DHIS2MonthlyValue11:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue11 || null,
                        DHIS2MonthlyValue12:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue12 || null,
                        DHIS2MonthlyValue13:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue13 || null,
                        DHIS2MonthlyValue14:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue14 || null,
                        DHIS2MonthlyValue15:
                              fieldList?.indicators?.find(ind => ind.position === i)?.DHIS2MonthlyValue15 || null,
                        programArea: fieldList?.indicators?.find(ind => ind.position === i)?.programArea || null,
                        keyWords: fieldList?.indicators?.find(ind => ind.position === i)?.keyWords || []
                  });
            }

            for (let i = 1; i <= +dqrConfig.nbrRecoupement; i++) {
                  newRecoupements.push({
                        id: uuid(),
                        position: i,
                        primaryValue: fieldList?.recoupements?.find(rec => rec.position === i)?.primaryValue || null,
                        secondaryValue:
                              fieldList?.recoupements?.find(rec => rec.position === i)?.secondaryValue || null,
                        margin: fieldList?.recoupements?.find(rec => rec.position === i)?.margin || null,
                        programArea: fieldList?.recoupements?.find(rec => rec.position === i)?.programArea || null,
                        keyWords: fieldList?.recoupements?.find(rec => rec.position === i)?.keyWords || []
                  });
            }

            for (let i = 1; i <= +dqrConfig.nbrConsistencyOverTime; i++) {
                  newConsistencyOverTimes.push({
                        id: uuid(),
                        position: i,
                        value: fieldList?.consistencyOvertimes?.find(el => el.position === i)?.value || null,
                        margin: fieldList?.consistencyOvertimes?.find(el => el.position === i)?.margin || null,
                        programArea: fieldList?.consistencyOvertimes?.find(el => el.position === i)?.programArea || null
                  });
            }

            for (let i = 1; i <= +dqrConfig.nbrDataElementCompleteness; i++) {
                  newDataElementCompleteness.push({
                        id: uuid(),
                        position: i,
                        value: fieldList?.completeness?.dataElements?.find(el => el.position === i)?.value || null,
                        keyWords: fieldList?.completeness?.dataElements?.find(el => el.position === i)?.keyWords || []
                  });
            }

            for (let i = 1; i <= +dqrConfig.nbrSourceDocumentCompleteness; i++) {
                  newSourceDocumentCompleteness.push({
                        id: uuid(),
                        position: i,
                        value: fieldList?.completeness?.sourceDocuments?.find(el => el.position === i)?.value || null,
                        keyWords:
                              fieldList?.completeness?.sourceDocuments?.find(el => el.position === i)?.keyWords || []
                  });
            }

            setFormState({
                  ...formState,
                  indicators: newIndicators,
                  recoupements: newRecoupements,
                  consistencyOvertimes: newConsistencyOverTimes,
                  completeness: {
                        ...formState.completeness,
                        margin: fieldList?.completeness?.margin || null,
                        programAreaDE: fieldList?.completeness?.programAreaDE || null,
                        programAreaDOC: fieldList?.completeness?.programAreaDOC || null,
                        dataElements: newDataElementCompleteness,
                        sourceDocuments: newSourceDocumentCompleteness
                  }
            });
      };

      const cleanAllProgramConfigurationStates = () => {
            setFormState({
                  selectedConfigurationType: DQR,
                  selectedSupervisionGenerationType: TYPE_GENERATION_AS_EVENT,
                  selectedPlanificationType: ORGANISATION_UNIT,
                  selectedProgramStageForConfiguration: null,
                  selectedOrganisationUnitGroup: null,
                  selectedTEIProgram: null,
                  selectedSupervisorDataElements: [],
                  selectedStatusSupervisionDataElement: null,
                  selectedSupervisionAutoGenerateID: null,
                  selectedNbrIndicatorsToShow: null,
                  indicators: [],
                  recoupements: [],
                  completeness: {
                        dataElements: [],
                        sourceDocuments: [],
                        margin: null,
                        programAreaDOC: null,
                        programAreaDE: null
                  },
                  consistencyOvertimes: [],
                  isFieldEditingMode: false
            });

            setFormStateForRDQA({
                  selectedProgramStageForConfiguration: null,
                  selectedOrganisationUnitGroup: null,
                  selectedSupervisorDataElements: [],
                  selectedStatusSupervisionDataElement: null,
                  selectedSupervisionAutoGenerateID: null
            });

            setPeriodFormState({
                  month1KeyWords: [],
                  month2KeyWords: [],
                  month3KeyWords: [],
                  month4KeyWords: [],
                  month5KeyWords: [],
                  month6KeyWords: [],
                  month7KeyWords: [],
                  month8KeyWords: [],
                  month9KeyWords: [],
                  month10KeyWords: [],
                  month11KeyWords: [],
                  month12KeyWords: [],
                  month13KeyWords: [],
                  month14KeyWords: [],
                  month15KeyWords: []
            });
            setCurrentProgramstageConfiguration(null);
            setCurrentProgramstageConfigurationForRDQA(null);

            initFields();
            initFieldsForRDQA();
      };

      const initFieldsForRDQA = (fieldList = []) => {
            const newList = [];
            const rdqaConfig = numberOfIndicatorAndRecoupement[ERDQ];

            if (rdqaConfig?.nbrIndicator && rdqaConfig?.nbrRecoupement) {
                  for (let i = 1; i <= +rdqaConfig?.nbrIndicator; i++) {
                        const recoupements = [];

                        for (let j = 1; j <= +rdqaConfig?.nbrRecoupement; j++) {
                              const recoupementPayload = {
                                    id: uuid(),
                                    name: `${translate('Recoupements')} ${j}`,
                                    position: j,
                                    value: fieldList
                                          ?.find(ind => ind?.position === i)
                                          ?.recoupements?.find(rec => rec.position === j)?.value,
                                    indicatorMargin: null,
                                    recoupementMargin: null
                              };

                              recoupements.push(recoupementPayload);
                        }

                        const indicatorsPayload = {
                              id: uuid(),
                              name: `${translate('Indicateurs')} ${i}`,
                              position: i,
                              value: fieldList?.find(ind => ind?.position === i)?.value || null,
                              recoupements
                        };

                        newList.push(indicatorsPayload);
                  }

                  setIndicatorsFieldsConfigsForRDQA(newList);
            }
      };

      // const updatePeriodsConfigs = async periodPayload => {
      //       try {
      //             let configPayload = (await loadDataStore(
      //                   process.env.REACT_APP_PERIODS_CONFIG_KEY,
      //                   null,
      //                   null,
      //                   null
      //             )) || { periods: [], month1KeyWords: [], month2KeyWords: [], month3KeyWords: [] };
      //             if (configPayload && periodPayload) {
      //                   configPayload = { ...configPayload, periods: [...configPayload.periods, periodPayload] };
      //             }
      //             await saveDataToDataStore(process.env.REACT_APP_PERIODS_CONFIG_KEY, configPayload, null, null, null);
      //       } catch (err) {}
      // };

      const loadPrograms = async () => {
            try {
                  setLoadingPrograms(true);

                  const response = await axios.get(`${PROGRAMS_ROUTE}`);

                  setPrograms(response.data.programs);
                  setLoadingPrograms(false);
            } catch (err) {
                  setLoadingPrograms(false);
            }
      };

      const loadMaps = async () => {
            try {
                  const response = await axios.get(`${MAPS_ROUTE}?paging=false&fields=id,displayName,name`);
                  setMaps(response.data?.maps?.map(m => ({ ...m, type: 'MAP' })) || []);
            } catch (err) {}
      };

      const loadVisualizations = async () => {
            try {
                  const response = await axios.get(
                        `${VISUALIZATIONS_ROUTE}?pageSize=100000&fields=id,displayName,name,type`
                  );
                  setVisualizations(response.data.visualizations || []);
            } catch (err) {}
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

      const loadIndicators = async () => {
            try {
                  setLoadingIndicators(true);
                  const response = await axios.get(`${INDICATORS_ROUTE}`);
                  setIndicators(response.data.indicators);
                  setLoadingIndicators(false);
            } catch (err) {
                  setLoadingIndicators(false);
            }
      };

      const loadDataElements = async () => {
            try {
                  setLoadingDataElements(true);
                  const response = await axios.get(`${DATA_ELEMENTS_ROUTE}`);
                  setDataElements(response.data.dataElements);
                  setLoadingDataElements(false);
            } catch (err) {
                  setLoadingDataElements(false);
            }
      };

      const loadIndicatorGroups = async () => {
            try {
                  setLoadingIndicatorGroups(true);

                  const response = await axios.get(`${INDICATORS_GROUP_ROUTE}`);

                  setIndicatorGroups(response.data.indicatorGroups);
                  setLoadingIndicatorGroups(false);
            } catch (err) {
                  setLoadingIndicatorGroups(false);
            }
      };

      // const loadProgramIndicatorGroups = async () => {
      //       try {
      //             setLoadingIndicatorGroups(true);

      //             const response = await axios.get(`${PROGRAM_INDICATOR_GROUPS}`);

      //             setIndicatorGroups(response.data.programIndicatorGroups);
      //             setLoadingIndicatorGroups(false);
      //       } catch (err) {
      //             setLoadingIndicatorGroups(false);
      //       }
      // };

      const loadProgramStages = async programID => {
            try {
                  setLoadingProgramStages(true);

                  let route = `${PROGRAMS_STAGE_ROUTE},program,programStageDataElements[dataElement[id,displayName]]`;
                  if (programID) route = `${route}&filter=program.id:eq:${programID}`;

                  const response = await axios.get(route);

                  setProgramStages(response.data?.programStages);
                  setLoadingProgramStages(false);
                  return response.data.programStages;
            } catch (err) {
                  setLoadingProgramStages(false);
            }
      };

      const handleChangeIndicatorConfigType = ({ value }) => {
            setSelectedProgram(null);
            setSelectedIndicator(null);
            setSelectedIndicatorGroup(null);

            setSelectedIndicatorType(value);
            value === AGGREGATE_INDICATOR && loadIndicatorGroups();
      };

      const handleSelectIndicatorGroupIND = value => {
            setSelectedIndicator(null);
            setSelectedIndicatorGroup(indicatorGroups.find(indGroup => indGroup.id === value));
      };

      const handleSelectProgramIND = value => {
            setSelectedIndicator(null);
            setSelectedProgram(programs.find(prog => prog.id === value));
      };

      const handleSelectedTEIProgram = value => {
            setFormState({
                  ...formState,
                  selectedProgramStageForConfiguration: null,
                  selectedStatusSupervisionDataElement: null,
                  selectedSupervisorDataElements: [],
                  isFieldEditingMode: false,
                  selectedTEIProgram: programs.find(p => p.id === value)
            });
            setProgramStageConfigurations([]);
            setCurrentProgramstageConfiguration(null);
            loadProgramStages(value);
      };

      const handleSelectedProgramForVisualization = value => {
            setSelectedProgramForVisualization(programs.find(p => p.id === value));
      };

      const handleSelectIndicatorIND = value => {
            let currentIndicator = null;

            if (selectedIndicatorType === AGGREGATE_INDICATOR)
                  currentIndicator = selectedIndicatorGroup.indicators?.find(ind => ind.id === value);

            if (selectedIndicatorType === PROGRAM_INDICATOR)
                  currentIndicator = selectedProgram.programIndicators?.find(progInd => progInd.id === value);

            if (currentIndicator) {
                  setSelectedIndicator(currentIndicator);

                  setIndicatorBestPositive(true);
                  setIndicatorName(0);
                  setIndicatorEtiquette(currentIndicator.displayName);
                  setIndicatorName(currentIndicator.displayName);
            }
      };

      const handleSupervisionGenerationType = ({ value }) => {
            setFormState({ ...formState, selectedSupervisionGenerationType: value });
      };

      const handleSupervisionPlanificationType = ({ value }) => {
            setFormState({ ...formState, selectedPlanificationType: value });
      };

      const handleDeleteConfigItem = async value => {
            try {
                  if (value) {
                        setSelectedIndicator(null);
                        setIndicatorName(null);
                        setIndicatorBestPositive(true);
                        setIndicatorWeight(0);
                        setCurrentItem(null);

                        const newList = mappingConfigs.filter(mapConf => mapConf.id !== value.id);

                        if (selectedTypeSupervisionPage === PAGE_CONFIG_INDICATORS) {
                              await saveDataToDataStore(
                                    process.env.REACT_APP_INDICATORS_CONFIG_KEY,
                                    newList,
                                    null,
                                    null,
                                    null
                              );
                        }

                        setMappingConfigs(newList);
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
      const loadDataStoreGlobalSettings = async () => {
            try {
                  const response = await loadDataStore(process.env.REACT_APP_GLOBAL_SETTING_KEY, null, null, null);
                  setDataStoreGlobalSettings(response);

                  initialiserNumberOfIndicatorAndRecoupement(response);
            } catch (err) {
                  throw err;
            }
      };

      const initIndicatorConfigStates = async () => {
            try {
                  setMappingConfigs([]);
                  setDataElements([]);
                  setAnalyseConfigs([]);
                  setIndicators([]);
                  setSelectedProgram(null);
                  setSelectedIndicatorGroup(null);
                  setSelectedIndicator(null);
                  setSelectedIndicatorType(AGGREGATE_INDICATOR);
                  setIndicatorName('');
                  setIndicatorEtiquette('');
                  setIndicatorBestPositive(true);
                  setIndicatorWeight(0);
                  setCurrentItem(null);

                  loadIndicatorGroups();
                  const response = await loadDataStore(process.env.REACT_APP_INDICATORS_CONFIG_KEY, null, null, null);
                  setMappingConfigs(response);
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const initAnalyseConfigStates = async () => {
            try {
                  setAnalyseConfigs([]);
                  setSelectedAnalyseDataElement(null);
                  setSelectedAnalyseType(TYPE_ANALYSE_DATA_ELEMENT);
                  setSelectedAnalyseIndicator(null);
                  setCurrentItem(null);

                  loadDataElements();
                  loadIndicators();
                  const response = await loadDataStore(process.env.REACT_APP_ANALYSES_CONFIG_KEY, null, null, null);
                  setAnalyseConfigs(response);
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const initSupConfigStates = async () => {
            try {
                  setCurrentItem(null);
                  setMappingConfigs([]);
                  setDataElements([]);
                  setIndicators([]);
                  setSelectedAttributesToDisplay([]);
                  setAnalyseConfigs([]);
                  setMappingConfigSupervisions([]);
                  setProgramStageConfigurations([]);
                  setSelectedTEIProgram(null);
                  setSelectedIndicatorType(PROGRAM_INDICATOR);
                  setSelectedIndicatorGroup(null);
                  setSelectedIndicator(null);

                  loadOrganisationUnitGroups();
                  const responseSupervisionTracker = await loadDataStore(
                        process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY,
                        null,
                        null,
                        null
                  );

                  const responsePeriodConfigs = await loadDataStore(
                        process.env.REACT_APP_PERIODS_CONFIG_KEY,
                        null,
                        null,
                        null
                  );

                  setDataStorePeriodConfigs(responsePeriodConfigs);
                  setMappingConfigSupervisions(responseSupervisionTracker);
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const cleanPaymentConfigState = () => {
            setEditModePayment(false);
            setInputFraisMobileMoneyPayment(0);
            setInputMontantConstantPayment(0);
            setInputLibellePayment('');
            setPaymentConfigList([]);
            setCurrentPaymentConfig(null);
      };

      const handleDeleteSupervisionConfig = async item => {
            try {
                  if (item) {
                        const newList = mappingConfigSupervisions.filter(mapConf => mapConf.id !== item.id);
                        await saveDataToDataStore(
                              process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY,
                              newList,
                              null,
                              null,
                              null
                        );
                        setMappingConfigSupervisions(newList);
                        setNotification({
                              show: true,
                              message: translate('Suppression_Effectuee'),
                              type: NOTIFICATION_SUCCESS
                        });
                        handleCancelSupConfig();
                        cleanAllProgramConfigurationStates();
                        setCurrentProgramstageConfiguration(null);
                  }
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const handleDeleteVisatualizationProgramConfig = async item => {
            try {
                  if (item) {
                        const newList = dataStoreVisualizations.filter(
                              dataFav => dataFav.program?.id !== item.program?.id
                        );
                        await saveDataToDataStore(process.env.REACT_APP_VISUALIZATION_KEY, newList, null, null, null);
                        // setDataStoreVisualizations(newList);
                        loadDataStoreVisualizations();
                        setNotification({
                              show: true,
                              message: translate('Suppression_Effectuee'),
                              type: NOTIFICATION_SUCCESS
                        });
                        setSelectedProgramForVisualization(null);
                        setSelectedMaps([]);
                        setSelectedVisualizations([]);
                        setFavorisItems([]);
                        setCurrentVisualizationProgram(null);
                        cleanAllVisualizationStates();
                  }
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const handleDeleteVisualizationConfig = visID => {
            if (visID) {
                  setFavorisItems(favorisItems.filter(f => f.id !== visID));
            }
      };

      const handleUpdateBtnClicked = item => {
            setCurrentItem(item);
            item.indicatorType === AGGREGATE_INDICATOR && loadIndicatorGroups();
      };

      const initUpdateIndicatorConfigStage = async () => {
            try {
                  if (selectedTypeSupervisionPage === PAGE_CONFIG_INDICATORS && currentItem) {
                        if (currentItem.indicatorType === AGGREGATE_INDICATOR) {
                              const selectedIndGroup = indicatorGroups.find(
                                    p => p.id === currentItem.indicatorGroup?.id
                              );
                              const selectedInd = selectedIndGroup?.indicators?.find(
                                    ind => ind.id === currentItem?.indicator?.id
                              );

                              if (selectedInd) {
                                    setSelectedIndicatorGroup(selectedIndGroup);
                                    setSelectedIndicator(selectedInd);
                                    setSelectedIndicatorType(currentItem.indicatorType);
                                    setIndicatorName(currentItem.nom);
                                    setIndicatorWeight(currentItem.weight);
                                    setIndicatorEtiquette(currentItem.etiquette);
                                    setIndicatorBestPositive(currentItem.bestPositive);
                              }
                        }

                        if (currentItem.indicatorType === PROGRAM_INDICATOR) {
                              const selectedProg = programs.find(p => p.id === currentItem.program?.id);
                              const selectedInd = selectedProg?.programIndicators?.find(
                                    pInd => pInd.id === currentItem?.indicator?.id
                              );

                              if (selectedInd) {
                                    setSelectedProgram(selectedProg);
                                    setSelectedIndicator(selectedInd);
                                    setSelectedIndicatorType(currentItem.indicatorType);
                                    setIndicatorName(currentItem.nom);
                                    setIndicatorWeight(currentItem.weight);
                                    setIndicatorEtiquette(currentItem.etiquette);
                                    setIndicatorBestPositive(currentItem.bestPositive);
                              }
                        }
                  }
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const handleCancelSupConfig = () => {
            setFormState({
                  ...formState,
                  selectedProgramStageForConfiguration: null,
                  selectedTEIProgram: null,
                  selectedSupervisorDataElements: [],
                  selectedStatusSupervisionDataElement: null,
                  selectedOrganisationUnitGroup: null,
                  completeness: null,
                  consistencyOvertimes: [],
                  indicators: [],
                  isFieldEditingMode: false,
                  recoupements: []
            });
            setCurrentProgramstageConfiguration(null);
            setProgramStageConfigurations([]);
            cleanAllProgramConfigurationStates();
      };

      // const cleanStateAfterProgramCongurationSaved = () => {
      //       setFormState({
      //             ...formState,
      //             selectedProgramStageForConfiguration: null,
      //             selectedOrganisationUnitGroup: null,
      //             selectedSupervisorDataElements: [],
      //             selectedStatusSupervisionDataElement: null,
      //             selectedSupervisionAutoGenerateID: null,
      //             selectedNbrIndicatorsToShow: null,
      //             indicators: [],
      //             recoupements: [],
      //             completeness: {
      //                   dataElements: [],
      //                   sourceDocuments: [],
      //                   margin: null,
      //                   programAreaDOC: null,
      //                   programAreaDE: null
      //             },
      //             consistencyOvertimes: [],
      //             isFieldEditingMode: false
      //       });

      //       setFormStateForRDQA({
      //             ...formStateForRDQA,
      //             selectedProgramStageForConfiguration: null,
      //             selectedOrganisationUnitGroup: null,
      //             selectedSupervisorDataElements: [],
      //             selectedStatusSupervisionDataElement: null,
      //             selectedSupervisionAutoGenerateID: null
      //       });

      //       setPeriodFormState({
      //             month1KeyWords: [],
      //             month2KeyWords: [],
      //             month3KeyWords: [],
      //             month4KeyWords: [],
      //             month5KeyWords: [],
      //             month6KeyWords: [],
      //             month7KeyWords: [],
      //             month8KeyWords: [],
      //             month9KeyWords: [],
      //             month10KeyWords: [],
      //             month11KeyWords: [],
      //             month12KeyWords: [],
      //             month13KeyWords: [],
      //             month14KeyWords: [],
      //             month15KeyWords: []
      //       });
      //       setCurrentProgramstageConfiguration(null);
      //       setCurrentProgramstageConfigurationForRDQA(null);
      // };

      const handleSaveSupConfig = async () => {
            try {
                  setLoadingSaveSupervionsConfig(true);

                  if (!formState?.selectedTEIProgram) throw new Error(translate('Veuillez_Selectionner_Un_Programme'));

                  if (formState?.selectedConfigurationType === DQR && !formState?.selectedProgramStageForConfiguration)
                        throw new Error(translate('Please_Select_Program_Stage'));

                  if (
                        formState?.selectedConfigurationType === RDQA &&
                        !formStateForRDQA?.selectedProgramStageForConfiguration
                  )
                        throw new Error(translate('Please_Select_Program_Stage'));

                  if (formState?.selectedConfigurationType === RDQA && !formStateForRDQA?.selectedOrganisationUnitGroup)
                        throw new Error(translate('Please_Select_Organisation_Unit_Group'));

                  if (
                        formState?.selectedConfigurationType === DQR &&
                        formState?.selectedSupervisorDataElements?.length === 0
                  )
                        throw new Error(translate('Please_Select_Supervisor_Fields'));

                  if (
                        formState?.selectedConfigurationType === RDQA &&
                        formStateForRDQA?.selectedSupervisorDataElements?.length === 0
                  )
                        throw new Error(translate('Please_Select_Supervisor_Fields'));

                  const responseSupervisionTracker = await loadDataStore(
                        process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY,
                        null,
                        null,
                        null
                  );

                  const existingConfig = responseSupervisionTracker.find(
                        mapping => mapping.program?.id === formState?.selectedTEIProgram?.id
                  );

                  if (
                        formState?.selectedConfigurationType === DQR &&
                        !formState?.isFieldEditingMode &&
                        existingConfig &&
                        existingConfig.programStageConfigurations
                              ?.map(p => p.programStage?.id)
                              ?.includes(formState?.selectedProgramStageForConfiguration?.id)
                  ) {
                        throw new Error(translate('ProgramStage_Already_Configured'));
                  }

                  if (
                        formState?.selectedConfigurationType === RDQA &&
                        !formState?.isFieldEditingMode &&
                        existingConfig &&
                        existingConfig.programStageConfigurations
                              ?.map(p => p.programStage?.id)
                              ?.includes(formStateForRDQA?.selectedProgramStageForConfiguration?.id)
                  ) {
                        throw new Error(translate('ProgramStage_Already_Configured'));
                  }

                  let newProgramStageConfigurations = [];

                  // Case of DQR
                  if (formState?.selectedConfigurationType === DQR) {
                        newProgramStageConfigurations = existingConfig
                              ? formState?.isFieldEditingMode && currentProgramstageConfiguration
                                    ? programStageConfigurations.map(p => {
                                            if (
                                                  p.programStage?.id ===
                                                  currentProgramstageConfiguration?.programStage?.id
                                            ) {
                                                  return {
                                                        ...p,
                                                        programStage: formState?.selectedProgramStageForConfiguration,
                                                        organisationUnitGroup: formState?.selectedOrganisationUnitGroup,
                                                        supervisorField: formState?.selectedSupervisorDataElements,
                                                        statusSupervisionField:
                                                              formState?.selectedStatusSupervisionDataElement,
                                                        selectedNbrIndicatorsToShow:
                                                              formState.selectedNbrIndicatorsToShow,
                                                        indicators: formState.indicators,
                                                        recoupements: formState.recoupements,
                                                        completeness: formState.completeness,
                                                        consistencyOvertimes: formState.consistencyOvertimes
                                                  };
                                            }

                                            return p;
                                      })
                                    : [
                                            ...existingConfig.programStageConfigurations,
                                            {
                                                  id: uuid(),
                                                  programStage: formState?.selectedProgramStageForConfiguration,
                                                  organisationUnitGroup: formState?.selectedOrganisationUnitGroup,
                                                  supervisorField: formState?.selectedSupervisorDataElements,
                                                  statusSupervisionField:
                                                        formState?.selectedStatusSupervisionDataElement,
                                                  selectedNbrIndicatorsToShow: formState.selectedNbrIndicatorsToShow,
                                                  indicators: formState.indicators,
                                                  recoupements: formState.recoupements,
                                                  completeness: formState.completeness,
                                                  consistencyOvertimes: formState.consistencyOvertimes
                                            }
                                      ]
                              : [
                                      {
                                            id: uuid(),
                                            programStage: formState?.selectedProgramStageForConfiguration,
                                            organisationUnitGroup: formState?.selectedOrganisationUnitGroup,
                                            supervisorField: formState?.selectedSupervisorDataElements,
                                            selectedNbrIndicatorsToShow: formState.selectedNbrIndicatorsToShow,
                                            statusSupervisionField: formState?.selectedStatusSupervisionDataElement,
                                            indicators: formState.indicators,
                                            recoupements: formState.recoupements,
                                            completeness: formState.completeness,
                                            consistencyOvertimes: formState.consistencyOvertimes
                                      }
                                ];
                  }

                  // Case of RDQA
                  if (formState?.selectedConfigurationType === RDQA) {
                        newProgramStageConfigurations = existingConfig
                              ? formState?.isFieldEditingMode && currentProgramstageConfigurationForRDQA
                                    ? programStageConfigurations.map(p => {
                                            if (
                                                  p.programStage?.id ===
                                                  currentProgramstageConfigurationForRDQA?.programStage?.id
                                            ) {
                                                  return {
                                                        ...p,
                                                        programStage:
                                                              formStateForRDQA?.selectedProgramStageForConfiguration,
                                                        organisationUnitGroup:
                                                              formStateForRDQA?.selectedOrganisationUnitGroup,
                                                        supervisorField:
                                                              formStateForRDQA?.selectedSupervisorDataElements,
                                                        statusSupervisionField:
                                                              formStateForRDQA?.selectedStatusSupervisionDataElement,
                                                        indicatorsFieldsConfigs:
                                                              indicatorsFieldsConfigsForRDQA
                                                                    ?.filter(ind => ind.value)
                                                                    .map(ind => ({
                                                                          ...ind,
                                                                          recoupements:
                                                                                ind.recoupements?.filter(
                                                                                      recoup => recoup.value
                                                                                ) || []
                                                                    })) || []
                                                  };
                                            }

                                            return p;
                                      })
                                    : [
                                            ...existingConfig.programStageConfigurations,
                                            {
                                                  id: uuid(),
                                                  programStage: formStateForRDQA?.selectedProgramStageForConfiguration,
                                                  organisationUnitGroup:
                                                        formStateForRDQA?.selectedOrganisationUnitGroup,
                                                  supervisorField: formStateForRDQA?.selectedSupervisorDataElements,
                                                  statusSupervisionField:
                                                        formStateForRDQA?.selectedStatusSupervisionDataElement,
                                                  indicatorsFieldsConfigs:
                                                        indicatorsFieldsConfigsForRDQA
                                                              ?.filter(ind => ind.value)
                                                              .map(ind => ({
                                                                    ...ind,
                                                                    recoupements:
                                                                          ind.recoupements?.filter(
                                                                                recoup => recoup.value
                                                                          ) || []
                                                              })) || []
                                            }
                                      ]
                              : [
                                      {
                                            id: uuid(),
                                            programStage: formStateForRDQA?.selectedProgramStageForConfiguration,
                                            organisationUnitGroup: formStateForRDQA?.selectedOrganisationUnitGroup,
                                            supervisorField: formStateForRDQA?.selectedSupervisorDataElements,
                                            statusSupervisionField:
                                                  formStateForRDQA?.selectedStatusSupervisionDataElement,
                                            indicatorsFieldsConfigs:
                                                  indicatorsFieldsConfigsForRDQA
                                                        ?.filter(ind => ind.value)
                                                        .map(ind => ({
                                                              ...ind,
                                                              recoupements:
                                                                    ind.recoupements?.filter(recoup => recoup.value) ||
                                                                    []
                                                        })) || []
                                      }
                                ];
                  }

                  const payload = {
                        id: uuid(),
                        generationType: formState.selectedSupervisionGenerationType,
                        planificationType: formState.selectedPlanificationType,
                        configurationType: formState.selectedConfigurationType,
                        selectedSupervisionAutoGenerateID:
                              formState?.selectedConfigurationType === DQR
                                    ? formState.selectedSupervisionAutoGenerateID
                                    : formStateForRDQA.selectedSupervisionAutoGenerateID,
                        program: {
                              id: formState.selectedTEIProgram.id,
                              displayName: formState.selectedTEIProgram.displayName
                        },
                        programStageConfigurations: newProgramStageConfigurations.map(p => ({
                              ...p,
                              programStage: p.programStage && {
                                    id: p.programStage.id,
                                    displayName: p.programStage.displayName,
                                    name: p.programStage.name
                              }
                        }))
                  };

                  if (formState?.selectedConfigurationType === DQR) {
                        if (
                              formState.selectedProgramStageForConfiguration &&
                              formState.selectedSupervisorDataElements?.length > 0
                        ) {
                              payload.fieldConfig = {
                                    supervisor: {
                                          programStage: {
                                                id: formState.selectedProgramStageForConfiguration.id,
                                                displayName: formState.selectedProgramStageForConfiguration.displayName
                                          },
                                          dataElements: formState.selectedSupervisorDataElements
                                    }
                              };
                        }

                        if (
                              formState.selectedProgramStageForConfiguration &&
                              formState.selectedStatusSupervisionDataElement
                        ) {
                              payload.statusSupervision = {
                                    programStage: {
                                          id: formState.selectedProgramStageForConfiguration.id,
                                          displayName: formState.selectedProgramStageForConfiguration.displayName
                                    },
                                    dataElement: selectedStatusSupervisionDataElement
                              };
                        }
                  }

                  if (formState?.selectedConfigurationType === RDQA) {
                        if (
                              formStateForRDQA.selectedProgramStageForConfiguration &&
                              formStateForRDQA.selectedSupervisorDataElements?.length > 0
                        ) {
                              payload.fieldConfig = {
                                    supervisor: {
                                          programStage: {
                                                id: formStateForRDQA.selectedProgramStageForConfiguration.id,
                                                displayName:
                                                      formStateForRDQA.selectedProgramStageForConfiguration.displayName
                                          },
                                          dataElements: formStateForRDQA.selectedSupervisorDataElements
                                    }
                              };
                        }

                        if (
                              formStateForRDQA.selectedProgramStageForConfiguration &&
                              formStateForRDQA.selectedStatusSupervisionDataElement
                        ) {
                              payload.statusSupervision = {
                                    programStage: {
                                          id: formStateForRDQA.selectedProgramStageForConfiguration.id,
                                          displayName: formStateForRDQA.selectedProgramStageForConfiguration.displayName
                                    },
                                    dataElement: selectedStatusSupervisionDataElement
                              };
                        }
                  }

                  let newList = [];

                  if (formState.isFieldEditingMode || existingConfig) {
                        newList = mappingConfigSupervisions.map(m => {
                              if (m.id === existingConfig?.id) {
                                    return { ...m, ...payload };
                              }
                              return m;
                        });
                  } else {
                        payload.id = uuid();
                        newList = [...mappingConfigSupervisions, payload];
                  }

                  await saveDataToDataStore(
                        process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY,
                        newList,
                        setLoadingSaveSupervionsConfig,
                        null,
                        null
                  );

                  if (formState?.selectedConfigurationType === DQR) {
                        const newPeriodConfigPayload = {
                              ...dataStorePeriodConfigs,
                              month1KeyWords: periodFormState.month1KeyWords,
                              month2KeyWords: periodFormState.month2KeyWords,
                              month3KeyWords: periodFormState.month3KeyWords
                        };

                        await saveDataToDataStore(
                              process.env.REACT_APP_PERIODS_CONFIG_KEY,
                              newPeriodConfigPayload,
                              null,
                              null,
                              null
                        );
                  }

                  let glabalConfigPayload = {
                        ...dataStoreGlobalSettings
                  };

                  if (formState?.selectedConfigurationType === DQR) {
                        glabalConfigPayload[DQR] = numberOfIndicatorAndRecoupement.DQR;
                  }

                  if (formState?.selectedConfigurationType === RDQA) {
                        glabalConfigPayload[ERDQ] = numberOfIndicatorAndRecoupement.ERDQ;
                  }

                  await saveDataToDataStore(
                        process.env.REACT_APP_GLOBAL_SETTING_KEY,
                        glabalConfigPayload,
                        null,
                        null,
                        null
                  );

                  const responsePeriodConfigs = await loadDataStore(
                        process.env.REACT_APP_PERIODS_CONFIG_KEY,
                        null,
                        null,
                        null
                  );

                  setDataStorePeriodConfigs(responsePeriodConfigs);
                  setMappingConfigSupervisions(newList);
                  setProgramStageConfigurations([]);

                  cleanAllProgramConfigurationStates();

                  setLoadingSaveSupervionsConfig(false);
                  setNotification({
                        show: true,
                        type: NOTIFICATION_SUCCESS,
                        message: formState?.isFieldEditingMode
                              ? translate('Mise_A_Jour_Effectuer')
                              : translate('Configuration_Added_For_Program_stage')
                  });
                  loadDataStoreGlobalSettings();
            } catch (err) {
                  setNotification({
                        show: true,
                        type: NOTIFICATION_CRITICAL,
                        message: err.response?.data?.message || err.message
                  });
                  setLoadingSaveSupervionsConfig(false);
            }
      };

      const handleSaveIndicatorConfig = async () => {
            try {
                  setLoadingSaveIndicatorsConfig(true);
                  if (!indicatorName?.trim()) throw new Error(translate('Nom_Obligatoire'));

                  if (!indicatorEtiquette?.trim()) throw new Error(translate('Etiquette_Obligatoire'));

                  if (indicatorWeight === undefined || indicatorWeight === null)
                        throw new Error(translate('Poid_Obligatoire'));

                  if (indicatorName && indicatorEtiquette) {
                        const existingConfig = mappingConfigs.find(
                              mapping => mapping.indicator?.id === selectedIndicator?.id
                        );

                        if (!currentItem && existingConfig) throw new Error(translate('Indicateur_Deja_Configurer'));

                        const payload = {
                              indicator: selectedIndicator,
                              program: selectedProgram && {
                                    id: selectedProgram.id,
                                    displayName: selectedProgram.displayName
                              },
                              indicatorGroup: selectedIndicatorGroup && {
                                    id: selectedIndicatorGroup.id,
                                    displayName: selectedIndicatorGroup.displayName
                              },
                              nom: indicatorName,
                              etiquette: indicatorEtiquette,
                              weight: indicatorWeight,
                              bestPositive: indicatorBestPositive,
                              indicatorType: selectedIndicatorType
                        };
                        let newList = [];

                        if (currentItem) {
                              newList = mappingConfigs.map(mapConfig => {
                                    if (mapConfig.id === currentItem.id) {
                                          return {
                                                ...mapConfig,
                                                ...payload
                                          };
                                    } else {
                                          return mapConfig;
                                    }
                              });
                        } else {
                              payload.id = uuid();
                              newList = [...mappingConfigs, payload];
                        }

                        await saveDataToDataStore(
                              process.env.REACT_APP_INDICATORS_CONFIG_KEY,
                              newList,
                              setLoadingSaveIndicatorsConfig,
                              null,
                              null
                        );
                        setMappingConfigs(newList);
                        setNotification({
                              show: true,
                              message: !currentItem
                                    ? translate('Configuration_Ajoutee')
                                    : translate('Mise_A_Jour_Succes'),
                              type: NOTIFICATION_SUCCESS
                        });
                        setSelectedIndicator(null);
                        setIndicatorName(null);
                        setIndicatorBestPositive(true);
                        setIndicatorWeight(0);
                        setCurrentItem(null);
                        return setLoadingSaveIndicatorsConfig(false);
                  }
            } catch (err) {
                  setLoadingSaveIndicatorsConfig(false);
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const handleCancelUpdateIndicatorItem = () => {
            setSelectedIndicator(null);
            setIndicatorName(null);
            setIndicatorBestPositive(true);
            setIndicatorWeight(0);
            setCurrentItem(null);
      };

      const handleClickConfigMenu = confValue => {
            confValue === PAGE_CONFIG_INDICATORS && initIndicatorConfigStates();
            confValue === PAGE_CONFIG_SUPERVISION && initSupConfigStates();
            confValue === PAGE_CONFIG_ANALYSE && initAnalyseConfigStates();

            setSelectedTypeSupervisionPage(confValue);
      };

      const handleDeleteAnalyseConfig = async value => {
            try {
                  if (value) {
                        const newList = analyseConfigs.filter(analyseConf => analyseConf.id !== value.id);
                        await saveDataToDataStore(process.env.REACT_APP_ANALYSES_CONFIG_KEY, newList, null, null, null);
                        setAnalyseConfigs(newList);
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

      const handleChangeElementType = ({ value }) => {
            setSelectedAnalyseDataElement(null);
            setSelectedAnalyseIndicator(null);
            setSelectedAnalyseType(value);
      };

      const handleSelectAnalyseDataElement = value => {
            setSelectedAnalyseDataElement(dataElements.find(el => el.id === value));
      };

      const handleSelectAnalyseIndicator = value =>
            setSelectedAnalyseIndicator(indicators.find(ind => ind.id === value));

      const handleSaveAnalyseConfigs = async () => {
            try {
                  setLoadingAddAnalyseConfigs(true);

                  if (selectedAnalyseType === TYPE_ANALYSE_DATA_ELEMENT && !selectedAnalyseDataElement)
                        throw new Error(translate('Element_De_Donner_Obligatoire'));

                  if (selectedAnalyseType === TYPE_ANALYSE_INDICATOR && !selectedAnalyseIndicator)
                        throw new Error(translate('Indicateur_Obligatoire'));

                  const existingConfig = analyseConfigs.find(config => {
                        if (selectedAnalyseType === TYPE_ANALYSE_DATA_ELEMENT) {
                              return config.dataElement?.id === selectedAnalyseDataElement.id;
                        }
                        if (selectedAnalyseType === TYPE_ANALYSE_INDICATOR) {
                              return config.indicator?.id === selectedAnalyseIndicator.id;
                        } else {
                              return false;
                        }
                  });

                  if (!existingConfig) {
                        let payload = {
                              id: uuid(),
                              elementType: selectedAnalyseType
                        };

                        if (selectedAnalyseType === TYPE_ANALYSE_DATA_ELEMENT) {
                              payload.dataElement = {
                                    id: selectedAnalyseDataElement.id,
                                    displayName: selectedAnalyseDataElement.displayName
                              };
                        }

                        if (selectedAnalyseType === TYPE_ANALYSE_INDICATOR) {
                              payload.indicator = {
                                    id: selectedAnalyseIndicator.id,
                                    displayName: selectedAnalyseIndicator.displayName
                              };
                        }

                        const newList = [...analyseConfigs, payload];
                        await saveDataToDataStore(process.env.REACT_APP_ANALYSES_CONFIG_KEY, newList, null, null, null);

                        setAnalyseConfigs(newList);
                        setSelectedAnalyseDataElement(null);
                        setSelectedAnalyseIndicator(null);
                        setNotification({
                              show: true,
                              type: NOTIFICATION_SUCCESS,
                              message: translate('Configuration_Ajoutee')
                        });
                        return setLoadingAddAnalyseConfigs(false);
                  } else {
                        throw new Error(translate('Configuration_Deja_Ajoutee'));
                  }
            } catch (err) {
                  setNotification({
                        show: true,
                        type: NOTIFICATION_CRITICAL,
                        message: err.response?.data?.message || err.message
                  });
                  setLoadingAddAnalyseConfigs(false);
            }
      };

      const handleSelectDataElements = values => {
            setFormState({
                  ...formState,
                  selectedSupervisorDataElements: values.map(value =>
                        formState?.selectedProgramStageForConfiguration.programStageDataElements
                              ?.map(p => p.dataElement)
                              .find(dataElement => dataElement.id === value)
                  )
            });
      };

      const handleSelectDataElementsForRDQA = values => {
            setFormStateForRDQA({
                  ...formStateForRDQA,
                  selectedSupervisorDataElements: values.map(value =>
                        formStateForRDQA?.selectedProgramStageForConfiguration.programStageDataElements
                              ?.map(p => p.dataElement)
                              .find(dataElement => dataElement.id === value)
                  )
            });
      };

      const handleSelectStatutSupervisionDataElement = value => {
            const statusDataElement = formState?.selectedProgramStageForConfiguration?.programStageDataElements
                  ?.map(p => p.dataElement)
                  .find(dataElement => dataElement.id === value);
            setFormState({
                  ...formState,
                  selectedStatusSupervisionDataElement: statusDataElement
            });
      };

      const handleSelectStatutSupervisionDataElementForRDQA = value => {
            const statusDataElement = formStateForRDQA?.selectedProgramStageForConfiguration?.programStageDataElements
                  ?.map(p => p.dataElement)
                  .find(dataElement => dataElement.id === value);
            setFormStateForRDQA({
                  ...formStateForRDQA,
                  selectedStatusSupervisionDataElement: statusDataElement
            });
      };

      const handleSelectProgramStageForConfiguration = value => {
            setFormState({
                  ...formState,
                  selectedStatusSupervisionDataElement: null,
                  selectedNbrIndicatorsToShow: null,
                  selectedSupervisorDataElements: [],
                  selectedProgramStageForConfiguration: programStages.find(pstage => pstage.id === value)
            });
      };
      const handleSelectProgramStageForConfigurationForRDQA = value => {
            setFormStateForRDQA({
                  ...formStateForRDQA,
                  selectedStatusSupervisionDataElement: null,
                  selectedNbrIndicatorsToShow: null,
                  selectedSupervisorDataElements: [],
                  selectedProgramStageForConfiguration: programStages.find(pstage => pstage.id === value)
            });
      };

      const handleSelectOrganisationUnitGroupProgramStage = value => {
            setFormState({
                  ...formState,
                  selectedOrganisationUnitGroup: organisationUnitGroups.find(orgUnitGroup => orgUnitGroup.id === value)
            });
      };

      const handleSelectOrganisationUnitGroupProgramStageForRDQA = value => {
            setFormStateForRDQA({
                  ...formStateForRDQA,
                  selectedOrganisationUnitGroup: organisationUnitGroups.find(orgUnitGroup => orgUnitGroup.id === value)
            });
      };

      const RenderSupervisionConfiguration = () => (
            <>
                  <div
                        className="my-shadow"
                        style={{
                              padding: '20px',
                              background: '#FFF',
                              marginBottom: '2px',
                              borderRadius: '8px'
                        }}
                  >
                        <div>
                              <div style={{ marginBottom: '5px' }}>{translate('Programmes_Tracker')}</div>
                              <Select
                                    options={programs.map(program => ({
                                          label: program.displayName,
                                          value: program.id
                                    }))}
                                    loading={loadingPrograms}
                                    showSearch
                                    placeholder={translate('Programmes_Tracker')}
                                    style={{ width: '100%' }}
                                    optionFilterProp="label"
                                    onChange={handleSelectedTEIProgram}
                                    value={formState?.selectedTEIProgram?.id}
                                    allowClear
                              />
                        </div>
                        <div style={{ marginTop: '20px' }}>
                              <div style={{ marginTop: '5px' }}>
                                    <Radio
                                          label={translate('Generer_Supervision_Comme_TEI')}
                                          onChange={handleSupervisionGenerationType}
                                          value={TYPE_GENERATION_AS_TEI}
                                          checked={
                                                formState?.selectedSupervisionGenerationType === TYPE_GENERATION_AS_TEI
                                          }
                                          disabled={true}
                                    />
                              </div>
                              <div style={{ marginTop: '5px' }}>
                                    <Radio
                                          label={translate('Generer_Supervision_Comme_EN')}
                                          onChange={handleSupervisionGenerationType}
                                          value={TYPE_GENERATION_AS_ENROLMENT}
                                          checked={
                                                formState?.selectedSupervisionGenerationType ===
                                                TYPE_GENERATION_AS_ENROLMENT
                                          }
                                          disabled={true}
                                    />
                              </div>
                              <div style={{ marginTop: '5px' }}>
                                    <Radio
                                          label={translate('Generer_Supervision_Comme_EV')}
                                          onChange={handleSupervisionGenerationType}
                                          value={TYPE_GENERATION_AS_EVENT}
                                          checked={
                                                formState?.selectedSupervisionGenerationType ===
                                                TYPE_GENERATION_AS_EVENT
                                          }
                                    />
                              </div>
                        </div>
                        {formState?.selectedTEIProgram && (
                              <div>
                                    <Divider style={{ margin: '20px 0px' }} />
                                    <div style={{ fontWeight: 'bold' }}>
                                          {translate('Planifier_Sur_OrgUnit_Ou_Agent')}
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                          <div>
                                                <Radio
                                                      label={translate('Unite_Organisation')}
                                                      onChange={handleSupervisionPlanificationType}
                                                      value={ORGANISATION_UNIT}
                                                      checked={
                                                            formState?.selectedPlanificationType === ORGANISATION_UNIT
                                                      }
                                                />
                                          </div>
                                          <div>
                                                <Radio
                                                      label={translate('Agent')}
                                                      onChange={handleSupervisionPlanificationType}
                                                      value={AGENT}
                                                      checked={formState?.selectedPlanificationType === AGENT}
                                                      disabled={true}
                                                />
                                          </div>
                                    </div>
                              </div>
                        )}

                        {formState?.selectedTEIProgram && (
                              <div>
                                    <Divider style={{ margin: '20px 0px' }} />

                                    <div style={{ marginTop: '20px' }}>
                                          <div style={{ marginTop: '5px' }}>
                                                <Radio
                                                      disabled={formState?.isFieldEditingMode}
                                                      label={translate('Configuration_RDQA_Case')}
                                                      onChange={({ value }) =>
                                                            setFormState({
                                                                  ...formState,
                                                                  selectedConfigurationType: value
                                                            })
                                                      }
                                                      value={RDQA}
                                                      checked={formState?.selectedConfigurationType === RDQA}
                                                />
                                          </div>
                                          <div style={{ marginTop: '5px' }}>
                                                <Radio
                                                      disabled={formState?.isFieldEditingMode}
                                                      label={translate('Configuration_DQR_Case')}
                                                      onChange={({ value }) =>
                                                            setFormState({
                                                                  ...formState,
                                                                  selectedConfigurationType: value
                                                            })
                                                      }
                                                      value={DQR}
                                                      checked={formState?.selectedConfigurationType === DQR}
                                                />
                                          </div>
                                    </div>
                              </div>
                        )}
                  </div>
            </>
      );

      const handleEditProgramSup = async prog => {
            try {
                  setProgramStageConfigurations([]);
                  setCurrentProgramstageConfiguration(null);
                  setCurrentProgramstageConfigurationForRDQA(null);

                  if (prog?.configurationType === DQR) {
                        setFormState({
                              ...formState,
                              selectedTEIProgram: programs.find(p => p.id === prog.program?.id),
                              selectedSupervisionGenerationType: prog?.generationType,
                              selectedPlanificationType: prog.planificationType,
                              selectedConfigurationType: prog.configurationType,
                              selectedSupervisionAutoGenerateID: prog.selectedSupervisionAutoGenerateID,
                              isFieldEditingMode: true
                        });
                  }

                  if (prog?.configurationType === RDQA) {
                        setFormState({
                              ...formState,
                              selectedTEIProgram: programs.find(p => p.id === prog.program?.id),
                              selectedSupervisionGenerationType: prog?.generationType,
                              selectedPlanificationType: prog.planificationType,
                              selectedConfigurationType: prog.configurationType,
                              isFieldEditingMode: true
                        });

                        setFormStateForRDQA({
                              ...formStateForRDQA,
                              selectedSupervisionAutoGenerateID: prog.selectedSupervisionAutoGenerateID
                        });
                  }

                  setPeriodFormState(dataStorePeriodConfigs);
                  const progStates = await loadProgramStages(prog?.program?.id);

                  if (progStates?.length === 1) {
                        setUpdateAllFieldsWhenHaveOneStage(true);
                  }

                  setProgramStageConfigurations(prog.programStageConfigurations || []);
                  initialiserNumberOfIndicatorAndRecoupement(dataStoreGlobalSettings);
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const handleEditProgramStageConfigurations = value => {
            try {
                  const foundProgramStage = programStages.find(p => p.id === value.programStage?.id);
                  if (!foundProgramStage) throw new Error('No program stage found ');

                  if (formState?.selectedConfigurationType === DQR) {
                        setFormState({
                              ...formState,
                              selectedProgramStageForConfiguration: foundProgramStage,
                              selectedOrganisationUnitGroup: organisationUnitGroups.find(
                                    orgG => orgG.id === value.organisationUnitGroup?.id
                              ),
                              selectedSupervisorDataElements: value.supervisorField || [],
                              selectedStatusSupervisionDataElement: value.statusSupervisionField,
                              selectedNbrIndicatorsToShow: value.selectedNbrIndicatorsToShow,
                              isFieldEditingMode: true
                        });

                        setCurrentProgramstageConfiguration(value);
                  }

                  if (formState?.selectedConfigurationType === RDQA) {
                        setFormState({
                              ...formState,
                              isFieldEditingMode: true
                        });

                        setFormStateForRDQA({
                              ...formStateForRDQA,
                              selectedProgramStageForConfiguration: foundProgramStage,
                              selectedOrganisationUnitGroup: organisationUnitGroups.find(
                                    orgG => orgG.id === value.organisationUnitGroup?.id
                              ),
                              selectedSupervisorDataElements: value.supervisorField || [],
                              selectedStatusSupervisionDataElement: value.statusSupervisionField
                        });
                        setCurrentProgramstageConfigurationForRDQA(value);
                  }
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const RenderProgramStageConfiguration = () => (
            <div style={{ marginTop: '20px' }}>
                  <Card className="my-shadow" size="small">
                        <div>
                              <div style={{ fontWeight: 'bold' }}>{translate('Program_Stage_Configuration')}</div>
                              <div style={{ marginTop: '10px', color: '#00000070', fontSize: '13px' }}>
                                    {translate('Program_Stage_Configuration_Help')}
                              </div>
                              <div style={{ margin: '10px 0px' }}>
                                    <Row gutter={[10, 10]}>
                                          <Col md={12} sm={24}>
                                                <div>
                                                      <div style={{ marginBottom: '5px' }}>
                                                            {translate('Programmes_Stage')}
                                                      </div>
                                                      <Select
                                                            disabled={
                                                                  loadingProgramStages ||
                                                                  (formState?.isFieldEditingMode &&
                                                                        currentProgramstageConfiguration)
                                                            }
                                                            options={programStages.map(programStage => ({
                                                                  label: programStage.displayName,
                                                                  value: programStage.id
                                                            }))}
                                                            placeholder={translate('Programmes_Stage')}
                                                            style={{ width: '100%' }}
                                                            optionFilterProp="label"
                                                            value={formState?.selectedProgramStageForConfiguration?.id}
                                                            onChange={handleSelectProgramStageForConfiguration}
                                                            showSearch
                                                            allowClear
                                                            loading={loadingProgramStages}
                                                      />
                                                </div>
                                          </Col>

                                          {formState?.selectedProgramStageForConfiguration && (
                                                <Col md={12}>
                                                      <div>
                                                            <div style={{ marginBottom: '5px' }}>
                                                                  {translate('Supervisor_Fields')}
                                                            </div>
                                                            <Select
                                                                  options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                        progStageDE => ({
                                                                              label: progStageDE.dataElement
                                                                                    ?.displayName,
                                                                              value: progStageDE.dataElement?.id
                                                                        })
                                                                  )}
                                                                  showSearch
                                                                  allowClear
                                                                  optionFilterProp="label"
                                                                  placeholder={translate('Element_Donne')}
                                                                  style={{ width: '100%' }}
                                                                  mode="multiple"
                                                                  onChange={handleSelectDataElements}
                                                                  value={formState?.selectedSupervisorDataElements?.map(
                                                                        s => s.id
                                                                  )}
                                                            />
                                                      </div>
                                                </Col>
                                          )}

                                          {formState?.selectedProgramStageForConfiguration && (
                                                <Col md={12}>
                                                      <div>
                                                            <div style={{ marginBottom: '5px' }}>
                                                                  {translate('Supervision_Status_fields')}
                                                            </div>
                                                            <Select
                                                                  options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                        progStageDE => ({
                                                                              label: progStageDE.dataElement
                                                                                    ?.displayName,
                                                                              value: progStageDE.dataElement?.id
                                                                        })
                                                                  )}
                                                                  placeholder={translate('Elements_De_Donnees')}
                                                                  style={{ width: '100%' }}
                                                                  onChange={handleSelectStatutSupervisionDataElement}
                                                                  value={
                                                                        formState?.selectedStatusSupervisionDataElement
                                                                              ?.id
                                                                  }
                                                                  optionFilterProp="label"
                                                                  showSearch
                                                                  allowClear
                                                            />
                                                      </div>
                                                </Col>
                                          )}

                                          <Col md={24}>
                                                <div style={{ marginTop: '20px' }}>
                                                      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                                            <thead>
                                                                  <tr style={{ background: '#ccc' }}>
                                                                        <th
                                                                              style={{
                                                                                    padding: '2px 5px',
                                                                                    textAlign: 'center',
                                                                                    border: '1px solid #00000070'
                                                                              }}
                                                                              colSpan={2}
                                                                        >
                                                                              {translate('Other_Fields')}
                                                                        </th>
                                                                  </tr>
                                                            </thead>
                                                            <tbody>
                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate(
                                                                                    'System_Auto_Generate_Attribute_ID'
                                                                              )}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <Select
                                                                                    options={formState?.selectedTEIProgram?.programTrackedEntityAttributes?.map(
                                                                                          program => ({
                                                                                                label: program
                                                                                                      .trackedEntityAttribute
                                                                                                      ?.displayName,
                                                                                                value: program
                                                                                                      .trackedEntityAttribute
                                                                                                      ?.id
                                                                                          })
                                                                                    )}
                                                                                    placeholder={translate(
                                                                                          'System_Auto_Generate_Attribute_ID'
                                                                                    )}
                                                                                    style={{ width: '100%' }}
                                                                                    onChange={value => {
                                                                                          setFormState({
                                                                                                ...formState,
                                                                                                selectedSupervisionAutoGenerateID:
                                                                                                      formState?.selectedTEIProgram?.programTrackedEntityAttributes
                                                                                                            ?.map(
                                                                                                                  p =>
                                                                                                                        p.trackedEntityAttribute
                                                                                                            )
                                                                                                            .find(
                                                                                                                  attribute =>
                                                                                                                        attribute.id ===
                                                                                                                        value
                                                                                                            )
                                                                                          });
                                                                                    }}
                                                                                    value={
                                                                                          formState
                                                                                                ?.selectedSupervisionAutoGenerateID
                                                                                                ?.id
                                                                                    }
                                                                                    optionFilterProp="label"
                                                                                    showSearch
                                                                                    allowClear
                                                                              />
                                                                        </td>
                                                                  </tr>

                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('How_Many_Indicators')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <Select
                                                                                    options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                                          progStageDE => ({
                                                                                                label: progStageDE
                                                                                                      .dataElement
                                                                                                      ?.displayName,
                                                                                                value: progStageDE
                                                                                                      .dataElement?.id
                                                                                          })
                                                                                    )}
                                                                                    placeholder={translate(
                                                                                          'How_Many_Indicators'
                                                                                    )}
                                                                                    style={{ width: '100%' }}
                                                                                    onChange={value => {
                                                                                          setFormState({
                                                                                                ...formState,
                                                                                                selectedNbrIndicatorsToShow:
                                                                                                      formState?.selectedProgramStageForConfiguration?.programStageDataElements
                                                                                                            ?.map(
                                                                                                                  p =>
                                                                                                                        p.dataElement
                                                                                                            )
                                                                                                            .find(
                                                                                                                  dataElement =>
                                                                                                                        dataElement.id ===
                                                                                                                        value
                                                                                                            )
                                                                                          });
                                                                                    }}
                                                                                    value={
                                                                                          formState
                                                                                                ?.selectedNbrIndicatorsToShow
                                                                                                ?.id
                                                                                    }
                                                                                    optionFilterProp="label"
                                                                                    showSearch
                                                                                    allowClear
                                                                              />
                                                                        </td>
                                                                  </tr>
                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month1')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month1KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month1KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>
                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month2')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month2KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month2KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>
                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month3')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month3KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month3KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>

                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month4')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month4KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month4KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>

                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month5')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month5KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month5KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>

                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month6')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month6KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month6KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>
                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month7')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month7KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month7KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>

                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month7')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month7KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month7KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>

                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month8')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month8KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month8KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>

                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month9')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month9KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month9KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>

                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month10')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month10KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month10KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>

                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month11')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month11KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month11KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>

                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month12')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month12KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month12KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>

                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month13')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month13KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month13KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>

                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month14')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month14KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month14KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>

                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate('Keys_Word_Month15')}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <TagsInput
                                                                                    style={{ width: '100%' }}
                                                                                    value={
                                                                                          periodFormState?.month15KeyWords
                                                                                    }
                                                                                    onChange={word => {
                                                                                          setPeriodFormState({
                                                                                                ...periodFormState,
                                                                                                month15KeyWords: word
                                                                                          });
                                                                                    }}
                                                                              />
                                                                        </td>
                                                                  </tr>
                                                            </tbody>
                                                      </table>
                                                </div>
                                          </Col>
                                    </Row>
                              </div>
                        </div>
                  </Card>
            </div>
      );

      const handleDeleteProgramStageConfiguration = async value => {
            try {
                  const filteredProgramStages = programStageConfigurations.filter(
                        p => p.programStage?.id !== value.programStage?.id
                  );
                  const newList = mappingConfigSupervisions.map(mappingConf => {
                        if (mappingConf.program?.id === formState?.selectedTEIProgram?.id) {
                              return {
                                    ...mappingConf,
                                    programStageConfigurations: filteredProgramStages
                              };
                        }
                        return mappingConf;
                  });

                  await saveDataToDataStore(
                        process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY,
                        newList,
                        setLoadingSaveSupervionsConfig,
                        null,
                        null
                  );

                  setProgramStageConfigurations(filteredProgramStages);
                  setMappingConfigSupervisions(newList);
                  setFormState({
                        ...formState,
                        selectedProgramStageForConfiguration: null,
                        selectedOrganisationUnitGroup: null,
                        selectedStatusSupervisionDataElement: null,
                        selectedSupervisorDataElements: [],
                        isFieldEditingMode: false
                  });
                  setCurrentProgramstageConfiguration(null);

                  setNotification({
                        show: true,
                        type: NOTIFICATION_SUCCESS,
                        message: translate('Configuration_Supprimer')
                  });
            } catch (err) {
                  setNotification({
                        show: true,
                        type: NOTIFICATION_CRITICAL,
                        message: err.response?.data?.message || err.message
                  });
            }
      };
      
      const RenderConfigurationForEachProgramStageList = () =>
            programStageConfigurations.length > 0 && (
                  <div style={{ marginTop: '20px', position: 'sticky', top: 5 }}>
                        <Card className="my-shadow" size="small">
                              <div style={{ marginBottom: '10px' }}>
                                    <span style={{ marginRight: '5px', fontWeight: 'bold' }}>
                                          {translate('Program_Stage_Configuration_List')}
                                    </span>
                                    <span
                                          style={{
                                                backgroundColor: 'orange',
                                                padding: '5px 10px',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                border: '1px solid orange'
                                          }}
                                    >
                                          {formState?.selectedTEIProgram?.displayName}
                                    </span>
                              </div>
                              <Table
                                    dataSource={programStageConfigurations.map(p => ({
                                          ...p,
                                          programStageName: p.programStage?.displayName,
                                          organisationUnitGroupName: p.organisationUnitGroup?.displayName,
                                          action: p
                                    }))}
                                    columns={[
                                          {
                                                title: translate('Program_Stage'),
                                                dataIndex: 'programStageName'
                                          },

                                          {
                                                title: translate('Actions'),
                                                dataIndex: 'action',
                                                width: '80px',
                                                render: value => (
                                                      <div
                                                            style={{
                                                                  display: 'flex',
                                                                  alignItems: 'center'
                                                            }}
                                                      >
                                                            <div style={{ marginRight: '10px' }}>
                                                                  <FiEdit
                                                                        style={{
                                                                              color: BLUE,
                                                                              fontSize: '18px',
                                                                              cursor: 'pointer'
                                                                        }}
                                                                        onClick={() =>
                                                                              handleEditProgramStageConfigurations(
                                                                                    value
                                                                              )
                                                                        }
                                                                  />
                                                            </div>
                                                            {/* <Popconfirm
                                                                  title={translate('Suppression_Configuration')}
                                                                  description={translate(
                                                                        'Confirmation_Suppression_Configuration'
                                                                  )}
                                                                  icon={
                                                                        <QuestionCircleOutlined
                                                                              style={{ color: 'red' }}
                                                                        />
                                                                  }
                                                                  onConfirm={() => {}}
                                                            >
                                                                  <div>
                                                                        <RiDeleteBinLine
                                                                              style={{
                                                                                    color: 'red',
                                                                                    fontSize: '18px',
                                                                                    cursor: 'pointer'
                                                                              }}
                                                                        />
                                                                  </div>
                                                            </Popconfirm> */}
                                                      </div>
                                                )
                                          }
                                    ]}
                                    size="small"
                                    pagination={false}
                                    bordered
                              />
                        </Card>
                  </div>
            );

      const handleEditPaymentConfig = config => {
            setInputFraisMobileMoneyPayment(config.fraisMobileMoney);
            setInputMontantConstantPayment(config.montantConstant);
            setInputLibellePayment(config.libelle);
            setCurrentPaymentConfig(config);
            setEditModePayment(true);
      };

      const handleDeletePaymentConfig = value => {
            cleanPaymentConfigState();
            setPaymentConfigList(paymentConfigList.filter(p => p.id !== value.id));

            return setNotification({
                  show: true,
                  message: translate('Configuration_Supprimer'),
                  type: NOTIFICATION_SUCCESS
            });
      };

      const handleEditVisualizations = value => {
            setCurrentVisualizationConfig(value);
            setFavorisItems(value.visualizations);
            setSelectedProgramForVisualization(value.program);
      };

      const cleanAllVisualizationStates = () => {
            setCurrentVisualizationConfig(null);
            setFavorisItems([]);
            setSelectedProgramForVisualization(null);
            setSelectedMaps([]);
            setSelectedVisualizations([]);
      };

      const handleSaveVisualizationToDataStore = async () => {
            try {
                  setLoadingSaveVisualizationInDatastore(true);

                  if (favorisItems.length > 0) {
                        const listFromDataStore = await loadDataStore(
                              process.env.REACT_APP_VISUALIZATION_KEY,
                              null,
                              null,
                              null
                        );

                        if (
                              listFromDataStore
                                    ?.map(d => d.program?.id)
                                    ?.includes(selectedProgramForVisualization?.id) &&
                              !currentVisualizationConfig
                        ) {
                              throw new Error(translate('Configuration_Deja_Ajoutee'));
                        }

                        const newList = currentVisualizationConfig
                              ? listFromDataStore.map(l => {
                                      if (l.program?.id === currentVisualizationConfig?.program?.id) {
                                            return {
                                                  ...l,
                                                  visualizations: favorisItems
                                            };
                                      }
                                      return l;
                                })
                              : [
                                      {
                                            program: selectedProgramForVisualization && {
                                                  id: selectedProgramForVisualization.id,
                                                  name: selectedProgramForVisualization.name,
                                                  displayName: selectedProgramForVisualization.displayName
                                            },
                                            visualizations: favorisItems
                                      },
                                      ...listFromDataStore
                                ];

                        await saveDataToDataStore(
                              process.env.REACT_APP_VISUALIZATION_KEY,
                              newList,
                              setLoadingSaveVisualizationInDatastore,
                              null,
                              null
                        );

                        await loadDataStoreVisualizations();
                        setNotification({
                              show: true,
                              message: !currentItem
                                    ? translate('Configuration_Ajoutee')
                                    : translate('Mise_A_Jour_Succes'),
                              type: NOTIFICATION_SUCCESS
                        });
                  }

                  setCurrentVisualizationConfig(null);
                  setFavorisItems([]);
                  setLoadingSaveVisualizationInDatastore(false);
                  cleanAllVisualizationStates();
            } catch (err) {
                  setLoadingSaveVisualizationInDatastore(false);
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const RenderIndicatorAndRecoupementConfigFields = () =>
            formState?.selectedProgramStageForConfiguration && (
                  <div style={{ marginTop: '20px' }}>
                        <Card className="my-shadow" size="small">
                              <div>
                                    <div style={{ margin: '20px 0px' }}>
                                          <>
                                                <GenerateIndicatorsFieldsDQR
                                                      formState={formState}
                                                      setFormState={setFormState}
                                                />
                                          </>
                                    </div>
                              </div>
                        </Card>
                  </div>
            );

      const RenderSaveConfigurationButton = () => (
            <div style={{ marginTop: '22px', display: 'flex', alignItems: 'center' }}>
                  {formState?.isFieldEditingMode && (
                        <div style={{ marginRight: '10px' }}>
                              <Button
                                    destructive
                                    onClick={handleCancelSupConfig}
                                    icon={<GiCancel style={{ fontSize: '18px', color: 'white' }} />}
                              >
                                    {translate('Annulée')}
                              </Button>
                        </div>
                  )}

                  <Button
                        disabled={
                              formState?.selectedConfigurationType === DQR
                                    ? formState?.selectedProgramStageForConfiguration
                                          ? false
                                          : true
                                    : formStateForRDQA?.selectedProgramStageForConfiguration
                                    ? false
                                    : true
                        }
                        primary
                        onClick={handleSaveSupConfig}
                        loading={loadingSaveSupervionsConfig}
                        icon={<FiSave style={{ fontSize: '18px', color: '#FFF' }} />}
                  >
                        {formState?.selectedConfigurationType === DQR && currentProgramstageConfiguration
                              ? translate('Mise_A_Jour_Configuration')
                              : formState?.selectedConfigurationType === DQR &&
                                '+ '.concat(translate('AddConfiguration'))}
                        {formState?.selectedConfigurationType === RDQA && currentProgramstageConfigurationForRDQA
                              ? translate('Mise_A_Jour_Configuration')
                              : formState?.selectedConfigurationType === RDQA &&
                                '+ '.concat(translate('AddConfiguration'))}
                  </Button>
            </div>
      );

      const RenderIndicatorAndRecoupementConfigFieldsForRDQA = () =>
            formStateForRDQA?.selectedProgramStageForConfiguration && (
                  <div style={{ marginTop: '20px' }}>
                        <Card className="my-shadow" size="small">
                              <div>
                                    <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                          <span>
                                                {translate(
                                                      'Program_Stage_Configuration_Fields_For_Recoupement_And_Indicator'
                                                )}
                                          </span>
                                          <span
                                                style={{
                                                      background: 'orange',
                                                      padding: '2px 5px',
                                                      marginLeft: '10px',
                                                      color: '#fff'
                                                }}
                                          >
                                                {formStateForRDQA?.selectedProgramStageForConfiguration?.displayName}
                                          </span>
                                    </div>

                                    <div style={{ margin: '10px 0px' }}>
                                          <>
                                                <GenerateIndicatorsFieldsRDQA
                                                      selectedProgramStageForConfiguration={
                                                            formStateForRDQA?.selectedProgramStageForConfiguration
                                                      }
                                                      indicatorsFieldsConfigsForRDQA={indicatorsFieldsConfigsForRDQA}
                                                      setIndicatorsFieldsConfigsForRDQA={
                                                            setIndicatorsFieldsConfigsForRDQA
                                                      }
                                                      formStateForRDQA={formStateForRDQA}
                                                />
                                          </>
                                    </div>
                              </div>
                        </Card>
                  </div>
            );

      const RenderProgramStageConfigurationForRDQA = () => (
            <div style={{ marginTop: '20px' }}>
                  <Card className="my-shadow" size="small">
                        <div>
                              <div style={{ fontWeight: 'bold' }}>{translate('Program_Stage_Configuration')}</div>
                              <div style={{ marginTop: '10px', color: '#00000070', fontSize: '13px' }}>
                                    {translate('Program_Stage_Configuration_Help')}
                              </div>
                              <div style={{ margin: '10px 0px' }}>
                                    <Row gutter={[10, 10]}>
                                          <Col md={12} sm={24}>
                                                <div>
                                                      <div style={{ marginBottom: '5px' }}>
                                                            {translate('Programmes_Stage')}
                                                      </div>
                                                      <Select
                                                            disabled={
                                                                  loadingProgramStages ||
                                                                  (formState?.isFieldEditingMode &&
                                                                        currentProgramstageConfigurationForRDQA)
                                                            }
                                                            options={programStages?.map(programStage => ({
                                                                  label: programStage.displayName,
                                                                  value: programStage.id
                                                            }))}
                                                            placeholder={translate('Programmes_Stage')}
                                                            style={{ width: '100%' }}
                                                            optionFilterProp="label"
                                                            value={
                                                                  formStateForRDQA?.selectedProgramStageForConfiguration
                                                                        ?.id
                                                            }
                                                            onChange={handleSelectProgramStageForConfigurationForRDQA}
                                                            showSearch
                                                            allowClear
                                                            loading={loadingProgramStages}
                                                      />
                                                </div>
                                          </Col>

                                          <Col md={12} sm={24}>
                                                <div>
                                                      <div style={{ marginBottom: '5px' }}>
                                                            {translate('Groupe_Unite_Organisation')}
                                                      </div>
                                                      <Select
                                                            options={organisationUnitGroups?.map(
                                                                  organisationUnitGroup => ({
                                                                        label: organisationUnitGroup.displayName,
                                                                        value: organisationUnitGroup.id
                                                                  })
                                                            )}
                                                            placeholder={translate('Groupe_Unite_Organisation')}
                                                            style={{ width: '100%' }}
                                                            optionFilterProp="label"
                                                            value={formStateForRDQA?.selectedOrganisationUnitGroup?.id}
                                                            onChange={
                                                                  handleSelectOrganisationUnitGroupProgramStageForRDQA
                                                            }
                                                            showSearch
                                                            allowClear
                                                            loading={loadingOrganisationUnitGroups}
                                                            disabled={loadingOrganisationUnitGroups}
                                                      />
                                                </div>
                                          </Col>

                                          {formStateForRDQA?.selectedProgramStageForConfiguration && (
                                                <Col md={12}>
                                                      <div>
                                                            <div style={{ marginBottom: '5px' }}>
                                                                  {translate('Supervisor_Fields')}
                                                            </div>
                                                            <Select
                                                                  options={formStateForRDQA?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                        progStageDE => ({
                                                                              label: progStageDE.dataElement
                                                                                    ?.displayName,
                                                                              value: progStageDE.dataElement?.id
                                                                        })
                                                                  )}
                                                                  showSearch
                                                                  allowClear
                                                                  optionFilterProp="label"
                                                                  placeholder={translate('Element_Donne')}
                                                                  style={{ width: '100%' }}
                                                                  mode="multiple"
                                                                  onChange={handleSelectDataElementsForRDQA}
                                                                  value={formStateForRDQA?.selectedSupervisorDataElements?.map(
                                                                        s => s.id
                                                                  )}
                                                            />
                                                      </div>
                                                </Col>
                                          )}

                                          {formStateForRDQA?.selectedProgramStageForConfiguration && (
                                                <Col md={12}>
                                                      <div>
                                                            <div style={{ marginBottom: '5px' }}>
                                                                  {translate('Supervision_Status_fields')}
                                                            </div>
                                                            <Select
                                                                  options={formStateForRDQA?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                        progStageDE => ({
                                                                              label: progStageDE.dataElement
                                                                                    ?.displayName,
                                                                              value: progStageDE.dataElement?.id
                                                                        })
                                                                  )}
                                                                  placeholder={translate('Elements_De_Donnees')}
                                                                  style={{ width: '100%' }}
                                                                  onChange={
                                                                        handleSelectStatutSupervisionDataElementForRDQA
                                                                  }
                                                                  value={
                                                                        formStateForRDQA
                                                                              ?.selectedStatusSupervisionDataElement?.id
                                                                  }
                                                                  optionFilterProp="label"
                                                                  showSearch
                                                                  allowClear
                                                            />
                                                      </div>
                                                </Col>
                                          )}
                                          <Col md={24}>
                                                <div style={{ marginTop: '20px' }}>
                                                      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                                            <thead>
                                                                  <tr style={{ background: '#ccc' }}>
                                                                        <th
                                                                              style={{
                                                                                    padding: '2px 5px',
                                                                                    textAlign: 'center',
                                                                                    border: '1px solid #00000070'
                                                                              }}
                                                                              colSpan={2}
                                                                        >
                                                                              {translate('Other_Fields')}
                                                                        </th>
                                                                  </tr>
                                                            </thead>
                                                            <tbody>
                                                                  <tr>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top',
                                                                                    width: '50%'
                                                                              }}
                                                                        >
                                                                              {translate(
                                                                                    'System_Auto_Generate_Attribute_ID'
                                                                              )}
                                                                        </td>
                                                                        <td
                                                                              style={{
                                                                                    border: '1px solid #00000070',
                                                                                    padding: '2px 5px',
                                                                                    verticalAlign: 'top'
                                                                              }}
                                                                        >
                                                                              <Select
                                                                                    options={formState?.selectedTEIProgram?.programTrackedEntityAttributes?.map(
                                                                                          program => ({
                                                                                                label: program
                                                                                                      .trackedEntityAttribute
                                                                                                      ?.displayName,
                                                                                                value: program
                                                                                                      .trackedEntityAttribute
                                                                                                      ?.id
                                                                                          })
                                                                                    )}
                                                                                    placeholder={translate(
                                                                                          'System_Auto_Generate_Attribute_ID'
                                                                                    )}
                                                                                    style={{ width: '100%' }}
                                                                                    onChange={value => {
                                                                                          setFormStateForRDQA({
                                                                                                ...formStateForRDQA,
                                                                                                selectedSupervisionAutoGenerateID:
                                                                                                      formState?.selectedTEIProgram?.programTrackedEntityAttributes
                                                                                                            ?.map(
                                                                                                                  p =>
                                                                                                                        p.trackedEntityAttribute
                                                                                                            )
                                                                                                            .find(
                                                                                                                  attribute =>
                                                                                                                        attribute.id ===
                                                                                                                        value
                                                                                                            )
                                                                                          });
                                                                                    }}
                                                                                    value={
                                                                                          formStateForRDQA
                                                                                                ?.selectedSupervisionAutoGenerateID
                                                                                                ?.id
                                                                                    }
                                                                                    optionFilterProp="label"
                                                                                    showSearch
                                                                                    allowClear
                                                                              />
                                                                        </td>
                                                                  </tr>
                                                            </tbody>
                                                      </table>
                                                </div>
                                          </Col>
                                    </Row>
                              </div>
                        </div>
                  </Card>
            </div>
      );

      const RenderNbrOfIndicatorAndRecoupement = () => (
            <div style={{ marginTop: '20px' }}>
                  <Card className="my-shadow" size="small">
                        <div style={{ fontWeight: 'bold' }}>{translate('Number_Of_Indicator_And_Recoupements')}</div>
                        <div
                              style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginTop: '10px'
                              }}
                        >
                              <div style={{ marginRight: '10px', width: '100%' }}>
                                    <div>{translate('Number_Of_Indicator')}</div>
                                    <div>
                                          <Input
                                                style={{ width: '100%' }}
                                                type="number"
                                                onChange={e => {
                                                      if (formState?.selectedConfigurationType === DQR) {
                                                            setNumberOfIndicatorAndRecoupement({
                                                                  ...numberOfIndicatorAndRecoupement,
                                                                  DQR: {
                                                                        ...numberOfIndicatorAndRecoupement.DQR,
                                                                        nbrIndicator: parseInt(e.target.value)
                                                                  }
                                                            });
                                                      }

                                                      if (formState?.selectedConfigurationType === RDQA) {
                                                            setNumberOfIndicatorAndRecoupement({
                                                                  ...numberOfIndicatorAndRecoupement,
                                                                  ERDQ: {
                                                                        ...numberOfIndicatorAndRecoupement.ERDQ,
                                                                        nbrIndicator: parseInt(e.target.value)
                                                                  }
                                                            });
                                                      }
                                                }}
                                                value={
                                                      formState?.selectedConfigurationType === DQR
                                                            ? numberOfIndicatorAndRecoupement?.DQR?.nbrIndicator
                                                            : numberOfIndicatorAndRecoupement?.ERDQ?.nbrIndicator
                                                }
                                                placeholder={translate('Number_Of_Indicator')}
                                          />
                                    </div>
                              </div>
                              <div style={{ width: '100%' }}>
                                    <div>{translate('Number_Of_Recoupement')}</div>
                                    <div>
                                          <Input
                                                type="number"
                                                style={{ width: '100%' }}
                                                onChange={e => {
                                                      if (formState?.selectedConfigurationType === DQR) {
                                                            setNumberOfIndicatorAndRecoupement({
                                                                  ...numberOfIndicatorAndRecoupement,
                                                                  DQR: {
                                                                        ...numberOfIndicatorAndRecoupement.DQR,
                                                                        nbrRecoupement: parseInt(e.target.value)
                                                                  }
                                                            });
                                                      }
                                                      if (formState?.selectedConfigurationType === RDQA) {
                                                            setNumberOfIndicatorAndRecoupement({
                                                                  ...numberOfIndicatorAndRecoupement,
                                                                  ERDQ: {
                                                                        ...numberOfIndicatorAndRecoupement.ERDQ,
                                                                        nbrRecoupement: parseInt(e.target.value)
                                                                  }
                                                            });
                                                      }
                                                }}
                                                value={
                                                      formState?.selectedConfigurationType === DQR
                                                            ? numberOfIndicatorAndRecoupement?.DQR?.nbrRecoupement
                                                            : numberOfIndicatorAndRecoupement?.ERDQ?.nbrRecoupement
                                                }
                                                placeholder={translate('Number_Of_Recoupement')}
                                          />
                                    </div>
                              </div>
                        </div>
                  </Card>
            </div>
      );

      const RenderPageSupervisionConfig = () => (
            <>
                  <Row gutter={[8, 10]}>
                        <Col md={12} sm={24}>
                              <div>
                                    {RenderSupervisionConfiguration()}
                                    {formState?.selectedTEIProgram && (
                                          <div>
                                                {formState?.selectedConfigurationType === DQR ? (
                                                      <>
                                                            {RenderProgramStageConfiguration()}
                                                            {RenderNbrOfIndicatorAndRecoupement()}
                                                            {RenderIndicatorAndRecoupementConfigFields()}
                                                      </>
                                                ) : (
                                                      <>
                                                            {RenderProgramStageConfigurationForRDQA()}
                                                            {RenderNbrOfIndicatorAndRecoupement()}
                                                            {RenderIndicatorAndRecoupementConfigFieldsForRDQA()}
                                                      </>
                                                )}
                                                {RenderSaveConfigurationButton()}
                                          </div>
                                    )}
                              </div>
                        </Col>
                        <Col md={12} sm={24}>
                              {mappingConfigSupervisions.length > 0 && (
                                    <div
                                          className="my-shadow"
                                          style={{
                                                padding: '20px',
                                                background: '#FFF',
                                                marginBottom: '2px',
                                                borderRadius: '8px'
                                          }}
                                    >
                                          <div
                                                style={{
                                                      marginBottom: '10px',
                                                      fontWeight: 'bold',
                                                      fontSize: '16px'
                                                }}
                                          >
                                                {translate('Liste_Programme_Tracker')}
                                          </div>
                                          <Table
                                                dataSource={mappingConfigSupervisions?.map(mapConf => ({
                                                      ...mapConf,
                                                      programName: mapConf?.program?.displayName,
                                                      action: { ...mapConf }
                                                }))}
                                                columns={[
                                                      {
                                                            title: translate('Programme'),
                                                            dataIndex: 'programName'
                                                      },

                                                      {
                                                            title: translate('Type_Strategie'),
                                                            dataIndex: 'generationType',
                                                            render: value => (
                                                                  <>
                                                                        {value === TYPE_GENERATION_AS_ENROLMENT &&
                                                                              translate('Enrolements')}
                                                                        {value === TYPE_GENERATION_AS_EVENT &&
                                                                              translate('Evenements')}
                                                                        {value === TYPE_GENERATION_AS_TEI &&
                                                                              translate('Teis')}
                                                                  </>
                                                            )
                                                      },
                                                      {
                                                            title: translate('Actions'),
                                                            dataIndex: 'action',
                                                            width: '80px',
                                                            render: value => (
                                                                  <div
                                                                        style={{
                                                                              display: 'flex',
                                                                              alignItems: 'center'
                                                                        }}
                                                                  >
                                                                        <div style={{ marginRight: '10px' }}>
                                                                              <FiEdit
                                                                                    style={{
                                                                                          color: BLUE,
                                                                                          fontSize: '18px',
                                                                                          cursor: 'pointer'
                                                                                    }}
                                                                                    onClick={() =>
                                                                                          handleEditProgramSup(value)
                                                                                    }
                                                                              />
                                                                        </div>
                                                                        <Popconfirm
                                                                              title={translate(
                                                                                    'Suppression_Configuration'
                                                                              )}
                                                                              description={translate(
                                                                                    'Confirmation_Suppression_Configuration'
                                                                              )}
                                                                              icon={
                                                                                    <QuestionCircleOutlined
                                                                                          style={{ color: 'red' }}
                                                                                    />
                                                                              }
                                                                              onConfirm={() =>
                                                                                    handleDeleteSupervisionConfig(value)
                                                                              }
                                                                        >
                                                                              <div>
                                                                                    <RiDeleteBinLine
                                                                                          style={{
                                                                                                color: 'red',
                                                                                                fontSize: '18px',
                                                                                                cursor: 'pointer'
                                                                                          }}
                                                                                    />
                                                                              </div>
                                                                        </Popconfirm>
                                                                  </div>
                                                            )
                                                      }
                                                ]}
                                                size="small"
                                          />
                                    </div>
                              )}

                              {RenderConfigurationForEachProgramStageList()}
                        </Col>
                  </Row>
            </>
      );

      const handleAddVisualizationToFavorisList = () => {
            const newFavList = [];
            for (let m of selectedMaps) {
                  if (!newFavList?.map(f => f.id).includes(m.id)) {
                        newFavList.push(m);
                  }
            }

            for (let v of selectedVisualizations) {
                  if (!newFavList?.map(f => f.id).includes(v.id)) {
                        newFavList.push(v);
                  }
            }

            setFavorisItems([...favorisItems, ...newFavList]);
            setSelectedVisualizations([]);
            setSelectedMaps([]);
      };

      const RenderPageVisualizationsConfig = () => (
            <>
                  <Row gutter={[8, 10]}>
                        <Col md={12} sm={24}>
                              <div>
                                    <>
                                          <div
                                                className="my-shadow"
                                                style={{
                                                      padding: '20px',
                                                      background: '#FFF',
                                                      marginBottom: '2px',
                                                      borderRadius: '8px'
                                                }}
                                          >
                                                <div>
                                                      <div style={{ marginBottom: '5px' }}>
                                                            {translate('Programmes_Tracker')}
                                                      </div>
                                                      <Select
                                                            options={programs?.map(program => ({
                                                                  label: program.displayName,
                                                                  value: program.id
                                                            }))}
                                                            loading={loadingPrograms}
                                                            showSearch
                                                            placeholder={translate('Programmes_Tracker')}
                                                            style={{ width: '100%' }}
                                                            optionFilterProp="label"
                                                            onChange={handleSelectedProgramForVisualization}
                                                            value={selectedProgramForVisualization?.id}
                                                            allowClear
                                                      />
                                                </div>
                                                <div style={{ marginTop: '20px' }}>
                                                      <div style={{ marginTop: '5px' }}>
                                                            <Radio
                                                                  label={translate('VisualisationType')}
                                                                  onChange={({ value }) =>
                                                                        setSelectedTypeForVisualization(value)
                                                                  }
                                                                  value="VISUALIZATION"
                                                                  checked={
                                                                        selectedTypeForVisualization === 'VISUALIZATION'
                                                                  }
                                                            />
                                                      </div>
                                                      <div style={{ marginTop: '5px' }}>
                                                            <Radio
                                                                  label={translate('MapType')}
                                                                  onChange={({ value }) =>
                                                                        setSelectedTypeForVisualization(value)
                                                                  }
                                                                  value="MAP"
                                                                  checked={selectedTypeForVisualization === 'MAP'}
                                                            />
                                                      </div>
                                                </div>
                                                {selectedProgramForVisualization && (
                                                      <div style={{ marginTop: '10px' }}>
                                                            {selectedTypeForVisualization === 'VISUALIZATION' && (
                                                                  <div>
                                                                        <div style={{ marginBottom: '5px' }}>
                                                                              {translate('SelectVisualizations')}
                                                                        </div>
                                                                        <Select
                                                                              options={visualizations?.map(vis => ({
                                                                                    label: vis.displayName,
                                                                                    value: vis.id
                                                                              }))}
                                                                              showSearch
                                                                              placeholder={translate(
                                                                                    'SelectVisualizations'
                                                                              )}
                                                                              style={{ width: '100%' }}
                                                                              optionFilterProp="label"
                                                                              onChange={value =>
                                                                                    setSelectedVisualizations(
                                                                                          value?.map(v =>
                                                                                                visualizations.find(
                                                                                                      m => m.id === v
                                                                                                )
                                                                                          )
                                                                                    )
                                                                              }
                                                                              value={selectedVisualizations?.map(
                                                                                    m => m.id
                                                                              )}
                                                                              mode="multiple"
                                                                              allowClear
                                                                        />
                                                                  </div>
                                                            )}
                                                            {selectedTypeForVisualization === 'MAP' && (
                                                                  <div>
                                                                        <div style={{ marginBottom: '5px' }}>
                                                                              {translate('SelectMaps')}
                                                                        </div>
                                                                        <Select
                                                                              options={maps?.map(map => ({
                                                                                    label: map.displayName,
                                                                                    value: map.id
                                                                              }))}
                                                                              showSearch
                                                                              placeholder={translate('SelectMaps')}
                                                                              style={{ width: '100%' }}
                                                                              optionFilterProp="label"
                                                                              onChange={value =>
                                                                                    setSelectedMaps(
                                                                                          value?.map(v =>
                                                                                                maps.find(
                                                                                                      m => m.id === v
                                                                                                )
                                                                                          )
                                                                                    )
                                                                              }
                                                                              value={selectedMaps?.map(m => m.id)}
                                                                              mode="multiple"
                                                                              allowClear
                                                                        />
                                                                  </div>
                                                            )}
                                                      </div>
                                                )}

                                                {(selectedMaps.length > 0 || selectedVisualizations?.length > 0) && (
                                                      <div style={{ marginTop: '10px' }}>
                                                            <Button
                                                                  primary
                                                                  onClick={handleAddVisualizationToFavorisList}
                                                            >
                                                                  +{translate('Ajouter')}
                                                            </Button>
                                                      </div>
                                                )}
                                          </div>
                                    </>

                                    {selectedTypeForVisualization && favorisItems.length > 0 && (
                                          <>
                                                <div
                                                      className="my-shadow"
                                                      style={{
                                                            padding: '20px',
                                                            background: '#FFF',
                                                            marginBottom: '2px',
                                                            borderRadius: '8px',
                                                            marginTop: '10px'
                                                      }}
                                                >
                                                      <Table
                                                            bordered
                                                            size="small"
                                                            pagination={false}
                                                            dataSource={favorisItems?.map(f => ({
                                                                  ...f,
                                                                  action: f.id
                                                            }))}
                                                            columns={[
                                                                  {
                                                                        title: translate('Favoris'),
                                                                        dataIndex: 'displayName'
                                                                  },
                                                                  {
                                                                        title: translate('Type'),
                                                                        dataIndex: 'type'
                                                                  },
                                                                  {
                                                                        title: translate('Actions'),
                                                                        dataIndex: 'action',
                                                                        render: value => (
                                                                              <div>
                                                                                    <Popconfirm
                                                                                          title={translate(
                                                                                                'Suppression'
                                                                                          )}
                                                                                          description={translate(
                                                                                                'Confirmation_Suppression_Configuration'
                                                                                          )}
                                                                                          icon={
                                                                                                <QuestionCircleOutlined
                                                                                                      style={{
                                                                                                            color: 'red'
                                                                                                      }}
                                                                                                />
                                                                                          }
                                                                                          onConfirm={() =>
                                                                                                handleDeleteVisualizationConfig(
                                                                                                      value
                                                                                                )
                                                                                          }
                                                                                    >
                                                                                          <div>
                                                                                                <RiDeleteBinLine
                                                                                                      style={{
                                                                                                            color: 'red',
                                                                                                            fontSize: '18px',
                                                                                                            cursor: 'pointer'
                                                                                                      }}
                                                                                                />
                                                                                          </div>
                                                                                    </Popconfirm>
                                                                              </div>
                                                                        )
                                                                  }
                                                            ]}
                                                      />
                                                </div>

                                                <div
                                                      style={{
                                                            marginTop: '10px',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                      }}
                                                >
                                                      <Button
                                                            icon={
                                                                  <FiSave style={{ color: '#FFF', fontSize: '18px' }} />
                                                            }
                                                            destructive
                                                            onClick={() => {
                                                                  cleanAllVisualizationStates();
                                                            }}
                                                      >
                                                            {translate('Annuler')}
                                                      </Button>
                                                      <div style={{ marginLeft: '10px' }}>
                                                            <Button
                                                                  icon={
                                                                        <FiSave
                                                                              style={{
                                                                                    color: '#FFF',
                                                                                    fontSize: '18px'
                                                                              }}
                                                                        />
                                                                  }
                                                                  primary
                                                                  loading={loadingSaveVisualizationInDatastore}
                                                                  onClick={handleSaveVisualizationToDataStore}
                                                            >
                                                                  {formState?.isFieldEditingMode && (
                                                                        <span>{translate('Mise_A_Jour')}</span>
                                                                  )}
                                                                  {!formState?.isFieldEditingMode && (
                                                                        <span>{translate('Enregistrer')}</span>
                                                                  )}
                                                            </Button>
                                                      </div>
                                                </div>
                                          </>
                                    )}
                              </div>
                        </Col>
                        <Col md={12} sm={24}>
                              {mappingConfigSupervisions.length > 0 && (
                                    <div
                                          className="my-shadow"
                                          style={{
                                                padding: '20px',
                                                background: '#FFF',
                                                marginBottom: '2px',
                                                borderRadius: '8px'
                                          }}
                                    >
                                          <div
                                                style={{
                                                      marginBottom: '10px',
                                                      fontWeight: 'bold',
                                                      fontSize: '16px'
                                                }}
                                          >
                                                {translate('Visualization_Configurations')}
                                          </div>
                                          <Table
                                                dataSource={dataStoreVisualizations?.map(fav => ({
                                                      ...fav,
                                                      programName: fav?.program?.displayName,
                                                      nbrVisualizations: fav?.visualizations?.length || 0,
                                                      action: fav
                                                }))}
                                                columns={[
                                                      {
                                                            title: translate('Programme'),
                                                            dataIndex: 'programName'
                                                      },

                                                      {
                                                            title: translate('Visualizations'),
                                                            dataIndex: 'nbrVisualizations'
                                                      },
                                                      {
                                                            title: translate('Actions'),
                                                            dataIndex: 'action',
                                                            width: '80px',
                                                            render: value => (
                                                                  <div
                                                                        style={{
                                                                              display: 'flex',
                                                                              alignItems: 'center'
                                                                        }}
                                                                  >
                                                                        <div style={{ marginRight: '10px' }}>
                                                                              <FiEdit
                                                                                    style={{
                                                                                          color: BLUE,
                                                                                          fontSize: '18px',
                                                                                          cursor: 'pointer'
                                                                                    }}
                                                                                    onClick={() =>
                                                                                          handleEditVisualizations(
                                                                                                value
                                                                                          )
                                                                                    }
                                                                              />
                                                                        </div>
                                                                        <Popconfirm
                                                                              title={translate(
                                                                                    'Suppression_Configuration'
                                                                              )}
                                                                              description={translate(
                                                                                    'Confirmation_Suppression_Configuration'
                                                                              )}
                                                                              icon={
                                                                                    <QuestionCircleOutlined
                                                                                          style={{ color: 'red' }}
                                                                                    />
                                                                              }
                                                                              onConfirm={() =>
                                                                                    handleDeleteVisatualizationProgramConfig(
                                                                                          value
                                                                                    )
                                                                              }
                                                                        >
                                                                              <div>
                                                                                    <RiDeleteBinLine
                                                                                          style={{
                                                                                                color: 'red',
                                                                                                fontSize: '18px',
                                                                                                cursor: 'pointer'
                                                                                          }}
                                                                                    />
                                                                              </div>
                                                                        </Popconfirm>
                                                                  </div>
                                                            )
                                                      }
                                                ]}
                                                size="small"
                                          />
                                    </div>
                              )}

                              {selectedPlanificationType === AGENT &&
                                    selectedTEIProgram &&
                                    paymentConfigList.length > 0 && (
                                          <div
                                                className="my-shadow"
                                                style={{
                                                      padding: '20px',
                                                      marginTop: '10px',
                                                      background: '#FFF',
                                                      marginBottom: '2px',
                                                      borderRadius: '8px'
                                                }}
                                          >
                                                <div
                                                      style={{
                                                            marginBottom: '10px',
                                                            fontWeight: 'bold',
                                                            fontSize: '16px'
                                                      }}
                                                >
                                                      {translate('Liste_Config_Paiement')}
                                                </div>
                                                <Table
                                                      dataSource={paymentConfigList?.map(conf => ({
                                                            ...conf,
                                                            programName: conf.program?.displayName,
                                                            action: conf
                                                      }))}
                                                      columns={[
                                                            { title: translate('Programme'), dataIndex: 'programName' },

                                                            { title: translate('Libelle'), dataIndex: 'libelle' },
                                                            {
                                                                  title: translate('Montant_Constant'),
                                                                  dataIndex: 'montantConstant'
                                                            },
                                                            {
                                                                  title: translate('Frais_Mobile_Money'),
                                                                  dataIndex: 'fraisMobileMoney'
                                                            },
                                                            {
                                                                  title: translate('Actions'),
                                                                  dataIndex: 'action',
                                                                  width: '80px',
                                                                  render: value => (
                                                                        <div
                                                                              style={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center'
                                                                              }}
                                                                        >
                                                                              <div style={{ marginRight: '10px' }}>
                                                                                    <FiEdit
                                                                                          style={{
                                                                                                color: BLUE,
                                                                                                fontSize: '18px',
                                                                                                cursor: 'pointer'
                                                                                          }}
                                                                                          onClick={() =>
                                                                                                handleEditPaymentConfig(
                                                                                                      value
                                                                                                )
                                                                                          }
                                                                                    />
                                                                              </div>
                                                                              <Popconfirm
                                                                                    title={translate(
                                                                                          'Suppression_Configuration'
                                                                                    )}
                                                                                    description={translate(
                                                                                          'Confirmation_Suppression_Configuration'
                                                                                    )}
                                                                                    icon={
                                                                                          <QuestionCircleOutlined
                                                                                                style={{ color: 'red' }}
                                                                                          />
                                                                                    }
                                                                                    onConfirm={() =>
                                                                                          handleDeletePaymentConfig(
                                                                                                value
                                                                                          )
                                                                                    }
                                                                              >
                                                                                    <div>
                                                                                          <RiDeleteBinLine
                                                                                                style={{
                                                                                                      color: 'red',
                                                                                                      fontSize: '18px',
                                                                                                      cursor: 'pointer'
                                                                                                }}
                                                                                          />
                                                                                    </div>
                                                                              </Popconfirm>
                                                                        </div>
                                                                  )
                                                            }
                                                      ]}
                                                      size="small"
                                                />
                                          </div>
                                    )}
                        </Col>
                  </Row>
            </>
      );

      const RenderTopContent = () => (
            <>
                  <div
                        style={{
                              padding: '20px',
                              borderBottom: '1px solid #ccc',
                              background: '#FFF'
                        }}
                  >
                        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                              {translate('Parametre_De_Configuration')}
                        </span>
                  </div>
            </>
      );

      const RenderUserAuthorizationContent = () => <div>User authorizations content</div>;

      const RenderPageIndicatorConfig = () => (
            <>
                  <Row gutter={[8, 10]}>
                        <Col md={12} sm={24}>
                              <div
                                    className="my-shadow"
                                    style={{
                                          padding: '20px',
                                          background: '#FFF',
                                          marginBottom: '2px',
                                          borderRadius: '8px'
                                    }}
                              >
                                    <div>
                                          <Row gutter={[8, 8]}>
                                                <Col md={24}>
                                                      <div style={{ marginBottom: '5px' }}>
                                                            {translate('Type_Indicateur')}
                                                      </div>
                                                </Col>
                                                <Col>
                                                      <div>
                                                            <Radio
                                                                  label={translate('Indicateurs_Aggreges')}
                                                                  onChange={handleChangeIndicatorConfigType}
                                                                  value={AGGREGATE_INDICATOR}
                                                                  checked={
                                                                        selectedIndicatorType === AGGREGATE_INDICATOR
                                                                  }
                                                                  disabled={currentItem ? true : false}
                                                            />
                                                      </div>
                                                </Col>
                                                <Col>
                                                      <div>
                                                            <Radio
                                                                  label={translate('Indicateurs_Programmes')}
                                                                  onChange={handleChangeIndicatorConfigType}
                                                                  value={PROGRAM_INDICATOR}
                                                                  checked={selectedIndicatorType === PROGRAM_INDICATOR}
                                                                  disabled={currentItem ? true : false}
                                                            />
                                                      </div>
                                                </Col>
                                          </Row>
                                    </div>

                                    {selectedIndicatorType === AGGREGATE_INDICATOR && (
                                          <div style={{ marginTop: '20px' }}>
                                                <Row gutter={[8, 8]}>
                                                      <Col md={12} sm={24}>
                                                            <div>
                                                                  <div style={{ marginBottom: '5px' }}>
                                                                        {translate('Groupe_Indicateurs')}
                                                                  </div>
                                                                  <Select
                                                                        options={indicatorGroups?.map(
                                                                              indicateurGroup => ({
                                                                                    label: indicateurGroup.displayName,
                                                                                    value: indicateurGroup.id
                                                                              })
                                                                        )}
                                                                        placeholder={translate('Groupe_Indicateurs')}
                                                                        style={{ width: '100%' }}
                                                                        onChange={handleSelectIndicatorGroupIND}
                                                                        value={selectedIndicatorGroup?.id}
                                                                        optionFilterProp="label"
                                                                        showSearch
                                                                        allowClear
                                                                        loading={loadingIndicatorGroups}
                                                                        disabled={loadingIndicatorGroups}
                                                                  />
                                                            </div>
                                                      </Col>

                                                      {selectedIndicatorGroup && (
                                                            <Col md={12} sm={24}>
                                                                  <div>
                                                                        <div style={{ marginBottom: '5px' }}>
                                                                              {translate('Indicateurs')}
                                                                        </div>
                                                                        <Select
                                                                              options={selectedIndicatorGroup.indicators?.map(
                                                                                    progInd => ({
                                                                                          label: progInd.displayName,
                                                                                          value: progInd.id
                                                                                    })
                                                                              )}
                                                                              placeholder={translate('Indicateurs')}
                                                                              style={{ width: '100%' }}
                                                                              onChange={handleSelectIndicatorIND}
                                                                              value={selectedIndicator?.id}
                                                                              optionFilterProp="label"
                                                                              showSearch
                                                                              allowClear
                                                                        />
                                                                  </div>
                                                            </Col>
                                                      )}
                                                </Row>
                                          </div>
                                    )}

                                    {selectedIndicatorType === PROGRAM_INDICATOR && (
                                          <div style={{ marginTop: '20px' }}>
                                                <Row gutter={[8, 8]}>
                                                      <Col md={12} sm={24}>
                                                            <div>
                                                                  <div style={{ marginBottom: '5px' }}>
                                                                        {translate('Programmes')}
                                                                  </div>
                                                                  <Select
                                                                        options={programs?.map(program => ({
                                                                              label: program.displayName,
                                                                              value: program.id
                                                                        }))}
                                                                        placeholder={translate('Programmes')}
                                                                        style={{ width: '100%' }}
                                                                        onChange={handleSelectProgramIND}
                                                                        value={selectedProgram?.id}
                                                                        optionFilterProp="label"
                                                                        showSearch
                                                                        loading={loadingPrograms}
                                                                        disabled={loadingPrograms}
                                                                        allowClear
                                                                  />
                                                            </div>
                                                      </Col>

                                                      {selectedProgram && (
                                                            <Col md={12} sm={24}>
                                                                  <div>
                                                                        <div style={{ marginBottom: '5px' }}>
                                                                              {translate('Indicateurs')}
                                                                        </div>
                                                                        <Select
                                                                              options={selectedProgram.programIndicators?.map(
                                                                                    progInd => ({
                                                                                          label: progInd.displayName,
                                                                                          value: progInd.id
                                                                                    })
                                                                              )}
                                                                              placeholder={translate('Indicateurs')}
                                                                              style={{ width: '100%' }}
                                                                              onChange={handleSelectIndicatorIND}
                                                                              value={selectedIndicator?.id}
                                                                              optionFilterProp="label"
                                                                              showSearch
                                                                              allowClear
                                                                        />
                                                                  </div>
                                                            </Col>
                                                      )}
                                                </Row>
                                          </div>
                                    )}
                              </div>
                              {selectedIndicator && (
                                    <div
                                          className="my-shadow"
                                          style={{
                                                padding: '20px',
                                                background: '#FFF',
                                                marginBottom: '2px',
                                                borderRadius: '8px',
                                                marginTop: '10px'
                                          }}
                                    >
                                          <Row gutter={[15, 15]}>
                                                <Col md={12} sm={24}>
                                                      <div style={{ marginBottom: '5px' }}>{translate('Nom')}</div>
                                                      <Input name="indicatorName" value={indicatorName} disabled />
                                                </Col>
                                                <Col md={12} sm={24}>
                                                      <div style={{ marginBottom: '5px' }}>
                                                            {translate('Etiquette')}
                                                      </div>
                                                      <Input
                                                            name="indicatorName"
                                                            value={indicatorEtiquette}
                                                            onChange={event =>
                                                                  setIndicatorEtiquette(''.concat(event.target.value))
                                                            }
                                                      />
                                                </Col>
                                                <Col md={12} sm={24}>
                                                      <div style={{ marginBottom: '5px' }}>{translate('Poids')}</div>
                                                      <InputNumber
                                                            style={{ width: '100%' }}
                                                            name="indicatorName"
                                                            value={indicatorWeight}
                                                            onChange={event => setIndicatorWeight(event)}
                                                      />
                                                </Col>
                                                <Col md={12}>
                                                      <div
                                                            style={{
                                                                  display: 'flex',
                                                                  alignItems: 'center',
                                                                  marginTop: '25px'
                                                            }}
                                                      >
                                                            <Checkbox
                                                                  checked={indicatorBestPositive}
                                                                  onChange={() =>
                                                                        setIndicatorBestPositive(!indicatorBestPositive)
                                                                  }
                                                            />
                                                            <span style={{ marginLeft: '10px' }}>
                                                                  {' '}
                                                                  {translate('Meilleur_Positif')}
                                                            </span>
                                                      </div>
                                                </Col>

                                                <Col md={24}>
                                                      <Divider style={{ margin: '10px auto' }} />
                                                </Col>

                                                <Col md={24}>
                                                      <div style={{ display: 'flex', width: '100%' }}>
                                                            {!currentItem && (
                                                                  <div>
                                                                        <Button
                                                                              icon={
                                                                                    <FiSave
                                                                                          style={{
                                                                                                color: '#FFF',
                                                                                                fontSize: '18px'
                                                                                          }}
                                                                                    />
                                                                              }
                                                                              primary
                                                                              onClick={handleSaveIndicatorConfig}
                                                                              loading={loadingSaveIndicatorsConfig}
                                                                              disabled={loadingSaveIndicatorsConfig}
                                                                        >
                                                                              {translate('Enregistrer')}
                                                                        </Button>
                                                                  </div>
                                                            )}

                                                            {currentItem && (
                                                                  <div style={{ marginRight: '10px' }}>
                                                                        <Button
                                                                              icon={
                                                                                    <MdOutlineCancel
                                                                                          style={{
                                                                                                color: '#FFF',
                                                                                                fontSize: '18px'
                                                                                          }}
                                                                                    />
                                                                              }
                                                                              onClick={handleCancelUpdateIndicatorItem}
                                                                              destructive
                                                                        >
                                                                              {translate('Annuler')}
                                                                        </Button>
                                                                  </div>
                                                            )}

                                                            {currentItem && (
                                                                  <div>
                                                                        <Button
                                                                              icon={
                                                                                    <FiEdit
                                                                                          style={{
                                                                                                color: '#FFF',
                                                                                                fontSize: '18px'
                                                                                          }}
                                                                                    />
                                                                              }
                                                                              onClick={handleSaveIndicatorConfig}
                                                                              loading={loadingSaveIndicatorsConfig}
                                                                              disabled={loadingSaveIndicatorsConfig}
                                                                              primary
                                                                        >
                                                                              {translate('Mise_A_Jour')}
                                                                        </Button>
                                                                  </div>
                                                            )}
                                                      </div>
                                                </Col>
                                          </Row>
                                    </div>
                              )}
                        </Col>

                        <Col md={12} sm={24}>
                              {mappingConfigs.length > 0 && (
                                    <div
                                          className="my-shadow"
                                          style={{
                                                padding: '20px',
                                                background: '#FFF',
                                                marginBottom: '2px',
                                                borderRadius: '8px'
                                          }}
                                    >
                                          <div
                                                style={{
                                                      marginBottom: '10px',
                                                      fontWeight: 'bold',
                                                      fontSize: '16px'
                                                }}
                                          >
                                                {translate('Liste_Indicateurs_Configurer')}
                                          </div>
                                          <Table
                                                dataSource={mappingConfigs?.map(mapConf => ({
                                                      ...mapConf,
                                                      action: { ...mapConf }
                                                }))}
                                                columns={[
                                                      {
                                                            title: translate('Indicateurs'),
                                                            dataIndex: 'nom'
                                                      },
                                                      {
                                                            title: translate('Poids'),
                                                            dataIndex: 'weight'
                                                      },
                                                      {
                                                            title: translate('Type_Indicateur'),
                                                            dataIndex: 'indicatorType',
                                                            render: value => (
                                                                  <>
                                                                        {value === AGGREGATE_INDICATOR &&
                                                                              translate('Agregee')}
                                                                        {value === PROGRAM_INDICATOR &&
                                                                              translate('Indicateur_Programme')}
                                                                  </>
                                                            )
                                                      },
                                                      {
                                                            title: translate('Actions'),
                                                            dataIndex: 'action',
                                                            width: '80px',
                                                            render: value => (
                                                                  <>
                                                                        <div
                                                                              style={{
                                                                                    display: 'flex',
                                                                                    justifyContent: 'center'
                                                                              }}
                                                                        >
                                                                              <FiEdit
                                                                                    style={{
                                                                                          color: BLUE,
                                                                                          fontSize: '15px',
                                                                                          cursor: 'pointer'
                                                                                    }}
                                                                                    onClick={() =>
                                                                                          handleUpdateBtnClicked(value)
                                                                                    }
                                                                              />
                                                                              <Popconfirm
                                                                                    title={translate(
                                                                                          'Suppression_Configuration'
                                                                                    )}
                                                                                    description={translate(
                                                                                          'Confirmation_Suppression_Configuration'
                                                                                    )}
                                                                                    icon={
                                                                                          <QuestionCircleOutlined
                                                                                                style={{ color: 'red' }}
                                                                                          />
                                                                                    }
                                                                                    onConfirm={() =>
                                                                                          handleDeleteConfigItem(value)
                                                                                    }
                                                                              >
                                                                                    <RiDeleteBinLine
                                                                                          style={{
                                                                                                color: 'red',
                                                                                                fontSize: '16px',
                                                                                                cursor: 'pointer',
                                                                                                marginLeft: '5px'
                                                                                          }}
                                                                                    />
                                                                              </Popconfirm>
                                                                        </div>
                                                                  </>
                                                            )
                                                      }
                                                ]}
                                                size="small"
                                          />
                                    </div>
                              )}
                        </Col>
                  </Row>
            </>
      );

      const RenderPageAnalyseConfig = () => (
            <>
                  <Row gutter={[8, 10]}>
                        <Col md={12} sm={24}>
                              <div
                                    className="my-shadow"
                                    style={{
                                          padding: '20px',
                                          background: '#FFF',
                                          marginBottom: '2px',
                                          borderRadius: '8px',
                                          position: 'sticky',
                                          top: 30
                                    }}
                              >
                                    <div>
                                          <Row gutter={[8, 8]}>
                                                <Col md={24}>
                                                      <div style={{ marginBottom: '5px' }}>
                                                            {translate('Type_Element')}
                                                      </div>
                                                </Col>
                                                <Col>
                                                      <div>
                                                            <Radio
                                                                  label={translate('Element_De_Donnee')}
                                                                  onChange={handleChangeElementType}
                                                                  value={TYPE_ANALYSE_DATA_ELEMENT}
                                                                  checked={
                                                                        selectedAnalyseType ===
                                                                        TYPE_ANALYSE_DATA_ELEMENT
                                                                  }
                                                            />
                                                      </div>
                                                </Col>
                                                <Col>
                                                      <div>
                                                            <Radio
                                                                  label={translate('Indicateurs')}
                                                                  onChange={handleChangeElementType}
                                                                  value={TYPE_ANALYSE_INDICATOR}
                                                                  checked={
                                                                        selectedAnalyseType === TYPE_ANALYSE_INDICATOR
                                                                  }
                                                            />
                                                      </div>
                                                </Col>
                                          </Row>
                                    </div>

                                    <div style={{ marginTop: '20px' }}>
                                          <Row gutter={[10, 10]}>
                                                <Col md={18} xs={24}>
                                                      {selectedAnalyseType === TYPE_ANALYSE_DATA_ELEMENT && (
                                                            <div>
                                                                  <div style={{ marginBottom: '5px' }}>
                                                                        {translate('Element_De_Donnee')}
                                                                  </div>
                                                                  <Select
                                                                        options={dataElements?.map(dataElement => ({
                                                                              label: dataElement.displayName,
                                                                              value: dataElement.id
                                                                        }))}
                                                                        placeholder={translate('Element_De_Donnee')}
                                                                        style={{ width: '100%' }}
                                                                        onChange={handleSelectAnalyseDataElement}
                                                                        value={selectedAnalyseDataElement?.id}
                                                                        optionFilterProp="label"
                                                                        showSearch
                                                                        loading={loadingDataElements}
                                                                        disabled={loadingDataElements}
                                                                        allowClear
                                                                  />
                                                            </div>
                                                      )}
                                                      {selectedAnalyseType === TYPE_ANALYSE_INDICATOR && (
                                                            <div>
                                                                  <div style={{ marginBottom: '5px' }}>
                                                                        {translate('Indicateurs')}
                                                                  </div>
                                                                  <Select
                                                                        options={indicators?.map(ind => ({
                                                                              value: ind.id,
                                                                              label: ind.displayName
                                                                        }))}
                                                                        placeholder={translate('Indicateurs')}
                                                                        style={{ width: '100%' }}
                                                                        onChange={handleSelectAnalyseIndicator}
                                                                        value={selectedAnalyseIndicator?.id}
                                                                        optionFilterProp="label"
                                                                        showSearch
                                                                        disabled={loadingIndicators}
                                                                        loading={loadingIndicators}
                                                                        allowClear
                                                                  />
                                                            </div>
                                                      )}
                                                </Col>
                                                <Col md={6} xs={24}>
                                                      {selectedAnalyseDataElement || selectedAnalyseIndicator ? (
                                                            <div style={{ marginTop: '18px' }}>
                                                                  <Button
                                                                        loading={loadingAddAnalyseConfigs}
                                                                        disabled={loadingAddAnalyseConfigs}
                                                                        primary
                                                                        onClick={handleSaveAnalyseConfigs}
                                                                  >
                                                                        + {translate('Ajouter')}
                                                                  </Button>
                                                            </div>
                                                      ) : (
                                                            <></>
                                                      )}
                                                </Col>
                                          </Row>
                                    </div>
                              </div>
                        </Col>

                        <Col md={12} sm={24}>
                              {analyseConfigs.length > 0 && (
                                    <div
                                          className="my-shadow"
                                          style={{
                                                padding: '20px',
                                                background: '#FFF',
                                                marginBottom: '2px',
                                                borderRadius: '8px'
                                          }}
                                    >
                                          <div
                                                style={{
                                                      marginBottom: '10px',
                                                      fontWeight: 'bold',
                                                      fontSize: '16px'
                                                }}
                                          >
                                                {translate('Liste_Element_Configurer')}{' '}
                                          </div>
                                          <Table
                                                dataSource={analyseConfigs?.map(config => ({
                                                      ...config,
                                                      nom:
                                                            config.elementType === TYPE_ANALYSE_DATA_ELEMENT
                                                                  ? config?.dataElement?.displayName
                                                                  : config?.indicator?.displayName,
                                                      elementType: config.elementType,
                                                      action: { ...config }
                                                }))}
                                                columns={[
                                                      {
                                                            title: translate('Nom'),
                                                            dataIndex: 'nom'
                                                      },
                                                      {
                                                            title: translate('Type'),
                                                            dataIndex: 'elementType',
                                                            render: value => (
                                                                  <>
                                                                        {value === TYPE_ANALYSE_DATA_ELEMENT &&
                                                                              translate('Element_De_Donnee')}
                                                                        {value === TYPE_ANALYSE_INDICATOR &&
                                                                              translate('Indicateur')}
                                                                  </>
                                                            )
                                                      },
                                                      {
                                                            title: translate('Actions'),
                                                            dataIndex: 'action',
                                                            width: '80px',
                                                            render: value => (
                                                                  <>
                                                                        <div
                                                                              style={{
                                                                                    display: 'flex',
                                                                                    justifyContent: 'center'
                                                                              }}
                                                                        >
                                                                              <Popconfirm
                                                                                    title={translate(
                                                                                          'Suppression_Configuration'
                                                                                    )}
                                                                                    description={translate(
                                                                                          'Confirmation_Suppression_Configuration'
                                                                                    )}
                                                                                    icon={
                                                                                          <QuestionCircleOutlined
                                                                                                style={{ color: 'red' }}
                                                                                          />
                                                                                    }
                                                                                    onConfirm={() =>
                                                                                          handleDeleteAnalyseConfig(
                                                                                                value
                                                                                          )
                                                                                    }
                                                                              >
                                                                                    <RiDeleteBinLine
                                                                                          style={{
                                                                                                color: 'red',
                                                                                                fontSize: '16px',
                                                                                                cursor: 'pointer',
                                                                                                marginLeft: '5px'
                                                                                          }}
                                                                                    />
                                                                              </Popconfirm>
                                                                        </div>
                                                                  </>
                                                            )
                                                      }
                                                ]}
                                                size="small"
                                          />
                                    </div>
                              )}
                        </Col>
                  </Row>
            </>
      );

      const RenderPageIndicatorsMapping = () => (
            <div>
                  <SettingIndicatorsMapping />
            </div>
      );

      const RenderTypeSupervisionContent = () => (
            <div>
                  <Row gutter={[8, 8]}>
                        <Col md={4} sm={24}>
                              <div style={{ marginBottom: '2px', position: 'sticky', top: 30 }}>
                                    <div
                                          className={`setting-menu-item ${
                                                selectedTypeSupervisionPage === PAGE_INDICATORS_MAPPING ? 'active' : ''
                                          }`}
                                          onClick={() => handleClickConfigMenu(PAGE_INDICATORS_MAPPING)}
                                    >
                                          {translate('Indicators_Mapping')}
                                    </div>
                                    <div
                                          className={`setting-menu-item ${
                                                selectedTypeSupervisionPage === PAGE_CONFIG_SUPERVISION ? 'active' : ''
                                          }`}
                                          onClick={() => handleClickConfigMenu(PAGE_CONFIG_SUPERVISION)}
                                    >
                                          {translate('Parametre_Supervision')}
                                    </div>
                                    <div
                                          className={`setting-menu-item ${
                                                selectedTypeSupervisionPage === PAGE_CONFIG_VISUALIZATION
                                                      ? 'active'
                                                      : ''
                                          }`}
                                          onClick={() => handleClickConfigMenu(PAGE_CONFIG_VISUALIZATION)}
                                    >
                                          {translate('Visualizations')}
                                    </div>
                                    <div
                                          className={`setting-menu-item ${
                                                selectedTypeSupervisionPage === PAGE_CONFIG_ANALYSE ? 'active' : ''
                                          }`}
                                          onClick={() => handleClickConfigMenu(PAGE_CONFIG_ANALYSE)}
                                    >
                                          {translate('Analyses')}
                                    </div>
                              </div>
                        </Col>
                        <Col md={20} sm={24}>
                              {selectedTypeSupervisionPage === PAGE_CONFIG_INDICATORS && RenderPageIndicatorConfig()}
                              {selectedTypeSupervisionPage === PAGE_CONFIG_SUPERVISION && RenderPageSupervisionConfig()}
                              {selectedTypeSupervisionPage === PAGE_INDICATORS_MAPPING && RenderPageIndicatorsMapping()}
                              {selectedTypeSupervisionPage === PAGE_CONFIG_VISUALIZATION &&
                                    RenderPageVisualizationsConfig()}
                              {selectedTypeSupervisionPage === PAGE_CONFIG_ANALYSE && RenderPageAnalyseConfig()}
                        </Col>
                  </Row>
            </div>
      );

      const RenderContent = () => (
            <>
                  <div
                        style={{
                              width: '100%',
                              position: 'sticky',
                              top: 0
                        }}
                  >
                        <TabBar>
                              <Tab
                                    selected={renderPage === PAGE_CONFIGURATION_TYPE_SUPERVISIONS}
                                    onClick={_ => setRenderPage(PAGE_CONFIGURATION_TYPE_SUPERVISIONS)}
                              >
                                    {translate('Type_De_Supervision')}
                              </Tab>
                        </TabBar>
                        <div style={{ padding: '20px', marginTop: '20px' }}>
                              {renderPage === PAGE_CONFIGURATION_TYPE_SUPERVISIONS && RenderTypeSupervisionContent()}
                              {renderPage === PAGE_CONFIGURATION_USER_AUTHORIZATIONS &&
                                    RenderUserAuthorizationContent()}
                        </div>
                  </div>
            </>
      );

      useEffect(() => {
            loadPrograms();
            loadMaps();
            loadVisualizations();
            loadDataStoreVisualizations();
            loadDataStoreGlobalSettings();
            selectedTypeSupervisionPage === PAGE_CONFIG_INDICATORS && initIndicatorConfigStates();
            selectedTypeSupervisionPage === PAGE_CONFIG_SUPERVISION && initSupConfigStates();
            selectedTypeSupervisionPage === PAGE_CONFIG_ANALYSE && initAnalyseConfigStates();
      }, []);

      useEffect(() => {
            numberOfIndicatorAndRecoupement.DQR &&
                  formState?.selectedConfigurationType === DQR &&
                  !formState?.isFieldEditingMode &&
                  !currentProgramstageConfiguration &&
                  initFields();

            numberOfIndicatorAndRecoupement &&
                  !currentProgramstageConfigurationForRDQA &&
                  formState?.selectedConfigurationType === RDQA &&
                  initFieldsForRDQA();
      }, [
            numberOfIndicatorAndRecoupement,
            formState?.selectedConfigurationType,
            formState?.selectedProgramStageForConfiguration,
            formStateForRDQA?.selectedProgramStageForConfiguration,
            currentProgramstageConfigurationForRDQA,
            currentProgramstageConfiguration
      ]);

      useEffect(() => {
            currentItem && initUpdateIndicatorConfigStage();
      }, [currentItem, indicatorGroups, programs]);

      useEffect(() => {
            if (updateAllFieldsWhenHaveOneStage && programStageConfigurations?.length === 1) {
                  handleEditProgramStageConfigurations(programStageConfigurations[0]);
            }
      }, [updateAllFieldsWhenHaveOneStage, programStageConfigurations]);

      useEffect(() => {
            if (currentProgramstageConfigurationForRDQA && formState?.selectedConfigurationType === RDQA) {
                  initFieldsForRDQA(currentProgramstageConfigurationForRDQA?.indicatorsFieldsConfigs || []);
            }

            if (currentProgramstageConfiguration && formState?.selectedConfigurationType === DQR) {
                  initFields(currentProgramstageConfiguration);
            }
      }, [currentProgramstageConfiguration, currentProgramstageConfigurationForRDQA, numberOfIndicatorAndRecoupement]);

      return (
            <>
                  {RenderTopContent()}
                  {RenderContent()}
                  <MyNotification notification={notification} setNotification={setNotification} />
            </>
      );
};

export default Setting;
