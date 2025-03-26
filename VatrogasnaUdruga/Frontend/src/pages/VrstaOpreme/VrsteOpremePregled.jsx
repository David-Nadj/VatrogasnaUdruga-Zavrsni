import { useEffect, useState } from "react"
import VrsteOpremeService from "../../services/VrstaOpremeService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';


export default function VrsteOpremePregled(){

    const navigate = useNavigate()
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    const[vrsteOpreme, setVrsteOpreme] = useState();

    async function dohvatiVrsteOpreme(){
        showLoading();
        const odgovor = await VrsteOpremeService.get();
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        //debugger; // ovo radi u Chrome inspect (ali i ostali preglednici)
        setVrsteOpreme(odgovor.poruka)
    } 

    useEffect(()=>{
        dohvatiVrsteOpreme();
    },[])

    function obrisi(sifra){
        if(!confirm('Sigurno obrisati?')){
            return;
        }
        brisanjeVrsteOpreme(sifra)
    }

    async function brisanjeVrsteOpreme(sifra) {
        showLoading();
        const odgovor = await VrsteOpremeService.brisanje(sifra);
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        dohvatiVrsteOpreme();
    }

    return(
        <>
        <Link to={RouteNames.VRSTA_OPREME_NOVO}
        className="btn btn-success siroko">Dodaj novu vrstu</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Vrsta opreme</th>
                </tr>
            </thead>
            <tbody>
                {vrsteOpreme && vrsteOpreme.map((vrsta,index)=>(
                    <tr key={index}>
                        <td>
                            {vrsta.vrsta}
                        </td>
                        <td>
                            <Button variant="danger" onClick={()=>obrisi(vrsta.sifra)}>Ukloni</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button onClick={()=>navigate(`/vrstaOpreme/uredi/${vrsta.sifra}`)}>Uredi</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}