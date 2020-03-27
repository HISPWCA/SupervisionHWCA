import axios from 'axios';
import { Tree } from 'primereact/tree';
import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { ORGANISATION_UNITS_ROUTE, SUPERVISORS_ROUTE } from '../api.routes';
import { Calendar } from 'primereact/calendar';

export class Supervision extends Component {

    constructor(props) {
        super(props)

        this.state = {
            nodes: [],
            dates: null,
            supervisors: [],
            selectedNodes: [],
            selectedNodeKeys: null,
            selectedSupervisors: [],
            currentSelectedNode: null,
        }
    }

    componentDidMount = () => {
        this.loadSupervisors()
        this.loadOrganisationUnits()
    }

    loadOrganisationUnits = () => {
        axios.get(ORGANISATION_UNITS_ROUTE)
            .then(response => {
                let organisationUnits = response.data.organisationUnits
                    .map(o => {
                        return {
                            key: o.id,
                            label: o.displayName,
                            data: o,
                            children: [],
                            parent: (o.parent !== null && o.parent !== undefined) ? o.parent.id : null
                        }
                    })

                const nodes = organisationUnits.filter(o => o.parent === null);

                nodes.forEach(o => {
                    o.children = organisationUnits.filter(org => org.parent === o.key)

                    o.children.forEach(a => {
                        a.children = organisationUnits.filter(org => org.parent === a.key)

                        a.children.forEach(b => {
                            b.children = organisationUnits.filter(org => org.parent === b.key)

                            b.children.forEach(c => {
                                c.children = organisationUnits.filter(org => org.parent === c.key)

                                c.children.forEach(d => {
                                    d.children = organisationUnits.filter(org => org.parent === d.key)

                                    d.children.forEach(e => {
                                        e.children = organisationUnits.filter(org => org.parent === e.key)

                                        e.children.forEach(f => {
                                            f.children = organisationUnits.filter(org => org.parent === f.key)

                                            f.children.forEach(g => {
                                                g.children = organisationUnits.filter(org => org.parent === g.key)

                                                g.children.forEach(h => {
                                                    h.children = organisationUnits.filter(org => org.parent === h.key)

                                                    h.children.forEach(i => {
                                                        i.children = organisationUnits.filter(org => org.parent === i.key)

                                                        i.children.forEach(j => {
                                                            j.children = organisationUnits.filter(org => org.parent === j.key)

                                                            j.children.forEach(k => {
                                                                k.children = organisationUnits.filter(org => org.parent === k.key)

                                                                k.children.forEach(l => {
                                                                    l.children = organisationUnits.filter(org => org.parent === l.key)

                                                                    l.children.forEach(m => {
                                                                        m.children = organisationUnits.filter(org => org.parent === m.key)

                                                                        m.children.forEach(n => {
                                                                            n.children = organisationUnits.filter(org => org.parent === n.key)

                                                                            n.children.forEach(p => {
                                                                                p.children = organisationUnits.filter(org => org.parent === p.key)

                                                                                p.children.forEach(q => {
                                                                                    q.children = organisationUnits.filter(org => org.parent === q.key)

                                                                                    q.children.forEach(r => {
                                                                                        r.children = organisationUnits.filter(org => org.parent === r.key)

                                                                                        r.children.forEach(s => {
                                                                                            s.children = organisationUnits.filter(org => org.parent === s.key)

                                                                                            s.children.forEach(t => {
                                                                                                t.children = organisationUnits.filter(org => org.parent === t.key)

                                                                                                t.children.forEach(u => {
                                                                                                    u.children = organisationUnits.filter(org => org.parent === u.key)

                                                                                                    u.children.forEach(v => {
                                                                                                        v.children = organisationUnits.filter(org => org.parent === v.key)

                                                                                                        v.children.forEach(w => {
                                                                                                            w.children = organisationUnits.filter(org => org.parent === w.key)

                                                                                                            w.children.forEach(x => {
                                                                                                                x.children = organisationUnits.filter(org => org.parent === x.key)

                                                                                                                x.children.forEach(y => {
                                                                                                                    y.children = organisationUnits.filter(org => org.parent === y.key)

                                                                                                                    y.children.forEach(z => {
                                                                                                                        z.children = organisationUnits.filter(org => org.parent === z.key)
                                                                                                                    })
                                                                                                                })
                                                                                                            })
                                                                                                        })
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        })
                                                                                    })
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })

                this.setState({ nodes })
            }).catch(error => NotificationManager.error(error.message, null, 3000))
    }

    loadSupervisors = () => {
        axios.get(SUPERVISORS_ROUTE)
            .then(response => this.setState({ supervisors: response.data.users }))
            .catch(error => NotificationManager.error(error.message, null, 3000))
    }

    onExpand = event => {
        // this.growl.show({ severity: 'success', summary: 'Node Expanded', detail: event.node.label });
    }

    onCollapse = event => {
        // this.growl.show({ severity: 'success', summary: 'Node Collapsed', detail: event.node.label });
    }

    onSelect = event => {
        const selectedNodes = [...this.state.selectedNodes]
        selectedNodes.push(event.node)
        this.setState({ selectedNodes })
    }

    onUnselect = event => {
        const selectedNodes = this.state.selectedNodes.filter(n => n !== event.node)
        this.setState({ selectedNodes })
    }

    handleOrgsUnitSelection = currentSelectedNode => this.setState({ currentSelectedNode: null }, () => this.setState({ currentSelectedNode }))

    orgUnitClassNameProvider = organisationUnit => this.state.currentSelectedNode !== null && this.state.currentSelectedNode.key === organisationUnit.key ? 'm-3 p-3 text-left Settings SelectedSetting' : 'm-3 p-3 text-left Settings'

    displaySelectedOrgUnits = () => {
        if (this.state.selectedNodes.length > 0) {
            return (
                <div className="col">
                    <div className="font-weight-bold">Selected Org. Units</div>

                    {this.state.selectedNodes.map(o => {
                        return (
                            <div
                                onClick={() => this.handleOrgsUnitSelection(o)}
                                className={this.orgUnitClassNameProvider(o)}
                                key={o.key}>
                                {o.label}
                            </div>
                        )
                    })}
                </div>
            )
        }
    }

    displayForms = () => {
        if (this.state.currentSelectedNode !== null) {
            return (
                <div className="col">
                    <div className="font-weight-bold">Select Period</div>

                    <Calendar
                        value={this.state.dates}
                        onChange={(e) => this.setState({ dates: e.value })}
                        selectionMode="range"
                        readOnlyInput={true} />

                    <div className="font-weight-bold mt-3">Select Supervisors</div>
                    {this.displaySupervisors()}
                </div>
            )
        }
    }

    handleSupevisorSelection = supervisor => {
        const selectedSupervisors = [...this.state.selectedSupervisors]
        selectedSupervisors.push(supervisor)

        this.setState({ selectedSupervisors })
    }

    displaySupervisors = () => {
        if (this.state.currentSelectedNode !== null && this.state.supervisors.length > 0) {
            return (
                <div className="col">
                    {this.state.supervisors
                        .filter(su => !this.state.selectedSupervisors.map(s => s.id).includes(su.id))
                        .map(s => {
                            return <div key={s.id} className="mt-3 p-3 text-left Settings" onClick={() => this.handleSupevisorSelection(s)}>{s.displayName}</div>
                        })}
                </div>
            )
        }
    }

    displaySelectedSupervisors = () => {
        if (this.state.currentSelectedNode !== null && this.state.selectedSupervisors.length > 0) {
            return (
                <div className="col">
                    {this.state.selectedSupervisors.map(s => {
                        return <div key={s.id} className="m-3 p-3 text-left Settings">{s.displayName}</div>
                    })}
                </div>
            )
        }
    }

    render() {
        return (
            <React.Fragment>

                <div className="row m-3 text-left">
                    <div className="col">
                        <div className="font-weight-bold">Organisation Units</div>

                        <Tree value={this.state.nodes}
                            selectionMode="checkbox"
                            filter={true}
                            selectionKeys={this.state.selectedNodeKeys3}
                            onSelectionChange={e => this.setState({ selectedNodeKeys3: e.value })}
                            onExpand={this.onExpand}
                            onCollapse={this.onCollapse}
                            onSelect={this.onSelect}
                            onUnselect={this.onUnselect} />

                    </div>

                    {this.displaySelectedOrgUnits()}

                    {this.displayForms()}

                    {this.displaySelectedSupervisors()}
                </div>

            </React.Fragment>
        )
    }
}

export default Supervision
