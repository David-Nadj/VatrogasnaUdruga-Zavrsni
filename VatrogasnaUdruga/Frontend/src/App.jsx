import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Container, NavbarBrand } from 'react-bootstrap'
import { Routes, Route } from 'react-router-dom'
import { RouteNames } from './constants'
import VozilaPregled from './pages/Vozila/VozilaPregled'
import VrsteVozilaPregled from './pages/VrsteVozila/VrsteVozilaPregled'
import VozilaDodaj from './pages/Vozila/VozilaDodaj'
import VozilaUredi from './pages/Vozila/VozilaUredi'

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
            <Route path={RouteNames.VRSTA_VOZILA} element={<VrsteVozilaPregled/>}/>
            <Route path={RouteNames.VOZILA_NOVO} element={<VozilaDodaj/>}/>
            <Route path={RouteNames.VOZILA_UREDI} element={<VozilaUredi/>}/>
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
