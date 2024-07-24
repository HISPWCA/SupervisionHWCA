import { Card, Input, Select } from 'antd';
import translate from '../utils/translator';
import { v4 as uuid } from 'uuid';

const FavoriteGenerateIndicatorsFieldsDQR = ({
      formState,
      setFormState,
      dataStoreIndicators,
      dataStoreCrosschecks,
      dataStoreDECompletness,
      dataStoreDSCompletness
}) => {
      return (
            <>
                  <Card className="my-shadow my-scrollable" bodyStyle={{ padding: '10px' }} size="small">
                        <div>
                              <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                                    {translate('Indicators_Configuration')}
                              </div>
                              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                    <thead>
                                          <tr style={{ background: '#ccc' }}>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Indicateurs')}
                                                </th>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Program_Area')}
                                                </th>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Source_De_Donnée')}
                                                </th>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Marge')}
                                                </th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {formState?.indicators?.map((indicator, indIndex) => (
                                                <tr key={uuid()}>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'center',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            {indicator?.value?.displayName}
                                                      </td>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'top',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate('Program_Area')} `}
                                                                        style={{
                                                                              width: '100%'
                                                                        }}
                                                                        options={dataStoreIndicators?.map(ind => ({
                                                                              label: ind.name,
                                                                              value: ind.name
                                                                        }))}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={
                                                                              indicator?.selectedSourceProgramArea?.name
                                                                        }
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    indicators:
                                                                                          formState?.indicators?.map(
                                                                                                (i, iIndex) => {
                                                                                                      if (
                                                                                                            iIndex ===
                                                                                                            indIndex
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  selectedSourceIndicator:
                                                                                                                        null,
                                                                                                                  selectedSourceProgramArea:
                                                                                                                        dataStoreIndicators.find(
                                                                                                                              d =>
                                                                                                                                    d.name ===
                                                                                                                                    value
                                                                                                                        )
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          )
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </td>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'top',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate('Program_Area')} `}
                                                                        style={{
                                                                              width: '100%'
                                                                        }}
                                                                        options={indicator.selectedSourceProgramArea?.children?.map(
                                                                              ind => ({
                                                                                    label: ind.name,
                                                                                    value: ind.name
                                                                              })
                                                                        )}
                                                                        disabled={!indicator.selectedSourceProgramArea}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={indicator?.selectedSourceIndicator?.name}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    indicators:
                                                                                          formState?.indicators?.map(
                                                                                                (i, iIndex) => {
                                                                                                      if (
                                                                                                            iIndex ===
                                                                                                            indIndex
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  selectedSourceIndicator:
                                                                                                                        indicator.selectedSourceProgramArea?.children?.find(
                                                                                                                              d =>
                                                                                                                                    d.name ===
                                                                                                                                    value
                                                                                                                        )
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          )
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </td>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'top',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            <div>
                                                                  <Input
                                                                        placeholder={`${translate('Marge')} `}
                                                                        style={{ width: '100%' }}
                                                                  />
                                                            </div>
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>

                        <div style={{ marginTop: '30px' }}>
                              <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                                    {translate('Cross_check_Configuration')}
                              </div>
                              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                    <thead>
                                          <tr style={{ background: '#ccc' }}>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Recoupements')}
                                                </th>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Program_Area')}
                                                </th>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Primary_Source')}
                                                </th>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Secondary_Source')}
                                                </th>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Marge')}
                                                </th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {formState?.recoupements?.map((rec, recIndex) => (
                                                <tr key={uuid()}>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'center',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            {`${translate('Recoupements')} ${recIndex + 1}`}
                                                      </td>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'top',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate('Program_Area')} `}
                                                                        style={{
                                                                              width: '100%'
                                                                        }}
                                                                        options={dataStoreCrosschecks?.map(ind => ({
                                                                              label: ind.name,
                                                                              value: ind.name
                                                                        }))}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={rec?.selectedSourceProgramArea?.name}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    recoupements:
                                                                                          formState?.recoupements?.map(
                                                                                                (i, iIndex) => {
                                                                                                      if (
                                                                                                            iIndex ===
                                                                                                            recIndex
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  selectedSourcePrimary:
                                                                                                                        null,
                                                                                                                  selectedSourceSecondary:
                                                                                                                        null,
                                                                                                                  selectedSourceProgramArea:
                                                                                                                        dataStoreCrosschecks.find(
                                                                                                                              d =>
                                                                                                                                    d.name ===
                                                                                                                                    value
                                                                                                                        )
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          )
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </td>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'top',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate('Primary_Source')} `}
                                                                        style={{
                                                                              width: '100%'
                                                                        }}
                                                                        options={rec.selectedSourceProgramArea?.children?.map(
                                                                              ind => ({
                                                                                    label: ind.name,
                                                                                    value: ind.name
                                                                              })
                                                                        )}
                                                                        disabled={!rec.selectedSourceProgramArea}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={rec?.selectedSourcePrimary?.name}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    recoupements:
                                                                                          formState?.recoupements?.map(
                                                                                                (i, iIndex) => {
                                                                                                      if (
                                                                                                            iIndex ===
                                                                                                            recIndex
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  selectedSourcePrimary:
                                                                                                                        rec.selectedSourceProgramArea?.children?.find(
                                                                                                                              d =>
                                                                                                                                    d.name ===
                                                                                                                                    value
                                                                                                                        )
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          )
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </td>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'top',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate('Primary_Source')} `}
                                                                        style={{
                                                                              width: '100%'
                                                                        }}
                                                                        options={rec.selectedSourceProgramArea?.children?.map(
                                                                              ind => ({
                                                                                    label: ind.name,
                                                                                    value: ind.name
                                                                              })
                                                                        )}
                                                                        disabled={!rec.selectedSourceProgramArea}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={rec?.selectedSourceSecondary?.name}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    recoupements:
                                                                                          formState?.recoupements?.map(
                                                                                                (i, iIndex) => {
                                                                                                      if (
                                                                                                            iIndex ===
                                                                                                            recIndex
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  selectedSourceSecondary:
                                                                                                                        rec.selectedSourceProgramArea?.children?.find(
                                                                                                                              d =>
                                                                                                                                    d.name ===
                                                                                                                                    value
                                                                                                                        )
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          )
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </td>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'top',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            <div>
                                                                  <Input
                                                                        placeholder={`${translate('Marge')} `}
                                                                        style={{ width: '100%' }}
                                                                  />
                                                            </div>
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>

                        <div style={{ marginTop: '30px' }}>
                              <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                                    {translate('ConsistencyOverTime')}
                              </div>
                              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                    <thead>
                                          <tr style={{ background: '#ccc' }}>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('ConsistencyOverTime')}
                                                </th>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Program_Area')}
                                                </th>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Source_De_Donnée')}
                                                </th>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Marge')}
                                                </th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {formState?.consistencyOvertimes?.map((cons, consIndex) => (
                                                <tr key={uuid()}>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'center',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            {`${translate('ConsistencyOverTime')} ${consIndex + 1}`}
                                                      </td>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'top',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate('Program_Area')} `}
                                                                        style={{
                                                                              width: '100%'
                                                                        }}
                                                                        options={dataStoreIndicators?.map(ind => ({
                                                                              label: ind.name,
                                                                              value: ind.name
                                                                        }))}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={cons?.selectedSourceProgramArea?.name}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    consistencyOvertimes:
                                                                                          formState?.consistencyOvertimes?.map(
                                                                                                (i, iIndex) => {
                                                                                                      if (
                                                                                                            iIndex ===
                                                                                                            consIndex
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  selectedSourceProgramArea:
                                                                                                                        dataStoreIndicators.find(
                                                                                                                              d =>
                                                                                                                                    d.name ===
                                                                                                                                    value
                                                                                                                        )
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          )
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </td>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'top',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate('Program_Area')} `}
                                                                        style={{
                                                                              width: '100%'
                                                                        }}
                                                                        options={cons.selectedSourceProgramArea?.children?.map(
                                                                              ind => ({
                                                                                    label: ind.name,
                                                                                    value: ind.name
                                                                              })
                                                                        )}
                                                                        disabled={!cons.selectedSourceProgramArea}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={cons?.selectedSourceConsistency?.name}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    consistencyOvertimes:
                                                                                          formState?.consistencyOvertimes?.map(
                                                                                                (i, iIndex) => {
                                                                                                      if (
                                                                                                            iIndex ===
                                                                                                            consIndex
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  selectedSourceConsistency:
                                                                                                                        cons.selectedSourceProgramArea?.children?.find(
                                                                                                                              d =>
                                                                                                                                    d.name ===
                                                                                                                                    value
                                                                                                                        )
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          )
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </td>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'top',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            <div>
                                                                  <Input
                                                                        placeholder={`${translate('Marge')} `}
                                                                        style={{ width: '100%' }}
                                                                  />
                                                            </div>
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>

                        <div style={{ marginTop: '30px' }}>
                              <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                                    {translate('Data_Element_&_Source_Documentation_Configurations')}
                              </div>
                              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                    <thead>
                                          <tr style={{ background: '#ccc' }}>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {`${translate('Data_Element')} & ${translate('Source_Document')}`}
                                                </th>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Data_Element')}
                                                </th>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Source_Document')}
                                                </th>
                                                <th
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {translate('Marge')}
                                                </th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          <tr key={uuid()}>
                                                <td
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'center',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {`${translate('Data_Element')} & ${translate('Source_Document')}`}
                                                </td>

                                                <td
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      <div>
                                                            <Select
                                                                  placeholder={`${translate('Program_Area')}`}
                                                                  style={{
                                                                        width: '100%'
                                                                  }}
                                                                  options={dataStoreDECompletness?.map(ind => ({
                                                                        label: ind.name,
                                                                        value: ind.name
                                                                  }))}
                                                                  showSearch
                                                                  allowClear
                                                                  optionFilterProp="label"
                                                                  value={
                                                                        formState?.completeness
                                                                              ?.selectedSourceProgramAreaDE?.name
                                                                  }
                                                                  onChange={value => {
                                                                        setFormState({
                                                                              ...formState,
                                                                              completeness: {
                                                                                    ...formState?.completeness,
                                                                                    selectedSourceProgramAreaDE:
                                                                                          dataStoreDECompletness?.find(
                                                                                                d => d.name === value
                                                                                          )
                                                                              }
                                                                        });
                                                                  }}
                                                            />
                                                      </div>

                                                      {formState?.completeness?.dataElements?.map((de, deIndex) => (
                                                            <div key={uuid()} style={{ marginTop: '5px' }}>
                                                                  <Select
                                                                        placeholder={`${translate('Data_Element')} ${
                                                                              deIndex + 1
                                                                        }`}
                                                                        style={{
                                                                              width: '100%'
                                                                        }}
                                                                        options={formState?.completeness?.selectedSourceProgramAreaDE?.children?.map(
                                                                              ind => ({
                                                                                    label: ind.name,
                                                                                    value: ind.name
                                                                              })
                                                                        )}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={de?.selectedSourceDE?.name}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    completeness: {
                                                                                          ...formState?.completeness,
                                                                                          dataElements:
                                                                                                formState?.completeness?.dataElements?.map(
                                                                                                      (i, iIndex) => {
                                                                                                            if (
                                                                                                                  iIndex ===
                                                                                                                  deIndex
                                                                                                            ) {
                                                                                                                  return {
                                                                                                                        ...i,
                                                                                                                        selectedSourceDE:
                                                                                                                              formState?.completeness?.selectedSourceProgramAreaDE?.children?.find(
                                                                                                                                    d =>
                                                                                                                                          d.name ===
                                                                                                                                          value
                                                                                                                              )
                                                                                                                  };
                                                                                                            }
                                                                                                            return i;
                                                                                                      }
                                                                                                )
                                                                                    }
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      ))}
                                                </td>

                                                <td
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      <div>
                                                            <Select
                                                                  placeholder={`${translate('Program_Area')}`}
                                                                  style={{
                                                                        width: '100%'
                                                                  }}
                                                                  options={dataStoreDSCompletness?.map(ind => ({
                                                                        label: ind.name,
                                                                        value: ind.name
                                                                  }))}
                                                                  showSearch
                                                                  allowClear
                                                                  optionFilterProp="label"
                                                                  value={
                                                                        formState?.completeness
                                                                              ?.selectedSourceProgramAreaDS?.name
                                                                  }
                                                                  onChange={value => {
                                                                        setFormState({
                                                                              ...formState,
                                                                              completeness: {
                                                                                    ...formState?.completeness,
                                                                                    selectedSourceProgramAreaDS:
                                                                                          dataStoreDSCompletness?.find(
                                                                                                d => d.name === value
                                                                                          )
                                                                              }
                                                                        });
                                                                  }}
                                                            />
                                                      </div>

                                                      {formState?.completeness?.sourceDocuments?.map((de, deIndex) => (
                                                            <div key={uuid()} style={{ marginTop: '5px' }}>
                                                                  <Select
                                                                        placeholder={`${translate('Data_Element')} ${
                                                                              deIndex + 1
                                                                        }`}
                                                                        style={{
                                                                              width: '100%'
                                                                        }}
                                                                        options={formState?.completeness?.selectedSourceProgramAreaDS?.children?.map(
                                                                              ind => ({
                                                                                    label: ind.name,
                                                                                    value: ind.name
                                                                              })
                                                                        )}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={de?.selectedSourceDS?.name}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    completeness: {
                                                                                          ...formState?.completeness,
                                                                                          sourceDocuments:
                                                                                                formState?.completeness?.sourceDocuments?.map(
                                                                                                      (i, iIndex) => {
                                                                                                            if (
                                                                                                                  iIndex ===
                                                                                                                  deIndex
                                                                                                            ) {
                                                                                                                  return {
                                                                                                                        ...i,
                                                                                                                        selectedSourceDS:
                                                                                                                              formState?.completeness?.selectedSourceProgramAreaDS?.children?.find(
                                                                                                                                    d =>
                                                                                                                                          d.name ===
                                                                                                                                          value
                                                                                                                              )
                                                                                                                  };
                                                                                                            }
                                                                                                            return i;
                                                                                                      }
                                                                                                )
                                                                                    }
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      ))}
                                                </td>

                                                <td
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      <div>
                                                            <Input
                                                                  placeholder={`${translate('Marge')} `}
                                                                  style={{ width: '100%' }}
                                                            />
                                                      </div>
                                                </td>
                                          </tr>
                                    </tbody>
                              </table>
                        </div>
                  </Card>
            </>
      );
};

export default FavoriteGenerateIndicatorsFieldsDQR;
