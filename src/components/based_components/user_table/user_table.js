import React from "react";

import Bootstrap from "react-bootstrap";

function UserTable(oParams){
    return (
        <table className="table border table-striped">
            <thead>
            <tr>
                <th scope="col">Логин</th>
                <th scope="col">Количество очков</th>
            </tr>
            </thead>
            {
                oParams.userList.map((item, index) => (
                    <tbody>
                    <tr>
                        <th scope="row">{item.login}</th>
                        <th scope="row">{item.score}</th>
                    </tr>
                    </tbody>
                ))
            }
        </table>
    )
}

export default UserTable;