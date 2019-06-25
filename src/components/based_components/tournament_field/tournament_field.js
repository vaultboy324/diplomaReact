import React from "react";

import Bootstrap from "react-bootstrap";
import './tournament_field.css'

function TournamentField(oParams) {
    return (
        <div className="border border-primary tournamentField">
            <p><a href={`/tournament/${oParams._id}`}>{oParams.name}</a></p>
            <p>{new Date(oParams.date).toLocaleDateString()}</p>
            <div className="text-right">
                <p><a href={`/user/${oParams.creator}`}> {oParams.creator}</a></p>
            </div>
        </div>
    );
}

export default TournamentField;