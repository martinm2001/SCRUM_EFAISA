function crearBotonFooter(href, imgHref) {
  let boton = document.createElement("div");
  boton.setAttribute("class", "footer py-2 float-end");
  let botonHref = document.createElement("a");
  botonHref.setAttribute("href", href);
  botonHref.setAttribute("class", "btn btn-light botonconfigen");
  botonHref.setAttribute("role", "button");
  let imgBotonHref = document.createElement("img");
  imgBotonHref.setAttribute("src", imgHref);
  imgBotonHref.setAttribute("height", "36px");
  imgBotonHref.setAttribute("width", "36px");
  botonHref.appendChild(imgBotonHref);
  boton.appendChild(botonHref);
  document.getElementById("footer").appendChild(boton);
}
function crearBarraConfig(nombre, ruta, rutaIcono) {
  let barra = document.createElement("a");
  barra.setAttribute("href", ruta);
  barra.setAttribute(
    "class",
    "btn btn-light btn-light btn-outline-dark botonConfigLista"
  );
  barra.setAttribute("role", "button");
  barra.setAttribute("style", "display: flex;");
  let imagenBarra = document.createElement("img");
  imagenBarra.setAttribute("src", rutaIcono);
  imagenBarra.setAttribute("height", "36px");
  imagenBarra.setAttribute("width", "36px");
  barra.appendChild(imagenBarra);
  let nombrebarra = document.createElement("p");
  nombrebarra.innerText = nombre;
  barra.appendChild(nombrebarra);
  document.getElementById("contendorConfig").appendChild(barra);
}
