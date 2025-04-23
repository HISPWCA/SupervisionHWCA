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

const SettingDataElementCompletenessManagement = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataStoreElements, setDataStoreElements] = useState([]);
    const [loadingProcess, setLoadingProcess] = useState(false);
    const [currentSelectedGroup, setCurrentSelectedGroup] = useState(null);
    const [loadingElements, setLoadingElements] = useState(false);

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
            setLoadingProcess(true);
            const newList = formState?.indicators;
            await saveDataToDataStore(process.env.REACT_APP_DE_COMPLETNESS_KEY, newList, null, null, null);
            setNotification({
                show: true,
                message: translate('Operation_Success'),
                type: NOTIFICATION_SUCCESS
            });
            setLoadingProcess(false);
        } catch (err) {
            // setNotification({
            //     show: true,
            //     message: err.response?.data?.message || err.message,
            //     type: NOTIFICATION_CRITICAL
            // });
            // setLoadingProcess(false);
        }
    };

    const loadDataStoreElements = async () => {
        try {
            setLoadingElements(true);
            const response = await loadDataStore(process.env.REACT_APP_DE_COMPLETNESS_KEY, null, null, []);
            setDataStoreElements(response);
            setLoadingElements(false);
        } catch (err) {
            setLoadingElements(false);
        }
    };

    useEffect(() => {
        initFields();
    }, [dataStoreElements]);

    useEffect(() => {
        loadDataStoreElements();
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
                    <div style={{ fontWeight: 'bold' }}>{translate('Data_element_Management')}</div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <Button
                            primary
                            onClick={() => setOpenModal(true)}
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
                        {/* <Button
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
                        </Button> */}
                    </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                    {loadingElements ? (
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
                                {dataStoreElements?.map(group => (
                                    <tr key={group.name}>
                                        <td
                                            style={{
                                                padding: '2px 5px',
                                                verticalAlign: 'center',
                                                textAlign: 'center',
                                                border: '1px solid #00000070',
                                                width: '20%'
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
                                                width: '80%'
                                            }}
                                        >
                                            {group.children?.map((element, index) => (
                                                <div
                                                    key={element.id}
                                                    style={{
                                                        marginTop: '5px',
                                                        borderBottom: index + 1 === group.children.length ? '' : '1px solid #ccc',
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
                                                title={translate('Edit')}
                                                style={{
                                                    fontSize: '22px',
                                                    color: 'blue',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    setOpenModal(true);
                                                    setCurrentSelectedGroup(group);
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

            {openModal && (
                <SettingAddFormModal
                    dataStoreElements={dataStoreElements}
                    refreshElements={loadDataStoreElements}
                    elementName='Data_Element'
                    setOpen={setOpenModal}
                    open={openModal}
                    dataStoreKey={process.env.REACT_APP_DE_COMPLETNESS_KEY}
                    currentSelectedGroup={currentSelectedGroup}
                    setCurrentSelectedGroup={setCurrentSelectedGroup}
                />
            )}
        </>
    );
};

export default SettingDataElementCompletenessManagement;
