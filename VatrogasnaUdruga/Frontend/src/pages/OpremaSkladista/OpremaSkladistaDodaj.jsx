import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OpremaService from "../../services/OpremaService";
import SkladisteService from "../../services/SkladisteService";
import { Button, Form } from "react-bootstrap";
import useLoading from "../../hooks/useLoading";
import useError from "../../hooks/useError";
import OpremaSkladistaService from "../../services/OpremaSkladistaService";

export default function DodajOpremu() {
  const { sifra } = useParams(); 
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const navigate = useNavigate();
  
  const [skladista, setSkladista] = useState([]);
  const [oprema, setOprema] = useState([]);
  const [sifraSkladista, setSelectedSkladiste] = useState(sifra);
  const [sifraOpreme, setSelectedOprema] = useState('');
  const [kolicina, setKolicina] = useState(0);

  async function dohvatiPodatke() {
    showLoading();
    try {
      const skladistaRes = await SkladisteService.get();
      const opremaRes = await OpremaService.get();
      hideLoading();
      if (skladistaRes.greska || opremaRes.greska) {
        prikaziError("Greška pri dohvaćanju podataka.");
        return;
      }
      setSkladista(skladistaRes.poruka);
      setOprema(opremaRes.poruka);
    } catch (error) {
      prikaziError("Greška pri dohvaćanju podataka.");
      hideLoading();
    }
  }

  useEffect(() => {
    dohvatiPodatke();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sifraOpreme && kolicina > 0) {
      try {
        const response = await OpremaSkladistaService.dodaj({sifraSkladista, sifraOpreme, kolicina});
        if (response.greska) {
          prikaziError(response.poruka);
        } else {
          navigate(-1);
        }
      } catch (error) {
        prikaziError("Greška pri dodavanju opreme.");
      }
    } else {
      prikaziError("Molimo odaberite opremu i unesite količinu.");
    }
  };

  return (
    <div>
      <h2>Dodaj opremu u spremnik</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="sifraSkladista">
          <Form.Label>Spremnik</Form.Label>
          <Form.Control as="select" value={sifraSkladista} onChange={(e) => setSelectedSkladiste(e.target.value)}>
            {skladista.map((skladiste) => (
              <option key={skladiste.sifra} value={skladiste.sifra}>
                {skladiste.naziv}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="sifraOpreme">
          <Form.Label>Oprema</Form.Label>
          <Form.Control as="select" value={sifraOpreme} onChange={(e) => setSelectedOprema(e.target.value)}>
            <option value="">Odaberite opremu</option>
            {oprema.map((item) => (
              <option key={item.sifra} value={item.sifra}>
                {item.naziv}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="kolicina">
          <Form.Label>Količina</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={kolicina}
            onChange={(e) => setKolicina(e.target.value)}
          />
        </Form.Group>

        <Button variant="success" type="submit">
          Dodaj opremu
        </Button>
      </Form>
    </div>
  );
}
