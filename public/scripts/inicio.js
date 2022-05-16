function crearBarraIN(nroin, estadoIN, aliasIN, subaliasIN, tipouso) {
  let barraIN = document.createElement("div");
  barraIN.setAttribute("id", "in" + nroin);
  if (estadoIN == 0) {
    barraIN.setAttribute("class", "alert alert-danger status");
  }
  if (estadoIN == 1) {
    barraIN.setAttribute("class", "alert alert-success status");
  }
  if (estadoIN == 2) {
    barraIN.setAttribute("class", "alert alert-warning status");
  }
  //parte plano
  let hrefplano = document.createElement("a");
  hrefplano.setAttribute("href", "infoINplano.php?nroin=" + nroin);
  hrefplano.setAttribute("class", "float-end");
  let imghrefplano = document.createElement("img");
  imghrefplano.setAttribute("src", "img/plano_blanco.png");
  imghrefplano.setAttribute("title", "Plano");
  imghrefplano.setAttribute("class", "iconoAdicional");
  hrefplano.appendChild(imghrefplano);
  barraIN.appendChild(hrefplano);
  //parte imagen
  let hrefimagen = document.createElement("a");
  hrefimagen.setAttribute("href", "infoINimagen.php?nroin=" + nroin);
  hrefimagen.setAttribute("class", "float-end");
  let imghrefimagen = document.createElement("img");
  imghrefimagen.setAttribute("src", "img/Imagen.png");
  imghrefimagen.setAttribute("title", "Imagen");
  imghrefimagen.setAttribute("class", "iconoAdicional");
  hrefimagen.appendChild(imghrefimagen);
  barraIN.appendChild(hrefimagen);
  //parte camara
  let hrefcamara = document.createElement("a");
  hrefcamara.setAttribute("href", "infoINcamara.html?nroin=" + nroin);
  hrefcamara.setAttribute("class", "float-end");
  let imghrefcamara = document.createElement("img");
  imghrefcamara.setAttribute("src", "img/camara_azul.png");
  imghrefcamara.setAttribute("title", "Camara");
  imghrefcamara.setAttribute("class", "iconoAdicional");
  hrefcamara.appendChild(imghrefcamara);
  barraIN.appendChild(hrefcamara);
  //imagen estado barra
  let centradoBarraIN = document.createElement("center");
  centradoBarraIN.setAttribute("class", "float-start");
  centradoBarraIN.setAttribute(
    "style",
    "width: 10rem;height: auto;display: inline-block;"
  );
  barraIN.appendChild(centradoBarraIN);
  let imagenbarraIN = document.createElement("img");
  imagenbarraIN.setAttribute("class", "tamano36");
  if (estadoIN == 2) {
    imagenbarraIN.setAttribute("src", "img/desconexion.png");
  } else {
    if (estadoIN == 0) {
      if (tipouso == "Bomba Jockey") {
        imagenbarraIN.setAttribute("src", "img/bomba_jockey_roja.png");
      }
      if (tipouso == "Electrobomba") {
        imagenbarraIN.setAttribute("src", "img/electrobomba_roja.png");
      }
      if (tipouso == "Evacuacion") {
        imagenbarraIN.setAttribute("src", "img/evacuacion.png");
      }
      if (tipouso == "Incendio") {
        imagenbarraIN.setAttribute("src", "img/deteccionRoja.png");
      }
      if (tipouso == "Robo") {
        imagenbarraIN.setAttribute("src", "img/robo_rojo.png");
      }
      if (tipouso == "Medico") {
        imagenbarraIN.setAttribute("src", "img/medico.png");
      }
      if (tipouso == "Motobomba") {
        imagenbarraIN.setAttribute("src", "img/motobomba_roja.png");
      }
      if (tipouso == "Panico") {
        imagenbarraIN.setAttribute("src", "img/panico.png");
      }
      if (tipouso == "Sensores") {
        imagenbarraIN.setAttribute("src", "img/sensores_rojo.png");
      }
      if (tipouso == "Tercer Tiempo") {
        imagenbarraIN.setAttribute("src", "img/tercer_tiempo_rojo.png");
      }
    }
    if (estadoIN == 1) {
      if (tipouso == "Bomba Jockey") {
        imagenbarraIN.setAttribute("src", "img/bomba_jockey_gris.png");
      }
      if (tipouso == "Electrobomba") {
        imagenbarraIN.setAttribute("src", "img/electrobomba_gris.png");
      }
      if (tipouso == "Evacuacion") {
        imagenbarraIN.setAttribute("src", "img/evac_gris.png");
      }
      if (tipouso == "Incendio") {
        imagenbarraIN.setAttribute("src", "img/deteccionGris.png");
      }
      if (tipouso == "Robo") {
        imagenbarraIN.setAttribute("src", "img/robo_gris.png");
      }
      if (tipouso == "Medico") {
        imagenbarraIN.setAttribute("src", "img/medico.png");
      }
      if (tipouso == "Motobomba") {
        imagenbarraIN.setAttribute("src", "img/motobomba_gris.png");
      }
      if (tipouso == "Panico") {
        imagenbarraIN.setAttribute("src", "img/panico.png");
      }
      if (tipouso == "Sensores") {
        imagenbarraIN.setAttribute("src", "img/sensores_gris.png");
      }
      if (tipouso == "Tercer Tiempo") {
        imagenbarraIN.setAttribute("src", "img/tercer_tiempo.png");
      }
    }
  }
  centradoBarraIN.appendChild(imagenbarraIN);
  //texto estado barra
  let hrefbarraIN = document.createElement("a");
  hrefbarraIN.setAttribute("href", "infoIN.html?nroin=" + nroin);
  hrefbarraIN.setAttribute("class", "hreflinea");
  let textoStrongBarra = document.createElement("strong");
  if (estadoIN == 0) {
    textoStrongBarra.innerText = nroin + " Alarma";
  }
  if (estadoIN == 1) {
    textoStrongBarra.innerText = nroin + " Normal";
  }
  if (estadoIN == 2) {
    textoStrongBarra.innerText = nroin + " Desconexión";
  }
  hrefbarraIN.appendChild(textoStrongBarra);
  let textobarraIN = document.createElement("div");
  textobarraIN.setAttribute("class", "nombrelineas");
  textobarraIN.innerHTML = "<strong>" + aliasIN + "</strong> " + subaliasIN;
  hrefbarraIN.appendChild(textobarraIN);
  barraIN.appendChild(hrefbarraIN);
  if (estadoIN == 0) {
    document.getElementById("INAlarma").appendChild(barraIN);
  }
  if (estadoIN == 1) {
    document.getElementById("INNormal").appendChild(barraIN);
  }
  if (estadoIN == 2) {
    document.getElementById("INDesc").appendChild(barraIN);
  }
}

function crearOUT(nroout, estado) {
  if (document.getElementById("o" + nroout) == null) {
    let estadoOUT = document.createElement("div");
    estadoOUT.setAttribute("id", "o" + nroout);
    estadoOUT.setAttribute("class", "botonconfigen");
    estadoOUT.setAttribute("style", "padding: 0.375rem;");
    let spanIMGOUT = document.createElement("span");
    let imagenOUT = document.createElement("img");
    imagenOUT.setAttribute("id", `imgO${nroout}`);
    spanIMGOUT.setAttribute("id", `spamimgO${nroout}`);
    if (estado == 1) {
      imagenOUT.setAttribute("src", "img/out_efaisa_rojo.png");
      spanIMGOUT.setAttribute("class", "blink_img");
    } else {
      imagenOUT.setAttribute("src", "img/out_efaisa_gris.png");
      spanIMGOUT.setAttribute("class", "");
    }
    imagenOUT.setAttribute("width", "1rem");
    imagenOUT.setAttribute("height", "1rem");
    spanIMGOUT.appendChild(imagenOUT);
    estadoOUT.appendChild(spanIMGOUT);
    let numero = document.createElement("p");
    numero.innerHTML = nroout;
    estadoOUT.appendChild(numero);
    document.getElementById("bo" + nroout).appendChild(estadoOUT);
  } else {
    if (
      document.getElementById(`imgO${nroout}`).getAttribute("src") ===
        "img/out_efaisa_gris.png" &&
      estado === 1
    ) {
      document
        .getElementById(`imgO${nroout}`)
        .setAttribute("src", "img/out_efaisa_rojo.png");
      document
        .getElementById(`spamimgO${nroout}`)
        .setAttribute("class", "blink_img");
    } else {
      if (
        document.getElementById(`imgO${nroout}`).getAttribute("src") ===
          "img/out_efaisa_rojo.png" &&
        estado === 0
      ) {
        document
          .getElementById(`imgO${nroout}`)
          .setAttribute("src", "img/out_efaisa_gris.png");
        document.getElementById(`spamimgO${nroout}`).setAttribute("class", "");
      }
    }
  }
}
