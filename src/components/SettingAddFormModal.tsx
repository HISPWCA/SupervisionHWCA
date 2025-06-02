import { useEffect, useState } from 'react';
import { Button, Modal, ModalActions, ModalContent, ModalTitle, Radio } from '@dhis2/ui';
import translate from '../utils/translator';

import { FiSave } from 'react-icons/fi';
import { Input, Popconfirm, Select } from 'antd';
import { IoMdAddCircle } from 'react-icons/io';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { MdSystemUpdateAlt } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import { loadDataStore, saveDataToDataStore } from '../utils/functions';
import { useAlert } from '@dhis2/app-runtime';
import { v4 as uuid } from 'uuid';
import useGetGroups from '../hooks/useGetGroups';

const SettingAddFormModal = ({
    currentSelectedGroup,
    setCurrentSelectedGroup,
    setOpen,
    dataStoreElements,
    elementName,
    dataStoreKey,
    refreshElements
}) => {
    const [type, setType] = useState('SELECT');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [newElementsList, setNewElementsList] = useState([]);
    const [inputName, setInputName] = useState('');
    const [currentItem, setCurrentItem] = useState(null);
    const { show } = useAlert(
        ({ message }) => message,
        ({ type }) => ({
            success: type === 'success' ? true : false,
            critical: type === 'error' ? true : false,
            duration: 3000
        })
    );
    const [loadingSave, setLoadingSave] = useState(false);

    const { groups, loading: loadingGroups } = useGetGroups();

    const handleSelectGroup = value => {
        if (value) {
            const found_group = groups.find(g => g.name === value);

            if (found_group) {
                setSelectedGroup(value);
                setNewElementsList(dataStoreElements?.find(i => i.name === value)?.children || []);
                setInputName('');
                setCurrentItem('');
            }
        }
    };

    const cleanAllState = () => {
        setType('SELECT');
        setSelectedGroup(null);
        setNewElementsList([]);
        setInputName('');
        setCurrentItem(null);
    };

    const handleCloseModal = () => {
        cleanAllState();
        setOpen(false);
        setCurrentSelectedGroup(null);
    };

    const handleDeleteElement = id => {
        if (!id) return console.log("Error: can't delete element. Id is null");

        if (id) {
            setNewElementsList(newElementsList.filter(i => id !== i.id));
            setCurrentItem(null);
        }
    };

    const handleSaveInfos = async () => {
        try {
            setLoadingSave(true);
            const lastDataStoreList = (await loadDataStore(dataStoreKey, null, null, [])) || [];

            let payloads = lastDataStoreList;

            if (lastDataStoreList?.map(i => i.name)?.includes(selectedGroup?.trim())) {
                payloads = lastDataStoreList.map(i => {
                    if (i.name === selectedGroup) {
                        return {
                            ...i,
                            children: newElementsList || []
                        };
                    }
                    return i;
                });
            } else {
                payloads = [
                    ...lastDataStoreList,
                    {
                        name: selectedGroup?.trim(),
                        children: newElementsList || []
                    }
                ];
            }

            await saveDataToDataStore(dataStoreKey, payloads);
            refreshElements();
            show({
                type: 'success',
                message: translate('Operation_Success')
            });

            cleanAllState();
            setLoadingSave(false);
            handleCloseModal();
        } catch (err) {
            show({
                type: 'error',
                message: err.response?.data?.message || err.message
            });
            setLoadingSave(false);
        }
    };

    const handleAddElement = () => {
        let payload = {};

        if (currentItem) {
            payload = {
                ...currentItem,
                name_fr: inputName?.trim(),
                name: inputName?.trim()
            };
        } else {
            payload = {
                id: uuid(),
                name_fr: inputName?.trim(),
                name: inputName?.trim()
            };
        }

        if (currentItem) {
            setNewElementsList(
                newElementsList.map(i =>
                    i.id === currentItem.id
                        ? {
                              ...i,
                              ...payload
                          }
                        : i
                )
            );
        } else {
            setNewElementsList([...newElementsList, payload]);
        }

        setCurrentItem(null);
        setInputName('');
    };
   // const handleDeleteEverything = async () => {
    //     try {
    //         setLoadingDelete(true);

    //         const lastDataStoreList = (await loadDataStore(dataStoreKey, null, null, [])) || [];
    //         let payloads =
    //             lastDataStoreList?.filter(i => i.name !== currentSelectedGroup?.name) || [];

    //         await saveDataToDataStore(dataStoreKey, payloads);
    //         show({
    //             type: 'success',
    //             message: translate('Operation_Success')
    //         });

    //         setCurrentSelectedGroup(null);
    //         cleanAllState();
    //         refreshElements();
    //         handleCloseModal();
    //         setLoadingDelete(false);
    //     } catch (err) {
    //         setLoadingDelete(false);
    //         show({
    //             type: 'error',
    //             message: err.response?.data?.message || err.message
    //         });
    //     }
    // };
 

    useEffect(() => {
        if (currentSelectedGroup) {
            setSelectedGroup(currentSelectedGroup?.name);
            setNewElementsList(currentSelectedGroup?.children || []);
            setType('SELECT');
        }
    }, [currentSelectedGroup]);

    return (
        <>
            <Modal onClose={handleCloseModal}>
                <ModalTitle>
                    <div
                        style={{
                            fontWeight: 'bold',
                            fontSize: '16px'
                        }}
                    >
                        {translate('Create_And_Modification')}
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
                        <div
                            style={{
                                marginTop: '20px'
                            }}
                        >
                            {type === 'SELECT' && (
                                <div>
                                    <div>{translate('Group')}</div>
                                    <div
                                        style={{
                                            marginTop: '5px'
                                        }}
                                    >
                                        <Select
                                            options={groups?.map(i => ({
                                                label: i.name,
                                                value: i.name
                                            }))}
                                            placeholder={translate('Group')}
                                            onChange={handleSelectGroup}
                                            value={selectedGroup}
                                            style={{
                                                width: '100%'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {(selectedGroup ) && (
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'end'
                                }}
                            >
                                <div
                                    style={{
                                        marginTop: '10px',
                                        width: '50%'
                                    }}
                                >
                                    <div>{translate(elementName)}</div>
                                    <div
                                        style={{
                                            marginTop: '5px'
                                        }}
                                    >
                                        <Input
                                            placeholder={translate('Name')}
                                            value={inputName}
                                            onChange={e => setInputName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Button
                                        small
                                        primary
                                        disabled={
                                            currentItem
                                                ? false
                                                : inputName &&
                                                  !newElementsList
                                                      ?.map(i => i.name?.trim()?.toLowerCase())
                                                      ?.includes(inputName?.trim()?.toLowerCase())
                                                ? false
                                                : true
                                        }
                                        onClick={handleAddElement}
                                        icon={
                                            currentItem ? (
                                                <MdSystemUpdateAlt
                                                    style={{
                                                        fontSize: '18px',
                                                        color: 'white'
                                                    }}
                                                />
                                            ) : (
                                                <IoMdAddCircle
                                                    style={{
                                                        fontSize: '18px',
                                                        color: 'white'
                                                    }}
                                                />
                                            )
                                        }
                                    >
                                        {currentItem ? translate('Update') : translate('Ajouter')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    {selectedGroup ? (
                        <>
                            <div
                                style={{
                                    fontWeight: 'bold',
                                    marginTop: '20px'
                                }}
                            >
                                {translate(elementName)}
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
                                    <tr
                                        style={{
                                            background: '#C3E9E2'
                                        }}
                                    >
                                        <th
                                            style={{
                                                padding: '5px',
                                                border: '1px solid #00000060',
                                                width: '30%',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {translate('Group')}
                                        </th>
                                        <th
                                            style={{
                                                padding: '5px',
                                                border: '1px solid #00000060'
                                            }}
                                        >
                                            {translate(elementName)}
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
                                           {selectedGroup}
                                        </td>
                                        <td
                                            style={{
                                                border: '1px solid #00000060'
                                            }}
                                        >
                                            <div>
                                                {newElementsList?.map((ind, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            padding: '5px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            borderTop: '1px solid #00000060'
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                color: '#000000'
                                                            }}
                                                        >
                                                            {`${ind.name}`}
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '5px'
                                                            }}
                                                        >
                                                            <FaRegEdit
                                                                title={translate('Edit')}
                                                                style={{
                                                                    fontSize: '22px',
                                                                    color: 'blue',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => {
                                                                    setCurrentItem(ind);
                                                                    setInputName(ind.name);
                                                                }}
                                                            />
                                                            <Popconfirm
                                                                title={translate('Delete')}
                                                                description={translate(
                                                                    'Remove_Element_From_List'
                                                                )}
                                                                onConfirm={() =>
                                                                    handleDeleteElement(ind.id)
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
                            {/* {dataStoreElements?.map(i => i.name)?.includes(selectedGroup) && (
                                <div>
                                    <Button
                                        destructive
                                        loading={loadingDelete}
                                        onClick={handleDeleteEverything}
                                    >
                                        {translate('Remove_All')}
                                    </Button>
                                </div>
                            )} */}
                            <Button
                                primary
                                onClick={handleSaveInfos}
                                icon={
                                    <FiSave
                                        style={{
                                            fontSize: '18px'
                                        }}
                                    />
                                }
                                loading={loadingSave}
                            >
                                {translate('Enregistrer')}
                            </Button>
                        </div>
                    </div>
                </ModalActions>
            </Modal>
        </>
    );
};

export default SettingAddFormModal;
