import React, { useState } from "react";
import { Modal, useModalContext } from "../../context/Modal"
// import mapboxgl from 'mapbox-gl';
// import MapBoxWorker from 'mapbox-gl'
import ReactMapGL from 'react-map-gl';

import "./HomePage.css"


const HomePage = () => {

  const {
    authenticated,
    setAuthenticated,
  } = useModalContext();


  const [lat, setLat] = useState()
  const [long, setLong] = useState()

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });



  return (
    <div className="home-container">
      <ReactMapGL
        // onClick={(e) => setLatandLong(e)}
        {...viewport} width="100%" height="100%"
        mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
        onViewportChange={nextViewport => setViewport(nextViewport)}
      />
    </div>
  )
}


export default HomePage;