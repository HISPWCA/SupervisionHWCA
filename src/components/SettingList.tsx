import { useAlert } from '@dhis2/app-runtime';
import { useEffect, useState } from 'react';
import useNotification from '../hooks/useNotification';
import { message, Popconfirm, Table } from 'antd';
import translate from '../utils/translator';
import { FiEdit } from 'react-icons/fi';
import { BLUE } from '../utils/couleurs';
import { RiDeleteBinLine } from 'react-icons/ri';

const SettingList = () => {
    const [mappingConfigSupervisions, setMappingConfigSupervisions] = useState([]);
    const { show } = useNotification();

    // const handleDeleteSupervisionConfig = async item => {
    //     try {
    //         if (item) {
    //             const newList = mappingConfigSupervisions.filter(mapConf => mapConf.id !== item.id);
    //             await saveDataToDataStore(process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY, newList, null, null, null);
    //             setMappingConfigSupervisions(newList);
    //             setNotification({
    //                 show: true,
    //                 message: translate('Suppression_Effectuee'),
    //                 type: NOTIFICATION_SUCCESS
    //             });

    //             setFormState({
    //                 selectedConfigurationType: DQR,
    //                 selectedSupervisionGenerationType: TYPE_GENERATION_AS_EVENT,
    //                 selectedPlanificationType: ORGANISATION_UNIT,
    //                 selectedProgramStageForConfiguration: null,
    //                 selectedOrganisationUnitGroup: null,
    //                 selectedTEIProgram: null,
    //                 selectedSupervisorDataElements: [],
    //                 selectedStatusSupervisionDataElement: null,
    //                 selectedSupervisionAutoGenerateID: null,
    //                 selectedNbrIndicatorsToShow: null,
    //                 selectedPeriodVerification: null,
    //                 selectedIndicatorsPeriodType: null,
    //                 selectedConsistencyOverTimePeriodType: null,
    //                 globalProgramArea: null,
    //                 globalProgramAreaKeyWords: [],
    //                 indicators: [],
    //                 recoupements: [],
    //                 completeness: {
    //                     registerKeyWords: [],
    //                     selectedNbrDataElementsToShow: null,
    //                     selectedNbrDocumentsSourceToShow: null,
    //                     selectedRegister: null,
    //                     dataElements: [],
    //                     sourceDocuments: [],
    //                     margin: null,
    //                     programAreaDOC: null,
    //                     programAreaDE: null
    //                 },
    //                 consistencyOvertimes: [],
    //                 isFieldEditingMode: false
    //             });

    //             setFormStateForRDQA({
    //                 selectedProgramStageForConfiguration: null,
    //                 selectedOrganisationUnitGroup: null,
    //                 selectedSupervisorDataElements: [],
    //                 selectedStatusSupervisionDataElement: null,
    //                 selectedSupervisionAutoGenerateID: null
    //             });

    //             setPeriodFormState({
    //                 month1KeyWords: [],
    //                 month2KeyWords: [],
    //                 month3KeyWords: [],
    //                 month4KeyWords: [],
    //                 month5KeyWords: [],
    //                 month6KeyWords: [],
    //                 month7KeyWords: [],
    //                 month8KeyWords: [],
    //                 month9KeyWords: [],
    //                 month10KeyWords: [],
    //                 month11KeyWords: [],
    //                 month12KeyWords: [],
    //                 month13KeyWords: [],
    //                 month14KeyWords: [],
    //                 month15KeyWords: []
    //             });

    //             setCurrentProgramstageConfiguration(null);
    //             setCurrentProgramstageConfigurationForRDQA(null);
    //             setProgramStageConfigurations([]);
    //         }
    //     } catch (err) {
    //         setNotification({
    //             show: true,
    //             message: err.response?.data?.message || err.message,
    //             type: NOTIFICATION_CRITICAL
    //         });
    //     }
    // };

    const initSupConfigStates = async () => {
        try {
            setMappingConfigSupervisions([]);

            const responseSupervisionTracker = await loadDataStore(
                process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY,
                null,
                null,
                null
            );

            setMappingConfigSupervisions(responseSupervisionTracker);
        } catch (err) {
            show({ message: err.response?.data?.message || err.message, type: 'critical' });
        }
    };

    useEffect(() => {
        initSupConfigStates();
    }, []);

    return (
        <>
            {mappingConfigSupervisions?.length > 0 && (
                <div
                    className="my-shadow"
                    style={{
                        padding: '20px',
                        background: '#FFF',
                        marginBottom: '2px',
                        borderRadius: '8px'
                    }}
                >
                    <div
                        style={{
                            marginBottom: '10px',
                            fontWeight: 'bold',
                            fontSize: '16px'
                        }}
                    >
                        {translate('Liste_Programme_Tracker')}
                    </div>
                    <Table
                        dataSource={mappingConfigSupervisions?.map(mapConf => ({
                            ...mapConf,
                            programName: mapConf?.program?.displayName,
                            action: { ...mapConf }
                        }))}
                        columns={[
                            {
                                title: translate('Programme'),
                                dataIndex: 'programName'
                            },

                            // {
                            //     title: translate('Type_Strategie'),
                            //     dataIndex: 'generationType',
                            //     render: value => (
                            //         <>
                            //             {value === TYPE_GENERATION_AS_ENROLMENT && translate('Enrolements')}
                            //             {value === TYPE_GENERATION_AS_EVENT && translate('Evenements')}
                            //             {value === TYPE_GENERATION_AS_TEI && translate('Teis')}
                            //         </>
                            //     )
                            // },
                            {
                                title: translate('Actions'),
                                dataIndex: 'action',
                                width: '80px',
                                render: value => (
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div style={{ marginRight: '10px' }}>
                                            <FiEdit
                                                style={{
                                                    color: BLUE,
                                                    fontSize: '18px',
                                                    cursor: 'pointer'
                                                }}
                                                // onClick={() => handleEditProgramSup(value)}
                                            />
                                        </div>
                                        <Popconfirm
                                            title={translate('Suppression_Configuration')}
                                            description={translate('Confirmation_Suppression_Configuration')}
                                            // icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                            // onConfirm={() => handleDeleteSupervisionConfig(value)}
                                        >
                                            <div>
                                                <RiDeleteBinLine
                                                    style={{
                                                        color: 'red',
                                                        fontSize: '18px',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                            </div>
                                        </Popconfirm>
                                    </div>
                                )
                            }
                        ]}
                        size="small"
                    />
                </div>
            )}

            {RenderConfigurationForEachProgramStageList()}
        </>
    );
};

export default SettingList;
