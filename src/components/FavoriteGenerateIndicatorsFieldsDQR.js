import { Card, Input, Select } from 'antd';
import translate from '../utils/translator';
import { getLetter } from '../utils/functions';

const FavoriteGenerateIndicatorsFieldsDQR = ({
      formState,
      setFormState,
      dataStoreIndicators,
      dataStoreCrosschecks,
      dataStoreDECompletness,
      dataStoreDSCompletness,
      dataStoreRegistres
}) => {
      const getNumberIndicatorsToShow = () => {
            let newArray = [];
            for (let i = 1; i <= formState?.indicators?.length || 0; i++) {
                  newArray.push({ value: i, label: i });
            }
            return newArray;
      };

      const getDocumentsSourceToShow = () => {
            let newArray = [];
            for (let i = 1; i <= formState?.completeness?.sourceDocuments?.length || 0; i++) {
                  newArray.push({ value: i, label: i });
            }
            return newArray;
      };

      const getDataElementsToShow = () => {
            let newArray = [];
            for (let i = 1; i <= formState?.completeness?.dataElements?.length || 0; i++) {
                  newArray.push({ value: i, label: i });
            }
            return newArray;
      };

      const handleSelectedGlobalProgramArea = value => {
            const globalIndicatorProgramArea = dataStoreIndicators.find(d => d.name === value);
            if (globalIndicatorProgramArea && value) {
                  setFormState({
                        ...formState,
                        selectedGlobalProgramArea: globalIndicatorProgramArea,

                        indicators: formState?.indicators?.map(i => ({
                              ...i,
                              selectedSourceIndicator: null,
                              selectedSourceProgramArea: globalIndicatorProgramArea
                        })),

                        recoupements: formState?.recoupements?.map(i => ({
                              ...i,
                              selectedSourcePrimary: null,
                              selectedSourceSecondary: null,
                              selectedSourceProgramArea: dataStoreCrosschecks.find(d => d.name === value)
                        })),

                        consistencyOvertimes: formState?.consistencyOvertimes?.map(i => ({
                              ...i,
                              selectedSourceProgramArea: globalIndicatorProgramArea
                        })),

                        completeness: {
                              ...formState?.completeness,
                              selectedSourceProgramAreaDE: dataStoreDECompletness?.find(d => d.name === value),
                              selectedSourceProgramAreaDS: dataStoreDSCompletness?.find(d => d.name === value)
                        }
                  });
            } else {
                  setFormState({
                        ...formState,
                        selectedGlobalProgramArea: null
                  });
            }
      };

      return (
            <>
                  <Card className="my-shadow my-scrollable" bodyStyle={{ padding: '10px' }} size="small">
                        <div>
                              <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                                    {translate('Indicators_Configuration')}
                              </div>
                              <div
                                    style={{
                                          justifyContent: 'center',
                                          width: '100%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          marginBottom: '10px'
                                    }}
                              >
                                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '30px' }}>
                                          <span>{translate('Global_Program_Area')}</span>
                                          <span style={{ marginLeft: '10px' }}>
                                                <Select
                                                      placeholder={`${translate('Program_Area')} `}
                                                      style={{
                                                            minWidth: '200px'
                                                      }}
                                                      options={dataStoreIndicators?.map(ind => ({
                                                            label: ind.name,
                                                            value: ind.name
                                                      }))}
                                                      showSearch
                                                      allowClear
                                                      optionFilterProp="label"
                                                      value={formState?.selectedGlobalProgramArea?.name}
                                                      onChange={handleSelectedGlobalProgramArea}
                                                />
                                          </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                          <span style={{ fontWeight: 'bold' }}>{translate('How_Many_Indicators')}</span>
                                          <span style={{ marginLeft: '10px' }}>
                                                <Select
                                                      style={{ width: '100px' }}
                                                      options={getNumberIndicatorsToShow()}
                                                      value={formState?.nbrIndicatorsToShow}
                                                      onChange={value => {
                                                            setFormState({ ...formState, nbrIndicatorsToShow: value });
                                                      }}
                                                />
                                          </span>
                                    </div>
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
                                                      {translate('Indicator_Name')}
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
                                          {formState?.indicators
                                                ?.slice(0, formState?.nbrIndicatorsToShow)
                                                ?.map((indicator, indIndex) => (
                                                      <tr key={indIndex}>
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
                                                                              placeholder={`${translate(
                                                                                    'Program_Area'
                                                                              )} `}
                                                                              style={{
                                                                                    width: '100%'
                                                                              }}
                                                                              options={dataStoreIndicators?.map(
                                                                                    ind => ({
                                                                                          label: ind.name,
                                                                                          value: ind.name
                                                                                    })
                                                                              )}
                                                                              disabled={
                                                                                    formState?.selectedGlobalProgramArea &&
                                                                                    indicator?.selectedSourceProgramArea
                                                                                          ?.name
                                                                              }
                                                                              showSearch
                                                                              allowClear
                                                                              optionFilterProp="label"
                                                                              value={
                                                                                    indicator?.selectedSourceProgramArea
                                                                                          ?.name
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
                                                                              placeholder={`${translate(
                                                                                    'Indicator_Name'
                                                                              )} `}
                                                                              style={{
                                                                                    width: '100%'
                                                                              }}
                                                                              options={
                                                                                    dataStoreIndicators
                                                                                          ?.find(
                                                                                                d =>
                                                                                                      d.name ===
                                                                                                      indicator
                                                                                                            ?.selectedSourceProgramArea
                                                                                                            ?.name
                                                                                          )
                                                                                          ?.children?.map(ind => ({
                                                                                                label: ind.name,
                                                                                                value: ind.name
                                                                                          })) || []
                                                                              }
                                                                              disabled={
                                                                                    !indicator.selectedSourceProgramArea
                                                                              }
                                                                              showSearch
                                                                              allowClear
                                                                              optionFilterProp="label"
                                                                              value={
                                                                                    indicator?.selectedSourceIndicator
                                                                                          ?.name
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
                                                                                                                              dataStoreIndicators
                                                                                                                                    ?.find(
                                                                                                                                          d =>
                                                                                                                                                d.name ===
                                                                                                                                                indicator
                                                                                                                                                      ?.selectedSourceProgramArea
                                                                                                                                                      ?.name
                                                                                                                                    )
                                                                                                                                    ?.children?.find(
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
                                                                              min={0}
                                                                              type="number"
                                                                              value={indicator?.selectedSourceMargin}
                                                                              onChange={event => {
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
                                                                                                                        selectedSourceMargin:
                                                                                                                              event
                                                                                                                                    .target
                                                                                                                                    .value
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
                                                <tr key={recIndex}>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'center',
                                                                  textAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            {`${translate('Recoupements')} ${getLetter(recIndex + 1)}`}
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
                                                                        disabled={
                                                                              formState?.selectedGlobalProgramArea &&
                                                                              rec?.selectedSourceProgramArea?.name
                                                                        }
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
                                                                        options={dataStoreCrosschecks
                                                                              ?.find(
                                                                                    c =>
                                                                                          c.name ===
                                                                                          rec.selectedSourceProgramArea
                                                                                                ?.name
                                                                              )
                                                                              ?.children?.map(ind => ({
                                                                                    label: ind.name,
                                                                                    value: ind.name
                                                                              }))}
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
                                                                                                                        dataStoreCrosschecks
                                                                                                                              ?.find(
                                                                                                                                    c =>
                                                                                                                                          c.name ===
                                                                                                                                          rec
                                                                                                                                                .selectedSourceProgramArea
                                                                                                                                                ?.name
                                                                                                                              )
                                                                                                                              ?.children?.find(
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
                                                                        placeholder={`${translate(
                                                                              'Secondary_Source'
                                                                        )} `}
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
                                                                                                                        dataStoreCrosschecks
                                                                                                                              ?.find(
                                                                                                                                    c =>
                                                                                                                                          c.name ===
                                                                                                                                          rec
                                                                                                                                                .selectedSourceProgramArea
                                                                                                                                                ?.name
                                                                                                                              )
                                                                                                                              ?.children?.find(
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
                                                                        min={0}
                                                                        type="number"
                                                                        value={rec?.selectedSourceMargin}
                                                                        onChange={event => {
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
                                                                                                                  selectedSourceMargin:
                                                                                                                        event
                                                                                                                              .target
                                                                                                                              .value
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
                                                      {translate('Indicator_Name')}
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
                                                <tr key={consIndex}>
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
                                                                        disabled={
                                                                              formState?.selectedGlobalProgramArea &&
                                                                              cons?.selectedSourceProgramArea?.name
                                                                        }
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
                                                                        placeholder={`${translate('Indicator_Name')} `}
                                                                        style={{
                                                                              width: '100%'
                                                                        }}
                                                                        options={dataStoreIndicators
                                                                              ?.find(
                                                                                    d =>
                                                                                          d.name ===
                                                                                          cons.selectedSourceProgramArea
                                                                                                ?.name
                                                                              )
                                                                              ?.children?.map(ind => ({
                                                                                    label: ind.name,
                                                                                    value: ind.name
                                                                              }))}
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
                                                                                                                        dataStoreIndicators
                                                                                                                              ?.find(
                                                                                                                                    d =>
                                                                                                                                          d.name ===
                                                                                                                                          cons
                                                                                                                                                .selectedSourceProgramArea
                                                                                                                                                ?.name
                                                                                                                              )
                                                                                                                              ?.children?.find(
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
                                                                        min={0}
                                                                        type="number"
                                                                        value={cons?.selectedSourceMargin}
                                                                        onChange={event => {
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
                                                                                                                  selectedSourceMargin:
                                                                                                                        event
                                                                                                                              .target
                                                                                                                              .value
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
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>

                        <div style={{ marginTop: '30px' }}>
                              <div style={{ marginBottom: '10px', display: 'flex', gap: '50px', alignItems: 'center' }}>
                                    <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                                          {translate('Data_Element_&_Source_Documentation_Configurations')}
                                    </div>
                                    <div>
                                          <div style={{ fontWeight: 'bold' }}>{translate('How_Many_Data_Element')}</div>
                                          <div>
                                                <Select
                                                      style={{ width: '100%' }}
                                                      options={getDataElementsToShow()}
                                                      value={formState?.completeness?.nbrDataElementsToShow}
                                                      onChange={value => {
                                                            setFormState({
                                                                  ...formState,
                                                                  completeness: {
                                                                        ...formState?.completeness,
                                                                        nbrDataElementsToShow: value
                                                                  }
                                                            });
                                                      }}
                                                />
                                          </div>
                                    </div>
                                    <div>
                                          <div style={{ fontWeight: 'bold' }}>
                                                {translate('How_Many_Document_Source')}
                                          </div>
                                          <div>
                                                <Select
                                                      style={{ width: '100%' }}
                                                      options={getDocumentsSourceToShow()}
                                                      value={formState?.completeness?.nbrDocumentsSourceToShow}
                                                      onChange={value => {
                                                            setFormState({
                                                                  ...formState,
                                                                  completeness: {
                                                                        ...formState?.completeness,
                                                                        nbrDocumentsSourceToShow: value
                                                                  }
                                                            });
                                                      }}
                                                />
                                          </div>
                                    </div>
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
                                                      {translate('Marge')}
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
                                          </tr>
                                    </thead>
                                    <tbody>
                                          <tr>
                                                <td
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'center',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {`${translate('Program_Area')}`}
                                                </td>
                                                <td
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'center',
                                                            textAlign: 'center',
                                                            border: '1px solid blue'
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
                                                                  disabled={
                                                                        formState?.selectedGlobalProgramArea &&
                                                                        formState?.completeness
                                                                              ?.selectedSourceProgramAreaDE?.name
                                                                  }
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
                                                                                    register: null,
                                                                                    selectedSourceProgramAreaDE:
                                                                                          dataStoreDECompletness?.find(
                                                                                                d => d.name === value
                                                                                          )
                                                                              }
                                                                        });
                                                                  }}
                                                            />
                                                      </div>
                                                </td>

                                                <td
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'center',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                      rowSpan={3}
                                                >
                                                      <div>
                                                            <Input
                                                                  placeholder={`${translate('Marge')} `}
                                                                  style={{ width: '100%' }}
                                                                  min={0}
                                                                  type="number"
                                                                  value={formState?.completeness?.selectedSourceMargin}
                                                                  onChange={event => {
                                                                        setFormState({
                                                                              ...formState,
                                                                              completeness: {
                                                                                    ...formState?.completeness,
                                                                                    selectedSourceMargin:
                                                                                          event.target.value
                                                                              }
                                                                        });
                                                                  }}
                                                            />
                                                      </div>
                                                </td>

                                                <td
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'center',
                                                            textAlign: 'center',
                                                            border: '1px solid blue'
                                                      }}
                                                      rowSpan={2}
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
                                                                  disabled={
                                                                        formState?.selectedGlobalProgramArea &&
                                                                        formState?.completeness
                                                                              ?.selectedSourceProgramAreaDS?.name
                                                                  }
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
                                                </td>
                                          </tr>

                                          <tr>
                                                <td
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'center',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      {`${translate('Register_Name')}`}
                                                </td>
                                                <td
                                                      style={{
                                                            padding: '2px 5px',
                                                            verticalAlign: 'center',
                                                            textAlign: 'center',
                                                            border: '1px solid #00000070'
                                                      }}
                                                >
                                                      <div>
                                                            <Select
                                                                  placeholder={`${translate('Register_Name')}`}
                                                                  style={{
                                                                        width: '100%'
                                                                  }}
                                                                  options={dataStoreRegistres
                                                                        ?.find(
                                                                              d =>
                                                                                    d.name ===
                                                                                    formState?.completeness
                                                                                          ?.selectedSourceProgramAreaDE
                                                                                          ?.name
                                                                        )
                                                                        ?.children?.map(ind => ({
                                                                              label: ind.name,
                                                                              value: ind.name
                                                                        }))}
                                                                  disabled={
                                                                        formState?.completeness
                                                                              ?.selectedSourceProgramAreaDE?.name
                                                                              ? false
                                                                              : true
                                                                  }
                                                                  showSearch
                                                                  allowClear
                                                                  optionFilterProp="label"
                                                                  value={formState?.completeness?.register?.name}
                                                                  onChange={value => {
                                                                        setFormState({
                                                                              ...formState,
                                                                              completeness: {
                                                                                    ...formState?.completeness,
                                                                                    register: dataStoreRegistres
                                                                                          ?.find(
                                                                                                d =>
                                                                                                      d.name ===
                                                                                                      formState
                                                                                                            ?.completeness
                                                                                                            ?.selectedSourceProgramAreaDE
                                                                                                            ?.name
                                                                                          )
                                                                                          ?.children?.find(
                                                                                                d => d =>
                                                                                                      d.name === value
                                                                                          )
                                                                              }
                                                                        });
                                                                  }}
                                                            />
                                                      </div>
                                                </td>
                                          </tr>

                                          <tr>
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
                                                      {formState?.completeness?.dataElements
                                                            ?.slice(0, +formState?.completeness?.nbrDataElementsToShow)
                                                            ?.map((de, deIndex) => (
                                                                  <div key={deIndex} style={{ marginTop: '5px' }}>
                                                                        <Select
                                                                              placeholder={`${translate(
                                                                                    'Data_Element'
                                                                              )} ${deIndex + 1}`}
                                                                              style={{
                                                                                    width: '100%'
                                                                              }}
                                                                              options={dataStoreDECompletness
                                                                                    ?.find(
                                                                                          c =>
                                                                                                c.name ===
                                                                                                formState?.completeness
                                                                                                      ?.selectedSourceProgramAreaDE
                                                                                                      ?.name
                                                                                    )
                                                                                    ?.children?.map(ind => ({
                                                                                          label: ind.name,
                                                                                          value: ind.name
                                                                                    }))}
                                                                              disabled={
                                                                                    formState?.completeness
                                                                                          ?.selectedSourceProgramAreaDE
                                                                                          ? false
                                                                                          : true
                                                                              }
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
                                                                                                            (
                                                                                                                  i,
                                                                                                                  iIndex
                                                                                                            ) => {
                                                                                                                  if (
                                                                                                                        iIndex ===
                                                                                                                        deIndex
                                                                                                                  ) {
                                                                                                                        return {
                                                                                                                              ...i,
                                                                                                                              selectedSourceDE:
                                                                                                                                    dataStoreDECompletness
                                                                                                                                          ?.find(
                                                                                                                                                c =>
                                                                                                                                                      c.name ===
                                                                                                                                                      formState
                                                                                                                                                            ?.completeness
                                                                                                                                                            ?.selectedSourceProgramAreaDE
                                                                                                                                                            ?.name
                                                                                                                                          )
                                                                                                                                          ?.children?.find(
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
                                                      {formState?.completeness?.sourceDocuments
                                                            ?.slice(
                                                                  0,
                                                                  +formState?.completeness?.nbrDocumentsSourceToShow
                                                            )
                                                            ?.map((de, deIndex) => (
                                                                  <div key={deIndex} style={{ marginTop: '5px' }}>
                                                                        <Select
                                                                              placeholder={`${translate(
                                                                                    'Source_Document'
                                                                              )} ${deIndex + 1}`}
                                                                              style={{
                                                                                    width: '100%'
                                                                              }}
                                                                              options={dataStoreDSCompletness
                                                                                    ?.find(
                                                                                          c =>
                                                                                                c.name ===
                                                                                                formState?.completeness
                                                                                                      ?.selectedSourceProgramAreaDS
                                                                                                      ?.name
                                                                                    )
                                                                                    ?.children?.map(ind => ({
                                                                                          label: ind.name,
                                                                                          value: ind.name
                                                                                    }))}
                                                                              disabled={
                                                                                    formState?.completeness
                                                                                          ?.selectedSourceProgramAreaDS
                                                                                          ? false
                                                                                          : true
                                                                              }
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
                                                                                                            (
                                                                                                                  i,
                                                                                                                  iIndex
                                                                                                            ) => {
                                                                                                                  if (
                                                                                                                        iIndex ===
                                                                                                                        deIndex
                                                                                                                  ) {
                                                                                                                        return {
                                                                                                                              ...i,
                                                                                                                              selectedSourceDS:
                                                                                                                                    dataStoreDSCompletness
                                                                                                                                          ?.find(
                                                                                                                                                c =>
                                                                                                                                                      c.name ===
                                                                                                                                                      formState
                                                                                                                                                            ?.completeness
                                                                                                                                                            ?.selectedSourceProgramAreaDS
                                                                                                                                                            ?.name
                                                                                                                                          )
                                                                                                                                          ?.children?.find(
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
                                          </tr>
                                    </tbody>
                              </table>
                        </div>
                  </Card>
            </>
      );
};

export default FavoriteGenerateIndicatorsFieldsDQR;
