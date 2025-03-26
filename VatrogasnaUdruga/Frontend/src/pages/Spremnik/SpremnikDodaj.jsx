import { Button, Col, Container, Form, Row} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
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

  const { prikaziError } = useError();

  async function dodaj(e) {
    showLoading();
    const odgovor = await SpremnikService.dodaj(e);
    hideLoading();
    if(odgovor.greska){
      prikaziError(odgovor.poruka);
      return;
    }
  }

  function obradiSubmit(e) {
    e.preventDefault();


    const naziv = e.target.naziv.value;
    
    dodaj({
      naziv,
    });

    navigate(-1); 
  }

  return (
      <>
      Dodavanje novog spremnika
      
      <Form onSubmit={obradiSubmit}>
          <Form.Group controlId="naziv">
              <Form.Label>Naziv</Form.Label>
              <Form.Control type="text" name="naziv" required />
          </Form.Group>
          <hr />
          <Row>
              <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
              <Link to={RouteNames.SPREMNIK}
              className="btn btn-danger siroko">
              Odustani
              </Link>
              </Col>
              <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
              <Button variant="primary" type="submit" className="siroko">
                  Dodaj novi spremnik
              </Button>
              </Col>
          </Row>
      </Form>
  </>
  );
}