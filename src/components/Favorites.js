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
import translate from '../utils/translator';
import MyNotification from './MyNotification';
import { ORGANISATION_UNIT } from '../utils/constants';

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
                                                                                          + {translate('Ajouter')}{' '}
                                                                                    </Button>
                                                                              </div>
                                                                        </Col>
                                                                  </Row>
                                                            </div>
                                                      </div>
                                                )}
                                          </Col>
                                    )} */}
                              </Row>
                        </div>
                  </Card>
            </div>
      );

      const RenderContent = () => (
            <div>
                  {RenderTitle()}
                  <div style={{ marginTop: '10px' }}>
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
      return (
            <>
                  {RenderContent()}
                  <MyNotification notification={notification} setNotification={setNotification} />
            </>
      );
};

export default Favorites;
