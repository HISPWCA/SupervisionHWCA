import { CircularLoader } from '@dhis2/ui';
import { Col } from 'antd';

const VisualizationItem = ({ id, loading, dxElements }) => (
      <Col sm={24} md={8}>
            <div
                  className="my-shadow"
                  style={{
                        backgroundColor: '#fff',
                        padding: '10px',
                        borderRadius: '8px',
                        minHeight: '500px',
                        maxHeight: '500px',
                        overflowY: 'scroll'
                  }}
            >
                  {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <CircularLoader />
                              <div style={{ marginLeft: '20px' }}>Loading...</div>
                        </div>
                  ) : (
                        <div id={id}></div>
                  )}
                  {dxElements?.length > 0 && (
                        <div
                              style={{
                                    width: '100%',
                                    border: '1px solid skyblue',
                                    padding: '5px',
                                    alignItems: 'center',
                                    fontSize: '13px'
                              }}
                        >
                              {dxElements.map(dx => (
                                    <div
                                          style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginTop: '5px',
                                                justifyContent: 'center'
                                          }}
                                    >
                                          <div style={{ color: '#00000090' }}>{dx.oldName}</div>
                                          <div style={{ margin: '0px 10px' }}> {`<===>`}</div>
                                          <div style={{ fontWeight: 'bold' }}>{dx.newName} </div>
                                    </div>
                              ))}
                        </div>
                  )}
            </div>
      </Col>
);

export default VisualizationItem;
