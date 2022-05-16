const login = (redirect) => {
    let codigo = Number(document.getElementById('contTextArea').value)
                   // POST request using fetch()
    fetch(`${window.location.port}//${window.location.hostname}/api/general/login`, {        
        // Adding method type
        method: "POST",
        
        // Adding body or contents to send
        body: JSON.stringify({
            codigo: codigo,
        }),
        
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
    }
    })
    
    // Converting to JSON
    .then(response => response.json())
    
    // Displaying results to console
    .then((json) =>{
    if (json.status === "OK") {
        //RPI va sin public
        if (redirect === 'config') {
            location.replace(`${window.location.port}//${window.location.host}/configuracionmenu.html`)
        } else if(redirect === 'comando'){
            location.replace(`${window.location.port}//${window.location.host}/eventomenu.html`)
        }            
    }else{
        document.getElementById('contTextArea').value = 'Error'
    }
    }); 
}
