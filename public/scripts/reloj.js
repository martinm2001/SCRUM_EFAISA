function reloj() {
    var fecha = new Date(); //Actualizar fecha.
    var hora = fecha.getHours(); //hora actual
    var minuto = fecha.getMinutes(); //minuto actual
    var segundo = fecha.getSeconds(); //segundo actual
    var recargar = setTimeout('reloj()',500);
    
    if (hora < 10) { //dos cifras para la hora
        hora = "0" + hora;
    }
    if (minuto < 10) { //dos cifras para el minuto
        minuto = "0" + minuto;
    }
    if (segundo < 10) { //dos cifras para el segundo
        segundo = "0" + segundo;
    }
    var relojentero = hora + ":" + minuto/* + ":" + segundo*/;
    //ver en el recuadro del reloj:
    document.getElementById('reloj').innerHTML = relojentero;
    
}