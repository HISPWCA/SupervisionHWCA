import { Col, Input, Popconfirm, Row, Select, Table } from 'antd';
import translate from '../utils/translator';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle, Radio } from '@dhis2/ui';
import { useState, useEffect } from 'react';
import { loadDataStore } from '../utils/functions';
import { MAPS_ROUTE, VISUALIZATIONS_ROUTE } from '../utils/api.routes';
import { DataDimension } from '@dhis2/analytics';
import { CgCloseO } from 'react-icons/cg';
import { FiSave } from 'react-icons/fi';

const SettingVisualizations = ({ programs }) => {
      const [formState, setFormState] = useState({
            selectedProgram: null,
            selectedFavoris: null,
            currentFavoris: null,
            selectedTypeVisualization: 'VISUALIZATION',
            selectedVisualization: null,
            dxElements: [],
            dxName: '',
            dxDHIS2Element: null,
            dxTypeElement: {
                  id: 'INDICATOR',
                  label: 'Indicateur'
            },
            visibleAnalyticComponentModal: false,
            selectedMetaDatas: []
      });

      const [dataStoreVisualizations, setDataStoreVisualizations] = useState([]);
      const [visualizations, setVisualizations] = useState([]);
      const [maps, setMaps] = useState([]);
      const [loadingDataStoreVisualizations, setLoadingDataStoreVisualizations] = useState(false);

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

      const loadVisualizations = async () => {
            try {
                  const response = await axios.get(
                        `${VISUALIZATIONS_ROUTE}?pageSize=100000&fields=id,displayName,name,type`
                  );
                  setVisualizations(response.data.visualizations || []);
            } catch (err) {}
      };

      const handleSelectProgram = value => {
            setFormState({
                  ...formState,
                  selectedProgram: programs?.find(p => p.id === value)
            });
      };

      const loadMaps = async () => {
            try {
                  const response = await axios.get(`${MAPS_ROUTE}?paging=false&fields=id,displayName,name`);
                  setMaps(response.data.maps?.map(m => ({ ...m, type: 'MAP' })) || []);
            } catch (err) {}
      };

      const handleAddElement = () => {
            if (formState.dxDHIS2Element) {
                  const payload = {
                        ...formState.dxDHIS2Element,
                        type: formState.dxTypeElement?.id
                  };

                  setFormState({ ...formState, dxElements: [...formState?.dxElements, payload] });
            }
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
                              <div style={{ padding: '20px', border: '1px solid #ccc' }}>
                                    <DataDimension
                                          selectedDimensions={formState?.selectedMetaDatas?.map(it => ({
                                                ...it,
                                                isDeactivated: true
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
                        </ModalContent>
                        <ModalActions>
                              <ButtonStrip end>
                                    <Button
                                          destructive
                                          onClick={() =>
                                                setFormState({
                                                      ...formState,
                                                      visibleAnalyticComponentModal: false,
                                                      dxName: formState?.selectedMetaDatas[0]?.name
                                                })
                                          }
                                          icon={<CgCloseO style={{ fontSize: '18px' }} />}
                                    >
                                          {translate('Close')}
                                    </Button>
                              </ButtonStrip>
                        </ModalActions>
                  </Modal>
            ) : (
                  <></>
            );

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

                  setFavorisItems([]);
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

      useEffect(() => {
            loadDataStoreVisualizations();
            loadVisualizations();
            loadMaps();
      }, []);

      return (
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
                                                            showSearch
                                                            placeholder={translate('Programmes_Tracker')}
                                                            style={{ width: '100%' }}
                                                            optionFilterProp="label"
                                                            onChange={handleSelectProgram}
                                                            value={formState?.selectedProgram?.id}
                                                            allowClear
                                                      />
                                                </div>
                                                <div style={{ marginTop: '20px' }}>
                                                      <div style={{ marginTop: '5px' }}>
                                                            <Radio
                                                                  label={translate('VisualisationType')}
                                                                  onChange={({ value }) =>
                                                                        setFormState({
                                                                              ...formState,
                                                                              selectedTypeVisualization: value
                                                                        })
                                                                  }
                                                                  value="VISUALIZATION"
                                                                  checked={
                                                                        formState?.selectedTypeVisualization ===
                                                                        'VISUALIZATION'
                                                                  }
                                                            />
                                                      </div>
                                                      <div style={{ marginTop: '5px' }}>
                                                            <Radio
                                                                  label={translate('MapType')}
                                                                  onChange={({ value }) =>
                                                                        setFormState({
                                                                              ...formState,
                                                                              selectedTypeVisualization: value
                                                                        })
                                                                  }
                                                                  value="MAP"
                                                                  checked={
                                                                        formState?.selectedTypeVisualization === 'MAP'
                                                                  }
                                                            />
                                                      </div>
                                                </div>
                                                <div style={{ marginTop: '10px' }}>
                                                      {formState?.selectedTypeVisualization === 'VISUALIZATION' && (
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
                                                                        placeholder={translate('SelectVisualizations')}
                                                                        style={{ width: '100%' }}
                                                                        optionFilterProp="label"
                                                                        onChange={value =>
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    selectedVisualization:
                                                                                          visualizations?.find(
                                                                                                v => v.id === value
                                                                                          )
                                                                              })
                                                                        }
                                                                        value={formState?.selectedVisualization}
                                                                        allowClear
                                                                  />
                                                            </div>
                                                      )}

                                                      {formState?.selectedTypeVisualization === 'MAP' && (
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
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    selectedVisualization: maps?.find(
                                                                                          m => m.id === value
                                                                                    )
                                                                              })
                                                                        }
                                                                        value={formState?.selectedVisualization?.map(
                                                                              m => m.id
                                                                        )}
                                                                        allowClear
                                                                  />
                                                            </div>
                                                      )}
                                                </div>

                                                {formState?.selectedTypeVisualization && (
                                                      <div style={{ marginTop: '20px' }}>
                                                            <Row gutter={[8, 8]}>
                                                                  <Col md={8} sm={24}>
                                                                        <Select
                                                                              options={[
                                                                                    {
                                                                                          id: 'INDICATOR',
                                                                                          label: 'Indicateur'
                                                                                    },
                                                                                    {
                                                                                          id: 'RECOUPEMENT',
                                                                                          label: 'Recoupement'
                                                                                    }
                                                                              ]}
                                                                              value={formState?.dxTypeElement}
                                                                              onChange={value =>
                                                                                    setFormState({
                                                                                          ...formState,
                                                                                          dxTypeElement: value
                                                                                    })
                                                                              }
                                                                              style={{ width: '100%' }}
                                                                        />
                                                                  </Col>
                                                                  <Col md={12} sm={24}>
                                                                        <div
                                                                              style={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center'
                                                                              }}
                                                                        >
                                                                              <Input
                                                                                    placeholder={translate(
                                                                                          'Element_Name'
                                                                                    )}
                                                                                    style={{ width: '80%' }}
                                                                                    value={formState?.dxName}
                                                                                    onChange={e =>
                                                                                          setFormState({
                                                                                                ...formState,
                                                                                                dxName: e.target.value
                                                                                          })
                                                                                    }
                                                                                    disabled={
                                                                                          formState?.dxDHIS2Element
                                                                                                ? false
                                                                                                : true
                                                                                    }
                                                                              />
                                                                              <div style={{ marginLeft: '5px' }}>
                                                                                    <Button
                                                                                          onClick={() =>
                                                                                                setFormState({
                                                                                                      ...formState,
                                                                                                      visibleAnalyticComponentModal: true
                                                                                                })
                                                                                          }
                                                                                          small
                                                                                          primary
                                                                                    >
                                                                                          vis
                                                                                    </Button>
                                                                              </div>
                                                                        </div>
                                                                  </Col>
                                                                  <Col md={4} sm={24}>
                                                                        <Button
                                                                              small
                                                                              onClick={handleAddElement}
                                                                              primary
                                                                        >
                                                                              + {translate('Ajouter')}
                                                                        </Button>
                                                                  </Col>
                                                            </Row>
                                                      </div>
                                                )}

                                                {formState?.dxElements?.length > 0 && (
                                                      <div style={{ marginTop: '20px' }}>
                                                            <table
                                                                  style={{ width: '100%', borderCollapse: 'collapse' }}
                                                            >
                                                                  <thead>
                                                                        <tr style={{ background: '#ccc' }}>
                                                                              <th
                                                                                    style={{
                                                                                          padding: '2px',
                                                                                          border: '1px solid #ccc'
                                                                                    }}
                                                                              >
                                                                                    {translate('Element_Name')}
                                                                              </th>
                                                                              <th
                                                                                    style={{
                                                                                          padding: '2px',
                                                                                          border: '1px solid #ccc'
                                                                                    }}
                                                                              >
                                                                                    {translate('Action')}
                                                                              </th>
                                                                        </tr>
                                                                  </thead>
                                                                  {formState?.dxElements?.map(element => (
                                                                        <tr key={element.id}>
                                                                              <td
                                                                                    style={{
                                                                                          padding: '2px',
                                                                                          border: '1px solid #ccc'
                                                                                    }}
                                                                              >
                                                                                    {element.name}
                                                                              </td>
                                                                              <td
                                                                                    style={{
                                                                                          padding: '2px',
                                                                                          border: '1px solid #ccc'
                                                                                    }}
                                                                              >
                                                                                    Supprimer
                                                                              </td>
                                                                        </tr>
                                                                  ))}
                                                            </table>
                                                      </div>
                                                )}

                                                {formState?.selectedVisualization && (
                                                      <div style={{ marginTop: '10px' }}>
                                                            <Button
                                                                  primary
                                                                  onClick={handleSaveVisualizationToDataStore}
                                                            >
                                                                  +{translate('Ajouter')}
                                                            </Button>
                                                      </div>
                                                )}
                                          </div>
                                    </>
                              </div>
                        </Col>
                  </Row>
                  {console.log(formState)}
                  {RenderAnalyticComponentModal()}
            </>
      );
};

export default SettingVisualizations;
