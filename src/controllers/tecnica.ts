import * as osu from "node-os-utils";
import * as nodeDiskInfo from "node-disk-info";

const cpu = osu.cpu;
// const drive = osu.drive;
const mem = osu.mem;

const procesador = cpu
  .usage()
  .then((cpuPercentage: any) => {
    return `${cpuPercentage}%`;
  })
  .catch((reason: any) => {
    return reason;
  });

const memoria: any = mem
  .info()
  .then(({ usedMemPercentage, freeMemPercentage }: any) => {
    return { used: `${usedMemPercentage}%`, free: `${freeMemPercentage}%` };
  })
  .catch((reason: any) => {
    return reason;
  });

const disco = nodeDiskInfo
  .getDiskInfo()
  .then((disks: any) => {
    return disks[0]._capacity;
  })
  .catch((reason: any) => {
    return reason;
  });

const getTecnica = async (req: any, res: any) => {
  res.json({ cpu: await procesador, ram: await memoria, disk: await disco });
};

module.exports = { getTecnica };
