import { Button, Col, Container, Form, Row} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  const [vatrogasacPodatci, setVatrogasac] = useState(null);
  const routeParams = useParams();
  const [savedGodinaRodenja, setGodinaRodenja] = useState(null);
  const [savedIme, setIme] = useState(null);
  const [savedPrezime, setPrezime] = useState(null);
  const [savedBrojTelefona, setBrojTelefona] = useState(null);


  const { prikaziError } = useError();

  async function dohvatiPodatke(){
    showLoading();
    const vatrogasacPodatci = await VatrogasacService.getBySifra(routeParams.sifra);
    hideLoading();

    setVatrogasac(vatrogasacPodatci);
    hideLoading();
    setIme(vatrogasacPodatci.poruka.ime);
    setPrezime(vatrogasacPodatci.poruka.prezime);
    setBrojTelefona(vatrogasacPodatci.poruka.brojTelefona);
    setGodinaRodenja(new Date(vatrogasacPodatci.poruka.godinaRodenja, 0, 1));
    console.log(savedGodinaRodenja)
  }

  useEffect(() => {
    dohvatiPodatke();
  }, []);

  function obradiSubmit(e) {
    e.preventDefault();
    const dateFromPicker = new Date(savedGodinaRodenja);
    const year = dateFromPicker.getFullYear(); // → 2000
    const ime = e.target.ime.value;
    const prezime = e.target.prezime.value;
    const brojTelefona = e.target.brojTelefona.value;
    const godinaRodenja = year;

    promjeni(routeParams.sifra, {
      ime,
      prezime,
      brojTelefona,
      godinaRodenja,
    });
  }

  async function promjeni(sifra, vatrogasac) {
    const odgovor = await VatrogasacService.promjena(sifra, vatrogasac);
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(RouteNames.VATROGASAC);
  }

  if (!vatrogasacPodatci) {
    return <p>Učitavanje...</p>;
  }

  return (
    <>
      Uredi Vatrogasca
      
      <Form onSubmit={obradiSubmit}>
        <Form.Group controlId="ime">
          <Form.Label>Ime</Form.Label>
          <Form.Control 
            type="text" 
            name="ime" 
            defaultValue={savedIme}
            required 
          />
        </Form.Group>

        <Form.Group controlId="prezime">
          <Form.Label>Prezime</Form.Label>
          <Form.Control 
            type="text" 
            name="prezime" 
            defaultValue={savedPrezime} 
            required 
          />
        </Form.Group>

        <Form.Group controlId="brojTelefona">
          <Form.Label>Broj telefona</Form.Label>
          <Form.Control 
            type="text" 
            name="brojTelefona" 
            defaultValue={savedBrojTelefona} 
            required 
          />
        </Form.Group>
      <Form.Group controlId="godinaRodenja">
        <Form.Label>Godina rođenja</Form.Label>
        <DatePicker
          selected={savedGodinaRodenja}
          onChange={date => setGodinaRodenja(date)}
          showYearPicker
          dateFormat="yyyy"
          yearDropdownItemNumber={100}
          scrollableYearDropdown
        />
      </Form.Group>
        <hr />
        <Row>
          <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
            <Link to={RouteNames.VATROGASAC} className="btn btn-danger siroko">Odustani</Link>
          </Col>
          <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="primary" type="submit" className="siroko">Spremi promjene</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
