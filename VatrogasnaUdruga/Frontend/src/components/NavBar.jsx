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
            <Nav.Link onClick={()=>navigate(RouteNames.HOME)}>Početna</Nav.Link>

            <NavDropdown title="Vozila" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VOZILA)}>Pregled vozila</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VOZILA_NOVO)}>Dodaj novo vozilo</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VRSTA_VOZILA)}>Pregled vrste vozila</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VRSTA_VOZILA_NOVO)}>Dodaj novu vrstu vozila</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VOZILA_SPREMNICI_OPREMA)}>Pregled opreme i spremnika vozila</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VOZILA_SPREMNIK_NOVO)}>Registriraj novi spremnik vozilu</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Oprema" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={()=>navigate(RouteNames.OPREMA)}>Pregled opremu</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.OPREMA_NOVO)}>Dodaj novu opremu</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VRSTA_OPREME)}>Pregled vrste opreme</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VRSTA_OPREME_NOVO)}>Dodaj novu vrstu opreme</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Vatrogasci" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VATROGASAC)}>Pregled vatrogasca</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VATROGASAC_NOVO)}>Dodaj novog vatrogasca</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.VATROGASCI_OPREMA)}>Pregled opreme vatrogasca</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.OPREMA_VATROGASCA_NOVO)}>Dodaj opremu vatrogascu</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Skladišta" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={()=>navigate(RouteNames.SKLADISTE)}>Pregled skladišta</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.SKLADISTE_NOVO)}>Dodaj novo skladište</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.SKLADISTA_OPREMA)}>Pregled opreme skladišta</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Spremnik" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={()=>navigate(RouteNames.SPREMNIK)}>Pregled spremnika</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>navigate(RouteNames.SPREMNIK_NOVO)}>Dodaj novi spremnik</NavDropdown.Item>
          </NavDropdown>

          </Nav>
        </Navbar.Collapse>
       </Container>
    </Navbar>
    );
}