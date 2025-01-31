import { useState, useEffect } from 'react';
import { Card, Col, Input, Popconfirm, Row, Select, Table } from 'antd';

import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle, Radio } from '@dhis2/ui';
import { MdStars } from 'react-icons/md';
import { FiSave } from 'react-icons/fi';
import { CgCloseO } from 'react-icons/cg';
import translate from '../utils/translator';
import MyNotification from './MyNotification';
import {
      ALL,
      DIRECTE,
      DQR,
      FAVORIS,
      NOTIFICATION_CRITICAL,
      NOTIFICATION_SUCCESS,
      ORGANISATION_UNIT,
      RDQA
} from '../utils/constants';

import { loadDataStore, saveDataToDataStore } from '../utils/functions';
import { PROGRAMS_STAGE_ROUTE } from '../utils/api.routes';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { DataDimension } from '@dhis2/analytics';
import { RiDeleteBinLine } from 'react-icons/ri';
import dayjs from 'dayjs';
import FavoriteGenerateIndicatorsFieldsDQR from './FavoriteGenerateIndicatorsFieldsDQR';
import FavoriteGenerateIndicatorsFieldsRDQA from './FavoriteGenerateIndicatorsFieldsRDQA';

const Favorites = ({ me }) => {
      const [programStages, setProgramStages] = useState([]);
      const [favoritBackgroundInformationList, setFavoritBackgroundInformationList] = useState([]);
      const [visibleAnalyticComponentModal, setVisibleAnalyticComponentModal] = useState(false);
      const [visibleAddFavoritBackgroundInformationModal, setVisibleAddFavoritBackgroundInformationModal] =
            useState(false);

      const [selectedBackgroundInformationFavorit, setSelectedBackgroundInformationFavorit] = useState(null);
      const [selectedMetaDatas, setSelectedMetaDatas] = useState([]);
      const [inputFavorisNameForBackgroundInforation, setInputFavoritNameForBackgroundInforation] = useState('');
      const [loadingSaveFavoritBackgroundInformations, setLoadingSaveFavoritBackgroundInformations] = useState(false);
      const [loadingDeleteFavoritBackgroundInformations, setLoadingDeleteFavoritBackgroundInformations] =
            useState(false);
      const [loadingProgramStages, setLoadingProgramStages] = useState(false);
      const [loadingBackgroundInformationFavoritsConfigs, setLoadingBackgroundInformationFavoritsConfigs] =
            useState(false);
      const [loadingDataStoreSupervisionConfigs, setLoadingDataStoreSupervisionConfigs] = useState(false);

      const [formIndicatorConfiguration, setFormIndicatorConfiguration] = useState({
            selectedIndicator: { dataElement: null, source: null },
            selectedRecoupements: [],
            isIndicator: true,
            currentElement: null,
            marginOfErrorIndicator: null,
            marginOfErrorRecoupement: null
      });

      const [notification, setNotification] = useState({
            show: false,
            message: null,
            type: null
      });

      const [selectedTypeSource, _] = useState('DHIS2');

      const [dataStoreCrosschecks, setDataStoreCrosschecks] = useState([]);
      const [dataStoreIndicators, setDataStoreIndicators] = useState([]);
      const [dataStoreIndicatorsMapping, setDataStoreIndicatorsMapping] = useState([]);
      const [dataStoreDECompletness, setDataStoreDECompletness] = useState([]);
      const [dataStoreDSCompletness, setDataStoreDSCompletness] = useState([]);
      const [dataStoreRegistres, setDataStoreRegistres] = useState([]);
      const [dataStoreSupervisionConfigs, setDataStoreSupervisionConfigs] = useState([]);

      const [selectedCrosscheck, setSelectedCrosscheck] = useState(null);
      const [selectedCrosscheckChild, setSelectedCrosscheckChild] = useState(null);
      const [visibleAnalyticComponentModalForCrossCheck, setVisibleAnalyticComponentModalForCrossCheck] =
            useState(false);

      const [indicatorFieldsForRDQA, setIndicatorFieldsForRDQA] = useState([]);

      const [formState, setFormState] = useState({
            selectedProgram: null,
            selectedProgramStage: null,
            selectedBackgroundInformationTypeConfiguration: DIRECTE,
            selectedBackgroundInformationFavorit: null,
            inputFavorisNameForBackgroundInforation: '',
            selectedGlobalProgramArea: null,
            nbrIndicatorsToShow: 0,
            indicators: [],
            recoupements: [],
            consistencyOvertimes: [],
            completeness: {
                  nbrDocumentsSourceToShow: 0,
                  nbrDataElementsToShow: 0,
                  register: null,
                  dataElements: [],
                  sourceDocuments: []
            }
      });

      const handleSelectProgramStage = value => {
            setFormState({
                  ...formState,
                  selectedProgramStage: programStages.find(pstage => pstage.id === value)
            });
      };

      const initFields = () => {
            if (formState?.selectedProgram?.configurationType === DQR) {
                  const currStage = formState.selectedProgram?.programStageConfigurations?.find(
                        pstage => pstage.programStage?.id === formState.selectedProgramStage?.id
                  );
                  const existingFormState = formState?.selectedBackgroundInformationFavorit?.formState;

                  if (currStage) {
                        setFormState({
                              ...formState,
                              selectedNbrIndicatorsToShow: currStage.selectedNbrIndicatorsToShow,
                              selectedGlobalProgramArea: existingFormState?.selectedGlobalProgramArea,
                              globalProgramArea: currStage.globalProgramArea,
                              nbrIndicatorsToShow: existingFormState?.nbrIndicatorsToShow
                                    ? existingFormState?.nbrIndicatorsToShow
                                    : currStage.indicators?.filter(ind => ind.value && ind.programArea)?.length || 0,

                              indicators:
                                    currStage.indicators
                                          ?.filter(ind => ind.value && ind.programArea)
                                          ?.map((ind, index) => ({
                                                ...ind,
                                                selectedSourceProgramArea:
                                                      existingFormState?.indicators[index]?.selectedSourceProgramArea ||
                                                      null,
                                                selectedSourceIndicator:
                                                      existingFormState?.indicators[index]?.selectedSourceIndicator ||
                                                      null,
                                                selectedSourceMargin:
                                                      existingFormState?.indicators[index]?.selectedSourceMargin || null
                                          })) || [],
                              recoupements:
                                    currStage.recoupements
                                          ?.filter(rec => rec.primaryValue && rec.secondaryValue && rec.programArea)
                                          ?.map((ind, index) => ({
                                                ...ind,
                                                selectedSourceProgramArea:
                                                      existingFormState?.recoupements[index]
                                                            ?.selectedSourceProgramArea || null,
                                                selectedSourcePrimary:
                                                      existingFormState?.recoupements[index]?.selectedSourcePrimary ||
                                                      null,
                                                selectedSourceSecondary:
                                                      existingFormState?.recoupements[index]?.selectedSourceSecondary ||
                                                      null,
                                                selectedSourceMargin:
                                                      existingFormState?.recoupements[index]?.selectedSourceMargin ||
                                                      null
                                          })) || [],

                              consistencyOvertimes:
                                    currStage.consistencyOvertimes
                                          ?.filter(ind => ind.value && ind.programArea)
                                          ?.map((ind, index) => ({
                                                ...ind,
                                                selectedSourceProgramArea:
                                                      existingFormState?.consistencyOvertimes[index]
                                                            ?.selectedSourceProgramArea || null,
                                                selectedSourceConsistency:
                                                      existingFormState?.consistencyOvertimes[index]
                                                            ?.selectedSourceConsistency || null,
                                                selectedSourceMargin:
                                                      existingFormState?.consistencyOvertimes[index]
                                                            ?.selectedSourceMargin || null
                                          })) || [],

                              completeness: {
                                    ...currStage.completeness,

                                    selectedNbrDocumentsSourceToShow:
                                          currStage.completeness?.selectedNbrDocumentsSourceToShow,
                                    nbrDocumentsSourceToShow: existingFormState?.completeness?.nbrDocumentsSourceToShow
                                          ? existingFormState?.completeness?.nbrDocumentsSourceToShow
                                          : currStage.completeness?.sourceDocuments?.filter(ind => ind.value)?.length ||
                                            0,

                                    selectedNbrDataElementsToShow:
                                          currStage.completeness?.selectedNbrDataElementsToShow,
                                    nbrDataElementsToShow: existingFormState?.completeness?.nbrDataElementsToShow
                                          ? existingFormState?.completeness?.nbrDataElementsToShow
                                          : currStage.completeness?.dataElements?.filter(ind => ind.value)?.length || 0,

                                    register: existingFormState?.completeness?.register || null,

                                    selectedRegister: currStage?.completeness?.selectedRegister || null,

                                    dataElements:
                                          (currStage.completeness?.programAreaDE &&
                                                currStage.completeness?.dataElements
                                                      ?.filter(ind => ind.value)
                                                      ?.map((ind, index) => ({
                                                            ...ind,
                                                            selectedSourceDE:
                                                                  existingFormState?.completeness?.dataElements[index]
                                                                        ?.selectedSourceDE || null
                                                      }))) ||
                                          [],
                                    sourceDocuments:
                                          (currStage.completeness?.sourceDocuments &&
                                                currStage.completeness?.sourceDocuments
                                                      ?.filter(ind => ind.value)
                                                      ?.map((ind, index) => ({
                                                            ...ind,
                                                            selectedSourceDS:
                                                                  existingFormState?.completeness?.sourceDocuments[
                                                                        index
                                                                  ]?.selectedSourceDS || null
                                                      }))) ||
                                          [],
                                    selectedSourceMargin: existingFormState?.completeness?.selectedSourceMargin || null,
                                    selectedSourceProgramAreaDE:
                                          existingFormState?.completeness?.selectedSourceProgramAreaDE || null,
                                    selectedSourceProgramAreaDS:
                                          existingFormState?.completeness?.selectedSourceProgramAreaDS || null
                              }
                        });
                  }
            }
      };

      const initFieldsForRDQA = (initValuesList = []) => {
            if (formState?.selectedProgram?.configurationType === RDQA) {
                  const rightProgramStage = formState?.selectedProgram?.programStageConfigurations?.find(
                        p => p.programStage?.id === formState?.selectedProgramStage?.id
                  );

                  let newIndicatorList = [];
                  for (let ind of rightProgramStage?.indicatorsFieldsConfigs) {
                        let newRecoupementList = [];
                        for (let rec of ind.recoupements) {
                              newRecoupementList.push({
                                    ...rec,
                                    source:
                                          initValuesList
                                                ?.find(iInd => iInd?.position === ind?.position)
                                                ?.recoupements?.find(iRec => iRec.position === rec?.position)?.source ||
                                          null
                              });
                        }
                        newIndicatorList.push({
                              ...ind,
                              source: initValuesList?.find(iInd => iInd?.position === ind?.position)?.source || null,
                              recoupements: newRecoupementList
                        });
                  }

                  setIndicatorFieldsForRDQA(newIndicatorList);
            }
      };

      const handleClickSupervisionItem = sup => {
            setFormState({
                  ...formState,
                  selectedProgram: sup,
                  selectedBackgroundInformationFavorit: null,
                  selectedProgramStage:
                        sup.programStageConfigurations?.length === 0
                              ? programStages.find(
                                      pstage => pstage.id === sup.programStageConfigurations[0]?.programStage?.id
                                )
                              : null
            });
      };

      const loadProgramStages = async (programID, setState = null) => {
            try {
                  setLoadingProgramStages(true);

                  let route = `${PROGRAMS_STAGE_ROUTE},program,programStageDataElements[dataElement[id,displayName,dataElementGroups]]`;
                  if (programID) route = `${route}&filter=program.id:eq:${programID}`;

                  const response = await axios.get(route);

                  if (response.data?.programStages?.length === 1) {
                        setFormState({
                              ...formState,
                              selectedProgramStage: response.data?.programStages[0]
                        });
                  }
                  setProgramStages(response.data?.programStages || []);
                  setLoadingProgramStages(false);
            } catch (err) {
                  setLoadingProgramStages(false);
            }
      };

      const loadDataStoreSupervisionConfigs = async () => {
            try {
                  setLoadingDataStoreSupervisionConfigs(true);
                  const response = await loadDataStore(process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY, null, null, null);
                  if (!response || response.length === 0) {
                        setLoadingDataStoreSupervisionConfigs(false);
                  }

                  setDataStoreSupervisionConfigs(response);
                  setLoadingDataStoreSupervisionConfigs(false);
            } catch (err) {
                  setLoadingDataStoreSupervisionConfigs(false);
            }
      };

      const handleChangeSelectionTypeConfigurationForBackgroundInformation = ({ value }) => {
            setFormState({
                  ...formState,
                  selectedBackgroundInformationTypeConfiguration: value,
                  selectedBackgroundInformationFavorit: null,
                  selectedProgramStage: null,
                  inputFavorisNameForBackgroundInforation: '',
                  selectedGlobalProgramArea: null,
                  nbrIndicatorsToShow: 0,
                  indicators: [],
                  recoupements: [],
                  consistencyOvertimes: [],
                  completeness: {
                        dataElements: [],
                        sourceDocuments: []
                  }
            });
            setIndicatorFieldsForRDQA([]);
      };

      const handleSelectBackgroundInformationFavorit = value => {
            const currentFav = favoritBackgroundInformationList.find(b => b.id === value);
            if (currentFav) {
                  setFormState({
                        ...formState,
                        selectedProgramStage: currentFav.formState?.selectedProgramStage,
                        selectedBackgroundInformationFavorit: currentFav,
                        inputFavorisNameForBackgroundInforation: currentFav.name
                  });

                  setIndicatorFieldsForRDQA(currentFav?.formState?.indicatorFieldsForRDQA || []);
            }
      };

      const handleOkAnalyticComponentModal = () => {
            formIndicatorConfiguration?.isIndicator &&
                  setFormIndicatorConfiguration({
                        ...formIndicatorConfiguration,
                        currentElement: null,
                        selectedIndicator: formIndicatorConfiguration?.selectedIndicator && {
                              ...formIndicatorConfiguration.selectedIndicator,
                              source: selectedMetaDatas[0]
                        }
                  });

            setSelectedMetaDatas([]);
            setVisibleAnalyticComponentModal(false);
      };

      const handleCancelAnalyticComponentModal = () => {
            setSelectedMetaDatas([]);
            setVisibleAnalyticComponentModal(false);
      };

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
                                    {dataStoreSupervisionConfigs
                                          .filter(sup => sup.planificationType === ORGANISATION_UNIT)
                                          .map((sup, index) => (
                                                <div
                                                      key={index}
                                                      className={`supervision-item ${
                                                            formState?.selectedProgram?.id === sup.id ? 'active' : ''
                                                      }`}
                                                      onClick={() => handleClickSupervisionItem(sup)}
                                                >
                                                      {sup.program?.displayName}
                                                </div>
                                          ))}

                                    {dataStoreSupervisionConfigs.filter(
                                          sup => sup.planificationType === ORGANISATION_UNIT
                                    ).length === 0 && (
                                          <div style={{ fontWeight: 'bold' }}>
                                                {translate('Aucun_Programme_Supervision')}
                                          </div>
                                    )}
                              </div>
                        </Card>
                  </div>
            </>
      );

      const handleCloseAddFavoritForBackgroundInformation = () => {
            setInputFavoritNameForBackgroundInforation('');
            setVisibleAddFavoritBackgroundInformationModal(false);
      };

      const getEachDataElements = () => {
            let newList = [];

            const programStage = {
                  id: formState?.selectedProgramStage?.id,
                  displayName: formState?.selectedProgramStage?.displayName
            };
            const program = {
                  id: formState?.selectedProgram?.program?.id,
                  displayName: formState?.selectedProgram?.program?.displayName
            };

            // Indicator
            for (let indicator of formState?.indicators.slice(0, formState?.nbrIndicatorsToShow)) {
                  let payloadIndicator = {
                        dataElement: indicator?.value,
                        indicator: indicator?.selectedSourceIndicator && {
                              id: indicator?.selectedSourceIndicator?.id,
                              displayName: indicator?.selectedSourceIndicator?.name
                        },
                        programStage,
                        program
                  };

                  let payloadMargin = {
                        dataElement: indicator?.margin,
                        indicator: indicator?.selectedSourceMargin && {
                              id: indicator.selectedSourceMargin,
                              displayName: indicator.selectedSourceMargin
                        },
                        program,
                        programStage
                  };

                  if (payloadIndicator.dataElement?.id && payloadIndicator.indicator?.id)
                        newList.push(payloadIndicator);
                  if (payloadMargin.dataElement?.id && payloadMargin.indicator?.id) newList.push(payloadMargin);
            }

            // Recoupements
            for (let recoupement of formState?.recoupements) {
                  let payloadPrimary = {
                        dataElement: recoupement?.primaryValue,
                        indicator: recoupement?.selectedSourcePrimary && {
                              id: recoupement?.selectedSourcePrimary?.id,
                              displayName: recoupement?.selectedSourcePrimary?.name
                        },
                        programStage,
                        program
                  };

                  let payloadSecondary = {
                        dataElement: recoupement?.secondaryValue,
                        indicator: recoupement?.selectedSourceSecondary && {
                              id: recoupement?.selectedSourceSecondary?.id,
                              displayName: recoupement?.selectedSourceSecondary?.name
                        },
                        programStage,
                        program
                  };
                  let payloadMargin = {
                        dataElement: recoupement?.margin,
                        indicator: recoupement?.selectedSourceMargin && {
                              id: recoupement?.selectedSourceMargin,
                              displayName: recoupement?.selectedSourceMargin
                        },
                        programStage,
                        program
                  };

                  if (payloadPrimary.dataElement?.id && payloadPrimary.indicator?.id) newList.push(payloadPrimary);
                  if (payloadSecondary.dataElement?.id && payloadSecondary.indicator?.id)
                        newList.push(payloadSecondary);
                  if (payloadMargin.dataElement?.id && payloadMargin.indicator?.id) newList.push(payloadMargin);
            }

            // consistencyOvertime
            for (let consistencyOvertime of formState?.consistencyOvertimes) {
                  let payloadConsistency = {
                        dataElement: consistencyOvertime?.value,
                        indicator: consistencyOvertime?.selectedSourceConsistency && {
                              id: consistencyOvertime?.selectedSourceConsistency?.id,
                              displayName: consistencyOvertime?.selectedSourceConsistency?.name
                        },
                        programStage,
                        program
                  };

                  let payloadMargin = {
                        dataElement: consistencyOvertime?.margin,
                        indicator: consistencyOvertime?.selectedSourceMargin && {
                              id: consistencyOvertime.selectedSourceMargin,
                              displayName: consistencyOvertime.selectedSourceMargin
                        },
                        program,
                        programStage
                  };

                  if (payloadConsistency.dataElement?.id && payloadConsistency.indicator?.id)
                        newList.push(payloadConsistency);
                  if (payloadMargin.dataElement?.id && payloadMargin.indicator?.id) newList.push(payloadMargin);
            }

            //data element et source document completness
            if (formState?.completeness) {
                  if (formState?.completeness?.register && formState?.completeness?.selectedRegister) {
                        let payloadRegistre = {
                              dataElement: formState?.completeness?.selectedRegister,
                              indicator: formState?.completeness?.register && {
                                    id: formState?.completeness?.register?.id,
                                    displayName: formState?.completeness?.register?.name
                              },
                              programStage,
                              program
                        };

                        if (payloadRegistre.dataElement?.id && payloadRegistre.indicator?.id)
                              newList.push(payloadRegistre);
                  }

                  if (
                        formState?.completeness?.selectedNbrDataElementsToShow &&
                        formState?.completeness?.nbrDataElementsToShow
                  ) {
                        let payloadNbrDataElementToShow = {
                              dataElement: formState?.completeness?.selectedNbrDataElementsToShow,
                              indicator: formState?.completeness?.nbrDataElementsToShow && {
                                    id: formState?.completeness?.nbrDataElementsToShow,
                                    displayName: formState?.completeness?.nbrDataElementsToShow
                              },
                              programStage,
                              program
                        };

                        if (payloadNbrDataElementToShow.dataElement?.id && payloadNbrDataElementToShow.indicator?.id)
                              newList.push(payloadNbrDataElementToShow);
                  }

                  if (
                        formState?.completeness?.selectedNbrDocumentsSourceToShow &&
                        formState?.completeness?.nbrDocumentsSourceToShow
                  ) {
                        let payloadNbrDocumentsSourceToShow = {
                              dataElement: formState?.completeness?.selectedNbrDocumentsSourceToShow,
                              indicator: formState?.completeness?.nbrDocumentsSourceToShow && {
                                    id: formState?.completeness?.nbrDocumentsSourceToShow,
                                    displayName: formState?.completeness?.nbrDocumentsSourceToShow
                              },
                              programStage,
                              program
                        };

                        if (
                              payloadNbrDocumentsSourceToShow.dataElement?.id &&
                              payloadNbrDocumentsSourceToShow.indicator?.id
                        )
                              newList.push(payloadNbrDocumentsSourceToShow);
                  }

                  if (formState?.completeness?.margin && formState?.completeness?.selectedSourceMargin) {
                        let payloadMargin = {
                              dataElement: formState?.completeness?.margin,
                              indicator: formState?.completeness?.selectedSourceMargin && {
                                    id: formState?.completeness?.selectedSourceMargin,
                                    displayName: formState?.completeness?.selectedSourceMargin
                              },
                              programStage,
                              program
                        };

                        if (payloadMargin.dataElement?.id && payloadMargin.indicator?.id) newList.push(payloadMargin);
                  }

                  for (let de of formState?.completeness?.dataElements) {
                        let payloadDE = {
                              dataElement: de?.value,
                              indicator: de?.selectedSourceDE && {
                                    id: de?.selectedSourceDE?.id,
                                    displayName: de?.selectedSourceDE?.name
                              },
                              programStage,
                              program
                        };

                        if (payloadDE.dataElement?.id && payloadDE.indicator?.id) newList.push(payloadDE);
                  }

                  for (let doc of formState?.completeness?.sourceDocuments) {
                        let payloadDOC = {
                              dataElement: doc?.value,
                              indicator: doc?.selectedSourceDS && {
                                    id: doc?.selectedSourceDS?.id,
                                    displayName: doc?.selectedSourceDS?.name
                              },
                              programStage,
                              program
                        };

                        if (payloadDOC.dataElement?.id && payloadDOC.indicator?.id) newList.push(payloadDOC);
                  }
            }

            if (formState?.nbrIndicatorsToShow && formState?.selectedNbrIndicatorsToShow) {
                  let payloadIndicatorToShow = {
                        dataElement: formState?.selectedNbrIndicatorsToShow,
                        indicator: formState?.nbrIndicatorsToShow && {
                              id: formState?.nbrIndicatorsToShow,
                              displayName: formState?.nbrIndicatorsToShow
                        },
                        programStage,
                        program
                  };

                  if (payloadIndicatorToShow.dataElement?.id && payloadIndicatorToShow.indicator?.id)
                        newList.push(payloadIndicatorToShow);
            }

            if (formState?.globalProgramArea && formState?.selectedGlobalProgramArea) {
                  let payloadGlobalProgramArea = {
                        dataElement: formState?.globalProgramArea,
                        indicator: formState?.selectedGlobalProgramArea && {
                              id: formState?.selectedGlobalProgramArea?.name,
                              displayName: formState?.selectedGlobalProgramArea?.name
                        },
                        programStage,
                        program
                  };

                  if (payloadGlobalProgramArea.dataElement?.id && payloadGlobalProgramArea.indicator?.id)
                        newList.push(payloadGlobalProgramArea);
            }

            return newList;
      };

      const getEachDataElementsForRDQA = () => {
            let newList = [];

            const programStage = {
                  id: formState?.selectedProgramStage?.id,
                  displayName: formState?.selectedProgramStage?.displayName
            };
            const program = {
                  id: formState?.selectedProgram?.program?.id,
                  displayName: formState?.selectedProgram?.program?.displayName
            };

            for (let indicator of indicatorFieldsForRDQA) {
                  const indicatorPaylaod = {
                        dataElement: indicator?.value,
                        indicator: indicator?.source && {
                              id: indicator?.source?.name,
                              displayName: indicator?.source?.name
                        },
                        programStage,
                        program
                  };

                  if (indicatorPaylaod.dataElement && indicatorPaylaod.indicator) newList.push(indicatorPaylaod);

                  for (let recoupement of indicator?.recoupements) {
                        const recoupementPayload = {
                              dataElement: recoupement?.value,
                              indicator: recoupement?.source && {
                                    id: recoupement?.source?.name,
                                    displayName: recoupement?.source?.name
                              },
                              programStage,
                              program
                        };
                        if (recoupementPayload.dataElement && recoupementPayload.indicator)
                              newList.push(recoupementPayload);
                  }
            }

            return newList;
      };

      const handleAddFavoritBackgroundInformationSave = async () => {
            try {
                  setLoadingSaveFavoritBackgroundInformations(true);

                  let backgroundInformationConfigList = [];
                  const backgroundInfoList = await loadDataStore(
                        process.env.REACT_APP_BACKGROUND_INFORMATION_FAVORITS_KEY,
                        null,
                        null,
                        []
                  );

                  if (
                        !formState?.inputFavorisNameForBackgroundInforation ||
                        formState?.inputFavorisNameForBackgroundInforation?.trim()?.length === 0
                  )
                        throw new Error(translate('Nom_Obligatoire'));

                  let payload = {
                        name: formState?.inputFavorisNameForBackgroundInforation,
                        configs:
                              formState?.selectedProgram?.configurationType === RDQA
                                    ? getEachDataElementsForRDQA()
                                    : getEachDataElements(),
                        program: formState?.selectedProgram?.program,
                        formState:
                              formState?.selectedProgram?.configurationType === RDQA
                                    ? { ...formState, indicatorFieldsForRDQA }
                                    : formState,
                        createdAt: dayjs(),
                        updatedAt: dayjs()
                  };

                  if (formState?.selectedBackgroundInformationFavorit && backgroundInfoList) {
                        backgroundInformationConfigList = backgroundInfoList.map(favo => {
                              if (favo.id === formState?.selectedBackgroundInformationFavorit?.id) {
                                    return {
                                          ...favo,
                                          ...payload
                                    };
                              }
                              return favo;
                        });
                  } else {
                        payload.id = uuid();
                        backgroundInformationConfigList = [payload, ...backgroundInfoList];
                  }

                  saveDataToDataStore(
                        process.env.REACT_APP_BACKGROUND_INFORMATION_FAVORITS_KEY,
                        backgroundInformationConfigList
                  );

                  setVisibleAddFavoritBackgroundInformationModal(false);
                  setNotification({
                        show: true,
                        message: translate('Favorit_Enregistrer_Avec_Succes'),
                        type: NOTIFICATION_SUCCESS
                  });
                  setLoadingSaveFavoritBackgroundInformations(false);
                  setFormState({
                        ...formState,
                        inputFavorisNameForBackgroundInforation: '',
                        selectedBackgroundInformationFavorit: null,
                        selectedProgramStage: null
                  });
                  loadDataStoreBackgroundInformationFavoritsConfigs();
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
                  setLoadingSaveFavoritBackgroundInformations(false);
                  setVisibleAddFavoritBackgroundInformationModal(false);
            }
      };

      const RenderAddFavoritBackgroundInformationModal = () =>
            visibleAddFavoritBackgroundInformationModal && (
                  <>
                        <Modal onClose={handleCloseAddFavoritForBackgroundInformation} dense small>
                              <ModalTitle>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                          {translate('Enregistrement_Favorit')}
                                    </div>
                              </ModalTitle>
                              <ModalContent>
                                    <div
                                          style={{
                                                padding: '20px',
                                                border: '1px solid #ccc'
                                          }}
                                    >
                                          <div
                                                style={{
                                                      marginTop: '10px',
                                                      padding: '10px',
                                                      background: '#CAF0F8',
                                                      fontSize: '13px',
                                                      fontWeight: 'bold'
                                                }}
                                          >
                                                {translate('Nom_Claire_Favorit')}
                                          </div>
                                          <div style={{ marginTop: '10px' }}>
                                                <div style={{ marginBottom: '5px' }}>{translate('Nom')}</div>
                                                <Input
                                                      placeholder={translate('Nom')}
                                                      style={{ width: '100%' }}
                                                      value={formState?.inputFavorisNameForBackgroundInforation}
                                                      onChange={event =>
                                                            setFormState({
                                                                  ...formState,
                                                                  inputFavorisNameForBackgroundInforation:
                                                                        event.target.value
                                                            })
                                                      }
                                                />
                                          </div>
                                    </div>
                              </ModalContent>
                              <ModalActions>
                                    <ButtonStrip end>
                                          <Button
                                                destructive
                                                onClick={handleCloseAddFavoritForBackgroundInformation}
                                                icon={<CgCloseO style={{ fontSize: '18px' }} />}
                                                small
                                          >
                                                {translate('Annuler')}
                                          </Button>
                                          <Button
                                                small
                                                primary
                                                loading={loadingSaveFavoritBackgroundInformations}
                                                disabled={
                                                      formState?.inputFavorisNameForBackgroundInforation?.trim()
                                                            ?.length > 0
                                                            ? false
                                                            : true
                                                }
                                                onClick={handleAddFavoritBackgroundInformationSave}
                                                icon={<FiSave style={{ fontSize: '18px' }} />}
                                          >
                                                {translate('Enregistrer')}
                                          </Button>
                                    </ButtonStrip>
                              </ModalActions>
                        </Modal>
                  </>
            );

      const handleSaveAsFavoritesForBackgroundInformations = () => {
            setVisibleAddFavoritBackgroundInformationModal(true);
      };

      const handleDeleteFavoritesForBackgroundInformations = async () => {
            try {
                  setLoadingDeleteFavoritBackgroundInformations(true);
                  if (formState?.selectedBackgroundInformationFavorit) {
                        let newFavoritList = [];
                        const backgroundInfoList = await loadDataStore(
                              process.env.REACT_APP_BACKGROUND_INFORMATION_FAVORITS_KEY,
                              null,
                              null,
                              []
                        );

                        newFavoritList = backgroundInfoList.filter(
                              fav => fav.id !== formState?.selectedBackgroundInformationFavorit.id
                        );

                        await saveDataToDataStore(
                              process.env.REACT_APP_BACKGROUND_INFORMATION_FAVORITS_KEY,
                              newFavoritList
                        );

                        setFavoritBackgroundInformationList(newFavoritList);
                        setFormState({
                              ...formState,
                              selectedBackgroundInformationFavorit: null,
                              inputFavorisNameForBackgroundInforation: '',
                              selectedProgramStage: null,
                              selectedBackgroundInformationTypeConfiguration: DIRECTE
                        });
                        // setMappingConfigs([]);
                        setSelectedBackgroundInformationFavorit(null);

                        setNotification({
                              show: true,
                              type: NOTIFICATION_SUCCESS,
                              message: translate('Favorite_Deleted_Success')
                        });
                        setLoadingDeleteFavoritBackgroundInformations(false);
                  }
            } catch (err) {
                  setNotification({
                        show: true,
                        type: NOTIFICATION_CRITICAL,
                        message: err.response?.data?.message || err.message
                  });
                  setLoadingDeleteFavoritBackgroundInformations(false);
            }
      };

      const loadDataStoreCrosschecks = async () => {
            try {
                  const response = await loadDataStore(process.env.REACT_APP_CROSS_CUT_KEY, null, null, []);
                  setDataStoreCrosschecks(response);
            } catch (err) {}
      };

      const loadDataStoreIndicators = async () => {
            try {
                  const response = await loadDataStore(process.env.REACT_APP_INDICATORS_KEY, null, null, []);
                  setDataStoreIndicators(response);
            } catch (err) {}
      };

      const loadDataStoreIndicatorsMapping = async () => {
            try {
                  if (process.env.REACT_APP_HIDDEN_NON_MAPPED === 'YES') {
                        const response = await loadDataStore(
                              process.env.REACT_APP_INDICATORS_MAPPING_KEY,
                              null,
                              null,
                              []
                        );

                        setDataStoreIndicatorsMapping(response || []);
                  }
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
                  setSelectedBackgroundInformationFavorit(null);
                  setLoadingBackgroundInformationFavoritsConfigs(false);
            } catch (err) {
                  setLoadingBackgroundInformationFavoritsConfigs(false);
            }
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
                              {translate('Indicators_Configuration')}
                        </div>
                        <div style={{ padding: '10px' }}>
                              <Row gutter={[10, 10]}>
                                    <Col md={24}>
                                          <div style={{ marginTop: '10px' }}>
                                                <div>
                                                      <Radio
                                                            label={translate('Venant_Des_Favoris')}
                                                            className="cursor-pointer"
                                                            onChange={
                                                                  handleChangeSelectionTypeConfigurationForBackgroundInformation
                                                            }
                                                            value={FAVORIS}
                                                            checked={
                                                                  formState?.selectedBackgroundInformationTypeConfiguration ===
                                                                  FAVORIS
                                                            }
                                                      />
                                                </div>
                                                <div>
                                                      <Radio
                                                            label={translate('Create_New_Configuration') + ' ? '}
                                                            className="cursor-pointer"
                                                            onChange={
                                                                  handleChangeSelectionTypeConfigurationForBackgroundInformation
                                                            }
                                                            value={DIRECTE}
                                                            checked={
                                                                  formState?.selectedBackgroundInformationTypeConfiguration ===
                                                                  DIRECTE
                                                            }
                                                      />
                                                </div>
                                          </div>
                                    </Col>
                                    <Col md={24}>
                                          <hr style={{ margin: '10px auto', color: '#ccc' }} />
                                    </Col>

                                    {formState?.selectedBackgroundInformationTypeConfiguration === FAVORIS && (
                                          <Col md={24}>
                                                <div>
                                                      <div style={{ marginBottom: '5px' }}>
                                                            {translate('Select_Favorit')}
                                                      </div>
                                                      <Select
                                                            options={favoritBackgroundInformationList
                                                                  .filter(
                                                                        f =>
                                                                              f.program?.id ===
                                                                              formState?.selectedProgram?.program?.id
                                                                  )
                                                                  .map(favorit => ({
                                                                        label: favorit.name,
                                                                        value: favorit.id
                                                                  }))}
                                                            placeholder={translate('Select_Favorit')}
                                                            style={{ width: '100%' }}
                                                            optionFilterProp="label"
                                                            loading={loadingBackgroundInformationFavoritsConfigs}
                                                            value={formState?.selectedBackgroundInformationFavorit?.id}
                                                            onChange={handleSelectBackgroundInformationFavorit}
                                                            showSearch
                                                      />
                                                </div>
                                          </Col>
                                    )}

                                    <Col md={24}>
                                          <div>
                                                <div style={{ marginBottom: '5px' }}>
                                                      {translate('Programmes_Stage')}
                                                </div>
                                                <Select
                                                      options={programStages
                                                            .filter(p =>
                                                                  formState?.selectedProgram
                                                                        ? formState?.selectedProgram?.programStageConfigurations
                                                                                ?.map(f => f.programStage?.id)
                                                                                ?.includes(p.id)
                                                                        : true
                                                            )
                                                            .map(programStage => ({
                                                                  label: programStage.displayName,
                                                                  value: programStage.id
                                                            }))}
                                                      placeholder={translate('Programmes_Stage')}
                                                      style={{ width: '100%' }}
                                                      optionFilterProp="label"
                                                      value={formState?.selectedProgramStage?.id}
                                                      onChange={handleSelectProgramStage}
                                                      showSearch
                                                      allowClear
                                                      loading={loadingProgramStages}
                                                      disabled={
                                                            formState?.selectedBackgroundInformationTypeConfiguration ===
                                                            FAVORIS
                                                                  ? true
                                                                  : loadingProgramStages
                                                      }
                                                />
                                          </div>
                                    </Col>

                                    <Col md={24} xs={24}>
                                          <div style={{ marginTop: '18px', display: 'flex' }}>
                                                {formState?.selectedBackgroundInformationTypeConfiguration ===
                                                      FAVORIS && (
                                                      <div style={{ marginRight: '10px' }}>
                                                            <Popconfirm
                                                                  title={translate(
                                                                        'Confirmation_Suppression_Configuration'
                                                                  )}
                                                                  onConfirm={
                                                                        handleDeleteFavoritesForBackgroundInformations
                                                                  }
                                                            >
                                                                  <Button
                                                                        destructive
                                                                        loading={
                                                                              loadingDeleteFavoritBackgroundInformations
                                                                        }
                                                                        icon={
                                                                              <RiDeleteBinLine
                                                                                    style={{
                                                                                          color: 'white',
                                                                                          fontSize: '20px',
                                                                                          cursor: 'pointer'
                                                                                    }}
                                                                              />
                                                                        }
                                                                        disabled={
                                                                              formState?.selectedBackgroundInformationTypeConfiguration ===
                                                                              FAVORIS
                                                                                    ? formState?.selectedBackgroundInformationFavorit
                                                                                          ? false
                                                                                          : true
                                                                                    : false
                                                                        }
                                                                  >
                                                                        {translate('Suppression')}
                                                                  </Button>
                                                            </Popconfirm>
                                                      </div>
                                                )}

                                                <div>
                                                      <Button
                                                            primary
                                                            loading={loadingSaveFavoritBackgroundInformations}
                                                            onClick={handleSaveAsFavoritesForBackgroundInformations}
                                                            icon={
                                                                  <MdStars
                                                                        style={{
                                                                              color: 'white',
                                                                              fontSize: '20px',
                                                                              cursor: 'pointer'
                                                                        }}
                                                                  />
                                                            }
                                                            disabled={
                                                                  formState?.selectedBackgroundInformationTypeConfiguration ===
                                                                  FAVORIS
                                                                        ? formState?.selectedBackgroundInformationFavorit
                                                                              ? false
                                                                              : true
                                                                        : false
                                                            }
                                                      >
                                                            {formState?.selectedBackgroundInformationTypeConfiguration ===
                                                            DIRECTE
                                                                  ? translate('Enregistrer_Comme_Favorites')
                                                                  : translate('Mise_A_Jour')}
                                                      </Button>
                                                </div>
                                          </div>
                                    </Col>
                              </Row>
                        </div>
                  </Card>
            </div>
      );

      const filteredIndicatorsFromIndicatorsMapping = () => {
            return process.env.REACT_APP_HIDDEN_NON_MAPPED === 'YES'
                  ? dataStoreIndicators?.reduce((prev, curr) => {
                          prev.push({
                                name: curr.name,
                                children: curr.children?.filter(d =>
                                      dataStoreIndicatorsMapping?.find(
                                            mapping =>
                                                  mapping.group === curr.name &&
                                                  mapping.indicator === d.name &&
                                                  mapping.dhis2?.id
                                      )
                                )
                          });

                          return prev;
                    }, [])
                  : dataStoreIndicators;
      };

      const RenderTitle = () => (
            <div
                  style={{
                        padding: '20px',
                        borderBottom: '1px solid #ccc',
                        background: '#FFF'
                  }}
            >
                  <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{translate('Create_Favorites')}</span>
            </div>
      );

      const RenderContent = () => (
            <div>
                  <RenderTitle />
                  <div style={{ marginTop: '10px', padding: '10px' }}>
                        <Row gutter={[12, 12]}>
                              <Col sm={24} md={6}>
                                    <div style={{ position: 'sticky', top: 0 }}>
                                          {RenderSelectedSupervisionTypeList()}
                                          {formState?.selectedProgram && RenderDataElementConfigContent()}
                                    </div>
                              </Col>
                              <Col sm={24} md={18}>
                                    {formState?.selectedProgramStage &&
                                          formState?.selectedProgram?.configurationType === DQR && (
                                                <FavoriteGenerateIndicatorsFieldsDQR
                                                      formState={formState}
                                                      setFormState={setFormState}
                                                      // dataStoreIndicators={
                                                      //       filteredIndicatorsFromIndicatorsMapping() || []
                                                      // }
                                                      dataStoreIndicators={dataStoreIndicators}
                                                      dataStoreCrosschecks={dataStoreCrosschecks}
                                                      dataStoreDECompletness={dataStoreDECompletness}
                                                      dataStoreDSCompletness={dataStoreDSCompletness}
                                                      dataStoreRegistres={dataStoreRegistres}
                                                />
                                          )}

                                    {formState?.selectedProgramStage &&
                                          formState?.selectedProgram?.configurationType === RDQA && (
                                                <FavoriteGenerateIndicatorsFieldsRDQA
                                                      formState={formState}
                                                      indicatorFieldsForRDQA={indicatorFieldsForRDQA}
                                                      setIndicatorFieldsForRDQA={setIndicatorFieldsForRDQA}
                                                />
                                          )}
                              </Col>
                        </Row>
                  </div>
            </div>
      );

      const RenderAnalyticComponentModal = () =>
            visibleAnalyticComponentModal ? (
                  <Modal onClose={() => handleCancelAnalyticComponentModal()} large>
                        <ModalTitle>
                              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    {translate('Source_De_Donnee')}
                              </div>
                        </ModalTitle>
                        <ModalContent>
                              {!formIndicatorConfiguration?.currentElement && <div>Error no data </div>}

                              {formIndicatorConfiguration?.currentElement && (
                                    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
                                          {selectedTypeSource === 'DHIS2' && (
                                                <DataDimension
                                                      selectedDimensions={selectedMetaDatas.map(it => ({
                                                            ...it,
                                                            isDeactivated: true
                                                      }))}
                                                      onSelect={value => {
                                                            setSelectedMetaDatas(
                                                                  value?.items?.length > 0 ? [value.items[0]] : []
                                                            );
                                                      }}
                                                      displayNameProp="displayName"
                                                />
                                          )}

                                          {selectedTypeSource === 'GROUPS' && (
                                                <div>Donc on affiche la liste venant du data store</div>
                                          )}
                                    </div>
                              )}
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

      const RenderAnalyticComponentModalForRecoupement = () =>
            visibleAnalyticComponentModalForCrossCheck ? (
                  <Modal onClose={() => handleCancelAnalyticComponentModal()} large>
                        <ModalTitle>
                              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    {translate('Source_De_Donnee')}
                              </div>
                        </ModalTitle>
                        <ModalContent>
                              <div>
                                    <div style={{ marginBottom: '5px' }}>Indicator groups</div>
                                    <Select
                                          placeholder="Indicator groups"
                                          options={dataStoreCrosschecks?.map(cross => ({
                                                label: cross.name,
                                                value: cross.name
                                          }))}
                                          onChange={value =>
                                                setSelectedCrosscheck(
                                                      dataStoreCrosschecks?.find(cross => cross.name === value)
                                                )
                                          }
                                          value={selectedCrosscheck?.name}
                                          style={{ width: '100%' }}
                                          optionFilterProp="label"
                                          showSearch
                                    />
                              </div>
                              {selectedCrosscheck && (
                                    <div style={{ marginTop: '10px' }}>
                                          <div style={{ marginBottom: '5px' }}>Cross cut</div>
                                          <Select
                                                placeholder="Cross cut"
                                                options={selectedCrosscheck?.children?.map(cross => ({
                                                      label: cross.name,
                                                      value: cross.name
                                                }))}
                                                onChange={value =>
                                                      setSelectedCrosscheckChild(
                                                            selectedCrosscheck?.children?.find(
                                                                  cross => cross.name === value
                                                            )
                                                      )
                                                }
                                                value={selectedCrosscheckChild?.name}
                                                style={{ width: '100%' }}
                                                optionFilterProp="label"
                                                showSearch
                                          />
                                    </div>
                              )}
                        </ModalContent>
                        <ModalActions>
                              <ButtonStrip end>
                                    <Button
                                          destructive
                                          onClick={() => {
                                                setVisibleAnalyticComponentModalForCrossCheck(false);
                                                setSelectedCrosscheckChild(null);
                                                setSelectedCrosscheck(null);
                                          }}
                                          icon={<CgCloseO style={{ fontSize: '18px' }} />}
                                    >
                                          {translate('Annuler')}
                                    </Button>
                                    <Button
                                          primary
                                          onClick={() => {
                                                setFormIndicatorConfiguration({
                                                      ...formIndicatorConfiguration,
                                                      selectedRecoupements:
                                                            formIndicatorConfiguration?.selectedRecoupements?.map(
                                                                  rec => {
                                                                        if (
                                                                              formIndicatorConfiguration?.currentElement
                                                                                    ?.dataElement?.id ===
                                                                              rec?.dataElement?.id
                                                                        ) {
                                                                              return {
                                                                                    ...rec,
                                                                                    source: selectedCrosscheckChild
                                                                              };
                                                                        }
                                                                        return rec;
                                                                  }
                                                            )
                                                });

                                                setSelectedCrosscheck(null);
                                                setSelectedCrosscheckChild(null);
                                                setVisibleAnalyticComponentModalForCrossCheck(false);
                                          }}
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

      useEffect(() => {
            loadDataStoreSupervisionConfigs();
            loadDataStoreCrosschecks();
            loadDataStoreIndicators();
            loadDataStoreIndicatorsMapping();
            loadDataStoreDECompletness();
            loadDataStoreDSCompletness();
            loadDataStoreRegistres();
            loadDataStoreBackgroundInformationFavoritsConfigs();
      }, []);

      useEffect(() => {
            if (formState?.selectedProgram?.program) {
                  loadProgramStages(formState.selectedProgram.program?.id);
            }
      }, [formState?.selectedProgram?.program]);

      useEffect(() => {
            if (formState?.selectedProgramStage) {
                  initFields();
                  !formState?.selectedBackgroundInformationFavorit && initFieldsForRDQA();
            }
      }, [formState?.selectedProgramStage]);

      return (
            <>
                  {RenderContent()}
                  {RenderAddFavoritBackgroundInformationModal()}
                  {RenderAnalyticComponentModal()}
                  {RenderAnalyticComponentModalForRecoupement()}
                  <MyNotification notification={notification} setNotification={setNotification} />
            </>
      );
};

export default Favorites;
