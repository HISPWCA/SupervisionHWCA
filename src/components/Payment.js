import { useState, useEffect } from 'react'
import { Button } from "@dhis2/ui"
import { Card, Col, DatePicker, Divider, Radio, Row, Select } from "antd"
import { API_BASE_ROUTE, ORGANISATION_UNITS_ROUTE, TRACKED_ENTITY_INSTANCES_ROUTE } from "../utils/api.routes"
import { ALL, ASC_GF_RAPPORT, DISPLAY_SUPERVISIONS, DISPLAY_SUPERVISORS, INVALIDE, NOTICE_BOX_DEFAULT, NOTICE_BOX_WARNING, NOTIFICATON_CRITICAL, PENDING, SUPERVISOR_RAPPORT, VALIDE } from "../utils/constants"
import translate from "../utils/translator"
import OrganisationUnitsTree from "./OrganisationUnitsTree"
import { BsCheckCircle } from 'react-icons/bs'
import { IoWarningOutline } from 'react-icons/io5'
import { MdPendingActions } from 'react-icons/md'
import { IoLogoBuffer } from 'react-icons/io'
import { MantineReactTable } from 'mantine-react-table'
import MyNotification from './MyNotification'


import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import axios from 'axios'
import { loadDataStore } from '../utils/functions'

const quarterOfYear = require('dayjs/plugin/quarterOfYear')
const weekOfYear = require('dayjs/plugin/weekOfYear')

dayjs.extend(weekOfYear)
dayjs.extend(quarterOfYear)
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.locale('fr-FR')


const Payment = ({ me }) => {

    const [organisationUnits, setOrganisationUnits] = useState([])
    const [notification, setNotification] = useState({ show: false, message: null, type: null })
    const [dataStoreSupervisionConfigs, setDataStoreSupervisionConfigs] = useState([])

    const [results, setResults] = useState([])
    const [nbrTotalSupervisionValide, setNbrTotalSupervisionValide] = useState(0)
    const [nbrTotalSupervisionNonValide, setNbrTotalSupervisionNonValide] = useState(0)
    const [nbrTotalSupervision, setNbrTotalSupervision] = useState(0)
    const [primeTotal, setPrimeTotal] = useState(0)

    const montant = 5000 // montant a payé aux superviseurs
    const fraisMobileMoney = 1 // Le frais est en pourcentage

    const [selectedOrganisationUnit, setSelectedOrganisationUnit] = useState(null)
    const [selectedRapportToDisplay, setSelectedRapportToDisplay] = useState(SUPERVISOR_RAPPORT)
    const [selectedPeriod, setSelectedPeriod] = useState(dayjs(new Date()))
    const [selectedReportType, setSelectedReportType] = useState(ALL)
    const [selectedTypeListToDisplay, setSelectedTypeListToDisplay] = useState(DISPLAY_SUPERVISORS)
    const [selectedSupervisionsConfigProgram, setSelectedSupervisionConfigProgram] = useState(null)

    const [loadingProcessing, setLoadingProcessing] = useState(false)
    const [loadingOrganisationUnits, setLoadingOrganisationUnits] = useState(false)
    const [loadingDataStoreSupervisionConfigs, setLoadingDataStoreSupervisionConfigs] = useState(false)


    const flatDeep = arr => arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val) : val), [])


    const loadTEIs = async () => {
        try {
            setLoadingProcessing(false)

            if (!selectedSupervisionsConfigProgram?.program?.id)
                throw new Error(translate('Veuillez_Selectionner_Un_Programme'))

            if (!selectedPeriod)
                throw new Error(translate('Veuillez_Selectionner_Periode'))

            if (!selectedOrganisationUnit)
                throw new Error(translate('Unite_Organisation_Obligatoire'))

            if (!selectedSupervisionsConfigProgram?.attributeName?.id)
                throw new Error(translate('Attribute_Nom'))

            const TEI_URL = `${TRACKED_ENTITY_INSTANCES_ROUTE}.json?program=${selectedSupervisionsConfigProgram?.program?.id}&ou=${selectedOrganisationUnit?.id}&ouMode=DESCENDANTS&order=created:desc&fields=*,enrollments[*]&paging=false`
            const teiResponse = await axios.get(TEI_URL)
            const trackedEntityInstances = teiResponse.data.trackedEntityInstances

            const EVENT_REPORT_URL = API_BASE_ROUTE
                .concat('/analytics/events/aggregate/o0eEDjAe2Ae.json?dimension=pe:')
                .concat(dayjs(selectedPeriod).format('YYYYMM'))
                .concat('&dimension=reckBszm8Ya:Cn9tb8RhoUl;iNAASUDrPpn;nr2rGqWAMNr;ZTx960UbAOd;wGtkSrnEmOI;mqZP6KOfkuN')
                .concat('&dimension=ou:LEVEL-6;')
                .concat(selectedOrganisationUnit?.id)
                .concat('&stage=qozflIwuTf6&displayProperty=NAME&hierarchyMeta=true&outputType=EVENT&outputIdScheme=UID')
            const aggregateEventResponse = await axios.get(EVENT_REPORT_URL)
            const events = flatDeep(trackedEntityInstances.map(tei => tei.enrollments.map(enrollment => enrollment.events))).filter(e =>
                e.eventDate !== undefined &&
                e.eventDate !== null &&
                e.status !== 'SCHEDULE' &&
                e.programStage === 'qozflIwuTf6'
            ).map(event => {
                console.log("Event : ", event)
                event.tmpDate = dayjs(event.eventDate).format('YYYY-MM')
                return event
            })
                .filter(event => dayjs(event.tmpDate).format('YYYY-MM') === dayjs(selectedPeriod).format('YYYY-MM'))

            const payload = {}
            let results = []

            for (let event of events) {

                let hierarchyPaths = ''
                let district = ''
                let region = ''
                let zone = ''
                let zoneID = ''
                let formation = ''
                let nbrSupervisionsValid = 0
                let nbrSupervisionsNonValid = 0
                let nbrSupervisionsEnAttente = 0
                let nbrSupervisions = 0

                let supervisorName = event.dataValues.find(dataValue => dataValue.dataElement === selectedSupervisionsConfigProgram?.attributeName?.id)?.value || ''
                supervisorName = supervisorName ? supervisorName : event.storedBy

                if (aggregateEventResponse.data) {
                    hierarchyPaths = aggregateEventResponse.data.metaData?.ouHierarchy[`${event.orgUnit}`]
                    const hierachyArray = hierarchyPaths?.split('/')

                    if (hierachyArray) {
                        region = aggregateEventResponse.data.metaData?.items[`${hierachyArray[1]}`]?.name || ''
                        district = aggregateEventResponse.data.metaData?.items[`${hierachyArray[2]}`]?.name || ''
                        formation = aggregateEventResponse.data.metaData?.items[`${hierachyArray[3]}`]?.name || ''
                    }

                    let post_id = ''
                    for (let r of aggregateEventResponse.data.rows) {
                        if (event.orgUnit === r[2]) {
                            post_id = r[1]
                        }
                    }
                    if (post_id) {
                        zone = aggregateEventResponse.data.metaData?.items[`${post_id}`]?.name || ''
                        zoneID = post_id
                    }
                }


                let key_string = supervisorName?.replaceAll(' ', '_').concat('_').concat(formation?.replaceAll(' ', '_'))
                key_string = key_string?.toLowerCase()

                if (payload[`${key_string}`]?.nbrSupervisionsValid) {
                    if (event.dataValues.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value === "true") {
                        nbrSupervisionsValid = 1 + payload[`${key_string}`]?.nbrSupervisionsValid
                    }
                } else {
                    if (event.dataValues.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value === "true") {
                        nbrSupervisionsValid = 1
                    }
                }

                if (payload[`${key_string}`]?.nbrSupervisionsNonValid) {
                    if (event.dataValues.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value === "false") {
                        nbrSupervisionsNonValid = 1 + payload[`${key_string}`]?.nbrSupervisionsNonValid
                    }
                } else {
                    if (event.dataValues.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value === "false") {
                        nbrSupervisionsNonValid = 1
                    }
                }

                if (payload[`${key_string}`]?.nbrSupervisionsEnAttente) {
                    if (!event.dataValues.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value) {
                        nbrSupervisionsEnAttente = 1 + payload[`${key_string}`]?.nbrSupervisionsEnAttente
                    }
                } else {
                    if (!event.dataValues?.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value) {
                        nbrSupervisionsEnAttente = 1
                    }
                }

                nbrSupervisions = nbrSupervisionsValid + nbrSupervisionsNonValid + nbrSupervisionsEnAttente

                const trackedEntityInstance = trackedEntityInstances.find(tei => tei.trackedEntityInstance === event.trackedEntityInstance)
                const ascName = trackedEntityInstance.attributes.find(attribute => attribute.attribute === 'Wjb3loRDIpE')?.value
                const ascType = trackedEntityInstance.attributes.find(attribute => attribute.attribute === 'RyJDoYBq0KZ')?.value
                const ascPhoneNumber = trackedEntityInstance.attributes.find(attribute => attribute.attribute === 'mVOHrA5DRVl')?.value

                const mobileMoney = fraisMobileMoney // Sa doit aller dans la configuration ( ça c'est le mobile money d'un superviseurs )
                // const bonus = (parseFloat(this.state.globalSettings.supBonus) * parseFloat(nbrSupervisions)) || 0
                const bonus = 0
                const totalBonus = calculateTotalMoneyUsingPercentageFees(montant + bonus) || 0

                const e = {}

                e.district = district
                e.region = region
                e.ascName = ascName
                e.formationSanitaire = formation


                const payloadTMP = {
                    supervisorName: supervisorName,
                    nbrSupervisions,
                    nbrSupervisionsNonValid,
                    nbrSupervisionsValid,
                    nbrSupervisionsEnAttente,
                    ascType,
                    ascPhoneNumber,
                    totalBonus,
                    mobileMoney,
                    bonus,
                    actions: {
                        orgUnit: event.orgUnit,
                        program: event.program,
                        programStage: event.programStage,
                        trackedEntityInstance: event.trackedEntityInstance
                    },
                }

                if (formation)
                    payloadTMP.formationSanitaire = formation

                if (district)
                    payloadTMP.district = district

                if (region)
                    payloadTMP.region = region

                if (zone)
                    payloadTMP.zone = zone

                if (zoneID)
                    payloadTMP.zoneID = zoneID

                if (mobileMoney)
                    payloadTMP.mobileMoney = mobileMoney


                if (payload[`${key_string}`]?.supervisions) {

                    const sNonValid = event.dataValues?.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value === "false" ? 1 : 0
                    const sValid = event.dataValues?.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value === "true" ? 1 : 0
                    const sEnAttente = !event.dataValues?.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value ? 1 : 0

                    const sMobileMoney = fraisMobileMoney // Sa doit aller dans la configuration ( ça c'est le mobile money d'un superviseurs )
                    // const bonus = (parseFloat(this.state.globalSettings.supBonus) * parseFloat(nbrSupervisions)) || 0
                    const sBonus = 0
                    const sTotalBonus = calculateTotalMoneyUsingPercentageFees(montant + sBonus) || 0

                    payloadTMP.supervisions = [
                        ...payload[`${key_string}`]?.supervisions,
                        {
                            event: event.event,
                            eventDate: event.eventDate,
                            enrollment: event.enrollment,
                            tmpDate: event.tmpDate,
                            status: event.status,
                            storedBy: event.storedBy,

                            mobileMoney: sMobileMoney,
                            totalBonus: sTotalBonus,
                            bonus: sBonus,

                            zone: payloadTMP.zone,
                            zoneID: payloadTMP.zoneID,
                            formationSanitaire: payloadTMP.formationSanitaire,
                            district: payloadTMP.district,
                            region: payloadTMP.region,
                            supervisorName: payloadTMP.supervisorName,
                            actions: payloadTMP.actions,
                            statusSupervision: event.dataValues?.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value === "true" ?
                                VALIDE : event.dataValues.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value === "false" ? INVALIDE : PENDING,

                            nbrSupervisionsNonValid: sNonValid,
                            nbrSupervisionsValid: sValid,
                            nbrSupervisionsEnAttente: sEnAttente,
                            nbrSupervisions: sNonValid + sValid + sEnAttente,
                        }
                    ]

                } else {
                    const sNonValid = event.dataValues?.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value === "false" ? 1 : 0
                    const sValid = event.dataValues?.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value === "true" ? 1 : 0
                    const sEnAttente = !event.dataValues?.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value ? 1 : 0

                    const sMobileMoney = fraisMobileMoney // Sa doit aller dans la configuration ( ça c'est le mobile money d'un superviseurs )
                    // const bonus = (parseFloat(this.state.globalSettings.supBonus) * parseFloat(nbrSupervisions)) || 0
                    const sBonus = 0
                    const sTotalBonus = calculateTotalMoneyUsingPercentageFees(montant + sBonus) || 0

                    payloadTMP.supervisions = [
                        {
                            event: event.event,
                            eventDate: event.eventDate,
                            enrollment: event.enrollment,
                            tmpDate: event.tmpDate,
                            status: event.status,
                            storedBy: event.storedBy,

                            mobileMoney: sMobileMoney,
                            totalBonus: sTotalBonus,
                            bonus: sBonus,

                            zone: payloadTMP.zone,
                            zoneID: payloadTMP.zoneID,
                            formationSanitaire: payloadTMP.formationSanitaire,
                            district: payloadTMP.district,
                            region: payloadTMP.region,
                            supervisorName: payloadTMP.supervisorName,
                            actions: payloadTMP.actions,

                            statusSupervision: event.dataValues?.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value === "true" ?
                                VALIDE : event.dataValues.find(dataValue => dataValue.dataElement === 'j3ApJnVrfdj')?.value === "false" ? INVALIDE : PENDING,

                            nbrSupervisionsNonValid: sNonValid,
                            nbrSupervisionsValid: sValid,
                            nbrSupervisionsEnAttente: sEnAttente,
                            nbrSupervisions: sNonValid + sValid + sEnAttente,
                        }
                    ]
                }

                payload[`${key_string}`] = payloadTMP
            }

            results = Object.entries(payload).reduce((prev, [key, value]) => {
                return prev.concat(value)
            }, [])

            setResults(results)
            setLoadingProcessing(false)

        } catch (err) {
            console.log(err)
            setLoadingProcessing(false)
            cleanResultStates()
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const cleanResultStates = () => {
        setNbrTotalSupervisionValide(0)
        setNbrTotalSupervisionNonValide(0)
        setNbrTotalSupervision(0)
        setPrimeTotal(0)
        setResults([])
    }


    const getFinalResult = () => {
        let list = []

        if (selectedRapportToDisplay === DISPLAY_SUPERVISIONS) {
            list = results
                .reduce((prev, curr) => {
                    return prev.concat(curr.supervisions || [])
                }, [])
                .filter(result => {
                    return selectedReportType === ALL ? true : selectedReportType === result.statusSupervision
                })
            // .filter(result =>
            //     this.state.selectedZones.length === 0 ||
            //     (this.state.selectedZones.length > 0 && this.state.selectedZones.includes(result.zoneID))
            // )
        }

        if (selectedRapportToDisplay === DISPLAY_SUPERVISORS) {
            // list = this.state.displayReportResults ? this.state.results
            //     .filter(result => {
            //         if (this.state.displaySupReport)
            //             return true
            //         return this.state.displayASCReport && this.state.displayReportSingleBoxType === ALL ? true : this.state.displayReportSingleBoxType === result.status
            //     })
            //     .filter(result => (this.state.displayASCReport && result.ascType === 'ASC') || (this.state.displayGFReport && result.ascType === 'GF'))
            //     .filter(result =>
            //         this.state.selectedZones.length === 0 ||
            //         (this.state.selectedZones.length > 0 && this.state.selectedZones.includes(result.zoneID))
            //     )
            //     .filter(result => result.nbrSupervisionsValid !== 0)
            //     : [] 

            list = results
                .reduce((prev, curr) => {
                    return prev.concat(curr.supervisions || [])
                }, [])
                .filter(result => {
                    return selectedReportType === ALL ? true : selectedReportType === result.statusSupervision
                })
                .filter(result => result.nbrSupervisionsValid !== 0)
        }

        return list
    }


    const showTotalValidSupervision = () => {

        const result = getFinalResult()

        let nbrTotalSupervisionValide = 0
        if (selectedRapportToDisplay === DISPLAY_SUPERVISORS) {
            for (let item of result) {
                nbrTotalSupervisionValide = nbrTotalSupervisionValide + item.nbrSupervisionsValid
            }

            return nbrTotalSupervisionValide
        } else {
            for (let item of result) {
                nbrTotalSupervisionValide = nbrTotalSupervisionValide + (item.status === VALIDE ? 1 : 0)
            }

            return nbrTotalSupervisionValide
        }
    }

    const calculateTotalMoneyUsingPercentageFees = money => {
        let price = money
        if (money && fraisMobileMoney) {
            const tmpPrice = (parseFloat(money) * parseFloat(fraisMobileMoney)) / 100
            price = parseFloat(money) - parseFloat(tmpPrice)
        }
        return price
    }

    const loadDataStoreSupervisionConfigs = async () => {
        try {
            setLoadingDataStoreSupervisionConfigs(true)
            const response = await loadDataStore(process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY, null, null, null)
            if (!response || response.length === 0) {
                throw new Error(translate('Aucun_Programme_Configurer'))
            }

            setDataStoreSupervisionConfigs(response)
            setLoadingDataStoreSupervisionConfigs(false)
        }
        catch (err) {
            setLoadingDataStoreSupervisionConfigs(false)
            setNotification({
                show: true,
                message: err.response?.data?.message || err.message,
                type: NOTIFICATON_CRITICAL
            })
        }
    }

    const loadOrganisationUnits = async () => {
        try {
            if (!me)
                throw new Error(translate('Erreur_Recuperation_Me'))

            setLoadingOrganisationUnits(true)

            const userOrganisationUnitId = me.organisationUnits?.length > 0 && me.organisationUnits?.[0].id

            if (userOrganisationUnitId) {
                const response = await axios.get(ORGANISATION_UNITS_ROUTE)
                setOrganisationUnits(response.data?.organisationUnits)
                setLoadingOrganisationUnits(false)
            }
        }
        catch (err) {
            setLoadingOrganisationUnits(false)
            console.log(err)
        }
    }

    const handleSelectSupervisionProgramConfigForTracker = (value) => {
        if (value) {
            const supFound = dataStoreSupervisionConfigs.find(d => d.program?.id === value)
            setAllSupervisionsFromTracker([])
            setSelectedSupervisionConfigProgram(supFound)
        }
    }

    const RenderTopContent = () => (
        <>
            <div style={{ padding: '10px 20px', borderBottom: '1px solid #ccc', background: '#FFF', position: 'sticky', top: 0, zIndex: 1000 }}>
                <div style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '15px' }}>{translate('Paiements')}</div>
            </div>
        </>
    )

    const RenderRapportTypeTitle = () => (
        <>
            <div style={{
                fontSize: "20px",
                marginTop: "30px",
                marginBottom: "20px",
                fontWeight: "bold",
                textAlign: "center",
                textDecoration: "underline"
            }}>
                {selectedRapportToDisplay === SUPERVISOR_RAPPORT && 'Rapports Superviseurs'}
                {selectedRapportToDisplay === ASC_GF_RAPPORT && 'Rapports ASC / GF'}
            </div>
        </>
    )


    const handleSelectedPeriod = (event) => {
        setSelectedPeriod(dayjs((event)))
    }

    const RenderSingleValuesBox = () => (
        <>
            <div style={{ marginTop: '20px' }}>
                <Row gutter={[8, 8]}>
                    <Col md={5} sm={24}>
                        <Card className='my-shadow' size='small' bodyStyle={{ padding: '0px' }}>
                            <div
                                style={{
                                    borderLeft: "6px solid #0acf97",
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '10px'
                                }}
                            >
                                <div style={{ color: "#0acf97", fontSize: "25px", fontWeight: 'bold' }}> {showTotalValidSupervision()}</div>
                                <div style={{ marginLeft: '10px' }}>
                                    <div style={{ fontSize: "13px", fontWeight: 'bold' }}>Rapports Valides</div>
                                    <div style={{ fontSize: "12px", color: '#00000080' }}>{dayjs(selectedPeriod).format('DD/YYYY')}</div>
                                </div>
                                <div style={{ marginLeft: '10px' }}><BsCheckCircle style={{ fontSize: "25px", color: "#0acf97" }} /></div>
                            </div>
                        </Card>
                    </Col>

                    <Col md={4} sm={24}>
                        <Card className='my-shadow' size='small' bodyStyle={{ padding: '0px' }}>
                            <div
                                style={{
                                    borderLeft: "6px solid #d62828",
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '10px'
                                }}
                            >
                                <div style={{ color: "#d62828", fontSize: "25px", fontWeight: 'bold' }}> 789</div>
                                <div style={{ marginLeft: '10px' }}>
                                    <div style={{ fontSize: "13px", fontWeight: 'bold' }}>Rapports Invalides</div>
                                    <div style={{ fontSize: "12px", color: '#00000080' }}>12/2023 </div>
                                </div>
                                <div style={{ marginLeft: '10px' }}><IoWarningOutline style={{ fontSize: "25px", color: "#d62828" }} /></div>
                            </div>
                        </Card>
                    </Col>

                    <Col md={5} sm={24}>

                        <Card className='my-shadow' size='small' bodyStyle={{ padding: '0px' }}>
                            <div
                                style={{
                                    borderLeft: "6px solid #fb8500",
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '10px'
                                }}
                            >
                                <div style={{ color: "#fb8500", fontSize: "25px", fontWeight: 'bold' }}> 76</div>
                                <div style={{ marginLeft: '10px' }}>
                                    <div style={{ fontSize: "13px", fontWeight: 'bold' }}>Papports en Attentes</div>
                                    <div style={{ fontSize: "12px", color: '#00000080' }}>12/2023 </div>
                                </div>
                                <div style={{ marginLeft: '10px' }}><MdPendingActions style={{ fontSize: "25px", color: "#fb8500" }} /></div>
                            </div>
                        </Card>
                    </Col>

                    <Col md={5} sm={24}>


                        <Card className='my-shadow' size='small' bodyStyle={{ padding: '0px' }}>
                            <div
                                style={{
                                    borderLeft: "6px solid #0096C7",
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '10px'
                                }}
                            >
                                <div style={{ color: "#0096C7", fontSize: "25px", fontWeight: 'bold' }} > 876</div>
                                <div style={{ marginLeft: '10px' }}>
                                    <div style={{ fontSize: "13px", fontWeight: 'bold' }}>Supervision Totales</div>
                                    <div style={{ fontSize: "12px", color: '#00000080' }}>12/2023 </div>
                                </div>
                                <div style={{ marginLeft: '10px' }}><IoLogoBuffer style={{ fontSize: "25px", color: "#0096C7" }} /></div>
                            </div>
                        </Card>

                    </Col>

                    <Col md={5} sm={24}>

                        <Card className='my-shadow' size='small' bodyStyle={{ padding: '0px' }}>
                            <div
                                style={{
                                    borderLeft: "6px solid #0acf97",
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '10px'
                                }}
                            >
                                <div style={{ color: "#0acf97", fontSize: "25px", fontWeight: 'bold' }}> 2346</div>
                                <div style={{ marginLeft: '10px' }}>
                                    <div style={{ fontSize: "13px", fontWeight: 'bold' }}>Prime totale</div>
                                    <div style={{ fontSize: "12px", color: '#00000080' }}>12/2023 </div>
                                </div>
                                <div style={{ marginLeft: '10px' }}><span style={{ fontSize: "20px", color: "#0acf97" }} >CFA</span></div>
                            </div>

                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )

    const RenderTopFilter = () => (
        <div>
            <Card size="small" className="my-shadow">
                <Row gutter={[10, 10]}>
                    <Col md={5} sm={24}>
                        <div style={{ marginBottom: '2px' }}>{translate('Programme')}</div>
                        <Select
                            placeholder={translate('Programme')}
                            onChange={handleSelectSupervisionProgramConfigForTracker}
                            value={selectedSupervisionsConfigProgram?.program?.id}
                            style={{ width: '100%' }}
                            options={dataStoreSupervisionConfigs.map(d => ({ value: d.program?.id, label: d.program?.displayName }))}
                            loading={loadingDataStoreSupervisionConfigs}
                        />
                    </Col>
                    <Col md={5} sm={24}>
                        <div>
                            <div style={{ marginBottom: '2px' }}>{translate('Unites_Organisation')}</div>
                            <OrganisationUnitsTree
                                meOrgUnitId={me?.organisationUnits[0]?.id}
                                orgUnits={organisationUnits}
                                currentOrgUnits={selectedOrganisationUnit}
                                setCurrentOrgUnits={setSelectedOrganisationUnit}
                                loadingOrganisationUnits={loadingOrganisationUnits}
                                setLoadingOrganisationUnits={setLoadingOrganisationUnits}
                            />
                        </div>
                    </Col>

                    <Col md={4} sm={24}>
                        <div>
                            <div className="">{translate('Periode')}</div>
                            <DatePicker
                                picker="month"
                                style={{ width: '100%' }}
                                placeholder={translate('Periode')}
                                onChange={handleSelectedPeriod}
                                value={selectedPeriod}
                            />
                        </div>
                    </Col>
                    <Col md={5} sm={12}>
                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            <Button onClick={loadTEIs} loading={selectedRapportToDisplay === SUPERVISOR_RAPPORT ? loadingProcessing : false} disable={selectedPeriod && selectedOrganisationUnit && selectedSupervisionsConfigProgram ? false : true} primary>Mettre à jour Rapports Superviseurs</Button>
                        </div>
                    </Col>
                    <Col md={5} sm={12}>
                        <div style={{ marginTop: '20px' }}>
                            <Button primary>Mettre à jour Rapports des ASC / GF</Button>
                        </div>
                    </Col>

                    <Col md={24}>
                        <div style={{ color: "#0096c7", background: '#eeeeee', padding: '5px' }}>
                            <span style={{ background: "#ff5400", color: "#fff", fontSize: "15px", borderRadius: "15px", fontWeight: 'bold', padding: '5px' }} > period selectionner </span>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    )

    const datas = [
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

    const columns = [
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
    ]

    const getReportTypeName = type => {
        if (type === ALL)
            return 'Tous les Rapports'

        if (type === VALIDE)
            return 'Rapports Validés'

        if (type === INVALIDE)
            return 'Rapports Invalidés'

        if (type === PENDING)
            return 'Rapports en Attentes'

    }

    const RenderTable = () => (
        <div style={{ marginTop: '30px' }}>
            <Card className="my-shadow" size="small" style={{ padding: '0px' }}>
                <div style={{ padding: '10px' }}>
                    <Row gutter={[10, 10]}>
                        <Col md={4}>
                            <Select
                                style={{ width: '100%' }}
                                value={selectedReportType}
                                onChange={value => setSelectedReportType(value)}
                                optionFilterProp="label"
                                options={
                                    [
                                        { value: ALL, label: getReportTypeName(ALL) },
                                        { value: VALIDE, label: getReportTypeName(VALIDE) },
                                        { value: INVALIDE, label: getReportTypeName(INVALIDE) },
                                        { value: PENDING, label: getReportTypeName(PENDING) }
                                    ]
                                }
                            />
                        </Col>
                        <Col md={12}>
                            <Radio.Group onChange={event => setSelectedTypeListToDisplay(event.target.value)} value={selectedTypeListToDisplay}>
                                <Radio value={DISPLAY_SUPERVISORS}>{translate('Display_Supervisors')}</Radio>
                                <Radio value={DISPLAY_SUPERVISIONS}>{translate('Display_Supervisions')}</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                </div>
                <Divider style={{ marginTop: '0px', marginBottom: '0px' }} />
                <div style={{ padding: '10px' }}>
                    <MantineReactTable
                        enableStickyHeader
                        columns={columns}
                        data={datas}
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
                </div>
            </Card>
        </div>
    )


    useEffect(() => {
        loadOrganisationUnits()
        loadDataStoreSupervisionConfigs()
    }, [])

    return (
        <>
            {console.log("Results: ", results)}
            {RenderTopContent()}
            <div style={{ padding: '10px', height: '100%', marginBottom: '10px' }}>
                {RenderTopFilter()}
                {RenderRapportTypeTitle()}
                {RenderSingleValuesBox()}
                {RenderTable()}
            </div>
            <MyNotification notification={notification} setNotification={setNotification} />
        </>
    )
}

export default Payment