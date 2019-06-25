import React from "react";

import {Form} from "react-bootstrap";

function InputField(params) {
    return (<Form.Group>
        <Form.Label>{params.label}</Form.Label>
        <Form.Control type={params.type} required id={params.field} name={params.field}
               placeholder={params.placeholder} pattern={params.pattern} value={params.value} onChange={params.onChange}/>
    </Form.Group>);
}

export default InputField;