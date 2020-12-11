import React, { Component, useState } from 'react';
import './App.css';


const App = () => {
    const [url, setUrl] = useState("");
    const [selector, setSelector] = useState("");
    const [result, setResult] = useState("");

    const getData = async (e) => {
          const response = await fetch("https://justscrapeit.netlify.app/.netlify/functions/chrome", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              url : url,
              selector: selector
            })
          });
          setResult(response.json())
        }
    
    return (
      <div className="app">
        <label>
        Url
        <input onChange={e => {setUrl(e.target.value)}} value={url} />
        </label>
        <label>
        Selector
        <input onChange={e => {
          setSelector(e.target.value)
          }} value={selector} />
        </label>
        <button onClick={getData}>Get Data</button>
        <button onClick={e => {setResult("")}}>Clear</button>
        
        <tt className="result">
        {result}
        </tt>
      </div>
    );
};

export default App;
