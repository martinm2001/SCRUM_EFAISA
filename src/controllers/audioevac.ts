//Conexión con la base de datos via archivo conec
import mysql from "mysql";

const connection = require("./conec");
    


const getAudioEvac = (req: any, res: any) => {
  connection.query(
    "SELECT activado, entrada1, entrada2, tiempoEntradas, tiempoSalida FROM audioevac",
    function (err, result) {
      if (err) throw err;
      res.json(result[0]);
    }
  );
};

const getActivo = (req: any, res: any) => {
  connection.query(`SELECT activado FROM audioevac `, function (err, result) {
    if (err) throw err;
    res.json(result[0]);
  });
};
// modelo para hacer POST
const putAudioEvac = (req: any, res: any) => {
  const { activado, entrada1, entrada2, tiempoEntradas, tiempoSalida } =
    req.body;
  connection.query(
    `UPDATE audioevac SET activado = ${activado}, entrada1 = ${entrada1}, entrada2 = ${entrada2}, tiempoEntradas = ${tiempoEntradas}, TiempoSalida = ${tiempoSalida}  WHERE id=1`,
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
  getAudioEvac,
  getActivo,
  putAudioEvac,
};
