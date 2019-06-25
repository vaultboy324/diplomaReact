import React from 'react';
import {Redirect} from "react-router";

import TournamentField from '../based_components/tournament_field/tournament_field'

const config = require('../config/config');

class Tournaments extends React.Component {
    state = {
        tournaments: []
    }

    constructor(props){
        super(props);

        // this.setState({tournaments: this.props.tournaments});
    }

    async componentWillReceiveProps(someProp) {
        await this.setState({tournaments: someProp.tournaments});
        console.log(this.state);
    }

    // async componentDidMount() {
    //     console.log(this.props.tournaments);
    //     await this.setState({tournaments: this.props.tournaments});
    //     this.forceUpdate();
    // }

    // async getTournaments() {
    //     let response = await fetch(`${config.server}/tournament`);
    //     let tournaments = await response.json();
    //     await this.setState({tournaments: tournaments});
    //     console.log(this.state);
    // }
    //
    // async componentWillMount() {
    //     await this.getTournaments();
    // }

    render() {
        return (<div>
            {
                this.state.tournaments.map((item, index) => (
                    <TournamentField _id={item._id} date={item.date} name={item.name} creator={item.creator}/>
                ))
            }
        </div>)
    }
}

export default Tournaments;