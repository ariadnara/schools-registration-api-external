import React, { useState, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import { APIKEYMAPS } from "./ApiKeyMaps";

export function SimpleMap({ locationSearch, locationSelected }) {
  const googleMapReactRef = useRef(null);
  const [googleMap, setGoogleMap] = useState(null);

  const [props, setProps] = useState({
    center: {
      lat: locationSearch.lat,
      lng: locationSearch.lng
    },
    zoom: 11
  });
 /* handleGoogleMapApi
  * @description Get object GoogleMap.
  */ 
  const handleGoogleMapApi = (map) => {
    setGoogleMap(map);
  }
  /* paintRoute
  * @description Paint path between two addresses. 
  */ 
  const paintRoute = (addressSelected) => {
    let configRute = {
      origin: locationSearch.nome,
      destination: addressSelected,
      travelMode: googleMap.maps.TravelMode.WALKING,
      provideRouteAlternatives: true
    }
    const directionsDisplay = new googleMap.maps.DirectionsRenderer();
    const new_map = new googleMap.maps.Map(document.getElementById("map"), props);  
    directionsDisplay.setMap(new_map);
    const serviceDisplay = new googleMap.maps.DirectionsService();
    serviceDisplay.route(configRute, (resultados, status) => {
      if (status == 'OK') {
        directionsDisplay.setDirections(resultados);
      } else alert('Error: ' + status);
    });
  }
 /* paintAll
  * @description Paint route.
  */ 
  const paintAll=() => {
    const new_map = new googleMap.maps.Map(document.getElementById("map"), props);

    locationSelected.map(location => {
      const position = new googleMap.maps.LatLng(location.latitude, location.longitude);
      const marker = new googleMap.maps.Marker({
        map: new_map,
        position: position,
        animation: googleMap.maps.Animation.DROP,
        title: ` ${location.nome}`
      });
      const km = (location.km) ? `<p style="margin: 0.5px 0"'><b>KM:</b> ${location.km}</p>` : '';
      const nome = (location.nome) ? `<p style="margin: 0.5px 0"><b>Name: ${location.nome}</b></p>` : '';
      const address = (location.logradouro) ? `<p style="margin: 0.5px 0"><b>Address:</b> ${location.logradouro} ${location.numero}, ${location.bairro}</p>` : '';
      const telefone = (location.telefone) ? `<p style="margin: 0.5px 0"><b>Phone:</b> ${location.telefone}</p>` : '';
      const email = (location.email) ? `<p style="margin: 0.5px 0"><b>Email:</b> ${location.email}</p>` : '';
      const url_website = (location.url_website) ? `<p style="margin: 0.5px 0"><b>Website</b>: <a href="${location.url_website}"> ${location.url_website}</a> "  ${location.url_website}</p>` : '';
      let contentString = `${km} ${nome} ${address} ${telefone} ${email} ${url_website}`;

      const infowindow = new googleMap.maps.InfoWindow();
      marker.addListener("click", () => {
        infowindow.close();
        infowindow.setContent(contentString);
        infowindow.open(marker.getMap(), marker);
      });
    });
  }
 /* reloadMap
  * @description Load the map according to the selected option.
  */ 
  const reloadMap = () => {
    if (googleMap && googleMap.maps) {
      let addressSelected = locationSearch.nome;
      if (locationSelected.length == 1) {
        addressSelected = `${locationSelected[0].bairro}, ${locationSelected[0].logradouro} ${locationSelected[0].numero}`;
        paintRoute(addressSelected);
      } else {
        paintAll(locationSelected);
      }
    }
  }
  reloadMap();

  return (
    <GoogleMapReact ref={googleMapReactRef}
      bootstrapURLKeys={{key: APIKEYMAPS}}
      defaultCenter={props.center}
      defaultZoom={props.zoom}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={handleGoogleMapApi}
    >
    </GoogleMapReact>
  );
}
