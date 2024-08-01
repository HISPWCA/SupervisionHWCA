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
      ERDQ,
      PAGE_INDICATORS_MAPPING
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
import GenerateIndicatorsFieldsList from './GenerateIndicatorsFields';
import GenerateIndicatorsFieldsDQR from './GenerateIndicatorsFieldsDQR';
import SettingIndicatorsMapping from './SettingIndicatorsMapping';

const numberList = [
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10' }
];

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
      const [isFieldEditingMode, setFieldEditingMode] = useState(false);
      const [paymentConfigList, setPaymentConfigList] = useState([]);
      const [isEditModePayment, setEditModePayment] = useState(false);
      const [currentPaymentConfig, setCurrentPaymentConfig] = useState(null);
      const [dataStoreVisualizations, setDataStoreVisualizations] = useState([]);
      const [currentVisualizationProgram, setCurrentVisualizationProgram] = useState(null);
      const [indicatorsFieldsConfigs, setIndicatorsFieldsConfigs] = useState([]);
      const [dataStoreGlobalSettings, setDataStoreGlobalSettings] = useState(null);

      const [visualizations, setVisualizations] = useState([]);
      const [maps, setMaps] = useState([]);
      const [favorisItems, setFavorisItems] = useState([]);

      const [indicatorName, setIndicatorName] = useState('');
      const [indicatorEtiquette, setIndicatorEtiquette] = useState('');
      const [indicatorWeight, setIndicatorWeight] = useState(0);
      const [indicatorBestPositive, setIndicatorBestPositive] = useState(true);

      const [organisationUnitGroups, setOrganisationUnitGroups] = useState([]);
      const [loadingOrganisationUnitGroups, setLoadingOrganisationUnitGroups] = useState(false);
      const [programStageConfigurations, setProgramStageConfigurations] = useState([]);
      const [currentProgramstageConfiguration, setCurrentProgramstageConfiguration] = useState(null);

      const [selectedOrganisationUnitGroup, setSelectedOrganisationUnitGroup] = useState(null);
      const [selectedProgramStageForConfiguration, setSelectedProgramStageForConfiguration] = useState(null);
      const [selectedSupervisorDataElements, setSelectedSupervisorDataElements] = useState([]);
      const [selectedStatusSupervisionDataElement, setSelectedStatusSupervisionDataElement] = useState(null);
      const [selectedConfigurationType, setSelectedConfigurationType] = useState('ERDQ');
      const [selectedIndicator, setSelectedIndicator] = useState(null);
      const [selectedIndicatorGroup, setSelectedIndicatorGroup] = useState(null);
      const [selectedIndicatorType, setSelectedIndicatorType] = useState(PROGRAM_INDICATOR);
      const [selectedTEIProgram, setSelectedTEIProgram] = useState(null);
      const [selectedSupervisionGenerationType, setSelectedSupervisionGenerationType] =
            useState(TYPE_GENERATION_AS_EVENT);
      const [selectedProgram, setSelectedProgram] = useState(null);
      const [selectedTypeSupervisionPage, setSelectedTypeSupervisionPage] = useState(PAGE_CONFIG_SUPERVISION);
      const [selectedAnalyseType, setSelectedAnalyseType] = useState(TYPE_ANALYSE_DATA_ELEMENT);

      const [selectedAnalyseIndicator, setSelectedAnalyseIndicator] = useState(null);
      const [selectedAnalyseDataElement, setSelectedAnalyseDataElement] = useState(null);
      const [selectedProgramStage, setSelectedProgramStage] = useState(null);
      const [selectedSupervisionProgramStage, setSelectedStatusSupervisionProgramStage] = useState(null);
      const [selectedStatutPaymentProgramStage, setSelectedStatutPaymentProgramStage] = useState(null);
      const [selectedStatutSupervisionDataElement, setSelectedStatutSupervisionDataElement] = useState(null);
      const [selectedStatutPaymentDataElement, setSelectedStatutPaymentDataElement] = useState(null);
      const [selectedDataElements, setSelectedDataElements] = useState([]);
      const [selectedAttributesToDisplay, setSelectedAttributesToDisplay] = useState([]);
      const [selectedPlanificationIndicatorRDQeCase, setSelectedPlanificationIndicatorRDQeCase] = useState(false);
      const [selectedPlanificationType, setSelectedPlanificationType] = useState(ORGANISATION_UNIT);
      const [selectedAttributeNameForAgent, setSelectedAttributeNameForAgent] = useState(null);
      const [selectedAttributeFirstNameForAgent, setSelectedAttributeFirstNameForAgent] = useState(null);
      const [selectedProgramForVisualization, setSelectedProgramForVisualization] = useState(null);
      const [selectedTypeForVisualization, setSelectedTypeForVisualization] = useState(null);
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

      const initFields = () => {
            if (
                  dataStoreGlobalSettings[DQR] &&
                  formState?.selectedConfigurationType === DQR &&
                  !formState?.isFieldEditingMode &&
                  !currentProgramstageConfiguration
            ) {
                  const dqrConfig = dataStoreGlobalSettings[DQR];
                  const newIndicators = [];
                  const newRecoupements = [];
                  const newConsistencyOverTimes = [];
                  const newDataElementCompleteness = [];
                  const newSourceDocumentCompleteness = [];

                  for (let i = 1; i <= +dqrConfig.nbrIndicator; i++) {
                        newIndicators.push({
                              id: uuid(),
                              position: i,
                              value: null,
                              margin: null,
                              DHIS2MonthlyValue1: null,
                              DHIS2MonthlyValue2: null,
                              DHIS2MonthlyValue3: null,
                              programArea: null
                        });
                  }

                  for (let i = 1; i <= +dqrConfig.nbrRecoupement; i++) {
                        newRecoupements.push({
                              id: uuid(),
                              position: i,
                              primaryValue: null,
                              secondaryValue: null,
                              margin: null,
                              programArea: null
                        });
                  }

                  for (let i = 1; i <= +dqrConfig.nbrConsistencyOverTime; i++) {
                        newConsistencyOverTimes.push({
                              id: uuid(),
                              position: i,
                              value: null,
                              margin: null,
                              programArea: null
                        });
                  }
                  for (let i = 1; i <= +dqrConfig.nbrDataElementCompleteness; i++) {
                        newDataElementCompleteness.push({
                              id: uuid(),
                              position: i,
                              value: null
                        });
                  }
                  for (let i = 1; i <= +dqrConfig.nbrSourceDocumentCompleteness; i++) {
                        newSourceDocumentCompleteness.push({
                              id: uuid(),
                              position: i,
                              value: null
                        });
                  }

                  setFormState({
                        ...formState,
                        indicators: newIndicators,
                        recoupements: newRecoupements,
                        consistencyOvertimes: newConsistencyOverTimes,
                        completeness: {
                              ...formState.completeness,
                              dataElements: newDataElementCompleteness,
                              sourceDocuments: newSourceDocumentCompleteness
                        }
                  });
            }
      };

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
                  setMaps(response.data.maps?.map(m => ({ ...m, type: 'MAP' })) || []);
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

      const loadProgramIndicatorGroups = async () => {
            try {
                  setLoadingIndicatorGroups(true);

                  const response = await axios.get(`${PROGRAM_INDICATOR_GROUPS}`);

                  setIndicatorGroups(response.data.programIndicatorGroups);
                  setLoadingIndicatorGroups(false);
            } catch (err) {
                  setLoadingIndicatorGroups(false);
            }
      };

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
                  setIndicatorsFieldsConfigs([]);
                  setSelectedTEIProgram(null);
                  setSelectedSupervisionGenerationType(TYPE_GENERATION_AS_EVENT);
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
                        const newList = dataStoreVisualizations.filter(dataFav => dataFav.id !== item.id);
                        await saveDataToDataStore(process.env.REACT_APP_VISUALIZATION_KEY, newList, null, null, null);
                        setDataStoreVisualizations(newList);
                        setNotification({
                              show: true,
                              message: translate('Suppression_Effectuee'),
                              type: NOTIFICATION_SUCCESS
                        });
                        setSelectedProgramForVisualization(null);
                        setSelectedMaps([]);
                        setSelectedVisualizations([]);
                        setCurrentVisualizationProgram(null);
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
      };

      const handleSaveSupConfig = async () => {
            try {
                  setLoadingSaveSupervionsConfig(true);

                  if (!formState?.selectedTEIProgram) throw new Error(translate('Veuillez_Selectionner_Un_Programme'));

                  if (!formState?.selectedProgramStageForConfiguration)
                        throw new Error(translate('Please_Select_Program_Stage'));

                  if (!formState?.selectedOrganisationUnitGroup && formState?.selectedConfigurationType === ERDQ)
                        throw new Error(translate('Please_Select_Organisation_Unit_Group'));

                  if (formState?.selectedSupervisorDataElements?.length === 0)
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
                        !formState?.isFieldEditingMode &&
                        existingConfig &&
                        existingConfig.programStageConfigurations
                              .map(p => p.programStage?.id)
                              .includes(formState?.selectedProgramStageForConfiguration?.id)
                  ) {
                        throw new Error(translate('ProgramStage_Already_Configured'));
                  }

                  const newProgramStageConfigurations = existingConfig
                        ? formState?.isFieldEditingMode && currentProgramstageConfiguration
                              ? programStageConfigurations.map(p => {
                                      if (p.programStage?.id === currentProgramstageConfiguration?.programStage?.id) {
                                            return {
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
                                            };
                                      }

                                      return p;
                                })
                              : [
                                      ...existingConfig.programStageConfigurations,
                                      {
                                            programStage: formState?.selectedProgramStageForConfiguration,
                                            organisationUnitGroup: formState?.selectedOrganisationUnitGroup,
                                            supervisorField: formState?.selectedSupervisorDataElements,
                                            statusSupervisionField: formState?.selectedStatusSupervisionDataElement,
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

                  const payload = {
                        generationType: formState.selectedSupervisionGenerationType,
                        planificationType: formState.selectedPlanificationType,
                        configurationType: formState.selectedConfigurationType,
                        selectedSupervisionAutoGenerateID: formState.selectedSupervisionAutoGenerateID,
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

                  setMappingConfigSupervisions(newList);
                  setProgramStageConfigurations(newProgramStageConfigurations);
                  setFormState({
                        ...formState,
                        selectedProgramStageForConfiguration: null,
                        isFieldEditingMode: false
                  });
                  setCurrentProgramstageConfiguration(null);
                  initFields();

                  setLoadingSaveSupervionsConfig(false);
                  setNotification({
                        show: true,
                        type: NOTIFICATION_SUCCESS,
                        message: isFieldEditingMode
                              ? translate('Mise_A_Jour_Effectuer')
                              : translate('Configuration_Added_For_Program_stage')
                  });
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

      const handleSelectStatutSupervisionDataElement = value => {
            const statusDataElement = formState?.selectedProgramStageForConfiguration?.programStageDataElements
                  ?.map(p => p.dataElement)
                  .find(dataElement => dataElement.id === value);
            setFormState({
                  ...formState,
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

      const handleSelectOrganisationUnitGroupProgramStage = value => {
            setFormState({
                  ...formState,
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
                                                      label={translate('Configuration_RDQe_Case')}
                                                      onChange={({ value }) =>
                                                            setFormState({
                                                                  ...formState,
                                                                  selectedConfigurationType: value
                                                            })
                                                      }
                                                      value={ERDQ}
                                                      checked={formState?.selectedConfigurationType === ERDQ}
                                                />
                                          </div>
                                          <div style={{ marginTop: '5px' }}>
                                                <Radio
                                                      label={translate('Configuration_DQe_Case')}
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
                  setFormState({
                        ...formState,
                        selectedTEIProgram: programs.find(p => p.id === prog.program?.id),
                        selectedSupervisionGenerationType: prog?.generationType,
                        selectedPlanificationType: prog.planificationType,
                        selectedConfigurationType: prog.configurationType,
                        selectedSupervisionAutoGenerateID: prog.selectedSupervisionAutoGenerateID,
                        isFieldEditingMode: true
                  });
                  await loadProgramStages(prog?.program?.id);

                  setProgramStageConfigurations(prog.programStageConfigurations || []);
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      // const handleChangeProgramAttributeToDisplay = values => {
      //       setSelectedAttributesToDisplay(
      //             values.map(v =>
      //                   selectedTEIProgram.programTrackedEntityAttributes
      //                         .map(p => p.trackedEntityAttribute)
      //                         .find(att => att.id === v)
      //             )
      //       );
      // };

      // const handleSelectProgramAttributeNameForAgent = value => {
      //       setSelectedAttributeNameForAgent(
      //             selectedTEIProgram.programTrackedEntityAttributes
      //                   .map(p => p.trackedEntityAttribute)
      //                   .find(att => att.id === value)
      //       );
      // };

      // const handleSelectProgramAttributeFirstNameForAgent = value => {
      //       setSelectedAttributeFirstNameForAgent(
      //             selectedTEIProgram.programTrackedEntityAttributes
      //                   .map(p => p.trackedEntityAttribute)
      //                   .find(att => att.id === value)
      //       );
      // };

      // const RenderAttributesToDisplay = () => (
      //       <div style={{ marginTop: '20px' }}>
      //             <Card className="my-shadow" size="small">
      //                   <div>
      //                         <div style={{ fontWeight: 'bold' }}>{translate('Configuration_Des_Attributes')}</div>
      //                         <Divider style={{ margin: '5px 0px' }} />
      //                         <div style={{ fontWeight: 'bold' }}>{translate('Attributs')}</div>
      //                         <div style={{ color: '#00000070', fontSize: '13px' }}>
      //                               {translate('Aide_Attribute_Configurer')}
      //                         </div>
      //                         <div style={{ marginTop: '2px' }}>
      //                               <Select
      //                                     options={selectedTEIProgram.programTrackedEntityAttributes
      //                                           .map(p => p.trackedEntityAttribute)
      //                                           .map(attribute => ({
      //                                                 label: attribute.displayName,
      //                                                 value: attribute.id
      //                                           }))}
      //                                     placeholder={translate('Program_Stage')}
      //                                     style={{ width: '100%' }}
      //                                     optionFilterProp="label"
      //                                     value={selectedAttributesToDisplay.map(att => att.id)}
      //                                     onChange={handleChangeProgramAttributeToDisplay}
      //                                     showSearch
      //                                     allowClear
      //                                     mode="multiple"
      //                                     loading={loadingPrograms}
      //                                     disabled={loadingPrograms}
      //                               />
      //                         </div>
      //                         <Divider style={{ margin: '10px 0px' }} />
      //                         <div style={{ color: '#00000070', fontSize: '13px' }}>
      //                               {translate('Attribute_Representant_Nom_Et_Prenom')}
      //                         </div>
      //                         <div style={{ marginTop: '5px' }}>
      //                               <Row gutter={[10, 10]}>
      //                                     <Col md={12}>
      //                                           <div style={{ marginBottom: '2px', fontWeight: 'bold' }}>
      //                                                 {translate('Nom_Agent')}
      //                                           </div>
      //                                           <div>
      //                                                 <Select
      //                                                       options={selectedTEIProgram.programTrackedEntityAttributes
      //                                                             .map(p => p.trackedEntityAttribute)
      //                                                             .map(attribute => ({
      //                                                                   label: attribute.displayName,
      //                                                                   value: attribute.id
      //                                                             }))}
      //                                                       placeholder={translate('Nom_Agent')}
      //                                                       style={{ width: '100%' }}
      //                                                       optionFilterProp="label"
      //                                                       value={selectedAttributeNameForAgent?.id}
      //                                                       onChange={handleSelectProgramAttributeNameForAgent}
      //                                                       showSearch
      //                                                       allowClear
      //                                                       loading={loadingPrograms}
      //                                                       disabled={loadingPrograms}
      //                                                 />
      //                                           </div>
      //                                     </Col>
      //                                     <Col md={12}>
      //                                           <div style={{ marginBottom: '2px', fontWeight: 'bold' }}>
      //                                                 {translate('Prenom_Agent')}
      //                                           </div>
      //                                           <div>
      //                                                 <Select
      //                                                       options={selectedTEIProgram.programTrackedEntityAttributes
      //                                                             .map(p => p.trackedEntityAttribute)
      //                                                             .map(attribute => ({
      //                                                                   label: attribute.displayName,
      //                                                                   value: attribute.id
      //                                                             }))}
      //                                                       placeholder={translate('Prenom_Agent')}
      //                                                       style={{ width: '100%' }}
      //                                                       optionFilterProp="label"
      //                                                       value={selectedAttributeFirstNameForAgent?.id}
      //                                                       onChange={handleSelectProgramAttributeFirstNameForAgent}
      //                                                       showSearch
      //                                                       allowClear
      //                                                       loading={loadingPrograms}
      //                                                       disabled={loadingPrograms}
      //                                                 />
      //                                           </div>
      //                                     </Col>
      //                               </Row>
      //                         </div>
      //                   </div>
      //             </Card>
      //       </div>
      // );

      const handleEditProgramStageConfigurations = value => {
            try {
                  const foundProgramStage = programStages.find(p => p.id === value.programStage?.id);
                  if (!foundProgramStage) throw new Error('No program stage found ');

                  setFormState({
                        ...formState,
                        selectedProgramStageForConfiguration: foundProgramStage,
                        selectedOrganisationUnitGroup: organisationUnitGroups.find(
                              orgG => orgG.id === value.organisationUnitGroup?.id
                        ),
                        selectedSupervisorDataElements: value.supervisorField || [],
                        selectedStatusSupervisionDataElement: value.statusSupervisionField,
                        selectedNbrIndicatorsToShow: value.selectedNbrIndicatorsToShow,
                        isFieldEditingMode: true,
                        indicators: value.indicators,
                        recoupements: value.recoupements,
                        completeness: value.completeness,
                        consistencyOvertimes: value.consistencyOvertimes
                  });
                  setCurrentProgramstageConfiguration(value);
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
                                                            disabled={loadingProgramStages}
                                                      />
                                                </div>
                                          </Col>

                                          {formState?.selectedConfigurationType === ERDQ && (
                                                <Col md={12} sm={24}>
                                                      <div>
                                                            <div style={{ marginBottom: '5px' }}>
                                                                  {translate('Groupe_Unite_Organisation')}
                                                            </div>
                                                            <Select
                                                                  options={organisationUnitGroups.map(
                                                                        organisationUnitGroup => ({
                                                                              label: organisationUnitGroup.displayName,
                                                                              value: organisationUnitGroup.id
                                                                        })
                                                                  )}
                                                                  placeholder={translate('Groupe_Unite_Organisation')}
                                                                  style={{ width: '100%' }}
                                                                  optionFilterProp="label"
                                                                  value={formState?.selectedOrganisationUnitGroup?.id}
                                                                  onChange={
                                                                        handleSelectOrganisationUnitGroupProgramStage
                                                                  }
                                                                  showSearch
                                                                  allowClear
                                                                  loading={loadingOrganisationUnitGroups}
                                                                  disabled={loadingOrganisationUnitGroups}
                                                            />
                                                      </div>
                                                </Col>
                                          )}

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
                                    columns={
                                          formState?.selectedConfigurationType === ERDQ
                                                ? [
                                                        {
                                                              title: translate('Program_Stage'),
                                                              dataIndex: 'programStageName'
                                                        },
                                                        {
                                                              title: translate('Groupe_Unite_Organisation'),
                                                              dataIndex: 'organisationUnitGroupName'
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
                                                                                onConfirm={() => {
                                                                                      handleDeleteProgramStageConfiguration(
                                                                                            value
                                                                                      );
                                                                                }}
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
                                                  ]
                                                : [
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
                                                                                onConfirm={() => {
                                                                                      //   setSelectedProgramStageForConfiguration(
                                                                                      //         null
                                                                                      //   );
                                                                                      //   setSelectedOrganisationUnitGroup(
                                                                                      //         null
                                                                                      //   );
                                                                                      //   setSelectedSupervisorDataElements(
                                                                                      //         []
                                                                                      //   );
                                                                                      //   setSelectedStatusSupervisionDataElement(
                                                                                      //         null
                                                                                      //   );
                                                                                      //   setProgramStageConfigurations(
                                                                                      //         programStageConfigurations.filter(
                                                                                      //               p =>
                                                                                      //                     p.programStage
                                                                                      //                           ?.id !==
                                                                                      //                     value
                                                                                      //                           .programStage
                                                                                      //                           ?.id
                                                                                      //         )
                                                                                      //   );
                                                                                }}
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
                                                  ]
                                    }
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

                        if (listFromDataStore?.map(d => d.id)?.includes(selectedProgramForVisualization?.id)) {
                              throw new Error(translate('Configuration_Deja_Ajoutee'));
                        }

                        const newList = [
                              {
                                    program: selectedProgramForVisualization,
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

                  setLoadingSaveVisualizationInDatastore(false);
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
                                          {formState?.selectedConfigurationType === ERDQ ? (
                                                <>
                                                      {/* <GenerateIndicatorsFieldsList
                                                            selectedProgramStageForConfiguration={
                                                                  selectedProgramStageForConfiguration
                                                            }
                                                            indicatorsFieldsConfigs={indicatorsFieldsConfigs}
                                                            setIndicatorsFieldsConfigs={setIndicatorsFieldsConfigs}
                                                            selectedConfigurationType={selectedConfigurationType}
                                                      /> */}
                                                </>
                                          ) : (
                                                <>
                                                      <GenerateIndicatorsFieldsDQR
                                                            formState={formState}
                                                            setFormState={setFormState}
                                                      />
                                                </>
                                          )}
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
                        disabled={formState?.selectedProgramStageForConfiguration ? false : true}
                        primary
                        onClick={handleSaveSupConfig}
                        loading={loadingSaveSupervionsConfig}
                        icon={<FiSave style={{ fontSize: '18px', color: '#FFF' }} />}
                  >
                        {currentProgramstageConfiguration
                              ? translate('Mise_A_Jour_Configuration')
                              : '+ '.concat(translate('AddConfiguration'))}
                  </Button>
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
                                                {RenderProgramStageConfiguration()}
                                                {RenderIndicatorAndRecoupementConfigFields()}
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
                                                dataSource={mappingConfigSupervisions.map(mapConf => ({
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
                  if (!newFavList.map(f => f.id).includes(m.id)) {
                        newFavList.push(m);
                  }
            }

            for (let v of selectedVisualizations) {
                  if (!newFavList.map(f => f.id).includes(v.id)) {
                        newFavList.push(v);
                  }
            }

            setFavorisItems([...newFavList, ...favorisItems]);
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
                                                            options={programs.map(program => ({
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
                                                                              options={visualizations.map(vis => ({
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
                                                                                          value.map(v =>
                                                                                                visualizations.find(
                                                                                                      m => m.id === v
                                                                                                )
                                                                                          )
                                                                                    )
                                                                              }
                                                                              value={selectedVisualizations.map(
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
                                                                              options={maps.map(map => ({
                                                                                    label: map.displayName,
                                                                                    value: map.id
                                                                              }))}
                                                                              showSearch
                                                                              placeholder={translate('SelectMaps')}
                                                                              style={{ width: '100%' }}
                                                                              optionFilterProp="label"
                                                                              onChange={value =>
                                                                                    setSelectedMaps(
                                                                                          value.map(v =>
                                                                                                maps.find(
                                                                                                      m => m.id === v
                                                                                                )
                                                                                          )
                                                                                    )
                                                                              }
                                                                              value={selectedMaps.map(m => m.id)}
                                                                              mode="multiple"
                                                                              allowClear
                                                                        />
                                                                  </div>
                                                            )}
                                                      </div>
                                                )}

                                                {(selectedMaps.length > 0 || selectedVisualizations.length > 0) && (
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
                                                            borderRadius: '8px'
                                                      }}
                                                >
                                                      <Table
                                                            bordered
                                                            size="small"
                                                            pagination={false}
                                                            dataSource={favorisItems.map(f => ({ ...f, action: f.id }))}
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
                                                                                                'Confirmation_Suppression_Visualisation'
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
                                                            loading={loadingSaveSupervionsConfig}
                                                            disabled={
                                                                  loadingSaveSupervionsConfig || !selectedTEIProgram
                                                            }
                                                            icon={
                                                                  <FiSave style={{ color: '#FFF', fontSize: '18px' }} />
                                                            }
                                                            destructive
                                                            onClick={() => {
                                                                  setFavorisItems([]);
                                                                  setSelectedMaps([]);
                                                                  setSelectedVisualizations([]);
                                                                  setSelectedProgramForVisualization(null);
                                                            }}
                                                      >
                                                            {translate('Annuler')}
                                                      </Button>
                                                      <div style={{ marginLeft: '10px' }}>
                                                            <Button
                                                                  loading={loadingSaveSupervionsConfig}
                                                                  disabled={
                                                                        loadingSaveSupervionsConfig ||
                                                                        !selectedTEIProgram
                                                                  }
                                                                  icon={
                                                                        <FiSave
                                                                              style={{
                                                                                    color: '#FFF',
                                                                                    fontSize: '18px'
                                                                              }}
                                                                        />
                                                                  }
                                                                  primary
                                                                  onClick={handleSaveVisualizationToDataStore}
                                                            >
                                                                  {isFieldEditingMode && (
                                                                        <span>{translate('Mise_A_Jour')}</span>
                                                                  )}
                                                                  {!isFieldEditingMode && (
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
                                                {translate('Liste_Programme_Tracker')}
                                          </div>
                                          <Table
                                                dataSource={favorisItems.map(fav => ({
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
                                                      dataSource={paymentConfigList.map(conf => ({
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
                                                                        options={indicatorGroups.map(
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
                                                                        options={programs.map(program => ({
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
                                                dataSource={mappingConfigs.map(mapConf => ({
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
                                                                        options={dataElements.map(dataElement => ({
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
                                                                        options={indicators.map(ind => ({
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
                                                dataSource={analyseConfigs.map(config => ({
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
            if (dataStoreGlobalSettings) {
                  initFields();
            }
      }, [
            dataStoreGlobalSettings,
            formState?.selectedConfigurationType,
            formState?.selectedProgramStageForConfiguration
      ]);

      useEffect(() => {
            currentItem && initUpdateIndicatorConfigStage();
      }, [currentItem, indicatorGroups, programs]);

      return (
            <>
                  {RenderTopContent()}
                  {RenderContent()}
                  <MyNotification notification={notification} setNotification={setNotification} />
            </>
      );
};

export default Setting;
