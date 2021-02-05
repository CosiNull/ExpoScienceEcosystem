let camera = {
  x: 0,
  y: 0,
  speed: 40,
};

function moveCamera() {
  if (keyIsDown(LEFT_ARROW) && camera.x <= 0) {
    camera.x += camera.speed;
  }
  if (
    keyIsDown(RIGHT_ARROW) &&
    -camera.x <
      MAP_SIZE * TILE_SIZE -
        canvas.width /*mini ajustement esthetique*/ +
        TILE_SIZE * 1.5
  ) {
    camera.x -= camera.speed;
  }
  if (keyIsDown(UP_ARROW) && camera.y <= 0) {
    camera.y += camera.speed;
  }
  if (
    keyIsDown(DOWN_ARROW) &&
    -camera.y <
      MAP_SIZE * TILE_SIZE -
        canvas.height /*mini ajustement esthetique*/ +
        TILE_SIZE
  ) {
    camera.y -= camera.speed;
  }
}
function entityCollision(entity1, entity2, extraDistance = 0) {
  return (
    Math.hypot(entity1.x - entity2.x, entity1.y - entity2.y) <
    entity1.radius + entity2.radius + extraDistance
  );
}
function calculateDistance(entity1, entity2) {
  return Math.hypot(entity1.x - entity2.x, entity1.y - entity2.y);
}
function circleTouchRect(cX, cY, cR, rX, rY, rW, rH) {
  //Default values
  let testX = cX;
  let testY = cY;

  //if outside rectangle bounderies change values
  if (cX < rX) testX = rX;
  else if (cX > rX + rW) testX = rX + rW;

  if (cY < rY) testY = rY;
  else if (cY > rY + rH) testY = rY + rH;

  let distX = cX - testX;
  let distY = cY - testY;

  if (Math.sqrt(distX ** 2 + distY ** 2) <= cR) {
    return true;
  } else {
    return false;
  }
}
let populationData = {
  plants: {
    color: "green",
    population: [],
  },
  organic_waste: {
    color: "brown",
    count: [],
  },
  inorganic_nutrients: {
    color: "grey",
    count: [],
  },
};
function countPopulation() {
  populationData.plants.population.push(vegetationTree.queryAll().length);
  populationData.rabbits.population.push(animalTrees.rabbit.queryAll().length);

  populationData.blackRabbits.population.push(
    animalTrees.blackRabbit.queryAll().length
  );
  populationData.fox.population.push(animalTrees.fox.queryAll().length);

  populationData.organic_waste.count.push(organicWaste);
  populationData.inorganic_nutrients.count.push(inorganicNutrients);
}
const saveToDatabase = async (fileName = "temporaryData") => {
  if (/\.\.\//.test(fileName)) {
    console.log("bad filename");
    return;
  }
  populationData.fileName = fileName;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(populationData),
  };
  console.log("Sending");

  const response = await fetch("/saveData", options);
  const dataReceived = await response.json();
  console.log(dataReceived.status);
};

function shuffleArr(array, bond = 1) {
  for (let i = array.length - 1; i >= 0; i -= bond) {
    let swapIndex = Math.floor(Math.random() * i);

    let elm = array[i];
    let swapElm = array[swapIndex];

    array[i] = swapElm;
    array[swapIndex] = elm;
  }
  return array;
}
