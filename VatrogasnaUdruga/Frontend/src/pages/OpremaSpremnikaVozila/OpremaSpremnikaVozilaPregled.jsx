import { useEffect, useState } from "react";
import VozilaService from "../../services/VozilaService";
import SpremnikService from "../../services/SpremnikService";
import OpremaService from "../../services/OpremaService";
import VrstaOpremeService from "../../services/VrstaOpremeService";
import SpremnikVozilaService from "../../services/SpremnikVozilaService";
import OpremaSpremnikaService from "../../services/OpremaSpremnikaService";
import { Table, Button } from "react-bootstrap";
import useLoading from "../../hooks/useLoading";
import useError from "../../hooks/useError";
import { RouteNames } from '../../constants';
import { Link, useNavigate } from "react-router-dom";

export default function VozilaPregled() {
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const navigate = useNavigate();
  const [vozila, setVozila] = useState([]);


  function obrisi(sifraOpreme, sifraSpremnika, kolicina){
    if(!confirm('Sigurno obrisati?')){
        return;
    }
    brisanjeOpremeSpremnika({sifraOpreme, sifraSpremnika, kolicina})
}

async function brisanjeOpremeSpremnika(e) {
    showLoading();
    const odgovor = await OpremaSpremnikaService.pronadiIUkloni(e);
    hideLoading();
    if(odgovor.greska){
        prikaziError(odgovor.poruka)
        return
    }
    dohvatiPodatke();
}


  async function dohvatiPodatke() {
    showLoading();
    try {
        showLoading();
        const vozilaRes = await VozilaService.get();
        hideLoading();
        if(vozilaRes.greska){
            prikaziError(vozilaRes.poruka)
            return
        }
    
        showLoading();
        const spremniciRes = await SpremnikService.get();
        hideLoading();
        if(spremniciRes.greska){
            prikaziError(spremniciRes.poruka)
            return
        }
    
        showLoading();
        const opremaRes = await OpremaService.get();
        hideLoading();
        if(opremaRes.greska){
            prikaziError(opremaRes.poruka)
            return
        }
    
        showLoading();
        const spremniciVozilaRes = await SpremnikVozilaService.get();
        hideLoading();
        if(spremniciVozilaRes.greska){
            prikaziError(spremniciVozilaRes.poruka)
            return
        }
    
        showLoading();
        const opremaSpremnikaRes = await OpremaSpremnikaService.get();
        hideLoading();
        if(opremaSpremnikaRes.greska){
            prikaziError(spremniciRes.poruka)
            return
        }   
        
        showLoading();
        const vrsteOpremeRes = await VrstaOpremeService.get();
        hideLoading();
        if(vrsteOpremeRes.greska){
            prikaziError(vrsteOpremeRes.poruka)
            return
        }

        const podaci = vozilaRes.poruka.map((vozilo) => {
            const spremniciVozila = spremniciVozilaRes.poruka.filter(
            (sv) => sv.sifraVozila === vozilo.sifra
            );
            const spremniciSaOpremom = spremniciVozila.map((sv) => {
            const spremnik = spremniciRes.poruka.find((s) => s.sifra === sv.sifraSpremnika);
            const opremaIds = opremaSpremnikaRes.poruka
                .filter((os) => os.sifraSpremnika === spremnik?.sifra)
                .map((os) => os.sifraOpreme);
    
            const oprema = opremaRes.poruka.filter((op) => opremaIds.includes(op.sifra)).map((op) => {
                const vrsta = vrsteOpremeRes.poruka.find((v) => v.sifra === op.vrstaOpremeSifra);
                return { ...op, vrstaOpremeNaziv: vrsta ? vrsta.vrsta : "Nepoznato" };
                });

            const kolicinaOpreme = oprema.map((op) => {
                const opremaSpremnik = opremaSpremnikaRes.poruka.find(
                    (os) => os.sifraOpreme === op.sifra && os.sifraSpremnika === spremnik?.sifra
                );
                return {
                    ...op,
                    kolicina: opremaSpremnik ? opremaSpremnik.kolicina : 0, 
                };
            });
            return { ...spremnik, oprema:  kolicinaOpreme};
            });    
            return { ...vozilo, spremnici: spremniciSaOpremom };
        });
    
        setVozila(podaci);
    } catch (error) {
        prikaziError("Greška pri dohvaćanju podataka.");
    }
    hideLoading();
  }

  useEffect(() => {
    dohvatiPodatke();
  }, []);

  return (
    <div>
      <h2>Vozila i njihova oprema</h2>
      {vozila.map((vozilo) => (
        <div key={vozilo.sifra} className="mb-4">
          <h2 className="mb-4 text-danger">{vozilo.naziv} </h2>
          <Link to={`/spremnikVozila/dodaj/${vozilo.sifra}`}
            className="btn btn-secondary siroko">Dodaj novi spremnik</Link>
          {vozilo.spremnici.length > 0 ? (
          vozilo.spremnici.map((spremnik) => (
            <div key={spremnik.sifra}>
              <h4>{spremnik.naziv}</h4>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Oprema</th>
                    <th>Količina</th>
                    <th>Vrsta opreme</th>
                  </tr>
                </thead>
                <tbody>
                  {spremnik.oprema.length > 0 ? (
                    spremnik.oprema.map((oprema) => (
                      <tr key={oprema.sifra}>
                        <td>{oprema.naziv}</td>
                        <td>{oprema.kolicina}</td>
                        <td>{oprema.vrstaOpremeNaziv}</td>
                        <td>
                          <Button variant="primary" onClick={() => navigate(`/oprema/uredi/${oprema.sifra}`)}>
                            Uredi opremu
                          </Button>
                          <Button variant="danger" onClick={() => obrisi(oprema.sifra, spremnik.sifra, oprema.kolicina)}>Obrisi opremu</Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Nema opreme u spremniku.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <div className="d-flex justify-content-start">
                <Button variant="success" className="ml-3" onClick={() => navigate(`/opremaSpremnikaVozila/dodajOpremu/${spremnik.sifra}`)}>
                  Dodaj opremu
                 </Button>
                <Button variant="secondary" className="mr-2" onClick={() => navigate(`/spremnik/uredi/${spremnik.sifra}`)}>
                  Uredi spremnik
                </Button>
              </div>
            </div>
          ))
          ) : (
          <p>Nema spremnika za ovo vozilo.</p>
          )}

        </div>
      ))}
    </div>
  );
}
