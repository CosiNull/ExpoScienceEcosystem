//Generating plants
function generatePlants() {
  for (let i = 0; i < 300; i++) {
    let index = Math.floor(Math.random() * terrainTypes.grass.length);
    let coordinates = {
      x: terrainTypes.grass[index][0] + TILE_SIZE * Math.random(),
      y: terrainTypes.grass[index][1] + TILE_SIZE * Math.random(),
    };

    let age = Math.floor(Math.random() * 20);
    vegetationTree.insert(
      coordinates.x,
      coordinates.y,
      new Vegetation(coordinates.x, coordinates.y, age, age + 1)
    );
    inorganicNutrients -= age + 1;
  }
}
//Drawing all entities
function drawEntities() {
  let arr = vegetationTree.queryAABB(
    -camera.x,
    -camera.y,
    canvas.width,
    canvas.height
  );
  for (let i = arr.length - 1; i >= 0; i--) {
    arr[i].draw(Math.random());
  }

  for (let tree in animalTrees) {
    arr = animalTrees[tree].queryAABB(
      -camera.x,
      -camera.y,
      canvas.width,
      canvas.height
    );
    for (let i = arr.length - 1; i >= 0; i--) {
      arr[i].draw();
    }
  }
}
//Updating
function updateVegetation() {
  let deleteElements = false;
  let arr = vegetationTree.queryAll();
  arr = shuffleArr(arr, 2);
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].update()) {
      deleteElements = true;
    }
  }
  if (deleteElements) {
    vegetationTree.deleteDeadElements();
  }
}
//Animals
//Generation
function generateAnimals() {
  //Rabbit
  /*
    for (let i = 0; i < 40; i++) {
      let index = Math.floor(Math.random() * terrainTypes.grass.length);
      let coordinates = {
        x: terrainTypes.grass[index][0] + TILE_SIZE * Math.random(),
        y: terrainTypes.grass[index][1] + TILE_SIZE * Math.random(),
      };
      animals.push(new Rabbit(coordinates.x, coordinates.y, Math.random() + 2));
    }
    */
  for (let i = 0; i < 90; i++) {
    let index = Math.floor(Math.random() * terrainTypes.grass.length);
    let coordinates = {
      x: terrainTypes.grass[index][0] + TILE_SIZE * Math.random(),
      y: terrainTypes.grass[index][1] + TILE_SIZE * Math.random(),
    };

    animalTrees.rabbit.insert(
      coordinates.x,
      coordinates.y,
      new Rabbit(coordinates.x, coordinates.y, Math.random() * 2 + 1)
    );
    inorganicNutrients -= 6;
  }
  populationData.rabbits = {
    color: "yellow",
    population: [],
  };

  //let test = new BlackRabbit(100, 100, Math.random() * 2 + 1);
  ////test.genes.color = "black";
  //animalTrees.blackRabbit.insert(100, 100, test);

  for (let i = 0; i < 90; i++) {
    let index = Math.floor(Math.random() * terrainTypes.grass.length);
    let coordinates = {
      x: terrainTypes.grass[index][0] + TILE_SIZE * Math.random(),
      y: terrainTypes.grass[index][1] + TILE_SIZE * Math.random(),
    };

    animalTrees.blackRabbit.insert(
      coordinates.x,
      coordinates.y,
      new BlackRabbit(coordinates.x, coordinates.y, Math.random() * 2 + 1)
    );
    inorganicNutrients -= 6;
  }
  populationData.blackRabbits = {
    color: "black",
    population: [],
  };

  //let test = new Fox(100, 100, Math.random() * 2 + 1);
  ////test.genes.color = "orange";
  //animalTrees.fox.insert(100, 100, test);

  for (let i = 0; i < 12; i++) {
    let index = Math.floor(Math.random() * terrainTypes.grass.length);
    let coordinates = {
      x: terrainTypes.grass[index][0] + TILE_SIZE * Math.random(),
      y: terrainTypes.grass[index][1] + TILE_SIZE * Math.random(),
    };

    animalTrees.fox.insert(
      coordinates.x,
      coordinates.y,
      new Fox(coordinates.x, coordinates.y, Math.floor(Math.random() * 19))
    );
    inorganicNutrients -= 6;
  }
  populationData.fox = {
    color: "orange",
    population: [],
  };
}

//Updating (tree and animals)
function updateAnimalTrees() {
  let updateAn = Object.keys(animalTrees);
  updateAn = shuffleArr(updateAn);
  for (let tree of updateAn) {
    let data = animalTrees[tree].queryAll();
    let newTree = new QuadTreeNode(
      0,
      0,
      TILE_SIZE * MAP_SIZE,
      TILE_SIZE * MAP_SIZE,
      20
    );

    for (let animal of data) {
      if (animal.isAlive) {
        newTree.insert(animal.x, animal.y, animal);
      } else {
        //console.log("Deleted elemnt");
      }
    }
    animalTrees[tree] = newTree;
  }
}

function updateAnimals() {
  let updateAn = Object.keys(animalTrees);
  updateAn = shuffleArr(updateAn);
  for (let tree of updateAn) {
    let arr = animalTrees[tree].queryAll();
    for (let animal of arr) {
      animal.update();
    }
  }
}

//Energy
let inorganicNutrients = 6000;
let organicWaste = 0;
const compostPercentage = 0.2;
