import { useEffect, useState } from "react"
import SpremnikService from "../../services/SpremnikService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';

export default function SpremnikPregled(){

    const navigate = useNavigate()
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    const[spremici, setSpremnik] = useState();

    async function dohvatiSpremnik(){
        showLoading();
        const odgovor = await SpremnikService.get();
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        setSpremnik(odgovor.poruka)
    } 

    useEffect(()=>{
       dohvatiSpremnik();
    },[])

    function obrisi(sifra){
        if(!confirm('Sigurno obrisati?')){
            return;
        }
        brisanjeSpremnika(sifra)
    }

    async function brisanjeSpremnika(sifraSpremnika) {
        showLoading();
        const odgovor = await SpremnikService.brisanje(sifraSpremnika);
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        dohvatiSpremnik();
    }

    return(
        <>
        <Link to={RouteNames.SPREMNIK_NOVO}
        className="btn btn-success siroko">Dodaj novi spremnik</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                </tr>
            </thead>
            <tbody>
                {spremici && spremici.map((spremnik,index)=>(
                    <tr key={index}>
                        <td>
                            {spremnik.naziv}
                        </td>
                       
                        <td>
                            <Button variant="danger" onClick={()=>obrisi(spremnik.sifra)}>Ukloni</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button onClick={()=>navigate(`/spremnik/uredi/${spremnik.sifra}`)}>Uredi</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    );
}