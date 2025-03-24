import { useEffect, useState } from "react"
import VrsteVozilaService from "../../services/VrsteVozilaService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';
import { Form, Row, Col } from "react-bootstrap";

export default function VrsteVozilaPregled(){

    const navigate = useNavigate()
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();
    const routeParams = useParams();
    const [vrstaVozila, setVrsteVozila] = useState([]);

    async function dohvatiPodatke(){
      showLoading();
      try {
          const odgovor = await VrsteVozilaService.getBySifra(routeParams.sifra);
          if (odgovor.greska) {
              prikaziError(odgovor.poruka);
              return;
          }
          setVrsteVozila(odgovor.poruka);
      } catch (error) {
          prikaziError(error.message);
      } finally {
          hideLoading();
      }
  }

  useEffect(() => {
      dohvatiPodatke();
  }, [routeParams.sifra]);
  function obradiSubmit(e) {
    e.preventDefault();

    const vrsta = e.target.vrsta.value;
  
    promjeni(routeParams.sifra, {
      vrsta
    });
  }

  async function promjeni(sifra, vrstaVozila) {
    const odgovor = await VrsteVozilaService.promjena(sifra, vrstaVozila);
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(RouteNames.VRSTA_VOZILA);
  }

  if (!vrstaVozila) {
    return <p>Učitavanje...</p>;
  }

  return (
    <>
    Uredi vrstu vozila

      <Form onSubmit={obradiSubmit}>
        <Form.Group controlId="vrsta">
          <Form.Label>Vrsta</Form.Label>
          <Form.Control 
            type="text" 
            name="vrsta" 
            defaultValue={vrstaVozila.vrsta}
            required 
          />
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