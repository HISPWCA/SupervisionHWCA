import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle, CircularLoader } from '@dhis2/ui';
import translate from '../utils/translator';
import { Checkbox, Input, Table } from 'antd';
import { MAPS_ROUTE, VISUALIZATIONS_ROUTE } from '../utils/api.routes';
import { FiSave } from 'react-icons/fi';
import axios from 'axios';

const VisualizationOrMaps = ({
    
      visType,
      inputSearchVis,
      setInputSearchVis,
      timoutID,
      setTimoutID,
      visElementList,
      setVisElementList,
      loading,
      setLoading,
      handleChecked,
      favorisItems
}) => {
      const onSearch = async value => {
            try {
                  if (timoutID) {
                        clearTimeout(timoutID);
                  }

                  if (value) {
                        await new Promise(() => {
                              const tmpTimeoutID = setTimeout(async () => {
                                    setLoading(true);
                                    let elements = [];

                                    if (visType === 'VISUALIZATION') {
                                          const visualizations = await axios.get(
                                                `${VISUALIZATIONS_ROUTE}.json?fields=id,name,displayName,type&filter=displayName:ilike:${value}`
                                          );

                                          elements = visualizations?.data?.visualizations || [];
                                    }

                                    if (visType === 'MAP') {
                                          const maps = await axios.get(
                                                `${MAPS_ROUTE}.json?fields=id,name,displayName,type&filter=displayName:ilike:${value}`
                                          );

                                          elements = maps?.data?.maps || [];
                                    }

                                    setVisElementList(elements);
                                    setLoading(false);
                              }, 800);
                              
                              setTimoutID(tmpTimeoutID);
                        });
                  }
                  setLoading(false);
            } catch (err) {
                  setLoading(false);
            }
      };

      const handleOnSearch = e => {
            const value = e?.target?.value;
            setInputSearchVis(value);
            onSearch(value);
      };

      const columns = [
            {
                  title: '#',
                  render: value => (
                        <>
                              <Checkbox
                                    checked={favorisItems?.map(f => f.id)?.includes(value.id)}
                                    onChange={e => handleChecked(value, e.target.checked)}
                              />
                        </>
                  )
            },
            {
                  title: translate('Nom'),
                  dataIndex: 'name'
            },
            {
                  title: translate('Type'),
                  dataIndex: 'type'
            }
      ];

      return (
            <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '0.9' }}>
                              <Input
                                    style={{ width: '100%' }}
                                    placeholder={translate('Recherche')}
                                    value={inputSearchVis}
                                    onChange={handleOnSearch}
                              />
                        </div>
                        <div style={{ flex: '0.1' }}>
                              <Button
                                    small
                                    loading={loading}
                                    disabled={!inputSearchVis || loading}
                                    primary
                                    onClick={() => onSearch(inputSearchVis)}
                              >
                                    {translate('Recherche')}
                              </Button>
                        </div>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                        {loading && (
                              <div
                                    style={{
                                          display: 'flex',
                                          gap: '10px'
                                    }}
                              >
                                    <CircularLoader small />
                                    <div>{translate('Chargement')}...</div>
                              </div>
                        )}
                        <Table
                              pagination={{ pageSize: 5 }}
                              bordered
                              columns={columns}
                              size="small"
                              dataSource={visElementList}
                        />
                  </div>
            </div>
      );
};

export default VisualizationOrMaps;
