import { useEffect, useState } from 'react'
import { Button, Radio, Tab, TabBar } from "@dhis2/ui"
import { AGGREGATE_INDICATOR, NOTIFICATON_CRITICAL, NOTIFICATON_SUCCESS, INDICATOR_GROUP, PAGE_CONFIGURATION_TYPE_SUPERVISIONS, PAGE_CONFIGURATION_USER_AUTHORIZATIONS, PAGE_CONFIG_INDICATORS, PAGE_CONFIG_SUPERVISION, PAGPE_CONFIGURATION_INDICATEURS, PROGRAM_INDICATOR, TYPE_GENERATION_AS_ENROLMENT, TYPE_GENERATION_AS_EVENT, TYPE_GENERATION_AS_TEI, PAGE_SUPERVISIONS, TYPE_ANALYSE_DATA_ELEMENT, PAGE_CONFIG_ANALYSE, TYPE_ANALYSE_INDICATOR } from "../utils/constants"
import { Card, Checkbox, Col, Divider, Input, InputNumber, Popconfirm, Row, Select, Table } from 'antd'
import { DATA_ELEMENTS_ROUTE, INDICATORS_GROUP_ROUTE, INDICATORS_ROUTE, PROGRAMS_ROUTE, PROGRAMS_STAGE_ROUTE, PROGRAM_INDICATOR_GROUPS } from '../utils/api.routes'
import axios from 'axios'
import { v1 as uuid } from 'uuid'
import { FiSave } from 'react-icons/fi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { FiEdit } from 'react-icons/fi'
import { RxInfoCircled } from 'react-icons/rx'
import { MdOutlineCancel } from 'react-icons/md'
import { loadDataStore, saveDataToDataStore } from '../utils/functions'
import { BLUE } from '../utils/couleurs'
import { CgCloseO } from 'react-icons/cg'
import MyNotification from './MyNotification'


const Setting = () => {

    const [currentItem, setCurrentItem] = useState(null)
    const [notification, setNotification] = useState({ show: false, message: null, type: null })
    const [renderPage, setRenderPage] = useState(PAGE_CONFIGURATION_TYPE_SUPERVISIONS)
    const [programs, setPrograms] = useState([])
    const [indicatorGroups, setIndicatorGroups] = useState([])
    const [mappingConfigs, setMappingConfigs] = useState([])
    const [mappingConfigSupervisions, setMappingConfigSupervisions] = useState([])
    const [indicators, setIndicators] = useState([])
    const [dataElements, setDataElements] = useState([])
    const [analyseConfigs, setAnalyseConfigs] = useState([])
    const [programStages, setProgramStages] = useState([])
    const [isFieldEditingMode, setFieldEditingMode] = useState(false)

    const [indicatorName, setIndicatorName] = useState('')
    const [indicatorEtiquette, setIndicatorEtiquette] = useState('')
    const [indicatorWeight, setIndicatorWeight] = useState(0)
    const [indicatorBestPositive, setIndicatorBestPositive] = useState(true)

    const [selectedIndicator, setSelectedIndicator] = useState(null)
    const [selectedIndicatorGroup, setSelectedIndicatorGroup] = useState(null)
    const [selectedIndicatorType, setSelectedIndicatorType] = useState(PROGRAM_INDICATOR)
    const [selectedTEIProgram, setSelectedTEIProgram] = useState(null)
    const [selectedSupervisionGenerationType, setSelectedSupervisionGenerationType] = useState(TYPE_GENERATION_AS_TEI)
    const [selectedProgram, setSelectedProgram] = useState(null)
    const [selectedTypeSupervisionPage, setSelectedTypeSupervisionPage] = useState(PAGE_CONFIG_INDICATORS)
    const [selectedAnalyseType, setSelectedAnalyseType] = useState(TYPE_ANALYSE_DATA_ELEMENT)
    const [selectedAnalyseIndicator, setSelectedAnalyseIndicator] = useState(null)
    const [selectedAnalyseDataElement, setSelectedAnalyseDataElement] = useState(null)
    const [selectedProgramStage, setSelectedProgramStage] = useState(null)
    const [selectedDataElements, setSelectedDataElements] = useState([])

    const [loadingPrograms, setLoadingPrograms] = useState(false)
    const [loadingIndicatorGroups, setLoadingIndicatorGroups] = useState(false)
    const [loadingSaveSupervionsConfig, setLoadingSaveSupervionsConfig] = useState(false)
    const [loadingSaveIndicatorsConfig, setLoadingSaveIndicatorsConfig] = useState(false)
    const [loadingIndicators, setLoadingIndicators] = useState(false)
    const [loadingDataElements, setLoadingDataElements] = useState(false)
    const [loadingAddAnalyseConfigs, setLoadingAddAnalyseConfigs] = useState(false)
    const [loadingProgramStages, setLoadingProgramStages] = useState(false)


    const loadPrograms = async () => {
        try {
            setLoadingPrograms(true)

            const response = await axios.get(`${PROGRAMS_ROUTE}`)

            setPrograms(response.data.programs)
            setLoadingPrograms(false)
        } catch (err) {
            console.log(err)
            setLoadingPrograms(false)
        }
    }

    const loadIndicators = async () => {
        try {
            setLoadingIndicators(true)
            const response = await axios.get(`${INDICATORS_ROUTE}`)
            setIndicators(response.data.indicators)
            setLoadingIndicators(false)
        } catch (err) {
            console.log(err)
            setLoadingIndicators(false)
        }
    }

    const loadDataElements = async () => {
        try {
            setLoadingDataElements(true)
            const response = await axios.get(`${DATA_ELEMENTS_ROUTE}`)
            setDataElements(response.data.dataElements)
            setLoadingDataElements(false)
        } catch (err) {
            console.log(err)
            setLoadingDataElements(false)
        }
    }

    const loadIndicatorGroups = async () => {
        try {
            setLoadingIndicatorGroups(true)

            const response = await axios.get(`${INDICATORS_GROUP_ROUTE}`)

            setIndicatorGroups(response.data.indicatorGroups)
            setLoadingIndicatorGroups(false)
        } catch (err) {
            setLoadingIndicatorGroups(false)
        }
    }

    const loadProgramIndicatorGroups = async () => {
        try {
            setLoadingIndicatorGroups(true)

            const response = await axios.get(`${PROGRAM_INDICATOR_GROUPS}`)

            setIndicatorGroups(response.data.programIndicatorGroups)
            setLoadingIndicatorGroups(false)
        } catch (err) {
            console.log(err)
            setLoadingIndicatorGroups(false)
        }
    }

    const loadProgramStages = async (programID) => {
        try {
            setLoadingProgramStages(true)

            let route = `${PROGRAMS_STAGE_ROUTE},program,programStageDataElements[dataElement[id,displayName]]`
            if (programID)
                route = `${route}&filter=program.id:eq:${programID}`

            const response = await axios.get(route)

            setProgramStages(response.data.programStages)
            setLoadingProgramStages(false)
            return response.data.programStages
        } catch (err) {
            setLoadingProgramStages(false)
        }
    }


    const handleChangeIndicatorConfigType = ({ value }) => {
        setSelectedProgram(null)
        setSelectedIndicator(null)
        setSelectedIndicatorGroup(null)

        setSelectedIndicatorType(value)
        value === AGGREGATE_INDICATOR && loadIndicatorGroups()
    }

    // const handleSelectIndicatorGroup = (value) => {
    //     setSelectedIndicator(null)
    //     setSelectedIndicatorGroup(indicatorGroups.find(indGroup => indGroup.id === value))
    // }

    // const handleChangeIndicatorType = ({ value }) => {
    //     setSelectedIndicatorGroup(null)
    //     setSelectedIndicator(null)
    //     setSelectedDataElement(null)
    //     setIndicatorGroups([])
    //     setSelectedIndicatorType(value)

    //     value === INDICATOR_GROUP && loadIndicatorGroups()
    //     value === PROGRAM_INDICATOR && loadProgramIndicatorGroups()
    // }

    // const handleSelectDataElement = (value) => {
    //     setSelectedDataElement(selectedProgramStage.programStageDataElements?.map(p => p.dataElement).find(dataElement => dataElement.id === value))
    // }

    // const handleSelectIndicator = (value) => {
    //     setSelectedIndicator(null)
    //     selectedIndicatorType === INDICATOR_GROUP && setSelectedIndicator(selectedIndicatorGroup.indicators?.find(ind => ind.id === value))
    //     selectedIndicatorType === PROGRAM_INDICATOR && setSelectedIndicator(selectedIndicatorGroup.programIndicators?.find(progInd => progInd.id === value))
    // }


    // const handleAddNewMappingConfig = () => {
    //     setIsNewMappingMode(!isNewMappingMode)

    //     if (!isNewMappingMode) {
    //         setSelectedDataElement(null)
    //         setSelectedIndicator(null)
    //     }
    // }

    // const handleSelectProgramStage = (value) => {
    //     setSelectedProgramStage(programStages.find(pstage => pstage.id === value))
    //     setSelectedDataElement(null)
    // }

    // const handleSaveNewMappingConfig = async () => {
    //     try {
    //         setLoadingSaveDateElementMappingConfig(true)
    //         if (selectedDataElement && selectedIndicator && selectedProgramStage) {
    //             const existingConfig = mappingConfigs.find(mapping => mapping.dataElement?.id === selectedDataElement.id &&
    //                 mapping.indicator?.id === selectedIndicator.id &&
    //                 mapping.programStage?.id === selectedProgramStage.id
    //             )

    //             if (!existingConfig) {
    //                 const payload = {
    //                     id: uuid(),
    //                     dataElement: selectedDataElement,
    //                     indicator: selectedIndicator,
    //                     programStage: { id: selectedProgramStage.id, displayName: selectedProgramStage.displayName },
    //                     program: { id: selectedTEIProgram.id, displayName: selectedTEIProgram.displayName }
    //                 }
    //                 const newList = [...mappingConfigs, payload]
    //                 await saveDataToDataStore(process.env.REACT_APP_DATA_ELEMENTS_CONFIG_KEY, newList, null, setLoadingSaveDateElementMappingConfig, null)
    //                 setMappingConfigs(newList)
    //                 setSelectedDataElement(null)
    //                 setSelectedIndicator(null)
    //                 setSelectedProgramStage(null)
    //                 setSelectedIndicatorGroup(null)
    //                 setNotification({ show: true, type: NOTIFICATON_SUCCESS, message: 'Configuration ajoutée !' })
    //                 setLoadingSaveDateElementMappingConfig(false)
    //             } else {
    //                 throw new Error('Cette configuration à déjà été ajoutée')
    //             }
    //         }
    //     } catch (err) {
    //         setNotification({ show: true, type: NOTIFICATON_CRITICAL, message: err.response?.data?.message || err.message })
    //         setLoadingSaveDateElementMappingConfig(false)
    //     }
    // }


    // const handleDeleteSupervisionConfig = async (item) => {
    //     try {
    //         if (item) {
    //             const existingDXMappingOfPrograms = mappingConfigs.filter(mConfig => mConfig?.program?.id === item?.program?.id) || []

    //             if (existingDXMappingOfPrograms.length > 0)
    //                 throw new Error("La configuration que vous essayez de supprimer est déjà mappée avec les éléments de données. Veuillez supprimer d'abors ses éléments de données.")

    //             const newList = mappingConfigSupervisions.filter(mapConf => mapConf.id !== item.id)
    //             await saveDataToDataStore(process.env.REACT_APP_SUPERVISIONS_KEY, newList, null, null, null)
    //             setMappingConfigSupervisions(newList)
    //             setNotification({ show: true, message: 'Suppression éffectuée !', type: NOTIFICATON_SUCCESS })
    //         }
    //     } catch (err) {
    //         setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
    //     }
    // }

    const handleSelectIndicatorGroupIND = (value) => {
        setSelectedIndicator(null)
        setSelectedIndicatorGroup(indicatorGroups.find(indGroup => indGroup.id === value))
    }

    const handleSelectProgramIND = (value) => {
        setSelectedIndicator(null)
        setSelectedProgram(programs.find(prog => prog.id === value))
    }

    const handleSelectedTEIProgram = (value) => {
        setSelectedIndicatorGroup(null)
        setIndicatorGroups([])
        setSelectedProgramStage(null)
        setSelectedDataElements([])
        setSelectedTEIProgram(programs.find(p => p.id === value))
        // selectedIndicatorType === INDICATOR_GROUP && loadIndicatorGroups()
        // selectedIndicatorType === PROGRAM_INDICATOR && loadProgramIndicatorGroups()
        loadProgramStages(value)
    }

    const handleSelectIndicatorIND = (value) => {
        let currentIndicator = null

        if (selectedIndicatorType === AGGREGATE_INDICATOR)
            currentIndicator = selectedIndicatorGroup.indicators?.find(ind => ind.id === value)

        if (selectedIndicatorType === PROGRAM_INDICATOR)
            currentIndicator = selectedProgram.programIndicators?.find(progInd => progInd.id === value)

        if (currentIndicator) {
            setSelectedIndicator(currentIndicator)

            setIndicatorBestPositive(true)
            setIndicatorName(0)
            setIndicatorEtiquette(currentIndicator.displayName)
            setIndicatorName(currentIndicator.displayName)
        }
    }

    const handleSupervisionGenerationType = ({ value }) => {
        setSelectedSupervisionGenerationType(value)
    }

    const handleDeleteConfigItem = async (value) => {
        try {
            if (value) {

                setSelectedIndicator(null)
                setIndicatorName(null)
                setIndicatorBestPositive(true)
                setIndicatorWeight(0)
                setCurrentItem(null)

                const newList = mappingConfigs.filter(mapConf => mapConf.id !== value.id)

                if (selectedTypeSupervisionPage === PAGE_CONFIG_INDICATORS) {
                    await saveDataToDataStore(process.env.REACT_APP_INDICATORS_CONFIG_KEY, newList, null, null, null)
                }

                setMappingConfigs(newList)
                setNotification({ show: true, message: 'Suppression éffectuée !', type: NOTIFICATON_SUCCESS })
            }
        } catch (err) {
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const initIndicatorConfigStates = async () => {
        try {
            setMappingConfigs([])
            setDataElements([])
            setAnalyseConfigs([])
            setIndicators([])
            setSelectedProgram(null)
            setSelectedIndicatorGroup(null)
            setSelectedIndicator(null)
            setSelectedIndicatorType(AGGREGATE_INDICATOR)
            setIndicatorName('')
            setIndicatorEtiquette('')
            setIndicatorBestPositive(true)
            setIndicatorWeight(0)
            setCurrentItem(null)


            loadIndicatorGroups()
            const response = await loadDataStore(process.env.REACT_APP_INDICATORS_CONFIG_KEY, null, null, null)
            setMappingConfigs(response)
        } catch (err) {
            console.log(err)
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const initAnalyseConfigStates = async () => {
        try {
            setAnalyseConfigs([])
            setSelectedAnalyseDataElement(null)
            setSelectedAnalyseType(TYPE_ANALYSE_DATA_ELEMENT)
            setSelectedAnalyseIndicator(null)
            setCurrentItem(null)


            loadDataElements()
            loadIndicators()
            const response = await loadDataStore(process.env.REACT_APP_ANALYSES_CONFIG_KEY, null, null, null)
            setAnalyseConfigs(response)
        } catch (err) {
            console.log(err)
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })

        }
    }

    const initSupConfigStates = async () => {
        try {
            setCurrentItem(null)
            setMappingConfigs([])
            setDataElements([])
            setIndicators([])
            setAnalyseConfigs([])
            setMappingConfigSupervisions([])
            setSelectedTEIProgram(null)
            setSelectedSupervisionGenerationType(TYPE_GENERATION_AS_TEI)
            setSelectedIndicatorType(PROGRAM_INDICATOR)
            setSelectedIndicatorGroup(null)
            setSelectedIndicator(null)

            const responseSupervisionTracker = await loadDataStore(process.env.REACT_APP_SUPERVISIONS_KEY, null, null, null)
            setMappingConfigSupervisions(responseSupervisionTracker)
        } catch (err) {
            console.log(err)
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const handleDeleteSupervisionConfig = async (item) => {
        try {
            if (item) {
                const existingDXMappingOfPrograms = mappingConfigs.filter(mConfig => mConfig?.program?.id === item?.program?.id) || []

                if (existingDXMappingOfPrograms.length > 0)
                    throw new Error("La configuration que vous essayez de supprimer est déjà mappée avec les éléments de données. Veuillez supprimer d'abors ses éléments de données.")

                const newList = mappingConfigSupervisions.filter(mapConf => mapConf.id !== item.id)
                await saveDataToDataStore(process.env.REACT_APP_SUPERVISIONS_KEY, newList, null, null, null)
                setMappingConfigSupervisions(newList)
                setNotification({ show: true, message: 'Suppression éffectuée !', type: NOTIFICATON_SUCCESS })
            }
        } catch (err) {
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const handleUpdateBtnClicked = (item) => {
        setCurrentItem(item)
        item.indicatorType === AGGREGATE_INDICATOR && loadIndicatorGroups()
    }

    const initUpdateIndicatorConfigStage = async () => {
        try {

            if (selectedTypeSupervisionPage === PAGE_CONFIG_INDICATORS && currentItem) {
                if (currentItem.indicatorType === AGGREGATE_INDICATOR) {
                    const selectedIndGroup = indicatorGroups.find(p => p.id === currentItem.indicatorGroup?.id)
                    const selectedInd = selectedIndGroup?.indicators?.find(ind => ind.id === currentItem?.indicator?.id)

                    if (selectedInd) {
                        setSelectedIndicatorGroup(selectedIndGroup)
                        setSelectedIndicator(selectedInd)
                        setSelectedIndicatorType(currentItem.indicatorType)
                        setIndicatorName(currentItem.nom)
                        setIndicatorWeight(currentItem.weight)
                        setIndicatorEtiquette(currentItem.etiquette)
                        setIndicatorBestPositive(currentItem.bestPositive)
                    }
                }

                if (currentItem.indicatorType === PROGRAM_INDICATOR) {
                    const selectedProg = programs.find(p => p.id === currentItem.program?.id)
                    const selectedInd = selectedProg?.programIndicators?.find(pInd => pInd.id === currentItem?.indicator?.id)

                    if (selectedInd) {
                        setSelectedProgram(selectedProg)
                        setSelectedIndicator(selectedInd)
                        setSelectedIndicatorType(currentItem.indicatorType)
                        setIndicatorName(currentItem.nom)
                        setIndicatorWeight(currentItem.weight)
                        setIndicatorEtiquette(currentItem.etiquette)
                        setIndicatorBestPositive(currentItem.bestPositive)
                    }
                }
            }
        } catch (err) {
            console.log(err)
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const handleSaveSupConfig = async () => {
        try {
            setLoadingSaveSupervionsConfig(true)

            if (!selectedTEIProgram)
                throw new Error("Veuillez selectionner le programme tracker !")

            if (selectedTEIProgram && selectedSupervisionGenerationType) {
                const existingConfig = mappingConfigSupervisions.find(mapping => mapping.program?.id === selectedTEIProgram.id)

                if (existingConfig && !isFieldEditingMode)
                    throw new Error('Cette configuration à déjà été ajoutée !')

                if (!existingConfig && isFieldEditingMode)
                    throw new Error('Programme non trouvé !')

                const payload = {
                    generationType: selectedSupervisionGenerationType,
                    program: { id: selectedTEIProgram.id, displayName: selectedTEIProgram.displayName },
                    fieldConfig: null
                }

                if (selectedProgramStage && selectedDataElements.length > 0) {
                    payload.fieldConfig = {
                        supervisor: {
                            programStage: { id: selectedProgramStage.id, displayName: selectedProgramStage.displayName },
                            dataElements: selectedDataElements
                        }
                    }
                }

                let newList = []

                if (isFieldEditingMode) {
                    newList = mappingConfigSupervisions.map(m => {
                        if (m.id === existingConfig?.id) {
                            return { ...m, ...payload }
                        }
                        return m
                    })
                } else {
                    payload.id = uuid()
                    newList = [...mappingConfigSupervisions, payload]
                }

                await saveDataToDataStore(process.env.REACT_APP_SUPERVISIONS_KEY, newList, setLoadingSaveSupervionsConfig, null, null)

                setMappingConfigSupervisions(newList)
                setSelectedTEIProgram(null)
                setSelectedProgramStage(null)
                setFieldEditingMode(false)
                setSelectedDataElements([])
                setNotification({ show: true, type: NOTIFICATON_SUCCESS, message: isFieldEditingMode ? 'Mise à jour éffectuée' : 'Configuration ajoutée !' })
                setLoadingSaveSupervionsConfig(false)
            }

        } catch (err) {
            setNotification({ show: true, type: NOTIFICATON_CRITICAL, message: err.response?.data?.message || err.message })
            setLoadingSaveSupervionsConfig(false)
        }
    }

    const handleSaveIndicatorConfig = async () => {
        try {
            setLoadingSaveIndicatorsConfig(true)
            if (!indicatorName?.trim())
                throw new Error('Le Nom est obligatoire !')

            if (!indicatorEtiquette?.trim())
                throw new Error("L' Etiquette est obligatoire !")

            if (indicatorWeight === undefined || indicatorWeight === null)
                throw new Error('Le Poid est obligatoire !')

            if (indicatorName && indicatorEtiquette) {
                const existingConfig = mappingConfigs.find(mapping => mapping.indicator?.id === selectedIndicator?.id)

                if (!currentItem && existingConfig)
                    throw new Error('Cet indicateur est déjà configuré !')

                const payload = {
                    indicator: selectedIndicator,
                    program: selectedProgram && { id: selectedProgram.id, displayName: selectedProgram.displayName },
                    indicatorGroup: selectedIndicatorGroup && { id: selectedIndicatorGroup.id, displayName: selectedIndicatorGroup.displayName },
                    nom: indicatorName,
                    etiquette: indicatorEtiquette,
                    weight: indicatorWeight,
                    bestPositive: indicatorBestPositive,
                    indicatorType: selectedIndicatorType
                }
                let newList = []

                if (currentItem) {
                    newList = mappingConfigs.map(mapConfig => {
                        if (mapConfig.id === currentItem.id) {
                            return {
                                ...mapConfig,
                                ...payload
                            }
                        } else {
                            return mapConfig
                        }
                    })
                } else {
                    payload.id = uuid()
                    newList = [...mappingConfigs, payload]
                }

                await saveDataToDataStore(process.env.REACT_APP_INDICATORS_CONFIG_KEY, newList, setLoadingSaveIndicatorsConfig, null, null)
                setMappingConfigs(newList)
                setNotification({ show: true, message: !currentItem ? 'Configuration ajoutée !' : 'Mise à jour éffectuée avec success !', type: NOTIFICATON_SUCCESS })
                setSelectedIndicator(null)
                setIndicatorName(null)
                setIndicatorBestPositive(true)
                setIndicatorWeight(0)
                setCurrentItem(null)
                return setLoadingSaveIndicatorsConfig(false)

            }
        } catch (err) {
            setLoadingSaveIndicatorsConfig(false)
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const handleCancelUpdateIndicatorItem = () => {
        setSelectedIndicator(null)
        setIndicatorName(null)
        setIndicatorBestPositive(true)
        setIndicatorWeight(0)
        setCurrentItem(null)
    }

    const handleClickConfigMenu = confValue => {
        confValue === PAGE_CONFIG_INDICATORS && initIndicatorConfigStates()
        confValue === PAGE_CONFIG_SUPERVISION && initSupConfigStates()
        confValue === PAGE_CONFIG_ANALYSE && initAnalyseConfigStates()

        setSelectedTypeSupervisionPage(confValue)
    }

    const handleDeleteAnalyseConfig = async (value) => {
        try {
            if (value) {
                const newList = analyseConfigs.filter(analyseConf => analyseConf.id !== value.id)
                await saveDataToDataStore(process.env.REACT_APP_ANALYSES_CONFIG_KEY, newList, null, null, null)
                setAnalyseConfigs(newList)
                setNotification({ show: true, message: 'Suppression éffectuée !', type: NOTIFICATON_SUCCESS })
            }
        } catch (err) {
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const handleChangeElementType = ({ value }) => {
        setSelectedAnalyseDataElement(null)
        setSelectedAnalyseIndicator(null)
        setSelectedAnalyseType(value)
    }

    const handleSelectAnalyseDataElement = value => {
        setSelectedAnalyseDataElement(dataElements.find(el => el.id === value))
    }

    const handleSelectAnalyseIndicator = value => setSelectedAnalyseIndicator(indicators.find(ind => ind.id === value))

    const handleSaveAnalyseConfigs = async () => {
        try {
            setLoadingAddAnalyseConfigs(true)

            if (selectedAnalyseType === TYPE_ANALYSE_DATA_ELEMENT && !selectedAnalyseDataElement)
                throw new Error("L'élément de donnée est obligatoire !")

            if (selectedAnalyseType === TYPE_ANALYSE_INDICATOR && !selectedAnalyseIndicator)
                throw new Error("L'indicateur est obligatoire !")

            const existingConfig = analyseConfigs.find(config => {
                if (selectedAnalyseType === TYPE_ANALYSE_DATA_ELEMENT) {
                    return config.dataElement?.id === selectedAnalyseDataElement.id
                }
                if (selectedAnalyseType === TYPE_ANALYSE_INDICATOR) {
                    return config.indicator?.id === selectedAnalyseIndicator.id
                } else {
                    return false
                }
            })

            if (!existingConfig) {
                let payload = {
                    id: uuid(),
                    elementType: selectedAnalyseType
                }

                if (selectedAnalyseType === TYPE_ANALYSE_DATA_ELEMENT) {
                    payload.dataElement = { id: selectedAnalyseDataElement.id, displayName: selectedAnalyseDataElement.displayName }
                }

                if (selectedAnalyseType === TYPE_ANALYSE_INDICATOR) {
                    payload.indicator = { id: selectedAnalyseIndicator.id, displayName: selectedAnalyseIndicator.displayName }
                }

                const newList = [...analyseConfigs, payload]
                await saveDataToDataStore(process.env.REACT_APP_ANALYSES_CONFIG_KEY, newList, null, null, null)

                setAnalyseConfigs(newList)
                setSelectedAnalyseDataElement(null)
                setSelectedAnalyseIndicator(null)
                setNotification({ show: true, type: NOTIFICATON_SUCCESS, message: 'Configuration ajoutée !' })
                return setLoadingAddAnalyseConfigs(false)
            } else {
                throw new Error('Cette configuration à déjà été ajoutée')
            }
        } catch (err) {
            setNotification({ show: true, type: NOTIFICATON_CRITICAL, message: err.response?.data?.message || err.message })
            setLoadingAddAnalyseConfigs(false)
        }
    }

    const handleSelectDataElements = (values) => {
        setSelectedDataElements(values.map(value => selectedProgramStage.programStageDataElements?.map(p => p.dataElement).find(dataElement => dataElement.id === value)))
    }
    const handleSelectProgramStage = (value) => {
        setSelectedProgramStage(programStages.find(pstage => pstage.id === value))
        setSelectedDataElements([])
    }

    const RenderSupervisorFieldConfiguration = () => (
        <div style={{ marginTop: '20px' }}>
            <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size='small'>
                <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                    <div style={{ fontWeight: 'bold' }}>
                        Configuration des champs superviseurs
                    </div>
                    <div style={{ marginTop: '10px', color: '#00000080', fontSize: '13px' }}>
                        Cette configuration permettra de faire la correspondance entre les éléments de données sélectionnées,
                        et les superviseurs qui seront sélectionnés lors de la planification en respectant l'ordre de sélection.
                    </div>
                </div>
                <div style={{ padding: '10px' }}>
                    <Row gutter={[10, 10]}>
                        <Col md={12}>
                            <div>
                                <div style={{ marginBottom: '5px' }}>Programmes Stage</div>
                                <Select
                                    options={programStages.map(programStage => ({ label: programStage.displayName, value: programStage.id }))}
                                    placeholder="Choisir le program stage"
                                    style={{ width: '100%' }}
                                    optionFilterProp='label'
                                    value={selectedProgramStage?.id}
                                    onChange={handleSelectProgramStage}
                                    showSearch
                                    allowClear
                                    loading={loadingProgramStages}
                                    disabled={loadingProgramStages}
                                />
                            </div>
                        </Col>
                        {
                            selectedProgramStage && (
                                <Col md={12} xs={24}>
                                    <div>
                                        <div style={{ marginBottom: '5px' }}>Eléments de données</div>
                                        <Select
                                            options={selectedProgramStage?.programStageDataElements?.map(progStageDE => ({ label: progStageDE.dataElement?.displayName, value: progStageDE.dataElement?.id }))}
                                            placeholder="Element de donnée"
                                            style={{ width: '100%' }}
                                            mode="multiple"
                                            onChange={handleSelectDataElements}
                                            value={selectedDataElements.map(s => s.id)}
                                            optionFilterProp='label'
                                            showSearch
                                            allowClear
                                        />
                                    </div>
                                </Col>
                            )
                        }
                    </Row>
                </div>
            </Card>
        </div>
    )

    const RenderSupervisionConfiguration = () => (
        <>
            <div className='my-shadow' style={{ padding: '20px', background: '#FFF', marginBottom: '2px', borderRadius: '8px' }}>
                <div>
                    <div style={{ marginBottom: '5px' }}>Programmes Tracker</div>
                    <Select
                        options={programs.map(program => ({ label: program.displayName, value: program.id }))}
                        loading={loadingPrograms}
                        showSearch
                        placeholder="Choisir les programmes concerné"
                        style={{ width: '100%' }}
                        optionFilterProp='label'
                        onChange={handleSelectedTEIProgram}
                        value={selectedTEIProgram?.id}
                        allowClear
                    />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <div style={{ marginTop: '5px' }}>
                        <Radio
                            label="Générer les supervisions comme Tracked Entity Instances"
                            onChange={handleSupervisionGenerationType}
                            value={TYPE_GENERATION_AS_TEI}
                            checked={selectedSupervisionGenerationType === TYPE_GENERATION_AS_TEI}
                        />
                    </div>
                    <div style={{ marginTop: '5px' }}>
                        <Radio
                            label="Générer les supervisions comme Enrôlements"
                            onChange={handleSupervisionGenerationType}
                            value={TYPE_GENERATION_AS_ENROLMENT}
                            checked={selectedSupervisionGenerationType === TYPE_GENERATION_AS_ENROLMENT}
                        />
                    </div>
                    <div style={{ marginTop: '5px' }}>
                        <Radio

                            label="Générer les supervisions comme Evènements"
                            onChange={handleSupervisionGenerationType}
                            value={TYPE_GENERATION_AS_EVENT}
                            checked={selectedSupervisionGenerationType === TYPE_GENERATION_AS_EVENT}
                        />
                    </div>
                </div>
            </div>
        </>
    )

    const handleEditProgramSup = async (prog) => {
        try {
            setSelectedTEIProgram(prog.program)
            const programStageList = await loadProgramStages(prog?.program?.id)
            setSelectedProgramStage(programStageList.find(psg => psg.id === prog.fieldConfig?.supervisor?.programStage.id))
            setSelectedDataElements(prog.fieldConfig?.supervisor?.dataElements)
            setSelectedSupervisionGenerationType(prog.generationType)
            setFieldEditingMode(true)
        } catch (err) {
            console.log(err)
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const RenderPageSupervisionConfig = () => (
        <>
            <Row gutter={[8, 10]} >
                <Col md={12} sm={24}>
                    <div >
                        {RenderSupervisionConfiguration()}
                        {selectedTEIProgram && RenderSupervisorFieldConfiguration()}

                        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                            {
                                isFieldEditingMode && <div>
                                    <Button
                                        icon={<CgCloseO style={{ color: '#fff', fontSize: '18px' }} />}
                                        destructive
                                        onClick={() => {
                                            setFieldEditingMode(false)
                                            setSelectedTEIProgram(null)
                                            setSelectedProgramStage(null)
                                            setSelectedDataElements([])
                                            setSelectedSupervisionGenerationType(TYPE_GENERATION_AS_TEI)
                                        }}
                                    >
                                        Annuler
                                    </Button>
                                </div>
                            }
                            <div style={{ marginLeft: '10px' }}>
                                <Button
                                    loading={loadingSaveSupervionsConfig}
                                    disabled={loadingSaveSupervionsConfig || !selectedTEIProgram}
                                    icon={<FiSave style={{ color: '#FFF', fontSize: '18px' }} />}
                                    primary
                                    onClick={handleSaveSupConfig}
                                >
                                    {isFieldEditingMode && <span>Mise à jour</span>}
                                    {!isFieldEditingMode && <span>Enrégistrer</span>}
                                </Button>
                            </div>
                        </div>
                        {/* {
                            selectedTEIProgram && (
                                <div className='my-shadow' style={{ padding: '20px', background: '#FFF', marginBottom: '2px', borderRadius: '8px', marginTop: '10px' }}>
                                    <Row gutter={[14, 14]}>
                                        <Col md={24}>
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>Programmes Stage</div>
                                                <Select
                                                    options={programStages.map(program => ({ label: program.displayName, value: program.id }))}
                                                    placeholder="Choisir le program stage"
                                                    style={{ width: '100%' }}
                                                    optionFilterProp='label'
                                                    value={selectedProgramStage?.id}
                                                    onChange={handleSelectProgramStage}
                                                    showSearch
                                                    loading={loadingProgramStages}
                                                    disabled={loadingProgramStages}
                                                />
                                            </div>
                                        </Col>
                                        <Col md={12}>
                                            <Row gutter={[8, 8]}>
                                                <Col md={24}>
                                                    <div style={{ marginBottom: '5px' }}>Type d'indicateurs</div>
                                                </Col>
                                                <Col>
                                                    <div>
                                                        <Radio
                                                            label="Indicateurs de programmes"
                                                            onChange={handleChangeIndicatorType}
                                                            value={PROGRAM_INDICATOR}
                                                            checked={selectedIndicatorType === PROGRAM_INDICATOR}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div>
                                                        <Radio
                                                            label="Groupe d'indicateurs"
                                                            onChange={handleChangeIndicatorType}
                                                            value={INDICATOR_GROUP}
                                                            checked={selectedIndicatorType === INDICATOR_GROUP}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>

                                        <Col md={12}>
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>Group d'indicateurs</div>
                                                <Select
                                                    options={indicatorGroups.map(indicateurGroup => ({ label: indicateurGroup.displayName, value: indicateurGroup.id }))}
                                                    placeholder="Choisir le group d'indicateur"
                                                    style={{ width: '100%' }}
                                                    onChange={handleSelectIndicatorGroup}
                                                    value={selectedIndicatorGroup?.id}
                                                    optionFilterProp='label'
                                                    showSearch
                                                    loading={loadingIndicatorGroups}
                                                    disabled={loadingIndicatorGroups}
                                                />
                                            </div>

                                        </Col>
                                        {
                                            selectedIndicatorGroup && selectedProgramStage && (
                                                <Col md={24} xs={24}>
                                                    <Divider style={{ margin: '5px auto' }} />

                                                    {
                                                        selectedProgramStage && (
                                                            <Button primary={!isNewMappingMode ? true : false} destructive={isNewMappingMode ? true : false} onClick={handleAddNewMappingConfig}>
                                                                {!isNewMappingMode && <span>+ Ajouter nouveau mapping</span>}
                                                                {isNewMappingMode && <span>Annuler le mapping</span>}
                                                            </Button>
                                                        )
                                                    }

                                                    {
                                                        isNewMappingMode && (
                                                            <div style={{ marginTop: '10px' }}>
                                                                <Row gutter={[8, 8]}>
                                                                    {
                                                                        selectedProgramStage && (
                                                                            <Col md={10} xs={24}>
                                                                                <div>
                                                                                    <div style={{ marginBottom: '5px' }}>Eléments de données</div>
                                                                                    <Select
                                                                                        options={selectedProgramStage?.programStageDataElements?.map(progStageDE => ({ label: progStageDE.dataElement?.displayName, value: progStageDE.dataElement?.id }))}
                                                                                        placeholder="Element de donnée"
                                                                                        style={{ width: '100%' }}
                                                                                        onChange={handleSelectDataElement}
                                                                                        value={selectedDataElement?.id}
                                                                                        optionFilterProp='label'
                                                                                        showSearch
                                                                                    />
                                                                                </div>
                                                                            </Col>
                                                                        )
                                                                    }

                                                                    {
                                                                        selectedIndicatorGroup && (
                                                                            <Col md={10} xs={24}>
                                                                                <div>
                                                                                    <div style={{ marginBottom: '5px' }}>Indicateurs</div>
                                                                                    <Select
                                                                                        options={
                                                                                            selectedIndicatorType === INDICATOR_GROUP ?
                                                                                                selectedIndicatorGroup.indicators?.map(progInd => ({ label: progInd.displayName, value: progInd.id }))
                                                                                                : selectedIndicatorType === PROGRAM_INDICATOR &&
                                                                                                selectedIndicatorGroup.programIndicators?.map(progInd => ({ label: progInd.displayName, value: progInd.id })) ||
                                                                                                []
                                                                                        }
                                                                                        placeholder="Indicateurs"
                                                                                        style={{ width: '100%' }}
                                                                                        onChange={handleSelectIndicator}
                                                                                        value={selectedIndicator?.id}
                                                                                        optionFilterProp='label'
                                                                                        showSearch
                                                                                    />
                                                                                </div>
                                                                            </Col>
                                                                        )
                                                                    }
                                                                    <Col md={4} xs={24}>
                                                                        <div style={{ marginTop: '18px' }}>
                                                                            <Button loading={loadingSaveDateElementMappingConfig} disabled={loadingSaveDateElementMappingConfig} primary onClick={handleSaveNewMappingConfig}>+ Ajouter </Button>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        )
                                                    }

                                                </Col>
                                            )
                                        }
                                    </Row>
                                </div>
                            )
                        } */}
                    </div>
                </Col>
                <Col md={12} sm={24}>

                    {
                        mappingConfigSupervisions.length > 0 && (
                            <div className='my-shadow' style={{ padding: '20px', background: '#FFF', marginBottom: '2px', borderRadius: '8px' }}>
                                <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>Liste des configurations des programmes tracker </div>
                                <Table
                                    dataSource={
                                        mappingConfigSupervisions.map(mapConf => ({
                                            ...mapConf,
                                            programName: mapConf?.program?.displayName,
                                            action: { ...mapConf }
                                        }))
                                    }
                                    columns={
                                        [
                                            {
                                                title: 'Program',
                                                dataIndex: 'programName'
                                            },

                                            {
                                                title: 'Type de génération',
                                                dataIndex: 'generationType',
                                                render: value => (
                                                    <>
                                                        {value === TYPE_GENERATION_AS_ENROLMENT && 'Enrôlements'}
                                                        {value === TYPE_GENERATION_AS_EVENT && 'Evènements'}
                                                        {value === TYPE_GENERATION_AS_TEI && 'Tracked Entity Instances'}
                                                    </>
                                                )
                                            },
                                            {
                                                title: 'Actions',
                                                dataIndex: 'action',
                                                width: '80px',
                                                render: value => (
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{ marginRight: '10px' }}>
                                                            <RxInfoCircled style={{ color: BLUE, fontSize: '20px', cursor: 'pointer' }} onClick={() => handleEditProgramSup(value)} />
                                                        </div>
                                                        <Popconfirm
                                                            title="Suppression de la configuration"
                                                            description="Voulez-vous vraiment supprimer cette configuration "
                                                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                            onConfirm={() => handleDeleteSupervisionConfig(value)}
                                                        >
                                                            <div>
                                                                <RiDeleteBinLine style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} />
                                                            </div>
                                                        </Popconfirm>
                                                    </div>
                                                )
                                            },
                                        ]
                                    }
                                    size="small"
                                />
                            </div>
                        )
                    }
                </Col>
            </Row>
        </>
    )

    const RenderTopContent = () => (
        <>
            <div style={{ padding: '20px', borderBottom: '1px solid #ccc', background: '#FFF' }}>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Paramètre de Configurations</span>
            </div>
        </>
    )

    const RenderUserAuthorizationContent = () => (
        <div>
            User authorizations content
        </div>
    )

    const RenderPageIndicatorConfig = () => (
        <>
            <Row gutter={[8, 10]} >
                <Col md={12} sm={24}>
                    <div className='my-shadow' style={{ padding: '20px', background: '#FFF', marginBottom: '2px', borderRadius: '8px' }}>
                        <div>
                            <Row gutter={[8, 8]}>
                                <Col md={24}>
                                    <div style={{ marginBottom: '5px' }}>Type d'indicateurs</div>
                                </Col>
                                <Col>
                                    <div>
                                        <Radio
                                            label="Indicateurs Aggrégés"
                                            onChange={handleChangeIndicatorConfigType}
                                            value={AGGREGATE_INDICATOR}
                                            checked={selectedIndicatorType === AGGREGATE_INDICATOR}
                                            disabled={currentItem ? true : false}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div>
                                        <Radio
                                            label="Indicateurs de programmes"
                                            onChange={handleChangeIndicatorConfigType}
                                            value={PROGRAM_INDICATOR}
                                            checked={selectedIndicatorType === PROGRAM_INDICATOR}
                                            disabled={currentItem ? true : false}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {
                            selectedIndicatorType === AGGREGATE_INDICATOR && (
                                <div style={{ marginTop: '20px' }}>
                                    <Row gutter={[8, 8]}>
                                        <Col md={12} sm={24}>
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>Groupe d'indicateurs</div>
                                                <Select
                                                    options={indicatorGroups.map(indicateurGroup => ({ label: indicateurGroup.displayName, value: indicateurGroup.id }))}
                                                    placeholder="Choisir le group d'indicateur"
                                                    style={{ width: '100%' }}
                                                    onChange={handleSelectIndicatorGroupIND}
                                                    value={selectedIndicatorGroup?.id}
                                                    optionFilterProp='label'
                                                    showSearch
                                                    allowClear
                                                    loading={loadingIndicatorGroups}
                                                    disabled={loadingIndicatorGroups}
                                                />
                                            </div>
                                        </Col>

                                        {
                                            selectedIndicatorGroup && (
                                                <Col md={12} sm={24}>
                                                    <div>
                                                        <div style={{ marginBottom: '5px' }}>Indicateurs</div>
                                                        <Select
                                                            options={selectedIndicatorGroup.indicators?.map(progInd => ({ label: progInd.displayName, value: progInd.id }))}
                                                            placeholder="Indicateurs"
                                                            style={{ width: '100%' }}
                                                            onChange={handleSelectIndicatorIND}
                                                            value={selectedIndicator?.id}
                                                            optionFilterProp='label'
                                                            showSearch
                                                            allowClear
                                                        />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                    </Row>
                                </div>
                            )
                        }

                        {
                            selectedIndicatorType === PROGRAM_INDICATOR && (
                                <div style={{ marginTop: '20px' }}>
                                    <Row gutter={[8, 8]}>
                                        <Col md={12} sm={24}>
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>Programmes</div>
                                                <Select
                                                    options={programs.map(program => ({ label: program.displayName, value: program.id }))}
                                                    placeholder="Choisir le programme"
                                                    style={{ width: '100%' }}
                                                    onChange={handleSelectProgramIND}
                                                    value={selectedProgram?.id}
                                                    optionFilterProp='label'
                                                    showSearch
                                                    loading={loadingPrograms}
                                                    disabled={loadingPrograms}
                                                    allowClear
                                                />
                                            </div>
                                        </Col>

                                        {
                                            selectedProgram && (
                                                <Col md={12} sm={24}>
                                                    <div>
                                                        <div style={{ marginBottom: '5px' }}>Indicateurs</div>
                                                        <Select
                                                            options={selectedProgram.programIndicators?.map(progInd => ({ label: progInd.displayName, value: progInd.id }))}
                                                            placeholder="Indicateurs"
                                                            style={{ width: '100%' }}
                                                            onChange={handleSelectIndicatorIND}
                                                            value={selectedIndicator?.id}
                                                            optionFilterProp='label'
                                                            showSearch
                                                            allowClear
                                                        />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                    </Row>
                                </div>
                            )
                        }
                    </div>

                    {
                        selectedIndicator && (
                            <div className='my-shadow' style={{ padding: '20px', background: '#FFF', marginBottom: '2px', borderRadius: '8px', marginTop: '10px' }}>
                                <Row gutter={[15, 15]}>
                                    <Col md={12} sm={24}>
                                        <div style={{ marginBottom: '5px' }}>Nom</div>
                                        <Input name='indicatorName' value={indicatorName} disabled />
                                    </Col>
                                    <Col md={12} sm={24}>
                                        <div style={{ marginBottom: '5px' }}>Etiquette</div>
                                        <Input name='indicatorName' value={indicatorEtiquette} onChange={event => setIndicatorEtiquette(''.concat(event.target.value))} />
                                    </Col>
                                    <Col md={12} sm={24}>
                                        <div style={{ marginBottom: '5px' }}>Poids</div>
                                        <InputNumber style={{ width: '100%' }} name='indicatorName' value={indicatorWeight} onChange={event => setIndicatorWeight(event)} />
                                    </Col>
                                    <Col md={12}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '25px' }}>
                                            <Checkbox checked={indicatorBestPositive} onChange={() => setIndicatorBestPositive(!indicatorBestPositive)} />
                                            <span style={{ marginLeft: '10px' }}> Meilleur Positif</span>
                                        </div>
                                    </Col>

                                    <Col md={24}>
                                        <Divider style={{ margin: '10px auto' }} />
                                    </Col>

                                    <Col md={24}>
                                        <div style={{ display: 'flex', width: '100%' }}>
                                            {
                                                !currentItem && (
                                                    <div>
                                                        <Button
                                                            icon={<FiSave style={{ color: '#FFF', fontSize: '18px' }} />}
                                                            primary
                                                            onClick={handleSaveIndicatorConfig}
                                                            loading={loadingSaveIndicatorsConfig}
                                                            disabled={loadingSaveIndicatorsConfig}
                                                        >Enrégistrer</Button>
                                                    </div>
                                                )
                                            }

                                            {
                                                currentItem && (
                                                    <div style={{ marginRight: '10px' }}>
                                                        <Button
                                                            icon={<MdOutlineCancel style={{ color: '#FFF', fontSize: '18px' }} />}
                                                            onClick={handleCancelUpdateIndicatorItem}
                                                            destructive
                                                        >Annuler</Button>
                                                    </div>
                                                )
                                            }

                                            {
                                                currentItem && (
                                                    <div>
                                                        <Button
                                                            icon={<FiEdit style={{ color: '#FFF', fontSize: '18px' }} />}
                                                            onClick={handleSaveIndicatorConfig}
                                                            loading={loadingSaveIndicatorsConfig}
                                                            disabled={loadingSaveIndicatorsConfig}
                                                            primary
                                                        >Mise à jour</Button>
                                                    </div>
                                                )
                                            }

                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )
                    }
                </Col>

                <Col md={12} sm={24}>
                    {
                        mappingConfigs.length > 0 && (
                            <div className='my-shadow' style={{ padding: '20px', background: '#FFF', marginBottom: '2px', borderRadius: '8px' }}>
                                <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>Liste des indicateurs configurés </div>
                                <Table
                                    dataSource={
                                        mappingConfigs.map(mapConf => ({
                                            ...mapConf,
                                            action: { ...mapConf }
                                        }))
                                    }
                                    columns={
                                        [
                                            {
                                                title: 'Indicateur',
                                                dataIndex: 'nom'
                                            },
                                            {
                                                title: 'Poid',
                                                dataIndex: 'weight'
                                            },
                                            {
                                                title: "Type d'indicateur",
                                                dataIndex: 'indicatorType',
                                                render: value => (
                                                    <>
                                                        {value === AGGREGATE_INDICATOR && 'Agrégee'}
                                                        {value === PROGRAM_INDICATOR && 'Indicateur de programme'}
                                                    </>
                                                )
                                            },
                                            {
                                                title: 'Actions',
                                                dataIndex: 'action',
                                                width: '80px',
                                                render: value => (
                                                    <>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <FiEdit style={{ color: BLUE, fontSize: '15px', cursor: 'pointer' }} onClick={() => handleUpdateBtnClicked(value)} />
                                                            <Popconfirm
                                                                title="Suppression de la configuration"
                                                                description="Voulez-vous vraiment supprimer cette configuration "
                                                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                                onConfirm={() => handleDeleteConfigItem(value)}
                                                            >
                                                                <RiDeleteBinLine style={{ color: 'red', fontSize: '16px', cursor: 'pointer', marginLeft: '5px' }} />
                                                            </Popconfirm>
                                                        </div>
                                                    </>
                                                )
                                            },
                                        ]
                                    }
                                    size="small"
                                />
                            </div>
                        )
                    }
                </Col>
            </Row>
        </>
    )

    const RenderPageAnalyseConfig = () => (
        <>
            <Row gutter={[8, 10]} >
                <Col md={12} sm={24}>
                    <div className='my-shadow' style={{ padding: '20px', background: '#FFF', marginBottom: '2px', borderRadius: '8px', position: 'sticky', top: 30 }}>
                        <div>
                            <Row gutter={[8, 8]}>
                                <Col md={24}>
                                    <div style={{ marginBottom: '5px' }}>Type d'élément</div>
                                </Col>
                                <Col>
                                    <div>
                                        <Radio
                                            label="Élément de données"
                                            onChange={handleChangeElementType}
                                            value={TYPE_ANALYSE_DATA_ELEMENT}
                                            checked={selectedAnalyseType === TYPE_ANALYSE_DATA_ELEMENT}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div>
                                        <Radio
                                            label="Indicateurs"
                                            onChange={handleChangeElementType}
                                            value={TYPE_ANALYSE_INDICATOR}
                                            checked={selectedAnalyseType === TYPE_ANALYSE_INDICATOR}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <Row gutter={[10, 10]}>
                                <Col md={18} xs={24}>
                                    {
                                        selectedAnalyseType === TYPE_ANALYSE_DATA_ELEMENT && (
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>Eléments de données</div>
                                                <Select
                                                    options={dataElements.map(dataElement => ({ label: dataElement.displayName, value: dataElement.id }))}
                                                    placeholder="Element de donnée"
                                                    style={{ width: '100%' }}
                                                    onChange={handleSelectAnalyseDataElement}
                                                    value={selectedAnalyseDataElement?.id}
                                                    optionFilterProp='label'
                                                    showSearch
                                                    loading={loadingDataElements}
                                                    disabled={loadingDataElements}
                                                    allowClear
                                                />
                                            </div>
                                        )
                                    }
                                    {
                                        selectedAnalyseType === TYPE_ANALYSE_INDICATOR && (
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>Indicateurs</div>
                                                <Select
                                                    options={indicators.map(ind => ({ value: ind.id, label: ind.displayName }))}
                                                    placeholder="Indicateurs"
                                                    style={{ width: '100%' }}
                                                    onChange={handleSelectAnalyseIndicator}
                                                    value={selectedAnalyseIndicator?.id}
                                                    optionFilterProp='label'
                                                    showSearch
                                                    disabled={loadingIndicators}
                                                    loading={loadingIndicators}
                                                    allowClear
                                                />
                                            </div>
                                        )
                                    }
                                </Col>
                                <Col md={6} xs={24}>
                                    {
                                        selectedAnalyseDataElement || selectedAnalyseIndicator ? (
                                            <div style={{ marginTop: '18px' }}>
                                                <Button
                                                    loading={loadingAddAnalyseConfigs}
                                                    disabled={loadingAddAnalyseConfigs}
                                                    primary
                                                    onClick={handleSaveAnalyseConfigs}
                                                > + Ajouter </Button>
                                            </div>
                                        ) : <></>
                                    }
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>

                <Col md={12} sm={24}>
                    {
                        analyseConfigs.length > 0 && (
                            <div className='my-shadow' style={{ padding: '20px', background: '#FFF', marginBottom: '2px', borderRadius: '8px' }}>
                                <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>Liste des éléments configurés </div>
                                <Table
                                    dataSource={
                                        analyseConfigs.map(config => ({
                                            ...config,
                                            nom: config.elementType === TYPE_ANALYSE_DATA_ELEMENT ? config?.dataElement?.displayName : config?.indicator?.displayName,
                                            elementType: config.elementType,
                                            action: { ...config }
                                        }))
                                    }
                                    columns={
                                        [
                                            {
                                                title: 'Nom',
                                                dataIndex: 'nom'
                                            },
                                            {
                                                title: 'Type',
                                                dataIndex: 'elementType',
                                                render: value => (
                                                    <>
                                                        {value === TYPE_ANALYSE_DATA_ELEMENT && 'Data Element'}
                                                        {value === TYPE_ANALYSE_INDICATOR && 'Indicateur'}
                                                    </>
                                                )
                                            },
                                            {
                                                title: 'Actions',
                                                dataIndex: 'action',
                                                width: '80px',
                                                render: value => (
                                                    <>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <Popconfirm
                                                                title="Suppression de la configuration"
                                                                description="Voulez-vous vraiment supprimer cette configuration "
                                                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                                onConfirm={() => handleDeleteAnalyseConfig(value)}
                                                            >
                                                                <RiDeleteBinLine style={{ color: 'red', fontSize: '16px', cursor: 'pointer', marginLeft: '5px' }} />
                                                            </Popconfirm>
                                                        </div>
                                                    </>
                                                )
                                            },
                                        ]
                                    }
                                    size="small"
                                />
                            </div>
                        )
                    }
                </Col>
            </Row>
        </>
    )

    const RenderTypeSupervisionContent = () => (
        <div>
            <Row gutter={[8, 8]}>
                <Col md={4} sm={24}>
                    <div style={{ marginBottom: '2px', position: 'sticky', top: 30 }}>
                        <div className={`setting-menu-item ${selectedTypeSupervisionPage === PAGE_CONFIG_INDICATORS ? 'active' : ''}`} onClick={() => handleClickConfigMenu(PAGE_CONFIG_INDICATORS)} >
                            Configuration des indicateurs
                        </div>
                        <div className={`setting-menu-item ${selectedTypeSupervisionPage === PAGE_CONFIG_SUPERVISION ? 'active' : ''}`} onClick={() => handleClickConfigMenu(PAGE_CONFIG_SUPERVISION)}>
                            Paramètre des supervisions
                        </div>
                        <div className={`setting-menu-item ${selectedTypeSupervisionPage === PAGE_CONFIG_ANALYSE ? 'active' : ''}`} onClick={() => handleClickConfigMenu(PAGE_CONFIG_ANALYSE)}>
                            Analyses
                        </div>
                    </div>
                </Col>
                <Col md={20} sm={24}>
                    {selectedTypeSupervisionPage === PAGE_CONFIG_INDICATORS && RenderPageIndicatorConfig()}
                    {selectedTypeSupervisionPage === PAGE_CONFIG_SUPERVISION && RenderPageSupervisionConfig()}
                    {selectedTypeSupervisionPage === PAGE_CONFIG_ANALYSE && RenderPageAnalyseConfig()}
                </Col>
            </Row>
        </div>
    )

    const RenderContent = () => (
        <>
            <div
                style={{
                    width: '100%',
                    position: 'sticky',
                    top: 0
                }}
            >
                <TabBar>
                    <Tab selected={renderPage === PAGE_CONFIGURATION_TYPE_SUPERVISIONS} onClick={_ => setRenderPage(PAGE_CONFIGURATION_TYPE_SUPERVISIONS)}>
                        Type de supervisions
                    </Tab>

                    <Tab selected={renderPage === PAGE_CONFIGURATION_USER_AUTHORIZATIONS} onClick={_ => setRenderPage(PAGE_CONFIGURATION_USER_AUTHORIZATIONS)}>
                        Authorisations des utilisateurs
                    </Tab>
                </TabBar>
                <div style={{ padding: '20px', marginTop: '20px' }}>
                    {renderPage === PAGE_CONFIGURATION_TYPE_SUPERVISIONS && RenderTypeSupervisionContent()}
                    {renderPage === PAGE_CONFIGURATION_USER_AUTHORIZATIONS && RenderUserAuthorizationContent()}
                </div>
            </div>
        </>
    )


    useEffect(() => {
        loadPrograms()
        // loadDatastoreIndConf()
        // loadDatastoreSupConf()
        // loadDatastoreDataElementConf()
    }, [])

    useEffect(() => {
        currentItem && initUpdateIndicatorConfigStage()
    }, [currentItem, indicatorGroups, programs])

    return (
        <>
            {RenderTopContent()}
            {RenderContent()}
            <MyNotification notification={notification} setNotification={setNotification} />
        </>
    )
}


export default Setting