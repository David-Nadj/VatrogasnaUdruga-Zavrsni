import { useEffect, useState } from "react"
import VatrogasacService from "../../services/VatrogasacService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';

export default function VatrogasacPregled(){

    const navigate = useNavigate()
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    const[vatrogasac, setVatrogasac] = useState();

    async function dohvatiVatrogasce(){
        showLoading();
        const odgovor = await VatrogasacService.get();
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        setVatrogasac(odgovor.poruka)
    } 

    useEffect(()=>{
        dohvatiVatrogasce();
    },[])

    function obrisi(sifra){
        if(!confirm('Sigurno obrisati?')){
            return;
        }
        brisanjeVatrogasca(sifra)
    }

    async function brisanjeVatrogasca(sifra) {
        showLoading();
        const odgovor = await VatrogasacService.brisanje(sifra);
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        dohvatiVatrogasce();
    }

    return(
        <>
        <Link to={RouteNames.VATROGASAC_NOVO}
        className="btn btn-success siroko">Dodaj novog vatrogasca</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Ime</th>
                    <th>Prezime</th>
                    <th>Broj telefona</th>
                    <th>Godina rođenja</th>
                </tr>
            </thead>
            <tbody>
                {vatrogasac && vatrogasac.map((vatrogasac,index)=>(
                    <tr key={index}>
                        <td>
                            {vatrogasac.ime}
                        </td>
                        <td className="sredina">
                            {vatrogasac.prezime}
                        </td>
                        <td className="sredina">
                            {vatrogasac.brojTelefona}
                        </td>
                        <td className="sredina">
                            {vatrogasac.godinaRodenja}
                        </td>

                        <td>
                            <Button variant="danger" onClick={()=>obrisi(vatrogasac.sifra)}>Ukloni</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button onClick={()=>navigate(`/vatrogasac/uredi/${vatrogasac.sifra}`)}>Uredi</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}