console.log("using real pressure method");

import * as i2c from "i2c-bus";

const I2C_ADDR = 0x18;
const I2C_DEVICE = 2;

// https://github.com/adafruit/Adafruit_MPRLS/blob/master/Adafruit_MPRLS.cpp#L122
const READ_PRESSURE = 0xaa;

// https://github.com/adafruit/Adafruit_MPRLS/blob/master/Adafruit_MPRLS.h#L27-L31
const STATUS_POWERED = 0x40;
const STATUS_BUSY = 0x20;
const STATUS_FAILED = 0x04;
const STATUS_MATHSAT = 0x01;

const PSI_MIN = 0;
const PSI_MAX = 25;
const PSI_TO_HPA = 68.947572932;

let latestPressure = 0;

async function readStatus(bus) {
  const buffer = Buffer.alloc(1);
  // console.log(buffer);
  const result = await bus.i2cRead(I2C_ADDR, 1, buffer);
  // console.log(buffer);
  // console.log(result);
  return result;
}

async function assertStatus(bus) {
  let status;
  do {
    status = await readStatus(bus);
    // console.log(status);
  } while (status.buffer[0] & STATUS_POWERED);

  const statusResult = await readStatus(bus);
  if (statusResult.bytesRead !== 1) {
    throw new Error("Unable to read status byte");
  }
  if (statusResult.buffer[0] !== 0b10011110) {
    throw new Error(
      `Status byte was unexpected. Expected 0b10011110 (158), but received ${statusResult.buffer[0]}`
    );
  }
}

async function awaitNonBusyStatus(bus) {
  let status;
  do {
    status = await readStatus(bus);
  } while (status.buffer[0] & STATUS_BUSY);
}

async function readData(bus) {
  await bus.i2cWrite(I2C_ADDR, 3, new Buffer([READ_PRESSURE, 0, 0]));

  await awaitNonBusyStatus(bus);

  const buffer = Buffer.alloc(4);
  await bus.i2cRead(I2C_ADDR, 4, buffer);

  const resultStatus = buffer[0];
  if (resultStatus & STATUS_MATHSAT) {
    console.warn("MATHSAT");
    return 0xffffffff;
  }
  if (resultStatus & STATUS_FAILED) {
    console.warn("FAILED");
    return 0xffffffff;
  }

  let ret = 0;
  ret |= buffer[1];
  ret <<= 8;
  ret |= buffer[2];
  ret <<= 8;
  ret |= buffer[3];
  return ret;
}

// https://github.com/adafruit/Adafruit_MPRLS/blob/master/Adafruit_MPRLS.cpp#L99-L112
function convertToPressure(data) {
  if (data === 0xffffffff) {
    return {
      error: true,
      psi: NaN,
      hpa: NaN,
    };
  }

  let psi = (data - 0x19999a) * (PSI_MAX - PSI_MIN);
  psi /= 0xe66666 - 0x19999a;
  psi += PSI_MIN;
  return { error: false, psi, hpa: psi * PSI_TO_HPA };
}

async function main() {
  const bus = await i2c.openPromisified(I2C_DEVICE);

  // await assertStatus(bus);

  while (true) {
    const data = await readData(bus);
    latestPressure = convertToPressure(data).psi;
  }
}

export const getPressure = () => {
  return latestPressure;
};

function start() {
  main().catch((err) => {
    console.error(err);
    latestPressure = 0;
    setTimeout(start, 1000)
  })
}

start();
