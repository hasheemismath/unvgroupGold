import React from 'react';
import './App.css'
import Content from "./Content";
import Space from "./Space";
import Converter from "./Converter";
import CryptoConverter from "./CryptoConverter";

function App() {
  return (
    <div className="App">
        <div className="header">
            <h1>UNV GROUP</h1>
            <h4>As Pure As Gold</h4>
            <hr/>
        </div>






        <div className="tableContent">
            <div className="row">
                <div className="col-10 content">
                    <Content/>
                </div>
                <div className="col-2 converter">
                    <Converter/>
                    {/*<CryptoConverter/>*/}
                </div>
            </div>
        </div>





    </div>



  );
}

export default App;
