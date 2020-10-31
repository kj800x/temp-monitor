export let getPressure;

if (process.env.DEPLOYED === "true") {
  getPressure = () => {
    return Math.random();
  };
} else {
  getPressure = () => {
    return Math.random();
  };
}
