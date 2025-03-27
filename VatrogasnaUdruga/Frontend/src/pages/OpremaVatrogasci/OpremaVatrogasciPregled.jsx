import { useEffect, useState } from "react";
import VatrogasacService from "../../services/VatrogasacService";
import OpremaService from "../../services/OpremaService";
import OpremaVatrogascaService from "../../services/OpremaVatrogascaService";
import VrstaOpremeService from "../../services/VrstaOpremeService";
import { Table, Button, Form } from "react-bootstrap";
import useLoading from "../../hooks/useLoading";
import useError from "../../hooks/useError";
import { useNavigate } from "react-router-dom";

export default function OpremaVatrogasciPregled() {
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const navigate = useNavigate();

  const [vatrogasci, setVatrogasci] = useState([]);
  const [editing, setEditing] = useState({
    sifraOpreme: null,
    sifraVatrogasca: null,
    kolicina: 0
  });

  async function dohvatiPodatke() {
    showLoading();
    try {
      const [vatrogasciRes, opremaRes, opremaVatrogasacaRes, vrsteOpremeRes] = await Promise.all([
        VatrogasacService.get(),
        OpremaService.get(),
        OpremaVatrogascaService.get(),
        VrstaOpremeService.get()
      ]);

      if (vatrogasciRes.greska || opremaRes.greska || opremaVatrogasacaRes.greska || vrsteOpremeRes.greska) {
        prikaziError("Greška pri dohvaćanju podataka.");
        return;
      }

      const podaci = vatrogasciRes.poruka.map((vatrogasac) => {
        const opremaVatrogasaca = opremaVatrogasacaRes.poruka.filter(
          (ov) => ov.sifraVatrogasca === vatrogasac.sifra
        );
        
        const opremaSaKolicinama = opremaVatrogasaca.map((ov) => {
          const oprema = opremaRes.poruka.find((o) => o.sifra === ov.sifraOpreme);
          const vrsta = vrsteOpremeRes.poruka.find((v) => v.sifra === oprema?.vrstaOpremeSifra);
          
          return { 
            ...oprema, 
            vrstaOpremeNaziv: vrsta ? vrsta.vrsta : "Nepoznato",
            kolicina: ov.kolicina
          };
        });
        
        return { ...vatrogasac, oprema: opremaSaKolicinama };
      });

      setVatrogasci(podaci);
    } catch (error) {
      prikaziError("Greška pri dohvaćanju podataka.");
    } finally {
      hideLoading();
    }
  }

  useEffect(() => {
    dohvatiPodatke();
  }, []);

  function startEditing(oprema, vatrogasac) {
    setEditing({
      sifraOpreme: oprema.sifra,
      sifraVatrogasca: vatrogasac.sifra,
      kolicina: oprema.kolicina
    });
  }

  function handleQuantityChange(e) {
    setEditing(prev => ({
      ...prev,
      kolicina: parseInt(e.target.value) || 0
    }));
  }

  function cancelEditing() {
    setEditing({
      sifraOpreme: null,
      sifraVatrogasca: null,
      kolicina: 0
    });
  }

  async function spremiIzmjene() {
    showLoading();
    try {
      const odgovor = await OpremaVatrogascaService.urediVezu({
        SifraOpreme: editing.sifraOpreme,
        SifraVatrogasca: editing.sifraVatrogasca,
        Kolicina: editing.kolicina
      });
      
      if (odgovor.greska) {
        prikaziError(odgovor.poruka);
        return;
      }
      
      cancelEditing();
      dohvatiPodatke();
    } catch (error) {
      prikaziError("Greška pri ažuriranju količine.");
    } finally {
      hideLoading();
    }
  }

  async function obrisi(sifraOpreme, sifraVatrogasca) {
    if (!confirm('Sigurno obrisati opremu vatrogasca?')) {
      return;
    }
    showLoading();
    try {
      const odgovor = await OpremaVatrogascaService.pronadiIUkloni({
        sifraOpreme,
        sifraVatrogasca
      });
      
      if (odgovor.greska) {
        prikaziError(odgovor.poruka);
        return;
      }
      dohvatiPodatke();
    } catch (error) {
      prikaziError("Greška pri brisanju opreme vatrogasca.");
    } finally {
      hideLoading();
    }
  }

  return (
    <div>
      <h2>Vatrogasci i njihova oprema</h2>
      {vatrogasci.map((vatrogasac) => (
        <div key={vatrogasac.sifra} className="mb-4">
          <h3 className="mb-4 text-danger">{vatrogasac.ime} {vatrogasac.prezime}</h3>
          {vatrogasac.oprema.length > 0 ? (
            <div>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Oprema</th>
                    <th>Količina</th>
                    <th>Vrsta opreme</th>
                    <th>Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {vatrogasac.oprema.map((oprema) => (
                    <tr key={oprema.sifra}>
                      <td>{oprema.naziv}</td>
                      <td>
                        {editing.sifraOpreme === oprema.sifra && 
                         editing.sifraVatrogasca === vatrogasac.sifra ? (
                          <Form.Control
                            type="number"
                            min="1"
                            value={editing.kolicina}
                            onChange={handleQuantityChange}
                            style={{ width: '80px' }}
                          />
                        ) : (
                          oprema.kolicina
                        )}
                      </td>
                      <td>{oprema.vrstaOpremeNaziv}</td>
                      <td>
                        {editing.sifraOpreme === oprema.sifra && 
                         editing.sifraVatrogasca === vatrogasac.sifra ? (
                          <>
                            <Button 
                              variant="success" 
                              onClick={spremiIzmjene}
                              className="me-2"
                            >
                              Spremi
                            </Button>
                            <Button 
                              variant="secondary" 
                              onClick={cancelEditing}
                            >
                              Odustani
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="primary" 
                              onClick={() => startEditing(oprema, vatrogasac)}
                              className="me-2"
                            >
                              Uredi količinu
                            </Button>
                            <Button 
                              variant="danger" 
                              onClick={() => obrisi(oprema.sifra, vatrogasac.sifra)}
                            >
                              Obriši
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-start">
                <Button 
                  variant="success" 
                  className="ml-3" 
                  onClick={() => navigate(`/opremaVatrogasca/dodajOpremu/${vatrogasac.sifra}`)}
                >
                  Dodaj opremu
                </Button>
              </div>
            </div>
          ) : (
            <p>Nema opreme za ovog vatrogasca.</p>
          )}
        </div>
      ))}
    </div>
  );
}