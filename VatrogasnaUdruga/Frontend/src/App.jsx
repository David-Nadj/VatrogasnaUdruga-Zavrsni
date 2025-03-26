import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Container, NavbarBrand } from 'react-bootstrap'
import { Routes, Route } from 'react-router-dom'
import { RouteNames } from './constants'

import VozilaPregled from './pages/Vozila/VozilaPregled'
import VozilaDodaj from './pages/Vozila/VozilaDodaj'
import VozilaUredi from './pages/Vozila/VozilaUredi'

import VrsteVozilaPregled from './pages/VrsteVozila/VrsteVozilaPregled'
import VrsteVozilaDodaj from './pages/VrsteVozila/VrsteVozilaDodaj'
import VrsteVozilaUredi from './pages/VrsteVozila/VrsteVozilaUredi'

import OpremaSpremnikaVozilaPregled from './pages/OpremaSpremnikaVozila/OpremaSpremnikaVozilaPregled'
import OpremaSpremnikaVozilaDodaj from './pages/OpremaSpremnikaVozila/OpremaSpremnikaVozilaDodaj'

import OpremaVatrogasciPregled from './pages/OpremaVatrogasci/OpremaVatrogasciPregled'

import OpremaSkladistaPregled from './pages/OpremaSkladista/OpremaSkladistaPregled'

import OpremaPregled from './pages/Oprema/OpremaPregled'
import OpremaDodaj from './pages/Oprema/OpremaDodaj'
import OpremaUredi from './pages/Oprema/OpremeUredi'

import SkladistePregled from './pages/Skladiste/SkladistePregled'
import SkladisteDodaj from './pages/Skladiste/SkladisteDodaj'
import SkladisteUredi from './pages/Skladiste/SkladisteUredi'

import VatrogasacPregled from './pages/Vatrogasac/VatrogasacPregled'
import VatrogasacDodaj from './pages/Vatrogasac/VatrogasacDodaj'
import VatrogasacUredi from './pages/Vatrogasac/VatrogasacUredi'

import SpremnikPregled from './pages/Spremnik/SpremnikPregled'
import SpremnikDodaj from './pages/Spremnik/SpremnikDodaj'
import SpremnikUredi from './pages/Spremnik/SpremnikUredi'

import SpremnikVozilaPregled from './pages/SpremnikVozila/SpremnikVozilaPregled'
import SpremnikVozilaDodaj from './pages/SpremnikVozila/SpremnikVozilaDodaj'
import SpremnikVozilaUredi from './pages/SpremnikVozila/SpremnikVozilaUredi'

import VrstaOpremePregled from './pages/VrstaOpreme/VrsteOpremePregled'
import VrstaOpremeDodaj from './pages/VrstaOpreme/VrsteOpremeDodaj'
import VrstaOpremeUredi from './pages/VrstaOpreme/VrsteOpremeUredi'




import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "react-datepicker/dist/react-datepicker.css";
import NavBar from './components/NavBar'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorModal from "./components/ErrorModal"

function App() {
  const [count, setCount] = useState(0)

  function godina(){
    const pocenta = 2024;
    const trenutna = new Date().getFullYear();
    if(pocenta===trenutna){
      return trenutna;
    }
    return pocenta + ' - ' + trenutna;
  }

  return (
    <>
      <LoadingSpinner />
      <Container>
        <NavBar/>
        <Routes>
          <Route path={RouteNames.VOZILA} element={<VozilaPregled/>}/>
          <Route path={RouteNames.VOZILA_NOVO} element={<VozilaDodaj/>}/>
          <Route path={RouteNames.VOZILA_UREDI} element={<VozilaUredi/>}/>
                   
          <Route path={RouteNames.VOZILA_SPREMNICI_OPREMA} element={<OpremaSpremnikaVozilaPregled/>}/>

          <Route path={RouteNames.VRSTA_VOZILA} element={<VrsteVozilaPregled/>}/>
          <Route path={RouteNames.VRSTA_VOZILA_NOVO} element={<VrsteVozilaDodaj/>}/>
          <Route path={RouteNames.VRSTA_VOZILA_UREDI} element={<VrsteVozilaUredi/>}/>

          <Route path={RouteNames.VATROGASCI_OPREMA} element={<OpremaVatrogasciPregled/>}/>

          <Route path={RouteNames.SKLADISTA_OPREMA} element={<OpremaSkladistaPregled/>}/>

          <Route path={RouteNames.OPREMA} element={<OpremaPregled/>}/>
          <Route path={RouteNames.OPREMA_NOVO} element={<OpremaDodaj/>}/>
          <Route path={RouteNames.OPREMA_UREDI} element={<OpremaUredi/>}/>

          <Route path={RouteNames.SKLADISTE} element={<SkladistePregled/>}/>
          <Route path={RouteNames.SKLADISTE_NOVO} element={<SkladisteDodaj/>}/>
          <Route path={RouteNames.SKLADISTE_UREDI} element={<SkladisteUredi/>}/>

          <Route path={RouteNames.VATROGASAC} element={<VatrogasacPregled/>}/>
          <Route path={RouteNames.VATROGASAC_NOVO} element={<VatrogasacDodaj/>}/>
          <Route path={RouteNames.VATROGASAC_UREDI} element={<VatrogasacUredi/>}/>
          
          <Route path={RouteNames.SPREMNIK} element={<SpremnikPregled/>}/>
          <Route path={RouteNames.SPREMNIK_NOVO} element={<SpremnikDodaj/>}/>
          <Route path={RouteNames.SPREMNIK_UREDI} element={<SpremnikUredi/>}/>

          <Route path={RouteNames.VOZILA_SPREMNIK} element={<SpremnikVozilaPregled/>}/>
          <Route path={RouteNames.VOZILA_SPREMNIK_NOVO} element={<SpremnikVozilaDodaj/>}/>
          <Route path={RouteNames.VOZILA_SPREMNIK_UREDI} element={<SpremnikVozilaUredi/>}/>
          
          <Route path={RouteNames.VRSTA_OPREME} element={<VrstaOpremePregled/>}/>
          <Route path={RouteNames.VRSTA_OPREME_NOVO} element={<VrstaOpremeDodaj/>}/>
          <Route path={RouteNames.VRSTA_OPREME_UREDI} element={<VrstaOpremeUredi/>}/>

          <Route path={RouteNames.VOZILA_SPREMNICI_OPREMA_NOVO} element={<OpremaSpremnikaVozilaDodaj/>}/>



        
        </Routes>
      </Container>
      <Container>
        <hr />
        David Nađ &copy; {godina()}
      </Container>
    </>
  )
}

export default App
