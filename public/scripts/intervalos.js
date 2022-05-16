let estadoEntradas = [];
let estadoSalidas = [];
let estadoFuente = [];
let estadoDesconexion = [];
let ExtintorVencido = 0;
let infoIN = {};
$.getJSON(`${window.location.port}//${window.location.hostname}/api/inout/infoin`,(data) => {
    infoIN = data
})
setInterval(()=>{        
    $.getJSON(`${window.location.port}//${window.location.hostname}/api/general`,(dataGeneral) => {    
        $.getJSON(`${window.location.port}//${window.location.hostname}/api/serial/entradas`,(dataEntradas) => {    
            $.getJSON(`${window.location.port}//${window.location.hostname}/api/serial/fuente`,(dataFuente) => {
                $.getJSON(`${window.location.port}//${window.location.hostname}/api/inout/desconexion`,(dataDesconexion) => {
                    if (dataEntradas.data != estadoEntradas || dataFuente.data != estadoFuente || dataDesconexion.data != estadoDesconexion){                        
                        estadoEntradas = dataEntradas.data;
                        estadoFuente = dataFuente.data;
                        estadoDesconexion = dataDesconexion;
                        barraEstado(dataGeneral, dataEntradas.data, dataFuente.data, dataDesconexion)
                        //carga inicio
                        for (let i = 0; i < dataEntradas.data.length; i++) {    
                            if (document.getElementById(`in${i + 1}`) == null) {
                                if(dataDesconexion[i] === 1){
                                    crearBarraIN(i + 1, 2, infoIN[i].aliasIN, infoIN[i].descIN, infoIN[i].tipoIN);
                                } else {
                                    crearBarraIN(i + 1,dataEntradas.data[i], infoIN[i].aliasIN, infoIN[i].descIN, infoIN[i].tipoIN);    
                                }                                    
                            } else {
                                if (
                                    (document.getElementById(`in${i + 1}`).getAttribute("class") == "alert alert-warning status" && !(dataEntradas.data[i] == 2)) ||
                                    (document.getElementById(`in${i + 1}`).getAttribute("class") == "alert alert-success status" && !(dataEntradas.data[i] == 1)) ||
                                    (document.getElementById(`in${i + 1}`).getAttribute("class") == "alert alert-danger status" && !(dataEntradas.data[i] == 0))                                    
                                ) {
                                    document.getElementById(`in${i + 1}`).remove();
                                    if(dataDesconexion[i] === 1){
                                        crearBarraIN(i + 1, 2, infoIN[i].aliasIN, infoIN[i].descIN, infoIN[i].tipoIN);
                                    } else {
                                        crearBarraIN(i + 1,dataEntradas.data[i], infoIN[i].aliasIN, infoIN[i].descIN, infoIN[i].tipoIN);
                                    }
                                }
                            }                                                        
                        }
                    }                                        
                    $.getJSON(`${window.location.port}//${window.location.hostname}/api/serial/salidas`,(dataSalida) => {
                        if (dataSalida.data != estadoSalidas) {
                            estadoSalidas = dataSalida.data;
                            for (let i = 0; i < dataSalida.data.length; i++) {
                                crearOUT(i + 1, dataSalida.data[i]);    
                            }            
                        }                            
                    })            
                })
            })
        })
    })
}, 1500)
setInterval(() => {   
let fechaActual = new Date(Date());
$.getJSON(`${window.location.port}//${window.location.hostname}/api/extintores`,(data) => {     
    for (let i = 0; i < data.length; i++) {
        if (!(data[i].ano_fabric === null)) {
            let fechaAno = new Date(`${data[i].ano_fabric.split('/')[1]}/${data[i].ano_fabric.split('/')[0]}/${data[i].ano_fabric.split('/')[2]}`);
            let fechaAno10 = fechaAno.addDays(-10);
            if (fechaActual > fechaAno) {
                agregaBarraExt(data[i].id, data[i].id_sector, data[i].alias, 'ano');
                ExtintorVencido = 1;
            } else if (fechaActual > fechaAno10) {
                agregaBarraExt(data[i].id, data[i].id_sector, data[i].alias, 'ano10');
                ExtintorVencido = 1;
            }
        }
        if (!(data[i].fecha_carga === null)) {
            let fechaCarga = new Date(`${data[i].fecha_carga.split('/')[1]}/${data[i].fecha_carga.split('/')[0]}/${data[i].fecha_carga.split('/')[2]}`);
            let fechaCarga10 = fechaCarga.addDays(-10);
            if (fechaActual > fechaCarga) {
                agregaBarraExt(data[i].id, data[i].id_sector, data[i].alias, 'carga');
                ExtintorVencido = 1;
            } else if (fechaActual > fechaCarga10) {
                agregaBarraExt(data[i].id, data[i].id_sector, data[i].alias, 'carga10');
                ExtintorVencido = 1;
            }
        }   
        if (!(data[i].fecha_ph === null)) {                    
            let fechaph = new Date(`${data[i].fecha_ph.split('/')[1]}/${data[i].fecha_ph.split('/')[0]}/${data[i].fecha_ph.split('/')[2]}`);
            let fechaph10 = fechaph.addDays(-10);
            if (fechaActual > fechaph) {
                console.log("extintorPH",data[i].id,fechaph);
                agregaBarraExt(data[i].id, data[i].id_sector, data[i].alias, 'ph');
                ExtintorVencido = 1;
            } else if (fechaActual > fechaph10) {
                agregaBarraExt(data[i].id, data[i].id_sector, data[i].alias, 'ph10');
                ExtintorVencido = 1;
            }
        }       
    }
})       
$.getJSON(`${window.location.port}//${window.location.hostname}/api/mangueras`,(data) => {     
    for (let i = 0; i < data.length; i++) {
        if (!(data[i].fecha_instalacion === null)) {     
            let fechaInstalacion = new Date(`${data[i].fecha_instalacion.split('/')[1]}/${data[i].fecha_instalacion.split('/')[0]}/${data[i].fecha_instalacion.split('/')[2]}`);
            let fechaInstalacion10 = fechaInstalacion.addDays(-10);
            if (fechaActual > fechaInstalacion) {
                agregaBarraMan(data[i].id, data[i].id_sector, data[i].alias, 'ins');
                ExtintorVencido = 1;
            } else if (fechaActual > fechaInstalacion10) {
                agregaBarraMan(data[i].id, data[i].id_sector, data[i].alias, 'ins10');
                ExtintorVencido = 1;
            }
        }
        let fechaph = new Date(data[i].fecha_ph);
        let fechaph10 = fechaph.addDays(-10);
        if (fechaActual > fechaph) {
            agregaBarraMan(data[i].id, data[i].id_sector, data[i].alias, 'ph');
            ExtintorVencido = 1;
        } else if (fechaActual > fechaph10) {
            agregaBarraMan(data[i].id, data[i].id_sector, data[i].alias, 'ph10');
            ExtintorVencido = 1;
        }
    }
})
if (ExtintorVencido === 1) {
    if (document.getElementById("barraExtintor") === null) {
      let imgExtintor = document.createElement('img')
      imgExtintor.setAttribute('id','barraExtintor')
      imgExtintor.setAttribute('src','img/extintor.png')
      imgExtintor.setAttribute('title','Extintor')
      imgExtintor.setAttribute('class','img-fluid tamano36')
      document.getElementById("contendorBarraExtintor").appendChild(imgExtintor)  
    }      
} else {
if (document.getElementById("barraExtintor") != null) {
    document.getElementById("barraExtintor").remove()
}        
}
}, 5000); 