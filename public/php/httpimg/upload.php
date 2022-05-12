<?php
$con = new mysqli('127.0.0.1', 'efaisa', '1q2w3e4r5t6y', 'interfaz');
// ¡Error!
if ($con->connect_errno) {
    echo "Error GUI interfaz - Perdida de Coneccion.";
    exit;
}
$uploadOk = 1;
$imageFileType = strtolower(pathinfo(basename($_FILES["imageFile"]["name"]), PATHINFO_EXTENSION));

// Check if image file is a actual image or fake image
if (isset($_POST["submit"])) {
    $check = getimagesize($_FILES["imageFile"]["tmp_name"]);
    if ($check !== false) {
        echo "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not an image.\n";
        echo "is ".$_FILES;
        //$query = "INSERT INTO imgDispo (nombre, imagen, tipo) VALUES ('$nombreArchivo', '$binariosImagen', '$tipoArchivo');";
        $uploadOk = 0;
    }
}

// Check file size
if ($_FILES["imageFile"]["size"] > 500000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}

// Allow certain file formats
if (
    $imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
    && $imageFileType != "gif"
) {
    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
    $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
    // if everything is ok, try to upload file
} else {
    $tipoArchivo = $imageFileType;
    $nombreArchivo = $_FILES['imageFile']['name'];
    $tamanoArchivo = $_FILES['imageFile']['size'];
    $imagenSubida = fopen($_FILES["imageFile"]["tmp_name"], 'r');

    $binariosImagen = fread($imagenSubida, $tamanoArchivo);
    $binariosImagen = mysqli_escape_string($con, $binariosImagen);
    $query = "INSERT INTO imgDispo (nombre, imagen, tipo) VALUES ('$nombreArchivo', '$binariosImagen', '$tipoArchivo');";
    $res = mysqli_query($con, $query);
    $estado = explode("-", $nombreArchivo)[0];
    $idDisp = explode(".", (explode("-", $nombreArchivo)[1]))[0];
    echo "nombreArchivo " . $nombreArchivo . "\n";
    echo "ID  " . $idDisp . "\n";
    echo "estado  " . $estado . "\n";
    if ($res === TRUE) {
        echo "cargo en BD";
    } else {
        echo "no cargo BD";
    }
    echo "The file " . basename($_FILES["imageFile"]["name"]) . " has been uploaded.";
}
