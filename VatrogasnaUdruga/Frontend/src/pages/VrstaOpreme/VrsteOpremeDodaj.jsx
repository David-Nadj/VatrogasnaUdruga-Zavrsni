import { useEffect, useState } from "react"
import VrsteOpremeService from "../../services/VrstaOpremeService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';
import { Form, Row, Col } from "react-bootstrap";

export default function VrsteVozilaPregled(){

    const navigate = useNavigate()
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    useEffect(()=>{
    },[])

  async function dodaj(e) {
    showLoading();
    const odgovor = await VrsteOpremeService.dodaj(e);
    hideLoading();
    if(odgovor.greska){
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(RouteNames.VRSTA_OPREME);
    setVrsteVozila(odgovor.poruka[0].sifra);
  }

  function obradiSubmit(e) {
    e.preventDefault();
    const vrsta = e.target.vrsta.value;
  
    dodaj({
        vrsta
    });
  }


  return (
    <>
    Dodavanje nove vrste opreme

    <Form onSubmit={obradiSubmit}>
        <Form.Group controlId="vrsta">
            <Form.Label>Vrsta</Form.Label>
            <Form.Control type="text" name="vrsta" required />
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
                Dodaj novu vrstu opreme
            </Button>
            </Col>
        </Row>
    </Form>
</>
);
}