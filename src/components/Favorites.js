import { useState, useEffect } from 'react';
import { Card, Col, Input, Popconfirm, Row, Select, Table } from 'antd';

import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle, Radio } from '@dhis2/ui';
import { MdStars } from 'react-icons/md';
import { FiSave } from 'react-icons/fi';
import { CgCloseO } from 'react-icons/cg';
import { TbSelect } from 'react-icons/tb';
import translate from '../utils/translator';
import MyNotification from './MyNotification';
import {
      ALL,
      DIRECTE,
      ELEMENT_GROUP,
      FAVORIS,
      NOTIFICATION_CRITICAL,
      NOTIFICATION_SUCCESS,
      ORGANISATION_UNIT
} from '../utils/constants';

import { loadDataStore, saveDataToDataStore } from '../utils/functions';
import { DATA_ELEMENT_GROUPS_ROUTE, PROGRAMS_STAGE_ROUTE } from '../utils/api.routes';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { DataDimension } from '@dhis2/analytics';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { RiDeleteBinLine } from 'react-icons/ri';
import dayjs from 'dayjs';
import FavoriteGenerateIndicatorsFieldsDQR from './FavoriteGenerateIndicatorsFieldsDQR';

const Favorites = ({ me }) => {
      const [programStages, setProgramStages] = useState([]);
      const [mappingConfigs, setMappingConfigs] = useState([]);
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

      const [selectedTypeSource, setSelectedTypeSource] = useState('DHIS2');

      const [dataStoreCrosschecks, setDataStoreCrosschecks] = useState([]);
      const [dataStoreIndicators, setDataStoreIndicators] = useState([]);
      const [dataStoreDECompletness, setDataStoreDECompletness] = useState([]);
      const [dataStoreDSCompletness, setDataStoreDSCompletness] = useState([]);
      const [dataStoreSupervisionConfigs, setDataStoreSupervisionConfigs] = useState([]);

      const [selectedCrosscheck, setSelectedCrosscheck] = useState(null);
      const [selectedCrosscheckChild, setSelectedCrosscheckChild] = useState(null);
      const [visibleAnalyticComponentModalForCrossCheck, setVisibleAnalyticComponentModalForCrossCheck] =
            useState(false);

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
            const currStage = formState.selectedProgram?.programStageConfigurations?.find(
                  pstage => pstage.programStage?.id === formState.selectedProgramStage?.id
            );
            const existingFormState = formState?.selectedBackgroundInformationFavorit?.formState;

            if (currStage) {
                  setFormState({
                        ...formState,
                        selectedNbrIndicatorsToShow: currStage.selectedNbrIndicatorsToShow,
                        nbrIndicatorsToShow: existingFormState?.nbrIndicatorsToShow
                              ? existingFormState?.nbrIndicatorsToShow
                              : currStage.indicators?.filter(ind => ind.value && ind.programArea)?.length || 0,

                        indicators:
                              currStage.indicators
                                    ?.filter(ind => ind.value && ind.programArea)
                                    ?.map((ind, index) => ({
                                          ...ind,
                                          selectedSourceProgramArea:
                                                existingFormState?.indicators[index]?.selectedSourceProgramArea || null,
                                          selectedSourceIndicator:
                                                existingFormState?.indicators[index]?.selectedSourceIndicator || null,
                                          selectedSourceMargin:
                                                existingFormState?.indicators[index]?.selectedSourceMargin || null
                                    })) || [],
                        recoupements:
                              currStage.recoupements
                                    ?.filter(rec => rec.primaryValue && rec.secondaryValue && rec.programArea)
                                    ?.map((ind, index) => ({
                                          ...ind,
                                          selectedSourceProgramArea:
                                                existingFormState?.recoupements[index]?.selectedSourceProgramArea ||
                                                null,
                                          selectedSourcePrimary:
                                                existingFormState?.recoupements[index]?.selectedSourcePrimary || null,
                                          selectedSourceSecondary:
                                                existingFormState?.recoupements[index]?.selectedSourceSecondary || null,
                                          selectedSourceMargin:
                                                existingFormState?.recoupements[index]?.selectedSourceMargin || null
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
                                                existingFormState?.consistencyOvertimes[index]?.selectedSourceMargin ||
                                                null
                                    })) || [],

                        completeness: {
                              ...currStage.completeness,
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
                                                            existingFormState?.completeness?.sourceDocuments[index]
                                                                  ?.selectedSourceDS || null
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
      };

      const handleClickSupervisionItem = sup => {
            setFormState({
                  ...formState,
                  selectedProgram: sup,
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
                  selectedProgramStage: null,
                  selectedBackgroundInformationFavorit: null
            });
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

      const handleDeleteConfigItem = async value => {
            try {
                  if (value) {
                        const newList = mappingConfigs.filter(mapConf => mapConf.id !== value.id);
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
                              id: indicator?.selectedSourceIndicator?.name,
                              displayName: indicator?.selectedSourceIndicator?.name
                        },
                        programStage,
                        program
                  };

                  let payloadProgramArea = {
                        dataElement: indicator?.programArea,
                        indicator: indicator?.selectedSourceProgramArea && {
                              id: indicator.selectedSourceProgramArea.name,
                              displayName: indicator.selectedSourceProgramArea.name
                        },
                        program,
                        programStage
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

                  if (payloadProgramArea.dataElement && payloadProgramArea.indicator) newList.push(payloadProgramArea);
                  if (payloadIndicator.dataElement && payloadIndicator.indicator) newList.push(payloadIndicator);
                  if (payloadMargin.dataElement && payloadMargin.indicator) newList.push(payloadMargin);
            }

            // Recoupements
            for (let recoupement of formState?.recoupements) {
                  let payloadProgramArea = {
                        dataElement: recoupement?.programArea,
                        indicator: recoupement?.selectedSourceProgramArea && {
                              id: recoupement?.selectedSourceProgramArea?.name,
                              displayName: recoupement?.selectedSourceProgramArea?.name
                        },
                        programStage,
                        program
                  };

                  let payloadPrimary = {
                        dataElement: recoupement?.primaryValue,
                        indicator: recoupement?.selectedSourcePrimary && {
                              id: recoupement?.selectedSourcePrimary?.name,
                              displayName: recoupement?.selectedSourcePrimary?.name
                        },
                        programStage,
                        program
                  };

                  let payloadSecondary = {
                        dataElement: recoupement?.secondaryValue,
                        indicator: recoupement?.selectedSourceSecondary && {
                              id: recoupement?.selectedSourceSecondary?.name,
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

                  if (payloadProgramArea.dataElement && payloadProgramArea.indicator) newList.push(payloadProgramArea);
                  if (payloadPrimary.dataElement && payloadPrimary.indicator) newList.push(payloadPrimary);
                  if (payloadSecondary.dataElement && payloadSecondary.indicator) newList.push(payloadSecondary);
                  if (payloadMargin.dataElement && payloadMargin.indicator) newList.push(payloadMargin);
            }

            // consistencyOvertime
            for (let consistencyOvertime of formState?.consistencyOvertimes) {
                  let payloadConsistency = {
                        dataElement: consistencyOvertime?.value,
                        indicator: consistencyOvertime?.selectedSourceConsistency && {
                              id: consistencyOvertime?.selectedSourceConsistency?.name,
                              displayName: consistencyOvertime?.selectedSourceConsistency?.name
                        },
                        programStage,
                        program
                  };

                  let payloadProgramArea = {
                        dataElement: consistencyOvertime?.programArea,
                        indicator: consistencyOvertime?.selectedSourceProgramArea && {
                              id: consistencyOvertime.selectedSourceProgramArea.name,
                              displayName: consistencyOvertime.selectedSourceProgramArea.name
                        },
                        program,
                        programStage
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

                  if (payloadConsistency.dataElement && payloadConsistency.indicator) newList.push(payloadConsistency);
                  if (payloadMargin.dataElement && payloadMargin.indicator) newList.push(payloadMargin);
                  if (payloadProgramArea.dataElement && payloadProgramArea.indicator) newList.push(payloadProgramArea);
            }

            //data element et source document completness
            if (formState?.completeness) {
                  if (formState?.completeness?.programAreaDE && formState?.completeness?.selectedSourceProgramAreaDE) {
                        let payloadProgramAreaDE = {
                              dataElement: formState?.completeness?.programAreaDE,
                              indicator: formState?.completeness?.selectedSourceProgramAreaDE && {
                                    id: formState?.completeness?.selectedSourceProgramAreaDE?.name,
                                    displayName: formState?.completeness?.selectedSourceProgramAreaDE?.name
                              },
                              programStage,
                              program
                        };

                        if (payloadProgramAreaDE.dataElement && payloadProgramAreaDE.indicator)
                              newList.push(payloadProgramAreaDE);
                  }

                  if (formState?.completeness?.programAreaDOC && formState?.completeness?.selectedSourceProgramAreaDS) {
                        let payloadProgramAreaDS = {
                              dataElement: formState?.completeness?.programAreaDOC,
                              indicator: formState?.completeness?.selectedSourceProgramAreaDS && {
                                    id: formState?.completeness?.selectedSourceProgramAreaDS?.name,
                                    displayName: formState?.completeness?.selectedSourceProgramAreaDS?.name
                              },
                              programStage,
                              program
                        };

                        if (payloadProgramAreaDS.dataElement && payloadProgramAreaDS.indicator)
                              newList.push(payloadProgramAreaDS);
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

                        if (payloadMargin.dataElement && payloadMargin.indicator) newList.push(payloadMargin);
                  }

                  for (let de of formState?.completeness?.dataElements) {
                        let payloadDE = {
                              dataElement: de?.value,
                              indicator: de?.selectedSourceDE && {
                                    id: de?.selectedSourceDE?.name,
                                    displayName: de?.selectedSourceDE?.name
                              },
                              programStage,
                              program
                        };

                        if (payloadDE.dataElement && payloadDE.indicator) newList.push(payloadDE);
                  }

                  for (let doc of formState?.completeness?.sourceDocuments) {
                        let payloadDOC = {
                              dataElement: doc?.value,
                              indicator: doc?.selectedSourceDS && {
                                    id: doc?.selectedSourceDS?.name,
                                    displayName: doc?.selectedSourceDS?.name
                              },
                              programStage,
                              program
                        };

                        if (payloadDOC.dataElement && payloadDOC.indicator) newList.push(payloadDOC);
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

                  if (payloadIndicatorToShow.dataElement && payloadIndicatorToShow.indicator)
                        newList.push(payloadIndicatorToShow);
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
                        configs: getEachDataElements(),
                        program: formState?.selectedProgram?.program,
                        formState,
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

      const RenderContent = () => (
            <div>
                  {RenderTitle()}
                  <div style={{ marginTop: '10px', padding: '10px' }}>
                        <Row gutter={[12, 12]}>
                              <Col sm={24} md={6}>
                                    <div style={{ position: 'sticky', top: 0 }}>
                                          {RenderSelectedSupervisionTypeList()}
                                          {formState?.selectedProgram && RenderDataElementConfigContent()}
                                    </div>
                              </Col>
                              <Col sm={24} md={18}>
                                    {formState?.selectedProgramStage && (
                                          <FavoriteGenerateIndicatorsFieldsDQR
                                                formState={formState}
                                                setFormState={setFormState}
                                                dataStoreIndicators={dataStoreIndicators}
                                                dataStoreCrosschecks={dataStoreCrosschecks}
                                                dataStoreDECompletness={dataStoreDECompletness}
                                                dataStoreDSCompletness={dataStoreDSCompletness}
                                          />
                                    )}
                                    {/* {selectedProgram && RenderDataElementConfigList()} */}
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
            loadDataStoreDECompletness();
            loadDataStoreDSCompletness();
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
