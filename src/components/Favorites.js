import { useState, useEffect } from 'react';
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
      Popover
} from 'antd';
import { IoMdAdd } from 'react-icons/io';
import { IoListCircleOutline } from 'react-icons/io5';
import {
      Button,
      ButtonStrip,
      Checkbox,
      CircularLoader,
      Modal,
      ModalActions,
      ModalContent,
      ModalTitle,
      NoticeBox,
      Radio
} from '@dhis2/ui';
import { BsArrowRight } from 'react-icons/bs';
import { BsArrowLeft } from 'react-icons/bs';
import { Stepper } from 'react-form-stepper';
import { FiSave } from 'react-icons/fi';
import { ImCancelCircle } from 'react-icons/im';
import { CgCloseO } from 'react-icons/cg';
import { TbSelect } from 'react-icons/tb';
import translate from '../utils/translator';
import MyNotification from './MyNotification';
import { ALL, DIRECTE, ELEMENT_GROUP, ORGANISATION_UNIT } from '../utils/constants';
import { loadDataStore } from '../utils/functions';
import { MyNoticeBox } from './MyNoticeBox';
import { PROGRAMS_STAGE_ROUTE } from '../utils/api.routes';
import axios from 'axios';
import { v4 as uuid } from 'uuid';


const Favorites = ({ me }) => {
      const [dataStoreSupervisionConfigs, setDataStoreSupervisionConfigs] = useState([]);
      const [dataStoreSupervisions, setDataStoreSupervisions] = useState([]);
      const [dataStoreIndicatorConfigs, setDataStoreIndicatorConfigs] = useState([]);

      const [isEditionMode, setEditionMode] = useState(false);
      const [organisationUnits, setOrganisationUnits] = useState([]);
      const [users, setUsers] = useState([]);
      const [organisationUnitGroupSets, setOrganisationUnitGroupSets] = useState([]);
      const [programStages, setProgramStages] = useState([]);
      const [isNewMappingMode, setIsNewMappingMode] = useState(false);
      const [mappingConfigs, setMappingConfigs] = useState([]);
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
      const [visibleAddFavoritBackgroundInformationModal, setVisibleAddFavoritBackgroundInformationModal] =
            useState(false);

      const [selectedBackgroundInformationTypeConfiguration, setSelectedBackgroundInformationTypeConfiguration] =
            useState(DIRECTE);
      const [selectedBackgroundInformationFavorit, setSelectedBackgroundInformationFavorit] = useState(null);

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
      const [selectedDataElementFromWhere, setSelectedDataElementFromWhere] = useState(ELEMENT_GROUP);
      const [selectedDataElementGroup, setSelectedDataElementGroup] = useState(null);

      const [inputFavorisName, setInputFavoritName] = useState('');
      const [inputFavorisNameForBackgroundInforation, setInputFavoritNameForBackgroundInforation] = useState('');
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
      const [loadingSaveFavoritBackgroundInformations, setLoadingSaveFavoritBackgroundInformations] = useState(false);
      const [loadingDataStoreSupervisions, setLoadingDataStoreSupervisions] = useState(false);
      const [loadingDataStoreIndicatorConfigs, setLoadingDataStoreIndicatorConfigs] = useState(false);
      const [loadingOrganisationUnits, setLoadingOrganisationUnits] = useState(false);
      const [loadingOrganisationUnitGroupSets, setLoadingOrganisationUnitGroupSets] = useState(false);
      const [loadingUsers, setLoadingUsers] = useState(false);
      const [loadingProgramStages, setLoadingProgramStages] = useState(false);
      const [loadingSaveDateElementMappingConfig, setLoadingSaveDateElementMappingConfig] = useState(false);
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

      const [notification, setNotification] = useState({
            show: false,
            message: null,
            type: null
      });

      const handleSelectProgramStage = value => {
            setSelectedProgramStage(programStages.find(pstage => pstage.id === value));
            setSelectedDataElement(null);
      };

      const handleSelectedDataElementGroup = value => {
            setSelectedDataElementGroup(dataElementGroups.find(dxGroup => dxGroup.id === value));
            setSelectedDataElement(null);
      };

      const handleClickSupervisionItem = sup => {
            setSelectedProgramStage(null);
            setSelectedDataElement(null);
            setMappingConfigs([]);

            loadProgramStages(sup.program?.id);
            setSelectedProgram(sup);
      };

      const loadProgramStages = async (programID, setState = null) => {
            try {
                  console.log('program ID : ', programID);
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

      const loadDataStoreSupervisionConfigs = async () => {
            try {
                  setLoadingDataStoreSupervisionConfigs(true);
                  const response = await loadDataStore(process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY, null, null, null);
                  if (!response || response.length === 0) {
                        setLoadingDataStoreSupervisionConfigs(false);
                  }

                  //  await loadAllSupervisionsFromTracker(response, organisationUnitList);
                  setDataStoreSupervisionConfigs(response);
                  setLoadingDataStoreSupervisionConfigs(false);
            } catch (err) {
                  setLoadingDataStoreSupervisionConfigs(false);
            }
      };

      const handleSelectDataElement = value => {
            setSelectedDataElement(
                  selectedProgramStage.programStageDataElements
                        ?.map(p => p.dataElement)
                        .find(dataElement => dataElement.id === value)
            );
      };

      const handleSelectedDataElementFromWhere = ({ value }) => {
            setSelectedDataElement(null);
            setSelectedDataElementFromWhere(value);
            if (value === ALL) setSelectedDataElementGroup(null);
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

      const handleSaveAsFavoritesForBackgroundInformations = () => {
            setVisibleAddFavoritBackgroundInformationModal(true);
      };


      const handleSaveNewMappingConfig = async () => {
            try {
                  setLoadingSaveDateElementMappingConfig(true);
                  if (!selectedDataElement) throw new Error(translate('Element_De_Donner_Obligatoire'));

                  if (!inputDataSourceDisplayName || inputDataSourceDisplayName?.trim().length === 0)
                        throw new Error(translate('Donne_Source_Obligatoire'));

                  if (!selectedProgramStage) throw new Error(translate('Programme_Stage_Obligatoire'));

                  if (selectedDataElement && selectedProgramStage) {
                        const existingConfig = mappingConfigs.find(
                              mapping =>
                                    mapping.dataElement?.id === selectedDataElement.id &&
                                    mapping.programStage?.id === selectedProgramStage.id
                        );

                        if (!existingConfig) {
                              const payload = {
                                    id: uuid(),
                                    dataElement: selectedDataElement,
                                    indicator: {
                                          displayName: inputDataSourceDisplayName,
                                          id: inputDataSourceID
                                    },
                                    programStage: {
                                          id: selectedProgramStage.id,
                                          displayName: selectedProgramStage.displayName
                                    },
                                    program: {
                                          id: selectedProgram?.program?.id,
                                          displayName: selectedProgram?.program?.displayName
                                    }
                              };
                              const newList = [...mappingConfigs, payload];
                              setMappingConfigs(newList);
                              setSelectedDataElement(null);
                              setInputDataSourceDisplayName('');
                              setInputDataSourceID(null);
                              setSelectedProgramStage(null);
                              setNotification({
                                    show: true,
                                    type: NOTIFICATION_SUCCESS,
                                    message: translate('Configuration_Ajoutee')
                              });
                              setLoadingSaveDateElementMappingConfig(false);
                        } else {
                              throw new Error(translate('Configuration_Deja_Ajoutee'));
                        }
                  }
            } catch (err) {
                  setNotification({
                        show: true,
                        type: NOTIFICATION_CRITICAL,
                        message: err.response?.data?.message || err.message
                  });
                  setLoadingSaveDateElementMappingConfig(false);
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
                                                <Button
                                                      loading={loadingSaveFavoritBackgroundInformations}
                                                      disabled={mappingConfigs.length > 0 ? false : true}
                                                      // small
                                                      onClick={handleSaveAsFavoritesForBackgroundInformations}
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
                                                      {selectedBackgroundInformationTypeConfiguration === DIRECTE
                                                            ? translate('Enregistrer_Comme_Favorites')
                                                            : translate('Mise_A_Jour')}
                                                </Button>
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
                  <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Favorites creation</span>
            </div>
      );

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
                                    </Col>

                                    {selectedProgramStage && (
                                          <Col md={24} xs={24}>
                                                <div style={{ marginTop: '20px' }}>
                                                      <div>
                                                            <div>
                                                                  <Radio
                                                                        label={translate(
                                                                              'Choisir_Element_Donne_De_Group'
                                                                        )}
                                                                        className="cursor-pointer"
                                                                        onChange={handleSelectedDataElementFromWhere}
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
                                                                        onChange={handleSelectedDataElementFromWhere}
                                                                        value={ALL}
                                                                        checked={selectedDataElementFromWhere === ALL}
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
                                                                                                marginBottom: '5px'
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
                                                                                                marginBottom: '5px'
                                                                                          }}
                                                                                    >
                                                                                          {translate('Form_Field')}
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
                                                                                    {translate('Source_De_Donnee')}
                                                                              </div>
                                                                              <Input
                                                                                    placeholder={translate(
                                                                                          'Source_De_Donnee'
                                                                                    )}
                                                                                    style={{ width: '100%' }}
                                                                                    value={inputDataSourceDisplayName}
                                                                                    onChange={event => {
                                                                                          setInputDataSourceDisplayName(
                                                                                                ''.concat(
                                                                                                      event.target.value
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
                                                                                    onClick={handleSaveNewMappingConfig}
                                                                              >
                                                                                    + {translate('Ajouter')}
                                                                              </Button>
                                                                        </div>
                                                                  </Col>
                                                            </Row>
                                                      </div>
                                                </div>
                                          </Col>
                                    )}
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
                                    {/* {RenderSupervisionTypeContent()}
                                    {selectedSupervisionType && RenderSelectedSupervisionTypeList()}
                                    {selectedProgram &&
                                          selectedProgram?.isRDQAConfigCase && */}
                                    {RenderSelectedSupervisionTypeList()}
                                    {selectedProgram && RenderDataElementConfigContent()}
                              </Col>
                              <Col sm={24} md={16}>
                                    {/* {selectedProgram &&
                                          selectedSupervisionType === TYPE_SUPERVISION_AGENT &&
                                          selectedProgram.attributesToDisplay?.length > 0 &&
                                          RenderAgentConfigList()}
                                    {selectedProgram && RenderDataElementConfigList()} */}
                              </Col>
                        </Row>
                  </div>
            </div>
      );

      useEffect(() => {
            loadDataStoreSupervisionConfigs();
      }, []);
      return (
            <>
                  <pre>{JSON.stringify(programStages, null, 2)}</pre>
                  {RenderContent()}
                  <MyNotification notification={notification} setNotification={setNotification} />
            </>
      );
};

export default Favorites;
