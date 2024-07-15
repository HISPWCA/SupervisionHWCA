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

const Favorites = ({ me }) => {
      const [dataStoreSupervisionConfigs, setDataStoreSupervisionConfigs] = useState([]);
      const [programStages, setProgramStages] = useState([]);
      const [isNewMappingMode, setIsNewMappingMode] = useState(false);
      const [mappingConfigs, setMappingConfigs] = useState([]);
      const [dataElementGroups, setDataElementGroups] = useState([]);
      const [favoritBackgroundInformationList, setFavoritBackgroundInformationList] = useState([]);
      const [visibleAnalyticComponentModal, setVisibleAnalyticComponentModal] = useState(false);
      const [visibleAddFavoritBackgroundInformationModal, setVisibleAddFavoritBackgroundInformationModal] =
            useState(false);
      const [selectedBackgroundInformationTypeConfiguration, setSelectedBackgroundInformationTypeConfiguration] =
            useState(DIRECTE);
      const [selectedBackgroundInformationFavorit, setSelectedBackgroundInformationFavorit] = useState(null);
      const [selectedProgram, setSelectedProgram] = useState(null);
      const [selectedProgramStage, setSelectedProgramStage] = useState(null);
      const [selectedDataElement, setSelectedDataElement] = useState(null);
      const [selectedMetaDatas, setSelectedMetaDatas] = useState([]);
      const [selectedDataElementGroup, setSelectedDataElementGroup] = useState(null);
      const [inputFavorisNameForBackgroundInforation, setInputFavoritNameForBackgroundInforation] = useState('');
      const [inputDataSourceDisplayName, setInputDataSourceDisplayName] = useState('');
      const [inputDataSourceID, setInputDataSourceID] = useState(null);
      const [loadingSaveFavoritBackgroundInformations, setLoadingSaveFavoritBackgroundInformations] = useState(false);
      const [loadingDeleteFavoritBackgroundInformations, setLoadingDeleteFavoritBackgroundInformations] =
            useState(false);
      const [loadingProgramStages, setLoadingProgramStages] = useState(false);
      const [loadingSaveDateElementMappingConfig, setLoadingSaveDateElementMappingConfig] = useState(false);
      const [loadingBackgroundInformationFavoritsConfigs, setLoadingBackgroundInformationFavoritsConfigs] =
            useState(false);
      const [loadingDataElementGroups, setLoadingDataElementGroups] = useState(false);
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
      const [selectedCrosscheck, setSelectedCrosscheck] = useState(null);
      const [selectedCrosscheckChild, setSelectedCrosscheckChild] = useState(null);
      const [visibleAnalyticComponentModalForCrossCheck, setVisibleAnalyticComponentModalForCrossCheck] =
            useState(false);

      const handleSelectProgramStage = value => {
            setSelectedProgramStage(programStages.find(pstage => pstage.id === value));
            setSelectedDataElement(null);
      };

      const handleClickSupervisionItem = sup => {
            setSelectedDataElement(null);
            setMappingConfigs([]);

            loadProgramStages(sup.program?.id);
            setSelectedProgram(sup);
            handleSelectProgramStage(sup.programStageConfigurations[0]?.programStage?.id);
      };

      const loadProgramStages = async (programID, setState = null) => {
            try {
                  setLoadingProgramStages(true);

                  let route = `${PROGRAMS_STAGE_ROUTE},program,programStageDataElements[dataElement[id,displayName,dataElementGroups]]`;
                  if (programID) route = `${route}&filter=program.id:eq:${programID}`;

                  const response = await axios.get(route);

                  setProgramStages(response.data?.programStages || []);
                  setLoadingProgramStages(false);
            } catch (err) {
                  setLoadingProgramStages(false);
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
            setSelectedProgramStage(null);
            setMappingConfigs([]);
            setSelectedBackgroundInformationFavorit(null);

            setSelectedBackgroundInformationTypeConfiguration(value);
      };

      const handleSelectBackgroundInformationFavorit = value => {
            const currentFav = favoritBackgroundInformationList.find(b => b.id === value);
            if (currentFav) {
                  setSelectedBackgroundInformationFavorit(currentFav);
                  setInputFavoritNameForBackgroundInforation(currentFav.name);
                  setMappingConfigs(currentFav.configs);
            }
      };

      const handleOkAnalyticComponentModal = () => {
            console.log('selectedMetaDatas: ', selectedMetaDatas);
            formIndicatorConfiguration?.isIndicator &&
                  setFormIndicatorConfiguration({
                        ...formIndicatorConfiguration,
                        currentElement: null,
                        selectedIndicator: formIndicatorConfiguration?.selectedIndicator && {
                              ...formIndicatorConfiguration.selectedIndicator,
                              source: selectedMetaDatas[0]
                        }
                  });

            !formIndicatorConfiguration?.isIndicator &&
                  setFormIndicatorConfiguration({
                        ...formIndicatorConfiguration,
                        currentElement: null,
                        selectedRecoupements: formIndicatorConfiguration?.selectedRecoupements?.map(rec => {
                              if (rec.dataElement?.id === formIndicatorConfiguration?.currentElement?.dataElement?.id) {
                                    return {
                                          ...formIndicatorConfiguration?.currentElement,
                                          source: selectedMetaDatas[0]
                                    };
                              }

                              return rec;
                        })
                  });

            setSelectedMetaDatas([]);
            setVisibleAnalyticComponentModal(false);
      };

      const handleCancelAnalyticComponentModal = () => {
            setSelectedMetaDatas([]);
            setVisibleAnalyticComponentModal(false);
      };

      const handleSelectDataElement = value => {
            const found_indicators = selectedProgram?.programStageConfigurations[0]?.indicatorsFieldsConfigs.find(
                  dataElement => dataElement.value?.id === value
            );
            console.log('found_indicators:', found_indicators);

            if (found_indicators) {
                  setFormIndicatorConfiguration({
                        ...formIndicatorConfiguration,
                        selectedIndicator: {
                              ...formIndicatorConfiguration?.selectedIndicator,
                              dataElement: found_indicators.value,
                              source: null
                        },

                        selectedRecoupements:
                              found_indicators.recoupements?.map(rec => ({ source: null, dataElement: rec.value })) ||
                              []
                  });
            }
      };

      // const handleSelectedDataElementFromWhere = ({ value }) => {
      //       setSelectedDataElement(null);
      //       setSelectedDataElementFromWhere(value);
      //       if (value === ALL) setSelectedDataElementGroup(null);
      // };

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
                                                            selectedProgram?.id === sup.id ? 'active' : ''
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
                        !inputFavorisNameForBackgroundInforation ||
                        inputFavorisNameForBackgroundInforation?.trim()?.length === 0
                  )
                        throw new Error(translate('Nom_Obligatoire'));

                  // if (
                  //       !selectedBackgroundInformationFavorit &&
                  //       selectedBackgroundInformationTypeConfiguration === DIRECTE &&
                  //       favoritBackgroundInformationList
                  //             .map(f => f.name?.trim())
                  //             .includes(inputFavorisNameForBackgroundInforation?.trim())
                  // ) {
                  //       throw new Error(translate('Favorit_Exist_Deja'));
                  // }

                  let payload = {
                        name: inputFavorisNameForBackgroundInforation,
                        configs: mappingConfigs,
                        program: selectedProgram?.program,
                        createdAt: dayjs(),
                        updatedAt: dayjs()
                  };

                  if (
                        selectedBackgroundInformationTypeConfiguration === FAVORIS &&
                        selectedBackgroundInformationFavorit &&
                        backgroundInfoList
                  ) {
                        backgroundInformationConfigList = backgroundInfoList.map(favo => {
                              if (favo.id === selectedBackgroundInformationFavorit?.id) {
                                    return {
                                          ...favo,
                                          ...payload,
                                          updatedAt: dayjs()
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
                  setFavoritBackgroundInformationList(backgroundInformationConfigList);

                  setVisibleAddFavoritBackgroundInformationModal(false);
                  setNotification({
                        show: true,
                        message: translate('Favorit_Enregistrer_Avec_Succes'),
                        type: NOTIFICATION_SUCCESS
                  });
                  setLoadingSaveFavoritBackgroundInformations(false);

                  if (selectedBackgroundInformationTypeConfiguration === DIRECTE) {
                        setInputFavoritNameForBackgroundInforation('');
                  }
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
                                                padding: '10px',
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
                                                      value={inputFavorisNameForBackgroundInforation}
                                                      onChange={event =>
                                                            setInputFavoritNameForBackgroundInforation(
                                                                  event.target.value
                                                            )
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
                                                      inputFavorisNameForBackgroundInforation?.trim()?.length > 0
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

      const handleSaveNewMappingConfig = async () => {
            try {
                  setLoadingSaveDateElementMappingConfig(true);
                  // if (!selectedDataElement) throw new Error(translate('Element_De_Donner_Obligatoire'));

                  // if (!inputDataSourceDisplayName || inputDataSourceDisplayName?.trim().length === 0)
                  //       throw new Error(translate('Donne_Source_Obligatoire'));

                  // if (!selectedProgramStage) throw new Error(translate('Programme_Stage_Obligatoire'));

                  // if (selectedDataElement && selectedProgramStage) {
                  //       const existingConfig = mappingConfigs.find(
                  //             mapping =>
                  //                   mapping.dataElement?.id === selectedDataElement.id &&
                  //                   mapping.programStage?.id === selectedProgramStage.id
                  //       );

                  //       if (!existingConfig) {

                  const newMappingList = [];

                  newMappingList.push({
                        id: uuid(),
                        dataElement: formIndicatorConfiguration.selectedIndicator?.dataElement,
                        indicator: {
                              displayName: formIndicatorConfiguration.selectedIndicator?.source?.name,
                              id: formIndicatorConfiguration.selectedIndicator?.source?.id
                        },
                        programStage: {
                              id: selectedProgram?.programStageConfigurations[0]?.programStage?.id,
                              displayName: selectedProgram?.programStageConfigurations[0]?.programStage?.displayName
                        },
                        program: {
                              id: selectedProgram?.program?.id,
                              displayName: selectedProgram?.program?.displayName
                        }
                  });

                  for (let rec of formIndicatorConfiguration.selectedRecoupements) {
                        newMappingList.push({
                              id: uuid(),
                              dataElement: rec.dataElement,
                              indicator: {
                                    displayName: rec.source?.name,
                                    id: rec.source?.id
                              },
                              programStage: {
                                    id: selectedProgram?.programStageConfigurations[0]?.programStage?.id,
                                    displayName:
                                          selectedProgram?.programStageConfigurations[0]?.programStage?.displayName
                              },
                              program: {
                                    id: selectedProgram?.program?.id,
                                    displayName: selectedProgram?.program?.displayName
                              }
                        });
                  }

                  const newList = [...mappingConfigs, ...newMappingList];
                  setMappingConfigs(newList);
                  setSelectedDataElement(null);
                  setInputDataSourceDisplayName('');
                  setInputFavoritNameForBackgroundInforation('');
                  setInputDataSourceID(null);
                  setSelectedProgramStage(null);
                  setNotification({
                        show: true,
                        type: NOTIFICATION_SUCCESS,
                        message: translate('Configuration_Ajoutee')
                  });
                  setLoadingSaveDateElementMappingConfig(false);
                  // } else {
                  //       throw new Error(translate('Configuration_Deja_Ajoutee'));
                  // }
                  // }
                  selectedCrosscheck(null);
                  setSelectedCrosscheckChild(null);
                  setFormIndicatorConfiguration({
                        selectedIndicator: { dataElement: null, source: null },
                        selectedRecoupements: [],
                        isIndicator: true,
                        currentElement: null
                  });
            } catch (err) {
                  setNotification({
                        show: true,
                        type: NOTIFICATION_CRITICAL,
                        message: err.response?.data?.message || err.message
                  });
                  setLoadingSaveDateElementMappingConfig(false);
            }
      };

      const handleDeleteFavoritesForBackgroundInformations = async () => {
            try {
                  setLoadingDeleteFavoritBackgroundInformations(true);
                  if (selectedBackgroundInformationFavorit) {
                        let newFavoritList = [];
                        const backgroundInfoList = await loadDataStore(
                              process.env.REACT_APP_BACKGROUND_INFORMATION_FAVORITS_KEY,
                              null,
                              null,
                              []
                        );

                        newFavoritList = backgroundInfoList.filter(
                              fav => fav.id !== selectedBackgroundInformationFavorit.id
                        );

                        await saveDataToDataStore(
                              process.env.REACT_APP_BACKGROUND_INFORMATION_FAVORITS_KEY,
                              newFavoritList
                        );

                        setFavoritBackgroundInformationList(newFavoritList);
                        setSelectedBackgroundInformationFavorit(null);
                        setMappingConfigs([]);
                        setInputFavoritNameForBackgroundInforation('');

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
                                    <div>
                                          {mappingConfigs.length > 0 && (
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                      {selectedBackgroundInformationTypeConfiguration === FAVORIS && (
                                                            <div style={{ marginRight: '10px' }}>
                                                                  <Button
                                                                        small
                                                                        destructive
                                                                        loading={
                                                                              loadingDeleteFavoritBackgroundInformations
                                                                        }
                                                                        disabled={
                                                                              mappingConfigs.length > 0 ? false : true
                                                                        }
                                                                        onClick={
                                                                              handleDeleteFavoritesForBackgroundInformations
                                                                        }
                                                                        icon={
                                                                              <MdStars
                                                                                    style={{
                                                                                          fontSize: '20px',
                                                                                          cursor: 'pointer'
                                                                                    }}
                                                                              />
                                                                        }
                                                                  >
                                                                        {translate('Delete_Favorite')}
                                                                  </Button>
                                                            </div>
                                                      )}
                                                      <Button
                                                            small
                                                            primary
                                                            loading={loadingSaveFavoritBackgroundInformations}
                                                            disabled={mappingConfigs.length > 0 ? false : true}
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
                                                      >
                                                            {selectedBackgroundInformationTypeConfiguration === DIRECTE
                                                                  ? translate('Enregistrer_Comme_Favorites')
                                                                  : translate('Mise_A_Jour')}
                                                      </Button>
                                                </div>
                                          )}
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
                                                title: translate('Programme'),
                                                dataIndex: 'programName'
                                          },
                                          {
                                                title: translate('Programme_Stage'),
                                                dataIndex: 'programStageName'
                                          },
                                          {
                                                title: translate('Form_Field'),
                                                dataIndex: 'dataElementName'
                                          },
                                          {
                                                title: translate('Source_De_Donnée'),
                                                dataIndex: 'indicatorName'
                                          },
                                          {
                                                title: translate('Actions'),
                                                dataIndex: 'action',
                                                width: '80px',
                                                render: value => (
                                                      <Popconfirm
                                                            title={translate('Suppression')}
                                                            description={translate(
                                                                  'Confirmation_Suppression_Configuration'
                                                            )}
                                                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                            onConfirm={() => handleDeleteConfigItem(value)}
                                                      >
                                                            <div
                                                                  style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center'
                                                                  }}
                                                            >
                                                                  <RiDeleteBinLine
                                                                        style={{
                                                                              color: 'red',
                                                                              fontSize: '20px',
                                                                              cursor: 'pointer'
                                                                        }}
                                                                  />
                                                            </div>
                                                      </Popconfirm>
                                                )
                                          }
                                    ]}
                                    size="small"
                              />
                        </div>
                  )}
            </>
      );

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

      const handleAddNewMappingConfig = () => {
            setIsNewMappingMode(!isNewMappingMode);

            if (!isNewMappingMode) {
                  setSelectedDataElement(null);
            }
      };

      const loadDataStoreCrosschecks = async () => {
            try {
                  const response = await loadDataStore(process.env.REACT_APP_CROSS_CUT_KEY, null, null, []);

                  setDataStoreCrosschecks(response);
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
                                                                  selectedBackgroundInformationTypeConfiguration ===
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
                                                                  selectedBackgroundInformationTypeConfiguration ===
                                                                  DIRECTE
                                                            }
                                                      />
                                                </div>
                                          </div>
                                    </Col>
                                    <Col md={24}>
                                          <hr style={{ margin: '10px auto', color: '#ccc' }} />
                                    </Col>

                                    {selectedBackgroundInformationTypeConfiguration === FAVORIS && (
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
                                                                              selectedProgram?.program?.id
                                                                  )
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
                                                      />
                                                </div>
                                          </Col>
                                    )}

                                    {/* {selectedBackgroundInformationTypeConfiguration === FAVORIS &&
                                          selectedBackgroundInformationFavorit && (
                                                <Col md={24}>
                                                      <div style={{ marginTop: '10px' }}>
                                                            <Button
                                                                  small
                                                                  icon={
                                                                        isNewMappingMode && (
                                                                              <ImCancelCircle
                                                                                    style={{
                                                                                          color: '#fff',
                                                                                          fontSize: '18px'
                                                                                    }}
                                                                              />
                                                                        )
                                                                  }
                                                                  primary={!isNewMappingMode ? true : false}
                                                                  destructive={isNewMappingMode ? true : false}
                                                                  onClick={handleAddNewMappingConfig}
                                                            >
                                                                  {!isNewMappingMode && (
                                                                        <span>
                                                                              + {translate('Ajouter_Nouveau_Mapping')}
                                                                        </span>
                                                                  )}
                                                                  {isNewMappingMode && (
                                                                        <span>{translate('Annuler_Le_Mapping')}</span>
                                                                  )}
                                                            </Button>
                                                      </div>
                                                      {isNewMappingMode && (
                                                            <div style={{ marginTop: '10px' }}>
                                                                  <div style={{ marginBottom: '5px' }}>
                                                                        {translate('Programmes_Stage')}
                                                                  </div>
                                                                  <Select
                                                                        options={programStages.map(program => ({
                                                                              label: program.displayName,
                                                                              value: program.id
                                                                        }))}
                                                                        placeholder={translate('Programmes_Stage')}
                                                                        style={{ width: '100%' }}
                                                                        optionFilterProp="label"
                                                                        value={selectedProgramStage?.id}
                                                                        onChange={handleSelectProgramStage}
                                                                        showSearch
                                                                        loading={loadingProgramStages}
                                                                        disabled={loadingProgramStages}
                                                                  />
                                                            </div>
                                                      )}
                                                </Col>
                                          )} */}

                                    {/* {selectedBackgroundInformationTypeConfiguration === DIRECTE && (
                                          <Col md={24}>
                                                <div>
                                                      <div style={{ marginBottom: '5px' }}>
                                                            {translate('Programmes_Stage')}
                                                      </div>
                                                      <Select
                                                            options={programStages.map(program => ({
                                                                  label: program.displayName,
                                                                  value: program.id
                                                            }))}
                                                            placeholder={translate('Programmes_Stage')}
                                                            style={{ width: '100%' }}
                                                            optionFilterProp="label"
                                                            value={selectedProgramStage?.id}
                                                            onChange={handleSelectProgramStage}
                                                            showSearch
                                                            loading={loadingProgramStages}
                                                            disabled={loadingProgramStages}
                                                      />
                                                </div>
                                                <Divider style={{ margin: '10px auto' }} />
                                                {selectedProgramStage && (
                                                      <Button
                                                            small
                                                            icon={
                                                                  isNewMappingMode && (
                                                                        <ImCancelCircle
                                                                              style={{
                                                                                    color: '#fff',
                                                                                    fontSize: '18px'
                                                                              }}
                                                                        />
                                                                  )
                                                            }
                                                            primary={!isNewMappingMode ? true : false}
                                                            destructive={isNewMappingMode ? true : false}
                                                            onClick={handleAddNewMappingConfig}
                                                      >
                                                            {!isNewMappingMode && (
                                                                  <span>+ {translate('Ajouter_Nouveau_Mapping')}</span>
                                                            )}
                                                            {isNewMappingMode && (
                                                                  <span>{translate('Annuler_Le_Mapping')}</span>
                                                            )}
                                                      </Button>
                                                )}
                                          </Col>
                                    )}

                                    {selectedProgramStage && (
                                          <Col md={24} xs={24}>
                                                {isNewMappingMode && (
                                                      <div style={{ marginTop: '20px' }}>
                                                            <div>
                                                                  <div>
                                                                        <Radio
                                                                              label={translate(
                                                                                    'Choisir_Element_Donne_De_Group'
                                                                              )}
                                                                              className="cursor-pointer"
                                                                              onChange={
                                                                                    handleSelectedDataElementFromWhere
                                                                              }
                                                                              value={ELEMENT_GROUP}
                                                                              checked={
                                                                                    selectedDataElementFromWhere ===
                                                                                    ELEMENT_GROUP
                                                                              }
                                                                        />
                                                                  </div>
                                                                  <div>
                                                                        <Radio
                                                                              label={translate(
                                                                                    'Element_Donne_A_Partie_De_Liste'
                                                                              )}
                                                                              className="cursor-pointer"
                                                                              onChange={
                                                                                    handleSelectedDataElementFromWhere
                                                                              }
                                                                              value={ALL}
                                                                              checked={
                                                                                    selectedDataElementFromWhere === ALL
                                                                              }
                                                                        />
                                                                  </div>
                                                            </div>

                                                            <div style={{ marginTop: '20px' }}>
                                                                  <Row gutter={[10, 10]}>
                                                                        {selectedProgramStage &&
                                                                              selectedDataElementFromWhere ===
                                                                                    ELEMENT_GROUP && (
                                                                                    <Col md={24}>
                                                                                          <div
                                                                                                style={{
                                                                                                      marginBottom:
                                                                                                            '5px'
                                                                                                }}
                                                                                          >
                                                                                                {translate(
                                                                                                      'Group_Element_Donnee'
                                                                                                )}
                                                                                          </div>
                                                                                          <Select
                                                                                                options={dataElementGroups.map(
                                                                                                      elGroup => ({
                                                                                                            label: elGroup.displayName,
                                                                                                            value: elGroup.id
                                                                                                      })
                                                                                                )}
                                                                                                placeholder={translate(
                                                                                                      'Group_Element_Donnee'
                                                                                                )}
                                                                                                style={{
                                                                                                      width: '100%'
                                                                                                }}
                                                                                                optionFilterProp="label"
                                                                                                value={
                                                                                                      selectedDataElementGroup?.id
                                                                                                }
                                                                                                onChange={
                                                                                                      handleSelectedDataElementGroup
                                                                                                }
                                                                                                showSearch
                                                                                                loading={
                                                                                                      loadingDataElementGroups
                                                                                                }
                                                                                                disabled={
                                                                                                      loadingDataElementGroups
                                                                                                }
                                                                                                allowClear
                                                                                          />
                                                                                    </Col>
                                                                              )}

                                                                        {selectedProgramStage && (
                                                                              <Col md={12} xs={24}>
                                                                                    <div>
                                                                                          <div
                                                                                                style={{
                                                                                                      marginBottom:
                                                                                                            '5px'
                                                                                                }}
                                                                                          >
                                                                                                {translate(
                                                                                                      'Form_Field'
                                                                                                )}
                                                                                          </div>
                                                                                          <Select
                                                                                                options={
                                                                                                      selectedProgramStage?.programStageDataElements
                                                                                                            ?.filter(
                                                                                                                  progStageDE =>
                                                                                                                        selectedDataElementFromWhere ===
                                                                                                                              ELEMENT_GROUP &&
                                                                                                                        selectedDataElementGroup
                                                                                                                              ? progStageDE.dataElement?.dataElementGroups
                                                                                                                                      ?.map(
                                                                                                                                            gp =>
                                                                                                                                                  gp.id
                                                                                                                                      )
                                                                                                                                      ?.includes(
                                                                                                                                            selectedDataElementGroup?.id
                                                                                                                                      )
                                                                                                                              : true
                                                                                                            )
                                                                                                            ?.map(
                                                                                                                  progStageDE => ({
                                                                                                                        label: progStageDE
                                                                                                                              .dataElement
                                                                                                                              ?.displayName,
                                                                                                                        value: progStageDE
                                                                                                                              .dataElement
                                                                                                                              ?.id
                                                                                                                  })
                                                                                                            ) || []
                                                                                                }
                                                                                                placeholder={translate(
                                                                                                      'Form_Field'
                                                                                                )}
                                                                                                style={{
                                                                                                      width: '100%'
                                                                                                }}
                                                                                                onChange={
                                                                                                      handleSelectDataElement
                                                                                                }
                                                                                                value={
                                                                                                      selectedDataElement?.id
                                                                                                }
                                                                                                optionFilterProp="label"
                                                                                                showSearch
                                                                                          />
                                                                                    </div>
                                                                              </Col>
                                                                        )}

                                                                        <Col md={10} xs={24}>
                                                                              <div>
                                                                                    <div
                                                                                          style={{
                                                                                                marginBottom: '5px'
                                                                                          }}
                                                                                    >
                                                                                          {translate(
                                                                                                'Source_De_Donnee'
                                                                                          )}
                                                                                    </div>
                                                                                    <Input
                                                                                          placeholder={translate(
                                                                                                'Source_De_Donnee'
                                                                                          )}
                                                                                          style={{ width: '100%' }}
                                                                                          value={
                                                                                                inputDataSourceDisplayName
                                                                                          }
                                                                                          onChange={event => {
                                                                                                setInputDataSourceDisplayName(
                                                                                                      ''.concat(
                                                                                                            event.target
                                                                                                                  .value
                                                                                                      )
                                                                                                );
                                                                                          }}
                                                                                    />
                                                                              </div>
                                                                        </Col>
                                                                        <Col md={2} xs={24}>
                                                                              <div style={{ marginTop: '28px' }}>
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
                                                                                                setVisibleAnalyticComponentModal(
                                                                                                      true
                                                                                                )
                                                                                          }
                                                                                    ></Button>
                                                                              </div>
                                                                        </Col>
                                                                        <Col md={24} xs={24}>
                                                                              <div style={{ marginTop: '18px' }}>
                                                                                    <Button
                                                                                          loading={
                                                                                                loadingSaveDateElementMappingConfig
                                                                                          }
                                                                                          disabled={
                                                                                                loadingSaveDateElementMappingConfig
                                                                                          }
                                                                                          primary
                                                                                          onClick={
                                                                                                handleSaveNewMappingConfig
                                                                                          }
                                                                                    >
                                                                                          + {translate('Ajouter')}
                                                                                    </Button>
                                                                              </div>
                                                                        </Col>
                                                                  </Row>
                                                            </div>
                                                      </div>
                                                )}
                                          </Col>
                                    )} */}

                                    {console.log('formIndicatorConfiguration: ', formIndicatorConfiguration)}

                                    {selectedBackgroundInformationTypeConfiguration === DIRECTE && (
                                          <Col md={24}>
                                                <div>
                                                      <div
                                                            style={{
                                                                  fontWeight: 'bold',
                                                                  marginBottom: '10px'
                                                            }}
                                                      >
                                                            {translate('Indicators_Recoupements')}
                                                      </div>
                                                      <Row gutter={[10, 10]}>
                                                            <Col md={12} xs={24}>
                                                                  <div>
                                                                        <div
                                                                              style={{
                                                                                    marginBottom: '5px'
                                                                              }}
                                                                        >
                                                                              {translate('Indicateurs')}
                                                                        </div>

                                                                        <Select
                                                                              options={
                                                                                    selectedProgram?.programStageConfigurations[0]?.indicatorsFieldsConfigs?.map(
                                                                                          indic => ({
                                                                                                label: indic.value
                                                                                                      ?.displayName,
                                                                                                value: indic.value?.id
                                                                                          })
                                                                                    ) || []
                                                                              }
                                                                              placeholder={translate('Indicateurs')}
                                                                              style={{
                                                                                    width: '100%'
                                                                              }}
                                                                              onChange={handleSelectDataElement}
                                                                              value={selectedDataElement?.id}
                                                                              optionFilterProp="label"
                                                                              showSearch
                                                                        />
                                                                  </div>
                                                            </Col>

                                                            <Col md={10} xs={24}>
                                                                  <div>
                                                                        <div
                                                                              style={{
                                                                                    marginBottom: '5px'
                                                                              }}
                                                                        >
                                                                              {translate('Source_De_Donnee')}
                                                                        </div>
                                                                        <Input
                                                                              placeholder={translate(
                                                                                    'Source_De_Donnee'
                                                                              )}
                                                                              disabled
                                                                              style={{ width: '100%' }}
                                                                              value={
                                                                                    formIndicatorConfiguration
                                                                                          ?.selectedIndicator?.source
                                                                                          ?.name
                                                                              }
                                                                              onChange={event => {
                                                                                    setInputDataSourceDisplayName(
                                                                                          ''.concat(event.target.value)
                                                                                    );
                                                                              }}
                                                                        />
                                                                  </div>
                                                            </Col>

                                                            <Col md={2} xs={24}>
                                                                  <div style={{ marginTop: '28px' }}>
                                                                        <Button
                                                                              small
                                                                              primary
                                                                              disabled={
                                                                                    formIndicatorConfiguration
                                                                                          ?.selectedIndicator
                                                                                          ?.dataElement
                                                                                          ? false
                                                                                          : true
                                                                              }
                                                                              icon={
                                                                                    <TbSelect
                                                                                          style={{
                                                                                                fontSize: '18px',
                                                                                                color: '#fff'
                                                                                          }}
                                                                                    />
                                                                              }
                                                                              onClick={() => {
                                                                                    setVisibleAnalyticComponentModal(
                                                                                          true
                                                                                    );
                                                                                    setFormIndicatorConfiguration({
                                                                                          ...formIndicatorConfiguration,
                                                                                          currentElement:
                                                                                                formIndicatorConfiguration?.selectedIndicator,
                                                                                          isIndicator: true
                                                                                    });
                                                                              }}
                                                                        ></Button>
                                                                  </div>
                                                            </Col>
                                                      </Row>
                                                </div>
                                          </Col>
                                    )}

                                    {formIndicatorConfiguration?.selectedIndicator?.source &&
                                          formIndicatorConfiguration?.selectedRecoupements?.map((rec, recIndex) => (
                                                <Col md={24}>
                                                      <div>
                                                            <Row gutter={[10, 10]}>
                                                                  <Col md={12} xs={24}>
                                                                        <div>
                                                                              <div
                                                                                    style={{
                                                                                          marginBottom: '5px'
                                                                                    }}
                                                                              >
                                                                                    {`${translate('Recoupements')} ${
                                                                                          recIndex + 1
                                                                                    }`}
                                                                              </div>

                                                                              <Input
                                                                                    disabled
                                                                                    placeholder={`${translate(
                                                                                          'Recoupements'
                                                                                    )} ${recIndex + 1}`}
                                                                                    style={{
                                                                                          width: '100%'
                                                                                    }}
                                                                                    value={rec?.dataElement?.name}
                                                                                    optionFilterProp="label"
                                                                                    showSearch
                                                                              />
                                                                        </div>
                                                                  </Col>

                                                                  <Col md={10} xs={24}>
                                                                        <div>
                                                                              <div
                                                                                    style={{
                                                                                          marginBottom: '5px'
                                                                                    }}
                                                                              >
                                                                                    {`${translate(
                                                                                          'Source_De_Donnee'
                                                                                    )} ${recIndex + 1}`}
                                                                              </div>
                                                                              <Input
                                                                                    placeholder={`${translate(
                                                                                          'Source_De_Donnee'
                                                                                    )} ${recIndex + 1}`}
                                                                                    style={{ width: '100%' }}
                                                                                    value={rec.source?.name}
                                                                                    onChange={event => {
                                                                                          formIndicatorConfiguration &&
                                                                                                setFormIndicatorConfiguration(
                                                                                                      {
                                                                                                            ...formIndicatorConfiguration,
                                                                                                            selectedRecoupements:
                                                                                                                  formIndicatorConfiguration?.selectedRecoupements.map(
                                                                                                                        (
                                                                                                                              rec,
                                                                                                                              index
                                                                                                                        ) => {
                                                                                                                              if (
                                                                                                                                    recIndex ===
                                                                                                                                    index
                                                                                                                              ) {
                                                                                                                                    return {
                                                                                                                                          ...rec,
                                                                                                                                          source: {
                                                                                                                                                id: null,
                                                                                                                                                name: ''.concat(
                                                                                                                                                      event
                                                                                                                                                            .target
                                                                                                                                                            .value
                                                                                                                                                )
                                                                                                                                          }
                                                                                                                                    };
                                                                                                                              }
                                                                                                                              return rec;
                                                                                                                        }
                                                                                                                  )
                                                                                                      }
                                                                                                );
                                                                                    }}
                                                                              />
                                                                        </div>
                                                                  </Col>
                                                                  <Col md={2} xs={24}>
                                                                        <div style={{ marginTop: '28px' }}>
                                                                              <Button
                                                                                    small
                                                                                    primary
                                                                                    disabled={
                                                                                          formIndicatorConfiguration?.selectedIndicator
                                                                                                ? false
                                                                                                : true
                                                                                    }
                                                                                    icon={
                                                                                          <TbSelect
                                                                                                style={{
                                                                                                      fontSize: '18px',
                                                                                                      color: '#fff'
                                                                                                }}
                                                                                          />
                                                                                    }
                                                                                    onClick={() => {
                                                                                          setVisibleAnalyticComponentModalForCrossCheck(
                                                                                                true
                                                                                          );

                                                                                          setFormIndicatorConfiguration(
                                                                                                {
                                                                                                      ...formIndicatorConfiguration,
                                                                                                      currentElement:
                                                                                                            rec,
                                                                                                      isIndicator: false
                                                                                                }
                                                                                          );
                                                                                    }}
                                                                              ></Button>
                                                                        </div>
                                                                  </Col>
                                                            </Row>
                                                      </div>
                                                </Col>
                                          ))}

                                    <Col md={24}>
                                          <hr style={{ margin: '10px auto', color: '#ccc' }} />
                                    </Col>

                                    {selectedProgram?.configurationType === 'DQR' &&
                                          formIndicatorConfiguration?.selectedIndicator?.source && (
                                                <Col md={24}>
                                                      <div
                                                            style={{
                                                                  fontWeight: 'bold',
                                                                  marginBottom: '10px'
                                                            }}
                                                      >
                                                            {translate('Margin_Of_Errors')}
                                                      </div>
                                                      <div>
                                                            <Row gutter={[10, 10]}>
                                                                  <Col md={12} xs={24}>
                                                                        <div>
                                                                              <div
                                                                                    style={{
                                                                                          marginBottom: '5px'
                                                                                    }}
                                                                              >
                                                                                    {translate('Indicator_MOE')}
                                                                              </div>

                                                                              <Input
                                                                                    min={0}
                                                                                    type="number"
                                                                                    placeholder={translate(
                                                                                          'Indicator_MOE'
                                                                                    )}
                                                                                    style={{
                                                                                          width: '100%'
                                                                                    }}
                                                                                    value={
                                                                                          formIndicatorConfiguration?.marginOfErrorIndicator
                                                                                    }
                                                                                    onChange={event => {
                                                                                          setFormIndicatorConfiguration(
                                                                                                {
                                                                                                      ...formIndicatorConfiguration,
                                                                                                      marginOfErrorIndicator:
                                                                                                            event.target
                                                                                                                  .value
                                                                                                }
                                                                                          );
                                                                                    }}
                                                                                    optionFilterProp="label"
                                                                                    showSearch
                                                                              />
                                                                        </div>
                                                                  </Col>
                                                                  <Col md={12} xs={24}>
                                                                        <div>
                                                                              <div
                                                                                    style={{
                                                                                          marginBottom: '5px'
                                                                                    }}
                                                                              >
                                                                                    {translate('Recoupement_MOE')}
                                                                              </div>

                                                                              <Input
                                                                                    min={0}
                                                                                    type="number"
                                                                                    placeholder={translate(
                                                                                          'Recoupement_MOE'
                                                                                    )}
                                                                                    style={{
                                                                                          width: '100%'
                                                                                    }}
                                                                                    value={
                                                                                          formIndicatorConfiguration?.marginOfErrorRecoupement
                                                                                    }
                                                                                    onChange={event => {
                                                                                          setFormIndicatorConfiguration(
                                                                                                {
                                                                                                      ...formIndicatorConfiguration,
                                                                                                      marginOfErrorIndicator:
                                                                                                            event.target
                                                                                                                  .value
                                                                                                }
                                                                                          );
                                                                                    }}
                                                                                    optionFilterProp="label"
                                                                                    showSearch
                                                                              />
                                                                        </div>
                                                                  </Col>
                                                            </Row>
                                                      </div>
                                                </Col>
                                          )}

                                    <Col md={24} xs={24}>
                                          <div style={{ marginTop: '18px' }}>
                                                <Button
                                                      loading={loadingSaveDateElementMappingConfig}
                                                      disabled={loadingSaveDateElementMappingConfig}
                                                      primary
                                                      onClick={handleSaveNewMappingConfig}
                                                >
                                                      + {translate('Ajouter')}
                                                </Button>
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
                              <Col sm={24} md={8}>
                                    {RenderSelectedSupervisionTypeList()}
                                    {selectedProgram && RenderDataElementConfigContent()}
                              </Col>
                              <Col sm={24} md={16}>
                                    {selectedProgram && RenderDataElementConfigList()}
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
                                          {/* <div style={{ marginBottom: '20px' }}>
                                                <div>
                                                      <Radio
                                                            label={translate('Venant_Du_DHIS2')}
                                                            className="cursor-pointer"
                                                            onChange={() => {
                                                                  setSelectedTypeSource('DHIS2');
                                                            }}
                                                            value={'DHIS2'}
                                                            checked={selectedTypeSource === 'DHIS2'}
                                                      />
                                                </div>
                                                <div>
                                                      <Radio
                                                            label={translate('Venant_Du_Group') + ' ? '}
                                                            className="cursor-pointer"
                                                            onChange={() => {
                                                                  setSelectedTypeSource('GROUPS');
                                                            }}
                                                            value={'GROUPS'}
                                                            checked={selectedTypeSource === 'GROUPS'}
                                                      />
                                                </div>
                                          </div> */}

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
            loadDataElementGroups();
            loadDataStoreBackgroundInformationFavoritsConfigs();
      }, []);
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
