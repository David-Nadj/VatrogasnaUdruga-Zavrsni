import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OpremaService from "../../services/OpremaService";
import VatrogasacService from "../../services/VatrogasacService";
import { Button, Form } from "react-bootstrap";
import useLoading from "../../hooks/useLoading";
import useError from "../../hooks/useError";
import OpremaVatrogascaService from "../../services/OpremaVatrogascaService";

export default function DodajOpremu() {
  const { sifra } = useParams(); 
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const navigate = useNavigate();
  
  const [vatrogasci, setVatrogasci] = useState([]);
  const [oprema, setOprema] = useState([]);
  const [sifraVatrogasca, setSelectedVatrogasac] = useState(sifra);
  const [sifraOpreme, setSelectedOprema] = useState('');
  const [kolicina, setKolicina] = useState(0);

  async function dohvatiPodatke() {
    showLoading();
    try {
      const vatrogasciRes = await VatrogasacService.get();
      const opremaRes = await OpremaService.get();
      hideLoading();
      if (vatrogasciRes.greska || opremaRes.greska) {
        prikaziError("Greška pri dohvaćanju podataka.");
        return;
      }
      setVatrogasci(vatrogasciRes.poruka);
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
      showLoading();
      try {
        const payload = {
          sifraVatrogasca: parseInt(sifraVatrogasca),
          sifraOpreme: parseInt(sifraOpreme),
          kolicina: parseInt(kolicina)
        };
        
        const response = await OpremaVatrogascaService.dodaj(payload);
        hideLoading();
        
        if (response.greska) {
          prikaziError(response.poruka);
        } else {
          navigate(-1);
        }
      } catch (error) {
        hideLoading();
        prikaziError("Greška pri dodavanju opreme.");
      }
    } else {
      prikaziError("Molimo odaberite opremu i unesite količinu.");
    }
  };

  return (
    <div>
      <h2>Dodaj opremu vatrogascu</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="sifraVatrogasca">
          <Form.Label>Vatrogasac</Form.Label>
          <Form.Control 
            as="select" 
            value={sifraVatrogasca} 
            onChange={(e) => setSelectedVatrogasac(e.target.value)}
          >
            {vatrogasci.map((vatrogasac) => (
              <option key={vatrogasac.sifra} value={vatrogasac.sifra}>
                {vatrogasac.ime} {vatrogasac.prezime}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="sifraOpreme">
          <Form.Label>Oprema</Form.Label>
          <Form.Control 
            as="select" 
            value={sifraOpreme} 
            onChange={(e) => setSelectedOprema(e.target.value)}
          >
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
            onChange={(e) => setKolicina(parseInt(e.target.value) || 0)}
          />
        </Form.Group>
        <Button variant="success" type="submit">
          Dodaj opremu
        </Button>
      </Form>
    </div>
  );
}