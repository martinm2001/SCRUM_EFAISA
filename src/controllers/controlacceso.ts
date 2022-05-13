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
