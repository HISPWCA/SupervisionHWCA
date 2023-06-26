import { useEffect, useState } from 'react'
import { Button, Radio, Tab, TabBar } from "@dhis2/ui"
import { AGGREGATE_INDICATOR, NOTIFICATON_CRITICAL, NOTIFICATON_SUCCESS, INDICATOR_GROUP, PAGE_CONFIGURATION_TYPE_SUPERVISIONS, PAGE_CONFIGURATION_USER_AUTHORIZATIONS, PAGE_CONFIG_INDICATORS, PAGE_CONFIG_SUPERVISION, PAGPE_CONFIGURATION_INDICATEURS, PROGRAM_INDICATOR, TYPE_GENERATION_AS_ENROLMENT, TYPE_GENERATION_AS_EVENT, TYPE_GENERATION_AS_TEI, PAGE_SUPERVISIONS, TYPE_ANALYSE_DATA_ELEMENT, PAGE_CONFIG_ANALYSE, TYPE_ANALYSE_INDICATOR, ORGANISATION_UNIT, AGENT } from "../utils/constants"
import { Card, Checkbox, Col, Divider, Input, InputNumber, Popconfirm, Row, Select, Table } from 'antd'
import { DATA_ELEMENTS_ROUTE, INDICATORS_GROUP_ROUTE, INDICATORS_ROUTE, PROGRAMS_ROUTE, PROGRAMS_STAGE_ROUTE, PROGRAM_INDICATOR_GROUPS } from '../utils/api.routes'
import axios from 'axios'
import { v1 as uuid } from 'uuid'
import { FiSave } from 'react-icons/fi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { FiEdit } from 'react-icons/fi'
import { MdOutlineCancel } from 'react-icons/md'
import { loadDataStore, saveDataToDataStore } from '../utils/functions'
import { BLUE } from '../utils/couleurs'
import { CgCloseO } from 'react-icons/cg'
import MyNotification from './MyNotification'
import translate from '../utils/translator'


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
    const [paymentConfigList, setPaymentConfigList] = useState([])
    const [isEditModePayment, setEditModePayment] = useState(false)
    const [currentPaymentConfig, setCurrentPaymentConfig] = useState(null)

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
    const [selectedStatutSupervisionProgramStage, setSelectedStatutSupervisionProgramStage] = useState(null)
    const [selectedStatutPaymentProgramStage, setSelectedStatutPaymentProgramStage] = useState(null)
    const [selectedStatutSupervisionDataElement, setSelectedStatutSupervisionDataElement] = useState(null)
    const [selectedStatutPaymentDataElement, setSelectedStatutPaymentDataElement] = useState(null)
    const [selectedDataElements, setSelectedDataElements] = useState([])
    const [selectedAttributesToDisplay, setSelectedAttributesToDisplay] = useState([])

    const [selectedPlanificationType, setSelectedPlanificationType] = useState(ORGANISATION_UNIT)
    const [selectedAttributeNameForAgent, setSelectedAttributeNameForAgent] = useState(null)
    const [selectedAttributeFirstNameForAgent, setSelectedAttributeFirstNameForAgent] = useState(null)

    const [inputLibellePayment, setInputLibellePayment] = useState('')
    const [inputMontantConstantPayment, setInputMontantConstantPayment] = useState(0)
    const [inputFraisMobileMoneyPayment, setInputFraisMobileMoneyPayment] = useState(0)

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
        setSelectedStatutSupervisionProgramStage(null)
        setSelectedStatutSupervisionDataElement(null)
        setSelectedStatutPaymentProgramStage(null)
        setSelectedStatutPaymentDataElement(null)
        setSelectedAttributesToDisplay([])
        setPaymentConfigList([])
        setCurrentPaymentConfig(null)
        setSelectedPlanificationType(ORGANISATION_UNIT)
        setSelectedAttributesToDisplay([])
        setSelectedAttributeNameForAgent(null)
        setSelectedAttributeFirstNameForAgent(null)
        setSelectedTEIProgram(programs.find(p => p.id === value))
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

    const handleSupervisionPlanificationType = ({ value }) => {
        setSelectedPlanificationType(value)
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
                setNotification({ show: true, message: translate('Suppression_Effectuee'), type: NOTIFICATON_SUCCESS })
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
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })

        }
    }

    const initSupConfigStates = async () => {
        try {
            setCurrentItem(null)
            setMappingConfigs([])
            setDataElements([])
            setIndicators([])
            setSelectedAttributesToDisplay([])
            setAnalyseConfigs([])
            setMappingConfigSupervisions([])
            setSelectedTEIProgram(null)
            setSelectedSupervisionGenerationType(TYPE_GENERATION_AS_TEI)
            setSelectedIndicatorType(PROGRAM_INDICATOR)
            setSelectedIndicatorGroup(null)
            setSelectedIndicator(null)

            const responseSupervisionTracker = await loadDataStore(process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY, null, null, null)
            setMappingConfigSupervisions(responseSupervisionTracker)
        } catch (err) {
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const cleanPaymentConfigState = () => {
        setEditModePayment(false)
        setInputFraisMobileMoneyPayment(0)
        setInputMontantConstantPayment(0)
        setInputLibellePayment('')
        setPaymentConfigList([])
        setCurrentPaymentConfig(null)
    }

    const handleDeleteSupervisionConfig = async (item) => {
        try {
            if (item) {
                const existingDXMappingOfPrograms = mappingConfigs.filter(mConfig => mConfig?.program?.id === item?.program?.id) || []

                if (existingDXMappingOfPrograms.length > 0)
                    throw new Error(translate('Configuration_Deja_Mapper'))

                const newList = mappingConfigSupervisions.filter(mapConf => mapConf.id !== item.id)
                await saveDataToDataStore(process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY, newList, null, null, null)
                setMappingConfigSupervisions(newList)
                setNotification({ show: true, message: translate('Suppression_Effectuee'), type: NOTIFICATON_SUCCESS })

                setFieldEditingMode(false)
                setSelectedTEIProgram(null)
                setSelectedProgramStage(null)
                setSelectedDataElements([])
                setSelectedStatutSupervisionProgramStage(null)
                setSelectedStatutSupervisionDataElement(null)
                setSelectedStatutPaymentProgramStage(null)
                setSelectedStatutPaymentDataElement(null)
                setSelectedSupervisionGenerationType(TYPE_GENERATION_AS_TEI)
                setSelectedPlanificationType(ORGANISATION_UNIT)
                setSelectedAttributesToDisplay([])
                setSelectedAttributeNameForAgent(null)
                setSelectedAttributeFirstNameForAgent(null)
                cleanPaymentConfigState()
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
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const handleSaveSupConfig = async () => {
        try {
            setLoadingSaveSupervionsConfig(true)

            if (!selectedTEIProgram)
                throw new Error(translate('Veuillez_Selectionner_Un_Programme'))

            if (selectedPlanificationType === AGENT) {
                if (selectedAttributesToDisplay.length === 0)
                    throw new Error(translate('Veuillez_Configurer_Attribut_A_Utiliser'))

                if (!selectedAttributeNameForAgent)
                    throw new Error(translate('Attribute_Nom'))

                if (!selectedAttributeFirstNameForAgent)
                    throw new Error(translate('Attribute_Prenom'))
            }

            if (selectedTEIProgram && selectedSupervisionGenerationType) {
                const existingConfig = mappingConfigSupervisions.find(mapping => mapping.program?.id === selectedTEIProgram.id)

                if (existingConfig && !isFieldEditingMode)
                    throw new Error(translate('Configuration_Deja_Ajoutee'))

                if (!existingConfig && isFieldEditingMode)
                    throw new Error(translate('Programme_Introuvable'))

                const payload = {
                    generationType: selectedSupervisionGenerationType,
                    planificationType: selectedPlanificationType,
                    program: { id: selectedTEIProgram.id, displayName: selectedTEIProgram.displayName },
                    attributesToDisplay: selectedPlanificationType === AGENT && selectedAttributesToDisplay || [],
                    attributeName: selectedPlanificationType === AGENT && selectedAttributeNameForAgent,
                    attributeFirstName: selectedPlanificationType === AGENT && selectedAttributeFirstNameForAgent,
                    fieldConfig: null,
                    statusSupervision: null,
                    statusPayment: null,
                    paymentConfigs: paymentConfigList
                }

                if (selectedProgramStage && selectedDataElements.length > 0) {
                    payload.fieldConfig = {
                        supervisor: {
                            programStage: { id: selectedProgramStage.id, displayName: selectedProgramStage.displayName },
                            dataElements: selectedDataElements
                        }
                    }
                }

                if (selectedStatutSupervisionProgramStage && selectedStatutSupervisionDataElement) {
                    payload.statusSupervision = {
                        programStage: { id: selectedStatutSupervisionProgramStage.id, displayName: selectedStatutSupervisionProgramStage.displayName },
                        dataElement: selectedStatutSupervisionDataElement
                    }
                }

                if (selectedStatutPaymentProgramStage && selectedStatutPaymentDataElement && selectedPlanificationType === AGENT) {
                    payload.statusPayment = {
                        programStage: { id: selectedStatutPaymentProgramStage.id, displayName: selectedStatutPaymentProgramStage.displayName },
                        dataElement: selectedStatutPaymentDataElement
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

                await saveDataToDataStore(process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY, newList, setLoadingSaveSupervionsConfig, null, null)

                setMappingConfigSupervisions(newList)
                setSelectedTEIProgram(null)
                setSelectedStatutSupervisionProgramStage(null)
                setSelectedStatutSupervisionDataElement(null)
                setSelectedStatutPaymentProgramStage(null)
                setSelectedStatutPaymentDataElement(null)
                setSelectedProgramStage(null)
                setFieldEditingMode(false)
                setSelectedDataElements([])
                setSelectedAttributesToDisplay([])
                setLoadingSaveSupervionsConfig(false)
                cleanPaymentConfigState()
                setNotification({ show: true, type: NOTIFICATON_SUCCESS, message: isFieldEditingMode ? translate('Mise_A_Jour_Effectuer') : translate('Configuration_Ajoutee') })
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
                throw new Error(translate('Nom_Obligatoire'))

            if (!indicatorEtiquette?.trim())
                throw new Error(translate('Etiquette_Obligatoire'))

            if (indicatorWeight === undefined || indicatorWeight === null)
                throw new Error(translate('Poid_Obligatoire'))

            if (indicatorName && indicatorEtiquette) {
                const existingConfig = mappingConfigs.find(mapping => mapping.indicator?.id === selectedIndicator?.id)

                if (!currentItem && existingConfig)
                    throw new Error(translate('Indicateur_Deja_Configurer'))

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
                setNotification({ show: true, message: !currentItem ? translate('Configuration_Ajoutee') : translate('Mise_A_Jour_Succes'), type: NOTIFICATON_SUCCESS })
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
                setNotification({ show: true, message: translate('Suppression_Effectuee'), type: NOTIFICATON_SUCCESS })
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
                throw new Error(translate("Element_De_Donner_Obligatoire"))

            if (selectedAnalyseType === TYPE_ANALYSE_INDICATOR && !selectedAnalyseIndicator)
                throw new Error(translate('Indicateur_Obligatoire'))

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
                setNotification({ show: true, type: NOTIFICATON_SUCCESS, message: translate('Configuration_Ajoutee') })
                return setLoadingAddAnalyseConfigs(false)
            } else {
                throw new Error(translate('Configuration_Deja_Ajoutee'))
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

    const handleSelectStatutSupervisionDataElement = (value) => {
        setSelectedStatutSupervisionDataElement(selectedStatutSupervisionProgramStage.programStageDataElements?.map(p => p.dataElement).find(dataElement => dataElement.id === value))
    }

    const handleSelectStatutSupervisionProgramStage = (value) => {
        setSelectedStatutSupervisionProgramStage(programStages.find(pstage => pstage.id === value))
        setSelectedStatutSupervisionDataElement(null)
    }

    const handleSelectStatutPaymentDataElement = (value) => {
        setSelectedStatutPaymentDataElement(selectedStatutPaymentProgramStage.programStageDataElements?.map(p => p.dataElement).find(dataElement => dataElement.id === value))
    }

    const handleSelectStatutPaymentProgramStage = (value) => {
        setSelectedStatutPaymentProgramStage(programStages.find(pstage => pstage.id === value))
        setSelectedStatutPaymentDataElement(null)
    }

    const RenderSupervisorFieldConfiguration = () => (
        <div style={{ marginTop: '20px' }}>
            <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size='small'>
                <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                    <div style={{ fontWeight: 'bold' }}>
                        {translate('Configuration_Champ_Supervision')}
                    </div>
                    <div style={{ marginTop: '10px', color: '#00000080', fontSize: '13px' }}>
                        {translate('Aide_Configuration_Supervision')}
                    </div>
                </div>
                <div style={{ padding: '10px' }}>
                    <Row gutter={[10, 10]}>
                        <Col md={12}>
                            <div>
                                <div style={{ marginBottom: '5px' }}>{translate('Programmes_Stage')}</div>
                                <Select
                                    options={programStages.map(programStage => ({ label: programStage.displayName, value: programStage.id }))}
                                    placeholder={translate('Programmes_Stage')}
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
                                        <div style={{ marginBottom: '5px' }}>{translate('Element_Donne')}</div>
                                        <Select
                                            options={selectedProgramStage?.programStageDataElements?.map(progStageDE => ({ label: progStageDE.dataElement?.displayName, value: progStageDE.dataElement?.id }))}
                                            placeholder={translate('Element_Donne')}
                                            style={{ width: '100%' }}
                                            mode="multiple"
                                            onChange={handleSelectDataElements}
                                            value={selectedDataElements?.map(s => s.id)}
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
                    <div style={{ marginBottom: '5px' }}>{translate('Programmes_Tracker')}</div>
                    <Select
                        options={programs.map(program => ({ label: program.displayName, value: program.id }))}
                        loading={loadingPrograms}
                        showSearch
                        placeholder={translate('Programmes_Tracker')}
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
                            label={translate('Generer_Supervision_Comme_TEI')}
                            onChange={handleSupervisionGenerationType}
                            value={TYPE_GENERATION_AS_TEI}
                            checked={selectedSupervisionGenerationType === TYPE_GENERATION_AS_TEI}
                        />
                    </div>
                    <div style={{ marginTop: '5px' }}>
                        <Radio
                            label={translate('Generer_Supervision_Comme_EN')}
                            onChange={handleSupervisionGenerationType}
                            value={TYPE_GENERATION_AS_ENROLMENT}
                            checked={selectedSupervisionGenerationType === TYPE_GENERATION_AS_ENROLMENT}
                        />
                    </div>
                    <div style={{ marginTop: '5px' }}>
                        <Radio
                            label={translate('Generer_Supervision_Comme_EV')}
                            onChange={handleSupervisionGenerationType}
                            value={TYPE_GENERATION_AS_EVENT}
                            checked={selectedSupervisionGenerationType === TYPE_GENERATION_AS_EVENT}
                        />
                    </div>
                </div>

                {
                    selectedTEIProgram && (
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ fontWeight: 'bold' }}>{translate('Planifier_Sur_OrgUnit_Ou_Agent')}</div>
                            <div style={{ marginTop: '10px' }}>
                                <div >
                                    <Radio
                                        label={translate('Unite_Organisation')}
                                        onChange={handleSupervisionPlanificationType}
                                        value={ORGANISATION_UNIT}
                                        checked={selectedPlanificationType === ORGANISATION_UNIT}
                                    />
                                </div>
                                <div >
                                    <Radio
                                        label={translate('Agent')}
                                        onChange={handleSupervisionPlanificationType}
                                        value={AGENT}
                                        checked={selectedPlanificationType === AGENT}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )

    const handleEditProgramSup = async (prog) => {
        try {
            cleanPaymentConfigState()

            setSelectedTEIProgram(programs.find(p => p.id === prog.program?.id))
            const programStageList = await loadProgramStages(prog?.program?.id)

            setSelectedProgramStage(programStageList.find(psg => psg.id === prog.fieldConfig?.supervisor?.programStage.id))
            setSelectedDataElements(prog?.fieldConfig?.supervisor?.dataElements || [])
            setSelectedStatutSupervisionProgramStage(programStageList.find(psg => psg.id === prog.statusSupervision?.programStage?.id))
            setSelectedStatutSupervisionDataElement(prog?.statusSupervision?.dataElement)
            setSelectedStatutPaymentProgramStage(programStageList.find(psg => psg.id === prog.statusPayment?.programStage?.id))
            setSelectedStatutPaymentDataElement(prog?.statusPayment?.dataElement)
            setSelectedAttributesToDisplay(prog.attributesToDisplay || [])
            setSelectedAttributeNameForAgent(prog.attributeName)
            setSelectedAttributeFirstNameForAgent(prog.attributeFirstName)
            setSelectedSupervisionGenerationType(prog?.generationType)
            setSelectedPlanificationType(prog.planificationType)
            setPaymentConfigList(prog?.paymentConfigs || [])
            setFieldEditingMode(true)
        } catch (err) {
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const handleChangeProgramAttributeToDisplay = (values) => {
        setSelectedAttributesToDisplay(values.map(v => selectedTEIProgram.programTrackedEntityAttributes.map(p => p.trackedEntityAttribute).find(att => att.id === v)))
    }

    const handleSelectProgramAttributeNameForAgent = (value) => {
        setSelectedAttributeNameForAgent(selectedTEIProgram.programTrackedEntityAttributes.map(p => p.trackedEntityAttribute).find(att => att.id === value))
    }

    const handleSelectProgramAttributeFirstNameForAgent = (value) => {
        setSelectedAttributeFirstNameForAgent(selectedTEIProgram.programTrackedEntityAttributes.map(p => p.trackedEntityAttribute).find(att => att.id === value))
    }

    const RenderAttributesToDisplay = () => (
        <div style={{ marginTop: '20px' }}>
            <Card className="my-shadow" size='small'>
                <div>
                    <div style={{ fontWeight: 'bold' }}>{translate('Configuration_Des_Attributes')}</div>
                    <Divider style={{ margin: '5px 0px' }} />
                    <div style={{ fontWeight: 'bold' }}>{translate('Attributs')}</div>
                    <div style={{ color: '#00000080', fontSize: '13px' }}>
                        {translate('Aide_Attribute_Configurer')}
                    </div>
                    <div style={{ marginTop: '2px' }}>
                        <Select
                            options={selectedTEIProgram.programTrackedEntityAttributes.map(p => p.trackedEntityAttribute).map(attribute => ({ label: attribute.displayName, value: attribute.id }))}
                            placeholder={translate('Program_Stage')}
                            style={{ width: '100%' }}
                            optionFilterProp='label'
                            value={selectedAttributesToDisplay.map(att => att.id)}
                            onChange={handleChangeProgramAttributeToDisplay}
                            showSearch
                            allowClear
                            mode='multiple'
                            loading={loadingPrograms}
                            disabled={loadingPrograms}
                        />
                    </div>
                    <Divider style={{ margin: '10px 0px' }} />
                    <div style={{ color: '#00000080', fontSize: '13px' }}>
                        {translate('Attribute_Representant_Nom_Et_Prenom')}
                    </div>
                    <div style={{ marginTop: '5px' }}>
                        <Row gutter={[10, 10]}>
                            <Col md={12}>
                                <div style={{ marginBottom: '2px', fontWeight: 'bold' }}>{translate('Nom_Agent')}</div>
                                <div>
                                    <Select
                                        options={selectedTEIProgram.programTrackedEntityAttributes.map(p => p.trackedEntityAttribute).map(attribute => ({ label: attribute.displayName, value: attribute.id }))}
                                        placeholder={translate('Nom_Agent')}
                                        style={{ width: '100%' }}
                                        optionFilterProp='label'
                                        value={selectedAttributeNameForAgent?.id}
                                        onChange={handleSelectProgramAttributeNameForAgent}
                                        showSearch
                                        allowClear
                                        loading={loadingPrograms}
                                        disabled={loadingPrograms}
                                    />
                                </div>
                            </Col>
                            <Col md={12}>
                                <div style={{ marginBottom: '2px', fontWeight: 'bold' }}>{translate('Prenom_Agent')}</div>
                                <div>
                                    <Select
                                        options={selectedTEIProgram.programTrackedEntityAttributes.map(p => p.trackedEntityAttribute).map(attribute => ({ label: attribute.displayName, value: attribute.id }))}
                                        placeholder={translate('Prenom_Agent')}
                                        style={{ width: '100%' }}
                                        optionFilterProp='label'
                                        value={selectedAttributeFirstNameForAgent?.id}
                                        onChange={handleSelectProgramAttributeFirstNameForAgent}
                                        showSearch
                                        allowClear
                                        loading={loadingPrograms}
                                        disabled={loadingPrograms}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>

                </div>
            </Card>
        </div>
    )

    const RenderStatusSupervisionDataElementToUse = () => (
        <div style={{ marginTop: '20px' }}>
            <Card className="my-shadow" size='small'>
                <div>
                    <div style={{ fontWeight: 'bold' }}>{translate('Configuration_Element')}</div>
                    <div style={{ marginTop: '10px', color: '#00000080', fontSize: '13px' }}>
                        {translate('Aide_Config_Element')}
                    </div>
                    <div style={{ margin: '10px 0px' }}>
                        <Row gutter={[10, 10]}>
                            <Col md={12}>
                                <div>
                                    <div style={{ marginBottom: '5px' }}>{translate('Programmes_Stage')}</div>
                                    <Select
                                        options={programStages.map(programStage => ({ label: programStage.displayName, value: programStage.id }))}
                                        placeholder={translate('Programmes_Stage')}
                                        style={{ width: '100%' }}
                                        optionFilterProp='label'
                                        value={selectedStatutSupervisionProgramStage?.id}
                                        onChange={handleSelectStatutSupervisionProgramStage}
                                        showSearch
                                        allowClear
                                        loading={loadingProgramStages}
                                        disabled={loadingProgramStages}
                                    />
                                </div>
                            </Col>
                            {
                                selectedStatutSupervisionProgramStage && (
                                    <Col md={12} xs={24}>
                                        <div>
                                            <div style={{ marginBottom: '5px' }}>{translate('Elements_De_Donnees')}</div>
                                            <Select
                                                options={selectedStatutSupervisionProgramStage?.programStageDataElements?.map(progStageDE => ({ label: progStageDE.dataElement?.displayName, value: progStageDE.dataElement?.id }))}
                                                placeholder={translate('Elements_De_Donnees')}
                                                style={{ width: '100%' }}
                                                onChange={handleSelectStatutSupervisionDataElement}
                                                value={selectedStatutSupervisionDataElement?.id}
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
                </div>
            </Card>
        </div>
    )

    const handleAddPaymentConfig = () => {
        try {
            if (!inputLibellePayment)
                throw new Error(translate('Libelle_Obligatoire'))

            if (!isEditModePayment && paymentConfigList.map(conf => conf.libelle?.trim()?.toLowerCase()).includes(inputLibellePayment?.trim()?.toLowerCase()))
                throw new Error(translate('Configuration_Deja_Ajoutee'))


            let payload = {
                libelle: inputLibellePayment,
                fraisMobileMoney: inputFraisMobileMoneyPayment,
                montantConstant: inputMontantConstantPayment,
                program: { id: selectedTEIProgram?.id, displayName: selectedTEIProgram?.displayName }
            }

            if (isEditModePayment && currentPaymentConfig) {
                setPaymentConfigList(paymentConfigList.map(paiement => paiement.id === currentPaymentConfig.id ? payload : paiement))
            } else {
                payload.id = uuid()
                setPaymentConfigList([...paymentConfigList, payload])
            }

            setCurrentPaymentConfig(null)
            setEditModePayment(false)
            setInputFraisMobileMoneyPayment(0)
            setInputMontantConstantPayment(0)
            setInputLibellePayment('')
            setNotification({ show: true, message: isEditModePayment ? translate('Paiement_Mise_A_Jour') : translate('Paiement_Ajouter'), type: NOTIFICATON_SUCCESS })

        } catch (err) {
            setNotification({ show: true, message: err.message, type: NOTIFICATON_CRITICAL })
        }

    }

    const RenderStatusPaymentDataElementToUse = () => (
        <div style={{ marginTop: '20px' }}>
            <Card className="my-shadow" size='small'>
                <div>
                    <div style={{ fontWeight: 'bold' }}>{translate('Configuration_Des_Paiements')}</div>
                    <div>
                        <Row gutter={[10, 10]}>
                            <Col md={24}>
                                <Divider style={{ margin: '5px 0px' }} />
                            </Col>
                            <Col md={24}>
                                <div style={{ fontWeight: 'bold' }}>{translate('Status_Paiement')}</div>
                                <div style={{ marginTop: '5px', color: '#00000080', fontSize: '13px' }}>
                                    {translate('Aide_Configuration_Paiement')}
                                </div>
                            </Col>
                            <Col md={12}>
                                <div>
                                    <div style={{ marginBottom: '5px' }}>{translate('Programmes_Stage')}</div>
                                    <Select
                                        options={programStages.map(programStage => ({ label: programStage.displayName, value: programStage.id }))}
                                        placeholder={translate('Programmes_Stage')}
                                        style={{ width: '100%' }}
                                        optionFilterProp='label'
                                        value={selectedStatutPaymentProgramStage?.id}
                                        onChange={handleSelectStatutPaymentProgramStage}
                                        showSearch
                                        allowClear
                                        loading={loadingProgramStages}
                                        disabled={loadingProgramStages}
                                    />
                                </div>
                            </Col>
                            {
                                selectedStatutPaymentProgramStage && (
                                    <Col md={12} xs={24}>
                                        <div>
                                            <div style={{ marginBottom: '5px' }}>{translate('Elements_De_Donnees')}</div>
                                            <Select
                                                options={selectedStatutPaymentProgramStage?.programStageDataElements?.map(progStageDE => ({ label: progStageDE.dataElement?.displayName, value: progStageDE.dataElement?.id }))}
                                                placeholder={translate('Element_De_Donnee')}
                                                style={{ width: '100%' }}
                                                onChange={handleSelectStatutPaymentDataElement}
                                                value={selectedStatutPaymentDataElement?.id}
                                                optionFilterProp='label'
                                                showSearch
                                                allowClear
                                            />
                                        </div>
                                    </Col>
                                )
                            }
                            <Col md={24}>
                                <Divider style={{ margin: '5px 0px' }} />
                            </Col>
                            <Col md={24}>
                                <div style={{ fontWeight: 'bold' }}>{translate('Paiement')}</div>
                            </Col>
                            <Col sm={24} md={8}>
                                <div>{translate('Libelle')}</div>
                                <div style={{ marginTop: '2px' }}>
                                    <Input value={inputLibellePayment} onChange={event => setInputLibellePayment(event.target.value)} placeholder={translate('Libelle')} style={{ width: '100%' }} />
                                </div>
                            </Col>

                            <Col sm={24} md={6}>
                                <div>{translate('Montant_Constant')}</div>
                                <div style={{ marginTop: '2px' }}>
                                    <InputNumber value={inputMontantConstantPayment} onChange={value => setInputMontantConstantPayment(value)} placeholder={translate('Montant_Constant')} style={{ width: '100%' }} />
                                </div>
                            </Col>
                            <Col sm={24} md={6}>
                                <div>{translate('Frais_Mobile_Money')}</div>
                                <div style={{ marginTop: '2px' }}>
                                    <InputNumber onChange={value => setInputFraisMobileMoneyPayment(value || 0)} value={inputFraisMobileMoneyPayment} placeholder='Frais Mobile Money' style={{ width: '100%' }} />
                                </div>
                            </Col>
                            <Col sm={24} md={4}>
                                <div style={{ marginTop: '25px' }}>
                                    <Button small primary onClick={handleAddPaymentConfig}>
                                        {!isEditModePayment ? `+ ${translate('Ajouter')}` : translate('Mise_A_Jour')}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Card>
        </div>
    )

    const handleEditPaymentConfig = config => {
        setInputFraisMobileMoneyPayment(config.fraisMobileMoney)
        setInputMontantConstantPayment(config.montantConstant)
        setInputLibellePayment(config.libelle)
        setCurrentPaymentConfig(config)
        setEditModePayment(true)
    }

    const handleDeletePaymentConfig = value => {
        cleanPaymentConfigState()
        setPaymentConfigList(paymentConfigList.filter(p => p.id !== value.id))

        return setNotification({ show: true, message: translate('Configuration_Supprimer'), type: NOTIFICATON_SUCCESS })
    }

    const RenderPageSupervisionConfig = () => (
        <>
            <Row gutter={[8, 10]}>
                <Col md={12} sm={24}>
                    <div >
                        {RenderSupervisionConfiguration()}
                        {selectedTEIProgram && selectedTEIProgram.programTrackedEntityAttributes && selectedPlanificationType === AGENT && RenderAttributesToDisplay()}
                        {selectedTEIProgram && selectedPlanificationType === AGENT && RenderStatusPaymentDataElementToUse()}
                        {selectedTEIProgram && RenderStatusSupervisionDataElementToUse()}
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
                                            setSelectedStatutSupervisionProgramStage(null)
                                            setSelectedStatutSupervisionDataElement(null)
                                            setSelectedStatutPaymentProgramStage(null)
                                            setSelectedStatutPaymentDataElement(null)
                                            setSelectedDataElements([])
                                            setSelectedAttributesToDisplay([])
                                            setSelectedSupervisionGenerationType(TYPE_GENERATION_AS_TEI)
                                        }}
                                    >
                                        {translate('Annuler')}
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
                                    {isFieldEditingMode && <span>{translate('Mise_A_Jour')}</span>}
                                    {!isFieldEditingMode && <span>{translate('Enregistrer')}</span>}
                                </Button>
                            </div>
                        </div>

                    </div>
                </Col>
                <Col md={12} sm={24}>
                    {
                        mappingConfigSupervisions.length > 0 && (
                            <div className='my-shadow' style={{ padding: '20px', background: '#FFF', marginBottom: '2px', borderRadius: '8px' }}>
                                <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>{translate('Liste_Programme_Tracker')} </div>
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
                                                title: translate('Programme'),
                                                dataIndex: 'programName'
                                            },

                                            {
                                                title: translate('Type_Strategie'),
                                                dataIndex: 'generationType',
                                                render: value => (
                                                    <>
                                                        {value === TYPE_GENERATION_AS_ENROLMENT && translate('Enrolements')}
                                                        {value === TYPE_GENERATION_AS_EVENT && translate('Evenements')}
                                                        {value === TYPE_GENERATION_AS_TEI && translate('Teis')}
                                                    </>
                                                )
                                            },
                                            {
                                                title: translate('Actions'),
                                                dataIndex: 'action',
                                                width: '80px',
                                                render: value => (
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{ marginRight: '10px' }}>
                                                            <FiEdit style={{ color: BLUE, fontSize: '18px', cursor: 'pointer' }} onClick={() => handleEditProgramSup(value)} />
                                                        </div>
                                                        <Popconfirm
                                                            title={translate('Suppression_Configuration')}
                                                            description={translate('Confirmation_Suppression_Configuration')}
                                                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                            onConfirm={() => handleDeleteSupervisionConfig(value)}
                                                        >
                                                            <div>
                                                                <RiDeleteBinLine style={{ color: 'red', fontSize: '18px', cursor: 'pointer' }} />
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

                    {
                        selectedPlanificationType === AGENT && selectedTEIProgram && paymentConfigList.length > 0 && (
                            <div className='my-shadow' style={{ padding: '20px', marginTop: '10px', background: '#FFF', marginBottom: '2px', borderRadius: '8px' }}>
                                <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>{translate('Liste_Config_Paiement')}</div>
                                <Table
                                    dataSource={
                                        paymentConfigList.map(conf => ({
                                            ...conf,
                                            programName: conf.program?.displayName,
                                            action: conf
                                        }))
                                    }
                                    columns={
                                        [
                                            { title: translate('Programme'), dataIndex: 'programName' },

                                            { title: translate('Libelle'), dataIndex: 'libelle' },
                                            { title: translate('Montant_Constant'), dataIndex: 'montantConstant' },
                                            { title: translate('Frais_Mobile_Money'), dataIndex: 'fraisMobileMoney' },
                                            {
                                                title: translate('Actions'),
                                                dataIndex: 'action',
                                                width: '80px',
                                                render: value => (
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{ marginRight: '10px' }}>
                                                            <FiEdit style={{ color: BLUE, fontSize: '18px', cursor: 'pointer' }} onClick={() => handleEditPaymentConfig(value)} />
                                                        </div>
                                                        <Popconfirm
                                                            title={translate('Suppression_Configuration')}
                                                            description={translate('Confirmation_Suppression_Configuration')}
                                                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                            onConfirm={() => handleDeletePaymentConfig(value)}
                                                        >
                                                            <div>
                                                                <RiDeleteBinLine style={{ color: 'red', fontSize: '18px', cursor: 'pointer' }} />
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
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{translate('Parametre_De_Configuration')}</span>
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
                                    <div style={{ marginBottom: '5px' }}>{translate('Type_Indicateur')}</div>
                                </Col>
                                <Col>
                                    <div>
                                        <Radio
                                            label={translate('Indicateurs_Aggreges')}
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
                                            label={translate('Indicateurs_Programmes')}
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
                                                <div style={{ marginBottom: '5px' }}>{translate('Groupe_Indicateurs')}</div>
                                                <Select
                                                    options={indicatorGroups.map(indicateurGroup => ({ label: indicateurGroup.displayName, value: indicateurGroup.id }))}
                                                    placeholder={translate('Groupe_Indicateurs')}
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
                                                        <div style={{ marginBottom: '5px' }}>{translate('Indicateurs')}</div>
                                                        <Select
                                                            options={selectedIndicatorGroup.indicators?.map(progInd => ({ label: progInd.displayName, value: progInd.id }))}
                                                            placeholder={translate('Indicateurs')}
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
                                                <div style={{ marginBottom: '5px' }}>{translate('Programmes')}</div>
                                                <Select
                                                    options={programs.map(program => ({ label: program.displayName, value: program.id }))}
                                                    placeholder={translate('Programmes')}
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
                                                        <div style={{ marginBottom: '5px' }}>{translate('Indicateurs')}</div>
                                                        <Select
                                                            options={selectedProgram.programIndicators?.map(progInd => ({ label: progInd.displayName, value: progInd.id }))}
                                                            placeholder={translate('Indicateurs')}
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
                                        <div style={{ marginBottom: '5px' }}>{translate('Nom')}</div>
                                        <Input name='indicatorName' value={indicatorName} disabled />
                                    </Col>
                                    <Col md={12} sm={24}>
                                        <div style={{ marginBottom: '5px' }}>{translate('Etiquette')}</div>
                                        <Input name='indicatorName' value={indicatorEtiquette} onChange={event => setIndicatorEtiquette(''.concat(event.target.value))} />
                                    </Col>
                                    <Col md={12} sm={24}>
                                        <div style={{ marginBottom: '5px' }}>{translate('Poids')}</div>
                                        <InputNumber style={{ width: '100%' }} name='indicatorName' value={indicatorWeight} onChange={event => setIndicatorWeight(event)} />
                                    </Col>
                                    <Col md={12}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '25px' }}>
                                            <Checkbox checked={indicatorBestPositive} onChange={() => setIndicatorBestPositive(!indicatorBestPositive)} />
                                            <span style={{ marginLeft: '10px' }}> {translate('Meilleur_Positif')}</span>
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
                                                        >{translate('Enregistrer')}</Button>
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
                                                        >{translate('Annuler')}</Button>
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
                                                        >{translate('Mise_A_Jour')}</Button>
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
                                <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>{translate('Liste_Indicateurs_Configurer')}</div>
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
                                                title: translate('Indicateurs'),
                                                dataIndex: 'nom'
                                            },
                                            {
                                                title: translate('Poids'),
                                                dataIndex: 'weight'
                                            },
                                            {
                                                title: translate('Type_Indicateur'),
                                                dataIndex: 'indicatorType',
                                                render: value => (
                                                    <>
                                                        {value === AGGREGATE_INDICATOR && translate('Agregee')}
                                                        {value === PROGRAM_INDICATOR && translate('Indicateur_Programme')}
                                                    </>
                                                )
                                            },
                                            {
                                                title: translate('Actions'),
                                                dataIndex: 'action',
                                                width: '80px',
                                                render: value => (
                                                    <>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <FiEdit style={{ color: BLUE, fontSize: '15px', cursor: 'pointer' }} onClick={() => handleUpdateBtnClicked(value)} />
                                                            <Popconfirm
                                                                title={translate('Suppression_Configuration')}
                                                                description={translate('Confirmation_Suppression_Configuration')}
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
                                    <div style={{ marginBottom: '5px' }}>{translate('Type_Element')}</div>
                                </Col>
                                <Col>
                                    <div>
                                        <Radio
                                            label={translate('Element_De_Donnee')}
                                            onChange={handleChangeElementType}
                                            value={TYPE_ANALYSE_DATA_ELEMENT}
                                            checked={selectedAnalyseType === TYPE_ANALYSE_DATA_ELEMENT}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div>
                                        <Radio
                                            label={translate('Indicateurs')}
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
                                                <div style={{ marginBottom: '5px' }}>{translate('Element_De_Donnee')}</div>
                                                <Select
                                                    options={dataElements.map(dataElement => ({ label: dataElement.displayName, value: dataElement.id }))}
                                                    placeholder={translate('Element_De_Donnee')}
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
                                                <div style={{ marginBottom: '5px' }}>{translate('Indicateurs')}</div>
                                                <Select
                                                    options={indicators.map(ind => ({ value: ind.id, label: ind.displayName }))}
                                                    placeholder={translate('Indicateurs')}
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
                                                > + {translate('Ajouter')} </Button>
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
                                <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>{translate('Liste_Element_Configurer')} </div>
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
                                                title: translate('Nom'),
                                                dataIndex: 'nom'
                                            },
                                            {
                                                title: translate('Type'),
                                                dataIndex: 'elementType',
                                                render: value => (
                                                    <>
                                                        {value === TYPE_ANALYSE_DATA_ELEMENT && translate('Element_De_Donnee')}
                                                        {value === TYPE_ANALYSE_INDICATOR && translate('Indicateur')}
                                                    </>
                                                )
                                            },
                                            {
                                                title: translate('Actions'),
                                                dataIndex: 'action',
                                                width: '80px',
                                                render: value => (
                                                    <>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <Popconfirm
                                                                title={translate('Suppression_Configuration')}
                                                                description={translate('Confirmation_Suppression_Configuration')}
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
                            {translate('Configuration_Des_Indicateurs')}
                        </div>
                        <div className={`setting-menu-item ${selectedTypeSupervisionPage === PAGE_CONFIG_SUPERVISION ? 'active' : ''}`} onClick={() => handleClickConfigMenu(PAGE_CONFIG_SUPERVISION)}>
                            {translate('Parametre_Supervision')}
                        </div>
                        <div className={`setting-menu-item ${selectedTypeSupervisionPage === PAGE_CONFIG_ANALYSE ? 'active' : ''}`} onClick={() => handleClickConfigMenu(PAGE_CONFIG_ANALYSE)}>
                            {translate('Analyses')}
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
                        {translate('Type_De_Supervision')}
                    </Tab>
                    {0 > 1 &&
                        <Tab selected={renderPage === PAGE_CONFIGURATION_USER_AUTHORIZATIONS} onClick={_ => setRenderPage(PAGE_CONFIGURATION_USER_AUTHORIZATIONS)}>
                            Authorisations des utilisateurs
                        </Tab>
                    }
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
        selectedTypeSupervisionPage === PAGE_CONFIG_INDICATORS && initIndicatorConfigStates()
        selectedTypeSupervisionPage === PAGE_CONFIG_SUPERVISION && initSupConfigStates()
        selectedTypeSupervisionPage === PAGE_CONFIG_ANALYSE && initAnalyseConfigStates()
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