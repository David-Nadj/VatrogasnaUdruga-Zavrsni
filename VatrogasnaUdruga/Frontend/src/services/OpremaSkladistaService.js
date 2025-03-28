import { HttpService } from "./HttpService";

async function get(){
    return await HttpService.get('/OpremaSkladista')
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{
        return {greska: true, poruka: 'Problem kod dohvaćanja opreme skladišta'}   
    })
}

async function brisanje(sifra){
    return await HttpService.delete('/OpremaSkladista/' + sifra)
    .then(()=>{
        return {greska: false, poruka: 'Obrisano'}
    })
    .catch(()=>{
        return {greska: true, poruka: 'Problem kod brisanja opreme skladištaa'}   
    })
}

async function dodaj(vrsta){
    return await HttpService.post('/OpremaSkladista/dodaj/', vrsta)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{
        switch (e.status) {
            case 400:
                let poruke='';
                for(const kljuc in e.response.data.errors){
                    poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + ', ';
                }
                return {greska: true, poruka: poruke}
            default:
                return {greska: true, poruka: 'Oprema skladišta se ne može dodati!'}
        }
    })
}

async function promjena(sifra,smjer){
    return await HttpService.put('/OpremaSkladista/uredi/' + sifra,smjer)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{
        switch (e.status) {
            case 400:
                let poruke='';
                for(const kljuc in e.response.data.errors){
                    poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + ', ';
                }
                console.log(poruke)
                return {greska: true, poruka: poruke}
            default:
                return {greska: true, poruka: 'Oprema skladišta se ne može promjeniti!'}
        }
    })
}

async function getBySifra(sifra){
    return await HttpService.get('/OpremaSkladista/'+sifra)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{
        return {greska: true, poruka: 'Problem kod dohvaćanja opreme skladišta s šifrom '+sifra}   
    })
}

async function urediVezu(veza){
    return await HttpService.put('/OpremaSkladista/urediVezu',veza)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{
        switch (e.status) {
            case 400:
                let poruke='';
                for(const kljuc in e.response.data.errors){
                    poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + ', ';
                }
                console.log(poruke)
                return {greska: true, poruka: poruke}
            default:
                return {greska: true, poruka: 'Veza oprema skladišta se ne može promjeniti!'}
        }
    })
}

async function pronadiIUkloni(oprema) {
    return await HttpService.delete('/OpremaSkladista/ukloni', { data: oprema })
        .then(() => {
            return { greska: false, poruka: 'Obrisano' };
        })
        .catch(() => {
            return { greska: true, poruka: 'Problem kod brisanja opreme spremnika' };
        });
}

export default {
    get,
    brisanje,
    dodaj,
    getBySifra,
    promjena,
    urediVezu, 
    pronadiIUkloni
}