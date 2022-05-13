import mysql from "mysql";
function conexion(){

    const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "efaisa",
        password: "1q2w3e4r5t6y",
        database: "interfaz",
      });
      return connection;
}
module.exports = {
    "conexion": conexion()
}
