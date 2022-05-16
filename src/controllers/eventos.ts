import mysql from "mysql";

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "efaisa",
  password: "1q2w3e4r5t6y",
  database: "interfaz",
});

let eventosManuales: number[] = [];

const getEventos = (req: any, res: any) => {
  if (req.query.id) {
    connection.query(
      `SELECT nombreEvento, entrada, tiempoin, salida, tiempoout FROM eventos WHERE id=${req.query.id}`,
      function (err: any, result: any) {
        if (err) throw err;
        res.json(result[0]);
      }
    );
  } else {
    connection.query(
      "SELECT id, nombreEvento, entrada, tiempoin, salida, tiempoout FROM eventos",
      function (err: any, result: any) {
        if (err) throw err;
        res.json(result);
      }
    );
  }
};

const postActEventoManual = (req: any, res: any) => {
  const { id } = req.body;
  eventosManuales[id] = 1;
  res.json({ status: "OK" });
};

const postDesactEventoManual = (req: any, res: any) => {
  const { id } = req.body;
  eventosManuales[id] = 0;
  res.json({ status: "OK" });
};

const postEventos = (req: any, res: any) => {
  const { nombreEvento, entrada, tiempoin, salida, tiempoout } = req.body;
  connection.query(
    `INSERT INTO eventos (nombreEvento, entrada, tiempoin, salida, tiempoout) VALUES ('${nombreEvento}', ${entrada}, ${tiempoin}, ${salida}, ${tiempoout})`,
    function (err: any, result: any) {
      if (err) {
        res.json({ status: "Fail" });
      } else {
        res.json({ status: "OK" });
      }
    }
  );
};

const putEventos = (req: any, res: any) => {
  const { id, nombreEvento, entrada, tiempoin, salida, tiempoout } = req.body;
  connection.query(
    `UPDATE eventos SET nombreEvento = '${nombreEvento}', entrada = ${entrada}, tiempoin =  ${tiempoin}, salida = ${salida}, tiempoout = ${tiempoout} WHERE id=${id}`,
    function (err: any, result: any) {
      if (err) {
        res.json({ status: "Fail" });
      } else {
        res.json({ status: "OK" });
      }
    }
  );
};

const deleteEvento = (req: any, res: any) => {
  const { id } = req.body;
  connection.query(
    `DELETE FROM eventos WHERE id = ${id}`,
    function (err: any, result: any) {
      if (err) throw err;
    }
  );
  res.json({ status: "OK" });
};

module.exports = {
  getEventos,
  postEventos,
  putEventos,
  deleteEvento,
  postActEventoManual,
  postDesactEventoManual,
  eventosManuales,
};
