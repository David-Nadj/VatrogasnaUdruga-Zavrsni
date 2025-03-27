import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SkladisteService from "../../services/SkladisteService";
import OpremaService from "../../services/OpremaService";
import OpremaSkladistaService from "../../services/OpremaSkladistaService";
import VrstaOpremeService from "../../services/VrstaOpremeService";
import { Table, Button, Form } from "react-bootstrap";
import useLoading from "../../hooks/useLoading";
import useError from "../../hooks/useError";

export default function OpremaSkladistaPregled() {
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const navigate = useNavigate();

  const [skladista, setSkladista] = useState([]);
  const [editing, setEditing] = useState({
    sifraOpreme: null,
    sifraSkladista: null,
    kolicina: 0
  });

  async function dohvatiPodatke() {
    showLoading();
    try {
      const skladistaRes = await SkladisteService.get();
      if(skladistaRes.greska){
        prikaziError(skladistaRes.poruka);
        return;
      }
      
      const opremaRes = await OpremaService.get();
      if(opremaRes.greska){
        prikaziError(opremaRes.poruka);
        return;
      }
      
      const opremaSkladistaRes = await OpremaSkladistaService.get();
      if(opremaSkladistaRes.greska){
        prikaziError(opremaSkladistaRes.poruka);
        return;
      }
      
      const vrsteOpremeRes = await VrstaOpremeService.get();
      if(vrsteOpremeRes.greska){
        prikaziError(vrsteOpremeRes.poruka);
        return;
      }
          
      const podaci = skladistaRes.poruka.map((skladiste) => {
        const opremaSkladista = opremaSkladistaRes.poruka.filter(
          (os) => os.sifraSkladista === skladiste.sifra
        );
        const opremaSaKolicinama = opremaSkladista.map((os) => {
          const oprema = opremaRes.poruka.find((o) => o.sifra === os.sifraOpreme);
          const vrsta = vrsteOpremeRes.poruka.find((v) => v.sifra === oprema?.vrstaOpremeSifra);
          return { 
            ...oprema, 
            vrstaOpremeNaziv: vrsta ? vrsta.vrsta : "Nepoznato",
            kolicina: os.kolicina
          };
        });    
        return { ...skladiste, oprema: opremaSaKolicinama };
      });
      
      setSkladista(podaci);
    } catch (error) {
      prikaziError("Greška pri dohvaćanju podataka.");
    } finally {
      hideLoading();
    }
  }

  async function brisanjeOpremeSkladista(sifraO, sifraS) {
    if(!confirm('Sigurno obrisati opremu iz skladišta?')) {
      return;
    }
    showLoading();
    try {
      const sifraOpreme = sifraO.sifra;
      const sifraSkladista = sifraS.sifra;
      const odgovor = await OpremaSkladistaService.pronadiIUkloni({sifraOpreme, sifraSkladista});
      if(odgovor.greska) {
        prikaziError(odgovor.poruka);
        return;
      }
      dohvatiPodatke();
    } catch (error) {
      prikaziError("Greška pri brisanju opreme iz skladišta.");
    } finally {
      hideLoading();
    }
  }

  function startEditing(oprema, skladiste) {
    setEditing({
      sifraOpreme: oprema.sifra,
      sifraSkladista: skladiste.sifra,
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
      sifraSkladista: null,
      kolicina: 0
    });
  }

  async function spremiIzmjene() {
    showLoading();
    try {
      const sifraOpreme = editing.sifraOpreme;
      const sifraSkladista = editing.sifraSkladista;
      const kolicina = editing.kolicina;
      console.log(sifraSkladista)
      const odgovor = await OpremaSkladistaService.urediVezu(
        {sifraOpreme, 
        sifraSkladista, 
        kolicina}
      );
      
      if(odgovor.greska) {
        prikaziError(odgovor.poruka);
        return;
      }
      dohvatiPodatke();
      setEditing({
        sifraOpreme: null,
        sifraSkladista: null,
        kolicina: 0
      });
    } catch (error) {
      prikaziError("Greška pri ažuriranju količine.");
    } finally {
      hideLoading();
    }
  }

  useEffect(() => {
    dohvatiPodatke();
  }, []);

  return (
    <div>
      <h2>Skladišta i njihova oprema</h2>
      {skladista.map((skladiste) => (
        <div key={skladiste.sifra} className="mb-4">
          <h3 className="mb-4 text-danger">{skladiste.naziv}</h3>
          {skladiste.oprema.length > 0 ? (
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
                  {skladiste.oprema.map((oprema) => (
                    <tr key={oprema.sifra}>
                      <td>{oprema.naziv}</td>
                      <td>
                        {editing.sifraOpreme === oprema.sifra && 
                         editing.sifraSkladista === skladiste.sifra ? (
                          <Form.Control
                            type="number"
                            value={editing.kolicina}
                            onChange={handleQuantityChange}
                            min="0"
                            style={{ width: '80px' }}
                          />
                        ) : (
                          oprema.kolicina
                        )}
                      </td>
                      <td>{oprema.vrstaOpremeNaziv}</td>
                      <td>
                        {editing.sifraOpreme === oprema.sifra && 
                         editing.sifraSkladista === skladiste.sifra ? (
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
                              onClick={() => startEditing(oprema, skladiste)}
                              className="me-2"
                            >
                              Uredi količinu
                            </Button>
                            <Button 
                              variant="danger" 
                              onClick={() => brisanjeOpremeSkladista(oprema, skladiste)}
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
              <Button variant="success" className="ml-3" onClick={() => navigate(`/opremaSkladista/dodajOpremu/${skladiste.sifra}`)}>
                Dodaj opremu
              </Button>
              </div>
            </div>
          ) : (
            <p>Nema opreme za ovo skladište.</p>
          )}
        </div>
      ))}
    </div>
  );
}