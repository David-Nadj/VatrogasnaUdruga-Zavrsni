import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from "../../hooks/useError";
import { Form, Row, Col } from "react-bootstrap";
import OpremaService from "../../services/OpremaService";
import VrstaOpremeService from "../../services/VrstaOpremeService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function OpremePregled() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const routeParams = useParams();
  const [oprema, setOpreme] = useState(null);
  const [vrsteOpreme, setVrsteOpreme] = useState([]);
  const [vrstaOpreme, setVrstaOpreme] = useState(0);
  const [savedDatumProvjereValjanosti, setDatumProvjereValjanosti] = useState(null);
  const [savedDatumKrajaValjanosti, setDatumKrajaValjanosti] = useState(null);
  const [savedNaziv, setNaziv] = useState("");
  const [savedOpis, setOpis] = useState("");

  async function dohvatiPodatke() {
    showLoading();
    try {
      const opremaResponse = await OpremaService.getBySifra(routeParams.sifra);
      if (opremaResponse.greska) {
        prikaziError(opremaResponse.poruka);
        return;
      }
      const opremaData = opremaResponse.poruka;
      setOpreme(opremaData);
      setVrstaOpreme(opremaData.vrstaOpremeSifra);

      const odgovorVrsteOpreme = await VrstaOpremeService.get();
      if (odgovorVrsteOpreme.greska) {
        prikaziError(odgovorVrsteOpreme.poruka);
        return;
      }
      setVrsteOpreme(odgovorVrsteOpreme.poruka);

      setNaziv(opremaData.naziv);
      setOpis(opremaData.opis);
      setDatumProvjereValjanosti(new Date(opremaData.datumProvjereValjanosti)); // Ensure this is a Date object
      setDatumKrajaValjanosti(new Date(opremaData.datumKrajaValjanosti)); // Ensure this is a Date object
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

    const naziv = e.target.naziv.value;
    const opis = e.target.opis.value;
    const datumProvjereValjanosti = savedDatumProvjereValjanosti.toISOString().split("T")[0];
    const datumKrajaValjanosti = savedDatumKrajaValjanosti.toISOString().split("T")[0];

    promjeni(routeParams.sifra, {
      naziv,
      opis,
      datumProvjereValjanosti,
      datumKrajaValjanosti,
      vrstaOpremeSifra: parseInt(vrstaOpreme),
    });
  }

  async function promjeni(sifra, oprema) {
    const odgovor = await OpremaService.promjena(sifra, oprema);
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(-1);
  }

  if (!oprema) {
    return <p>Učitavanje...</p>;
  }

  return (
    <>
      <h4>Uredi opremu</h4>

      <Form onSubmit={obradiSubmit}>
        <Form.Group controlId="naziv">
          <Form.Label>Naziv</Form.Label>
          <Form.Control
            type="text"
            name="naziv"
            placeholder="Naziv opreme"
            required
            defaultValue={savedNaziv}
          />
        </Form.Group>

        <Form.Group controlId="opis">
          <Form.Label>Opis</Form.Label>
          <Form.Control
            as="textarea"
            type="text"
            name="opis"
            placeholder="Opis opreme"
            defaultValue={savedOpis}
            style={{ resize: "both", minHeight: "100px" }}
          />
        </Form.Group>

        <Form.Group controlId="datumProvjereValjanosti">
          <Form.Label>Datum provjere valjanosti</Form.Label>
          <DatePicker
            selected={savedDatumProvjereValjanosti}
            onChange={(date) => setDatumProvjereValjanosti(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            wrapperClassName="w-100"
          />
        </Form.Group>

        <Form.Group controlId="datumKrajaValjanosti">
          <Form.Label>Datum kraja valjanosti</Form.Label>
          <DatePicker
            selected={savedDatumKrajaValjanosti}
            onChange={(date) => setDatumKrajaValjanosti(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            wrapperClassName="w-100"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="vrstaOpreme">
          <Form.Label>Vrsta opreme</Form.Label>
          <Form.Select
            value={vrstaOpreme}
            onChange={(e) => setVrstaOpreme(e.target.value)}
          >
            <option value="" disabled>
              Odaberi vrstu opreme
            </option>
            {vrsteOpreme &&
              vrsteOpreme.map((s, index) => (
                <option key={index} value={s.sifra}>
                  {s.vrsta}
                </option>
              ))}
          </Form.Select>
        </Form.Group>

        <hr />
        <Row>
          <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
            <Link to={RouteNames.OPREMA} className="btn btn-danger siroko">
              Odustani
            </Link>
          </Col>
          <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="primary" type="submit" className="siroko">
              Spremi promjene
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
