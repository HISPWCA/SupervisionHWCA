import { useEffect, useState } from 'react';
import { Card } from 'antd';
import { loadDataStore } from '../utils/functions';
import { useAlert } from '@dhis2/app-runtime';
import Loading from './Loading';
import { Button } from '@dhis2/ui';
import SettingAddFormModal from './SettingAddFormModal';
import { translateDataStoreLabel } from '../utils/translator';
import { IoMdAddCircleOutline } from 'react-icons/io';

const SettingRegistersManagement = () => {
    const [formState, setFormState] = useState({});
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

    //   const handleSave = async () => {
    //         try {
    //             setLoadingProcess(true);
    //             const newList = formState?.indicators;
    //             await saveDataToDataStore(process.env.REACT_APP_INDICATORS_MAPPING_KEY, newList, null, null, null);
    //             setNotification({
    //                 show: true,
    //                 message: translate('Operation_Success'),
    //                 type: NOTIFICATION_SUCCESS
    //             });
    //             setLoadingProcess(false);
    //         } catch (err) {
    //             setNotification({
    //                 show: true,
    //                 message: err.response?.data?.message || err.message,
    //                 type: NOTIFICATION_CRITICAL
    //             });
    //             setLoadingProcess(false);
    //         }
    //     };

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
                <div>
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
                                        {translate('Indicator_Group')}
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
                                        {translate('Indicators_Mapping')}
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
                                           
                                           
                                            {group.children?.map(indicator => (
                                                <div
                                                    key={indicator.id}
                                                    style={{
                                                        marginTop: '5px',
                                                        borderBottom: indicator.isStock ? '' : '1px solid #ccc',
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
                                                                        fontWeight: indicator.isStock && !indicator.parent ? 'bold' : 'normal',
                                                                        textDecoration: indicator.isStock && !indicator.parent ? 'underline' : 'none'
                                                                    }}
                                                                >
                                                                    {translateDataStoreLabel(indicator)}
                                                                </span>

                                                                {indicator.parent && indicator.isStock && (
                                                                    <span
                                                                        style={{
                                                                            backgroundColor: '#C3E9E260',
                                                                            padding: '5px',

                                                                            fontWeight: 'bold',
                                                                            borderRadius: '10px',
                                                                            fontSize: '12px'
                                                                        }}
                                                                    >
                                                                        ({translateDataStoreLabel(group.children?.find(i => i.id === indicator.parent))})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </Col>
                                                        {(!indicator.isStock || (indicator.isStock && indicator.parent)) && (
                                                            <Col md={7}>
                                                                <div
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '10px'
                                                                    }}
                                                                >
                                                                    <Input width="100%" disabled value={formState?.indicators?.find(it => it.group === group.name && it.indicator === indicator.id)?.dhis2?.name} />

                                                                    {formState?.indicators?.find(it => it.group === group.name && it.indicator === indicator.id)?.periodType && (
                                                                        <span
                                                                            style={{
                                                                                background: 'orange',
                                                                                fontWeight: 'bold',
                                                                                padding: '2px',
                                                                                borderRadius: '10px',
                                                                                color: 'white'
                                                                            }}
                                                                        >
                                                                            {formState?.indicators?.find(it => it.group === group.name && it.indicator === indicator.id)?.periodType}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                        )}

                                                        {indicator?.isNotInDHIS2 === true ? (
                                                            <Col md={1}></Col>
                                                        ) : (
                                                            (!indicator.isStock || (indicator.isStock && indicator.parent)) && (
                                                                <Col md={1}>
                                                                    <Button
                                                                        primary
                                                                        small
                                                                        onClick={() => {
                                                                            const currentIndicator = formState?.indicators?.find(it => it.group === group.name && it.indicator === indicator.id);

                                                                            setFormState({
                                                                                ...formState,
                                                                                visibleAnalyticComponentModal: true,
                                                                                selectedMetaDatas: currentIndicator?.dhis2 ? [currentIndicator?.dhis2] : [],
                                                                                currentIndicator: {
                                                                                    group: group.name,
                                                                                    indicator: indicator.id
                                                                                }
                                                                            });

                                                                            setSelectedDataSet(currentIndicator.dataSet);
                                                                        }}
                                                                        icon={
                                                                            <TbSelect
                                                                                style={{
                                                                                    fontSize: '18px'
                                                                                }}
                                                                            />
                                                                        }
                                                                    ></Button>
                                                                </Col>
                                                            )
                                                        )}

                                                        {(!indicator.isStock || (indicator.isStock && indicator.parent)) && (
                                                            <Col md={4}>
                                                                <div className="flex gap-2">
                                                                    <Checkbox
                                                                        disabled={!formState?.indicators?.find(it => it.group === group.name && it.indicator === indicator.id)?.dhis2}
                                                                        checked={formState?.indicators?.find(it => it.group === group.name && it.indicator === indicator.id)?.useNameFromDHIS2}
                                                                        onChange={_ =>
                                                                            setFormState({
                                                                                ...formState,
                                                                                indicators: formState?.indicators?.map(it => {
                                                                                    if (it.group === group.name && it.indicator === indicator.id) {
                                                                                        return {
                                                                                            ...it,
                                                                                            useNameFromDHIS2: !it.useNameFromDHIS2,
                                                                                            indicatorRename: getCurrentLangue() === 'en' ? (!it.useNameFromDHIS2 ? it.dhis2?.name : null) : null,

                                                                                            indicatorRename_fr: getCurrentLangue() === 'fr' ? (!it.useNameFromDHIS2 ? it.dhis2?.name : null) : null
                                                                                        };
                                                                                    }

                                                                                    return it;
                                                                                })
                                                                            })
                                                                        }
                                                                    >
                                                                        {translate('Use_Indicator_Name_From_Dhis2')}
                                                                    </Checkbox>
                                                                </div>
                                                            </Col>
                                                        )}

                                                        {(!indicator.isStock || (indicator.isStock && indicator.parent)) && (
                                                            <Col md={8}>
                                                                <div className="mt-2">
                                                                    <Input
                                                                        disabled={!formState?.indicators?.find(it => it.group === group.name && it.indicator === indicator.id)?.useNameFromDHIS2}
                                                                        value={
                                                                            getCurrentLangue() === 'en'
                                                                                ? formState?.indicators?.find(it => it.group === group.name && it.indicator === indicator.id)?.indicatorRename || ''
                                                                                : formState?.indicators?.find(it => it.group === group.name && it.indicator === indicator.id)?.indicatorRename_fr || ''
                                                                        }
                                                                        onChange={event => {
                                                                            setFormState({
                                                                                ...formState,
                                                                                indicators: formState?.indicators?.map(it => {
                                                                                    if (it.group === group.name && it.indicator === indicator.id) {
                                                                                        return {
                                                                                            ...it,
                                                                                            indicatorRename_fr: getCurrentLangue() === 'en' ? it.indicatorRename_fr : event.target.value,
                                                                                            indicatorRename: getCurrentLangue() === 'en' ? event.target.value : it.indicatorRename
                                                                                        };
                                                                                    }

                                                                                    return it;
                                                                                })
                                                                            });
                                                                        }}
                                                                        className="w-full"
                                                                        placeholder={translate('Indicator_Name')}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        )}
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
                                                    // setCurrentDataStoreMapping(group);
                                                    // setOpenNewIndicatorModal(true);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <pre>{JSON.stringify(dataStoreRegisters, null, 2)}</pre>
            </Card>

            <SettingAddFormModal formState={formState} setFormState={setFormState} />
        </>
    );
};

export default SettingRegistersManagement;
