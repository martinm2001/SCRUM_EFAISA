import mysql from "mysql";
import EventEmitter from "events";
import serialPort from "serialport";
import TelegramBot from "node-telegram-bot-api";

const dayjs = require("dayjs");
const connection = require("./conec");

/*const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "efaisa",
        password: "1q2w3e4r5t6y",
        database: "interfaz",
      });
*/
const { eventosManuales } = require("./eventos");

const event = new EventEmitter();
// RPI "/dev/ttyS0" 
const uart = new serialPort("COM15", {
  baudRate: 115200,
});
interface dataSerial {
  type: string;
  data: number[];
}

interface telegram {
  telegramToken: string;
  telegramChatID: string;
}

interface evento {
  id: number;
  nombreEvento: string;
  entrada: number;
  tiempoin: number;
  salida: number;
  tiempoout: number;
}

interface eventosCurso {
  activo: boolean;
  entrada: number;
  tiempoEmpezar: Date;
  salida: number;
  tiempoEnCurso: Date;
}

interface audioEvacuacion {
  activado: number;
  entrada1: number;
  entrada2: number;
  tiempoEntradas: number;
  tiempoSalida: number;
}

// interface audioEvacuacionCurso {
//   activo: boolean;
//   entrada1: number;
//   entrada2: number;
//   tiempoEmpezar: Date;
//   tiempoEnCurso: Date;
// }

interface Robo {
  activado: number;
  retardoIN1: number;
  retardoOUT3: number;
  cruzadoAct: number;
  cruzado1: number;
  cruzado2: number;
}

interface roboCurso {
  activo: boolean;
  enCurso: boolean;
  tiempoEmpezar: Date;
  tiempoEnCurso: Date;
}

let entradas: dataSerial;
let salidas: dataSerial;
let fuente: dataSerial;
let antfuente: any[] = [];
let eventosEnCurso: eventosCurso[] = [];
let audioEvacEnCurso: audioEvacuacion;
let roboEnCurso: roboCurso;
let estadosAceptados: number = 0;

const parser = uart.pipe(new serialPort.parsers.Delimiter({ delimiter: "\n" }));

event.on("readinputs", (response) => {
  //hay que invertir los que estan seleccionado como tipo de uso robo

  getTipoIN().then((tipoin) => {
    for (let i = 0; i < tipoin.length; i++) {
      if (response.data[tipoin[i]] === 1) {
        response.data[tipoin[i]] = 0;
      } else {
        response.data[tipoin[i]] = 1;
      }
    }

    if (entradas === undefined || estadosAceptados === 0) {
      entradas = response;
      estadosAceptados = 1
    } else {
      for (let i = 0; i < response.data.length; i++) {
        if (1 === entradas.data[i] && 1 != response.data[i]) {
          entradas.data[i] = response.data[i];
        }
      }
    }
  });
});
event.on("readoutputs", (response) => {
  salidas = response;
});
event.on("readfuente", (response) => {
  fuente = response;
});

const writeSerial = (input: String) => {
  return new Promise(() => {
    uart.write(input + "\n", (err) => {
      if (err) {
        console.log("uart write error", err);
      }
    });
  });
};

const initTelegram = () => {
  return new Promise<telegram>(async (resolve) => {
    connection.query(
      "SELECT telegramToken, telegramChatID FROM infogral WHERE id = 1",
      function (error: any, results: any, fields: any) {
        if (error) {
          console.log(error);
        } else {
          const telegramData: telegram = {
            telegramToken: results[0].telegramToken,
            telegramChatID: results[0].telegramChatID,
          };
          return resolve(telegramData);
        }
      }
    );
  });
};

const getTipoIN = () => {
  return new Promise<[]>(async (resolve) => {
    connection.query(
      "SELECT id FROM infoin WHERE tipoIN = 'Robo'",
      function (error: any, results: any, fields: any) {
        if (error) {
          console.log(error);
        } else {
          const output = results.map((results: { id: number }) => {
            return results.id - 1;
          });
          return resolve(output);
        }
      }
    );
  });
};

const getURLIN = (nroin: number) => {
  return new Promise<string>(async (resolve) => {
    connection.query(
      `SELECT camaraurl FROM infoin WHERE id = ${nroin}`,
      function (error: any, results: any, fields: any) {
        if (error) {
          console.log(error);
        } else {
          const output = results.map((results: { camaraurl: string }) => {
            return results.camaraurl;
          });
          return resolve(output[0]);
        }
      }
    );
  });
};

const getEventos = () => {
  return new Promise<evento[]>(async (resolve) => {
    connection.query(
      "SELECT id, nombreEvento, entrada, tiempoin, salida, tiempoout FROM eventos",
      function (error: any, results: any, fields: any) {
        if (error) {
          console.log(error);
        } else {
          return resolve(results);
        }
      }
    );
  });
};

const getAudioEvacuacion = () => {
  return new Promise<audioEvacuacion>(async (resolve) => {
    connection.query(
      "SELECT activado, entrada1, entrada2, tiempoEntradas, tiempoSalida FROM audioevac",
      function (error: any, results: any, fields: any) {
        if (error) {
          console.log(error);
        } else {
          return resolve(results[0]);
        }
      }
    );
  });
};
const getRobo = () => {
  return new Promise<Robo>(async (resolve) => {
    connection.query(
      "SELECT activado, retardoIN1, retardoOUT3, cruzadoAct, cruzado1, cruzado2 FROM eventosrobo",
      function (error: any, results: any, fields: any) {
        if (error) {
          console.log(error);
        } else {
          return resolve(results[0]);
        }
      }
    );
  });
};

parser.on("data", (data: any) => {
  const datos = data.toString();
  // console.log('datos micro', datos);

  try {
    const separados = datos.split(":");
    const dataArray = separados[1].split(",").map(Number);
    const response = {
      type: separados[0],
      data: dataArray,
    };
    if (response.type == "IN") {
      event.emit("readinputs", response);
    }
    if (response.type == "OUT") {
      event.emit("readoutputs", response);
    }
    if (response.type == "FUENTE") {
      event.emit("readfuente", response);
    }
  } catch (error) {
    console.log(error);
  }
}); // emits data after every '\n'

const consultasSerie: string[] = ["readinputs", "readoutputs", "readfuente"];
let iteradorConsultas: number = 0;
let consultasSerieVar: string[] = [];
//NO TOCAR INTERVALO DE CONSULTAS
setInterval(() => {
  if (iteradorConsultas >= consultasSerie.length) {
    iteradorConsultas = 0;
  } else if (consultasSerieVar.length != 0) {
    writeSerial(consultasSerieVar[0]);
    consultasSerieVar.shift();
  } else {
    writeSerial(consultasSerie[iteradorConsultas]);
    iteradorConsultas = iteradorConsultas + 1;
  }
}, 750);

const getEntradas = (req: any, res: any) => {
  res.json(entradas);
};

const getSalidas = (req: any, res: any) => {
  res.json(salidas);
};

const getFuente = (req: any, res: any) => {
  // [0] 220
  // [1] niv_bateria
  // [2] F_GND
  res.json(fuente);
};

const putAceptacion = (req: any, res: any) => {
  estadosAceptados = 0;  
  res.json({ status: "OK" });
};

initTelegram().then((dataTelegram: telegram) => {
  const bot = new TelegramBot(dataTelegram.telegramToken);
  setInterval(() => {
    //obtengo los eventos (adicionar robo y audioevacuacion)
    getAudioEvacuacion().then((dataAudioEvac) => {
      getRobo().then((dataRobo) => {
        //parte audio evac
        if (dataAudioEvac.activado === 1) {
          if (
            entradas.data[dataAudioEvac.entrada1 - 1] === 0 &&
            entradas.data[dataAudioEvac.entrada2 - 1] === 0
          ) {
            if (
              audioEvacEnCurso === undefined ||
              audioEvacEnCurso.activado === 2
            ) {
              audioEvacEnCurso = {
                activado: 0,
                entrada1: dataAudioEvac.entrada1,
                entrada2: dataAudioEvac.entrada2,
                tiempoEntradas: dayjs().add(
                  dataAudioEvac.tiempoEntradas,
                  "second"
                ),
                tiempoSalida: dayjs().add(
                  dataAudioEvac.tiempoEntradas + dataAudioEvac.tiempoSalida,
                  "second"
                ),
              };
            } else {
              if (
                audioEvacEnCurso.activado === 0 &&
                dayjs().isAfter(dayjs(audioEvacEnCurso.tiempoEntradas))
              ) {
                audioEvacEnCurso.activado = 1;
                consultasSerieVar.push(`writeRele4,1`);
                bot.sendMessage(
                  dataTelegram.telegramChatID,
                  `Audio evacuacion Activado, Condicion (entrada ${audioEvacEnCurso.entrada1} y ${audioEvacEnCurso.entrada2}), por (${dataAudioEvac.tiempoEntradas}s) salida 4: activada por (${dataAudioEvac.tiempoSalida}s)`
                );
                connection.query(
                  "INSERT INTO reporte (nombre, tipo, valor) VALUES ('Audio Evacuacion', 'AE', 1)",
                  function (error: any, results: any, fields: any) {
                    if (error) {
                      console.log(error);
                    }
                  }
                );
              }
            }
          } else if (audioEvacEnCurso != undefined) {
            if (
              audioEvacEnCurso.activado === 1 &&
              dayjs().isAfter(dayjs(audioEvacEnCurso.tiempoSalida))
            ) {
              bot.sendMessage(
                dataTelegram.telegramChatID,
                "Audio evacuacion Desactivado"
              );
              connection.query(
                "INSERT INTO reporte (nombre, tipo, valor) VALUES ('Audio Evacuacion', 'AE', 0)",
                function (error: any, results: any, fields: any) {
                  if (error) {
                    console.log(error);
                  }
                }
              );
              consultasSerieVar.push(`writeRele4,0`);
              audioEvacEnCurso.activado = 2;
            }
          }
        }
        //parte robo
        if (dataRobo.activado === 1) {
          if (
            entradas.data[0] === 0 &&
            (roboEnCurso === undefined ||
              (roboEnCurso.activo === false && roboEnCurso.enCurso === false))
          ) {
            roboEnCurso = {
              activo: true,
              enCurso: false,
              tiempoEmpezar: dayjs().add(dataRobo.retardoIN1, "second"),
              tiempoEnCurso: dayjs().add(
                dataRobo.retardoIN1 + dataRobo.retardoOUT3,
                "second"
              ),
            };
          } else if (
            roboEnCurso != undefined &&
            entradas.data[0] === 1 &&
            roboEnCurso.activo === true &&
            roboEnCurso.enCurso === false
          ) {
            roboEnCurso.activo = false;
          }
          if (roboEnCurso != undefined) {
            if (
              roboEnCurso.activo === true &&
              roboEnCurso.enCurso === false &&
              dayjs().isAfter(dayjs(roboEnCurso.tiempoEmpezar))
            ) {
              roboEnCurso.enCurso = true;
              consultasSerieVar.push(`writeRele3,1`);
              bot.sendMessage(
                dataTelegram.telegramChatID,
                `Robo: Activado (entrada 1) por ${dataRobo.retardoIN1}s, salida 3 estado: activada por ${dataRobo.retardoOUT3}s)`
              );
              connection.query(
                "INSERT INTO reporte (nombre, tipo, valor) VALUES ('Robo', 'Robo', 1)",
                function (error: any, results: any, fields: any) {
                  if (error) {
                    console.log(error);
                  }
                }
              );
            }
            if (
              roboEnCurso.activo === false &&
              roboEnCurso.enCurso === false &&
              entradas.data[dataRobo.cruzado1 - 1] === 0 &&
              entradas.data[dataRobo.cruzado2 - 1] === 0
            ) {
              roboEnCurso.activo = true;
              roboEnCurso.enCurso = true;
              roboEnCurso.tiempoEnCurso = dayjs().add(
                dataRobo.retardoOUT3,
                "second"
              );
              consultasSerieVar.push(`writeRele3,1`);
              bot.sendMessage(
                dataTelegram.telegramChatID,
                `Robo: Activado (Robo: Activado (${dataRobo.cruzado1} y ${dataRobo.cruzado2}, salida 3 estado: activada por ${dataRobo.retardoOUT3}s))`
              );
              connection.query(
                "INSERT INTO reporte (nombre, tipo, valor) VALUES ('Robo', 'Robo', 1)",
                function (error: any, results: any, fields: any) {
                  if (error) {
                    console.log(error);
                  }
                }
              );
            }
            // para desactivar
            if (
              roboEnCurso.enCurso === true &&
              dayjs().isAfter(dayjs(roboEnCurso.tiempoEnCurso))
            ) {
              consultasSerieVar.push(`writeRele3,0`);
              bot.sendMessage(dataTelegram.telegramChatID, `Robo Desactivado`);
              connection.query(
                "INSERT INTO reporte (nombre, tipo, valor) VALUES ('Robo', 'Robo', 0)",
                function (error: any, results: any, fields: any) {
                  if (error) {
                    console.log(error);
                  }
                }
              );
              roboEnCurso.activo = false;
              roboEnCurso.enCurso = false;
            }
          }
        }
        //parte eventos
        getEventos().then((dataEventos: evento[]) => {
          //recorro las entradas en busca de eventos
          for (let i = 0; i < dataEventos.length; i++) {
            const { id, nombreEvento, entrada, tiempoin, salida, tiempoout } =
              dataEventos[i];
            if (
              (entradas.data[dataEventos[i].entrada - 1] === 0 ||
                eventosManuales[dataEventos[i].id] === 1) &&
              !(dataAudioEvac.activado === 1 && dataEventos[i].salida === 4) &&
              !(dataRobo.activado === 1 && dataEventos[i].salida === 3)
            ) {
              if (eventosEnCurso[id] === undefined) {
                eventosEnCurso[id] = {
                  activo: false,
                  entrada: entrada,
                  tiempoEmpezar: dayjs().add(tiempoin, "second"),
                  salida: salida,
                  tiempoEnCurso: dayjs().add(tiempoin + tiempoout, "second"),
                };
              } else {
                if (
                  (dayjs().isAfter(dayjs(eventosEnCurso[id].tiempoEmpezar)) &&
                    eventosEnCurso[id].activo === false) ||
                  eventosManuales[dataEventos[i].id] === 1
                ) {
                  eventosEnCurso[id].activo = true;

                  consultasSerieVar.push(`writeRele${salida},1`);
                  if (eventosManuales[dataEventos[i].id] === 1) {
                    bot.sendMessage(
                      dataTelegram.telegramChatID,
                      `Evento: ${nombreEvento} Activado (MANUAL , salida ${salida} activada por ${tiempoout}s)`
                    );
                    connection.query(
                      `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${nombreEvento}', 'Evento M', 1)`,
                      function (error: any, results: any, fields: any) {
                        if (error) {
                          console.log(error);
                        }
                      }
                    );
                    delete eventosManuales[dataEventos[i].id];
                  } else {
                    getURLIN(entrada).then((urlcamara) => {
                      bot.sendMessage(
                        dataTelegram.telegramChatID,
                        `Evento: ${nombreEvento} Activado (entrada ${entrada} activada por ${tiempoin}s, salida ${salida} activada por ${tiempoout}s)\n${urlcamara}`
                      );
                      connection.query(
                        `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${nombreEvento}', 'Evento', 1)`,
                        function (error: any, results: any, fields: any) {
                          if (error) {
                            console.log(error);
                          }
                        }
                      );
                    });
                  }
                }
              }
            } else if (
              eventosEnCurso[id] != undefined &&
              eventosEnCurso[id].activo === false
            ) {
              delete eventosEnCurso[id];
            }
            if (eventosEnCurso[id] != undefined) {
              if (
                (dayjs().isAfter(dayjs(eventosEnCurso[id].tiempoEnCurso)) &&
                  eventosEnCurso[id].activo === true) ||
                eventosManuales[dataEventos[i].id] === 0
              ) {
                consultasSerieVar.push(`writeRele${salida},0`);
                if (eventosManuales[dataEventos[i].id] === 0) {
                  bot.sendMessage(
                    dataTelegram.telegramChatID,
                    `Evento: ${nombreEvento} Desactivado manual`
                  );
                  connection.query(
                    `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${nombreEvento}', 'Evento M', 0)`,
                    function (error: any, results: any, fields: any) {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                  delete eventosManuales[dataEventos[i].id];
                } else {
                  bot.sendMessage(
                    dataTelegram.telegramChatID,
                    `Evento: ${nombreEvento} Desactivado`
                  );
                  connection.query(
                    `INSERT INTO reporte (nombre, tipo, valor) VALUES ('${nombreEvento}', 'Evento', 0)`,
                    function (error: any, results: any, fields: any) {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                }
                delete eventosEnCurso[id];
              }
            }
          }
        });
      });
    });
    //parte fuente
    try {
      if (fuente.data[0] != antfuente[0]) {
        if (fuente.data[0] === 1) {
          bot.sendMessage(dataTelegram.telegramChatID, `Alimentacion, OK`);
          connection.query(
            "INSERT INTO reporte (nombre, tipo, valor) VALUES ('Alimentacion OK', 'Sistema', 1)",
            function (error: any, results: any, fields: any) {
              if (error) {
                console.log(error);
              }
            }
          );
        } else {
          bot.sendMessage(dataTelegram.telegramChatID, `Alimentacion, Falla`);
          connection.query(
            "INSERT INTO reporte (nombre, tipo, valor) VALUES ('Alimentacion Falla', 'Sistema', 0)",
            function (error: any, results: any, fields: any) {
              if (error) {
                console.log(error);
              }
            }
          );
        }
        antfuente[0] = fuente.data[0];
      }
      if (fuente.data[1] != antfuente[1]) {
        if (fuente.data[1] === 0) {
          bot.sendMessage(dataTelegram.telegramChatID, `Bateria, Falla`);
          connection.query(
            "INSERT INTO reporte (nombre, tipo, valor) VALUES ('Bateria Falla', 'Sistema', 0)",
            function (error: any, results: any, fields: any) {
              if (error) {
                console.log(error);
              }
            }
          );
        } else if (fuente.data[1] === 1) {
          bot.sendMessage(dataTelegram.telegramChatID, `Bateria, 25%`);
          connection.query(
            "INSERT INTO reporte (nombre, tipo, valor) VALUES ('Bateria 25%', 'Sistema', 25)",
            function (error: any, results: any, fields: any) {
              if (error) {
                console.log(error);
              }
            }
          );
        } else if (fuente.data[1] === 2) {
          bot.sendMessage(dataTelegram.telegramChatID, `Bateria, 50%`);
          connection.query(
            "INSERT INTO reporte (nombre, tipo, valor) VALUES ('Bateria 50%', 'Sistema', 50)",
            function (error: any, results: any, fields: any) {
              if (error) {
                console.log(error);
              }
            }
          );
        } else if (fuente.data[1] === 3) {
          bot.sendMessage(dataTelegram.telegramChatID, `Bateria, 75%`);
          connection.query(
            "INSERT INTO reporte (nombre, tipo, valor) VALUES ('Bateria 75%', 'Sistema', 75)",
            function (error: any, results: any, fields: any) {
              if (error) {
                console.log(error);
              }
            }
          );
        } else if (fuente.data[1] === 4) {
          bot.sendMessage(dataTelegram.telegramChatID, `Bateria, 100%`);
          connection.query(
            "INSERT INTO reporte (nombre, tipo, valor) VALUES ('Bateria 100%', 'Sistema', 100)",
            function (error: any, results: any, fields: any) {
              if (error) {
                console.log(error);
              }
            }
          );
        }
        antfuente[1] = fuente.data[1];
      }
      if (fuente.data[2] === 1) {
        if (fuente.data[2] != antfuente[2]) {
          bot.sendMessage(dataTelegram.telegramChatID, `Derivacion Tierra`);
          connection.query(
            "INSERT INTO reporte (nombre, tipo, valor) VALUES ('Derivacion Tierra', 'Sistema', 1)",
            function (error: any, results: any, fields: any) {
              if (error) {
                console.log(error);
              }
            }
          );
          antfuente[2] = fuente.data[2];
        }
      }
    } catch {
      console.log("Error leyendo fuente");
    }
  }, 1000);
});

module.exports = { getEntradas, getSalidas, getFuente, putAceptacion };
