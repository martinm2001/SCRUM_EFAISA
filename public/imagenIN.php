<?php
$nroin = $_GET["nroin"];

$mysqli = new mysqli('127.0.0.1', 'efaisa', '1q2w3e4r5t6y', 'interfaz');
// ¡Error!
if ($mysqli->connect_errno) {
    echo "Error GUI interfaz - Perdida de Coneccion.";
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Imágen sector <?php echo $nroin ?></title>
    <link rel="icon" href="img/iconohead.ico">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <script src="scripts/jquery-3.5.0.min.js"></script>
    <script src="scripts/bootstrap.min.js"></script>

    <link rel="stylesheet" href="css/style.css">
    <script src="scripts/script.js"></script>
    <script src="scripts/barraestado.js"></script>
</head>
<script>
    let estadoEntradas = [];
    let estadoSalidas = [];
    let estadoFuente = [];
    let estadoDesconexion = [];
    let ExtintorVencido = 0;

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
</script>

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
    <main class="contprinc">
        <nav class="navbar navbar-default">
            <?php
            $query = "SELECT tipouso FROM tipoin WHERE id =" . $nroin . ";";
            $res = mysqli_query($mysqli, $query);
            $row = mysqli_fetch_assoc($res);
            if ($row['tipouso'] == "Bomba Jockey") {
                $imagenTipo = "img/bomba_jockey_roja.png";
            };
            if ($row['tipouso'] == "Electrobomba") {
                $imagenTipo = "img/electrobomba_roja.png";
            };
            if ($row['tipouso'] == "Evacuacion") {
                $imagenTipo = "img/evacuacion.png";
            };
            if ($row['tipouso'] == "Gastronomico") {
                $imagenTipo = "img/gatronomico.svg";
            };
            if ($row['tipouso'] == "Incendio") {
                $imagenTipo = "img/deteccionRoja.png";
            };
            if ($row['tipouso'] == "Robo") {
                $imagenTipo = "img/robo_rojo.png";
            };
            if ($row['tipouso'] == "Medico") {
                $imagenTipo = "img/medico.png";
            };
            if ($row['tipouso'] == "Motobomba") {
                $imagenTipo = "img/motobomba_roja.png";
            };
            if ($row['tipouso'] == "Panico") {
                $imagenTipo = "img/panico.png";
            };
            if ($row['tipouso'] == "Sensores") {
                $imagenTipo = "img/sensores_rojo.png";
            };
            if ($row['tipouso'] == "Tercer Tiempo") {
                $imagenTipo = "img/tercer_tiempo_rojo.png";
            };
            ?>
            <div style="display: inline-flex;">
                <img class="imgHeaderConfig" src="<?php echo $imagenTipo; ?>">
                <h3 class="headerConfig">Imágen sector <?php echo $nroin ?></h3>
            </div>
        </nav>
        <div class="contenedorprinc config">
            <?php
            if (isset($_REQUEST['guardar'])) {
                if (isset($_FILES['foto']['name'])) {
                    $tipoArchivo = $_FILES['foto']['type'];
                    $permitido = array("image/png", "image/jpeg", "image/svg+xml");
                    if (in_array($tipoArchivo, $permitido) == false) {
                        echo "<div class='alert alert-danger cartelinfoform float-start' role='alert'>Archivo no permitido</div>";
                        header("Refresh:2; url=imagenIN.php?nroin=$nroin");
                    }
                    $nombreArchivo = $_FILES['foto']['name'];
                    $tamanoArchivo = $_FILES['foto']['size'];
                    $imagenSubida = fopen($_FILES['foto']['tmp_name'], 'r');
                    $binariosImagen = fread($imagenSubida, $tamanoArchivo);
                    $con = mysqli_connect('127.0.0.1', 'efaisa', '1q2w3e4r5t6y', 'interfaz');
                    $binariosImagen = mysqli_escape_string($con, $binariosImagen);
                    header("Refresh:2; url=imagenIN.php?nroin=$nroin");
                    $query = "UPDATE imgin SET nombre = '$nombreArchivo', imagen = '$binariosImagen', tipo = '$tipoArchivo' WHERE id=$nroin;";
                    $res = mysqli_query($con, $query);
                }
            }
            ?>

            <form method="post" enctype="multipart/form-data">
                <div class="recuadroImagen">
                    <input id="file" class="imgfileimput" type="file" name="foto" />
                    <hr>
                    <div id="preview"></div>
                    <script src="scripts/cargaImagen.js"></script>
                    <button type="submit" class="btn btn-light botonformulario float-start" name="guardar"><img src="img/guardar.png" width="36px"> Guardar</button>
                </div>
                <p>NOTA: cargar en formato de imagenes</p>
                <span>
                    <?php
                    if (!($nombreArchivo == "")) {
                        if ($res === TRUE) {
                            echo "<div class='alert alert-success cartelinfoform float-start' role='alert'>Guardado!</div>";
                            header("Refresh:2; url=imagenIN.php?nroin=$nroin");
                        }
                    }
                    ?>
                </span>
            </form>
        </div>

    </main>
    <footer id="footer">
        <script>
            crearBotonFooter(`imagenSectoresmenu.html`, "img/boton_cruz.png");
        </script>
    </footer>
</body>

</html>