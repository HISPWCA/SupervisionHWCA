import { useState, useEffect } from 'react'
import { Button } from "@dhis2/ui"
import { Card, Col, DatePicker, Divider, Radio, Row, Select } from "antd"
import { ORGANISATION_UNITS_ROUTE } from "../utils/api.routes"
import { ALL, ASC_GF_RAPPORT, DISPLAY_SUPERVISIONS, DISPLAY_SUPERVISORS, INVALIDE, NOTICE_BOX_DEFAULT, PENDING, SUPERVISOR_RAPPORT, VALIDE } from "../utils/constants"
import translate from "../utils/translator"
import OrganisationUnitsTree from "./OrganisationUnitsTree"
import { BsCheckCircle } from 'react-icons/bs'
import { IoWarningOutline } from 'react-icons/io5'
import { MdPendingActions } from 'react-icons/md'
import { IoLogoBuffer } from 'react-icons/io'
import { MantineReactTable } from 'mantine-react-table'

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import axios from 'axios'

const quarterOfYear = require('dayjs/plugin/quarterOfYear')
const weekOfYear = require('dayjs/plugin/weekOfYear')

dayjs.extend(weekOfYear)
dayjs.extend(quarterOfYear)
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.locale('fr-FR')


const Payment = ({ me }) => {

    const [organisationUnits, setOrganisationUnits] = useState([])

    const [selectedOrganisationUnits, setSelectedOrganisationUnits] = useState(null)
    const [selectedRapportToDisplay, setSelectedRapportToDisplay] = useState(SUPERVISOR_RAPPORT)
    const [selectedPeriod, setSelectedPeriod] = useState(dayjs(new Date()))
    const [selectedReportType, setSelectedReportType] = useState(ALL)
    const [selectedTypeListToDisplay, setSelectedTypeListToDisplay] = useState(DISPLAY_SUPERVISORS)

    const [loadingOrganisationUnits, setLoadingOrganisationUnits] = useState(false)



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
                                <div style={{ color: "#0acf97", fontSize: "25px", fontWeight: 'bold' }}> 78789</div>
                                <div style={{ marginLeft: '10px' }}>
                                    <div style={{ fontSize: "13px", fontWeight: 'bold' }}>Rapports Valides</div>
                                    <div style={{ fontSize: "12px", color: '#00000080' }}>12/2023 </div>
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
                    <Col md={6} sm={24}>
                        <div>
                            <div style={{ marginBottom: '2px' }}>{translate('Unites_Organisation')}</div>
                            <OrganisationUnitsTree
                                meOrgUnitId={me?.organisationUnits[0]?.id}
                                orgUnits={organisationUnits}
                                currentOrgUnits={selectedOrganisationUnits}
                                setCurrentOrgUnits={setSelectedOrganisationUnits}
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
                            <Button primary>Mettre à jour Rapports Superviseurs</Button>
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
    }, [])

    return (
        <>
            {RenderTopContent()}
            <div style={{ padding: '10px', height: '100%', marginBottom: '10px' }}>
                {RenderTopFilter()}
                {RenderRapportTypeTitle()}
                {RenderSingleValuesBox()}
                {RenderTable()}
            </div>
        </>
    )
}

export default Payment