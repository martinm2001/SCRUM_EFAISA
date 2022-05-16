const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
import mysql from "mysql";

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "efaisa",
  password: "1q2w3e4r5t6y",
  database: "interfaz",
});

const calcularVencimientoAnoFabricacion = (tipo: any, fecha: any) => {
  if (
    tipo == "Acetato de Potasio" ||
    tipo == "Agua" ||
    tipo == "Agua Vaporizada" ||
    tipo == "Clase D" ||
    tipo == "Espuma" ||
    tipo == "Polvo ABC" ||
    tipo == "Polvo BC" ||
    tipo == "Haloclean" ||
    tipo == "Halotron" ||
    tipo == "HC 36"
  ) {
    return dayjs(fecha).add(20, "year").format("YYYY-MM-DD");
  } else if (tipo == "CO2" || tipo == "FM 200" || tipo == "NOVEC 1230") {
    return dayjs(fecha).add(30, "year").format("YYYY-MM-DD");
  } else {
    return fecha;
  }
};

const calcularVencimientoCarga = (tipo: any, fecha: any) => {
  if (
    tipo == "Acetato de Potasio" ||
    tipo == "Agua" ||
    tipo == "Agua Vaporizada" ||
    tipo == "Clase D" ||
    tipo == "Espuma" ||
    tipo == "Polvo ABC" ||
    tipo == "Polvo BC" ||
    tipo == "Haloclean" ||
    tipo == "Halotron" ||
    tipo == "HC 36"
  ) {
    return dayjs(fecha).add(1, "year").format("YYYY-MM-DD");
  } else if (tipo == "CO2" || tipo == "FM 200" || tipo == "NOVEC 1230") {
    return dayjs(fecha).add(5, "year").format("YYYY-MM-DD");
  } else {
    return fecha;
  }
};

const calcularVencimientoPH = (tipo: any, fecha: any) => {
  if (
    tipo == "Acetato de Potasio" ||
    tipo == "Agua" ||
    tipo == "Agua Vaporizada" ||
    tipo == "Clase D" ||
    tipo == "Espuma" ||
    tipo == "Polvo ABC" ||
    tipo == "Polvo BC" ||
    tipo == "Haloclean" ||
    tipo == "Halotron" ||
    tipo == "HC 36"
  ) {
    return dayjs(fecha).add(2, "year").format("YYYY-MM-DD");
  } else if (tipo == "CO2" || tipo == "FM 200" || tipo == "NOVEC 1230") {
    return dayjs(fecha).add(5, "year").format("YYYY-MM-DD");
  } else {
    return fecha;
  }
};

const getExtintores = (req: any, res: any) => {
  if (req.query.nroin) {
    connection.query(
      `SELECT id, alias, fabricante, nro_serie, nro_iram, nro_dps, nro_control, tipo, codigo_q, q_kg, ubicacion, nro_estacion, ano_fabric, fecha_carga, fecha_ph, recargador, tel_contacto, email, infoadicional FROM extintoresin WHERE id_sector =${req.query.nroin}`,
      function (error, results, fields) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < results.length; i++) {
            results[i].ano_fabric =
              results[i].ano_fabric === "0000-00-00"
                ? null
                : dayjs(results[i].ano_fabric).format("DD/MM/YYYY");
            results[i].fecha_carga =
              results[i].fecha_carga === "0000-00-00"
                ? null
                : dayjs(results[i].fecha_carga).format("DD/MM/YYYY");
            results[i].fecha_ph =
              results[i].fecha_ph === "0000-00-00"
                ? null
                : dayjs(results[i].fecha_ph).format("DD/MM/YYYY");
          }
          res.json(results);
        }
      }
    );
  } else if (req.query.idext) {
    connection.query(
      `SELECT alias, id_sector, fabricante, nro_serie, nro_iram, nro_dps, nro_control, tipo, codigo_q, q_kg, ubicacion, nro_estacion, ano_fabric, fecha_carga, fecha_ph, recargador, tel_contacto, email, infoadicional FROM extintoresin WHERE id =${req.query.idext}`,
      function (error, results, fields) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < results.length; i++) {
            results[i].ano_fabric =
              results[i].ano_fabric === "0000-00-00"
                ? null
                : dayjs(results[i].ano_fabric).format("DD/MM/YYYY");
            results[i].fecha_carga =
              results[i].fecha_carga === "0000-00-00"
                ? null
                : dayjs(results[i].fecha_carga).format("DD/MM/YYYY");
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
      "SELECT id, alias, id_sector, fabricante, nro_serie, nro_iram, nro_dps, nro_control, tipo, codigo_q, q_kg, ubicacion, nro_estacion, ano_fabric, fecha_carga, fecha_ph, recargador, tel_contacto, email, infoadicional FROM extintoresin",
      function (error, results, fields) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < results.length; i++) {
            results[i].ano_fabric =
              results[i].ano_fabric === "0000-00-00"
                ? null
                : dayjs(results[i].ano_fabric).format("DD/MM/YYYY");
            results[i].fecha_carga =
              results[i].fecha_carga === "0000-00-00"
                ? null
                : dayjs(results[i].fecha_carga).format("DD/MM/YYYY");
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
const postExtintores = (req: any, res: any) => {
  const {
    id_sector,
    alias,
    fabricante,
    nro_serie,
    nro_iram,
    nro_dps,
    nro_control,
    tipo,
    codigo_q,
    q_kg,
    ubicacion,
    nro_estacion,
    ano_fabric,
    fecha_carga,
    fecha_ph,
    recargador,
    tel_contacto,
    email,
    infoadicional,
  } = req.body;

  connection.query(
    `INSERT INTO extintoresin 
  (
    id_sector,
    alias,
    fabricante,
    nro_serie,
    nro_iram,
    nro_dps,
    nro_control,
    tipo,
    codigo_q,
    q_kg,
    ubicacion,
    nro_estacion,
    ano_fabric,
    fecha_carga,
    fecha_ph,
    recargador,
    tel_contacto,
    email,
    infoadicional
  )
   VALUES 
  (
    ${id_sector},
    '${alias}',
    '${fabricante}',
    ${nro_serie},
    ${nro_iram},
    ${nro_dps},
    ${nro_control},
    '${tipo}',
    ${codigo_q},
    ${q_kg},
    '${ubicacion}',
    ${nro_estacion},
    '${calcularVencimientoAnoFabricacion(tipo, ano_fabric)}',
    '${calcularVencimientoCarga(tipo, fecha_carga)}',
    '${calcularVencimientoPH(tipo, fecha_ph)}',
    '${recargador}',
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

const putExtintor = (req: any, res: any) => {
  const {
    id,
    alias,
    fabricante,
    nro_serie,
    nro_iram,
    nro_dps,
    nro_control,
    tipo,
    codigo_q,
    q_kg,
    ubicacion,
    nro_estacion,
    ano_fabric,
    fecha_carga,
    fecha_ph,
    recargador,
    tel_contacto,
    email,
    infoadicional,
  } = req.body;

  connection.query(
    `UPDATE extintoresin SET
      alias = '${alias}',
      fabricante = '${fabricante}',
      nro_serie = ${nro_serie},
      nro_iram = ${nro_iram},
      nro_dps = ${nro_dps},
      nro_control = ${nro_control},
      tipo = '${tipo}',
      codigo_q = ${codigo_q},
      q_kg = ${q_kg},
      ubicacion = '${ubicacion}',
      nro_estacion = ${nro_estacion},
      '${calcularVencimientoAnoFabricacion(tipo, ano_fabric)}',
      '${calcularVencimientoCarga(tipo, fecha_carga)}',
      '${calcularVencimientoPH(tipo, fecha_ph)}',
      recargador = '${recargador}',
      tel_contacto = ${tel_contacto},
      email = '${email}',
      infoadicional = '${infoadicional}'
    WHERE id=${id}`,
    function (err, result) {
      if (err) {
        res.json({ status: err });
      } else {
        res.json({ status: "OK" });
      }
    }
  );
};

const deleteExtintor = (req: any, res: any) => {
  const { id } = req.body;
  connection.query(
    `DELETE FROM extintoresin WHERE id = ${id}`,
    function (err, result) {
      if (err) throw err;
    }
  );
  res.json({ status: "OK" });
};

const getExtintoresVencidosAno = (req: any, res: any) => {
  connection.query(
    "SELECT id, id_sector, alias, ano_fabric FROM extintoresin",
    function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        let response: any = [];
        for (let i = 0; i < results.length; i++) {          
          if ((dayjs().isAfter(dayjs(results[i].ano_fabric))) && (results[i].ano_fabric != '0000-00-00')) {
            response.push({
              id:results[i].id,
              id_sector:results[i].id,
              alias:results[i].alias
            });
          }
        }
        res.json(response);
      }
    }
  );
};

const getExtintoresProntoVencerAno = (req: any, res: any) => {
  connection.query(
    "SELECT id, id_sector, alias, ano_fabric FROM extintoresin",
    function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        let response: any = [];
        for (let i = 0; i < results.length; i++) {
          if (
            dayjs().isBetween(
              dayjs(results[i].ano_fabric).add(10, "day"),
              dayjs(results[i].ano_fabric),
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

const getExtintoresVencidosCarga = (req: any, res: any) => {
  connection.query(
    "SELECT id, id_sector, alias, fecha_carga FROM extintoresin",
    function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        let response: any = [];
        for (let i = 0; i < results.length; i++) {
          if ((dayjs().isAfter(dayjs(results[i].fecha_carga))) && (results[i].fecha_carga != '0000-00-00')) {
            response.push(results[i]);
          }
        }
        res.json(response);
      }
    }
  );
};

const getExtintoresProntoVencerCarga = (req: any, res: any) => {
  connection.query(
    "SELECT id, id_sector, alias, fecha_carga FROM extintoresin",
    function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        let response: any = [];
        for (let i = 0; i < results.length; i++) {
          if (
            dayjs().isBetween(
              dayjs(results[i].fecha_carga).add(10, "day"),
              dayjs(results[i].fecha_carga),
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

const getExtintoresVencidosPH = (req: any, res: any) => {
  connection.query(
    "SELECT id, id_sector, alias, fecha_ph FROM extintoresin",
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

const getExtintoresProntoVencerPH = (req: any, res: any) => {
  connection.query(
    "SELECT id, id_sector, alias, fecha_ph FROM extintoresin",
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
  getExtintores,
  deleteExtintor,
  putExtintor,
  postExtintores,
  getExtintoresVencidosAno,
  getExtintoresProntoVencerAno,
  getExtintoresVencidosCarga,
  getExtintoresProntoVencerCarga,
  getExtintoresVencidosPH,
  getExtintoresProntoVencerPH,
};
