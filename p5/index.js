let c;
//Seed js
let SEED = 23049; //12
let TERRAIN;
let FPS = 30;

function playMusic() {
  let music = new Audio();
  music.src = "../musics/music.mp3";
  music.loop = true;
  music.play();
}

const creationTime = new Date().getTime();
let pause = {
  start: 0,
  total: 0,
};
let runSimulation = true;
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    runSimulation = true;
    pause.total += new Date().getTime() - pause.start;
    console.log(`Joined at ${(new Date().getTime() - creationTime) / 1000}`);
  } else {
    runSimulation = false;
    pause.start = new Date().getTime();
    console.log(`Departed at ${(new Date().getTime() - creationTime) / 1000}`);
  }
});

function setup() {
  c = createCanvas(window.innerWidth, window.innerHeight).drawingContext;
  TERRAIN = generateTerrain(SEED);
  generatePlants();
  generateAnimals();

  //playMusic();

  frameRate(FPS);

  noStroke();

  setInterval(() => {
    moveCamera();
  }, 65);

  countPopulation();
  setInterval(() => {
    if (runSimulation) {
      updateAnimalTrees();
      countPopulation();
    }
  }, 2500);

  setInterval(() => {
    if (runSimulation) {
      let initialE = inorganicNutrients;

      updateVegetation();

      let finalE = inorganicNutrients;
      let diff = initialE - finalE;

      if (
        diff < finalE &&
        new Date().getTime() - pause.total - creationTime > 55000
      ) {
        inorganicNutrients -= (diff - finalE) ** 2 / 10000;
      }

      let transferEnergy = compostPercentage * organicWaste;
      if (transferEnergy >= organicWaste && organicWaste >= 0) {
        console.error("transfer energy is bigger");
      }

      inorganicNutrients += transferEnergy;
      organicWaste -= transferEnergy;

      if (organicWaste < 0) {
        console.error("Oh no Compost");
      }

      inorganicNutrients += transferEnergy;
      organicWaste -= transferEnergy;

      if (organicWaste < 0) {
        console.error("Oh no Compost");
      }

      inorganicNutrients += transferEnergy;
      organicWaste -= transferEnergy;

      if (organicWaste < 0) {
        console.error("Oh no Compost");
      }
    }
  }, 1000);

  setInterval(() => {
    if (runSimulation) {
      updateAnimals();
    }
  }, 32);
  //setInterval(() => {
  //
  //}, 3000);
}

function draw() {
  if (runSimulation) {
    background(0, 0, 0);
    fill(255, 0, 0);

    //Terrain
    drawTerrain(TERRAIN);

    //Vegetation and animals
    drawEntities();
  }
}
