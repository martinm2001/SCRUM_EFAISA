let valorNormal = 1;
let valorAlarma = 0;
let valorDesconexion = 2;
let tipouso = [];
let estadosDispositivos = 'NORMAL';


const aceptacion = () => {
    let url = `${window.location.port}//${window.location.hostname}/api/serial/ack`;
    let valores = {};

    fetch(url, {
        // Adding method type
        method: "put",

        // Adding body or contents to send
        body: JSON.stringify(valores),

        // Adding headers to the request
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        },
    })    
}
function agregaBarraExt(id, nroin, aliasin, tipofalla) {
    if (!(document.getElementById(`ext${tipofalla}${id}`) === null)) {
        document.getElementById(`ext${tipofalla}${id}`).remove()
    }
    var barraExtintor = document.createElement('div');
    barraExtintor.setAttribute('id', `ext${tipofalla}${id}`);
    barraExtintor.setAttribute('class', 'alert alert-danger');
    var imagenBarraExtintor = document.createElement('img');
    imagenBarraExtintor.setAttribute('class', 'img-fluid float-start tamano36');
    imagenBarraExtintor.setAttribute('src', 'img/extintor.png');
    barraExtintor.appendChild(imagenBarraExtintor);
    var textoBarraExtintor = document.createElement('div');
    if (tipofalla == 'ano') {
        textoBarraExtintor.innerHTML = '<strong>Extintor ID' + id + ' ' + nroin + ' ' + aliasin + '</strong> Año fabricacion caducado';
    }
    if (tipofalla == 'ano10') {
        textoBarraExtintor.innerHTML = '<strong>Extintor ID' + id + ' ' + nroin + ' ' + aliasin + '</strong> Año fabricacion caduca pronto';
    }
    if (tipofalla == 'carga') {
        textoBarraExtintor.innerHTML = '<strong>Extintor ID' + id + ' ' + nroin + ' ' + aliasin + '</strong> Carga caducado';
    }
    if (tipofalla == 'carga10') {
        textoBarraExtintor.innerHTML = '<strong>Extintor ID' + id + ' ' + nroin + ' ' + aliasin + '</strong> Carga caduca pronto';
    }
    if (tipofalla == 'ph') {
        textoBarraExtintor.innerHTML = '<strong>Extintor ID' + id + ' ' + nroin + ' ' + aliasin + '</strong> Prueba Hidraulica caducado';
    }
    if (tipofalla == 'ph10') {                
        textoBarraExtintor.innerHTML = '<strong>Extintor ID' + id + ' ' + nroin + ' ' + aliasin + '</strong> Prueba Hidraulica caduca pronto';
    }
    barraExtintor.appendChild(textoBarraExtintor);
    document.getElementById('barraExtintores').appendChild(barraExtintor);
}

function agregaBarraMan(id, nroin, aliasin, tipofalla) {

    var barraManguera = document.createElement('div');
    barraManguera.setAttribute('class', 'alert alert-danger');
    var imagenBarraManguera = document.createElement('img');
    imagenBarraManguera.setAttribute('class', 'img-fluid float-start tamano36');
    imagenBarraManguera.setAttribute('src', 'img/manguera.png');
    barraManguera.appendChild(imagenBarraManguera);
    var textoBarraManguera = document.createElement('div');
    if (tipofalla == 'ins') {
        textoBarraManguera.innerHTML = '<strong>Manguera ID' + id + ' ' + nroin + ' ' + aliasin + '</strong> Instalacion caducado';
    }
    if (tipofalla == 'ins10') {
        textoBarraManguera.innerHTML = '<strong>Manguera ID' + id + ' ' + nroin + ' ' + aliasin + '</strong> Instalacion caduca pronto';
    }
    if (tipofalla == 'ph') {
        textoBarraManguera.innerHTML = '<strong>Manguera ID' + id + ' ' + nroin + ' ' + aliasin + '</strong> Prueba Hidraulica caducado';
    }
    if (tipofalla == 'ph10') {
        textoBarraManguera.innerHTML = '<strong>Manguera ID' + id + ' ' + nroin + ' ' + aliasin + '</strong> Prueba Hidraulica caduca pronto';
    }
    barraManguera.appendChild(textoBarraManguera);

    document.getElementById('barraMangueras').appendChild(barraManguera);
}
function crearDispositivo(nrodisp, nombre, estado, tipoDispositivo) {
    if (document.getElementById('dispositivo' + nrodisp) != null) {
        document.getElementById('dispositivo' + nrodisp).remove();
    }
    //dispositivos
    let dispositivo = document.createElement('div');
    dispositivo.setAttribute('id', 'dispositivo' + nrodisp);
    if (estado == "ALARMA") {
        dispositivo.setAttribute('class', 'alert alert-danger status');
    }
    if (estado == "NORMAL") {
        dispositivo.setAttribute('class', 'alert alert-success status');
    }
    if (estado == "SINCOMUNICACION") {
        dispositivo.setAttribute('class', 'alert alert-warning status');
    }

    //imagen dispositivo
    let centradoBarraDispositivo = document.createElement('center');
    centradoBarraDispositivo.setAttribute('class', 'float-start');
    centradoBarraDispositivo.setAttribute('style', 'width: 10rem;height: auto;display: inline-block;');
    dispositivo.appendChild(centradoBarraDispositivo);

    let imagenbarraDispositivo = document.createElement('img');
    imagenbarraDispositivo.setAttribute('class', 'tamano36');
    if (estado == "SINCOMUNICACION") {
        imagenbarraDispositivo.setAttribute('src', 'img/desconexion.png');
    } else {

        if (estado == "ALARMA") {
            imagenbarraDispositivo.setAttribute('src', 'img/sensores_rojo.png');
        }
        if (estado == "NORMAL") {
            imagenbarraDispositivo.setAttribute('src', 'img/sensores_gris.png');
        }
    }
    centradoBarraDispositivo.appendChild(imagenbarraDispositivo);

    //texto estado barra
    let textoBarraDispositivo = document.createElement('a');
    textoBarraDispositivo.setAttribute('class', 'hreflinea');
    var textoStrongBarra = document.createElement('strong');
    if (estado == "SINCOMUNICACION") {
        textoStrongBarra.innerText = tipoDispositivo + ' ' + nrodisp + ' Sin Comunicacion';
    }
    if (estado == "ALARMA") {
        textoStrongBarra.innerText = tipoDispositivo + ' ' + nrodisp + ' Alarma';
    }
    if (estado == "NORMAL") {
        textoStrongBarra.innerText = tipoDispositivo + ' ' + nrodisp + ' Normal';
    }
    textoBarraDispositivo.appendChild(textoStrongBarra);

    var textobarraDispositivo = document.createElement('div');
    textobarraDispositivo.setAttribute('class', 'nombrelineas');
    textobarraDispositivo.innerHTML = '<strong>' + nombre + '</strong> ';
    textoBarraDispositivo.appendChild(textobarraDispositivo);
    dispositivo.appendChild(textoBarraDispositivo);
    if (estado == "SINCOMUNICACION") {
        document.getElementById('dispositivoFalla').appendChild(dispositivo);
    }
    if (estado == "ALARMA") {
        document.getElementById('dispositivoAlarma').appendChild(dispositivo);
    }
    if (estado == "NORMAL") {
        document.getElementById('dispositivoNormal').appendChild(dispositivo);
    }
}

Date.prototype.addDays = function(days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

function ActilizarFondo(in1, in2, in3, in4, in5, in6, in7, in8, in9, in10, in11, in12) {
    if ((in1 == valorNormal) && (in2 == valorNormal) && (in3 == valorNormal) && (in4 == valorNormal) && (in5 == valorNormal) && (in6 == valorNormal) && (in7 == valorNormal) && (in8 == valorNormal) && (in9 == valorNormal) && (in10 == valorNormal) && (in11 == valorNormal) && (in12 == valorNormal)) {
        document.getElementById('tituloAlertas').style.display = 'none';
    }
    if ((in1 == valorAlarma) || (in2 == valorAlarma) || (in3 == valorAlarma) || (in4 == valorAlarma) || (in5 == valorAlarma) || (in6 == valorAlarma) || (in7 == valorAlarma) || (in8 == valorAlarma) || (in9 == valorAlarma) || (in10 == valorAlarma) || (in11 == valorAlarma) || (in12 == valorAlarma) || (estadosDispositivos == 'ALARMA')) {
        document.getElementById('tituloAlertas').style.display = 'block';
    }
}
window.addEventListener('load', () => {
    document.getElementById("contprinc").style.backgroundColor = "dimgray";
    setInterval(() => {
        $.getJSON(
            `${window.location.port}//${window.location.hostname}/api/dispositivo/estado`,
            (data) => {
                if (data.length != 0) {
                    for (let i = 0; i < data.length; i++) {
                        if (document.getElementById(`dispositivo${data[i].Nro}`) == null) {
                            crearDispositivo(data[i].Nro, data[i].Nombre, data[i].Estado, data[i].Tipo)
                        } else {
                            if (
                                !(
                                    ((document.getElementById(`dispositivo${data[i].Nro}`).getAttribute('class') == 'alert alert-warning status') && (data[i].Estado == 'SINCOMUNICACION')) ||
                                    ((document.getElementById(`dispositivo${data[i].Nro}`).getAttribute('class') == 'alert alert-success status') && (data[i].Estado == 'NORMAL')) ||
                                    ((document.getElementById(`dispositivo${data[i].Nro}`).getAttribute('class') == 'alert alert-danger status') && (data[i].Estado == 'ALARMA'))
                                )
                            ) {
                                crearDispositivo(data[i].Nro, data[i].Nombre, data[i].Estado, data[i].Tipo)
                            }
                            if (data[i].Estado == 'ALARMA') {
                                estadosDispositivos = 'ALARMA'
                                ActilizarFondo(localStorage.getItem('IN1'), localStorage.getItem('IN2'), localStorage.getItem('IN3'), localStorage.getItem('IN4'), localStorage.getItem('IN5'), localStorage.getItem('IN6'), localStorage.getItem('IN7'), localStorage.getItem('IN8'), localStorage.getItem('IN9'), localStorage.getItem('IN10'), localStorage.getItem('IN11'), localStorage.getItem('IN12'))
                            }
                        }
                    }
                }
            }
        );
    }, 1000)                                    
});