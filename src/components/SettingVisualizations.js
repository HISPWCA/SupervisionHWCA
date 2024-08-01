import { QuestionCircleOutlined } from '@ant-design/icons';
import { Col, Popconfirm, Table } from 'antd';
import { RiDeleteBinLine } from 'react-icons/ri';
import translate from '../utils/translator';
import { Button } from '@dhis2/ui';
import { useState } from 'react';

const SettingVisualizations = () => {
      const [formState, setFormState] = useState({});
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
                                                                                          // onConfirm={() =>
                                                                                          //       handleDeleteVisualizationConfig(
                                                                                          //             value
                                                                                          //       )
                                                                                          // }
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
                                                            // loading={loadingSaveSupervionsConfig}
                                                            // disabled={
                                                            //       loadingSaveSupervionsConfig || !selectedTEIProgram
                                                            // }
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
                                                                  // loading={loadingSaveSupervionsConfig}
                                                                  // disabled={
                                                                  //       loadingSaveSupervionsConfig ||
                                                                  //       !selectedTEIProgram
                                                                  // }
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
                                                {translate('Visualization_Configurations')}
                                          </div>
                                          <Table
                                                dataSource={dataStoreVisualizations.map(fav => ({
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
                        </Col>
                  </Row>
            </>
      );
};

export default SettingVisualizations;
