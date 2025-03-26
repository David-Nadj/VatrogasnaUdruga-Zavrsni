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
import OpremaSpremniciVozilaPregled from './pages/OpremaSpremniciVozila/OpremaSpremniciVozilaPregled'
import OpremaVatrogasciPregled from './pages/OpremaVatrogasci/OpremaVatrogasciPregled'
import OpremaSkladistaPregled from './pages/OpremaSkladista/OpremaSkladistaPregled'
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
          <Route path={RouteNames.VOZILA_SPREMNICI_OPREMA} element={<OpremaSpremniciVozilaPregled/>}/>

          <Route path={RouteNames.VRSTA_VOZILA} element={<VrsteVozilaPregled/>}/>
          <Route path={RouteNames.VRSTA_VOZILA_NOVO} element={<VrsteVozilaDodaj/>}/>
          <Route path={RouteNames.VRSTA_VOZILA_UREDI} element={<VrsteVozilaUredi/>}/>


          <Route path={RouteNames.VATROGASCI_OPREMA} element={<OpremaVatrogasciPregled/>}/>


          <Route path={RouteNames.SKLADISTA_OPREMA} element={<OpremaSkladistaPregled/>}/>
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
