
 /* @author ARA
  * @date 02/2022
  * @description Address query tool. All the labels are in English, 
  * taking into account that it is the main language of the company,
  * but considering the place where the tool would be used, it should be translated into Portuguese. 
  */ 
import 'bootstrap/dist/css/bootstrap.min.css';
import './css.css'; 
import { Search, ArrowRepeat, GeoAltFill } from 'react-bootstrap-icons';
import React, { useState,useEffect, useRef, Fragment } from 'react';
import Geocode from "react-geocode";
import {TableSchools} from './TableSchools';
import { SimpleMap } from "./SimpleMap";
import { APIKEYMAPS } from "./ApiKeyMaps";
import axios from 'axios';

export function SearchSchools() { 

  const baseUrl = 'https://dadosabertos.poa.br/api/3/action/datastore_search?resource_id=5579bc8e-1e47-47ef-a06e-9f08da28dec8&limit=50'; 
  const schoolNull = {
        id:'',
        dep_administrativa: '',
        tipo: '',
        nome: '',
        logradouro: '',
        numero: '',
        bairro: '',
        telefone: '',
        email: '',
        url_website: '',
        latitude: '',
        longitude: ''
  }
  const locationSearchIni = {lat: -30.032778, lng: -51.23, nome:'Porto Alegre', origin: true};  
  const [locationSearch, setLocationSearch] = useState(locationSearchIni);
  const [schoolList, setSchoolList] = useState([schoolNull]);
  const fielSearch = useRef(null);    
  const [locationSelected, setLocationSelected] = useState([]);
 
 /* getAllSchool
  * @description Get petition
  */ 
  const getAllSchool=async()=>{
      await axios.get(baseUrl)
      .then(response=>{ console.log(response.data.result.records);          
          setSchoolList(response.data.result.records);                               
        }).catch(error=>{
          console.log(error);
            return {};
        })
    } 
 /* seachNext
  * @description Search address and sort by proximity (km)
  */     
    const seachNext = ()=>{       
        Geocode.setApiKey(APIKEYMAPS);       
        let fielSearchRef = fielSearch.current; 
        let search_address = fielSearchRef.value; 
        let isNotLength = (typeof search_address == 'string') ? search_address.length : 0;     
     
        if( isNotLength > 0 && search_address !== "" && search_address != null && search_address !== undefined){           
          Geocode.fromAddress(search_address).then(
            (response) => {                
              let location = response.results[0].geometry.location;             
              getSortSchoolList(location);
              location.nome = search_address;
              location.origin = true; 
              setLocationSearch(location);                
            },
            (error) => {
              alert('You must specify a correct address. First specify the city, then the street, number and location.');
              console.log(error);
            }
          );
        } 
      }
 /* getKm
  * @description Returns distance in km between two points 
  */ 
    const getKm = function(lat1,lon1,lat2,lon2)  {
          let rad =(x)=> x*Math.PI/180;
          const radio_earth  = 6378.137; //Radius of the earth in km 
          const dLat = rad( lat2 - lat1 );
          const dLong = rad( lon2 - lon1 );
          let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
          let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          let d = radio_earth * c;
        return d.toFixed(12); 
      }
 /* getSortSchoolList
  * @description Sort by proximity (km).
  * A version for larger data environments is to develop this method and its dependencies on the server side. 
  */ 
    const getSortSchoolList = function( { lat, lng }){  
        const arrSchool = [...schoolList];        
        arrSchool.sort(function (a, b) { 
               const kmA = parseFloat(getKm(lat, lng, a.latitude, a.longitude));
               const kmB = parseFloat(getKm(lat, lng, b.latitude, b.longitude));
               a.km = kmA.toFixed(3);
               b.km = kmB.toFixed(3);
              if (kmA > kmB) { return 1;  }
              if (kmA < kmB) { return -1; }
              return 0;
            });         
        setSchoolList(arrSchool); 
      }
 /* cleanSeach
  * @description Clean the map and search input.
  */
    const cleanSeach = ()=> {
          fielSearch.current.value = '';
          setLocationSelected([]);
          setLocationSearch(locationSearchIni);
        } 
 /* showSchoolSelectedInMap
  * @description OnClick of  button to see the school route in the map.
  */  
    const showSchoolSelectedInMap = (school)=>setLocationSelected([school]);
 /* seeAll
  * @description OnClick of button "see all schools in map".
  */
    const seeAll=()=>setLocationSelected(schoolList);
  /* hook
  * @description useEffect.
  */    
    useEffect(()=>{
        getAllSchool();
      },[]);
    
    return ( <Fragment>
                <div className='div-main'>                  
                  <div >
                    <input type='text' ref={fielSearch} className='input-search' placeholder='Enter an address. (City, Address)'/>{"   "}                   
                    <button className='btn btn-outline-primary btn-sm' onClick={()=>seachNext(schoolList)}><Search/> Search</button> {"   "}
                    <button className='btn btn-outline-primary btn-sm' onClick={()=>cleanSeach()}><ArrowRepeat/> Clean</button> {"   "}
                    <button className='btn btn-outline-success btn-sm' onClick={()=>seeAll()}><GeoAltFill/> See all in map</button>
                  </div>  
                  <TableSchools schoolList ={schoolList} showSchoolSelectedInMap={showSchoolSelectedInMap}/>
                </div>
                 <div id='map' className='div-map'>
                    <SimpleMap 
                      locationSearch={locationSearch} 
                      locationSelected={locationSelected} />
                 </div>
              </Fragment>
    );
}
