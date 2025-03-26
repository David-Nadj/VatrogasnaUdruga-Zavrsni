import { Button, Col, Container, Form, Row} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SpremnikService from '../../services/SpremnikService';
import { RouteNames } from '../../constants';
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SpremnikDodaj() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [spremnikPodatci, setSpremnik] = useState(null);
  const routeParams = useParams();
  const [savedNaziv, setNaziv] = useState(null);
  const { prikaziError } = useError();

  async function dohvatiPodatke(){
    
    const spremnikPodatci = await SpremnikService.getBySifra(routeParams.sifra);

    setSpremnik(spremnikPodatci);
    hideLoading();
    setNaziv(spremnikPodatci.poruka.naziv);
  }

  useEffect(() => {
    dohvatiPodatke();
  }, []);

  function obradiSubmit(e) {
    e.preventDefault();

    const naziv = e.target.naziv.value;
  
    promjeni(routeParams.sifra, {
      naziv,
    });
  }

  async function promjeni(sifra, spremnik) {
    const odgovor = await SpremnikService.promjena(sifra, spremnik);
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(-1);
  }

  if (!spremnikPodatci) {
    return <p>Učitavanje...</p>;
  }

  return (
    <>
      Uredi spremnik
      
      <Form onSubmit={obradiSubmit}>
        <Form.Group controlId="naziv">
          <Form.Label>Naziv</Form.Label>
          <Form.Control 
            type="text" 
            name="naziv" 
            defaultValue={savedNaziv}  // Use state to bind the value
            required 
          />
        </Form.Group>
        <hr />
        <Row>
          <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
            <Link to={RouteNames.SPREMNIK} className="btn btn-danger siroko">Odustani</Link>
          </Col>
          <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="primary" type="submit" className="siroko">Spremi promjene</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
