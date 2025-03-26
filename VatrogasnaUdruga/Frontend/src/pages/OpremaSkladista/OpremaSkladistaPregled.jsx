import { useEffect, useState } from "react";
import SkladisteService from "../../services/SkladisteService";
import OpremaService from "../../services/OpremaService";
import OpremaSkladistaService from "../../services/OpremaSkladistaService";
import VrstaOpremeService from "../../services/VrstaOpremeService";
import { Table, Button } from "react-bootstrap";
import useLoading from "../../hooks/useLoading";
import useError from "../../hooks/useError";

export default function OpremaSkladistaPregled() {
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();

  const [skladista, setSkladista] = useState([]);

  async function dohvatiPodatke() {
    showLoading();
    try {
        showLoading();
        const skladistaRes = await SkladisteService.get();
        hideLoading();
        if(skladistaRes.greska){
            prikaziError(skladistaRes.poruka)
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
        const opremaSkladistaRes = await OpremaSkladistaService.get();
        hideLoading();
        if(opremaSkladistaRes.greska){
            prikaziError(opremaSkladistaRes.poruka)
            return
        }
    
        showLoading();
        const vrsteOpremeRes = await VrstaOpremeService.get();
        hideLoading();
        if(vrsteOpremeRes.greska){
            prikaziError(vrsteOpremeRes.poruka)
            return
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
    
        console.log("Obrađeni podaci skladišta:", podaci);
        setSkladista(podaci);
    } catch (error) {
        console.error("Greška pri dohvaćanju podataka:", error);
        prikaziError("Greška pri dohvaćanju podataka.");
    }
    hideLoading();
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
                </tr>
              </thead>
              <tbody>
                {skladiste.oprema.map((oprema) => (
                  <tr key={oprema.sifra}>
                    <td>{oprema.naziv}</td>
                    <td>{oprema.kolicina}</td> 
                    <td>{oprema.vrstaOpremeNaziv}</td> 
                    <td>
                        <Button variant="primary" className="mr-3">
                            Uredi opremu
                        </Button>
                        <Button variant="danger">
                            Obrisi opremu
                        </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-start">
            <Button variant="success" className="mr-2">
                      Dodaj opremu
                  </Button>
                  <Button variant="secondary">
                      Uredi skladište
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