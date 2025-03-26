import { Button, Col, Container, Form, Row} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import OpremaService from '../../services/OpremaService';
import VrstaOpremeService from '../../services/VrstaOpremeService';
import { RouteNames } from '../../constants';
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function OpremaDodaj() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [vrsteOpreme, setVrsteOpreme] = useState([]);
  const [vrstaOpreme, setVrstaOpreme] = useState(0);
  const [savedDatumProvjereValjanosti, setDatumProvjereValjanosti] = useState(null);
  const [savedDatumKrajaValjanosti, setDatumKrajaValjanosti] = useState(null);
  const { prikaziError } = useError();

  async function dohvatiVrsteOpreme(){
    showLoading();
    const odgovor = await VrstaOpremeService.get();
    hideLoading();
    setVrsteOpreme(odgovor.poruka);
  }

  useEffect(()=>{
    dohvatiVrsteOpreme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  async function dodaj(e) {
    showLoading();
    const odgovor = await OpremaService.dodaj(e);
    hideLoading();
    if(odgovor.greska){
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(RouteNames.OPREMA);
  }

  function obradiSubmit(e) {
    e.preventDefault();

    const naziv = e.target.naziv.value;
    const opis = e.target.opis.value;
    const DatumProvjereValjanosti = savedDatumProvjereValjanosti.toISOString().split('T')[0];
    const DatumKrajaValjanosti = savedDatumKrajaValjanosti.toISOString().split('T')[0];
  
    dodaj({
      naziv,
      opis,
      DatumProvjereValjanosti,
      DatumKrajaValjanosti,
      vrstaOpremeSifra: parseInt(vrstaOpreme)
    });
  }

  return (
      <>
      Dodavanje nove opreme
      
      <Form onSubmit={obradiSubmit}>
          <Form.Group controlId="naziv">
              <Form.Label>Naziv</Form.Label>
              <Form.Control type="text" name="naziv" placeholder="Naziv opreme" required />
          </Form.Group>

          <Form.Group controlId="opis">
              <Form.Label>Opis</Form.Label>
              <Form.Control type="text" name="opis" placeholder="Opis opreme" />
          </Form.Group>

          <Form.Group controlId="DatumProvjereValjanosti">
            <Form.Label>Datum provjere valjanosti</Form.Label>
            <DatePicker
                selected={savedDatumProvjereValjanosti}
                onChange={date => setDatumProvjereValjanosti(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                wrapperClassName="w-100"
            />
            </Form.Group>

          <Form.Group controlId="DatumKrajaValjanosti">
            <Form.Label>Datum kraja valjanosti</Form.Label>
            <DatePicker
                selected={savedDatumKrajaValjanosti}
                onChange={date => setDatumKrajaValjanosti(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                wrapperClassName="w-100"
            />
            </Form.Group>

          <Form.Group className='mb-3' controlId='vrstaOpreme'>
            <Form.Label>Vrsta opreme</Form.Label>
            <Form.Select 
            onChange={(e) => setVrstaOpreme(e.target.value)}  // Update the state when an option is selected
          >
            <option selected value="" disabled>Odaberi vrstu opreme</option> 
            {vrsteOpreme && vrsteOpreme.map((s,index)=>(
              <option key={index} value={s.sifra}>
                {s.vrsta}
              </option>
            ))}
            </Form.Select>
          </Form.Group>

          <hr />
          <Row>
              <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
              <Link to={RouteNames.OPREMA}
              className="btn btn-danger siroko">
              Odustani
              </Link>
              </Col>
              <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
              <Button variant="primary" type="submit" className="siroko">
                  Dodaj novu opremu
              </Button>
              </Col>
          </Row>
      </Form>
  </>
  );
}