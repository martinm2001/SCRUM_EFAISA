import express from "express";
const timeout = require("connect-timeout");
import cors from "cors";
import mysql from "mysql";
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
const dayjs = require("dayjs");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(
  express.urlencoded({
    extended: false,
  })
);
// parse json
app.use(express.json());
app.use(timeout("15s"));

const inout = require("./routes/inout");
const eventos = require("./routes/eventos");
const serial = require("./routes/serial");
const robo = require("./routes/robo");
const audioevac = require("./routes/audioevac");
const controlAcceso = require("./routes/controlacceso");
const general = require("./routes/general");
const tecnica = require("./routes/tecnica");
const dispositivo = require("./routes/dispositivo");
const extintores = require("./routes/extintores");
const mangueras = require("./routes/magueras");

app.use("/api/inout", inout);
app.use("/api/eventos", eventos);
app.use("/api/serial", serial);
app.use("/api/robo", robo);
app.use("/api/audioevac", audioevac);
app.use("/api/controlacceso", controlAcceso);
app.use("/api/general", general);
app.use("/api/tecnica", tecnica);
app.use("/api/dispositivo", dispositivo);
app.use("/api/extintores", extintores);
app.use("/api/mangueras", mangueras);

app.listen(5000, () => {
  console.log("Server is listening on port 5000....");
});

let connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "efaisa",
  password: "1q2w3e4r5t6y",
  database: "interfaz",
});


// //Dispositivos
let estadosDispositivos: any = [];
let estadoBatDispositivos: any = [];
// //Extintores
let extintoresVencidosAno: any = [[], []];
let extintoresProntoVencerAno: any = [[], []];
let extintoresVencidosCarga: any = [[], []];
let extintoresProntoVencerCarga: any = [[], []];
let extintoresVencidosPH: any = [[], []];
let extintoresProntoVencerPH: any = [[], []];
// //Mangueras
let manguerasVencidosInstalacion: any = [[], []];
let manguerasProntoVencerInstalacion: any = [[], []];
let manguerasVencidosPH: any = [[], []];
let manguerasProntoVencerPH: any = [[], []];

connection.connect(function (err) {
  if (err) {
    console.error("error connecting database: " + err.stack);
    return;
  }

  console.log("connected into database as id " + connection.threadId);
  let inicio: boolean = false;
  setInterval(() => {
    //   //consuta datos para telegram
    connection.query(
      "SELECT telegramToken, telegramChatID FROM infogral WHERE id = 1",
      function (error, results, fields) {
        if (error) throw error;
        const token = results[0].telegramToken;
        const chatId = results[0].telegramChatID;
        const bot = new TelegramBot(token);
        if (inicio === false) {
          inicio = true;
          bot.sendMessage(chatId, `Iniciando equipo`);
        }
        //recolecta datos de extintores para enviar telegram de vencimientos
        //parte vencidos año
        axios
          .get("http://127.0.0.1:5000/api/extintores/vencidos/ano")
          .then(function (resExtVencAno) {
            //recibi algo
            if (resExtVencAno.data.length != 0) {
              //recorro mi reporte de exintores vencidos
              for (let i = 0; i < resExtVencAno.data.length; i++) {
                //recorro mi array de exintores vencidos guardados
                let agregado: any = 0;
                for (let j = 0; j < extintoresVencidosAno[0].length; j++) {
                  if (
                    resExtVencAno.data[i].id === extintoresVencidosAno[0][j]
                  ) {
                    if (
                      dayjs().isAfter(
                        dayjs(extintoresVencidosAno[1][j]).add(3, "hour")
                      )
                    ) {
                      extintoresVencidosAno[1][j] = dayjs();
                      bot.sendMessage(
                        chatId,
                        `Extintor ${resExtVencAno.data[i].alias} IN ${resExtVencAno.data[i].id_sector} Año fabricacion caducado, Repeticion 3hs`
                      );
                      connection.query(
                        `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resExtVencAno.data[i].alias} año fabricacion caducado', 'Extintor', 1)`,
                        function (error: any, results: any, fields: any) {
                          if (error) {
                            console.log(error);
                          }
                        }
                      );
                    }
                    agregado = 1;
                  }
                }
                if (!(agregado === 1)) {
                  extintoresVencidosAno[0].push(resExtVencAno.data[i].id);
                  extintoresVencidosAno[1].push(dayjs());
                  bot.sendMessage(
                    chatId,
                    `Extintor ${resExtVencAno.data[i].alias} IN ${resExtVencAno.data[i].id_sector} Año fabricacion caducado`
                  );
                  connection.query(
                    `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resExtVencAno.data[i].alias} año fabricacion caducado', 'Extintor', 1)`,
                    function (error: any, results: any, fields: any) {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                }
              }
            }
          })
          .catch(function (error) {
            console.log("Error: Vencimiento año fabricacion extintor ", error);
          });

        // hace parte de venc año proximo
        axios
          .get("http://127.0.0.1:5000/api/extintores/prontovencer/ano")
          .then(function (resExtVencProntoAno) {
            //recibi algo
            if (resExtVencProntoAno.data.length != 0) {
              //recorro mi reporte de exintores vencidos
              for (let i = 0; i < resExtVencProntoAno.data.length; i++) {
                //recorro mi array de exintores vencidos guardados
                let agregado: any = 0;
                for (let j = 0; j < extintoresProntoVencerAno[0].length; j++) {
                  if (
                    resExtVencProntoAno.data[i].id ===
                    extintoresProntoVencerAno[0][j]
                  ) {
                    if (
                      dayjs().isAfter(
                        dayjs(extintoresProntoVencerAno[1][j]).add(3, "hour")
                      )
                    ) {
                      extintoresProntoVencerAno[1][j] = dayjs();
                      bot.sendMessage(
                        chatId,
                        `Extintor ${resExtVencProntoAno.data[i].alias} IN ${resExtVencProntoAno.data[i].id_sector} Año fabricacion caduca pronto, Repeticion 3hs`
                      );
                      connection.query(
                        `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resExtVencProntoAno.data[i].alias} año fabricacion caduca pronto', 'Extintor', 1)`,
                        function (error: any, results: any, fields: any) {
                          if (error) {
                            console.log(error);
                          }
                        }
                      );
                    }
                    agregado = 1;
                  }
                }
                if (!(agregado === 1)) {
                  extintoresProntoVencerAno[0].push(
                    resExtVencProntoAno.data[i].id
                  );
                  extintoresProntoVencerAno[1].push(dayjs());
                  bot.sendMessage(
                    chatId,
                    `Extintor ${resExtVencProntoAno.data[i].alias} IN ${resExtVencProntoAno.data[i].id_sector} Año fabricacion caduca pronto`
                  );
                  connection.query(
                    `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resExtVencProntoAno.data[i].alias} año fabricacion caduca pronto', 'Extintor', 1)`,
                    function (error: any, results: any, fields: any) {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                }
              }
            }
          })
          .catch(function (error) {
            console.log(
              "Error: Pronto vencimiento año fabricacion extintor ",
              error
            );
          });

        //parte vencidos carga
        axios
          .get("http://127.0.0.1:5000/api/extintores/vencidos/carga")
          .then(function (resExtVencCarga) {
            //recibi algo
            if (resExtVencCarga.data.length != 0) {
              //recorro mi reporte de exintores vencidos
              for (let i = 0; i < resExtVencCarga.data.length; i++) {
                //recorro mi array de exintores vencidos guardados
                let agregado: any = 0;
                for (let j = 0; j < extintoresVencidosCarga[0].length; j++) {
                  if (
                    resExtVencCarga.data[i].id === extintoresVencidosCarga[0][j]
                  ) {
                    if (
                      dayjs().isAfter(
                        dayjs(extintoresVencidosCarga[1][j]).add(3, "hour")
                      )
                    ) {
                      extintoresVencidosCarga[1][j] = dayjs();
                      bot.sendMessage(
                        chatId,
                        `Extintor ${resExtVencCarga.data[i].alias} IN ${resExtVencCarga.data[i].id_sector}  Carga caducado, Repeticion 3hs`
                      );
                      connection.query(
                        `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resExtVencCarga.data[i].alias} carga caduca pronto', 'Extintor', 1)`,
                        function (error: any, results: any, fields: any) {
                          if (error) {
                            console.log(error);
                          }
                        }
                      );
                    }
                    agregado = 1;
                  }
                }
                if (!(agregado === 1)) {
                  extintoresVencidosCarga[0].push(resExtVencCarga.data[i].id);
                  extintoresVencidosCarga[1].push(dayjs());
                  bot.sendMessage(
                    chatId,
                    `Extintor ${resExtVencCarga.data[i].alias} IN ${resExtVencCarga.data[i].id_sector}  Carga caducado caducado`
                  );
                }
              }
            }
          })
          .catch(function (error) {
            console.log("Error: Pronto vencimiento carga extintor ", error);
          });

        // hace parte de venc carga proximo
        axios
          .get("http://127.0.0.1:5000/api/extintores/prontovencer/ph")
          .then(function (resExtVencProntoCarga) {
            //recibi algo
            if (resExtVencProntoCarga.data.length != 0) {
              //recorro mi reporte de exintores vencidos
              for (let i = 0; i < resExtVencProntoCarga.data.length; i++) {
                //recorro mi array de exintores vencidos guardados
                let agregado: any = 0;
                for (
                  let j = 0;
                  j < extintoresProntoVencerCarga[0].length;
                  j++
                ) {
                  if (
                    resExtVencProntoCarga.data[i].id ===
                    extintoresProntoVencerCarga[0][j]
                  ) {
                    if (
                      dayjs().isAfter(
                        dayjs(extintoresProntoVencerCarga[1][j]).add(3, "hour")
                      )
                    ) {
                      extintoresProntoVencerCarga[1][j] = dayjs();
                      bot.sendMessage(
                        chatId,
                        `Extintor ${resExtVencProntoCarga.data[i].alias} IN ${resExtVencProntoCarga.data[i].id_sector} Carga caduca pronto, Repeticion 3hs`
                      );
                      connection.query(
                        `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resExtVencProntoCarga.data[i].alias} carga caduca pronto', 'Extintor', 1)`,
                        function (error: any, results: any, fields: any) {
                          if (error) {
                            console.log(error);
                          }
                        }
                      );
                    }
                    agregado = 1;
                  }
                }
                if (!(agregado === 1)) {
                  extintoresProntoVencerCarga[0].push(
                    resExtVencProntoCarga.data[i].id
                  );
                  extintoresProntoVencerCarga[1].push(dayjs());
                  bot.sendMessage(
                    chatId,
                    `Extintor ${resExtVencProntoCarga.data[i].alias} IN ${resExtVencProntoCarga.data[i].id_sector} Carga caduca pronto`
                  );
                  connection.query(
                    `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resExtVencProntoCarga.data[i].alias} carga caduca pronto', 'Extintor', 1)`,
                    function (error: any, results: any, fields: any) {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                }
              }
            }
          })
          .catch(function (error) {
            console.log("Error: Pronto vencimiento carga extintor ", error);
          });

        //parte vencidos Prueba Hidraulica
        axios
          .get("http://127.0.0.1:5000/api/extintores/vencidos/ph")
          .then(function (resExtVencPH) {
            //recibi algo
            if (resExtVencPH.data.length != 0) {
              //recorro mi reporte de exintores vencidos
              for (let i = 0; i < resExtVencPH.data.length; i++) {
                //recorro mi array de exintores vencidos guardados
                let agregado: any = 0;
                for (let j = 0; j < extintoresVencidosPH[0].length; j++) {
                  if (resExtVencPH.data[i].id === extintoresVencidosPH[0][j]) {
                    if (
                      dayjs().isAfter(
                        dayjs(extintoresVencidosPH[1][j]).add(3, "hour")
                      )
                    ) {
                      extintoresVencidosPH[1][j] = dayjs();
                      bot.sendMessage(
                        chatId,
                        `Extintor ${resExtVencPH.data[i].alias} IN ${resExtVencPH.data[i].id_sector}  Prueba Hidraulica caducado, Repeticion 3hs`
                      );
                      connection.query(
                        `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resExtVencPH.data[i].alias} PH caducado', 'Extintor', 1)`,
                        function (error: any, results: any, fields: any) {
                          if (error) {
                            console.log(error);
                          }
                        }
                      );
                    }
                    agregado = 1;
                  }
                }
                if (!(agregado === 1)) {
                  extintoresVencidosPH[0].push(resExtVencPH.data[i].id);
                  extintoresVencidosPH[1].push(dayjs());
                  bot.sendMessage(
                    chatId,
                    `Extintor ${resExtVencPH.data[i].alias} IN ${resExtVencPH.data[i].id_sector}  Prueba Hidraulica caducado`
                  );
                  connection.query(
                    `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resExtVencPH.data[i].alias} PH caducado', 'Extintor', 1)`,
                    function (error: any, results: any, fields: any) {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                }
              }
            }
          })
          .catch(function (error) {
            console.log(
              "Error: Pronto vencimiento Prueba Hidraulica extintor ",
              error
            );
          });

        // hace parte de venc Prueba Hidraulica proximo
        axios
          .get("http://127.0.0.1:5000/api/extintores/prontovencer/ph")
          .then(function (resExtVencProntoPH) {
            //recibi algo
            if (resExtVencProntoPH.data.length != 0) {
              //recorro mi reporte de exintores vencidos
              for (let i = 0; i < resExtVencProntoPH.data.length; i++) {
                //recorro mi array de exintores vencidos guardados
                let agregado: any = 0;
                for (let j = 0; j < extintoresProntoVencerPH[0].length; j++) {
                  if (
                    resExtVencProntoPH.data[i].id ===
                    extintoresProntoVencerPH[0][j]
                  ) {
                    if (
                      dayjs().isAfter(
                        dayjs(extintoresProntoVencerPH[1][j]).add(3, "hour")
                      )
                    ) {
                      extintoresProntoVencerPH[1][j] = dayjs();
                      bot.sendMessage(
                        chatId,
                        `Extintor ${resExtVencProntoPH.data[i].alias} IN ${resExtVencProntoPH.data[i].id_sector} Prueba Hidraulica caduca pronto, Repeticion 3hs`
                      );
                      connection.query(
                        `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resExtVencProntoPH.data[i].alias} PH caduca pronto', 'Extintor', 1)`,
                        function (error: any, results: any, fields: any) {
                          if (error) {
                            console.log(error);
                          }
                        }
                      );
                    }
                    agregado = 1;
                  }
                }
                if (!(agregado === 1)) {
                  extintoresProntoVencerPH[0].push(
                    resExtVencProntoPH.data[i].id
                  );
                  extintoresProntoVencerPH[1].push(dayjs());
                  bot.sendMessage(
                    chatId,
                    `Extintor ${resExtVencProntoPH.data[i].alias} IN ${resExtVencProntoPH.data[i].id_sector} Prueba Hidraulica caduca pronto`
                  );
                  connection.query(
                    `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resExtVencProntoPH.data[i].alias} PH caduca pronto', 'Extintor', 1)`,
                    function (error: any, results: any, fields: any) {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                }
              }
            }
          })
          .catch(function (error) {
            console.log(
              "Error: Pronto vencimiento Prueba Hidraulica extintor ",
              error
            );
          });

        //recolecta datos de manguera para enviar telegram de vencimientos
        //parte vencidos año
        axios
          .get("http://127.0.0.1:5000/api/mangueras/vencidos/ano")
          .then(function (resManVencAno) {
            //recibi algo
            if (resManVencAno.data.length != 0) {
              //recorro mi reporte de mangueras vencidos
              for (let i = 0; i < resManVencAno.data.length; i++) {
                //recorro mi array de mangueras vencidos guardados
                let agregado: any = 0;
                for (
                  let j = 0;
                  j < manguerasVencidosInstalacion[0].length;
                  j++
                ) {
                  if (
                    resManVencAno.data[i].id ===
                    manguerasVencidosInstalacion[0][j]
                  ) {
                    if (
                      dayjs().isAfter(
                        dayjs(manguerasVencidosInstalacion[1][j]).add(3, "hour")
                      )
                    ) {
                      manguerasVencidosInstalacion[1][j] = dayjs();
                      bot.sendMessage(
                        chatId,
                        `Manguera ${resManVencAno.data[i].alias} IN ${resManVencAno.data[i].id_sector} Instalacion caducado, Repeticion 3hs`
                      );
                      connection.query(
                        `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resManVencAno.data[i].alias} Instalacion caducada', 'Manguera', 1)`,
                        function (error: any, results: any, fields: any) {
                          if (error) {
                            console.log(error);
                          }
                        }
                      );
                    }
                    agregado = 1;
                  }
                }
                if (!(agregado === 1)) {
                  manguerasVencidosInstalacion[0].push(
                    resManVencAno.data[i].id
                  );
                  manguerasVencidosInstalacion[1].push(dayjs());
                  bot.sendMessage(
                    chatId,
                    `Manguera ${resManVencAno.data[i].alias} IN ${resManVencAno.data[i].id_sector} Instalacion caducado`
                  );
                  connection.query(
                    `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resManVencAno.data[i].alias} Instalacion caducada', 'Manguera', 1)`,
                    function (error: any, results: any, fields: any) {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                }
              }
            }
          })
          .catch(function (error) {
            console.log("Error: Vencimiento instalacion manguera ", error);
          });

        // hace parte de venc año proximo
        axios
          .get("http://127.0.0.1:5000/api/mangueras/prontovencer/ano")
          .then(function (resManVencProntoAno) {
            //recibi algo
            if (resManVencProntoAno.data.length != 0) {
              //recorro mi reporte de mangueras vencidos
              for (let i = 0; i < resManVencProntoAno.data.length; i++) {
                //recorro mi array de mangueras vencidos guardados
                let agregado: any = 0;
                for (
                  let j = 0;
                  j < manguerasProntoVencerInstalacion[0].length;
                  j++
                ) {
                  if (
                    resManVencProntoAno.data[i].id ===
                    manguerasProntoVencerInstalacion[0][j]
                  ) {
                    if (
                      dayjs().isAfter(
                        dayjs(manguerasProntoVencerInstalacion[1][j]).add(
                          3,
                          "hour"
                        )
                      )
                    ) {
                      manguerasProntoVencerInstalacion[1][j] = dayjs();
                      bot.sendMessage(
                        chatId,
                        `Manguera ${resManVencProntoAno.data[i].alias} IN ${resManVencProntoAno.data[i].id_sector} Instalacion caduca pronto, Repeticion 3hs`
                      );
                      connection.query(
                        `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resManVencProntoAno.data[i].alias} Instalacion caduca pronto', 'Manguera', 1)`,
                        function (error: any, results: any, fields: any) {
                          if (error) {
                            console.log(error);
                          }
                        }
                      );
                    }
                    agregado = 1;
                  }
                }
                if (!(agregado === 1)) {
                  manguerasProntoVencerInstalacion[0].push(
                    resManVencProntoAno.data[i].id
                  );
                  manguerasProntoVencerInstalacion[1].push(dayjs());
                  bot.sendMessage(
                    chatId,
                    `Manguera ${resManVencProntoAno.data[i].alias} IN ${resManVencProntoAno.data[i].id_sector} Instalacion caduca pronto`
                  );
                  connection.query(
                    `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resManVencProntoAno.data[i].alias} Instalacion caduca pronto', 'Manguera', 1)`,
                    function (error: any, results: any, fields: any) {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                }
              }
            }
          })
          .catch(function (error) {
            console.log(
              "Error: Pronto vencimiento Instalacion manguera ",
              error
            );
          });

        //parte vencidos Prueba Hidraulica
        axios
          .get("http://127.0.0.1:5000/api/mangueras/vencidos/ph")
          .then(function (resManVencPH) {
            //recibi algo
            if (resManVencPH.data.length != 0) {
              //recorro mi reporte de mangueras vencidos
              for (let i = 0; i < resManVencPH.data.length; i++) {
                //recorro mi array de mangueras vencidos guardados
                let agregado: any = 0;
                for (let j = 0; j < manguerasVencidosPH[0].length; j++) {
                  if (resManVencPH.data[i].id === manguerasVencidosPH[0][j]) {
                    if (
                      dayjs().isAfter(
                        dayjs(manguerasVencidosPH[1][j]).add(3, "hour")
                      )
                    ) {
                      manguerasVencidosPH[1][j] = dayjs();
                      bot.sendMessage(
                        chatId,
                        `Manguera ${resManVencPH.data[i].alias} IN ${resManVencPH.data[i].id_sector}  Prueba Hidraulica caducado, Repeticion 3hs`
                      );
                      connection.query(
                        `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resManVencPH.data[i].alias} PH caducado', 'Manguera', 1)`,
                        function (error: any, results: any, fields: any) {
                          if (error) {
                            console.log(error);
                          }
                        }
                      );
                    }
                    agregado = 1;
                  }
                }
                if (!(agregado === 1)) {
                  manguerasVencidosPH[0].push(resManVencPH.data[i].id);
                  manguerasVencidosPH[1].push(dayjs());
                  bot.sendMessage(
                    chatId,
                    `Manguera ${resManVencPH.data[i].alias} IN ${resManVencPH.data[i].id_sector}  Prueba Hidraulica caducado`
                  );
                  connection.query(
                    `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resManVencPH.data[i].alias} PH caducado', 'Manguera', 1)`,
                    function (error: any, results: any, fields: any) {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                }
              }
            }
          })
          .catch(function (error) {
            console.log(
              "Error: Pronto vencimiento Prueba Hidraulica manguera ",
              error
            );
          });

        // hace parte de venc Prueba Hidraulica proximo
        axios
          .get("http://127.0.0.1:5000/api/mangueras/prontovencer/ph")
          .then(function (resManVencProntoPH) {
            //recibi algo
            if (resManVencProntoPH.data.length != 0) {
              //recorro mi reporte de mangueras vencidos
              for (let i = 0; i < resManVencProntoPH.data.length; i++) {
                //recorro mi array de mangueras vencidos guardados
                let agregado: any = 0;
                for (let j = 0; j < manguerasProntoVencerPH[0].length; j++) {
                  if (
                    resManVencProntoPH.data[i].id ===
                    manguerasProntoVencerPH[0][j]
                  ) {
                    if (
                      dayjs().isAfter(
                        dayjs(manguerasProntoVencerPH[1][j]).add(3, "hour")
                      )
                    ) {
                      manguerasProntoVencerPH[1][j] = dayjs();
                      bot.sendMessage(
                        chatId,
                        `Manguera ${resManVencProntoPH.data[i].alias} IN ${resManVencProntoPH.data[i].id_sector} Prueba Hidraulica caduca pronto, Repeticion 3hs`
                      );
                      connection.query(
                        `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resManVencProntoPH.data[i].alias} PH caduca pronto', 'Manguera', 1)`,
                        function (error: any, results: any, fields: any) {
                          if (error) {
                            console.log(error);
                          }
                        }
                      );
                    }
                    agregado = 1;
                  }
                }
                if (!(agregado === 1)) {
                  manguerasProntoVencerPH[0].push(
                    resManVencProntoPH.data[i].id
                  );
                  manguerasProntoVencerPH[1].push(dayjs());
                  bot.sendMessage(
                    chatId,
                    `Manguera ${resManVencProntoPH.data[i].alias} IN ${resManVencProntoPH.data[i].id_sector} Prueba Hidraulica caduca pronto`
                  );
                  connection.query(
                    `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${resManVencProntoPH.data[i].alias} PH caduca pronto', 'Manguera', 1)`,
                    function (error: any, results: any, fields: any) {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                }
              }
            }
          })
          .catch(function (error) {
            console.log(
              "Error: Pronto vencimiento Prueba Hidraulica mangueras ",
              error
            );
          });

        //recolecta datos dispositivos
        axios
          .get("http://127.0.0.1:5000/api/dispositivo/estado")
          .then(function (res) {
            // handle success
            for (let i = 0; i < res.data.length; i++) {
              if (
                estadosDispositivos[i] != res.data[i].Estado ||
                (estadoBatDispositivos[i] = !res.data[i].Bateria)
              ) {
                estadosDispositivos[i] = res.data[i].Estado;
                estadoBatDispositivos[i] = res.data[i].Bateria;
                bot.sendMessage(
                  chatId,
                  `Dispositivo N°: ${res.data[i].Nro}, Nombre: ${res.data[i].Nombre}, Tipo: ${res.data[i].Tipo}, estado: ${res.data[i].Estado}, Bateria ${res.data[i].Bateria}`
                );
                connection.query(
                  `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${res.data[i].Nombre}', '${res.data[i].Tipo}', ${res.data[i].Estado})`,
                  function (error: any, results: any, fields: any) {
                    if (error) {
                      console.log(error);
                    }
                  }
                );
              }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
        //recorre para eventos
      }
    );
  }, 1000);
});
