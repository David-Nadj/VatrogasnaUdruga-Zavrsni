import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { RouteNames, PRODUKCIJA } from '../constants';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';


export default function NavBarEdunova(){

    const navigate = useNavigate();
    const { logout, isLoggedIn } = useAuth();
    
    function OpenSwaggerURL(){
      window.open(PRODUKCIJA + "/swagger/index.html", "_blank")
    }

    return(
    <Navbar expand="lg" className="bg-body-tertiary">
        <Navbar.Brand href="/">Vatrogasna Udruga</Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <NavDropdown title="Vozila" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VOZILA)}>Pregled vozila</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VOZILA_NOVO)}>Dodaj novo vozilo</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Vrste vozila" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VRSTA_VOZILA)}>Pregled vrste vozila</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VRSTA_VOZILA_NOVO)}>Dodaj novu vrstu vozila</NavDropdown.Item>
          </NavDropdown>
          <Nav className="me-auto">
            <Nav.Link onClick={()=>navigate(RouteNames.VRSTA_VOZILA)}>TEST</Nav.Link>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
    );
}