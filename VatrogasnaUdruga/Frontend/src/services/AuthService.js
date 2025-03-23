import { HttpService } from './HttpService';

export async function logInService(podaci) {
  return await HttpService
    .post('/Autorizacija/token', podaci)
    .then((odgovor)=>{return  {greska: false, poruka: odgovor.data};})
    .catch((e)=>{ return {greska: true, poruka: 'Problem kod autorizacije '}});
}