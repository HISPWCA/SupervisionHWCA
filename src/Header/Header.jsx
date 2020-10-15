import React, { Component } from 'react'

class Header extends Component {

    state = {
        displaySharingOptions: false
    }

    render = () =>
        <React.Fragment>
            <div className="row alert alert-primary">
                <div className="col text-left">
                    <h1>
                        {this.props.title}
                    </h1>
                </div>

                <div className="col text-right">
                    <button
                        onClick={() => this.setState({ displaySharingOptions: !this.state.displaySharingOptions })}
                        className={this.state.displaySharingOptions ? 'btn btn-sm btn-link btn-secondary my-2' : 'btn btn-sm btn-link btn-primary my-2'} >
                        {this.state.displaySharingOptions ? 'Close Sharing Options' : 'Display Sharing Options'}
                    </button>
                </div>
            </div>

            {
                this.state.displaySharingOptions &&
                <div className="row alert alert-primary">
                    <div className="col">
                        Sharing Options:

                    <hr />
                    Test ..+++++++++++++++++++++
                </div>
                </div>
            }
        </React.Fragment>
}

export default Header
