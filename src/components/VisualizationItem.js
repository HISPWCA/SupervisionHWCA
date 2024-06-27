import { CircularLoader } from '@dhis2/ui';
import { Col } from 'antd';

const VisualizationItem = ({ id, loading }) => (
      <Col sm={24} md={8}>
            <div
                  className="my-shadow"
                  style={{
                        backgroundColor: '#fff',
                        padding: '10px',
                        borderRadius: '8px',
                        minHeight: '450px',
                        maxHeight: '450px',
                        overflow: 'hidden'
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
            </div>
      </Col>
);

export default VisualizationItem;
