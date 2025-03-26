import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import VozilaService from "../../services/VozilaService";
import SpremnikService from "../../services/SpremnikService";
import SpremnikVozilaService from "../../services/SpremnikVozilaService";
import useLoading from "../../hooks/useLoading";
import useError from "../../hooks/useError";

export default function SpremnikVozilaDodaj() {
  const { sifra } = useParams(); 
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();

  const [vozila, setVozila] = useState([]);
  const [spremnici, setSpremnike] = useState([]);
  const [selectedVozilo, setSelectedVozilo] = useState(""); 
  const [selectedSpremnik, setSelectedSpremnik] = useState("");

  useEffect(() => {
    async function fetchData() {
      showLoading();
      try {
        const vozilaRes = await VozilaService.get();
        if (vozilaRes.greska) throw new Error(vozilaRes.poruka);
        setVozila(vozilaRes.poruka);

        const spremnikRes = await SpremnikService.get();
        if (spremnikRes.greska) throw new Error(spremnikRes.poruka);
        setSpremnike(spremnikRes.poruka);
        console.log(sifra)
  
        if (parseInt(sifra)) {
          setSelectedVozilo(sifra);
        }

      } catch (error) {
        prikaziError(error.message);
      } finally {
        hideLoading();
      }
    }
    fetchData();
  }, [sifra]);

  async function dodaj(e) {
    showLoading();
    try {
      const odgovor = await SpremnikVozilaService.dodaj(e);
      if (odgovor.greska) throw new Error(odgovor.poruka);
      navigate(-1);
    } catch (error) {
      prikaziError(error.message);
    } finally {
      hideLoading();
    }
  }

  function obradiSubmit(e) {
    e.preventDefault();
    if (!selectedVozilo || !selectedSpremnik) {
      prikaziError("Molimo odaberite vozilo i spremnik.");
      return;
    }

    dodaj({
      sifraVozila: parseInt(selectedVozilo),
      sifraSpremnika: parseInt(selectedSpremnik),
    });
  }

  return (
    <>
      <h4>Dodavanje spremnika vozila</h4>

      <Form onSubmit={obradiSubmit}>
        <Form.Group className="mb-3" controlId="vozilo">
          <Form.Label>Odaberi vozilo</Form.Label>
          <Form.Select
            value={selectedVozilo}
            onChange={(e) => setSelectedVozilo(e.target.value)}
            disabled={!!parseInt(sifra)} 
          >
            <option selected value="" disabled>Odaberi vozilo</option>
            {vozila.map((vozilo) => (
              <option key={vozilo.sifra} value={vozilo.sifra}>
                {vozilo.naziv}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="spremnik">
          <Form.Label>Odaberi spremnik</Form.Label>
          <Form.Select
            value={selectedSpremnik}
            onChange={(e) => setSelectedSpremnik(e.target.value)}
          >
            <option value="" disabled>Odaberi spremnik</option>
            {spremnici.map((spremnik) => (
              <option key={spremnik.sifra} value={spremnik.sifra}>
                {spremnik.naziv}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <hr />
        <Row>
          <Col xs={6}>
            <Button onClick={() => navigate(-1)} className="btn btn-danger siroko">
              Odustani
            </Button>
          </Col>
          <Col xs={6}>
            <Button variant="primary" type="submit" className="siroko">
              Dodaj spremnik vozilu
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
