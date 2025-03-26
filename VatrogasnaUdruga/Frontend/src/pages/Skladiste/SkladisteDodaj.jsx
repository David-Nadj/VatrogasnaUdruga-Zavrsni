import { Button, Col, Container, Form, Row} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
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
  const { prikaziError } = useError();

  async function dodaj(e) {
    showLoading();
    const odgovor = await SkladisteService.dodaj(e);
    hideLoading();
    if(odgovor.greska){
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(RouteNames.SKLADISTE);
  }

  function obradiSubmit(e) {
    e.preventDefault();


    const naziv = e.target.naziv.value;
    const adresa = e.target.adresa.value;
    dodaj({
      naziv,
      adresa,
    });
  }

  return (
      <>
      Dodavanje novog skladista
      
      <Form onSubmit={obradiSubmit}>
          <Form.Group controlId="naziv">
              <Form.Label>Naziv</Form.Label>
              <Form.Control type="text" name="naziv" required />
          </Form.Group>

          <Form.Group controlId="adresa">
              <Form.Label>Adresa</Form.Label>
              <Form.Control type="text" name="adresa" required />
          </Form.Group>

          <hr />
          <Row>
              <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
              <Link to={RouteNames.SKLADISTE}
              className="btn btn-danger siroko">
              Odustani
              </Link>
              </Col>
              <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
              <Button variant="primary" type="submit" className="siroko">
                  Dodaj novo skladiste
              </Button>
              </Col>
          </Row>
      </Form>
  </>
  );
}