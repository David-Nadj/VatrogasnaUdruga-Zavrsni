import { Button, Col, Container, Form, Row} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import VozilaService from '../../services/VozilaService';
import VrsteVozilaService from '../../services/VrsteVozilaService';
import { RouteNames } from '../../constants';
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function VozilaDodaj() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [vozilaPodatci, setVozila] = useState(null);
  const routeParams = useParams();
  const [vrsteVozila, setVrsteVozila] = useState([]);
  const [vrstaVozila, setVrstaVozila] = useState(0);
  const [savedDatumProizvodnje, setDatumProizvodnje] = useState(null);
  const [savedDatumZadnjeRegistracije, setDatumZadnjeRegistracije] = useState(null);
  const [savedNaziv, setNaziv] = useState(null);
  const [savedRegistracija, setRegistracija] = useState(null);
  const [savedBrojSjedala, setBrojSjedala] = useState(null);
  const [savedVrsta, setVrsta] = useState(null);

  const { prikaziError } = useError();

  async function dohvatiPodatke(){
    showLoading();
    const odgovor = await VrsteVozilaService.get();
    hideLoading();
    setVrsteVozila(odgovor.poruka);
    showLoading();
    const vozilaPodatci = await VozilaService.getBySifra(routeParams.sifra);

    setVozila(vozilaPodatci);
    hideLoading();
    setNaziv(vozilaPodatci.poruka.naziv);
    setVrsta(vozilaPodatci.poruka.vrstaVozilaSifra);
    setRegistracija(vozilaPodatci.poruka.registracija);
    setBrojSjedala(vozilaPodatci.poruka.brojSjedala);
    setDatumProizvodnje(new Date(vozilaPodatci.poruka.datumProizvodnje) || new Date());
    setDatumZadnjeRegistracije(new Date(vozilaPodatci.poruka.datumZadnjeRegistracije) || new Date());
  }

  useEffect(() => {
    dohvatiPodatke();
  }, []);

  function obradiSubmit(e) {
    e.preventDefault();

    const naziv = e.target.naziv.value;
    const brojSjedala = parseInt(e.target.brojSjedala.value);
    const registracija = e.target.registracija.value;
    const datumProizvodnje = savedDatumProizvodnje.toISOString().split('T')[0];
    const datumZadnjeRegistracije = savedDatumZadnjeRegistracije.toISOString().split('T')[0];
  
    promjeni(routeParams.sifra, {
      naziv,
      brojSjedala,
      registracija,
      datumProizvodnje,
      datumZadnjeRegistracije,
      vrstaVozilaSifra: parseInt(vrstaVozila)
    });
  }

  async function promjeni(sifra, vozilo) {
    const odgovor = await VozilaService.promjena(sifra, vozilo);
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(RouteNames.VOZILA);
  }

  if (!vozilaPodatci) {
    return <p>Učitavanje...</p>;
  }

  return (
    <>
      Uredi vozilo
      
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

        <Form.Group controlId="brojSjedala">
          <Form.Label>Broj sjedala</Form.Label>
          <Form.Control 
            type="number" 
            name="brojSjedala" 
            defaultValue={savedBrojSjedala}  // Use state to bind the value
            required 
          />
        </Form.Group>

        <Form.Group controlId="registracija">
          <Form.Label>Registracija</Form.Label>
          <Form.Control 
            type="text" 
            name="registracija" 
            defaultValue={savedRegistracija}  // Use state to bind the value
            required 
          />
        </Form.Group>

        <Form>
      <Form.Group controlId="datumProizvodnje">
        <Form.Label>Datum proizvodnje</Form.Label>
        <DatePicker
          selected={savedDatumProizvodnje}
          onChange={date => setDatumProizvodnje(date)}
          dateFormat="yyyy-MM-dd"
        />
      </Form.Group>

      <Form.Group controlId="datumZadnjeRegistracije">
        <Form.Label>Datum zadnje registracije</Form.Label>
        <DatePicker
          selected={savedDatumZadnjeRegistracije}
          onChange={date => setDatumZadnjeRegistracije(date)}
          dateFormat="yyyy-MM-dd"
        />
      </Form.Group>
    </Form>

        <Form.Group className="mb-3" controlId="vrstaVozila">
          <Form.Label>Vrsta vozila</Form.Label>
          <Form.Select
            defaultValue={savedVrsta}
            onChange={(e) => setVrstaVozila(e.target.value)}  // Update the state when an option is selected
          >
            <option value="" disabled>Odaberi vrstu vozila</option>
            {vrsteVozila && vrsteVozila.map((s, index) => (
              <option key={index} value={s.sifra}>
                {s.vrsta}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <hr />
        <Row>
          <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
            <Link to={RouteNames.VOZILA} className="btn btn-danger siroko">Odustani</Link>
          </Col>
          <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="primary" type="submit" className="siroko">Spremi promjene</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
