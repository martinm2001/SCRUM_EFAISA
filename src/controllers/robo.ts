import mysql from "mysql";

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "efaisa",
  password: "1q2w3e4r5t6y",
  database: "interfaz",
});

const getRobo = (req: any, res: any) => {
  connection.query(
    "SELECT activado, retardoIN1, retardoOUT3, cruzadoAct, cruzado1, cruzado2 FROM eventosrobo",
    function (err, result) {
      if (err) throw err;
      res.json(result[0]);
    }
  );
};

const getRoboDisponible = (req: any, res: any) => {
  connection.query(
    "SELECT id FROM infoin WHERE tipoIN = 'Robo'",
    function (err, result) {
      if (err) throw err;
      let respuesta: String[] = [];
      for (let i = 0; i < result.length; i++) {
        respuesta.push(result[i].id);
      }
      res.json(respuesta);
    }
  );
};

const getRoboSimple = (req: any, res: any) => {
  connection.query(
    "SELECT id FROM infoin WHERE tipoIN = 'Robo'",
    function (err, resultRoboDisponible) {
      if (err) throw err;
      connection.query(
        "SELECT cruzadoAct, cruzado1, cruzado2 FROM eventosrobo",
        function (err, resultRoboCruze) {
          if (err) throw err;
          let respuesta: String[] = [];
          for (let i = 0; i < resultRoboDisponible.length; i++) {
            if (resultRoboCruze[0].cruzadoAct === 1) {
              if (
                !(
                  resultRoboDisponible[i].id === resultRoboCruze[0].cruzado1 ||
                  resultRoboDisponible[i].id === resultRoboCruze[0].cruzado2
                )
              ) {
                respuesta.push(resultRoboDisponible[i].id);
              }
            } else {
              respuesta.push(resultRoboDisponible[i].id);
            }
          }
          res.json(respuesta);
        }
      );
    }
  );
};

const getActivo = (req: any, res: any) => {
  connection.query(`SELECT activado FROM eventosrobo`, function (err, result) {
    if (err) throw err;
    res.json(result[0]);
  });
};

// modelo para hacer PUT
const putRobo = (req: any, res: any) => {
  const { activado, retardoIN1, retardoOUT3, cruzadoAct, cruzado1, cruzado2 } =
    req.body;
  connection.query(
    `UPDATE eventosrobo SET activado = ${activado}, retardoIN1 = ${retardoIN1}, retardoOUT3 = ${retardoOUT3}, cruzadoAct = ${cruzadoAct}, cruzado1 = ${cruzado1}, cruzado2 = ${cruzado2} WHERE id=1`,
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
  getRobo,
  getRoboDisponible,
  getRoboSimple,
  getActivo,
  putRobo,
};
