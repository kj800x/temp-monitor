import process from "process";
import bonescript from "bonescript";

export let setMotor;

const PWM_FREQ = 20000;
const MOTOR_PIN = "P9_14";
let value = 0;

function pwmVal = val => val === 0 ? 0 : 0.8 * val + 0.2;

if (process.env.MOTOR_ENABLED) {
  setMotor = (val) => {
    if (val === value) {
      return;
    }
    value = val;
    bonescript.analogWrite(MOTOR_PIN, value, PWM_FREQ, () => {});
  };
} else {
  console.log("info: motor not enabled");
  setMotor = () => {};
}
