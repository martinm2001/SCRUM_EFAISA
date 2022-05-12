<?php
$con = mysqli_connect('127.0.0.1', 'efaisa', '1q2w3e4r5t6y', 'interfaz');
$query = "SELECT id_reg, fecha, nombre, tipo, valor FROM reporte;";
$res = mysqli_query($con, $query);

$filename = "Reporte_".date("Y-m-d").".xls"; // File Name
// Download file
header("Content-Disposition: attachment; filename=\"$filename\"");
header("Content-Type: application/vnd.ms-excel");
// Write data to file
$flag = false;
while ($row = mysqli_fetch_assoc($res)) {
    if (!$flag) {
        // display field/column names as first row
        echo implode("\t", array_keys($row)) . "\r\n";
        $flag = true;
    }
    echo implode("\t", array_values($row)) . "\r\n";
}
//DESCONECTO sql
$mysqli->close();
header("Refresh:0; url=../reporte.html");
?>