import { useEffect, useState } from "react";
import VatrogasacService from "../../services/VatrogasacService";
import OpremaService from "../../services/OpremaService";
import OpremaVatrogascaService from "../../services/OpremaVatrogascaService";
import VrstaOpremeService from "../../services/VrstaOpremeService";
import { Table, Button } from "react-bootstrap";
import useLoading from "../../hooks/useLoading";
import useError from "../../hooks/useError";

export default function OpremaVatrogasciPregled() {
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();

  const [vatrogasci, setVatrogasci] = useState([]);

  async function dohvatiPodatke() {
    showLoading();
    try {
        showLoading();
        const vatrogasciRes = await VatrogasacService.get();
        hideLoading();
        if(vatrogasciRes.greska){
            prikaziError(vatrogasciRes.poruka)
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
        const opremaVatrogasacaRes = await OpremaVatrogascaService.get();
        hideLoading();
        if(opremaVatrogasacaRes.greska){
            prikaziError(opremaVatrogasacaRes.poruka)
            return
        }
    
        showLoading();
        const vrsteOpremeRes = await VrstaOpremeService.get();
        hideLoading();
        if(vrsteOpremeRes.greska){
            prikaziError(vrsteOpremeRes.poruka)
            return
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
    
        console.log("Obrađeni podaci vatrogasaca:", podaci);
        setVatrogasci(podaci);
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
      <h2>Vatrogasci i njihova oprema</h2>
      {vatrogasci.map((vatrogasac) => (
        <div key={vatrogasac.sifra} className="mb-4">
          <h3 className="mb-4 text-danger">{vatrogasac.ime}  {vatrogasac.prezime}</h3>
          {vatrogasac.oprema.length > 0 ? (
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
                {vatrogasac.oprema.map((oprema) => (
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
                      Uredi vatrogasca
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
