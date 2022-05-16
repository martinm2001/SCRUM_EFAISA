const dayjs = require("dayjs");
import mysql from "mysql";

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "efaisa",
  password: "1q2w3e4r5t6y",
  database: "interfaz",
});

let estadosDispositivos : any = [];

const postDispositivo = (req: any, res: any) => {
  const { numero, IP, tipo, nombre, perfil } = req.body;
  connection.query(
    `SELECT * FROM dispositivos WHERE numero = ${numero}`,
    function (err, result) {
      if (err) throw err;
      if (result.length === 0) {
        connection.query(
          `INSERT INTO dispositivos (numero, ip, tipo, nombre, perfil) VALUES (${Number(
            numero
          )}, '${IP}', '${tipo}', '${nombre}', '${perfil}')`,
          function (err, result) {
            if (err) throw err;
          }
        );
        res.json({ status: "OK" });
      } else {
        res.json({ status: "Fail" });
      }
    }
  );
};

const getDispositivo = (req: any, res: any) => {
  if (Object.entries(req.query).length != 0) {
    if (req.query.numero) {
      connection.query(
        `SELECT numero, ip, tipo, nombre, perfil FROM dispositivos WHERE numero = ${req.query.numero}`,
        function (err, result) {
          if (err) throw err;
          res.json(result);
        }
      );
    } else {
      res.json({ status: "Fail" });
    }
  } else {
    connection.query(
      `SELECT numero, ip, tipo, nombre, perfil FROM dispositivos`,
      function (err, result) {
        if (err) throw err;
        res.json(result);
      }
    );
  }
};

const deleteDispositivo = (req: any, res: any) => {
  const { numero } = req.body;
  connection.query(
    `DELETE FROM dispositivos WHERE numero = ${numero}`,
    function (err, result) {
      if (err) throw err;
    }
  );
  res.json({ status: "OK" });
};

const getDispositivoNoReg = (req: any, res: any) => {
  if (Object.entries(req.query).length != 0) {
    if (req.query.numero) {
      connection.query(
        `SELECT numero, ip, tipo FROM dispositivosNoRegistrados WHERE numero = ${req.query.numero}`,
        function (err, result) {
          if (err) throw err;
          res.json(result);
        }
      );
    } else {
      res.json({ status: "Fail" });
    }
  } else {
    connection.query(
      `SELECT numero, ip, tipo FROM dispositivosNoRegistrados`,
      function (err, result) {
        if (err) throw err;
        res.json(result);
      }
    );
  }
};

const postDispositivoEstado = (req: any, res: any) => {
  const { Tipo, Nro, IP, Perfil, Estado, Bateria } = req.body;
  //verifico si el dispositivo esta registrado
  connection.query(
    `SELECT * FROM dispositivos WHERE numero = ${Nro}`,
    function (err, resultDispo) {
      if (err) throw err;
      if (resultDispo.length === 0) {
        //ver si reporto anteriormente en NoRegistrados
        connection.query(
          `SELECT * FROM dispositivosNoRegistrados WHERE numero = ${Nro}`,
          function (err, resultDispoNoRes) {
            if (err) throw err;
            if (resultDispoNoRes.length != 0) {
              if (
                resultDispoNoRes[0].ip != IP ||
                resultDispoNoRes[0].tipo != Tipo
              ) {
                connection.query(
                  `UPDATE dispositivosNoRegistrados SET tipo = '${Tipo}', ip = '${IP}' WHERE numero = ${Nro};`,
                  function (err, result) {
                    if (err) throw err;
                  }
                );
              }
            } else {
              connection.query(
                `INSERT INTO dispositivosNoRegistrados (numero, tipo, ip) VALUES (${Number(
                  Nro
                )}, '${Tipo}', '${IP}')`,
                function (err, result) {
                  if (err) throw err;
                }
              );
            }
          }
        );
      } else {
        //remplazo si habia un anterior reporte
        for (let i = 0; i < estadosDispositivos.length; i++) {
          if (estadosDispositivos[i].Nro == Nro) {
            delete estadosDispositivos[i];
            estadosDispositivos = estadosDispositivos.filter(
              (value: any) => value != null
            );
          }
        }

        estadosDispositivos.push({
          Nro: Nro,
          IP: IP,
          Tipo: Tipo,
          Nombre: resultDispo[0].nombre,
          Perfil: Perfil,
          Estado: Estado,
          Bateria: Bateria,
          tiempoReportado: dayjs(),
        });
      }
    }
  );
  res.json({ status: "OK" });
};

const getDispositivoEstado = (req: any, res: any) => {
  for (let i = 0; i < estadosDispositivos.length; i++) {
    let tiempoReporte = dayjs(estadosDispositivos[i].tiempoReportado).add(
      1,
      "minute"
    );
    if (dayjs().isAfter(dayjs(tiempoReporte))) {
      estadosDispositivos[i].Estado = "SINCOMUNICACION";
    }
  }

  res.json(estadosDispositivos);
};
module.exports = {
  postDispositivo,
  getDispositivo,
  deleteDispositivo,
  postDispositivoEstado,
  getDispositivoEstado,
  getDispositivoNoReg,
};
