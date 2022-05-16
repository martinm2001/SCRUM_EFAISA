import mysql from "mysql";
const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "efaisa",
        password: "1q2w3e4r5t6y",
        database: "interfaz",
      });

const getGeneral = (req: any, res: any) => {
  connection.query(
    "SELECT NombreOrg, nivAcc, usuarios, nroResponsable, domicilio, adicional FROM infogral WHERE id = 1",
    function (err: any, result: any) {
      if (err) throw err;
      res.json(result[0]);
    }
  );
};

const postGeneral = (req: any, res: any) => {
  const { NombreOrg, usuarios, nroResponsable, domicilio, adicional } =
    req.body;
  connection.query(
    `UPDATE infogral SET NombreOrg = '${NombreOrg}', domicilio = '${domicilio}', nroResponsable = '${nroResponsable}', usuarios = '${usuarios}', adicional = '${adicional}' WHERE id=1`,
    function (err: any, result: any) {
      if (err) {
        res.json({ status: "Fail" });
      } else {
        res.json({ status: "OK" });
      }
    }
  );
};
// $sqlup = "UPDATE infogral SET urlmanuales = '$urlmanuales' WHERE id=1";
const getManual = (req: any, res: any) => {
  connection.query(
    "SELECT urlmanuales FROM infogral WHERE id = 1",
    function (err: any, result: any) {
      if (err) throw err;
      res.json(result[0]);
    }
  );
};

const putManual = (req: any, res: any) => {
  const { urlmanuales } = req.body;
  connection.query(
    `UPDATE infogral SET urlmanuales = '${urlmanuales}' WHERE id=1`,
    function (err: any, result: any) {
      if (err) {
        res.json({ status: "Fail" });
      } else {
        res.json({ status: "OK" });
      }
    }
  );
};

const login = (req: any, res: any) => {
  const { codigo } = req.body;
  connection.query(
    "SELECT nivAcc, codAcc1, codAcc2 FROM infogral WHERE id = 1",
    function (err: any, result: any) {
      if (err) throw err;
      if (result[0].codAcc1 === Number(codigo)) {
        connection.query(
          "UPDATE infogral SET NivAcc = 1 WHERE id=1",
          function (err: any, result: any) {
            if (err) throw err;
          }
        );
        return res.json({ status: "OK" });
      } else if (result[0].codAcc2 === Number(codigo)) {
        connection.query(
          "UPDATE infogral SET NivAcc = 2 WHERE id=1",
          function (err: any, result: any) {
            if (err) throw err;
          }
        );
        return res.json({ status: "OK" });
      } else {
        return res.json({ status: "FAIL" });
      }
    }
  );
};

const logout = (req: any, res: any) => {
  connection.query(
    "UPDATE infogral SET NivAcc = 0 WHERE id=1",
    function (err: any, result: any) {
      if (err) throw err;
    }
  );
  res.json({ status: "OK" });
};

const getReporte = (req: any, res: any) => {
  connection.query(
    "SELECT id_reg, fecha, nombre, tipo, valor FROM reporte",
    function (err: any, result: any) {
      if (err) throw err;
      res.json(result);
    }
  );
};

const getTelegram = (req: any, res: any) => {
  connection.query(
    "SELECT telegramChatID, telegramToken FROM infogral WHERE id=1",
    function (err: any, result: any) {
      if (err) throw err;
      res.json(result[0]);
    }
  );
};

const putTelegram = (req: any, res: any) => {
  const { telegramChatID, telegramToken } = req.body;
  connection.query(
    `UPDATE infogral SET telegramChatID = '${telegramChatID}', telegramToken = '${telegramToken}' WHERE id=1`,
    function (err: any, result: any) {
      if (err) {
        res.json({ status: "Fail" });
      } else {
        res.json({ status: "OK" });
      }
    }
  );
};

const putCodigoAcceso = (req: any, res: any) => {
  const { nivAcc, codigo } = req.body;
  connection.query(
    `UPDATE infogral SET codAcc${nivAcc} = ${codigo} WHERE id=1`,
    function (err: any, result: any) {
      if (err) {
        res.json({ status: "Fail" });
      } else {
        res.json({ status: "OK" });
      }
    }
  );
};
// "UPDATE infogral SET codAcc$radioval = $codAcc WHERE id=1";

module.exports = {
  getGeneral,
  postGeneral,
  getManual,
  putManual,
  login,
  logout,
  getReporte,
  getTelegram,
  putTelegram,
  putCodigoAcceso,
};
