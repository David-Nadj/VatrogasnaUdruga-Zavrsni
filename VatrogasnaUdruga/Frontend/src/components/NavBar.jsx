import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { RouteNames, PRODUKCIJA } from '../constants';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import useAuth from '../hooks/useAuth';


export default function NavBarEdunova(){

    const navigate = useNavigate();
    const { logout, isLoggedIn } = useAuth();
    
    function OpenSwaggerURL(){
      window.open(PRODUKCIJA + "/swagger/index.html", "_blank")
    }

    return(
    <Navbar expand="lg" className="bg-body-tertiary fixed-top">
       <Container className="fluid">
       <Navbar.Brand href="/">Vatrogasna Udruga</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={()=>navigate(RouteNames.VRSTA_VOZILA)}>Početna</Nav.Link>

            <NavDropdown title="Vozila" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VOZILA)}>Pregled vozila</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VOZILA_NOVO)}>Dodaj novo vozilo</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VRSTA_VOZILA)}>Pregled vrste vozila</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VRSTA_VOZILA_NOVO)}>Dodaj novu vrstu vozila</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VOZILA_SPREMNICI_OPREMA)}>Pregled opreme i spremnika vozila</NavDropdown.Item>


            <NavDropdown.Item onClick={()=>navigate(RouteNames.VRSTA_VOZILA_NOVO)}>Dodaj novu opremu vozilu</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VRSTA_VOZILA_NOVO)}>Registriraj novi spremnik vozilu</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Oprema" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VRSTA_VOZILA)}>Pregled opremu</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VRSTA_VOZILA_NOVO)}>Dodaj novu opremu</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VRSTA_VOZILA)}>Pregled vrste opreme</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VRSTA_VOZILA_NOVO)}>Dodaj novu vrstu opreme</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Vatrogasci" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VATROGASCI_OPREMA)}>Pregled vatrogasce</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VATROGASCI_OPREMA)}>Dodaj novog vatrogasca</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VATROGASCI_OPREMA)}>Pregled opreme vatrogasca</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VATROGASCI_OPREMA)}>Dodaj opremu vatrogascu</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Skladišta" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={()=>navigate(RouteNames.SKLADISTA_OPREMA)}>Pregled opreme skladišta</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.SKLADISTA_OPREMA)}>Dodaj opremu skladištu</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.SKLADISTA_OPREMA)}>Pregled skladišta</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.SKLADISTA_OPREMA)}>Dodaj novo skladište</NavDropdown.Item>
          </NavDropdown>
          </Nav>

          
        </Navbar.Collapse>
       </Container>
    </Navbar>
    );
}