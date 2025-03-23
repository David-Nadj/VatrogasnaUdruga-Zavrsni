import { useEffect, useState } from "react"
import VrsteVozilaService from "../../services/VrsteVozilaService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';


export default function VrsteVozilaPregled(){

    const navigate = useNavigate()
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    const[vrsteVozila, setVrsteVozila] = useState();

    async function dohvatiVrsteVozila(){
        showLoading();
        const odgovor = await VrsteVozilaService.get();
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        //debugger; // ovo radi u Chrome inspect (ali i ostali preglednici)
        setVrsteVozila(odgovor.poruka)
    } 

    useEffect(()=>{
       dohvatiVrsteVozila();
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
        brisanjeVrsteVozila(sifra)
    }

    async function brisanjeVrsteVozila(sifra) {
        showLoading();
        const odgovor = await VrsteVozilaService.brisanje(sifra);
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        dohvatiVrsteVozila();
    }


    return(
        <>
        <Link to={RouteNames.VRSTA_VOZILA_NOVO}
        className="btn btn-success siroko">Dodaj novu vrstu</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Vrsta vozila</th>
                </tr>
            </thead>
            <tbody>
                {vrsteVozila && vrsteVozila.map((vrsta,index)=>(
                    <tr key={index}>
                        <td>
                            {vrsta.vrsta}
                        </td>
                        <td>
                            <Button variant="danger" onClick={()=>obrisi(vozilo.sifra)}>Ukloni</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button onClick={()=>navigate(`/vrsteVozila/${vozilo.sifra}`)}>Uredi</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}