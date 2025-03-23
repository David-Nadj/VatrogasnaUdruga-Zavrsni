import { useEffect, useState } from "react"
import VozilaService from "../../services/VozilaService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';


export default function VozilaPregled(){

    const navigate = useNavigate()
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    const[vozila, setVozila] = useState();

    async function dohvatiVozila(){
        showLoading();
        const odgovor = await VozilaService.get();
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        //debugger; // ovo radi u Chrome inspect (ali i ostali preglednici)
        setVozila(odgovor.poruka)
    } 

    useEffect(()=>{
       dohvatiVozila();
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
        brisanjeVozila(sifra)
    }

    async function brisanjeVozila(sifra) {
        showLoading();
        const odgovor = await VozilaService.brisanje(sifra);
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        dohvatiVozila();
    }


    return(
        <>
        <Link to={RouteNames.VOZILA_NOVO}
        className="btn btn-success siroko">Dodaj novo vozilo</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Broj sjedala</th>
                    <th>Registracija</th>
                    <th>Datum proizvodnje</th>
                    <th>Datum zadnje registracije</th>
                    <th>Vrsta vozila</th>
                </tr>
            </thead>
            <tbody>
                {vozila && vozila.map((vozilo,index)=>(
                    <tr key={index}>
                        <td>
                            {vozilo.naziv}
                        </td>
                        <td className="sredina">
                            {vozilo.brojSjedala}
                        </td>
                        <td>
                            {vozilo.registracija}
                        </td>
                        <td className="sredina">
                            {formatirajDatum(vozilo.datumProizvodnje)}
                        </td>
                        <td className="sredina">
                            {formatirajDatum(vozilo.datumZadnjeRegistracije)}
                        </td>
                        <td className="sredina">
                            {vozilo.vrstaVozilaSifra}
                        </td>
                        <td>
                            <Button variant="danger" onClick={()=>obrisi(vozilo.sifra)}>Ukloni</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button onClick={()=>navigate(`/vozila/uredi/${vozilo.sifra}`)}>Uredi</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}