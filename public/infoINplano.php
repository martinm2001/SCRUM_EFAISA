<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="img/iconohead.ico">
  <title>Plano sector </title>
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <script src="scripts/jquery-3.5.0.min.js"></script>
  <script src="scripts/bootstrap.min.js"></script>

  <link rel="stylesheet" href="css/style.css">
  <script src="scripts/script.js"></script>
  <script src="scripts/barraestado.js"></script>
</head>

<body onload="reloj()">
  <header>
    <nav class="navbar navbar-default barraestado">
      <div id="barraEstado" class="container-fluid displayinicial" style="text-align: center">
        <div class="float-start" style="display: flex;">
          <div id="contenedorAlarmaGeneral"></div>
          <div id="contendorDesconexion"></div>
          <div id="contendorDerivTierra"></div>
          <div id="contendorBarraExtintor"></div>
        </div>
        <h1 id="nomOrgBarra" title="Nombre Organizacion" class="float-center nombreOrg"></h1>
        <div class="float-end" style="display: flex;">
          <img src="img/muneEfaisa.png" title="EFAISA S.A.S" class="img-fluid tamano36" />
          <img id="candado" src="img/candado_amarillo.png" title="Nivel acceso, 0" class="img-fluid tamano36" />
          <img src="img/internet_ok.png" title="Aprovisionado" class="img-fluid tamano36" />
          <div id="contenedorAlimentacion"></div>
          <div id="contenedorBateria"></div>
          <div id="reloj" class="float-end reloj"></div>
        </div>
    </nav>
  </header>
  <script>
    let estadoEntradas = [];
    let estadoSalidas = [];
    let estadoFuente = [];
    let estadoDesconexion = [];
    let ExtintorVencido = 0;
    let nivAcc = 0;

    Date.prototype.addDays = function(days) {
      const date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

    setInterval(() => {
      $.getJSON(
        `${window.location.port}//${window.location.hostname}/api/general`,
        (dataGeneral) => {
          $.getJSON(
            `${window.location.port}//${window.location.hostname}/api/serial/entradas`,
            (dataEntradas) => {
              $.getJSON(
                `${window.location.port}//${window.location.hostname}/api/serial/fuente`,
                (dataFuente) => {
                  $.getJSON(
                    `${window.location.port}//${window.location.hostname}/api/inout/desconexion`,
                    (dataDesconexion) => {
                      if (
                        dataEntradas.data != estadoEntradas ||
                        dataFuente.data != estadoFuente ||
                        dataDesconexion.data != estadoDesconexion
                      ) {
                        estadoEntradas = dataEntradas.data;
                        estadoFuente = dataFuente.data;
                        estadoDesconexion = dataDesconexion;
                        barraEstado(
                          dataGeneral,
                          dataEntradas.data,
                          dataFuente.data,
                          dataDesconexion
                        );
                      }
                    })
                }
              );
            }
          );
        }
      );
    }, 1500);

    setInterval(() => {
      let fechaActual = new Date(Date());
      $.getJSON(`${window.location.port}//${window.location.hostname}/api/extintores`, (data) => {
        for (let i = 0; i < data.length; i++) {
          if (!(data[i].ano_fabric === null)) {
            let fechaAno = new Date(`${data[i].ano_fabric.split('/')[1]}/${data[i].ano_fabric.split('/')[0]}/${data[i].ano_fabric.split('/')[2]}`);
            let fechaAno10 = fechaAno.addDays(-10);
            if (fechaActual > fechaAno) {
              ExtintorVencido = 1;
            } else if (fechaActual > fechaAno10) {
              ExtintorVencido = 1;
            }
          }
          if (!(data[i].fecha_carga === null)) {
            let fechaCarga = new Date(`${data[i].fecha_carga.split('/')[1]}/${data[i].fecha_carga.split('/')[0]}/${data[i].fecha_carga.split('/')[2]}`);
            let fechaCarga10 = fechaCarga.addDays(-10);
            if (fechaActual > fechaCarga) {
              ExtintorVencido = 1;
            } else if (fechaActual > fechaCarga10) {
              ExtintorVencido = 1;
            }
          }
          if (!(data[i].fecha_ph === null)) {
            let fechaph = new Date(`${data[i].fecha_ph.split('/')[1]}/${data[i].fecha_ph.split('/')[0]}/${data[i].fecha_ph.split('/')[2]}`);
            let fechaph10 = fechaph.addDays(-10);
            if (fechaActual > fechaph) {
              ExtintorVencido = 1;
            } else if (fechaActual > fechaph10) {
              ExtintorVencido = 1;
            }
          }
        }
      })
      $.getJSON(`${window.location.port}//${window.location.hostname}/api/mangueras`, (data) => {
        for (let i = 0; i < data.length; i++) {
          if (!(data[i].fecha_instalacion === null)) {
            let fechaInstalacion = new Date(`${data[i].fecha_instalacion.split('/')[1]}/${data[i].fecha_instalacion.split('/')[0]}/${data[i].fecha_instalacion.split('/')[2]}`);
            let fechaInstalacion10 = fechaInstalacion.addDays(-10);
            if (fechaActual > fechaInstalacion) {
              ExtintorVencido = 1;
            } else if (fechaActual > fechaInstalacion10) {
              ExtintorVencido = 1;
            }
          }
          if (!(data[i].fecha_ph === null)) {
            let fechaph = new Date(`${data[i].fecha_ph.split('/')[1]}/${data[i].fecha_ph.split('/')[0]}/${data[i].fecha_ph.split('/')[2]}`);
            let fechaph10 = fechaph.addDays(-10);
            if (fechaActual > fechaph) {
              ExtintorVencido = 1;
            } else if (fechaActual > fechaph10) {
              ExtintorVencido = 1;
            }
          }
        }
      })
      if (ExtintorVencido === 1) {
        if (document.getElementById("barraExtintor") === null) {
          let imgExtintor = document.createElement('img')
          imgExtintor.setAttribute('id', 'barraExtintor')
          imgExtintor.setAttribute('src', 'img/extintor.png')
          imgExtintor.setAttribute('title', 'Extintor')
          imgExtintor.setAttribute('class', 'img-fluid tamano36')
          document.getElementById("contendorBarraExtintor").appendChild(imgExtintor)
        }
      } else {
        if (document.getElementById("barraExtintor") != null) {
          document.getElementById("barraExtintor").remove()
        }
      }
    }, 5000);

    const params = new URLSearchParams(window.location.search);
    const nroin = params.get('nroin')
    document.title = `Imagen Sector ${nroin}`
  </script>
  <main id="contprinc" class="contprinc contimg">
    <?php
    $nroin = $_GET["nroin"];
    $con = mysqli_connect('127.0.0.1', 'efaisa', '1q2w3e4r5t6y', 'interfaz');
    $query = "SELECT nombre,tipo,imagen FROM planosin WHERE id=$nroin;";
    $res = mysqli_query($con, $query);
    while ($row = mysqli_fetch_assoc($res)) {
    ?>
      <img allowtransparency='true' src="data:<?php echo $row['tipo']; ?>;base64,<?php echo  base64_encode($row['imagen']); ?>" style='background: #FFFFFF;' frameborder='0' height='100%' width='100%'>
    <?php
    }
    ?>
  </main>
  <footer id="footer">
    <script>
      crearBotonFooter(`infoINplano.php?nroin=${nroin}`, 'img/plano_blanco.png')
      crearBotonFooter(`infoINimagen.php?nroin=${nroin}`, 'img/Imagen.png')
      crearBotonFooter(`infoINcamara.html?nroin=${nroin}`, 'img/camara_azul.png')
      crearBotonFooter(`infoINmanual.html?nroin=${nroin}`, 'img/carpeta_azul_manual.png')
      crearBotonFooter(`infoINextintores.html?nroin=${nroin}`, 'img/extintor.png')
      crearBotonFooter(`infoIN.html?nroin=${nroin}`, 'img/info.png')
      crearBotonFooter(`index.html`, 'img/boton_cruz.png')
    </script>
  </footer>
</body>

</html>