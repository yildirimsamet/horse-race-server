exports.getRandomNumberInRange = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

exports.generateRandomHexColor = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
};

const calculateMs = ({ value, min, optimal, max, minMs, maxMs }) => {
  let howFarFromOptimalPercentage = 0;

  if (value === optimal) {
    return minMs;
  } else if (value < optimal) {
    howFarFromOptimalPercentage =
      (100 * Math.abs(value - optimal)) / Math.abs(optimal - min);
  } else {
    howFarFromOptimalPercentage =
      (100 * Math.abs(value - optimal)) / Math.abs(max - optimal);
  }

  return (howFarFromOptimalPercentage * (maxMs - minMs) + 100 * minMs) / 100;
};

const randomizeNumber = ({number, randomizePercentage}) => {
  const maxNumber = number + number * (randomizePercentage / 100);
  const minNumber = number - number * (randomizePercentage / 100);

  return getRandomArbitrary(minNumber, maxNumber);
}

const getRandomArbitrary = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
}

exports.calculateResults = ({horses,users,totalPrice}) =>{
  const sortedHorses = horses
  .map((horse) => {
    let speed = 0;
    speed += randomizeNumber({
      number: calculateMs({
        value: horse.age,
        min: 1,
        optimal: 4,
        max: 10,
        minMs: 2500,
        maxMs: 3500,
      }),
      randomizePercentage: 5,
    });
    
    speed += randomizeNumber({
      number: calculateMs({
        value: horse.satiety,
        min: 0,
        optimal: 80,
        max: 100,
        minMs: 2500,
        maxMs: 3000,
      }),
      randomizePercentage: 15,
    });
    
    speed += randomizeNumber({
      number: calculateMs({
        value: horse.level,
        min: 1,
        optimal: 3,
        max: 4,
        minMs: 2500,
        maxMs: 3000,
      }),
      randomizePercentage: 15,
    });
    
    speed += randomizeNumber({
      number: calculateMs({
        value: horse.weight,
        min: 300,
        optimal: 300,
        max: 1000,
        minMs: 2500,
        maxMs: 3000,
      }),
      randomizePercentage: 15,
    });
    
    speed += randomizeNumber({
      number: calculateMs({
        value: horse.fatRatio,
        min: 1,
        optimal: 4,
        max: 20,
        minMs: 2500,
        maxMs: 3000,
      }),
      randomizePercentage: 15,
    });
    

    horse.speed = speed;
    return horse;
  })
  .sort((horse1, horse2) => {
    return horse1.speed - horse2.speed;
  });

const calculatePrice = ({ sortedHorses, users, totalPrice }) => {
  if (horses.length <= 3) {
    users.find((user) => user.id === sortedHorses[0].ownerId).winPrice =
      totalPrice;
  } else if (horses.length === 4) {
    users.find((user) => user.id === sortedHorses[0].ownerId).winPrice =
      totalPrice * 0.7;
    users.find((user) => user.id === sortedHorses[1].ownerId).winPrice =
      totalPrice * 0.3;
  } else {
    users.find((user) => user.id === sortedHorses[0].ownerId).winPrice =
      totalPrice * 0.6;
    users.find((user) => user.id === sortedHorses[1].ownerId).winPrice =
      totalPrice * 0.3;
    users.find((user) => user.id === sortedHorses[2].ownerId).winPrice =
      totalPrice * 0.1;
  }
};
calculatePrice({sortedHorses,users,totalPrice})

return [sortedHorses, users];
}