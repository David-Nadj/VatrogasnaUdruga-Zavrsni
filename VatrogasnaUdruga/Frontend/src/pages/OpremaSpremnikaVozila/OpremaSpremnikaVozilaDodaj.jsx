import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OpremaService from "../../services/OpremaService";
import SpremnikService from "../../services/SpremnikService";
import { Button, Form } from "react-bootstrap";
import useLoading from "../../hooks/useLoading";
import useError from "../../hooks/useError";
import OpremaSpremnikaService from "../../services/OpremaSpremnikaService";

export default function DodajOpremu() {
  const { sifra } = useParams(); 
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const navigate = useNavigate();
  
  const [spremnici, setSpremnici] = useState([]);
  const [oprema, setOprema] = useState([]);
  const [sifraSpremnika, setSelectedSpremnik] = useState(sifra);
  const [sifraOpreme, setSelectedOprema] = useState('');
  const [kolicina, setKolicina] = useState(0);

  async function dohvatiPodatke() {
    showLoading();
    try {
      const spremniciRes = await SpremnikService.get();
      const opremaRes = await OpremaService.get();
      hideLoading();
      if (spremniciRes.greska || opremaRes.greska) {
        prikaziError("Greška pri dohvaćanju podataka.");
        return;
      }
      setSpremnici(spremniciRes.poruka);
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
        const response = await OpremaSpremnikaService.dodaj({sifraSpremnika, sifraOpreme, kolicina});
        if (response.greska) {
          prikaziError(response.poruka);
        } else {
          navigate(-1); // Navigate back to the selected spremnik
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
        <Form.Group controlId="sifraSpremnika">
          <Form.Label>Spremnik</Form.Label>
          <Form.Control as="select" value={sifraSpremnika} onChange={(e) => setSelectedSpremnik(e.target.value)}>
            {spremnici.map((spremnik) => (
              <option key={spremnik.sifra} value={spremnik.sifra}>
                {spremnik.naziv}
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
