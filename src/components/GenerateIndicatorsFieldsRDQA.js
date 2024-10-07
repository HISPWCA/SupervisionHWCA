import { Input, Select } from 'antd';
import translate from '../utils/translator';
import { v4 as uuid } from 'uuid';

const GenerateIndicatorsFieldsRDQA = ({
      indicatorsFieldsConfigsForRDQA,
      setIndicatorsFieldsConfigsForRDQA,
      formStateForRDQA
}) => {
      return (
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
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
                        {indicatorsFieldsConfigsForRDQA?.map((ind) => (
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
                                                      options={formStateForRDQA?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                            progStageDE => ({
                                                                  label: progStageDE.dataElement?.displayName,
                                                                  value: progStageDE.dataElement?.id
                                                            })
                                                      )}
                                                      showSearch
                                                      clearIcon
                                                      allowClear
                                                      optionFilterProp="label"
                                                      value={ind?.value?.id}
                                                      onSelect={value => {
                                                            setIndicatorsFieldsConfigsForRDQA(
                                                                  indicatorsFieldsConfigsForRDQA.map((i) => {
                                                                        if (ind.id === i.id) {
                                                                              return {
                                                                                    ...i,
                                                                                    value: formStateForRDQA?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
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
                                                                  options={formStateForRDQA?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                        progStageDE => ({
                                                                              label: progStageDE.dataElement
                                                                                    ?.displayName,
                                                                              value: progStageDE.dataElement?.id
                                                                        })
                                                                  )}
                                                                  showSearch
                                                                  clearIcon
                                                                  allowClear
                                                                  optionFilterProp="label"
                                                                  value={
                                                                        ind?.recoupements?.find(rec => rec.id === r.id)
                                                                              ?.value?.id
                                                                  }
                                                                  onSelect={value => {
                                                                        setIndicatorsFieldsConfigsForRDQA(
                                                                              indicatorsFieldsConfigsForRDQA.map(
                                                                                    (i) => {
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
                                                                                                                                    value: formStateForRDQA?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
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
                                    </td>
                              </tr>
                        ))}
                  </tbody>
            </table>
      );
};

export default GenerateIndicatorsFieldsRDQA;
