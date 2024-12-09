import translate from '../utils/translator';
import { Card, Checkbox, Col, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { loadDataStore, saveDataToDataStore } from '../utils/functions';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { TbSelect } from 'react-icons/tb';
import { DataDimension } from '@dhis2/analytics';
import { FiSave } from 'react-icons/fi';
import MyNotification from './MyNotification';
import { NOTIFICATION_CRITICAL, NOTIFICATION_SUCCESS, PERIOD_TYPES } from '../utils/constants';
import { IoMdAddCircleOutline } from 'react-icons/io';
import SettingIndicatorsMappingNew from './SettingIndicatorsMappingNew';
import { FaRegEdit } from 'react-icons/fa';
import { SINGLE_DATA_ELEMENT_ROUTE } from '../utils/api.routes';

const SettingIndicatorsMapping = () => {
      const [notification, setNotification] = useState({
            show: false,
            message: null,
            type: null
      });
      const [dataStoreIndicators, setDataStoreIndicators] = useState([]);
      const [dataStoreIndicatorsMapping, setDataStoreIndicatorsMapping] = useState([]);
      const [formState, setFormState] = useState({
            currentIndicator: null,
            visibleAnalyticComponentModal: false,
            selectedMetaDatas: [],
            indicators: []
      });
      const [periodType, setPeriodType] = useState('');
      const [selectedDataSet, setSelectedDataSet] = useState(null);
      const [availableDataSets, setAvailableDataSets] = useState([]);
      const [loadingProcess, setLoadingProcess] = useState(false);
      const [loadingIndicators, setLoadingIndicators] = useState(false);
      const [loadingIndicatorsMapping, setLoadingIndicatorsMapping] = useState(false);

      const [openNewIndicatorModal, setOpenNewIndicatorModal] = useState(false);
      const [currentDataStoreMapping, setCurrentDataStoreMapping] = useState(null);

      const loadDataStoreIndicators = async () => {
            try {
                  setLoadingIndicators(true);
                  const response = await loadDataStore(process.env.REACT_APP_INDICATORS_KEY, null, null, []);
                  setDataStoreIndicators(response);
                  setLoadingIndicators(false);
            } catch (err) {
                  setLoadingIndicators(false);
            }
      };

      const loadDataStoreIndicatorsMapping = async () => {
            try {
                  setLoadingIndicatorsMapping(true);
                  const response = await loadDataStore(process.env.REACT_APP_INDICATORS_MAPPING_KEY, null, null, []);
                  setDataStoreIndicatorsMapping(response);
                  setLoadingIndicatorsMapping(false);
            } catch (err) {
                  setLoadingIndicatorsMapping(false);
            }
      };
      const initFields = () => {
            setFormState({
                  ...formState,
                  indicators: dataStoreIndicators?.reduce((prev, curr) => {
                        let newList = [];
                        newList =
                              curr.children?.map(child => ({
                                    group: curr.name,
                                    indicator: child.name,
                                    indicatorRename: dataStoreIndicatorsMapping?.find(
                                          it => it.indicator === child.name && it.group === curr.name
                                    )?.indicatorRename,
                                    useNameFromDHIS2: dataStoreIndicatorsMapping?.find(
                                          it => it.indicator === child.name && it.group === curr.name
                                    )?.useNameFromDHIS2,
                                    dhis2: dataStoreIndicatorsMapping?.find(
                                          it => it.indicator === child.name && it.group === curr.name
                                    )?.dhis2,

                                    periodType: dataStoreIndicatorsMapping?.find(
                                          it => it.indicator === child.name && it.group === curr.name
                                    )?.dataSet?.periodType,

                                    dataSet: dataStoreIndicatorsMapping?.find(
                                          it => it.indicator === child.name && it.group === curr.name
                                    )?.dataSet
                              })) || [];

                        prev = [...prev, ...newList];

                        return prev;
                  }, [])
            });
      };

      const RenderAnalyticComponentModal = () =>
            formState?.visibleAnalyticComponentModal ? (
                  <Modal onClose={() => setFormState({ ...formState, visibleAnalyticComponentModal: false })} large>
                        <ModalTitle>
                              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    {translate('Source_De_Donnee')}
                              </div>
                        </ModalTitle>
                        <ModalContent>
                              {!formState?.currentIndicator && <div>Error no data </div>}
                              {formState?.currentIndicator && (
                                    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
                                          <DataDimension
                                                selectedDimensions={formState?.selectedMetaDatas?.map(it => ({
                                                      ...it
                                                }))}
                                                onSelect={value => {
                                                      setFormState({
                                                            ...formState,
                                                            selectedMetaDatas:
                                                                  value?.items?.length > 0 ? [value.items[0]] : []
                                                      });
                                                }}
                                                displayNameProp="displayName"
                                          />

                                          <div style={{ marginTop: '20px' }}>
                                                <div>{translate('DataSet')}</div>
                                                <Select
                                                      disabled={availableDataSets?.length === 0}
                                                      options={
                                                            availableDataSets?.map(p => ({
                                                                  label: p.name,
                                                                  value: p.id
                                                            })) || []
                                                      }
                                                      style={{ width: '100%', marginTop: '10px' }}
                                                      onChange={value =>
                                                            setSelectedDataSet(
                                                                  availableDataSets?.find(p => p.id === value)
                                                            )
                                                      }
                                                      value={selectedDataSet?.periodType}
                                                      placeholder={translate('DataSet')}
                                                      clearIcon
                                                      allowClear
                                                />
                                          </div>

                                          <pre>{JSON.stringify(formState?.selectedMetaDatas, null, 2)}</pre>
                                    </div>
                              )}
                        </ModalContent>
                        <ModalActions>
                              <ButtonStrip end>
                                    <Button
                                          primary
                                          onClick={() => {
                                                setFormState({
                                                      ...formState,
                                                      visibleAnalyticComponentModal: false,
                                                      selectedMetaDatas: [],
                                                      currentIndicator: null,
                                                      indicators:
                                                            formState?.indicators?.map(ind => {
                                                                  if (
                                                                        ind.group ===
                                                                              formState?.currentIndicator?.group &&
                                                                        ind.indicator ===
                                                                              formState?.currentIndicator?.indicator
                                                                  ) {
                                                                        return {
                                                                              ...ind,
                                                                              periodType: selectedDataSet?.periodType,
                                                                              dataSet: selectedDataSet,
                                                                              dhis2: formState?.selectedMetaDatas[0]
                                                                        };
                                                                  }
                                                                  return ind;
                                                            }) || []
                                                });

                                                setPeriodType('');
                                                setSelectedDataSet(null);
                                                setAvailableDataSets([]);
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

      const handleSave = async () => {
            try {
                  setLoadingProcess(true);
                  const newList = formState?.indicators;
                  await saveDataToDataStore(process.env.REACT_APP_INDICATORS_MAPPING_KEY, newList, null, null, null);
                  setNotification({
                        show: true,
                        message: translate('Operation_Success'),
                        type: NOTIFICATION_SUCCESS
                  });
                  setLoadingProcess(false);
            } catch (err) {
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
                  setLoadingProcess(false);
            }
      };

      const loadAvailableDataSets = async () => {
            try {
                  if (formState.selectedMetaDatas?.length > 0) {
                        let route = null;
                        
                        if (formState.selectedMetaDatas[0]?.type === 'DATA_ELEMENT') {
                              console.log("Cool c'est lancée");
                              route = `${SINGLE_DATA_ELEMENT_ROUTE}/${formState.selectedMetaDatas[0]?.id}?fields=dataSetElements[dataSet[name,id,periodType]`;
                        }

                        if (formState.selectedMetaDatas[0]?.type === 'INDICATOR') {
                              route = null;
                        }

                        if (route) {
                              const response = await axios.get(route);
                              console.log('response : ', response);
                              setAvailableDataSets(response.data?.dataSetElements?.map(d => d.dataSet) || []);
                        }
                  }
            } catch (err) {
                  console.log("Error: ", err)
            }
      };

      useEffect(() => {
            initFields();
      }, [dataStoreIndicators, dataStoreIndicatorsMapping]);

      useEffect(() => {
            loadDataStoreIndicators();
            loadDataStoreIndicatorsMapping();
      }, []);

      useEffect(() => {
            if (formState?.selectedMetaDatas?.length > 0) {
                  loadAvailableDataSets();
            }
      }, [formState?.selectedMetaDatas]);

      return (
            <>
                  <Card className="my-shadow" size="small" style={{ minWidth: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontWeight: 'bold' }}>{translate('Indicators_Mapping')}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Button
                                          primary
                                          onClick={() => setOpenNewIndicatorModal(true)}
                                          loading={false}
                                          icon={<IoMdAddCircleOutline style={{ fontSize: '18px' }} />}
                                    >
                                          {translate('Creer_Nouveau_Indicator')}
                                    </Button>
                                    <Button
                                          primary
                                          onClick={handleSave}
                                          loading={loadingProcess}
                                          icon={<FiSave style={{ fontSize: '18px' }} />}
                                    >
                                          {translate('Enregistrer_Mapping')}
                                    </Button>
                              </div>
                        </div>
                        <div style={{ marginTop: '5px' }}>
                              {loadingIndicatorsMapping || loadingIndicators ? (
                                    <div>Loading...</div>
                              ) : (
                                    <table style={{ borderCollapse: 'collapse', width: '100%', overflowX: 'auto' }}>
                                          <thead>
                                                <tr style={{ background: '#ccc' }}>
                                                      <th
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'center',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070',
                                                                  width: '8%'
                                                            }}
                                                      >
                                                            {translate('Indicator_Group')}
                                                      </th>
                                                      <th
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'center',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070',
                                                                  width: '90%'
                                                            }}
                                                      >
                                                            {translate('Indicators_Mapping')}
                                                      </th>
                                                      <th
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'center',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            #
                                                      </th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {dataStoreIndicators?.map(group => (
                                                      <tr key={group.name}>
                                                            <td
                                                                  style={{
                                                                        padding: '2px 5px',
                                                                        verticalAlign: 'center',
                                                                        textAlign: 'center',
                                                                        border: '1px solid #00000070',
                                                                        width: '10%'
                                                                  }}
                                                            >
                                                                  {group.name}
                                                            </td>
                                                            <td
                                                                  style={{
                                                                        padding: '2px 5px',
                                                                        verticalAlign: 'center',
                                                                        textAlign: 'left',
                                                                        border: '1px solid #00000070',
                                                                        width: '90%'
                                                                  }}
                                                            >
                                                                  {group.children?.map(indicator => (
                                                                        <div
                                                                              key={indicator.name}
                                                                              style={{
                                                                                    marginTop: '5px',
                                                                                    borderBottom: '1px solid #ccc',
                                                                                    paddingBottom: '5px'
                                                                              }}
                                                                        >
                                                                              <Row gutter={[5, 5]}>
                                                                                    <Col md={3}>
                                                                                          <div>{indicator.name}</div>
                                                                                    </Col>
                                                                                    <Col md={8}>
                                                                                          <div
                                                                                                style={{
                                                                                                      display: 'flex',
                                                                                                      alignItems:
                                                                                                            'center',
                                                                                                      gap: '10px'
                                                                                                }}
                                                                                          >
                                                                                                <Input
                                                                                                      width="100%"
                                                                                                      disabled
                                                                                                      value={
                                                                                                            formState?.indicators?.find(
                                                                                                                  it =>
                                                                                                                        it.group ===
                                                                                                                              group.name &&
                                                                                                                        it.indicator ===
                                                                                                                              indicator.name
                                                                                                            )?.dhis2
                                                                                                                  ?.name
                                                                                                      }
                                                                                                />

                                                                                                {formState?.indicators?.find(
                                                                                                      it =>
                                                                                                            it.group ===
                                                                                                                  group.name &&
                                                                                                            it.indicator ===
                                                                                                                  indicator.name
                                                                                                )?.periodType && (
                                                                                                      <span
                                                                                                            style={{
                                                                                                                  background:
                                                                                                                        'orange',
                                                                                                                  fontWeight:
                                                                                                                        'bold',
                                                                                                                  padding: '2px',
                                                                                                                  borderRadius:
                                                                                                                        '10px',
                                                                                                                  color: 'white'
                                                                                                            }}
                                                                                                      >
                                                                                                            {
                                                                                                                  formState?.indicators?.find(
                                                                                                                        it =>
                                                                                                                              it.group ===
                                                                                                                                    group.name &&
                                                                                                                              it.indicator ===
                                                                                                                                    indicator.name
                                                                                                                  )
                                                                                                                        ?.periodType
                                                                                                            }
                                                                                                      </span>
                                                                                                )}
                                                                                          </div>
                                                                                    </Col>
                                                                                    <Col md={1}>
                                                                                          <Button
                                                                                                primary
                                                                                                small
                                                                                                onClick={() => {
                                                                                                      const currentIndicator =
                                                                                                            formState?.indicators?.find(
                                                                                                                  it =>
                                                                                                                        it.group ===
                                                                                                                              group.name &&
                                                                                                                        it.indicator ===
                                                                                                                              indicator.name
                                                                                                            );

                                                                                                      setFormState({
                                                                                                            ...formState,
                                                                                                            visibleAnalyticComponentModal: true,
                                                                                                            selectedMetaDatas:
                                                                                                                  currentIndicator?.dhis2
                                                                                                                        ? [
                                                                                                                                currentIndicator?.dhis2
                                                                                                                          ]
                                                                                                                        : [],
                                                                                                            currentIndicator:
                                                                                                                  {
                                                                                                                        group: group.name,
                                                                                                                        indicator:
                                                                                                                              indicator.name
                                                                                                                  }
                                                                                                      });

                                                                                                      setPeriodType(
                                                                                                            currentIndicator?.periodType ||
                                                                                                                  ''
                                                                                                      );
                                                                                                }}
                                                                                                icon={
                                                                                                      <TbSelect
                                                                                                            style={{
                                                                                                                  fontSize: '18px'
                                                                                                            }}
                                                                                                      />
                                                                                                }
                                                                                          ></Button>
                                                                                    </Col>
                                                                                    <Col md={4}>
                                                                                          <div className="flex gap-2">
                                                                                                <Checkbox
                                                                                                      disabled={
                                                                                                            !formState?.indicators?.find(
                                                                                                                  it =>
                                                                                                                        it.group ===
                                                                                                                              group.name &&
                                                                                                                        it.indicator ===
                                                                                                                              indicator.name
                                                                                                            )?.dhis2
                                                                                                      }
                                                                                                      checked={
                                                                                                            formState?.indicators?.find(
                                                                                                                  it =>
                                                                                                                        it.group ===
                                                                                                                              group.name &&
                                                                                                                        it.indicator ===
                                                                                                                              indicator.name
                                                                                                            )
                                                                                                                  ?.useNameFromDHIS2
                                                                                                      }
                                                                                                      onChange={_ =>
                                                                                                            setFormState(
                                                                                                                  {
                                                                                                                        ...formState,
                                                                                                                        indicators:
                                                                                                                              formState?.indicators?.map(
                                                                                                                                    it => {
                                                                                                                                          if (
                                                                                                                                                it.group ===
                                                                                                                                                      group.name &&
                                                                                                                                                it.indicator ===
                                                                                                                                                      indicator.name
                                                                                                                                          ) {
                                                                                                                                                return {
                                                                                                                                                      ...it,
                                                                                                                                                      useNameFromDHIS2:
                                                                                                                                                            !it.useNameFromDHIS2,
                                                                                                                                                      indicatorRename:
                                                                                                                                                            !it.useNameFromDHIS2
                                                                                                                                                                  ? it
                                                                                                                                                                          .dhis2
                                                                                                                                                                          ?.name
                                                                                                                                                                  : null
                                                                                                                                                };
                                                                                                                                          }

                                                                                                                                          return it;
                                                                                                                                    }
                                                                                                                              )
                                                                                                                  }
                                                                                                            )
                                                                                                      }
                                                                                                >
                                                                                                      {translate(
                                                                                                            'Use_Indicator_Name_From_Dhis2'
                                                                                                      )}
                                                                                                </Checkbox>
                                                                                          </div>
                                                                                    </Col>

                                                                                    <Col md={8}>
                                                                                          <div className="mt-2">
                                                                                                <Input
                                                                                                      disabled={
                                                                                                            !formState?.indicators?.find(
                                                                                                                  it =>
                                                                                                                        it.group ===
                                                                                                                              group.name &&
                                                                                                                        it.indicator ===
                                                                                                                              indicator.name
                                                                                                            )
                                                                                                                  ?.useNameFromDHIS2
                                                                                                      }
                                                                                                      value={
                                                                                                            formState?.indicators?.find(
                                                                                                                  it =>
                                                                                                                        it.group ===
                                                                                                                              group.name &&
                                                                                                                        it.indicator ===
                                                                                                                              indicator.name
                                                                                                            )
                                                                                                                  ?.indicatorRename
                                                                                                      }
                                                                                                      onChange={event =>
                                                                                                            setFormState(
                                                                                                                  {
                                                                                                                        ...formState,
                                                                                                                        indicators:
                                                                                                                              formState?.indicators?.map(
                                                                                                                                    it => {
                                                                                                                                          if (
                                                                                                                                                it.group ===
                                                                                                                                                      group.name &&
                                                                                                                                                it.indicator ===
                                                                                                                                                      indicator.name
                                                                                                                                          ) {
                                                                                                                                                return {
                                                                                                                                                      ...it,

                                                                                                                                                      indicatorRename:
                                                                                                                                                            event
                                                                                                                                                                  .target
                                                                                                                                                                  .value
                                                                                                                                                };
                                                                                                                                          }

                                                                                                                                          return it;
                                                                                                                                    }
                                                                                                                              )
                                                                                                                  }
                                                                                                            )
                                                                                                      }
                                                                                                      className="w-full"
                                                                                                      placeholder={translate(
                                                                                                            'Indicator_Name'
                                                                                                      )}
                                                                                                />
                                                                                          </div>
                                                                                    </Col>
                                                                              </Row>
                                                                        </div>
                                                                  ))}
                                                            </td>
                                                            <td
                                                                  style={{
                                                                        padding: '10px',
                                                                        verticalAlign: 'center',
                                                                        textAlign: 'center',
                                                                        border: '1px solid #00000070'
                                                                  }}
                                                            >
                                                                  <FaRegEdit
                                                                        style={{
                                                                              fontSize: '22px',
                                                                              color: 'blue',
                                                                              cursor: 'pointer'
                                                                        }}
                                                                        onClick={() => {
                                                                              setCurrentDataStoreMapping(group);
                                                                              setOpenNewIndicatorModal(true);
                                                                        }}
                                                                  />
                                                            </td>
                                                      </tr>
                                                ))}
                                          </tbody>
                                    </table>
                              )}
                        </div>
                  </Card>
                  {RenderAnalyticComponentModal()}
                  <SettingIndicatorsMappingNew
                        open={openNewIndicatorModal}
                        setOpen={setOpenNewIndicatorModal}
                        loadDataStoreIndicators={loadDataStoreIndicators}
                        loadDataStoreIndicatorsMapping={loadDataStoreIndicatorsMapping}
                        dataStoreIndicators={dataStoreIndicators}
                        setNotification={setNotification}
                        currentDataStoreMapping={currentDataStoreMapping}
                        setCurrentDataStoreMapping={setCurrentDataStoreMapping}
                  />
                  <MyNotification notification={notification} setNotification={setNotification} />
            </>
      );
};

export default SettingIndicatorsMapping;
