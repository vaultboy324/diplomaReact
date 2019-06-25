import React from "react"
import {Navbar, Nav} from "react-bootstrap";

export const NavigationBar = () => (
        <Navbar bg="light" expand="lg" navbar="dark">
            <Navbar.Brand href="/">Главная</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href={`/user/${sessionStorage.getItem('login')}`}>Моя страница</Nav.Link>
                    <Nav.Link href="/NewTournament">Добавить конкурс</Nav.Link>
                </Nav>
                <Nav className="ml-auto">
                    <Nav.Link href="/logout">Выход</Nav.Link>
                </Nav>
            </Navbar.Collapse>

        </Navbar>
)