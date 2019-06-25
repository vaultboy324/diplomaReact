import React from 'react';
import Calendar from "react-calendar";

import {Form} from "react-bootstrap";
import InputField from "../based_components/input_field/input_field";

import {NavigationBar} from "../based_components/navbar/navbar";
import FormText from "react-bootstrap/es/FormText";

import {Redirect} from "react-router";

const config = require("../config/config");

class NewTournament extends React.Component {
    state = {
        name: undefined,
        task: undefined,
        date: new Date(),
        files: [],
        hiddenFiles: [],
        creator: undefined,
        participants: [],
        statusString: undefined
    }

    constructor(props) {
        super(props);
        this.setState({files: []});
        this.setState({hiddenFiles: []});
    }

    onChangeName = (event) => {
        this.setState({name: event.target.value})
    }

    onChangeTask = (event) => {
        this.setState({task: event.target.value})
    }

    onChange = async (date) => {
        let now = new Date();

        if (now > date) {
            this.setState({statusString: "Нельзя добавлять конкурс в прошлое))"});
            now.setHours('23', '59', '59');
            this.setState({date: now});
            this.forceUpdate()
        } else {
            date.setHours('23', '59', '59');
            this.setState({date: date});
        }
    }

    addTournament = async (event) => {
        event.preventDefault();

        if (typeof this.state.name === 'undefined' || this.state.name.length === 0) {
            this.setState({statusString: "Имя не может быть пустым"});
            this.forceUpdate();
            return;
        }

        if ((typeof this.state.files === 'undefined' || this.state.files.length === 0) && (typeof this.state.hiddenFiles === 'undefined' || this.state.hiddenFiles.length === 0)) {
            this.setState({statusString: "Должен быть хотя бы один файл с тестовыми данными"});
            this.forceUpdate();
            return;
        }

        await this.setState({creator: sessionStorage.getItem('login')});

        console.log(this.state);

        let jsonString = JSON.stringify(this.state);

        const response = await fetch(`${config.server}/tournament`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': jsonString.length
            },

            body: jsonString
        });

        let body = await response.json();

        console.log(body);

        this.setState({statusString: body.result});

        this.forceUpdate();
    }

    addFileInput = (isHidden, event) => {
        event.preventDefault();

        if (isHidden) {
            var files = this.state.hiddenFiles;
        } else {
            var files = this.state.files;
        }
        var newFileInput = {
            "name": this.state.files.length
        };
        files.push(newFileInput);
        this.forceUpdate();
    }

    setFileName = (data, event) => {
        if (data.isHidden) {
            var files = this.state.hiddenFiles;
        } else {
            var files = this.state.files;
        }
        let fileName = event.target.files[0].name;
        let type = fileName.split('.').pop();

        if (type !== 'json' && type !== 'txt') {
            this.setState({statusString: 'Недопустимый формат файла(Разрешены только json и txt)'});
            files.splice(data.index, 1);
            this.forceUpdate();
            return;
        }

        files[data.index]["name"] = fileName;

        let fileReader = new FileReader();
        fileReader.onload = (event) => {
            try {
                var fileData = files[data.index];
                fileData.data = JSON.parse(event.target.result);
                if (typeof fileData.data === "undefined" || typeof fileData.data === "undefined") {
                    throw DOMException;
                }
                console.log(fileData);
                console.log(this.state.files)
            }
             catch (e) {
                this.setState({statusString: `Файл ${files[data.index]["name"]} имеет неверный формат.\nФайл должен иметь формат json и содержать поля 'test' и 'result'`})
                files.splice(data.index, 1);
                this.forceUpdate();
                return;
            }
        };

        fileReader.readAsText(event.target.files[0]);
    }

    onDelete = (isHidden, event) => {
        event.preventDefault();

        let index = event.target.value;

        if (isHidden) {
            var files = this.state.hiddenFiles;
        } else {
            var files = this.state.files;
        }

        files.splice(index, 1);

        this.forceUpdate();
    }

    render() {
        let token = sessionStorage.getItem('token');

        if (typeof token === undefined || token === "undefined") {
            return (<Redirect to="/auth"/>)
        }
        return (
            <div>
                <NavigationBar/>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>
                            Название конкурса
                        </Form.Label>
                        <Form.Control placeholder="Введите назвавние конкурса" value={this.state.name}
                                      onChange={this.onChangeName}/>
                    </Form.Group>
                    <Form.Group controlId="taskName">
                        <Form.Label>
                            Техническое задание
                        </Form.Label>
                        <Form.Control placeholder="Введите техническое задание" value={this.state.task}
                                      onChange={this.onChangeTask}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            Дата окончания конкурса
                        </Form.Label>
                    </Form.Group>
                    <Calendar
                        onChange={this.onChange}
                        value={this.state.date}/>
                    <Form.Group>
                        <Form.Label>Файлы в открытом доступе</Form.Label>
                        {
                            this.state.files.map((item, index) => (
                                <div>
                                    <InputField type="file" required name={item.name}
                                                onChange={this.setFileName.bind(this, {
                                                    index,
                                                    isHidden: false
                                                })}/>
                                    <button className="btn btn-danger" onClick={this.onDelete.bind(this, false)}
                                            value={index}>Удалить поле для выбора файла
                                    </button>
                                </div>
                            ))
                        }
                        <button className="btn btn-success" onClick={this.addFileInput.bind(this, false)}>Добавить поле
                            для выбора файла
                        </button>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Файлы в закрытом доступе:</Form.Label>
                        {
                            this.state.hiddenFiles.map((item, index) => (
                                    <div>
                                        <InputField type="file" required name={item.name}
                                                    onChange={this.setFileName.bind(this, {
                                                        index,
                                                        isHidden: true
                                                    })}/>
                                        <button key={index} className="btn btn-danger"
                                                onClick={this.onDelete.bind(this, true)} value={index}>Удалить поле для
                                            выбора файла
                                        </button>
                                    </div>
                                )
                            )
                        }
                        <button className="btn btn-success" onClick={this.addFileInput.bind(this, true)}>Добавить поле
                            для выбора файла
                        </button>
                    </Form.Group>
                    <button onClick={this.addTournament} className="btn btn-primary">
                        Добавить конкурс
                    </button>
                    <FormText>{this.state.statusString}</FormText>
                </Form>
            </div>
        )
    }
}

export default NewTournament;