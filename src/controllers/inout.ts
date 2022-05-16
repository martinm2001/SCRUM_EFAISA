import mysql from "mysql";
const connection = require("./conec");

/*const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "efaisa",
        password: "1q2w3e4r5t6y",
        database: "interfaz",
      });
*/

const getInfoIN = (req: any, res: any) => {
  if (req.query.nroin) {
    connection.query(
      `SELECT aliasIN, descIN, descINAmp, camaraurl, tipoIN, tipoINInfoAdicional FROM infoin WHERE id=${req.query.nroin}`,
      function (err, result) {
        if (err) throw err;
        res.json(result[0]);
      }
    );
  } else {
    connection.query(
      "SELECT aliasIN, descIN, descINAmp, camaraurl, tipoIN, tipoINInfoAdicional FROM infoin",
      function (err, result) {
        if (err) throw err;
        res.json(result);
      }
    );
  }
};

const getAliasIN = (req: any, res: any) => {
  if (req.query.nroin) {
    connection.query(
      `SELECT aliasIN, descIN FROM infoin WHERE id=${req.query.nroin}`,
      function (err, result) {
        if (err) throw err;
        res.json(result[0]);
      }
    );
  } else {
    connection.query(
      "SELECT aliasIN, descIN FROM infoin",
      function (err, result) {
        if (err) throw err;
        res.json(result);
      }
    );
  }
};

const postAliasIN = (req: any, res: any) => {
  if (req.query.nroin) {
    const { aliasIN, subAliasIN } = req.body;
    connection.query(
      `UPDATE infoin SET aliasIN = '${aliasIN}', descIN = '${subAliasIN}' WHERE id=${req.query.nroin}`,
      function (err, result) {
        if (err) {
          res.json({ status: "Fail" });
        } else {
          res.json({ status: "OK" });
        }
      }
    );
  }
};

const getDescIN = (req: any, res: any) => {
  if (req.query.nroin) {
    connection.query(
      `SELECT descINAmp FROM infoin WHERE id=${req.query.nroin}`,
      function (err, result) {
        if (err) throw err;
        res.json(result[0]);
      }
    );
  } else {
    connection.query("SELECT descINAmp FROM infoin", function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  }
};

const postDescIN = (req: any, res: any) => {
  if (req.query.nroin) {
    const { descripcion } = req.body;
    connection.query(
      `UPDATE infoin SET descINAmp = '${descripcion}' WHERE id=${req.query.nroin}`,
      function (err, result) {
        if (err) {
          res.json({ status: "Fail" });
        } else {
          res.json({ status: "OK" });
        }
      }
    );
  }
};

const postTipoIN = (req: any, res: any) => {
  if (req.query.nroin) {
    const { tipoIN, tipoINAdicional } = req.body;
    connection.query(
      `UPDATE infoin SET tipoIN = '${tipoIN}', tipoINInfoAdicional = '${tipoINAdicional}' WHERE id=${req.query.nroin}`,
      function (err, result) {
        if (err) {
          res.json({ status: "Fail" });
        } else {
          res.json({ status: "OK" });
        }
      }
    );
  }
};

const getCamara = (req: any, res: any) => {
  if (req.query.nroin) {
    connection.query(
      `SELECT camaraurl FROM infoin WHERE id=${req.query.nroin}`,
      function (err, result) {
        if (err) throw err;
        res.json(result[0]);
      }
    );
  } else {
    connection.query("SELECT camaraurl FROM infoin", function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  }
};

const postCamara = (req: any, res: any) => {
  if (req.query.nroin) {
    const { camaraurl } = req.body;
    connection.query(
      `UPDATE infoin SET camaraurl = '${camaraurl}' WHERE id=${req.query.nroin}`,
      function (err, result) {
        if (err) {
          res.json({ status: "Fail" });
        } else {
          res.json({ status: "OK" });
        }
      }
    );
  }
};

const getImagen = (req: any, res: any) => {
  if (req.query.nroin) {
    connection.query(
      `SELECT nombre, imagen, tipo FROM imgin WHERE id=${req.query.nroin}`,
      function (err, result) {
        if (err) throw err;
        res.json(result[0]);
      }
    );
  } else {
    connection.query(
      "SELECT nombre, imagen, tipo FROM imgin",
      function (err, result) {
        if (err) throw err;
        res.json(result);
      }
    );
  }
};

const getDesconexionIN = (req: any, res: any) => {
  if (req.query.nroin) {
    connection.query(
      `SELECT desconexion FROM infoin WHERE id=${req.query.nroin}`,
      function (err, result) {
        if (err) throw err;
        res.json(result[0]);
      }
    );
  } else {
    connection.query("SELECT desconexion FROM infoin", function (err, result) {
      if (err) throw err;
      let resultado: Number[] = [];
      for (let i = 0; i < result.length; i++) {
        resultado.push(result[i].desconexion);
      }
      res.json(resultado);
    });
  }
};

const putDesconexionIN = (req: any, res: any) => {
  const { entrada, valor } = req.body;
  connection.query(
    `UPDATE infoin SET desconexion = ${valor}  WHERE id=${entrada}`,
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
  getInfoIN,
  getAliasIN,
  postAliasIN,
  getDescIN,
  postDescIN,
  postTipoIN,
  getCamara,
  postCamara,
  getImagen,
  getDesconexionIN,
  putDesconexionIN,
};
