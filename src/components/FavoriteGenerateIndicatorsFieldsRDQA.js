import { useState } from 'react';
import { Card, Col, Input, Row } from 'antd';
import translate from '../utils/translator';
import { v4 as uuid } from 'uuid';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { DataDimension } from '@dhis2/analytics';
import { FiSave } from 'react-icons/fi';
import { TbSelect } from 'react-icons/tb';

const FavoriteGenerateIndicatorsFieldsRDQA = ({ formState, indicatorFieldsForRDQA, setIndicatorFieldsForRDQA }) => {
      const [localFormState, setLocalFormState] = useState({
            visibleAnalyticComponentModal: false,
            currentIndicator: null,
            currentRecoupement: null,
            selectedMetaDatas: []
      });

      const RenderAnalyticComponentModal = () =>
            localFormState?.visibleAnalyticComponentModal ? (
                  <Modal
                        onClose={() =>
                              setLocalFormState({
                                    ...localFormState,
                                    visibleAnalyticComponentModal: false,
                                    currentIndicator: null,
                                    currentRecoupement: null,
                                    selectedMetaDatas: []
                              })
                        }
                        large
                  >
                        <ModalTitle>
                              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    {translate('Source_De_Donnee')}
                              </div>
                        </ModalTitle>
                        <ModalContent>
                              {!localFormState?.currentIndicator && <div>Error no data </div>}
                              {localFormState?.currentIndicator && (
                                    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
                                          <DataDimension
                                                selectedDimensions={localFormState?.selectedMetaDatas?.map(it => ({
                                                      ...it
                                                }))}
                                                onSelect={value => {
                                                      setLocalFormState({
                                                            ...localFormState,
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
                                          onClick={() => {
                                                setIndicatorFieldsForRDQA({
                                                      ...indicatorFieldsForRDQA.map(ind => {
                                                            if (
                                                                  localFormState.currentIndicator &&
                                                                  localFormState.currentRecoupement
                                                            ) {
                                                                  return {
                                                                        ...ind,
                                                                        recoupements: ind?.recoupements?.map(rec => {
                                                                              if (
                                                                                    rec.position ===
                                                                                    localFormState.currentRecoupement
                                                                                          .position
                                                                              ) {
                                                                                    return {
                                                                                          ...rec,
                                                                                          source: localFormState
                                                                                                ?.selectedMetaDatas[0]
                                                                                    };
                                                                              }
                                                                              return rec;
                                                                        })
                                                                  };
                                                            }

                                                            if (
                                                                  localFormState.currentIndicator &&
                                                                  !localFormState.currentRecoupement
                                                            ) {
                                                                  return {
                                                                        ...ind,
                                                                        source: localFormState?.selectedMetaDatas[0]
                                                                  };
                                                            }
                                                            return ind;
                                                      })
                                                });
                                                setLocalFormState({
                                                      ...formState,
                                                      visibleAnalyticComponentModal: false,
                                                      selectedMetaDatas: [],
                                                      currentIndicator: null,
                                                      currentRecoupement: null
                                                });
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
                                                            border: '1px solid #00000070',
                                                            width: '40%'
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
                                                      {translate('Recoupements')}
                                                </th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {indicatorFieldsForRDQA.map((ind, index) => (
                                                <tr>
                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'center',
                                                                  border: '1px solid #00000070',
                                                                  width: '40%'
                                                            }}
                                                      >
                                                            <div style={{ marginBottom: '2px' }}>
                                                                  {`${translate('Indicateurs')} ${index + 1}`}
                                                            </div>

                                                            <Row gutter={[5, 5]}>
                                                                  <Col md={22}>
                                                                        <Input
                                                                              onChange={event =>
                                                                                    setIndicatorFieldsForRDQA([
                                                                                          ...indicatorFieldsForRDQA.map(
                                                                                                i => {
                                                                                                      if (
                                                                                                            i.position ===
                                                                                                            ind.position
                                                                                                      ) {
                                                                                                            return {
                                                                                                                  ...i,
                                                                                                                  source: {
                                                                                                                        displayName:
                                                                                                                              event
                                                                                                                                    .target
                                                                                                                                    .value
                                                                                                                  }
                                                                                                            };
                                                                                                      }
                                                                                                      return i;
                                                                                                }
                                                                                          )
                                                                                    ])
                                                                              }
                                                                              value={ind?.source?.displayName}
                                                                              placeholder={`${translate(
                                                                                    'Indicateurs'
                                                                              )} ${index + 1}`}
                                                                        />
                                                                  </Col>
                                                                  <Col md={2}>
                                                                        <Button
                                                                              primary
                                                                              small
                                                                              onClick={() =>
                                                                                    setLocalFormState({
                                                                                          ...localFormState,
                                                                                          visibleAnalyticComponentModal: true,
                                                                                          currentIndicator: ind
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
                                                            </Row>
                                                      </td>

                                                      <td
                                                            style={{
                                                                  padding: '2px 5px',
                                                                  verticalAlign: 'center',
                                                                  border: '1px solid #00000070'
                                                            }}
                                                      >
                                                            {ind.recoupements?.map((rec, recIndex) => (
                                                                  <div
                                                                        key={recIndex}
                                                                        style={{
                                                                              marginTop: '3px'
                                                                        }}
                                                                  >
                                                                        <div
                                                                              style={{ marginBottom: '2px' }}
                                                                        >{` ${translate('Indicateurs')} ${
                                                                              index + 1
                                                                        }   ${translate('Recoupements')} ${
                                                                              recIndex + 1
                                                                        }`}</div>
                                                                        <Row gutter={[5, 5]}>
                                                                              <Col md={22}>
                                                                                    <Input
                                                                                          disabled={
                                                                                                !ind.source?.displayName
                                                                                          }
                                                                                          value={
                                                                                                rec?.source?.displayName
                                                                                          }
                                                                                          onChange={event => {
                                                                                                setIndicatorFieldsForRDQA(
                                                                                                      [
                                                                                                            ...indicatorFieldsForRDQA?.map(
                                                                                                                  (
                                                                                                                        i,
                                                                                                                        iIndex
                                                                                                                  ) => {
                                                                                                                        if (
                                                                                                                              iIndex ===
                                                                                                                              index
                                                                                                                        ) {
                                                                                                                              return {
                                                                                                                                    ...i,
                                                                                                                                    recoupements:
                                                                                                                                          [
                                                                                                                                                ...i.recoupements?.map(
                                                                                                                                                      (
                                                                                                                                                            r,
                                                                                                                                                            rIndex
                                                                                                                                                      ) => {
                                                                                                                                                            if (
                                                                                                                                                                  rIndex ===
                                                                                                                                                                  recIndex
                                                                                                                                                            ) {
                                                                                                                                                                  return {
                                                                                                                                                                        ...r,
                                                                                                                                                                        source: {
                                                                                                                                                                              displayName:
                                                                                                                                                                                    event
                                                                                                                                                                                          .target
                                                                                                                                                                                          .value
                                                                                                                                                                        }
                                                                                                                                                                  };
                                                                                                                                                            }
                                                                                                                                                            return r;
                                                                                                                                                      }
                                                                                                                                                )
                                                                                                                                          ]
                                                                                                                              };
                                                                                                                        }
                                                                                                                        return i;
                                                                                                                  }
                                                                                                            )
                                                                                                      ]
                                                                                                );
                                                                                          }}
                                                                                          style={{ width: '100%' }}
                                                                                          placeholder={`${translate(
                                                                                                'Recoupements'
                                                                                          )} ${recIndex + 1}`}
                                                                                    />
                                                                              </Col>
                                                                              <Col md={2}>
                                                                                    <Button
                                                                                          disabled={
                                                                                                !indicatorFieldsForRDQA?.[
                                                                                                      index
                                                                                                ]?.source?.displayName
                                                                                          }
                                                                                          primary
                                                                                          small
                                                                                          onClick={() =>
                                                                                                setLocalFormState({
                                                                                                      ...localFormState,
                                                                                                      visibleAnalyticComponentModal: true,
                                                                                                      currentIndicator:
                                                                                                            ind,
                                                                                                      currentRecoupement:
                                                                                                            rec
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
                                                                        </Row>
                                                                  </div>
                                                            ))}
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                  </Card>

                  {RenderAnalyticComponentModal()}

                  <pre>{JSON.stringify(indicatorFieldsForRDQA, null, 4)}</pre>
            </>
      );
};

export default FavoriteGenerateIndicatorsFieldsRDQA;
