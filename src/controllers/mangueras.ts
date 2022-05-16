const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
import mysql from "mysql";
const connection = require("./conec");

/*const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "efaisa",
        password: "1q2w3e4r5t6y",
        database: "interfaz",
      });
*/

const calcularVencimiento = (fecha: any) => {
  if (fecha === "0000-00-00") {
    return fecha;
  } else {
    return dayjs(fecha).add(1, "year").format("YYYY-MM-DD");
  }
};

const getMangueras = (req: any, res: any) => {
  if (req.query.nroin) {
    connection.query(
      `SELECT id, alias, fabricante, nro_serie, tipo, codigo_q, metros, ubicacion, nro_estacion, fecha_instalacion, fecha_ph, certificador, tel_contacto, email, infoadicional FROM manguerasin WHERE id_sector =${req.query.nroin}`,
      function (error, results, fields) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < results.length; i++) {
            results[i].fecha_instalacion =
              results[i].fecha_instalacion === "0000-00-00"
                ? null
                : dayjs(results[i].fecha_instalacion).format("DD/MM/YYYY");
            results[i].fecha_ph =
              results[i].fecha_ph === "0000-00-00"
                ? null
                : dayjs(results[i].fecha_ph).format("DD/MM/YYYY");
          }
          res.json(results);
        }
      }
    );
  } else if (req.query.idman) {
    connection.query(
      `SELECT alias, id_sector, fabricante, nro_serie, tipo, codigo_q, metros, ubicacion, nro_estacion, fecha_instalacion, fecha_ph, certificador, tel_contacto, email, infoadicional FROM manguerasin WHERE id = ${req.query.idman}`,
      function (error, results, fields) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < results.length; i++) {
            results[i].fecha_instalacion =
              results[i].fecha_instalacion === "0000-00-00"
                ? null
                : dayjs(results[i].fecha_instalacion).format("DD/MM/YYYY");
            results[i].fecha_ph =
              results[i].fecha_ph === "0000-00-00"
                ? null
                : dayjs(results[i].fecha_ph).format("DD/MM/YYYY");
          }
          res.json(results[0]);
        }
      }
    );
  } else {
    connection.query(
      "SELECT id, id_sector, alias, fabricante, nro_serie, tipo, codigo_q, metros, ubicacion, nro_estacion, fecha_instalacion, fecha_ph, certificador, tel_contacto, email, infoadicional FROM manguerasin",
      function (error, results, fields) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < results.length; i++) {
            results[i].fecha_instalacion =
              results[i].fecha_instalacion === "0000-00-00"
                ? null
                : dayjs(results[i].fecha_instalacion).format("DD/MM/YYYY");
            results[i].fecha_ph =
              results[i].fecha_ph === "0000-00-00"
                ? null
                : dayjs(results[i].fecha_ph).format("DD/MM/YYYY");
          }
          res.json(results);
        }
      }
    );
  }
};

const postMangueras = (req: any, res: any) => {
  const {
    id_sector,
    alias,
    fabricante,
    nro_serie,
    tipo,
    codigo_q,
    metros,
    ubicacion,
    nro_estacion,
    fecha_instalacion,
    fecha_ph,
    certificador,
    tel_contacto,
    email,
    infoadicional,
  } = req.body;

  connection.query(
    `INSERT INTO manguerasin 
    (
      id_sector,
      alias,
      fabricante,
      nro_serie,
      tipo,
      codigo_q,
      metros,
      ubicacion,
      nro_estacion,
      fecha_instalacion,
      fecha_ph,
      certificador,
      tel_contacto,
      email,
      infoadicional       
    ) VALUES (
      ${id_sector},
      '${alias}',
      '${fabricante}',
      ${nro_serie},
      '${tipo}',
      ${codigo_q},
      ${metros},
      '${ubicacion}',
      ${nro_estacion},
      '${calcularVencimiento(fecha_instalacion)}',
      '${calcularVencimiento(fecha_ph)}',
      '${certificador}',
      ${tel_contacto},
      '${email}',
      '${infoadicional}'
    );`,
    function (err, result) {
      if (err) {
        res.json({ status: "Fail" });
      } else {
        res.json({ status: "OK" });
      }
    }
  );
};

const putMangueras = (req: any, res: any) => {
  const {
    id,
    alias,
    fabricante,
    nro_serie,
    tipo,
    codigo_q,
    metros,
    ubicacion,
    nro_estacion,
    fecha_instalacion,
    fecha_ph,
    certificador,
    tel_contacto,
    email,
    infoadicional,
  } = req.body;

  connection.query(
    `UPDATE manguerasin SET
      alias = '${alias}',
      fabricante = '${fabricante}',
      nro_serie = ${nro_serie},
      tipo = '${tipo}',
      codigo_q = ${codigo_q},
      metros = ${metros},
      ubicacion = '${ubicacion}',
      nro_estacion = ${nro_estacion},
      fecha_instalacion = '${fecha_instalacion}',
      fecha_ph = '${fecha_ph}',
      certificador = '${certificador}',
      tel_contacto = ${tel_contacto},
      email = '${email}',
      infoadicional = '${infoadicional}'
    WHERE 
      id = ${id}`,
    function (err, result) {
      if (err) {
        res.json({ status: "Fail" });
      } else {
        res.json({ status: "OK" });
      }
    }
  );
};

const deleteMangueras = (req: any, res: any) => {
  const { id } = req.body;
  connection.query(
    `DELETE FROM manguerasin WHERE id = ${id}`,
    function (err, result) {
      if (err) throw err;
    }
  );
  res.json({ status: "OK" });
};

const getManguerasVencidosAno = (req: any, res: any) => {
  connection.query(
    "SELECT id, id_sector, alias, fecha_instalacion FROM manguerasin",
    function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        let response: any = [];
        for (let i = 0; i < results.length; i++) {
          if ((dayjs().isAfter(dayjs(results[i].fecha_instalacion))) && (results[i].fecha_instalacion != '0000-00-00')) {
            response.push(results[i]);
          }
        }
        res.json(response);
      }
    }
  );
};

const getManguerasProntoVencerAno = (req: any, res: any) => {
  connection.query(
    "SELECT id, id_sector, alias, fecha_instalacion FROM manguerasin",
    function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        let response: any = [];
        for (let i = 0; i < results.length; i++) {
          if (
            dayjs().isBetween(
              dayjs(results[i].fecha_instalacion).add(10, "day"),
              dayjs(results[i].fecha_instalacion),
              "day"
            )
          ) {
            response.push(results[i]);
          }
        }
        res.json(response);
      }
    }
  );
};

const getManguerasVencidosPH = (req: any, res: any) => {
  connection.query(
    "SELECT id, id_sector, alias, fecha_ph FROM manguerasin",
    function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        let response: any = [];
        for (let i = 0; i < results.length; i++) {
          if ((dayjs().isAfter(dayjs(results[i].fecha_ph))) && (results[i].fecha_ph != '0000-00-00')) {
            response.push(results[i]);
          }
        }
        res.json(response);
      }
    }
  );
};

const getManguerasProntoVencerPH = (req: any, res: any) => {
  connection.query(
    "SELECT id, id_sector, alias, fecha_ph FROM manguerasin",
    function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        let response: any = [];
        for (let i = 0; i < results.length; i++) {
          if (
            dayjs().isBetween(
              dayjs(results[i].fecha_ph).add(10, "day"),
              dayjs(results[i].fecha_ph),
              "day"
            )
          ) {
            response.push(results[i]);
          }
        }
        res.json(response);
      }
    }
  );
};

module.exports = {
  getMangueras,
  postMangueras,
  putMangueras,
  deleteMangueras,
  getManguerasVencidosAno,
  getManguerasProntoVencerAno,
  getManguerasVencidosPH,
  getManguerasProntoVencerPH,
};
