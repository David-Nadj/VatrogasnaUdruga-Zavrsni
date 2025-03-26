import { useEffect, useState } from "react"
import OpremaService from "../../services/OpremaService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';
import VrstaOpremeService from "../../services/VrstaOpremeService";

export default function OpremaPregled(){

    const navigate = useNavigate()
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    const[oprema, setOpremu] = useState();
    const[vrstaOpreme, setVrsteOpreme] = useState();

    async function dohvatiVrstaOpreme(){
        showLoading();
        const odgovor = await VrstaOpremeService.get();
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        setVrsteOpreme(odgovor.poruka)
    } 
    async function dohvatiOpremu(){
        showLoading();
        const odgovor = await OpremaService.get();
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        setOpremu(odgovor.poruka)
    } 

    useEffect(()=>{
       dohvatiOpremu();
       dohvatiVrstaOpreme();
    },[])

    function formatirajDatum(datum){
        if(datum==null){
            return 'Nije definirano';
        }
        return moment.utc(datum).format('DD.MM.YYYY.')
    }

    function obrisi(sifra){
        if(!confirm('Sigurno obrisati?')){
            return;
        }
        brisanjeOpreme(sifra)
    }

    async function brisanjeOpreme(sifra) {
        showLoading();
        const odgovor = await OpremaService.brisanje(sifra);
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        dohvatiOpremu();
    }

    return(
        <>
        <Link to={RouteNames.OPREMA_NOVO}
        className="btn btn-success siroko">Dodaj novu opremu</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Opis</th>
                    <th>Datum Provjere valjanosti</th>
                    <th>Datum kraja valjanosti</th>
                    <th>Vrsta opreme</th>

                </tr>
            </thead>
            <tbody>
                {oprema && oprema.map((oprema,index)=>(
                    <tr key={index}>
                        <td>
                            {oprema.naziv}
                        </td>
                        <td className="sredina">
                            {oprema.opis}
                        </td>
                        <td className="sredina">
                            {formatirajDatum(oprema.datumProvjereValjanosti)}
                        </td>
                        <td className="sredina">
                            {formatirajDatum(oprema.datumKrajaValjanosti)}
                        </td>
                        <td className="sredina">
                        {vrstaOpreme 
                            ? vrstaOpreme.find(vrstaOpreme => vrstaOpreme.sifra === oprema.vrstaOpremeSifra)?.vrsta || "Nepoznato" 
                            : "Učitavanje..."}
                        </td>
                        <td>
                            <Button variant="danger" onClick={()=>obrisi(oprema.sifra)}>Ukloni</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button onClick={()=>navigate(`/oprema/uredi/${oprema.sifra}`)}>Uredi</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}