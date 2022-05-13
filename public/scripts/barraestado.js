/*  Programación de la barra de estado superior */
//Envía a la página los íconos superiores (alarma, batería, conexión, etc.)


//Funcion unica para barra de estado
function Barra_estado(img,tipo,donde,titulo,clase,documento,funcion) {
  let desconexion = document.createElement(img);
  desconexion.setAttribute("id", tipo);
  desconexion.setAttribute("src", donde);
  desconexion.setAttribute("title", titulo);
  desconexion.setAttribute("class", clase);
  document.getElementById(documento).appendChild(funcion);
}

function alarmaGeneral([...valores]) {
  let activo = 0;
  for (let i = 0; i < valores.length; i++) {
    if (valores[i] === 0) {
      activo = 1;
    }
  }
  let estadoActual = document.getElementById("alarmaGeneral");
  if (
    (estadoActual != null && activo === 0) ||
    (estadoActual === null && activo === 1)
  ) {
    if (!(document.getElementById("alarmaGeneral") === null)) {
      document.getElementById("alarmaGeneral").remove();
    }
    if (activo === 1) {
      //alarma activa
      Barra_estado("img","alarmaGeneral","img/campana_roja.png","Alarma General,gfd Activa","img-fluid tamano36","contenedorAlarmaGeneral",alarmaGeneral);
    }
  }
}

function desconexion([...valores]) {
  let activo = 0;
  for (let i = 0; i < valores.length; i++) {
    if (valores[i] === 1) {
      activo = 1;
    }
  }
  if (document.getElementById("desconexion") === null && activo === 1) {
   //icono de desconexion
    Barra_estado("img","desconexion","img/desconexion.png","Desconexion, Activgfdgfda","img-fluid tamano36","contendorDesconexion",desconexion);
  } else if (
    activo === 0 &&
    !(document.getElementById("desconexion") == null)
  ) {
    document.getElementById("desconexion").remove();
  }
}




function derivTierra(estado) {
  let estadoActual = document.getElementById("contendorDerivTierra");
  if (
    (estadoActual != null && estado === 0) ||
    (estadoActual === null && estado === 1)
  ) {
    if (!(document.getElementById("derivTierra") === null)) {
      document.getElementById("derivTierra").remove();
    }
    if (estado === 1) {
      Barra_estado("img","derivTierra","img/deriv_tierra.png","Derivacion Tierra, Activa","img-fluid tamano36","contendorDerivTierra",derivTierra);

    }
  }
}




function reloj() {
  let fecha = new Date(); //Actualizar fecha.
  let hora = fecha.getHours(); //hora actual
  let minuto = fecha.getMinutes(); //minuto actual
  let segundo = fecha.getSeconds(); //segundo actual
  let recargar = setTimeout(reloj, 500);

  if (hora < 10) {
    //dos cifras para la hora
    hora = "0" + hora;
  }
  if (minuto < 10) {
    //dos cifras para el minuto
    minuto = "0" + minuto;
  }
  if (segundo < 10) {
    //dos cifras para el segundo
    segundo = "0" + segundo;
  }
  let relojentero = hora + ":" + minuto; /* + ":" + segundo*/
  //ver en el recuadro del reloj:
  document.getElementById("reloj").innerHTML = relojentero;
}
function candado(nivAcc) {
  let candado = document.getElementById("candado");
  if (
    !(
      (candado.getAttribute("title") === "Nivel acceso, 0" && nivAcc === 0) ||
      (candado.getAttribute("title") === "Nivel acceso, 1" && nivAcc === 1) ||
      (candado.getAttribute("title") === "Nivel acceso, 2" && nivAcc === 2)
    )
  ) {
    if (nivAcc === 0) {
      candado.setAttribute("src", `img/candado_amarillo.png`);
      candado.setAttribute("title", `Nivel acceso, ${nivAcc}`);
    } else {
      candado.setAttribute("src", `img/candado_abierto_verde_${nivAcc}.png`);
      candado.setAttribute("title", `Nivel acceso, ${nivAcc}`);
    }
  }
}

function crearAlimentacion(estado) {
  let alimentacion = document.createElement("img");
  alimentacion.setAttribute("id", "alimentacion");

  if (estado === 1) {
    alimentacion.setAttribute("src", "img/220_ok.png");
    alimentacion.setAttribute("title", "Alimentacion, OK");
  } else {
    alimentacion.setAttribute("src", "img/220_falla.png");
    alimentacion.setAttribute("title", "Alimentacion, Falla");
  }
  alimentacion.setAttribute("class", "img-fluid float-right tamano36");
  document.getElementById("contenedorAlimentacion").appendChild(alimentacion);
}

function alimentacion(estado) {
  if (document.getElementById("alimentacion") == null) {
    crearAlimentacion(estado);
  } else {
    let estadoActual = document
      .getElementById("alimentacion")
      .getAttribute("title");
    if (
      (estadoActual === "Alimentacion, OK" && estado === 0) ||
      (estadoActual === "Alimentacion, Falla" && estado === 1)
    ) {
      document.getElementById("alimentacion").remove();
      crearAlimentacion(estado);
    }
  }
}

function crearBateria(estado) {
  let bateria = document.createElement("img");
  bateria.setAttribute("id", "bateria");
  if (estado === 4) {
    bateria.setAttribute("src", "img/bateria_100.png");
    bateria.setAttribute("title", "Bateria, 100%");
  } else if (estado === 3) {
    bateria.setAttribute("src", "img/bateria_75.png");
    bateria.setAttribute("title", "Bateria, 75%");
  } else if (estado === 2) {
    bateria.setAttribute("src", "img/bateria_50.png");
    bateria.setAttribute("title", "Bateria, 50%");
  } else if (estado === 1) {
    bateria.setAttribute("src", "img/bateria_25.png");
    bateria.setAttribute("title", "Bateria, 25%");
  } else {
    bateria.setAttribute("src", "img/bateria_falla.png");
    bateria.setAttribute("title", "Bateria, Falla");
  }
  bateria.setAttribute("class", "img-fluid float-right tamano36");
  document.getElementById("contenedorBateria").appendChild(bateria);
}

function bateria(estado) {
  if (document.getElementById("bateria") == null) {
    crearBateria(estado);
  } else {
    let estadoActual = document.getElementById("bateria").getAttribute("title");
    if (
      (estadoActual === "Bateria, Falla" && !(estado === 0)) ||
      (estadoActual === "Bateria, 25%" && !(estado === 1)) ||
      (estadoActual === "Bateria, 50%" && !(estado === 2)) ||
      (estadoActual === "Bateria, 75%" && !(estado === 3)) ||
      (estadoActual === "Bateria, 100%" && !(estado === 4))
    ) {
      document.getElementById("bateria").remove();
      crearBateria(estado);
    }
  }
}

function barraEstado(dataGeneral, entradas, dataFuente, dataDesconexion) {
  alarmaGeneral(entradas);
  desconexion(dataDesconexion);
  derivTierra(dataFuente[2]);
  document.getElementById("nomOrgBarra").innerText === ""
    ? (document.getElementById("nomOrgBarra").innerText = dataGeneral.NombreOrg)
    : null;
  reloj();
  candado(dataGeneral.nivAcc);
  alimentacion(dataFuente[0]);
  bateria(dataFuente[1]);
}
