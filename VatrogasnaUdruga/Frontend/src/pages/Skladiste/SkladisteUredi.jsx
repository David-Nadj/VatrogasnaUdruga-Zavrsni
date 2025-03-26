import { Button, Col, Container, Form, Row} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SkladisteService from '../../services/SkladisteService';
import { RouteNames } from '../../constants';
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SkladisteDodaj() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [skladistePodatci, setSkladiste] = useState(null);
  const routeParams = useParams();
  const [savedNaziv, setNaziv] = useState(null);
  const [savedAdresa, setAdresa] = useState(null);

  const { prikaziError } = useError();

  async function dohvatiPodatke(){
    showLoading();
    const skladistePodatci = await SkladisteService.getBySifra(routeParams.sifra);

    setSkladiste(skladistePodatci);
    hideLoading();
    setNaziv(skladistePodatci.poruka.naziv);
    setAdresa(skladistePodatci.poruka.adresa);
  }

  useEffect(() => {
    dohvatiPodatke();
  }, []);

  function obradiSubmit(e) {
    e.preventDefault();

    const naziv = e.target.naziv.value;
    const adresa = e.target.adresa.value;
  
    promjeni(routeParams.sifra, {
      naziv,
      adresa
    });
  }

  async function promjeni(sifra, skladista) {
    const odgovor = await SkladisteService.promjena(sifra, skladista);
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(RouteNames.SKLADISTE);
  }

  if (!skladistePodatci) {
    return <p>Učitavanje...</p>;
  }

  return (
    <>
      Uredi skladiste
      
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

        <Form.Group controlId="adresa">
          <Form.Label>Adresa</Form.Label>
          <Form.Control 
            type="text" 
            name="adresa" 
            defaultValue={savedAdresa}  // Use state to bind the value
            required 
          />
        </Form.Group>

        <hr />
        <Row>
          <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
            <Link to={RouteNames.SKLADISTE} className="btn btn-danger siroko">Odustani</Link>
          </Col>
          <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="primary" type="submit" className="siroko">Spremi promjene</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
