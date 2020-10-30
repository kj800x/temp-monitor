let target = 0;
let limit = 0;

export const setTarget = (value) => {
  target = value;
};
export const setLimit = (value) => {
  limit = value;
};

export const getState = () => {
  return {
    time: new Date().getTime(),
    pressure: Math.random(),
    status: Math.random() * 0.6 + 0.1,
    motor: Math.random() * 0.2 + 0.4,
    target,
    limit,
  };
};
