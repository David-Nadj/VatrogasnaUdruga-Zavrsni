import { useEffect, useState } from "react"
import SkladisteService from "../../services/SkladisteService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';

export default function SkladistePregled(){

    const navigate = useNavigate()
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    const[skladiste, setSkladiste] = useState();

    async function dohvatiSkladista(){
        showLoading();
        const odgovor = await SkladisteService.get();
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        setSkladiste(odgovor.poruka)
    } 

    useEffect(()=>{
        dohvatiSkladista();
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
        brisanjeSkladista(sifra)
    }

    async function brisanjeSkladista(sifra) {
        showLoading();
        const odgovor = await SkladisteService.brisanje(sifra);
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        dohvatiSkladista();
    }

    return(
        <>
        <Link to={RouteNames.SKLADISTE_NOVO}
        className="btn btn-success siroko">Dodaj novo skladiste</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Adresa</th>
                </tr>
            </thead>
            <tbody>
                {skladiste && skladiste.map((skladista,index)=>(
                    <tr key={index}>
                        <td>
                            {skladista.naziv}
                        </td>
                        <td className="sredina">
                            {skladista.adresa}
                        </td>
                        <td>
                            <Button variant="danger" onClick={()=>obrisi(skladista.sifra)}>Ukloni</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button onClick={()=>navigate(`/skladiste/uredi/${skladista.sifra}`)}>Uredi</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}