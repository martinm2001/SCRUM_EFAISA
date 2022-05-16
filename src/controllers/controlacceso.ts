//Conexión con la base de datos via archivo conec
import mysql from "mysql";
const connection = require("./conec");

/*const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "efaisa",
        password: "1q2w3e4r5t6y",
        database: "interfaz",
      });
*/

const getControlAcceso = (req: any, res: any) => {
  connection.query(
    `SELECT activado, nombreCA, URLCA FROM controlAcceso WHERE id = 1`,
    function (err, result) {
      if (err) throw err;
      res.json(result[0]);
    }
  );
};

// modelo para hacer put
const putControlAcceso = (req: any, res: any) => {
  const { activado, nombreCA, URLCA } = req.body;
  connection.query(
    `UPDATE controlAcceso SET activado = ${activado}, nombreCA = '${nombreCA}', URLCA = '${URLCA}' WHERE id=1`,
    function (err, result) {
      if (err) {
        res.json({ status: "Fail" });
      } else {
        res.json({ status: "OK" });
      }
    }
  );
};

module.exports = {
  getControlAcceso,
  putControlAcceso,
};
