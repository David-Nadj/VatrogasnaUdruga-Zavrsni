import { Button, Col, Container, Form, Row} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import VatrogasacService from '../../services/VatrogasacService';
import { RouteNames } from '../../constants';
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function VatrogasacDodaj() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();

  async function dodaj(e) {
    showLoading();
    const odgovor = await VatrogasacService.dodaj(e);
    hideLoading();
    if(odgovor.greska){
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(RouteNames.VATROGASAC);
  }

  function obradiSubmit(e) {
    e.preventDefault();


    const ime = e.target.ime.value;
    const prezime = e.target.prezime.value;
    const brojTelefona = e.target.brojTelefona.value;
    const godinaRodenja = parseInt(e.target.godinaRodenja.value);
  
    dodaj({
      ime,
      prezime,
      brojTelefona,
      godinaRodenja,
    });
  }

  return (
      <>
      Dodavanje novog vatrogasca
      
      <Form onSubmit={obradiSubmit}>
          <Form.Group controlId="ime">
              <Form.Label>Ime</Form.Label>
              <Form.Control type="text" name="ime" required />
          </Form.Group>

          <Form.Group controlId="prezime">
              <Form.Label>Prezime</Form.Label>
              <Form.Control type="text" name="prezime" required />
          </Form.Group>


          <Form.Group controlId="brojTelefona">
              <Form.Label>Broj telefona</Form.Label>
              <Form.Control type="text" name="brojTelefona" required />
          </Form.Group>

            <Form.Group controlId="godinaRodenja">
              <Form.Label>Godina rođenja</Form.Label>
              <Form.Control type="number" name="godinaRodenja" required />
          </Form.Group>
          <hr />
          <Row>
              <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
              <Link to={RouteNames.VATROGASAC}
              className="btn btn-danger siroko">
              Odustani
              </Link>
              </Col>
              <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
              <Button variant="primary" type="submit" className="siroko">
                  Dodaj novog vatrogasca
              </Button>
              </Col>
          </Row>
      </Form>
  </>
  );
}