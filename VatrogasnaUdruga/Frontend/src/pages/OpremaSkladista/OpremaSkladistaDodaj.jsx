import { Button, Col, Container, Form, Row} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
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
  const [vrsteVozila, setVrsteVozila] = useState([]);
  const [vrstaVozila, setVrstaVozila] = useState(0);
  const [savedDatumProizvodnje, setDatumProizvodnje] = useState(null);
  const [savedDatumZadnjeRegistracije, setDatumZadnjeRegistracije] = useState(null);
  const { prikaziError } = useError();

  async function dohvatiVrsteVozila(){
    showLoading();
    const odgovor = await VrsteVozilaService.get();
    hideLoading();
    setVrsteVozila(odgovor.poruka);
  }

  useEffect(()=>{
    dohvatiVrsteVozila();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  async function dodaj(e) {
    showLoading();
    const odgovor = await VozilaService.dodaj(e);
    hideLoading();
    if(odgovor.greska){
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(RouteNames.VOZILA);
    setVrsteVozila(odgovor.poruka[0].sifra);
  }

  function obradiSubmit(e) {
    e.preventDefault();


    const naziv = e.target.naziv.value;
    const brojSjedala = parseInt(e.target.brojSjedala.value);
    const registracija = e.target.registracija.value;
    const datumProizvodnje = savedDatumProizvodnje.toISOString().split('T')[0];
    const datumZadnjeRegistracije = savedDatumZadnjeRegistracije.toISOString().split('T')[0];
  
    dodaj({
      naziv,
      brojSjedala,
      registracija,
      datumProizvodnje,
      datumZadnjeRegistracije,
      vrstaVozilaSifra: parseInt(vrstaVozila)
    });
  }

  return (
      <>
      Dodavanje novog vozila
      
      <Form onSubmit={obradiSubmit}>
          <Form.Group controlId="naziv">
              <Form.Label>Naziv</Form.Label>
              <Form.Control type="text" name="naziv" required />
          </Form.Group>

          <Form.Group controlId="brojSjedala">
              <Form.Label>Broj sjedala</Form.Label>
              <Form.Control type="text" name="brojSjedala" required />
          </Form.Group>

          <Form.Group controlId="registracija">
              <Form.Label>Registracija vozila</Form.Label>
              <Form.Control type="text" name="registracija" required />
          </Form.Group>

          <Form.Group controlId="datumProizvodnje">
            <Form.Label>Datum proizvodnje</Form.Label>
            <DatePicker
                selected={savedDatumProizvodnje}
                onChange={date => setDatumProizvodnje(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                wrapperClassName="w-100"
            />
            </Form.Group>

          <Form.Group controlId="datumZadnjeRegistracije">
              <Form.Label>Datum zadnje registracije</Form.Label>
              <DatePicker
                selected={savedDatumZadnjeRegistracije}
                onChange={date => setDatumZadnjeRegistracije(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                wrapperClassName="w-100"
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='vrstaVozila'>
            <Form.Label>Vrsta vozila</Form.Label>
            <Form.Select 
            onChange={(e) => setVrstaVozila(e.target.value)}  // Update the state when an option is selected
          >
            <option selected value="" disabled>Odaberi vrstu vozila</option> 
            {vrsteVozila && vrsteVozila.map((s,index)=>(
              <option key={index} value={s.sifra}>
                {s.vrsta}
              </option>
            ))}
            </Form.Select>
          </Form.Group>

          <hr />
          <Row>
              <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
              <Link to={RouteNames.VOZILA}
              className="btn btn-danger siroko">
              Odustani
              </Link>
              </Col>
              <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
              <Button variant="primary" type="submit" className="siroko">
                  Dodaj novo vozilo
              </Button>
              </Col>
          </Row>
      </Form>
  </>
  );
}