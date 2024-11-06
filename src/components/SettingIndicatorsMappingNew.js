import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle, Radio } from '@dhis2/ui';
import translate from '../utils/translator';

import { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { Input, Select } from 'antd';
import { IoMdAddCircle } from 'react-icons/io';

const SettingIndicatorsMappingNew = ({ open, setOpen, loadDataStoreIndicators, dataStoreIndicators }) => {
      const [newIndicatorList, setNewIndicatorList] = useState([]);
      const [selectedIndicatorType, setSelectedIndicatorType] = useState('');
      const [inputIndicatorType, setInputIndicatorType] = useState('');
      const [inputIndicator, setInputIndicator] = useState('');
      const [type, setType] = useState('NEW');

      const cleanAllState = () => {
            setSelectedIndicatorType('');
            setType('NEW');
            setNewIndicatorList([]);
            setOpen(false);
      };

      const handleCloseModal = () => {
            cleanAllState();
      };

      const handleSave = () => {};

      const handleSelectIndicatortype = value => {
            console.log('v: ', value);
            if (value) {
                  const found_indicator_type = dataStoreIndicators?.find(i => i.name === value);

                  if (found_indicator_type) {
                        setSelectedIndicatorType(value);
                        setNewIndicatorList(found_indicator_type.children || []);
                        setInputIndicator('');
                        setInputIndicatorType('');
                  }
            }
      };

      const handleInputIndicatorType = e => {
            console.log('namem: ', e.target.value);
            setInputIndicatorType(e.target.value);
            setSelectedIndicatorType('');
      };

      const handleSelectType = ({ value }) => {
            setType(value);
            setNewIndicatorList([]);
            setInputIndicatorType('');
            setInputIndicator('');
            setSelectedIndicatorType('');
      };

      const handleAddIndicator = () => {
            if (
                  inputIndicator &&
                  !newIndicatorList
                        .map(i => i.name?.trim()?.toLowerCase())
                        .includes(inputIndicator?.trim()?.toLowerCase())
            ) {
                  setNewIndicatorList([...newIndicatorList, { name: inputIndicator?.trim() }]);
                  setInputIndicator('');
            }
      };

      return (
            <>
                  {open && (
                        <Modal onClose={handleCloseModal}>
                              <ModalTitle>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                          {translate('New_Indicator')}
                                    </div>
                              </ModalTitle>
                              <ModalContent>
                                    <div
                                          style={{
                                                padding: '10px',
                                                border: '1px solid #00000060',
                                                borderRadius: '10px'
                                          }}
                                    >
                                          <div>
                                                <div>
                                                      <Radio
                                                            label={translate('Select_Indicator_Type')}
                                                            className="cursor-pointer"
                                                            onChange={handleSelectType}
                                                            value="SELECT"
                                                            checked={type === 'SELECT' ? true : false}
                                                      />
                                                </div>
                                                <div>
                                                      <Radio
                                                            label={translate('Create_New_Indicator_Type')}
                                                            className="cursor-pointer"
                                                            onChange={handleSelectType}
                                                            value="NEW"
                                                            checked={type === 'NEW' ? true : false}
                                                      />
                                                </div>
                                          </div>

                                          <div style={{ marginTop: '20px' }}>
                                                {type === 'SELECT' && (
                                                      <div>
                                                            <div>{translate('Indicator_Group')}</div>
                                                            <div style={{ marginTop: '5px' }}>
                                                                  <Select
                                                                        options={dataStoreIndicators.map(i => ({
                                                                              label: i.name,
                                                                              value: i.name
                                                                        }))}
                                                                        placeholder={translate('Indicator_Group')}
                                                                        onChange={handleSelectIndicatortype}
                                                                        value={selectedIndicatorType}
                                                                        style={{ width: '100%' }}
                                                                  />
                                                            </div>
                                                      </div>
                                                )}
                                                {type === 'NEW' && (
                                                      <div>
                                                            <div>{translate('Indicator_Group')}</div>
                                                            <div style={{ marginTop: '5px' }}>
                                                                  <Input
                                                                        placeholder={translate('Name')}
                                                                        value={inputIndicatorType}
                                                                        onChange={handleInputIndicatorType}
                                                                  />
                                                            </div>
                                                      </div>
                                                )}
                                          </div>

                                          {(selectedIndicatorType || inputIndicatorType) && (
                                                <div style={{ display: 'flex', gap: '5px', alignItems: 'end' }}>
                                                      <div style={{ marginTop: '10px', width: '100%' }}>
                                                            <div>
                                                                  <div>{translate('Indicateur')}</div>
                                                                  <div style={{ marginTop: '5px' }}>
                                                                        <Input
                                                                              placeholder={translate('Name')}
                                                                              value={inputIndicator}
                                                                              onChange={e =>
                                                                                    setInputIndicator(e.target.value)
                                                                              }
                                                                        />
                                                                  </div>
                                                            </div>
                                                      </div>
                                                      <div>
                                                            <Button
                                                                  primary
                                                                  disabled={
                                                                        inputIndicator &&
                                                                        !newIndicatorList
                                                                              .map(i => i.name?.trim()?.toLowerCase())
                                                                              .includes(
                                                                                    inputIndicator
                                                                                          ?.trim()
                                                                                          ?.toLowerCase()
                                                                              )
                                                                              ? false
                                                                              : true
                                                                  }
                                                                  onClick={handleAddIndicator}
                                                                  icon={
                                                                        <IoMdAddCircle
                                                                              style={{
                                                                                    fontSize: '18px',
                                                                                    color: 'white'
                                                                              }}
                                                                        />
                                                                  }
                                                            ></Button>
                                                      </div>
                                                </div>
                                          )}
                                    </div>
                                    {selectedIndicatorType || inputIndicatorType ? (
                                          <>
                                                <div style={{ fontWeight: 'bold', marginTop: '20px' }}>
                                                      {translate('Indicateurs')}
                                                </div>
                                                <table
                                                      style={{
                                                            width: '100%',
                                                            borderCollapse: 'collapse',
                                                            marginTop: '10px',
                                                            fontSize: '14px'
                                                      }}
                                                >
                                                      <thead>
                                                            <tr style={{ background: '#C3E9E2' }}>
                                                                  <th
                                                                        style={{
                                                                              padding: '5px',
                                                                              border: '1px solid #00000060',
                                                                              width: '30%',
                                                                              textAlign: 'center'
                                                                        }}
                                                                  >
                                                                        {translate('Indicator_Group')}
                                                                  </th>
                                                                  <th
                                                                        style={{
                                                                              padding: '5px',
                                                                              border: '1px solid #00000060'
                                                                        }}
                                                                  >
                                                                        {translate('Indicateurs')}
                                                                  </th>
                                                            </tr>
                                                      </thead>
                                                      <tbody>
                                                            <tr>
                                                                  <td
                                                                        style={{
                                                                              padding: '5px',
                                                                              border: '1px solid #00000060',
                                                                              textAlign: 'center'
                                                                        }}
                                                                  >
                                                                        {type === 'SELECT'
                                                                              ? selectedIndicatorType
                                                                              : inputIndicatorType}
                                                                  </td>
                                                                  <td style={{ border: '1px solid #00000060' }}>
                                                                        <div>
                                                                              {newIndicatorList?.map((ind, index) => (
                                                                                    <div
                                                                                          key={index}
                                                                                          style={{
                                                                                                padding: '5px',
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                justifyContent:
                                                                                                      'space-between',
                                                                                                borderTop:
                                                                                                      '1px solid #00000060'
                                                                                          }}
                                                                                    >
                                                                                          <div> {ind.name}</div>
                                                                                          <div> delete</div>
                                                                                    </div>
                                                                              ))}
                                                                        </div>
                                                                  </td>
                                                            </tr>
                                                      </tbody>
                                                </table>
                                          </>
                                    ) : (
                                          <></>
                                    )}
                              </ModalContent>
                              <ModalActions>
                                    <ButtonStrip end>
                                          <Button destruction onClick={handleCloseModal}>
                                                {translate('Annuler')}
                                          </Button>
                                          <Button
                                                primary
                                                onClick={handleSave}
                                                icon={<FiSave style={{ fontSize: '18px' }} />}
                                          >
                                                {translate('Enregistrer')}
                                          </Button>
                                    </ButtonStrip>
                              </ModalActions>
                        </Modal>
                  )}
            </>
      );
};

export default SettingIndicatorsMappingNew;
