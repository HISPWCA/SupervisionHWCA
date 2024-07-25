import { Select } from 'antd';
import translate from '../utils/translator';
import { v4 as uuid } from 'uuid';

const GenerateIndicatorsFieldsDQR = ({ formState, setFormState }) => {
      return (
            <>
                  <div style={{ marginTop: '10px' }}>
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
                                                      border: '1px solid #00000070',
                                                      width: '50%'
                                                }}
                                          >
                                                {translate('Indicateurs')}
                                          </th>
                                          <th
                                                style={{
                                                      padding: '2px 5px',
                                                      verticalAlign: 'top',
                                                      textAlign: 'center',
                                                      border: '1px solid #00000070',
                                                      width: '50%'
                                                }}
                                          >
                                                {translate('Marge')}
                                          </th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {formState?.indicators?.map((ind, indexInd) => (
                                          <tr key={uuid()}>
                                                <td
                                                      style={{
                                                            border: '1px solid #00000070',
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            width: '50%'
                                                      }}
                                                >
                                                      <div>
                                                            <div
                                                                  style={{
                                                                        marginBottom: '5px'
                                                                  }}
                                                            >
                                                                  {`${translate('Program_Area')} ${indexInd + 1}`}
                                                            </div>
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate('Program_Area')} ${
                                                                              indexInd + 1
                                                                        }`}
                                                                        style={{
                                                                              width: '307px'
                                                                        }}
                                                                        options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                              progStageDE => ({
                                                                                    label: progStageDE.dataElement
                                                                                          ?.displayName,
                                                                                    value: progStageDE.dataElement?.id
                                                                              })
                                                                        )}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={ind?.programArea?.id}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    indicators:
                                                                                          formState?.indicators?.map(
                                                                                                i => {
                                                                                                      if (
                                                                                                            i.id ===
                                                                                                            ind.id
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  programArea:
                                                                                                                        formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                                              p =>
                                                                                                                                    p
                                                                                                                                          .dataElement
                                                                                                                                          .id ===
                                                                                                                                    value
                                                                                                                        )
                                                                                                                              ?.dataElement
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          ) || []
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </div>
                                                      <div style={{ marginTop: '5px' }}>
                                                            <div
                                                                  style={{
                                                                        marginBottom: '5px'
                                                                  }}
                                                            >
                                                                  {`${translate('Indicateurs')} ${indexInd + 1}`}
                                                            </div>
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate('Indicateurs')} ${
                                                                              indexInd + 1
                                                                        }`}
                                                                        style={{
                                                                              width: '307px'
                                                                        }}
                                                                        options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                              progStageDE => ({
                                                                                    label: progStageDE.dataElement
                                                                                          ?.displayName,
                                                                                    value: progStageDE.dataElement?.id
                                                                              })
                                                                        )}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={ind?.value?.id}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    indicators:
                                                                                          formState?.indicators?.map(
                                                                                                i => {
                                                                                                      if (
                                                                                                            i.id ===
                                                                                                            ind.id
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  value: formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                                        p =>
                                                                                                                              p
                                                                                                                                    .dataElement
                                                                                                                                    .id ===
                                                                                                                              value
                                                                                                                  )
                                                                                                                        ?.dataElement
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          ) || []
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </div>
                                                </td>
                                                <td
                                                      style={{
                                                            border: '1px solid #00000070',
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            width: '50%'
                                                      }}
                                                >
                                                      <div>
                                                            <div>{`${translate('Marge')} ${indexInd + 1}`}</div>
                                                            <div
                                                                  style={{
                                                                        marginTop: '3px'
                                                                  }}
                                                            >
                                                                  <Select
                                                                        placeholder={`${translate('Marge')} ${
                                                                              indexInd + 1
                                                                        }`}
                                                                        style={{
                                                                              width: '307px'
                                                                        }}
                                                                        options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                              progStageDE => ({
                                                                                    label: progStageDE.dataElement
                                                                                          ?.displayName,
                                                                                    value: progStageDE.dataElement?.id
                                                                              })
                                                                        )}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={ind?.margin?.id}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    indicators:
                                                                                          formState?.indicators?.map(
                                                                                                i => {
                                                                                                      if (
                                                                                                            i.id ===
                                                                                                            ind.id
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  margin: formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                                        p =>
                                                                                                                              p
                                                                                                                                    .dataElement
                                                                                                                                    .id ===
                                                                                                                              value
                                                                                                                  )
                                                                                                                        ?.dataElement
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          ) || []
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
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
                                                      border: '1px solid #00000070',
                                                      width: '50%'
                                                }}
                                          >
                                                {translate('Cross_check_Configuration')}
                                          </th>
                                          <th
                                                style={{
                                                      padding: '2px 5px',
                                                      verticalAlign: 'top',
                                                      textAlign: 'center',
                                                      border: '1px solid #00000070',
                                                      width: '50%'
                                                }}
                                          >
                                                {translate('Marge')}
                                          </th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {formState?.recoupements?.map((rec, indexRec) => (
                                          <tr key={uuid()}>
                                                <td
                                                      style={{
                                                            border: '1px solid #00000070',
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            width: '50%'
                                                      }}
                                                >
                                                      <div>
                                                            <div
                                                                  style={{
                                                                        marginBottom: '5px'
                                                                  }}
                                                            >
                                                                  {`${translate('Program_Area')} ${indexRec + 1}`}
                                                            </div>
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate('Program_Area')} ${
                                                                              indexRec + 1
                                                                        }`}
                                                                        style={{
                                                                              width: '307px'
                                                                        }}
                                                                        options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                              progStageDE => ({
                                                                                    label: progStageDE.dataElement
                                                                                          ?.displayName,
                                                                                    value: progStageDE.dataElement?.id
                                                                              })
                                                                        )}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={rec?.programArea?.id}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    recoupements:
                                                                                          formState?.recoupements?.map(
                                                                                                i => {
                                                                                                      if (
                                                                                                            i.id ===
                                                                                                            rec.id
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  programArea:
                                                                                                                        formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                                              p =>
                                                                                                                                    p
                                                                                                                                          .dataElement
                                                                                                                                          .id ===
                                                                                                                                    value
                                                                                                                        )
                                                                                                                              ?.dataElement
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          ) || []
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </div>
                                                      <div style={{ marginTop: '5px' }}>
                                                            <div
                                                                  style={{
                                                                        marginBottom: '5px'
                                                                  }}
                                                            >
                                                                  {`${translate('Recoupement_Primary')} ${
                                                                        indexRec + 1
                                                                  }`}
                                                            </div>
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate(
                                                                              'Recoupement_Primary'
                                                                        )} ${indexRec + 1}`}
                                                                        style={{
                                                                              width: '307px'
                                                                        }}
                                                                        options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                              progStageDE => ({
                                                                                    label: progStageDE.dataElement
                                                                                          ?.displayName,
                                                                                    value: progStageDE.dataElement?.id
                                                                              })
                                                                        )}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={rec?.primaryValue?.id}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    recoupements:
                                                                                          formState?.recoupements?.map(
                                                                                                i => {
                                                                                                      if (
                                                                                                            i.id ===
                                                                                                            rec.id
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  primaryValue:
                                                                                                                        formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                                              p =>
                                                                                                                                    p
                                                                                                                                          .dataElement
                                                                                                                                          .id ===
                                                                                                                                    value
                                                                                                                        )
                                                                                                                              ?.dataElement
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          ) || []
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </div>
                                                      <div style={{ marginTop: '5px' }}>
                                                            <div
                                                                  style={{
                                                                        marginBottom: '5px'
                                                                  }}
                                                            >
                                                                  {`${translate('Recoupement_Secondary')} ${
                                                                        indexRec + 1
                                                                  }`}
                                                            </div>
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate(
                                                                              'Recoupement_Secondary'
                                                                        )} ${indexRec + 1}`}
                                                                        style={{
                                                                              width: '307px'
                                                                        }}
                                                                        options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                              progStageDE => ({
                                                                                    label: progStageDE.dataElement
                                                                                          ?.displayName,
                                                                                    value: progStageDE.dataElement?.id
                                                                              })
                                                                        )}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={rec?.secondaryValue?.id}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    recoupements:
                                                                                          formState?.recoupements?.map(
                                                                                                i => {
                                                                                                      if (
                                                                                                            i.id ===
                                                                                                            rec.id
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  secondaryValue:
                                                                                                                        formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                                              p =>
                                                                                                                                    p
                                                                                                                                          .dataElement
                                                                                                                                          .id ===
                                                                                                                                    value
                                                                                                                        )
                                                                                                                              ?.dataElement
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          ) || []
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </div>
                                                </td>
                                                <td
                                                      style={{
                                                            border: '1px solid #00000070',
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            width: '50%'
                                                      }}
                                                >
                                                      <div>
                                                            <div>{`${translate('Marge')}`}</div>
                                                            <div
                                                                  style={{
                                                                        marginTop: '3px'
                                                                  }}
                                                            >
                                                                  <Select
                                                                        placeholder={`${translate('Marge')}`}
                                                                        style={{
                                                                              width: '307px'
                                                                        }}
                                                                        options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                              progStageDE => ({
                                                                                    label: progStageDE.dataElement
                                                                                          ?.displayName,
                                                                                    value: progStageDE.dataElement?.id
                                                                              })
                                                                        )}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={rec?.margin?.id}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    recoupements:
                                                                                          formState?.recoupements?.map(
                                                                                                i => {
                                                                                                      if (
                                                                                                            i.id ===
                                                                                                            rec.id
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  margin: formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                                        p =>
                                                                                                                              p
                                                                                                                                    .dataElement
                                                                                                                                    .id ===
                                                                                                                              value
                                                                                                                  )
                                                                                                                        ?.dataElement
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          ) || []
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </div>
                                                </td>
                                          </tr>
                                    ))}
                              </tbody>
                        </table>
                  </div>

                  <div style={{ marginTop: '30px' }}>
                        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                              {translate('ConsistencyOverTime_Configuration')}
                        </div>

                        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                              <thead>
                                    <tr style={{ background: '#ccc' }}>
                                          <th
                                                style={{
                                                      padding: '2px 5px',
                                                      verticalAlign: 'top',
                                                      textAlign: 'center',
                                                      border: '1px solid #00000070',
                                                      width: '50%'
                                                }}
                                          >
                                                {translate('Indicateurs')}
                                          </th>
                                          <th
                                                style={{
                                                      padding: '2px 5px',
                                                      verticalAlign: 'top',
                                                      textAlign: 'center',
                                                      border: '1px solid #00000070',
                                                      width: '50%'
                                                }}
                                          >
                                                {translate('Marge')}
                                          </th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {formState?.consistencyOvertimes?.map((item, indexItem) => (
                                          <tr key={uuid()}>
                                                <td
                                                      style={{
                                                            border: '1px solid #00000070',
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            width: '50%'
                                                      }}
                                                >
                                                      <div>
                                                            <div
                                                                  style={{
                                                                        marginBottom: '5px'
                                                                  }}
                                                            >
                                                                  {`${translate('Program_Area')}`}
                                                            </div>
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate('Program_Area')} `}
                                                                        style={{
                                                                              width: '307px'
                                                                        }}
                                                                        options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                              progStageDE => ({
                                                                                    label: progStageDE.dataElement
                                                                                          ?.displayName,
                                                                                    value: progStageDE.dataElement?.id
                                                                              })
                                                                        )}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={item?.programArea?.id}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    consistencyOvertimes:
                                                                                          formState?.consistencyOvertimes?.map(
                                                                                                i => {
                                                                                                      if (
                                                                                                            i.id ===
                                                                                                            item.id
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  programArea:
                                                                                                                        formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                                              p =>
                                                                                                                                    p
                                                                                                                                          .dataElement
                                                                                                                                          .id ===
                                                                                                                                    value
                                                                                                                        )
                                                                                                                              ?.dataElement
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          ) || []
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </div>
                                                      <div style={{ marginTop: '5px' }}>
                                                            <div
                                                                  style={{
                                                                        marginBottom: '5px'
                                                                  }}
                                                            >
                                                                  {`${translate('ConsistencyOverTime')}`}
                                                            </div>
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate(
                                                                              'ConsistencyOverTime'
                                                                        )} `}
                                                                        style={{
                                                                              width: '307px'
                                                                        }}
                                                                        options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                              progStageDE => ({
                                                                                    label: progStageDE.dataElement
                                                                                          ?.displayName,
                                                                                    value: progStageDE.dataElement?.id
                                                                              })
                                                                        )}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={item?.value?.id}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    consistencyOvertimes:
                                                                                          formState?.consistencyOvertimes?.map(
                                                                                                i => {
                                                                                                      if (
                                                                                                            i.id ===
                                                                                                            item.id
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  value: formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                                        p =>
                                                                                                                              p
                                                                                                                                    .dataElement
                                                                                                                                    .id ===
                                                                                                                              value
                                                                                                                  )
                                                                                                                        ?.dataElement
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          ) || []
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
                                                      </div>
                                                </td>
                                                <td
                                                      style={{
                                                            border: '1px solid #00000070',
                                                            padding: '2px 5px',
                                                            verticalAlign: 'top',
                                                            width: '50%'
                                                      }}
                                                >
                                                      <div>
                                                            <div>{`${translate('Marge')}`}</div>
                                                            <div
                                                                  style={{
                                                                        marginTop: '3px'
                                                                  }}
                                                            >
                                                                  <Select
                                                                        placeholder={`${translate('Marge')}`}
                                                                        style={{
                                                                              width: '307px'
                                                                        }}
                                                                        options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                              progStageDE => ({
                                                                                    label: progStageDE.dataElement
                                                                                          ?.displayName,
                                                                                    value: progStageDE.dataElement?.id
                                                                              })
                                                                        )}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={item?.margin?.id}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    consistencyOvertimes:
                                                                                          formState?.consistencyOvertimes?.map(
                                                                                                i => {
                                                                                                      if (
                                                                                                            i.id ===
                                                                                                            item.id
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  margin: formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                                        p =>
                                                                                                                              p
                                                                                                                                    .dataElement
                                                                                                                                    .id ===
                                                                                                                              value
                                                                                                                  )
                                                                                                                        ?.dataElement
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          ) || []
                                                                              });
                                                                        }}
                                                                  />
                                                            </div>
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
                                                      border: '1px solid #00000070',
                                                      width: '33%'
                                                }}
                                          >
                                                {translate('Data_Element')}
                                          </th>
                                          <th
                                                style={{
                                                      padding: '2px 5px',
                                                      verticalAlign: 'top',
                                                      textAlign: 'center',
                                                      border: '1px solid #00000070',
                                                      width: '33%'
                                                }}
                                          >
                                                {translate('Source_Document')}
                                          </th>
                                          <th
                                                style={{
                                                      padding: '2px 5px',
                                                      verticalAlign: 'top',
                                                      textAlign: 'center',
                                                      border: '1px solid #00000070',
                                                      width: '33%'
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
                                                      border: '1px solid #00000070',
                                                      padding: '2px 5px',
                                                      verticalAlign: 'top',
                                                      width: '33%'
                                                }}
                                          >
                                                <div>
                                                      <div
                                                            style={{
                                                                  marginBottom: '5px'
                                                            }}
                                                      >
                                                            {`${translate('Program_Area')}`}
                                                      </div>
                                                      <div>
                                                            <Select
                                                                  placeholder={`${translate('Program_Area')} `}
                                                                  style={{
                                                                        width: '207px'
                                                                  }}
                                                                  options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                        progStageDE => ({
                                                                              label: progStageDE.dataElement
                                                                                    ?.displayName,
                                                                              value: progStageDE.dataElement?.id
                                                                        })
                                                                  )}
                                                                  showSearch
                                                                  allowClear
                                                                  optionFilterProp="label"
                                                                  value={formState?.completeness?.programAreaDE?.id}
                                                                  onChange={value => {
                                                                        setFormState({
                                                                              ...formState,
                                                                              completeness: {
                                                                                    ...formState?.completeness,
                                                                                    programAreaDE:
                                                                                          formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                p =>
                                                                                                      p.dataElement
                                                                                                            .id ===
                                                                                                      value
                                                                                          )?.dataElement
                                                                              }
                                                                        });
                                                                  }}
                                                            />
                                                      </div>
                                                </div>
                                                {formState?.completeness?.dataElements?.map((item, indexItem) => (
                                                      <div style={{ marginTop: '5px' }}>
                                                            <div
                                                                  style={{
                                                                        marginBottom: '5px'
                                                                  }}
                                                            >
                                                                  {`${translate('Data_Element')} ${indexItem + 1}`}
                                                            </div>
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate('Data_Element')} ${
                                                                              indexItem + 1
                                                                        }`}
                                                                        style={{
                                                                              width: '207px'
                                                                        }}
                                                                        options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                              progStageDE => ({
                                                                                    label: progStageDE.dataElement
                                                                                          ?.displayName,
                                                                                    value: progStageDE.dataElement?.id
                                                                              })
                                                                        )}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={item?.value?.id}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    completeness: {
                                                                                          ...formState?.completeness,
                                                                                          dataElements:
                                                                                                formState?.completeness?.dataElements?.map(
                                                                                                      i => {
                                                                                                            if (
                                                                                                                  i.id ===
                                                                                                                  item.id
                                                                                                            ) {
                                                                                                                  return {
                                                                                                                        ...i,
                                                                                                                        value: formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                                              p =>
                                                                                                                                    p
                                                                                                                                          .dataElement
                                                                                                                                          .id ===
                                                                                                                                    value
                                                                                                                        )
                                                                                                                              ?.dataElement
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
                                                      </div>
                                                ))}
                                          </td>
                                          <td
                                                style={{
                                                      border: '1px solid #00000070',
                                                      padding: '2px 5px',
                                                      verticalAlign: 'top',
                                                      width: '33%'
                                                }}
                                          >
                                                <div>
                                                      <div
                                                            style={{
                                                                  marginBottom: '5px'
                                                            }}
                                                      >
                                                            {`${translate('Program_Area')}`}
                                                      </div>
                                                      <div>
                                                            <Select
                                                                  placeholder={`${translate('Program_Area')} `}
                                                                  style={{
                                                                        width: '207px'
                                                                  }}
                                                                  options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                        progStageDE => ({
                                                                              label: progStageDE.dataElement
                                                                                    ?.displayName,
                                                                              value: progStageDE.dataElement?.id
                                                                        })
                                                                  )}
                                                                  showSearch
                                                                  allowClear
                                                                  optionFilterProp="label"
                                                                  value={formState?.completeness?.programAreaDOC?.id}
                                                                  onChange={value => {
                                                                        setFormState({
                                                                              ...formState,
                                                                              completeness: {
                                                                                    ...formState?.completeness,
                                                                                    programAreaDOC:
                                                                                          formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                p =>
                                                                                                      p.dataElement
                                                                                                            .id ===
                                                                                                      value
                                                                                          )?.dataElement
                                                                              }
                                                                        });
                                                                  }}
                                                            />
                                                      </div>
                                                </div>
                                                {formState?.completeness?.sourceDocuments?.map((item, indexItem) => (
                                                      <div style={{ marginTop: '5px' }}>
                                                            <div
                                                                  style={{
                                                                        marginBottom: '5px'
                                                                  }}
                                                            >
                                                                  {`${translate('Source_Document')} ${indexItem + 1}`}
                                                            </div>
                                                            <div>
                                                                  <Select
                                                                        placeholder={`${translate('Source_Document')} ${
                                                                              indexItem + 1
                                                                        }`}
                                                                        style={{
                                                                              width: '207px'
                                                                        }}
                                                                        options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                              progStageDE => ({
                                                                                    label: progStageDE.dataElement
                                                                                          ?.displayName,
                                                                                    value: progStageDE.dataElement?.id
                                                                              })
                                                                        )}
                                                                        showSearch
                                                                        allowClear
                                                                        optionFilterProp="label"
                                                                        value={item?.value?.id}
                                                                        onChange={value => {
                                                                              setFormState({
                                                                                    ...formState,
                                                                                    completeness: {
                                                                                          ...formState?.completeness,
                                                                                          sourceDocuments:
                                                                                                formState?.completeness?.sourceDocuments?.map(
                                                                                                      i => {
                                                                                                            if (
                                                                                                                  i.id ===
                                                                                                                  item.id
                                                                                                            ) {
                                                                                                                  return {
                                                                                                                        ...i,
                                                                                                                        value: formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                                                              p =>
                                                                                                                                    p
                                                                                                                                          .dataElement
                                                                                                                                          .id ===
                                                                                                                                    value
                                                                                                                        )
                                                                                                                              ?.dataElement
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
                                                      </div>
                                                ))}
                                          </td>
                                          <td
                                                style={{
                                                      border: '1px solid #00000070',
                                                      padding: '2px 5px',
                                                      verticalAlign: 'top',
                                                      width: '33%'
                                                }}
                                          >
                                                <div>
                                                      <div
                                                            style={{
                                                                  marginBottom: '5px'
                                                            }}
                                                      >
                                                            {`${translate('Marge')}`}
                                                      </div>
                                                      <div>
                                                            <Select
                                                                  placeholder={`${translate('Marge')} `}
                                                                  style={{
                                                                        width: '207px'
                                                                  }}
                                                                  options={formState?.selectedProgramStageForConfiguration?.programStageDataElements?.map(
                                                                        progStageDE => ({
                                                                              label: progStageDE.dataElement
                                                                                    ?.displayName,
                                                                              value: progStageDE.dataElement?.id
                                                                        })
                                                                  )}
                                                                  showSearch
                                                                  allowClear
                                                                  optionFilterProp="label"
                                                                  value={formState?.completeness?.margin?.id}
                                                                  onChange={value => {
                                                                        setFormState({
                                                                              ...formState,
                                                                              completeness: {
                                                                                    ...formState?.completeness,
                                                                                    margin: formState?.selectedProgramStageForConfiguration?.programStageDataElements?.find(
                                                                                          p =>
                                                                                                p.dataElement.id ===
                                                                                                value
                                                                                    )?.dataElement
                                                                              }
                                                                        });
                                                                  }}
                                                            />
                                                      </div>
                                                </div>
                                          </td>
                                    </tr>
                              </tbody>
                        </table>
                  </div>
            </>
      );
};

export default GenerateIndicatorsFieldsDQR;
