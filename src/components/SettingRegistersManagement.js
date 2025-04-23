import { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import { loadDataStore } from '../utils/functions';
import { useAlert } from '@dhis2/app-runtime';
import Loading from './Loading';
import { Button } from '@dhis2/ui';
import SettingAddFormModal from './SettingAddFormModal';
import translate, { translateDataStoreLabel } from '../utils/translator';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { FaRegEdit } from 'react-icons/fa';
import { FiSave } from 'react-icons/fi';

const SettingRegistersManagement = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataStoreRegisters, setDataStoreRegisters] = useState([]);
    const [loadingProcess, setLoadingProcess] = useState(false);
    const [loadingRegisters, setLoadingRegisters] = useState(false);

    const { show } = useAlert(
        ({ message }) => message,
        ({ type }) => ({
            success: type === 'success' ? true : false,
            critical: type === 'error' ? true : false,
            duration: 3000
        })
    );

    const initFields = () => {};

    const handleSave = async () => {
        try {
            // setLoadingProcess(true);
            // const newList = formState?.indicators;
            // await saveDataToDataStore(process.env.REACT_APP_INDICATORS_MAPPING_KEY, newList, null, null, null);
            // setNotification({
            //     show: true,
            //     message: translate('Operation_Success'),
            //     type: NOTIFICATION_SUCCESS
            // });
            // setLoadingProcess(false);
        } catch (err) {
            // setNotification({
            //     show: true,
            //     message: err.response?.data?.message || err.message,
            //     type: NOTIFICATION_CRITICAL
            // });
            // setLoadingProcess(false);
        }
    };

    const loadingDataStoreRegisters = async () => {
        try {
            setLoadingRegisters(true);
            const response = await loadDataStore(process.env.REACT_APP_REGISTRES_KEY, null, null, []);
            setDataStoreRegisters(response);
            setLoadingRegisters(false);
        } catch (err) {
            setLoadingRegisters(false);
        }
    };

    useEffect(() => {
        initFields();
    }, [dataStoreRegisters]);

    useEffect(() => {
        loadingDataStoreRegisters();
    }, []);

    return (
        <>
            <Card className="my-shadow" size="small" style={{ minWidth: '100%' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div style={{ fontWeight: 'bold' }}>{translate('Registers_Management')}</div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <Button
                            primary
                            onClick={() => null}
                            loading={false}
                            icon={
                                <IoMdAddCircleOutline
                                    style={{
                                        fontSize: '18px'
                                    }}
                                />
                            }
                        >
                            {translate('Add')}
                        </Button>
                        <Button
                            primary
                            onClick={handleSave}
                            loading={loadingProcess}
                            icon={
                                <FiSave
                                    style={{
                                        fontSize: '18px'
                                    }}
                                />
                            }
                        >
                            {translate('Save_Configs')}
                        </Button>
                    </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                    {loadingRegisters ? (
                        <Loading />
                    ) : (
                        <table
                            style={{
                                borderCollapse: 'collapse',
                                width: '100%',
                                overflowX: 'auto'
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        background: '#ccc'
                                    }}
                                >
                                    <th
                                        style={{
                                            padding: '2px 5px',
                                            verticalAlign: 'center',
                                            textAlign: 'center',
                                            border: '1px solid #00000070',
                                            width: '8%'
                                        }}
                                    >
                                        {translate('Group')}
                                    </th>
                                    <th
                                        style={{
                                            padding: '2px 5px',
                                            verticalAlign: 'center',
                                            textAlign: 'center',
                                            border: '1px solid #00000070',
                                            width: '90%'
                                        }}
                                    >
                                        {translate('Elements')}
                                    </th>
                                    <th
                                        style={{
                                            padding: '2px 5px',
                                            verticalAlign: 'center',
                                            textAlign: 'center',
                                            border: '1px solid #00000070'
                                        }}
                                    >
                                        #
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataStoreRegisters?.map(group => (
                                    <tr key={group.name}>
                                        <td
                                            style={{
                                                padding: '2px 5px',
                                                verticalAlign: 'center',
                                                textAlign: 'center',
                                                border: '1px solid #00000070',
                                                width: '10%'
                                            }}
                                        >
                                            {group.name}
                                        </td>
                                        <td
                                            style={{
                                                padding: '2px 5px',
                                                verticalAlign: 'center',
                                                textAlign: 'left',
                                                border: '1px solid #00000070',
                                                width: '90%'
                                            }}
                                        >
                                            {group.children?.map(element => (
                                                <div
                                                    key={element.id}
                                                    style={{
                                                        marginTop: '5px',
                                                        borderBottom: '1px solid #ccc',
                                                        paddingBottom: '5px'
                                                    }}
                                                >
                                                    <Row gutter={[5, 5]}>
                                                        <Col md={4}>
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '1px'
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        fontWeight: 'normal',
                                                                        textDecoration: 'none'
                                                                    }}
                                                                >
                                                                    {translateDataStoreLabel(element)}
                                                                </span>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            ))}
                                        </td>
                                        <td
                                            style={{
                                                padding: '10px',
                                                verticalAlign: 'center',
                                                textAlign: 'center',
                                                border: '1px solid #00000070'
                                            }}
                                        >
                                            <FaRegEdit
                                                title={translate('Edit_Indicator')}
                                                style={{
                                                    fontSize: '22px',
                                                    color: 'blue',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    setOpenModal(true);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            <SettingAddFormModal dataStoreElements={dataStoreRegisters} elementName={translate('Register')} setOpen={setOpenModal} open={openModal} dataStoreKey={process.env.REACT_APP_REGISTRES_KEY} />
        </>
    );
};

export default SettingRegistersManagement;
