import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle, CircularLoader } from '@dhis2/ui';
import translate from '../utils/translator';
import { Checkbox, Input, Table } from 'antd';
import { MAPS_ROUTE, VISUALIZATIONS_ROUTE } from '../utils/api.routes';
import { FiSave } from 'react-icons/fi';
import axios from 'axios';

const VisualizationOrMapsModal = ({
      open,
      setOpen,
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
                        setLoading(true);
                        await new Promise(() => {
                              const tmpTimeoutID = setTimeout(async () => {
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
                              }, 500);

                              setTimoutID(tmpTimeoutID);
                        });
                  }
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

      const handleClose = () => {
            setOpen(false);
            setInputSearchVis('');
            setVisElementList([]);
            setTimoutID(null);
      };

      return open ? (
            <Modal onClose={handleClose}>
                  <ModalTitle>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                              {visType === 'VISUALIZATION'
                                    ? translate('SelectVisualizations')
                                    : translate('SelectMaps')}
                        </div>
                  </ModalTitle>
                  <ModalContent>
                        <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '0.9' }}>
                                          <Input
                                                style={{ width: '100%' }}
                                                value={inputSearchVis}
                                                onChange={handleOnSearch}
                                          />
                                    </div>
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
                                    <Table bordered columns={columns} size="small" dataSource={visElementList} />
                              </div>
                        </div>
                  </ModalContent>
                  <ModalActions>
                        <ButtonStrip end>
                              <Button primary onClick={handleClose} icon={<FiSave style={{ fontSize: '18px' }} />}>
                                    {translate('Close')}
                              </Button>
                        </ButtonStrip>
                  </ModalActions>
            </Modal>
      ) : (
            <></>
      );
};

export default VisualizationOrMapsModal;
