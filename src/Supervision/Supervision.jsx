import React, { Component } from 'react'
import { Tree } from 'primereact/tree';
import { Growl } from 'primereact/growl';
import axios from 'axios';
import { ORGANISATION_UNITS_ROUTE } from '../api.routes';
import { NotificationManager } from 'react-notifications';

export class Supervision extends Component {

    constructor(props) {
        super(props)

        this.state = {
            nodes: [],
            selectedNodes: [],
            selectedNodeKeys3: null,
        }
    }

    componentDidMount = () => this.loadOrganisationUnits()

    loadOrganisationUnits = () => {
        axios.get(ORGANISATION_UNITS_ROUTE)
            .then(response => {
                let organisationUnits = response.data.organisationUnits.map(o => {
                    return {
                        key: o.id,
                        label: o.displayName,
                        data: o,
                        children: [],
                        parent: (o.parent !== null && o.parent !== undefined) ? o.parent.id : null
                    }
                })

                const firstParents = organisationUnits.filter(o => o.parent === null);

                firstParents.forEach(o => {
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

                this.setState({ nodes: firstParents })
            }).catch(error => NotificationManager.error(error.message, null, 3000))
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

        // this.growl.show({ severity: 'info', summary: 'Node Selected', detail: event.node.label });
    }

    onUnselect = event => {
        const selectedNodes = this.state.selectedNodes.filter(n => n !== event.node)
        this.setState({ selectedNodes })

        // this.growl.show({ severity: 'info', summary: 'Node Unselected', detail: event.node.label });
    }

    render() {
        return (
            <React.Fragment>

                {this.state.selectedNodes.map(n => console.log(n))}

                <Tree value={this.state.nodes}
                    selectionMode="checkbox"
                    filter={true}
                    selectionKeys={this.state.selectedNodeKeys3}
                    onSelectionChange={e => this.setState({ selectedNodeKeys3: e.value })}
                    onExpand={this.onExpand}
                    onCollapse={this.onCollapse}
                    onSelect={this.onSelect}
                    onUnselect={this.onUnselect} />


            </React.Fragment>
        )
    }
}

export default Supervision
