import { Input, Select } from 'antd';
import translate from '../utils/translator';
import { v4 as uuid } from 'uuid';
import { useState } from 'react';

const GenerateIndicatorsConfigFieldsList = ({
      indicatorsFieldsConfigs,
      selectedProgramStageForConfiguration,
      setIndicatorsFieldsConfigs,
      selectedConfigurationType
}) => {
      const [list, setList] = useState(indicatorsFieldsConfigs);

      return (
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <pre>{JSON.stringify(list.map(l => l.indicatorMargin ))}</pre>
                  <thead>
                        <tr style={{ background: '#ccc' }}>
                              <th
                                    style={{
                                          padding: '10px',
                                          textAlign: 'center',
                                          border: '1px solid #00000070',
                                          width: '50%'
                                    }}
                              >
                                    {translate('Indicateurs')}
                              </th>
                              <th
                                    style={{
                                          padding: '10px',
                                          textAlign: 'center',
                                          border: '1px solid #00000070',
                                          width: '50%'
                                    }}
                              >
                                    {translate('Recoupements')}
                              </th>
                        </tr>
                  </thead>
                  <tbody>
                        {indicatorsFieldsConfigs.map((ind, indexInd) => (
                              <tr key={uuid()}>
                                    <td
                                          style={{
                                                border: '1px solid #00000070',
                                                padding: '10px',
                                                width: '50%'
                                          }}
                                    >
                                          <div
                                                style={{
                                                      marginBottom: '5px'
                                                }}
                                          >
                                                {ind?.name}
                                          </div>
                                          <div>
                                                <Select
                                                      placeholder={ind.name}
                                                      style={{
                                                            width: '307px'
                                                      }}
                                                      options={selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                            progStageDE => ({
                                                                  label: progStageDE.dataElement?.displayName,
                                                                  value: progStageDE.dataElement?.id
                                                            })
                                                      )}
                                                      showSearch
                                                      allowClear
                                                      optionFilterProp="label"
                                                      value={ind?.value?.id}
                                                      onSelect={value => {
                                                            setIndicatorsFieldsConfigs(
                                                                  indicatorsFieldsConfigs.map((i, indexi) => {
                                                                        if (ind.id === i.id) {
                                                                              return {
                                                                                    ...i,
                                                                                    value: selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                          p =>
                                                                                                p.dataElement.id ===
                                                                                                value
                                                                                    )?.dataElement
                                                                              };
                                                                        }
                                                                        return i;
                                                                  })
                                                            );
                                                      }}
                                                />
                                          </div>

                                          {selectedConfigurationType === 'DQR' && (
                                                <div style={{ marginTop: '15px' }}>
                                                      <div>{`${translate('Marge')} ${indexInd + 1}`}</div>
                                                      <div
                                                            style={{
                                                                  marginTop: '5px'
                                                            }}
                                                      >
                                                            <Input
                                                                  type="number"
                                                                  style={{
                                                                        width: '100%'
                                                                  }}
                                                                  placeholder={`${translate('Marge')} ${indexInd + 1}`}
                                                                  value={list[indexInd]?.indicatorMargin}
                                                                  onChange={event => {
                                                                        setIndicatorsFieldsConfigs([
                                                                              ...indicatorsFieldsConfigs.map(
                                                                                    (i, index) => {
                                                                                          if (i.id === ind.id) {
                                                                                                return {
                                                                                                      ...i,
                                                                                                      indicatorMargin:
                                                                                                            '' +
                                                                                                            event.target
                                                                                                                  .value
                                                                                                };
                                                                                          }
                                                                                          return i;
                                                                                    }
                                                                              )
                                                                        ]);

                                                                        setList([
                                                                              ...list.map((i, index) => {
                                                                                    if (i.id === ind.id) {
                                                                                          return {
                                                                                                ...i,
                                                                                                indicatorMargin:
                                                                                                      event.target.value
                                                                                          };
                                                                                    }
                                                                                    return i;
                                                                              })
                                                                        ]);
                                                                  }}
                                                            />
                                                      </div>
                                                </div>
                                          )}
                                    </td>
                                    <td
                                          style={{
                                                border: '1px solid #00000070',
                                                padding: '10px',
                                                width: '50%'
                                          }}
                                    >
                                          {ind.recoupements?.map(r => (
                                                <div
                                                      key={uuid()}
                                                      style={{
                                                            marginTop: '3px'
                                                      }}
                                                >
                                                      <div
                                                            style={{
                                                                  marginBottom: '5px'
                                                            }}
                                                      >
                                                            {r.name}
                                                      </div>

                                                      <div>
                                                            <Select
                                                                  placeholder={r.name}
                                                                  style={{
                                                                        width: '307px'
                                                                  }}
                                                                  options={selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                        progStageDE => ({
                                                                              label: progStageDE.dataElement
                                                                                    ?.displayName,
                                                                              value: progStageDE.dataElement?.id
                                                                        })
                                                                  )}
                                                                  showSearch
                                                                  allowClear
                                                                  optionFilterProp="label"
                                                                  value={
                                                                        ind?.recoupements?.find(rec => rec.id === r.id)
                                                                              ?.value?.id
                                                                  }
                                                                  onSelect={value => {
                                                                        setIndicatorsFieldsConfigs(
                                                                              indicatorsFieldsConfigs.map(
                                                                                    (i, indexj) => {
                                                                                          if (i.id === ind.id) {
                                                                                                return {
                                                                                                      ...i,
                                                                                                      recoupements:
                                                                                                            i.recoupements?.map(
                                                                                                                  recoupement => {
                                                                                                                        if (
                                                                                                                              recoupement.id ===
                                                                                                                              r.id
                                                                                                                        ) {
                                                                                                                              return {
                                                                                                                                    ...recoupement,
                                                                                                                                    value: selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                                                          p =>
                                                                                                                                                p
                                                                                                                                                      .dataElement
                                                                                                                                                      .id ===
                                                                                                                                                value
                                                                                                                                    )
                                                                                                                                          ?.dataElement
                                                                                                                              };
                                                                                                                        }
                                                                                                                        return recoupement;
                                                                                                                  }
                                                                                                            )
                                                                                                };
                                                                                          }
                                                                                          return i;
                                                                                    }
                                                                              )
                                                                        );
                                                                  }}
                                                            />
                                                      </div>
                                                </div>
                                          ))}

                                          {selectedConfigurationType === 'DQR' && (
                                                <div style={{ marginTop: '15px' }}>
                                                      <div>{`${translate('Marge')} ${indexInd + 1}`}</div>
                                                      <div
                                                            style={{
                                                                  marginTop: '5px'
                                                            }}
                                                      >
                                                            <Input
                                                                  type="number"
                                                                  style={{
                                                                        width: '100%'
                                                                  }}
                                                                  placeholder={`${translate('Marge')} ${indexInd + 1}`}
                                                                  value={ind.recoupementMargin}
                                                                  onChange={event => {
                                                                        setIndicatorsFieldsConfigs(
                                                                              indicatorsFieldsConfigs.map(
                                                                                    (i, indexJ) => {
                                                                                          if (i.id === ind.id) {
                                                                                                return {
                                                                                                      ...i,
                                                                                                      recoupementMargin:
                                                                                                            event.target
                                                                                                                  .value
                                                                                                };
                                                                                          }
                                                                                          return i;
                                                                                    }
                                                                              )
                                                                        );
                                                                  }}
                                                            />
                                                      </div>
                                                </div>
                                          )}
                                    </td>
                              </tr>
                        ))}
                  </tbody>
            </table>
      );
};

export default GenerateIndicatorsConfigFieldsList;
