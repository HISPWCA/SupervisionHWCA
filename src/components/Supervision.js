import React, { useMemo, useEffect, useState } from 'react'
import { MantineReactTable } from 'mantine-react-table'
import { Card, Col, DatePicker, Divider, FloatButton, Input, InputNumber, List, Popconfirm, Row, Select, Steps, Table } from 'antd'
import { IoMdAdd } from 'react-icons/io'
import { IoListCircleOutline } from 'react-icons/io5'
import { Button, ButtonStrip, Checkbox, CircularLoader, Modal, ModalActions, ModalContent, ModalTitle, Radio } from '@dhis2/ui'
import {
    DAY,
    INDICATOR,
    INDICATOR_GROUP,
    MONTH,
    NOTICE_BOX_DEFAULT,
    NOTICE_BOX_WARNING,
    NOTIFICATON_CRITICAL,
    NOTIFICATON_SUCCESS,
    ORGANISATION_UNIT,
    PROGRAM_INDICATOR,
    QUARTER,
    TYPE_GENERATION_AS_ENROLMENT,
    TYPE_GENERATION_AS_EVENT,
    TYPE_GENERATION_AS_TEI,
    TYPE_SUPERVISION_AGENT,
    TYPE_SUPERVISION_ORGANISATION_UNIT,
    WEEK,
    YEAR
} from '../utils/constants'
import { loadDataStore, saveDataToDataStore } from '../utils/functions'
import { MyNoticeBox } from './MyNoticeBox'
import { ENROLLMENTS_ROUTE, EVENTS_ROUTE, INDICATORS_GROUP_ROUTE, ORGANISATION_UNITS_ROUTE, ORGANISATION_UNIT_GROUP_SETS_ROUTE, PROGRAMS_STAGE_ROUTE, PROGRAM_INDICATOR_GROUPS, PROGS_ROUTE, TRACKED_ENTITY_ATTRIBUTES_ROUTE, TRACKED_ENTITY_INSTANCES_ROUTE, USERS_ROUTE } from '../utils/api.routes'
import axios from 'axios'
import OrganisationUnitsTree from './OrganisationUnitsTree'
import { GREEN } from '../utils/couleurs'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { RiDeleteBinLine } from 'react-icons/ri'
import MyNotification from './MyNotification'
import { v1 as uuid } from 'uuid'
import { BsArrowRight } from 'react-icons/bs'
import { BsArrowLeft } from 'react-icons/bs'
import { Stepper } from 'react-form-stepper'
import { FiSave } from 'react-icons/fi'
import { ImCancelCircle } from 'react-icons/im'
import { CgCloseO } from 'react-icons/cg'
import { TbSelect } from 'react-icons/tb'
import { DataDimension } from '@dhis2/analytics'


import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'


dayjs.extend(customParseFormat);


const Supervision = ({ me }) => {

    const [dataStoreSupervisionConfigs, setDataStoreSupervisionConfigs] = useState([])
    const [dataStoreIndicatorConfigs, setDataStoreIndicatorConfigs] = useState([])
    const [isEditionMode, setEditionMode] = useState(true)
    const [noticeBox, setNoticeBox] = useState({ show: false, message: null, title: null, type: NOTICE_BOX_DEFAULT })
    const [organisationUnits, setOrganisationUnits] = useState([])
    const [users, setUsers] = useState([])
    const [organisationUnitGroupSets, setOrganisationUnitGroupSets] = useState([])
    const [programStages, setProgramStages] = useState([])
    const [isNewMappingMode, setIsNewMappingMode] = useState(false)
    const [mappingConfigs, setMappingConfigs] = useState([])
    const [indicatorGroups, setIndicatorGroups] = useState([])
    const [notification, setNotification] = useState({ show: false, message: null, type: null })
    const [visibleAnalyticComponentModal, setVisibleAnalyticComponentModal] = useState(false)

    const [selectedStep, setSelectedStep] = useState(0)
    const [selectedSupervisionType, setSelectedSupervisionType] = useState(null)
    const [selectedSupervisionFiche, setSelectedSupervisionFiche] = useState(null)
    const [selectedPlanificationType, setSelectedPlanificationType] = useState(null)
    const [selectedOrganisationUnits, setSelectedOrganisationUnits] = useState([])
    const [selectedIndicators, setSelectedIndicators] = useState([])
    const [selectedPeriod, setSelectedPeriod] = useState(null)
    const [selectedOrganisationUnitGroupSet, setSelectedOrganisationUnitGroupSet] = useState(null)
    const [selectedOrganisationUnitGroup, setSelectedOrganisationUnitGroup] = useState(null)
    const [selectedPeriodType, setSelectedPeriodType] = useState(null)
    const [selectedProgramStage, setSelectedProgramStage] = useState(null)
    const [selectedDataElement, setSelectedDataElement] = useState(null)
    const [selectedIndicatorGroup, setSelectedIndicatorGroup] = useState(null)
    const [selectedIndicatorType, setSelectedIndicatorType] = useState(PROGRAM_INDICATOR)
    const [selectedIndicator, setSelectedIndicator] = useState(null)
    const [selectedMetaDatas, setSelectedMetaDatas] = useState([])


    const [inputMeilleur, setInputMeilleur] = useState('')
    const [inputMauvais, setInputMauvais] = useState('')
    const [inputMeilleurPositif, setInputMeilleurPositif] = useState(true)
    const [inputFields, setInputFields] = useState([])
    const [inputDataSourceDisplayName, setInputDataSourceDisplayName] = useState('')
    const [inputDataSourceID, setInputDataSourceID] = useState(null)


    const [loadingDataStoreSupervisionConfigs, setLoadingDataStoreSupervisionConfigs] = useState(false)
    const [loadingDataStoreIndicatorConfigs, setLoadingDataStoreIndicatorConfigs] = useState(false)
    const [loadingOrganisationUnits, setLoadingOrganisationUnits] = useState(false)
    const [loadingOrganisationUnitGroupSets, setLoadingOrganisationUnitGroupSets] = useState(false)
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [loadingProgramStages, setLoadingProgramStages] = useState(false)
    const [loadingSaveDateElementMappingConfig, setLoadingSaveDateElementMappingConfig] = useState(false)
    const [loadingIndicatorGroups, setLoadingIndicatorGroups] = useState(false)
    const [loadingSupervisionPlanification, setLoadingSupervisionPlanification] = useState(false)

    const data = [
        {
            name: {
                firstName: 'Zachary',
                lastName: 'Davis',
            },
            address: '261 Battle Ford',
            city: 'Columbus',
            state: 'Ohio',
        },
        {
            name: {
                firstName: 'Robert',
                lastName: 'Smith',
            },
            address: '566 Brakus Inlet',
            city: 'Westerville',
            state: 'West Virginia',
        },
        {
            name: {
                firstName: 'Kevin',
                lastName: 'Yan',
            },
            address: '7777 Kuhic Knoll',
            city: 'South Linda',
            state: 'West Virginia',
        },
        {
            name: {
                firstName: 'John',
                lastName: 'Upton',
            },
            address: '722 Emie Stream',
            city: 'Huntington',
            state: 'Washington',
        },
        {
            name: {
                firstName: 'Nathan',
                lastName: 'Harris',
            },
            address: '1 Kuhic Knoll',
            city: 'Ohiowa',
            state: 'Nebraska',
        },
    ]

    const periodTypesOptions = () => {
        return [
            {
                value: DAY,
                label: DAY
            },
            {
                value: WEEK,
                label: WEEK
            },
            {
                value: MONTH,
                label: MONTH
            },
            {
                value: QUARTER,
                label: QUARTER
            },
            {
                value: YEAR,
                label: YEAR
            },
        ]
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name.firstName', //access nested data with dot notation
                header: 'First Name',
            },
            {
                accessorKey: 'name.lastName',
                header: 'Last Name',
            },
            {
                accessorKey: 'address', //normal accessorKey
                header: 'Address',
            },
            {
                accessorKey: 'city',
                header: 'City',
            },
            {
                accessorKey: 'state',
                header: 'State',
            },
        ],
        [],
    )

    const loadOrganisationUnits = async () => {
        try {
            if (!me)
                throw new Error("Impossibile de récuperer l'utilisateur actuelle ( me ) ")

            setLoadingOrganisationUnits(true)

            const userOrganisationUnitId = me.organisationUnits?.length > 0 && me.organisationUnits?.[0].id

            if (userOrganisationUnitId) {
                const response = await axios.get(ORGANISATION_UNITS_ROUTE)
                setOrganisationUnits(response.data?.organisationUnits)
                setLoadingOrganisationUnits(false)
            }
        }
        catch (err) {
            console.log(err)
            setLoadingOrganisationUnits(false)
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
        } catch (err) {
            setLoadingProgramStages(false)
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

    const loadUsers = async (userOrgUnitId) => {
        try {
            if (userOrgUnitId) {
                setLoadingUsers(true)

                const route = `${USERS_ROUTE}&filter=organisationUnits.path:like:${userOrgUnitId}`
                const response = await axios.get(route)

                setUsers(response.data.users)
                setLoadingUsers(false)
            }
        }
        catch (err) {
            console.log(err)
            setLoadingUsers(false)
        }
    }

    const loadOrganisationUnitsGroupSets = async () => {
        try {
            setLoadingOrganisationUnitGroupSets(true)
            const response = await axios.get(ORGANISATION_UNIT_GROUP_SETS_ROUTE)
            setOrganisationUnitGroupSets(response.data.organisationUnitGroupSets)
            setLoadingOrganisationUnitGroupSets(false)
        }
        catch (err) {
            console.log(err)
            setLoadingOrganisationUnitGroupSets(false)
        }
    }

    const loadDataStoreSupervisions = async () => {
        try {
            setLoadingDataStoreSupervisionConfigs(true)
            const response = await loadDataStore(process.env.REACT_APP_SUPERVISIONS_KEY, null, null, null)
            if (!response || response.length === 0) {
                setLoadingDataStoreSupervisionConfigs(false)
                return setNoticeBox({
                    show: true,
                    message: "Aucun programme n'est configuré. Veuillez configurer au moins un avant de continuer !",
                    title: 'Configuration',
                    type: NOTICE_BOX_WARNING
                })
            }
            setDataStoreSupervisionConfigs(response)
            setLoadingDataStoreSupervisionConfigs(false)
        }
        catch (err) {
            console.log(err)
            setLoadingDataStoreSupervisionConfigs(false)
        }
    }

    const loadDataStoreIndicators = async () => {
        try {
            setLoadingDataStoreIndicatorConfigs(true)
            const response = await loadDataStore(process.env.REACT_APP_INDICATORS_CONFIG_KEY, null, null, null)
            setDataStoreIndicatorConfigs(response)
            setLoadingDataStoreIndicatorConfigs(false)
        }
        catch (err) {
            console.log(err)
            setLoadingDataStoreIndicatorConfigs(false)
        }
    }

    const handleSelectIndicatorGroup = (value) => {
        setSelectedIndicator(null)
        setSelectedIndicatorGroup(indicatorGroups.find(indGroup => indGroup.id === value))
    }

    const handleChangeIndicatorType = ({ value }) => {
        setSelectedIndicatorGroup(null)
        setSelectedIndicator(null)
        setSelectedDataElement(null)
        setIndicatorGroups([])
        setSelectedIndicatorType(value)

        value === INDICATOR_GROUP && loadIndicatorGroups()
        value === PROGRAM_INDICATOR && loadProgramIndicatorGroups()
    }

    const handleSelectDataElement = (value) => {
        setSelectedDataElement(selectedProgramStage.programStageDataElements?.map(p => p.dataElement).find(dataElement => dataElement.id === value))
    }

    const handleSelectIndicator = (value) => {
        setSelectedIndicator(null)
        selectedIndicatorType === INDICATOR_GROUP && setSelectedIndicator(selectedIndicatorGroup.indicators?.find(ind => ind.id === value))
        selectedIndicatorType === PROGRAM_INDICATOR && setSelectedIndicator(selectedIndicatorGroup.programIndicators?.find(progInd => progInd.id === value))
    }

    const handleAddNewMappingConfig = () => {
        setIsNewMappingMode(!isNewMappingMode)

        if (!isNewMappingMode) {
            setSelectedDataElement(null)
            setSelectedIndicator(null)
        }
    }

    const handleSelectProgramStage = (value) => {
        setSelectedProgramStage(programStages.find(pstage => pstage.id === value))
        setSelectedDataElement(null)
    }

    const handleSaveNewMappingConfig = async () => {
        try {
            setLoadingSaveDateElementMappingConfig(true)
            if (!selectedDataElement)
                throw new Error("L'élément de donnée est obligatoire !")

            if (!inputDataSourceDisplayName || inputDataSourceDisplayName?.trim().length === 0)
                throw new Error("La donnée source est obligatoire !")

            if (!selectedProgramStage)
                throw new Error("Le programme stage est obligatoire !")

            if (selectedDataElement && selectedProgramStage) {
                const existingConfig = mappingConfigs.find(mapping => mapping.dataElement?.id === selectedDataElement.id &&
                    // mapping.indicator?.displayName === inputDataSourceDisplayName &&
                    mapping.programStage?.id === selectedProgramStage.id
                )

                if (!existingConfig) {
                    const payload = {
                        id: uuid(),
                        dataElement: selectedDataElement,
                        indicator: { displayName: inputDataSourceDisplayName, id: inputDataSourceID },
                        programStage: { id: selectedProgramStage.id, displayName: selectedProgramStage.displayName },
                        program: { id: selectedSupervisionFiche?.program?.id, displayName: selectedSupervisionFiche?.program?.displayName }
                    }
                    const newList = [...mappingConfigs, payload]
                    setMappingConfigs(newList)
                    setSelectedDataElement(null)
                    setInputDataSourceDisplayName('')
                    setInputDataSourceID(null)
                    // setSelectedIndicator(null)
                    setSelectedProgramStage(null)
                    // setSelectedIndicatorGroup(null)
                    setNotification({ show: true, type: NOTIFICATON_SUCCESS, message: 'Configuration ajoutée !' })
                    setLoadingSaveDateElementMappingConfig(false)
                } else {
                    throw new Error('Cette configuration à déjà été ajoutée')
                }
            }
        } catch (err) {
            console.log(err)
            setNotification({ show: true, type: NOTIFICATON_CRITICAL, message: err.response?.data?.message || err.message })
            setLoadingSaveDateElementMappingConfig(false)
        }
    }

    const handleDeleteConfigItem = async (value) => {
        try {
            if (value) {
                setSelectedIndicator(null)
                const newList = mappingConfigs.filter(mapConf => mapConf.id !== value.id)
                setMappingConfigs(newList)
                setNotification({ show: true, message: 'Suppression éffectuée !', type: NOTIFICATON_SUCCESS })
            }
        } catch (err) {
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const handleChangeSupervisionType = ({ value }) => {
        setSelectedSupervisionFiche(null)
        setSelectedSupervisionType(value)
    }

    const handleChangePlanificationType = ({ value }) => {

        if (value === INDICATOR && organisationUnitGroupSets.length === 0) {
            loadOrganisationUnitsGroupSets()
        }

        setInputMauvais('')
        setInputMeilleur('')
        setInputMeilleurPositif(false)

        setSelectedIndicators([])
        setSelectedPeriod(null)
        setSelectedPeriodType(null)
        setSelectedOrganisationUnits([])
        setSelectedOrganisationUnitGroup(null)
        setSelectedOrganisationUnitGroupSet(null)

        setSelectedPlanificationType(value)
    }

    const handleClickFloatingBtn = () => {
        setEditionMode(!isEditionMode)
    }

    const handleClickSupervisionItem = (sup) => {
        setSelectedProgramStage(null)
        setSelectedDataElement(null)
        setSelectedIndicator(null)

        loadProgramStages(sup.program?.id)
        // selectedIndicatorType === PROGRAM_INDICATOR && loadProgramIndicatorGroups()
        // selectedIndicatorType === INDICATOR_GROUP && loadIndicatorGroups()

        setSelectedSupervisionFiche(sup)
    }

    const handleDeleteOtherSupervisor = (item, index) => {
        if (item) {
            setInputFields(
                inputFields.map((inp, inputIndex) => {
                    if (inputIndex === index) {
                        return {
                            ...inp,
                            otherSupervisors: inp.otherSupervisors?.filter(otherSup => otherSup !== item) || []
                        }
                    }
                    return inp
                })
            )
        }
    }

    const generatedAutoCode = async (attr_id) => {
        try {
            const route = `${TRACKED_ENTITY_ATTRIBUTES_ROUTE}/${attr_id}/generate` /// identifiant pev
            const autoGenetedCodeResponse = await axios.get(route)
            return autoGenetedCodeResponse.data
        } catch (err) {
            throw err
        }
    }


    const createTei = async (tei) => {
        try {
            const response = await axios.post(`${TRACKED_ENTITY_INSTANCES_ROUTE}`, tei)
            return response.data
        } catch (err) {
            throw err
        }
    }

    const createEnrollment = async (enrollment) => {
        try {
            const response = await axios.post(`${ENROLLMENTS_ROUTE}`, enrollment)
            return response.data
        } catch (err) {
            throw err
        }
    }

    const createEvents = async (events) => {
        try {
            const response = await axios.post(`${EVENTS_ROUTE}`, events)
            return response.data
        } catch (err) {
            throw err
        }
    }



    const generateTeiWithEnrollmentWithEvents = async (payload) => {
        try {
            const currentProgram = await axios.get(`${PROGS_ROUTE}/${selectedSupervisionFiche?.program?.id}?fields=id,displayName,trackedEntityType,programStages[id,programStageDataElements[dataElement]],programTrackedEntityAttributes[trackedEntityAttribute]`)
            if (!currentProgram.data)
                throw new Error("Program non trouver")

            const generatedCode = await generatedAutoCode(currentProgram.data.programTrackedEntityAttributes[0]?.trackedEntityAttribute?.id)

            const tei = {
                trackedEntityType: currentProgram.data.trackedEntityType.id,
                orgUnit: payload.orgUnit,
                attributes: [{ attribute: generatedCode.ownerUid, value: generatedCode.value }]
            }

            const createdTEI = await createTei(tei)
            const tei_id = createdTEI?.response?.importSummaries[0]?.reference

            if (!tei_id)
                throw new Error("Erreur de création du tracked entity instance ")

            const enrollment = {
                orgUnit: payload.orgUnit,
                trackedEntityInstance: tei_id,
                program: payload.program
            }

            const createdEnrollment = await createEnrollment(enrollment)
            const enrollment_id = createdEnrollment?.response?.importSummaries[0]?.reference

            if (!enrollment_id)
                throw new Error("Erreur de création de l'enrôlement ")

            const availableProgramStages = []
            const newEventsList = []

            //  Récuperation dans une list les programmes stage
            for (let mapping of mappingConfigs) {
                if (!availableProgramStages.includes(mapping.programStage?.id)) {
                    availableProgramStages.push(mapping.programStage.id)
                }
            }

            if (payload.fieldConfig?.supervisor?.programStage?.id) {
                if (!availableProgramStages.includes(payload.fieldConfig?.supervisor?.programStage?.id)) {
                    availableProgramStages.push(payload.fieldConfig?.supervisor?.programStage?.id)
                }
            }

            for (let stage of availableProgramStages) {
                const eventPayload = {
                    dueDate: dayjs(payload.period).format('YYYY-MM-DD'),
                    program: payload.program,
                    orgUnit: payload.orgUnit,
                    enrollment: enrollment_id,
                    programStage: stage,
                    trackedEntityInstance: tei_id,
                    dataValues: []
                }

                if (mappingConfigs?.length > 0) {
                    eventPayload.status = 'ACTIVE'
                    eventPayload.eventDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                    eventPayload.dueDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                    eventPayload.dataValues = mappingConfigs.filter(ev => ev.programStage?.id === stage)
                        .map(ev => ({
                            dataElement: ev.dataElement?.id,
                            value: ev.indicator?.displayName
                        }))
                } else {
                    eventPayload.status = 'SCHEDULE'
                    eventPayload.dueDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                }

                // Ajoute des dataValues superviseurs
                if (payload.fieldConfig?.supervisor?.programStage?.id === stage && payload.fieldConfig?.supervisor?.dataElements?.length > 0) {
                    const newDataValues = []

                    /*
                    * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son INFÉRIEUR au nombres de superviseurs sélectionnés
                    */

                    const newSupervisorsList = [...payload.supervisors?.map(s => s.displayName), ...payload.otherSupervisors]

                    if (payload.fieldConfig?.supervisor?.dataElements?.length < newSupervisorsList?.length) {
                        const supervisorArrayCurrent = newSupervisorsList?.slice(0, payload.fieldConfig?.supervisor?.dataElements?.length)
                        const supervisorArraylast = newSupervisorsList?.slice(payload.fieldConfig?.supervisor?.dataElements?.length)

                        for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                            for (let j = 0; j < supervisorArrayCurrent.length; j++) {
                                if (i === j) {
                                    const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                    const currentSUP = supervisorArrayCurrent[j]
                                    if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {

                                        if (i === payload.fieldConfig?.supervisor?.dataElements?.length - 1) {
                                            newDataValues.push({
                                                dataElement: currentDE.id,
                                                value: `${currentSUP},${supervisorArraylast?.join(',')}`
                                            })
                                        } else {
                                            newDataValues.push({
                                                dataElement: currentDE.id,
                                                value: currentSUP
                                            })
                                        }

                                    }
                                }
                            }
                        }
                    }

                    /*
                   * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son EGALE au nombres de superviseurs sélectionnés
                   */
                    if (payload.fieldConfig?.supervisor?.dataElements?.length === newSupervisorsList?.length) {
                        for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                            for (let j = 0; j < newSupervisorsList.length; j++) {
                                if (i === j) {
                                    const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                    const currentSUP = newSupervisorsList[j]
                                    if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {

                                        // if (i === payload.fieldConfig?.supervisor?.dataElements?.length - 1) {
                                        //     newDataValues.push({
                                        //         dataElement: currentDE.id,
                                        //         value: `${currentSUP},${newSupervisorsList?.join(',')}`
                                        //     })
                                        // } else {
                                        newDataValues.push({
                                            dataElement: currentDE.id,
                                            value: currentSUP
                                        })
                                        // }

                                    }
                                }
                            }
                        }
                    }

                    /*
                  * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son SUPERIEUR au nombres de superviseurs sélectionnés
                  */
                    if (payload.fieldConfig?.supervisor?.dataElements?.length > newSupervisorsList?.length) {
                        for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                            for (let j = 0; j < newSupervisorsList?.length; j++) {
                                if (i === j) {
                                    const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                    const currentSUP = newSupervisorsList[j]
                                    if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {

                                        // if (i === newSupervisorsList?.length - 1) {
                                        //     newDataValues.push({
                                        //         dataElement: currentDE.id,
                                        //         value: `${currentSUP},${newSupervisorsList?.join(',')}`
                                        //     })
                                        // } else {

                                        // }

                                        newDataValues.push({
                                            dataElement: currentDE.id,
                                            value: currentSUP
                                        })

                                    }
                                }
                            }
                        }
                    }

                    if (newDataValues.length > 0) {
                        eventPayload.dataValues = [...eventPayload.dataValues, ...newDataValues]
                    }
                }

                if (!newEventsList.map(ev => ev.programStage).includes(stage)) {
                    newEventsList.push(eventPayload)
                }
            }

            await createEvents({ events: newEventsList })

            const currentTEI = await axios.get(`${TRACKED_ENTITY_INSTANCES_ROUTE}/${tei_id}?program=${payload.program}`)
            return currentTEI.data

        } catch (err) {
            throw err
        }
    }

    const handleSelectIndicators = (values) => setSelectedIndicators(values.map(val => dataStoreIndicatorConfigs.find(dsInd => dsInd.indicator?.id === val)))

    const savePanificationToDataStore = async (payload) => {
        try {
            if (payload) {
                await saveDataToDataStore(process.env.REACT_APP_SUPERVISION_PLANIFICATION_KEY, payload)
            }
        } catch (err) {
            throw err
        }
    }

    const saveSupervisionAsTEIStrategy = async (inputFieldsList) => {
        try {
            if (inputFieldsList.length > 0) {

                const supervisionsList = []

                for (let item of inputFieldsList) {
                    const payload = {
                        ...item,
                        orgUnit: item.organisationUnit?.id,
                        period: item.period,
                        program: item.program?.id,
                        fieldConfig: item.fieldConfig
                    }
                    const createdTEIObject = await generateTeiWithEnrollmentWithEvents(payload)
                    if (createdTEIObject) {
                        supervisionsList.push({
                            ...item,
                            id: uuid(),
                            orgUnit: item.organisationUnit?.id,
                            period: item.period,
                            program: item.program?.id,
                            fieldConfig: item.fieldConfig,
                            tei: createdTEIObject
                        })
                    }
                }
                let planificationPayload = {
                    id: uuid(),
                    supervisionFiche: selectedSupervisionFiche,
                    dataSources: mappingConfigs,
                    supervisions: supervisionsList,
                }
                await savePanificationToDataStore(planificationPayload)
            }
        } catch (err) {
            throw err
        }
    }



    const saveSupervisionAsEnrollmentStrategy = async (inputFieldsList) => {
        try {
            if (inputFieldsList.length > 0) {
                for (let item of inputFieldsList) {
                    const payload = {
                        orgUnit: item.organisationUnit?.id,
                        period: item.period,
                        program: item.program?.id,
                        events: mappingConfigs.filter(mapping => mapping.program?.id === item.program?.id),
                    }
                    // await generateTeiWithEnrollmentWithEvents(payload)
                }
            }
        } catch (err) {
            throw err
        }
    }

    const cleanAllNewSupervisionStage = () => {
        setIsNewMappingMode(false)
        setMappingConfigs([])
        setProgramStages([])
        setSelectedStep(0)
        setSelectedSupervisionType(null)
        setSelectedSupervisionFiche(null)
        setSelectedPlanificationType(null)
        setSelectedOrganisationUnits([])
        setSelectedIndicators([])
        setSelectedPeriod(null)
        setSelectedOrganisationUnitGroupSet(null)
        setSelectedOrganisationUnitGroup(null)
        setSelectedPeriodType(null)
        setSelectedProgramStage(null)
        setSelectedDataElement(null)
        setSelectedIndicatorGroup(null)
        setSelectedIndicatorType(PROGRAM_INDICATOR)
        setSelectedIndicator(null)
        setSelectedMetaDatas([])
        setInputMeilleur('')
        setInputMauvais('')
        setInputMeilleurPositif(true)
        setInputFields([])
        setInputDataSourceDisplayName('')
        setInputDataSourceID(null)
    }

    const handleSupervisionPlanificationSaveBtn = async () => {
        try {
            setLoadingSupervisionPlanification(true)

            // const completePayloadList = inputFields.map(inputField => {
            //     return inputField
            // })

            if (selectedSupervisionFiche.generationType === TYPE_GENERATION_AS_TEI)
                await saveSupervisionAsTEIStrategy(inputFields)

            // if (selectedSupervisionFiche.generationType === TYPE_GENERATION_AS_ENROLMENT)
            //     await saveSupervisionAsEnrollmentStrategy(inputFields)

            setLoadingSupervisionPlanification(false)
            setNotification({ show: true, message: 'Planification effectuée avec succès !', type: NOTIFICATON_SUCCESS })
            setEditionMode(false)
            cleanAllNewSupervisionStage()
        } catch (err) {
            console.log(err)
            setLoadingSupervisionPlanification(false)
            setNotification({ show: true, type: NOTIFICATON_CRITICAL, message: err.response?.data?.message || err.message })
        }

    }

    const handleOnchangeOrgUnit = (values) => {
        console.log(values)
    }

    const RenderSupervisionList = () => (
        <>

            <Card size='small' className='my-shadow'>
                <MantineReactTable
                    enableStickyHeader
                    columns={columns}
                    data={data}
                    mantinePaperProps={{
                        shadow: 'none',
                        radius: '8px',
                        withBorder: false,
                    }}
                    initialState={
                        {
                            density: 'xs',
                        }
                    }
                    mantineTableProps={{
                        striped: true,
                        highlightOnHover: true,
                    }}
                />
            </Card>
        </>
    )

    const RenderTopContent = () => (
        <>
            <div style={{ padding: '10px 20px', borderBottom: '1px solid #ccc', background: '#FFF', position: 'sticky', top: 0, zIndex: 1000 }}>
                <Row gutter={[6, 6]}>
                    <Col sm={24} md={2}>
                        <div style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '15px' }}>Supervisions</div>
                    </Col>
                    <Col sm={24} md={16}>
                        {RenderSteps()}
                    </Col>
                    <Col sm={24} md={2} style={{ textAlign: 'right' }}>
                        {
                            isEditionMode && inputFields.length > 0 && (
                                <div style={{ marginTop: '15px' }}>
                                    <Button icon={<ImCancelCircle style={{ color: '#fff', fontSize: '18px' }} />} destructive >
                                        Annuler
                                    </Button>
                                </div>
                            )
                        }
                    </Col>
                    <Col sm={24} md={4} style={{ textAlign: 'left' }}>
                        {
                            isEditionMode && inputFields.length > 0 && (
                                <div style={{ marginTop: '15px' }}>
                                    <Button icon={<FiSave style={{ color: '#fff', fontSize: '18px' }} />} onClick={handleSupervisionPlanificationSaveBtn} primary disabled={loadingSupervisionPlanification} loading={loadingSupervisionPlanification}>
                                        Planifier la supervision
                                    </Button>
                                </div>
                            )
                        }
                    </Col>
                </Row>
            </div>
        </>
    )

    // const RenderTopContent = () => (
    //     <>
    //         <div style={{ padding: '20px', borderBottom: '1px solid #ccc', background: '#FFF', position: 'sticky', top: 0, zIndex: 1000, display:'flex', jusityContent:'space-between' }}>
    //             <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Supervisions</div>
    //             <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
    //                 {
    //                     isEditionMode && inputFields.length > 0 && (
    //                         <Button onClick={handleSupervisionPlanificationSaveBtn} primary disabled={loadingSupervisionPlanification} loading={loadingSupervisionPlanification}>
    //                             Planifier la Supervision
    //                         </Button>
    //                     )
    //                 }
    //             </div>
    //         </div>
    //     </>
    // )

    const RenderFloatingButton = () => (
        <>
            <FloatButton
                tooltip={isEditionMode ? 'Liste des supervisions' : 'Nouvelle supervision'}
                icon={isEditionMode ? <IoListCircleOutline style={{ color: '#FFF', fontSize: '20px' }} /> : <IoMdAdd style={{ color: '#FFF' }} />}
                type="primary"
                style={{ right: 50, bottom: 50, width: '60px', height: '60px', boxShadow: '10px 10px 20px #00000050' }}
                onClick={handleClickFloatingBtn}
            />
        </>
    )

    const RenderNoticeBox = () => (
        <div style={{ padding: '10px' }}>
            <MyNoticeBox
                show={noticeBox.show}
                message={noticeBox.message}
                title={noticeBox.title}
                type={noticeBox.type}
            />
        </div>
    )

    const RenderSupervisionTypeContent = () => (
        <>
            <div>
                <Card className='my-shadow' size="small">
                    <div style={{ fontWeight: 'bold' }}>
                        Que voulez-vous superviser ?
                    </div>
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <div >
                            <Radio
                                label="Unité d'organisation"
                                className="cursor-pointer"
                                onChange={handleChangeSupervisionType}
                                value={TYPE_SUPERVISION_ORGANISATION_UNIT}
                                checked={selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT}
                            />
                        </div>
                        <div style={{ marginLeft: '20px' }}>
                            <Radio
                                label="Agent"
                                className="cursor-pointer"
                                onChange={handleChangeSupervisionType}
                                value={TYPE_SUPERVISION_AGENT}
                                checked={selectedSupervisionType === TYPE_SUPERVISION_AGENT}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )

    const RenderSelectedSupervisionTypeList = () => (
        <>
            <div style={{ marginTop: '10px' }}>
                <Card className='my-shadow my-scrollable' bodyStyle={{ padding: '0px', margin: '0px', maxHeight: '500px' }} size="small">
                    <div style={{ fontWeight: 'bold', padding: '10px', borderBottom: '1px solid #ccc' }}>Fiches de supervisions</div>
                    <div style={{ padding: '10px' }}>
                        {
                            selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT &&
                            dataStoreSupervisionConfigs
                                .filter(sup => sup.generationType === TYPE_GENERATION_AS_TEI)
                                .map((sup, index) => (
                                    <div key={index} className={`supervision-item ${selectedSupervisionFiche?.id === sup.id ? 'active' : ''}`} onClick={() => handleClickSupervisionItem(sup)}>
                                        {sup.program?.displayName}
                                    </div>
                                ))
                        }
                        {
                            selectedSupervisionType === TYPE_SUPERVISION_AGENT &&
                            dataStoreSupervisionConfigs
                                .filter(sup => sup.generationType === TYPE_GENERATION_AS_ENROLMENT || sup.generationType === TYPE_GENERATION_AS_EVENT)
                                .map((sup, index) => (
                                    <div key={index} className={`supervision-item ${selectedSupervisionFiche?.id === sup.id ? 'active' : ''}`} onClick={() => handleClickSupervisionItem(sup)}>
                                        {sup.program?.displayName}
                                    </div>
                                ))
                        }
                        {
                            selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT &&
                            dataStoreSupervisionConfigs
                                .filter(sup => sup.generationType === TYPE_GENERATION_AS_TEI).length === 0 && (
                                <div style={{ fontWeight: 'bold' }}> Aucune fiche de supervision disponible</div>
                            )
                        }

                        {
                            selectedSupervisionType === TYPE_SUPERVISION_AGENT &&
                            dataStoreSupervisionConfigs
                                .filter(sup => sup.generationType === TYPE_GENERATION_AS_ENROLMENT || sup.generationType === TYPE_GENERATION_AS_EVENT).length === 0 && (
                                <div style={{ fontWeight: 'bold' }}> Aucune fiche de supervision disponible</div>
                            )
                        }
                    </div>
                </Card>
            </div>
        </>
    )

    const RenderSupervisionPlanificationType = () => (
        <div>
            <Card className='my-shadow' size="small">
                <div style={{ fontWeight: 'bold' }}>
                    Planification
                </div>
                <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div>
                        <Radio
                            label="Directe"
                            className="cursor-pointer"
                            onChange={handleChangePlanificationType}
                            value={ORGANISATION_UNIT}
                            checked={selectedPlanificationType === ORGANISATION_UNIT}
                        />
                    </div>
                    <div style={{ marginLeft: '20px' }}>
                        <Radio
                            label="Basée sur les indicateurs"
                            className="cursor-pointer"
                            onChange={handleChangePlanificationType}
                            value={INDICATOR}
                            checked={selectedPlanificationType === INDICATOR}
                        />
                    </div>
                </div>
            </Card>
        </div>
    )

    const RenderSupervisionPlanificationOrganisationUnitContent = () => (
        <div style={{ marginTop: '10px' }}>
            <Card bodyStyle={{ padding: '0px' }} className='my-shadow' size='small'>
                <div style={{ fontWeight: 'bold', padding: '10px', borderBottom: '1px solid #ccc' }}> Planification basée sur les unités d'organisations  </div>
                <div style={{ padding: '10px' }}>
                    <div>
                        <div style={{ marginBottom: '5px' }}>Unités d'organisation</div>
                        <OrganisationUnitsTree
                            meOrgUnitId={me?.organisationUnits[0]?.id}
                            orgUnits={organisationUnits}
                            currentOrgUnits={selectedOrganisationUnits}
                            setCurrentOrgUnits={setSelectedOrganisationUnits}
                            loadingOrganisationUnits={loadingOrganisationUnits}
                            multiple={true}
                        />
                    </div>
                </div>
            </Card>
        </div>
    )

    const RenderSupervisionPlanificationIndicatorContent = () => (
        <>
            <div style={{ marginTop: '10px' }}>
                <Card bodyStyle={{ padding: '0px' }} className='my-shadow' size='small'>
                    <div style={{ fontWeight: 'bold', padding: '10px', borderBottom: '1px solid #ccc' }}> Planification basée sur les indicateurs configurés </div>
                    <div style={{ padding: '10px' }}>
                        <div>Indicateurs</div>
                        <Select
                            options={dataStoreIndicatorConfigs.map(ind => ({ label: ind.indicator?.displayName, value: ind.indicator?.id }))}
                            loading={loadingDataStoreIndicatorConfigs}
                            disabled={loadingDataStoreIndicatorConfigs}
                            showSearch
                            placeholder="Indicateurs"
                            style={{ width: '100%' }}
                            optionFilterProp='label'
                            mode='multiple'
                            onChange={handleSelectIndicators}
                            value={selectedIndicators?.map(ind => ind.indicator?.id)}
                        />
                    </div>
                </Card>
            </div>
        </>
    )

    const handleInputPeriod = (period, index) => {
        setInputFields(
            inputFields.map((field, fieldIndex) => {
                if (index === fieldIndex) {
                    return {
                        ...field,
                        period
                    }
                }
                return field
            })
        )
    }

    const handleInputLibelle = (event, index) => {
        setInputFields(
            inputFields.map((field, fieldIndex) => {
                if (index === fieldIndex) {
                    return {
                        ...field,
                        libelle: ''.concat(event.target.value)
                    }
                }
                return field
            })
        )
    }

    const handleInputOtherSupervisor = (event, index) => {
        setInputFields(
            inputFields.map((field, fieldIndex) => {
                if (index === fieldIndex) {
                    return {
                        ...field,
                        inputOtherSupervisor: ''.concat(event.target.value)
                    }
                }
                return field
            })
        )
    }

    const handleInputAddOtherSupervisors = (index) => {
        setInputFields(
            inputFields.map((field, fieldIndex) => {
                if (index === fieldIndex) {
                    if (field.inputOtherSupervisor?.trim()) {
                        if (!field.inputOtherSupervisor?.includes(inputOther => inputOther?.trim()?.toLocaleLowerCase() !== field.inputOtherSupervisor?.trim()?.toLocaleLowerCase())) {
                            return {
                                ...field,
                                inputOtherSupervisor: '',
                                otherSupervisors: [...field.otherSupervisors, field.inputOtherSupervisor?.trim()]
                            }

                        }
                    }
                }
                return field
            })
        )
    }

    const handleInputSupervisors = (values, index) => {
        setInputFields(
            inputFields.map((field, fieldIndex) => {
                if (index === fieldIndex) {
                    const supervisorsList = values.map(val => users.find(user => user.id === val))
                    return {
                        ...field,
                        supervisors: supervisorsList.map(sup => ({ id: sup.id, displayName: sup.displayName }))
                    }
                }
                return field
            })
        )
    }
    const handleCloseOrgUnitForm = (org, index) => {
        setSelectedOrganisationUnits(selectedOrganisationUnits.filter(ou => ou.id !== org.id))
        setInputFields(inputFields.filter(o => o.organisationUnit?.id !== org.id))
    }

    const RenderEntryInputConfiguration = () => (
        <div style={{ marginBottom: '20px' }}>
            <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size='small'>
                <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                    <div>
                        Configuration des champs de saisie
                    </div>
                    <div style={{ marginTop: '10px', color: '#00000080', fontSize: '13px' }}>
                        Configurer les éléments de données dans lesquels vous souhaitez insérer les informations entrées dans le formulaire(s)
                    </div>
                </div>
                <div style={{ padding: '10px' }}>

                </div>
            </Card>
        </div>
    )

    const RenderOrganisationUnitForm = () => (
        <div>
            <Row gutter={[10, 10]}>
                {/* <Col md={24}>
                    {RenderEntryInputConfiguration()}
                </Col> */}
                {
                    selectedOrganisationUnits.map((org, index) => (
                        <Col md={12} sm={24} key={index}>
                            <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size='small'>
                                <div style={{ background: GREEN, color: '#FFF', fontWeight: 'bold', padding: '10px', position: 'relative' }}>
                                    <span>
                                        Formulaire de planification sur
                                    </span>
                                    {
                                        org && (
                                            <span
                                                style={{
                                                    marginLeft: '20px',
                                                    background: '#fff',
                                                    color: GREEN,
                                                    fontWeight: 'bold',
                                                    padding: '5px',
                                                    borderRadius: '10px',
                                                }}
                                            >
                                                {org?.displayName}
                                            </span>
                                        )
                                    }

                                    <span className="delete-sup"  >
                                        <Popconfirm
                                            title="Suppression"
                                            description="Voulez-vous vraiment ce formularie ? "
                                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                            onConfirm={() => handleCloseOrgUnitForm(org, index)}
                                        >
                                            <span style={{ padding: '5px' }}>X</span>
                                        </Popconfirm>
                                    </span>
                                </div>
                                <div style={{ padding: '10px' }}>
                                    <Row gutter={[10, 10]}>
                                        <Col sm={24} md={24}>
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>Période</div>
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    placeholder='Période'
                                                    value={inputFields[index]?.period}
                                                    onChange={period => handleInputPeriod(period, index)}
                                                />
                                            </div>
                                        </Col>
                                        {
                                            0 > 1 && <Col sm={24} md={12}>
                                                <div>
                                                    <div style={{ marginBottom: '5px' }}>Libellé</div>
                                                    <Input
                                                        placeholder="Libellé"
                                                        style={{ width: '100%' }}
                                                        value={inputFields[index]?.libelle}
                                                        onChange={event => handleInputLibelle(event, index)}
                                                    />
                                                </div>
                                            </Col>
                                        }
                                        <Col sm={24} md={24}>
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>Superviseurs</div>
                                                <Select
                                                    placeholder="Superviseurs"
                                                    style={{ width: '100%' }}
                                                    loading={loadingUsers}
                                                    disabled={loadingUsers}
                                                    value={inputFields[index]?.supervisors?.map(sup => sup.id)}
                                                    onChange={(values) => handleInputSupervisors(values, index)}
                                                    mode='multiple'
                                                    optionFilterProp='label'
                                                    showSearch
                                                    options={users.map(user => ({ label: user.displayName, value: user.id }))}
                                                />
                                            </div>
                                        </Col>
                                        <Col md={24}>
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>Autre superviseurs</div>
                                                <Row gutter={[10, 10]}>
                                                    <Col md={19} sm={24}>
                                                        <Input
                                                            placeholder='Autre superviseur'
                                                            value={inputFields[index]?.inputOtherSupervisor}
                                                            onChange={event => handleInputOtherSupervisor(event, index)}
                                                        />
                                                    </Col>
                                                    <Col flex='auto' style={{ textAlign: 'right' }}>
                                                        <Button
                                                            primary
                                                            onClick={() => handleInputAddOtherSupervisors(index)}
                                                            disabled={
                                                                inputFields[index]?.inputOtherSupervisor?.trim() && !inputFields[index]?.otherSupervisorList?.includes(inputFields[index]?.inputOtherSupervisor?.trim()) ? false : true
                                                            }
                                                        >+ Ajouter </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>

                                        {
                                            inputFields[index]?.otherSupervisors?.length > 0 && (
                                                <Col md={24}>
                                                    <div style={{ marginTop: '10px' }}>
                                                        <List
                                                            size='small'
                                                            bordered
                                                            dataSource={inputFields[index]?.otherSupervisors}
                                                            renderItem={(item) => (
                                                                <List.Item style={{ padding: '2px 10px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                                        <div>{item}</div>
                                                                        <div>
                                                                            <Popconfirm
                                                                                title="Suppression"
                                                                                description="Voulez-vous vraiment ce superviseur ? "
                                                                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                                                onConfirm={() => handleDeleteOtherSupervisor(item, index)}
                                                                            >
                                                                                <RiDeleteBinLine style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} />
                                                                            </Popconfirm>
                                                                        </div>
                                                                    </div>
                                                                </List.Item>
                                                            )}
                                                        />
                                                    </div>
                                                </Col>
                                            )
                                        }

                                        {/* <Col md={24}>
                                            <Divider style={{ margin: '10px' }} />
                                            <Button icon={<FiSave style={{ fontSize: '18px', color: '#fff' }} />} primary>Enrégistrer la supervision</Button>
                                        </Col> */}
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </div>
    )

    const handleSelectOrganisationUnitGroupSet = (value) => {
        setSelectedOrganisationUnitGroup(null)

        setSelectedOrganisationUnitGroupSet(organisationUnitGroupSets.find(org => org.id === value))
    }

    const handleSelectPeriodType = (value) => {
        setSelectedPeriod(null)
        setSelectedPeriodType(value)
    }

    const handleSelectPeriode = value => setSelectedPeriod(value)

    const handleSelectOrganisationUnitGroup = (value) => {
        setSelectedPeriodType(null)
        setSelectedPeriod(null)
        setSelectedOrganisationUnitGroup(selectedOrganisationUnitGroupSet.organisationUnitGroups?.find(org => org.id === value))
    }

    const handleDisplayIndicatorResult = () => {
        try {

            if (!selectedOrganisationUnits)
                throw new Error("L'unité d'organisation est obligatoire !")

            if (!selectedOrganisationUnitGroupSet)
                throw new Error("Ensemble de Groupes d'Unitees d'Organisation est obligatoire ")

            if (!selectedOrganisationUnitGroup)
                throw new Error("Groupes d'Unitées d'Organisation")

        } catch (err) {
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const RenderIndicatorForm = () => (
        <div>
            <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size='small'>
                <div style={{ background: GREEN, color: '#FFF', fontWeight: 'bold', padding: '10px' }}>
                    <span>
                        Critères de recherches
                    </span>
                </div>
                <div style={{ marginTop: '5px', padding: '10px' }}>
                    <Row gutter={[10, 10]}>
                        <Col sm={24} md={6}>
                            <div>
                                <div style={{ marginBottom: '5px' }}>Unités d'organisation</div>
                                <OrganisationUnitsTree
                                    meOrgUnitId={me?.organisationUnits[0]?.id}
                                    orgUnits={organisationUnits}
                                    currentOrgUnits={selectedOrganisationUnits}
                                    setCurrentOrgUnits={setSelectedOrganisationUnits}
                                    loadingOrganisationUnits={loadingOrganisationUnits}
                                />
                            </div>
                        </Col>
                        <Col sm={24} md={6}>
                            <div style={{ marginBottom: '5px' }}>Meilleur</div>
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder='Meilleur'
                                value={inputMeilleur}
                                onChange={value => setInputMeilleur(''.concat(value))}
                            />
                        </Col>
                        <Col sm={24} md={6}>
                            <div style={{ marginBottom: '5px' }}>Mauvais</div>
                            <InputNumber
                                onChange={value => setInputMauvais(''.concat(value))}
                                value={inputMauvais}
                                style={{ width: '100%' }}
                                placeholder='Mauvais'
                            />
                        </Col>
                        <Col sm={24} md={6}>
                            <div style={{ display: 'flex', marginTop: '30px' }}>
                                <Checkbox
                                    checked={inputMeilleurPositif}
                                    onChange={() => setInputMeilleurPositif(!inputMeilleurPositif)}
                                />
                                <span style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => setInputMeilleurPositif(!inputMeilleurPositif)}>Meilleur Positif</span>
                            </div>
                        </Col>
                        <Col sm={24} md={6}>
                            <div style={{ marginBottom: '5px' }}>Ensemble de Groupes d'Unitees d'Organisation</div>
                            <Select
                                style={{ width: '100%' }}
                                options={organisationUnitGroupSets.map(org => ({ label: org.displayName, value: org.id }))}
                                value={selectedOrganisationUnitGroupSet?.id}
                                disabled={loadingOrganisationUnitGroupSets}
                                loading={loadingOrganisationUnitGroupSets}
                                placeholder="Ensemble de Groupes d'Unitees d'Organisation"
                                onChange={handleSelectOrganisationUnitGroupSet}
                            />
                        </Col>
                        {
                            selectedOrganisationUnitGroupSet && (
                                <Col sm={24} md={6}>
                                    <div style={{ marginTop: '20px' }}>
                                        <div style={{ marginBottom: '5px' }}>Groupes d'Unitées d'Organisation</div>
                                        <Select
                                            style={{ width: '100%' }}
                                            options={selectedOrganisationUnitGroupSet?.organisationUnitGroups?.map(org => ({ value: org.id, label: org.displayName }))}
                                            value={selectedOrganisationUnitGroup?.id}
                                            onChange={handleSelectOrganisationUnitGroup}
                                            placeholder="Groupes d'Unitees d'Organisation"
                                        />
                                    </div>
                                </Col>
                            )
                        }
                        <Col sm={24} md={6}>
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ marginBottom: '5px' }}>Type de Période</div>
                                <Select
                                    style={{ width: '100%' }}
                                    options={periodTypesOptions()}
                                    placeholder="Type de Période"
                                    onChange={handleSelectPeriodType}
                                    value={selectedPeriodType}
                                />
                            </div>
                        </Col>
                        {
                            selectedPeriodType && (
                                <Col sm={24} md={6}>
                                    <div style={{ marginTop: '20px' }}>
                                        <div style={{ marginBottom: '5px' }}>Période</div>
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder="Période"
                                            onChange={handleSelectPeriode}
                                            value={selectedPeriod}
                                            picker={selectedPeriodType?.toLocaleLowerCase()}
                                        />
                                    </div>
                                </Col>
                            )
                        }
                        <Col sm={24} md={24}>
                            <Divider style={{ margin: '10px' }} />
                            <Button primary onClick={handleDisplayIndicatorResult}>Afficher les résultats</Button>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    )

    const RenderPlanificationForm = () => (
        <>
            {selectedPlanificationType === ORGANISATION_UNIT && selectedOrganisationUnits && RenderOrganisationUnitForm()}
            {selectedPlanificationType === INDICATOR && selectedIndicators.length > 0 && RenderIndicatorForm()}
        </>
    )

    const RenderDataElementConfigList = () => (
        <>
            {
                mappingConfigs.length > 0 && (
                    <div className='my-shadow' style={{ padding: '10px', background: '#FFF', marginBottom: '2px', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>Liste des configurations des éléments de données </div>
                        <Table
                            dataSource={
                                mappingConfigs.map(mapConf => ({
                                    ...mapConf,
                                    programStageName: mapConf.programStage?.displayName,
                                    indicatorName: mapConf.indicator?.displayName,
                                    dataElementName: mapConf.dataElement?.displayName,
                                    programName: mapConf.program?.displayName,
                                    action: { id: mapConf.id }
                                }))
                            }
                            columns={
                                [
                                    {
                                        title: 'Program',
                                        dataIndex: 'programName'
                                    },
                                    {
                                        title: 'Program Stage',
                                        dataIndex: 'programStageName'
                                    },
                                    {
                                        title: 'Element de donnée',
                                        dataIndex: 'dataElementName'
                                    },
                                    {
                                        title: 'Indicateur',
                                        dataIndex: 'indicatorName'
                                    },
                                    {
                                        title: 'Actions',
                                        dataIndex: 'action',
                                        width: '80px',
                                        render: value => (
                                            <Popconfirm
                                                title="Suppression de la configuration"
                                                description="Voulez-vous vraiment supprimer cette configuration "
                                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                onConfirm={() => handleDeleteConfigItem(value)}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <RiDeleteBinLine style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} />
                                                </div>
                                            </Popconfirm>
                                        )
                                    },
                                ]
                            }
                            size="small"
                        />
                    </div>
                )
            }
        </>
    )

    const RenderSteps = () => (
        <div style={{ width: '100%' }}>
            <Stepper
                style={{ margin: '0px', padding: '0px' }}
                activeStep={selectedStep}
                stepClassName="stepper__step"
                styleConfig={{
                    activeBgColor: '#2c6693',
                    activeTextColor: '#fff',
                    inactiveBgColor: '#fff',
                    inactiveTextColor: '#2c6693',
                    completedBgColor: '#fff',
                    completedTextColor: '#2c6693',
                    size: '40px',
                    fontWeight: 'bold',
                    circleFontSize: '25px',
                    labelFontSize: '16px'
                }}
                className='stepper'
                steps={[
                    {
                        label: 'Configuration',
                    },
                    {
                        label: 'Finalisation',
                    },
                ]}
            />
        </div>
    )

    const handleOkAnalyticComponentModal = () => {
        setInputDataSourceDisplayName(selectedMetaDatas[0]?.name)
        setInputDataSourceID(selectedMetaDatas[0]?.id)
        setSelectedMetaDatas([])
        setVisibleAnalyticComponentModal(false)
    }

    const handleCancelAnalyticComponentModal = () => {
        setSelectedMetaDatas([])
        setVisibleAnalyticComponentModal(false)
    }

    const RenderAnalyticComponentModal = () => visibleAnalyticComponentModal ? (
        <Modal onClose={() => handleCancelAnalyticComponentModal()} large>
            <ModalTitle>
                Source de donnée
            </ModalTitle>
            <ModalContent>
                <div>
                    <DataDimension
                        selectedDimensions={selectedMetaDatas.map(it => ({ ...it, isDeactivated: true }))}
                        onSelect={value => {
                            setSelectedMetaDatas(value?.items?.length > 0 ? [value.items[0]] : [])
                        }}
                        displayNameProp="displayName"
                    />
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button destructive onClick={() => handleCancelAnalyticComponentModal()} icon={<CgCloseO style={{ fontSize: "18px" }} />}>
                        Annuler
                    </Button>
                    <Button primary onClick={() => handleOkAnalyticComponentModal()} icon={<FiSave style={{ fontSize: "18px" }} />}>
                        Enrégistrer
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    ) : <></>


    const RenderDataElementConfigContent = () => <>
        <div className='my-shadow' style={{ padding: '20px', background: '#FFF', marginBottom: '2px', borderRadius: '8px', marginTop: '10px' }}>
            <Row gutter={[10, 10]}>
                <Col md={24}>
                    <div style={{ fontWeight: 'bold' }}>Configurations globales</div>
                </Col>
                <Col md={24}>
                    <div style={{ marginTop: '10px' }}>
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

                {/* <Col md={12}>
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
                </Col> */}

                {/* <Col md={12}>
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
                </Col> */}

                {/* selectedIndicatorGroup && selectedProgramStage && ( */}
                {
                    selectedProgramStage && (
                        <Col md={24} xs={24}>
                            <Divider style={{ margin: '5px auto' }} />

                            {
                                selectedProgramStage && (
                                    <Button icon={isNewMappingMode && <ImCancelCircle style={{ color: '#fff', fontSize: '18px' }} />} primary={!isNewMappingMode ? true : false} destructive={isNewMappingMode ? true : false} onClick={handleAddNewMappingConfig}>
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
                                                    <Col md={12} xs={24}>
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

                                            {/* {
                                                selectedIndicatorGroup && (
                                                    <Col md={12} xs={24}>
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
                                            }  */}
                                            <Col md={10} xs={24}>
                                                <div>
                                                    <div style={{ marginBottom: '5px' }}>Source de donnée</div>
                                                    <Input
                                                        placeholder='Source de donnée'
                                                        style={{ width: '100%' }}
                                                        value={inputDataSourceDisplayName}
                                                        onChange={event => {
                                                            setInputDataSourceDisplayName(''.concat(event.target.value))
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={2} xs={24}>
                                                <div style={{ marginTop: '22px' }}>
                                                    <Button small primary icon={<TbSelect style={{ fontSize: '18px', color: '#fff', }} />} onClick={() => setVisibleAnalyticComponentModal(true)}></Button>
                                                </div>
                                            </Col>
                                            <Col md={24} xs={24}>
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
    </>

    const RenderStepsContent = () => <>
        {
            selectedStep === 0 && (
                <>
                    <Row gutter={[12, 12]}>
                        {selectedSupervisionFiche && (
                            <Col md={24}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                                    <div>
                                        <Button primary small disabled={selectedStep === 0 ? true : false} icon={<BsArrowLeft style={{ color: '#fff', fontSize: '18px' }} />} onClick={() => setSelectedStep(selectedStep - 1)}>Précédent</Button>
                                    </div>
                                    <div style={{ marginLeft: '10px' }}>
                                        <Button icon={<BsArrowRight style={{ color: '#fff', fontSize: '18px' }} />} primary small onClick={() => setSelectedStep(selectedStep + 1)}>Suivant</Button>
                                    </div>
                                </div>
                            </Col>
                        )}
                        <Col sm={24} md={8}>
                            {RenderSupervisionTypeContent()}
                            {selectedSupervisionType && RenderSelectedSupervisionTypeList()}
                            {selectedSupervisionFiche && RenderDataElementConfigContent()}
                        </Col>
                        <Col sm={24} md={16}>
                            {selectedSupervisionFiche && RenderDataElementConfigList()}
                        </Col>
                    </Row>
                </>
            )
        }

        {
            selectedStep === 1 && (
                <>
                    <Row gutter={[10, 10]}>
                        {selectedSupervisionFiche && (
                            <Col md={24}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                                    <div >
                                        <Button primary small icon={<BsArrowLeft style={{ color: '#fff', fontSize: '18px' }} />} onClick={() => setSelectedStep(selectedStep - 1)}>Précédent</Button>
                                    </div>
                                    <div style={{ marginLeft: '10px' }}>
                                        <Button disabled={selectedStep === 1 ? true : false} icon={<BsArrowRight style={{ color: '#fff', fontSize: '18px' }} />} primary small onClick={() => setSelectedStep(selectedStep + 1)}>Suivant</Button>
                                    </div>
                                </div>
                            </Col>
                        )}
                        <Col sm={24} md={8}>
                            {selectedSupervisionFiche && RenderSupervisionPlanificationType()}
                            {selectedPlanificationType === INDICATOR && RenderSupervisionPlanificationIndicatorContent()}
                            {selectedPlanificationType === ORGANISATION_UNIT && RenderSupervisionPlanificationOrganisationUnitContent()}
                        </Col>
                        <Col sm={24} md={16}>
                            {RenderPlanificationForm()}
                        </Col>
                    </Row>
                </>
            )
        }

    </>

    const RenderSupervisionForm = () => (
        <>
            <div style={{ width: '100%' }}>
                {/* {RenderSteps()} */}
                {RenderStepsContent()}
            </div>
        </>
    )

    const initInputFields = () => {
        const newList = []
        for (let org of selectedOrganisationUnits) {
            if (inputFields.map(inp => inp.organisationUnit.id).includes(org.id)) {
                newList.push(
                    inputFields.find(inp => inp.organisationUnit.id === org.id)
                )
            } else {
                newList.push(
                    {
                        organisationUnit: { id: org.id, displayName: org.displayName },
                        program: { id: selectedSupervisionFiche.program?.id, displayName: selectedSupervisionFiche.program?.displayName },
                        fieldConfig: selectedSupervisionFiche.fieldConfig,
                        generationType: selectedSupervisionFiche.generationType,
                        libelle: '',
                        period: null,
                        supervisors: [],
                        otherSupervisors: [],
                        inputOtherSupervisor: ''
                    }
                )
            }
        }
        setInputFields(newList)
    }

    useEffect(() => {
        if (me) {
            loadDataStoreSupervisions()
            loadDataStoreIndicators()
            loadOrganisationUnits()
            loadUsers(me?.organisationUnits?.[0]?.id)
        }
    }, [me])

    useEffect(() => {
        selectedOrganisationUnits && selectedOrganisationUnits?.length > 0 && initInputFields()
    }, [selectedOrganisationUnits])

    return (
        <>
            {RenderTopContent()}
            {
                loadingDataStoreSupervisionConfigs && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CircularLoader small />
                        <span style={{ marginLeft: '10px' }}>Chargement...</span>
                    </div>
                )
            }
            {
                !loadingDataStoreSupervisionConfigs && dataStoreSupervisionConfigs?.length > 0 && (
                    <>
                        <div style={{ padding: '10px', height: '100%' }}>
                            {!isEditionMode && RenderSupervisionList()}
                            {isEditionMode && RenderSupervisionForm()}
                        </div>
                        {RenderFloatingButton()}
                    </>
                )
            }
            {RenderAnalyticComponentModal()}
            {RenderNoticeBox()}
            <MyNotification notification={notification} setNotification={setNotification} />
        </>
    )
}


export default Supervision