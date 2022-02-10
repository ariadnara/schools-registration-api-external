import 'bootstrap/dist/css/bootstrap.min.css';
import './css.css'; 
import React from 'react';
import {GeoAltFill} from 'react-bootstrap-icons';

export function TableSchools({schoolList, showSchoolSelectedInMap}) {
    return (  
        <div className='div-layout-tableschools table-responsive'>             
             <table className='table table-hover'>
             <thead>
                <tr>
                <th>Km</th>
                <th>Name</th>                
                <th>Place</th>
                <th>Number</th>
                <th>Neighborhood </th>                
                <th><GeoAltFill/></th>
                </tr>       
            </thead>
            <tbody>
                {                    
                    schoolList.map(school=>(
                        <tr key={school.id}> 
                        <td>{school.km}</td>                      
                        <td>{school.nome}</td>                        
                        <td>{school.logradouro}</td>
                        <td>{school.numero}</td>
                        <td>{school.bairro}</td>                    
                        <td>
                            <button className='btn btn-outline-success btn-sm' onClick={()=>showSchoolSelectedInMap(school)}><GeoAltFill/></button>{"  "}
                        </td>
                        </tr> 
                    ))  
                }
            </tbody>
            </table>
        </div> 
    );
}
