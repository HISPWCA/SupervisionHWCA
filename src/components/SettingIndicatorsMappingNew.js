import { Button, Modal, ModalActions, ModalContent, ModalTitle, Radio } from '@dhis2/ui';
import translate from '../utils/translator';
import { v4 as uuid } from 'uuid';

import { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import { Input, Popconfirm, Select } from 'antd';
import { IoMdAddCircle } from 'react-icons/io';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { saveDataToDataStore } from '../utils/functions';
import { NOTIFICATION_CRITICAL, NOTIFICATION_SUCCESS } from '../utils/constants';

const SettingIndicatorsMappingNew = ({
      open,
      setOpen,
      loadDataStoreIndicators,
      loadDataStoreIndicatorsMapping,
      setNotification,
      dataStoreIndicators,
      currentDataStoreMapping,
      setCurrentDataStoreMapping
}) => {
      const [newIndicatorList, setNewIndicatorList] = useState([]);
      const [selectedIndicatorType, setSelectedIndicatorType] = useState('');
      const [inputIndicatorType, setInputIndicatorType] = useState('');
      const [inputIndicator, setInputIndicator] = useState('');
      const [inputIndicatorFr, setInputIndicatorFr] = useState('');
      const [type, setType] = useState('NEW');
      const [loadingSave, setLoadingSave] = useState(false);
      const [loadingDelete, setLoadingDelete] = useState(false);

      const cleanAllState = () => {
            setSelectedIndicatorType('');
            setType('NEW');
            setInputIndicator('');
            setInputIndicatorFr('');
            setInputIndicatorType('');
            setNewIndicatorList([]);
            setOpen(false);
      };

      const handleCloseModal = () => {
            cleanAllState();
      };

      const handleSave = async () => {
            try {
                  setLoadingSave(true);
                  let payloads = dataStoreIndicators;
                  if (type === 'SELECT') {
                        payloads = dataStoreIndicators.map(i => {
                              if (i.name === selectedIndicatorType) {
                                    return { ...i, children: newIndicatorList || [] };
                              }
                              return i;
                        });
                  }

                  if (type === 'NEW') {
                        payloads = [
                              ...dataStoreIndicators,
                              { name: inputIndicatorType?.trim(), children: newIndicatorList || [] }
                        ];
                  }
                  await saveDataToDataStore(process.env.REACT_APP_INDICATORS_KEY, payloads);
                  setNotification({
                        show: true,
                        message: translate('Operation_Success'),
                        type: NOTIFICATION_SUCCESS
                  });
                  setCurrentDataStoreMapping(null);
                  loadDataStoreIndicators();
                  loadDataStoreIndicatorsMapping();
                  cleanAllState();
                  setLoadingSave(false);
            } catch (err) {
                  setLoadingSave(false);
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const handleSelectIndicatortype = value => {
            if (value) {
                  const found_indicator_type = dataStoreIndicators?.find(i => i.name === value);

                  if (found_indicator_type) {
                        setSelectedIndicatorType(value);
                        setNewIndicatorList(found_indicator_type.children || []);
                        setInputIndicator('');
                        setInputIndicatorFr('');
                        setInputIndicatorType('');
                  }
            }
      };

      const handleInputIndicatorType = e => {
            setInputIndicatorType(e.target.value);
            setSelectedIndicatorType('');
      };

      const handleSelectType = ({ value }) => {
            setType(value);
            setNewIndicatorList([]);
            setInputIndicatorType('');
            setInputIndicatorFr('');
            setInputIndicator('');
            setSelectedIndicatorType('');
      };

      const handleAddIndicator = () => {
            if (
                  inputIndicator &&
                  inputIndicatorFr &&
                  !newIndicatorList
                        .map(i => i.name?.trim()?.toLowerCase())
                        .includes(inputIndicator?.trim()?.toLowerCase()) &&
                  !newIndicatorList
                        .map(i => i.name?.trim()?.toLowerCase())
                        .includes(inputIndicatorFr?.trim()?.toLowerCase())
            ) {
                  setNewIndicatorList([
                        ...newIndicatorList,
                        { id: uuid(), name_fr: inputIndicatorFr?.trim(), name: inputIndicator?.trim() }
                  ]);
                  setInputIndicator('');
                  setInputIndicatorFr('');
            }
      };

      const handleDeleteEverything = async () => {
            try {
                  setLoadingDelete(true);
                  let payloads = dataStoreIndicators?.filter(i => i.name !== currentDataStoreMapping?.name) || [];

                  await saveDataToDataStore(process.env.REACT_APP_INDICATORS_KEY, payloads);
                  setNotification({
                        show: true,
                        message: translate('Operation_Success'),
                        type: NOTIFICATION_SUCCESS
                  });
                  setCurrentDataStoreMapping(null);
                  loadDataStoreIndicators();
                  loadDataStoreIndicatorsMapping();
                  cleanAllState();
                  setLoadingDelete(false);
            } catch (err) {
                  setLoadingDelete(false);
                  setNotification({
                        show: true,
                        message: err.response?.data?.message || err.message,
                        type: NOTIFICATION_CRITICAL
                  });
            }
      };

      const handleDeleteIndicator = id => {
            if (!id)
                  return console.log(
                        "L'id de l'indicateur est null. ça veut dire que le format est incorrect. Veuillez metre à jour le format puis rééssayer."
                  );

            if (id) {
                  setNewIndicatorList(newIndicatorList.filter(i => id !== i.id));
            }
      };

      useEffect(() => {
            if (currentDataStoreMapping) {
                  setSelectedIndicatorType(currentDataStoreMapping?.name);
                  setNewIndicatorList(currentDataStoreMapping?.children || []);
                  setType('SELECT');
            }
      }, [currentDataStoreMapping]);

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
                                                      <div style={{ marginTop: '10px', width: '50%' }}>
                                                            <div>{translate('Indicateur')} ( English )</div>
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
                                                      <div style={{ marginTop: '10px', width: '50%' }}>
                                                            <div>{translate('Indicateur')} ( Français )</div>
                                                            <div style={{ marginTop: '5px' }}>
                                                                  <Input
                                                                        placeholder={translate('Name')}
                                                                        value={inputIndicatorFr}
                                                                        onChange={e =>
                                                                              setInputIndicatorFr(e.target.value)
                                                                        }
                                                                  />
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
                                                                                          <div>
                                                                                                <Popconfirm
                                                                                                      title={translate(
                                                                                                            'Delete'
                                                                                                      )}
                                                                                                      description={translate(
                                                                                                            'Remove_Indicator_From_List'
                                                                                                      )}
                                                                                                      onConfirm={() =>
                                                                                                            handleDeleteIndicator(
                                                                                                                  ind.id
                                                                                                            )
                                                                                                      }
                                                                                                >
                                                                                                      <RiDeleteBin6Line
                                                                                                            style={{
                                                                                                                  color: 'red',
                                                                                                                  fontSize: '18px',
                                                                                                                  cursor: 'pointer'
                                                                                                            }}
                                                                                                      />
                                                                                                </Popconfirm>
                                                                                          </div>
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
                              <ModalActions className="w-100">
                                    <div
                                          style={{
                                                justifyContent: 'space-between',
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '100%',
                                                gap: '20px'
                                          }}
                                          className="w-100"
                                    >
                                          <Button onClick={handleCloseModal}>{translate('Annuler')}</Button>
                                          <div
                                                style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      gap: '5px'
                                                }}
                                          >
                                                {dataStoreIndicators
                                                      ?.map(i => i.name)
                                                      ?.includes(selectedIndicatorType) && (
                                                      <div>
                                                            <Button
                                                                  destructive
                                                                  onClick={() => handleDeleteEverything()}
                                                            >
                                                                  {translate('Remove_All')}
                                                            </Button>
                                                      </div>
                                                )}
                                                <Button
                                                      primary
                                                      onClick={handleSave}
                                                      icon={<FiSave style={{ fontSize: '18px' }} />}
                                                      loading={loadingSave}
                                                >
                                                      {translate('Enregistrer')}
                                                </Button>
                                          </div>
                                    </div>
                              </ModalActions>
                        </Modal>
                  )}
            </>
      );
};

export default SettingIndicatorsMappingNew;
