import translate from '../utils/translator';
import { Card, Checkbox, Col, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import { loadDataStore, saveDataToDataStore } from '../utils/functions';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { TbSelect } from 'react-icons/tb';
import { DataDimension } from '@dhis2/analytics';
import { FiSave } from 'react-icons/fi';
import MyNotification from './MyNotification';
import { NOTIFICATION_CRITICAL, NOTIFICATION_SUCCESS } from '../utils/constants';

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
      const [loadingProcess, setLoadingProcess] = useState(false);
      const [loadingIndicators, setLoadingIndicators] = useState(false);
      const [loadingIndicatorsMapping, setLoadingIndicatorsMapping] = useState(false);

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
                                    )?.dhis2
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
                                    </div>
                              )}
                        </ModalContent>
                        <ModalActions>
                              <ButtonStrip end>
                                    <Button
                                          primary
                                          onClick={() =>
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
                                                                              dhis2: formState?.selectedMetaDatas[0]
                                                                        };
                                                                  }
                                                                  return ind;
                                                            }) || []
                                                })
                                          }
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

      useEffect(() => {
            initFields();
      }, [dataStoreIndicators, dataStoreIndicatorsMapping]);

      useEffect(() => {
            loadDataStoreIndicators();
            loadDataStoreIndicatorsMapping();
      }, []);

      return (
            <>
                  {console.log(formState)}
                  <Card className="my-shadow" size="small" style={{ minWidth: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontWeight: 'bold' }}>{translate('Indicators_Mapping')}</div>
                              <div>
                                    <Button
                                          primary
                                          onClick={handleSave}
                                          loading={loadingProcess}
                                          icon={<FiSave style={{ fontSize: '18px' }} />}
                                    >
                                          {translate('Enregistrer')}
                                    </Button>
                              </div>
                        </div>
                        <div style={{ marginTop: '5px' }}>
                              {loadingIndicatorsMapping || loadingIndicators ? (
                                    <div>Loading...</div>
                              ) : (
                                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                          <thead>
                                                <tr style={{ background: '#ccc' }}>
                                                      <th
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'center',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070',
                                                                  width: '10%'
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
                                                                                                      )?.dhis2?.name
                                                                                                }
                                                                                          />
                                                                                    </Col>
                                                                                    <Col md={1}>
                                                                                          <Button
                                                                                                primary
                                                                                                small
                                                                                                onClick={() =>
                                                                                                      setFormState({
                                                                                                            ...formState,
                                                                                                            visibleAnalyticComponentModal: true,
                                                                                                            currentIndicator:
                                                                                                                  {
                                                                                                                        group: group.name,
                                                                                                                        indicator:
                                                                                                                              indicator.name
                                                                                                                  }
                                                                                                      })
                                                                                                }
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
                                                      </tr>
                                                ))}
                                          </tbody>
                                    </table>
                              )}
                        </div>
                  </Card>
                  {RenderAnalyticComponentModal()}
                  <MyNotification notification={notification} setNotification={setNotification} />
            </>
      );
};

export default SettingIndicatorsMapping;
