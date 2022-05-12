<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <?php
    $con = mysqli_connect('127.0.0.1', 'efaisa', '1q2w3e4r5t6y', 'interfaz');
    $query = "SELECT nombre,tipo,imagen FROM imgDispo;";
    $res = mysqli_query($con, $query);
    while ($row = mysqli_fetch_assoc($res)) {
    ?>
        <img allowtransparency='true' src="data:<?php echo $row['tipo']; ?>;base64,<?php echo  base64_encode($row['imagen']); ?>" style='background: #FFFFFF;' frameborder='0' height='100%' width='100%'>
    <?php
    }
    ?>
</body>

</html>