class Vegetation {
  constructor(x, y, age, energy) {
    this.x = x;
    this.y = y;
    this.age = age;
    this.birth = new Date().getTime() - 10000 * this.age - pause.total;
    this.isAlive = true;
    this.identity = "plant";
    this.energy = energy;

    this.genes = {
      sizeMod: Math.random() * 3 + 4,
    };

    //this.mark = 0;
    this.radius = this.age + this.genes.sizeMod;
  }
  draw() {
    if (
      this.x > -camera.x &&
      this.x < canvas.width - camera.x &&
      this.y > -camera.y &&
      this.y < canvas.height - camera.y
    ) {
      fill(0, 255 - this.age * 5, 0);
      //this.updateRadius();
      ellipse(this.x + camera.x, this.y + camera.y, this.radius, this.radius);
    }
  }
  updateRadius() {
    let previousAge = this.age;
    this.age = Math.floor(
      (new Date().getTime() - this.birth - pause.total) / 10000
    );
    if (inorganicNutrients > 1 && this.age != previousAge) {
      inorganicNutrients -= 0.5;
      this.energy++;
    }
    this.radius = this.energy + this.genes.sizeMod;
  }
  reproduce() {
    if (Math.random() > 0.8 - this.age / 15 && inorganicNutrients > 1) {
      /*
      plants.push(
        new Vegetation(
          this.x + (Math.random() * 40 - 20),
          this.y + (Math.random() * 40 - 20),
          0
        )
      );
      */

      let childX =
        this.x +
        (Math.random() * 20 + this.radius * 1.1) *
          (Math.round(Math.random()) * -2 + 1);
      let childY =
        this.y +
        (Math.random() * 20 + this.radius * 1.1) *
          (Math.round(Math.random()) * -2 + 1);

      let newPlant = new Vegetation(childX, childY, 0, 1);
      inorganicNutrients -= 1;
      if (newPlant.checkDeath()) {
        vegetationTree.insert(childX, childY, newPlant);
      }
    }
  }
  checkDeath(jusChecking) {
    this.updateRadius();
    //Out border or too old
    if (
      this.x >= MAP_SIZE * TILE_SIZE ||
      this.x <= 0 ||
      this.y >= MAP_SIZE * TILE_SIZE ||
      this.y <= 0 ||
      this.age > 20
    ) {
      this.isAlive = false;
      organicWaste += this.energy;
      return false;
    }
    //on water
    let tileArea =
      TERRAIN[Math.floor(this.y / TILE_SIZE)][Math.floor(this.x / TILE_SIZE)];
    if (tileArea == 0 || tileArea == 5 || tileArea == 4) {
      this.isAlive = false;
      organicWaste += this.energy;
      return false;
    } else {
      //collision
      let arr = vegetationTree.queryAABB(this.x - 40, this.y - 40, 80, 80);
      for (let plant of arr) {
        let maxDistance = 0;
        if (tileArea == 2) maxDistance = 0;
        else if (tileArea == 3) maxDistance = 6;
        else maxDistance = 6;

        if (plant != this && entityCollision(this, plant, maxDistance)) {
          if (this.age > plant.age) {
            organicWaste += plant.energy;
            plant.isAlive = false;
          } else {
            this.isAlive = false;
            organicWaste += this.energy;
          }
          return false;
        }
      }
    }
    return true;
  }
  update(randFactor) {
    if (this.isAlive == false) {
      return true;
    }
    if (this.energy < 1) {
      console.log("Error");
      this.color = "red";
    }
    //this.mark = 0;
    this.reproduce();
    return this.checkDeath(false);
  }
}

// (x1 - x2)**2 + (x)
//Push plants

//__________________ANimals
//let animals = [];
class Animal {
  constructor(x, y, age) {
    this.x = x;
    this.y = y;
    this.age = age;
    this.birth = new Date().getTime() - pause.total;

    this.speed = 2;

    this.isAlive = true;

    this.radius = 20;
    this.color = "red";
  }

  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius, this.radius);
  }
}
class Rabbit extends Animal {
  constructor(x, y, age) {
    super(x, y, age);
    this.genes = {
      color: "white",
      vision: 40,
      sizeMod: Math.random() * 3 + 4,
      maxAge: 8,
    };
    this.speed = 2.5;
    this.identity = "rabbit";

    this.hunger = 6;
    this.thirst = 6;
    this.matingCost = 1.5;
    this.movingEnergy = 0.015;

    this.dest = {
      data: null,
      x: null,
      y: null,
      radius: null,
    };
    this.radius = this.genes.sizeMod;
  }
  draw() {
    if (
      this.isAlive &&
      this.x > -camera.x &&
      this.x < canvas.width - camera.x &&
      this.y > -camera.y &&
      this.y < canvas.height - camera.y
    ) {
      fill(this.genes.color);
      ellipse(this.x + camera.x, this.y + camera.y, this.radius, this.radius);
    }
  }
  move() {
    if (this.hunger > 1.2 && this.thirst > 1.2) {
      let predators = animalTrees.fox.queryAABB(
        this.x - this.genes.vision,
        this.y - this.genes.vision,
        this.genes.vision,
        this.genes.vision
      );
      for (let predator of predators) {
        if (
          calculateDistance(predator, this) < TILE_SIZE * 2.5 &&
          predator.dest.data == this
        ) {
          let diX = predator.x - this.x;
          let diY = predator.y - this.y;
          let rap = this.speed / Math.hypot(diX, diY);
          this.x -= diX * rap;
          this.y -= diY * rap;

          //let previousHunger = this.hunger;

          //if (previousHunger < 0) {
          //  this.isAlive = false;
          //} else if (previousHunger <= 0.015) {
          //  organicWaste += previousHunger;
          //  this.isAlive = false;
          //} else {
          //  this.thirst -= 0.015;
          //  this.hunger -= 0.015;
          //  organicWaste += 0.015;
          //}
          return;
        }
      }
    }
    //if (closePred < TILE_SIZE * 2.5) {
    //}
    if (!this.action && this.dest.data) {
      let diX = this.dest.x - this.x;
      let diY = this.dest.y - this.y;
      let rap = this.speed / Math.hypot(diX, diY);
      this.x += diX * rap;
      this.y += diY * rap;

      ///_______________________----___________________------
      let previousHunger = this.hunger;

      if (previousHunger < 0) {
        this.isAlive = false;
      } else if (previousHunger <= 0.015) {
        organicWaste += previousHunger;
        this.isAlive = false;
      } else {
        this.thirst -= 0.015;
        this.hunger -= 0.015;
        organicWaste += 0.015;
      }
    } else {
      if (this.dest.data) {
        this.doAction();
      }
    }
  }
  chooseDest() {
    this.lookingForMate =
      this.hunger > this.matingCost * 2.5 && this.matingCost * 2.5;

    if (this.dest.data == "water") {
      this.action = circleTouchRect(
        this.x,
        this.y,
        this.radius / 1.5,
        this.dest.x - TILE_SIZE * 0.4,
        this.dest.y - TILE_SIZE * 0.4,
        TILE_SIZE * 0.8,
        TILE_SIZE * 0.8
      );
    } else if (this.dest.data) {
      if (
        this.dest.data.identity == "plant" ||
        this.dest.data.identity == "rabbit"
      ) {
        this.action = entityCollision(this, this.dest, -this.dest.radius / 1.5);
      }
    }

    if (this.action) {
      return;
    }
    let mate = this.chooseMate();

    if (mate) {
      this.dest.data = mate;
      this.dest.x = mate.x;
      this.dest.y = mate.y;
      this.dest.radius = mate.radius;
    } else if (this.thirst >= this.hunger) {
      this.choosePlant();
    } else if (this.hunger > this.thirst) {
      this.chooseSource();
    }
  }
  choosePlant() {
    let dests = vegetationTree.queryAABB(
      this.x - this.genes.vision / 2,
      this.y - this.genes.vision / 2,
      this.genes.vision,
      this.genes.vision
    );
    let chosenPlant = { distance: Infinity };
    for (let plant of dests) {
      if (
        plant.radius <=
        7 + this.age / 3
        /*original 6*/
      ) {
        let distance = calculateDistance(this, plant);
        if (distance < chosenPlant.distance) {
          //
          let predators = animalTrees.fox.queryAABB(
            plant.x - 20,
            plant.y - 20,
            20,
            20
          );
          let gudFood = true;
          for (let predator of predators) {
            if (calculateDistance(predator, this) < TILE_SIZE * 3.1) {
              gudFood = false;
              break;
            }
          }
          //
          if (gudFood) {
            chosenPlant.distance = distance;
            chosenPlant.data = plant;
          }
        }
      }
    }
    if (chosenPlant.distance == Infinity) {
      this.thirst -= 0.2;
      this.age = Math.round(
        (new Date().getTime() - pause.total - this.birth) / 10000
      ); //UPDATE AGE
    } else {
      this.dest.data = chosenPlant.data;
      //this.dest.data.mark++;
      this.dest.x = chosenPlant.data.x;
      this.dest.y = chosenPlant.data.y;
      this.dest.radius = chosenPlant.data.radius;
    }
  }
  chooseMate() {
    let mate = {
      identity: null,
    };
    if (this.lookingForMate) {
      let potentielMates = animalTrees.rabbit.queryAABB(
        this.x - this.genes.vision / 2,
        this.y - this.genes.vision / 2,
        this.genes.vision,
        this.genes.vision
      );
      mate.distance = this.genes.vision * 4;

      for (let animal of potentielMates) {
        if (
          this != animal &&
          animal.isAlive &&
          animal.lookingForMate &&
          calculateDistance(this, animal) < mate.distance &&
          this.age > 1 &&
          animal.age > 1
        ) {
          mate.identity = animal;
          mate.distance = calculateDistance(this, animal);
        }
      }
    }
    return mate.identity;
  }
  chooseSource() {
    let dests = shallowWaterTree.queryAABB(
      this.x - this.genes.vision / 2,
      this.y - this.genes.vision / 2,
      this.genes.vision,
      this.genes.vision
    );
    let chosenSource = { distance: Infinity };
    for (let source of dests) {
      let distance = calculateDistance(this, source);
      if (distance < chosenSource.distance) {
        //
        let predators = animalTrees.fox.queryAABB(
          source.x - 20,
          source.y - 20,
          20,
          20
        );
        let gudFood = true;
        for (let predator of predators) {
          if (calculateDistance(predator, this) < TILE_SIZE * 3.1) {
            gudFood = false;
            break;
          }
        }
        //
        if (gudFood) {
          chosenSource.distance = distance;
          chosenSource.data = source;
        }
      }
    }
    if (chosenSource.distance == Infinity) {
      this.thirst -= 0.2;
      this.age = Math.round(
        (new Date().getTime() - pause.total - this.birth) / 10000
      ); //UPDATE AGE
    } else {
      this.dest.data = "water";
      this.dest.x = chosenSource.data.x;
      this.dest.y = chosenSource.data.y;
      this.dest.radius = chosenSource.data.radius;
    }
  }
  doAction() {
    if (this.dest.data == "waiting") {
      this.wait();
    } else if (this.dest.data == "waitingForReproduction") {
      this.reproduce();
    } else if (this.dest.data == "water") {
      this.drink();
    } else if (this.dest.data.identity == "plant") {
      this.eat();
    } else if (this.dest.data.identity == "rabbit") {
      this.foundPartner();
    }
  }
  wait() {
    if (new Date().getTime() - pause.total - this.dest.waitStart >= 2000) {
      this.dest = {};
      this.action = false;
    }
  }
  eat() {
    this.age = Math.round(
      (new Date().getTime() - pause.total - this.birth) / 10000
    ); //UPDATE AGE
    this.radius = this.genes.sizeMod + this.age / 4; //Update Radius
    if (this.dest.data.isAlive == true) {
      this.hunger += this.dest.data.energy; //0.24 //2
      this.dest.data.isAlive = false;

      //Water
      this.thirst += this.dest.data.energy / 2.25;
      //

      this.dest.data = "waiting";
      this.dest.waitStart = new Date().getTime() - pause.total;
    } else {
      this.dest = {};
      this.action = false;
    }
  }
  drink() {
    this.thirst += 4.6;
    this.dest.data = "waiting";
    this.dest.waitStart =
      new Date().getTime() - pause.total + Math.random() * 550;
  }
  foundPartner() {
    this.dest.data = "waitingForReproduction";
    this.lookingForMate = false;
    this.dest.waitStart =
      new Date().getTime() - pause.total + Math.random() * 550;
  }
  reproduce() {
    if (new Date().getTime() - pause.total - this.dest.waitStart >= 2000) {
      let numOfBabies = Math.round(Math.random()) + 1;
      for (let i = 0; i < numOfBabies; i++) {
        let baby = new Rabbit(this.x, this.y, 0);
        this.thirst -= this.matingCost;
        this.hunger -= this.matingCost;
        baby.hunger = this.matingCost;
        baby.thirst = this.matingCost + 2; //More thirst for some reason
        animalTrees.rabbit.insert(this.x, this.y, baby);
      }

      this.dest = {};
      this.action = false;
    }
    //if (this.hunger > this.matingCost * 2) {
    //  //console.log("HEy");
    //  this.dest = {};
    //  this.action = false;
    //}
  }
  checkDeath() {
    //hungry or thirsty
    if (this.hunger <= 0) {
      this.isAlive = false;
      //console.log("DEATH BY HUNGER");
    } else if (this.thirst <= 0) {
      this.isAlive = false;
      //console.log("thirstality");
      organicWaste += this.hunger;
    } else if (this.age > this.genes.maxAge) {
      this.isAlive = false;
      organicWaste += this.hunger;
      //console.log("BOOMER");
    }
  }
  update() {
    if (this.hunger < 0) {
      console.error("Error, aniaml");
    }
    if (this.isAlive) {
      this.move();
      this.chooseDest();
      this.checkDeath();
    }
  }
}

class BlackRabbit extends Rabbit {
  constructor(x, y, age) {
    super(x, y, age);
    this.genes.color = "black";
  }
  chooseMate() {
    let mate = {
      identity: null,
    };
    if (this.lookingForMate) {
      let potentielMates = animalTrees.blackRabbit.queryAABB(
        this.x - this.genes.vision / 2,
        this.y - this.genes.vision / 2,
        this.genes.vision,
        this.genes.vision
      );
      mate.distance = this.genes.vision * 4;

      for (let animal of potentielMates) {
        if (
          this != animal &&
          animal.isAlive &&
          animal.lookingForMate &&
          calculateDistance(this, animal) < mate.distance &&
          this.age > 1 &&
          animal.age > 1
        ) {
          mate.identity = animal;
          mate.distance = calculateDistance(this, animal);
        }
      }
    }
    return mate.identity;
  }
  reproduce() {
    if (new Date().getTime() - pause.total - this.dest.waitStart >= 2000) {
      let numOfBabies = Math.round(Math.random()) + 1;
      for (let i = 0; i < numOfBabies; i++) {
        let baby = new BlackRabbit(this.x, this.y, 0);
        this.thirst -= this.matingCost;
        this.hunger -= this.matingCost;
        baby.hunger = this.matingCost;
        baby.thirst = this.matingCost + 2; //More thirst for some reason
        animalTrees.blackRabbit.insert(this.x, this.y, baby);
      }

      this.dest = {};
      this.action = false;
    }
  }
}

class Fox extends Animal {
  constructor(x, y, age) {
    super(x, y, age);
    this.genes = {
      color: "orange",
      vision: 40,
      sizeMod: Math.random() * 5 + 10,
      maxAge: 20,
    };
    this.speed = 3.5;
    this.identity = "fox";

    this.hunger = 4;
    this.thirst = 4;
    this.matingCost = 5;
    this.movingEnergy = 0.033;
    this.birth = new Date().getTime() - pause.total - age * 10000;

    this.lastTimeEaten = 0;
    this.lastTimeReproduce = 0;
    this.gender = Math.round(Math.random());

    this.dest = {
      data: null,
      x: null,
      y: null,
      radius: null,
    };
    this.radius = this.genes.sizeMod;
  }
  draw() {
    if (
      this.isAlive &&
      this.x > -camera.x &&
      this.x < canvas.width - camera.x &&
      this.y > -camera.y &&
      this.y < canvas.height - camera.y
    ) {
      fill(this.genes.color);
      ellipse(this.x + camera.x, this.y + camera.y, this.radius, this.radius);
    }
  }
  update() {
    if (this.isAlive) {
      this.checkDeath();
      this.chooseDest();
      this.move();
    }
  }
  move() {
    this.age = Math.round(
      (new Date().getTime() - pause.total - this.birth) / 10000
    ); //UPDATE AGE
    if (!this.action && this.dest.data) {
      let diX = this.dest.x - this.x;
      let diY = this.dest.y - this.y;
      let rap = this.speed / Math.hypot(diX, diY);
      this.x += diX * rap;
      this.y += diY * rap;

      ///_______________________----___________________------
      let previousHunger = this.hunger;

      if (this.hunger < 0) {
        this.isAlive = false;
      } else if (previousHunger <= this.movingEnergy) {
        organicWaste += previousHunger;
        this.isAlive = false;
      } else {
        organicWaste += this.movingEnergy;
        this.thirst -= this.movingEnergy;
        this.hunger -= this.movingEnergy;
      }
    } else {
      if (this.dest.data) {
        this.doAction();
      }
    }
  }

  chooseDest() {
    this.lookingForMate =
      this.hunger > this.matingCost * 1.5 &&
      this.thirst > this.matingCost * 1.5 &&
      this.lastTimeReproduce + 12000 < new Date().getTime() - pause.total;

    if (this.dest.data == "random") {
      if (
        circleTouchRect(
          this.x,
          this.y,
          this.radius / 1.5,
          this.dest.x,
          this.dest.y,
          TILE_SIZE,
          TILE_SIZE
        )
      ) {
        this.dest = {};
      }
    } else if (this.dest.data == "water") {
      this.action = circleTouchRect(
        this.x,
        this.y,
        this.radius / 1.5,
        this.dest.x - TILE_SIZE * 0.4,
        this.dest.y - TILE_SIZE * 0.4,
        TILE_SIZE * 0.8,
        TILE_SIZE * 0.8
      );
    } else if (this.dest.data) {
      if (
        this.dest.data.identity == "rabbit" ||
        this.dest.data.identity == "fox"
      ) {
        this.action = entityCollision(this, this.dest, -this.dest.radius / 1.5);
      }
    }

    if (this.action) {
      return;
    }
    let mate = this.chooseMate();

    if (mate) {
      this.dest.data = mate;
      this.dest.x = mate.x;
      this.dest.y = mate.y;
      this.dest.radius = mate.radius;
    } else if (this.thirst >= this.hunger) {
      this.choosePrey();
    } else if (this.hunger > this.thirst) {
      this.chooseSource();
    }
  }
  chooseMate() {
    let mate = {
      identity: null,
    };
    if (this.lookingForMate) {
      let potentielMates = animalTrees.fox.queryAABB(
        this.x - this.genes.vision / 2,
        this.y - this.genes.vision / 2,
        this.genes.vision,
        this.genes.vision
      );
      mate.distance = this.genes.vision * 7.2;

      for (let animal of potentielMates) {
        if (
          this != animal &&
          animal.isAlive &&
          animal.lookingForMate &&
          calculateDistance(this, animal) < mate.distance &&
          this.age > 2 &&
          animal.age > 2
          //&& this.gender != animal.gender
        ) {
          mate.identity = animal;
          mate.distance = calculateDistance(this, animal);
        }
      }
      return mate.identity;
    }
  }
  choosePrey() {
    let chosenPrey = { distance: Infinity };

    if (
      this.lastTimeEaten + 4840 + this.hunger * 403 <
      new Date().getTime() - pause.total
    ) {
      let dests = animalTrees.rabbit.queryAABB(
        this.x - this.genes.vision / 2,
        this.y - this.genes.vision / 2,
        this.genes.vision,
        this.genes.vision
      );
      dests = dests.concat(
        animalTrees.blackRabbit.queryAABB(
          this.x - this.genes.vision / 2,
          this.y - this.genes.vision / 2,
          this.genes.vision,
          this.genes.vision
        )
      );

      for (let prey of dests) {
        let distance = calculateDistance(this, prey);
        if (
          distance < chosenPrey.distance &&
          prey.isAlive &&
          calculateDistance(this, prey) < 100
        ) {
          chosenPrey.distance = distance;
          chosenPrey.data = prey;
        }
      }
    }

    if (chosenPrey.distance == Infinity) {
      if (this.dest.data == "random") {
        return;
      }
      let tiles = [];
      let matPos = {
        x: Math.floor(this.x / TILE_SIZE),
        y: Math.floor(this.y / TILE_SIZE),
      };
      for (let i = matPos.y - 6; i <= matPos.y + 6; i += 3) {
        for (let j = matPos.x - 6; j <= matPos.x + 6; j += 3) {
          if (i > -1 && i < MAP_SIZE && j > -1 && j < MAP_SIZE) {
            if (i != matPos.y && j != matPos.x) {
              if (TERRAIN[i][j] != 0 && TERRAIN[i][j] != 5) {
                tiles.push([j, i]);
              }
            }
          }
        }
      }
      //console.log(this.x, this.y, tiles);
      if (tiles.length == 0) {
        this.isAlive = false;
      }
      let randomIndex = Math.floor(Math.random() * tiles.length);
      this.dest.data = "random";
      this.dest.x = tiles[randomIndex][0] * TILE_SIZE;
      this.dest.y = tiles[randomIndex][1] * TILE_SIZE;
      this.dest.radius = 0;

      //console.log(this.dest.x * TILE_SIZE, this.dest.y * TILE_SIZE);
    } else {
      this.dest.data = chosenPrey.data;
      this.dest.x = chosenPrey.data.x;
      this.dest.y = chosenPrey.data.y;
      this.dest.radius = chosenPrey.data.radius;
    }
  }

  chooseSource() {
    let dests = shallowWaterTree.queryAABB(
      this.x - this.genes.vision / 2,
      this.y - this.genes.vision / 2,
      this.genes.vision,
      this.genes.vision
    );
    let chosenSource = { distance: Infinity };
    for (let source of dests) {
      let distance = calculateDistance(this, source);
      if (distance < chosenSource.distance) {
        chosenSource.distance = distance;
        chosenSource.data = source;
      }
    }
    if (chosenSource.distance == Infinity) {
      //this.thirst -= 1;
      //this.age = Math.round(
      //  (new Date().getTime() - pause.total - this.birth) / 10000
      //); //UPDATE AGE
    } else {
      this.dest.data = "water";
      this.dest.x = chosenSource.data.x;
      this.dest.y = chosenSource.data.y;
      this.dest.radius = chosenSource.data.radius;
    }
  }
  checkDeath() {
    //hungry or thirsty
    if (this.hunger <= 0) {
      this.isAlive = false;
      console.log("DEATH BY HUNGER");
    } else if (this.thirst <= 0) {
      this.isAlive = false;
      console.log("thirstality");
      organicWaste += this.hunger;
    } else if (this.age > this.genes.maxAge) {
      this.isAlive = false;
      organicWaste += this.hunger;
      console.log("BOOMER");
    }
  }
  doAction() {
    if (this.dest.data == "waitingForReproduction") {
      this.reproduce();
    } else if (this.dest.data == "water") {
      this.drink();
    } else if (this.dest.data == "waiting") {
      this.wait();
    } else if (this.dest.data.identity == "rabbit") {
      this.eat();
    } else if (this.dest.data.identity == "fox") {
      this.foundPartner();
    }
  }
  eat() {
    this.radius = this.genes.sizeMod + this.age / 4; //Update Radius
    if (this.dest.data.isAlive == true) {
      this.hunger += this.dest.data.hunger; //0.24 //2
      this.dest.data.isAlive = false;
      this.dest.data = "waiting";
      this.dest.waitStart = new Date().getTime() - pause.total - 1000;

      this.lastTimeEaten = new Date().getTime() - pause.total;
    } else {
      this.dest = {};
      this.action = false;
    }
  }
  drink() {
    this.thirst += 4;
    this.dest.data = "waiting";
    this.dest.waitStart =
      new Date().getTime() - pause.total + Math.random() * 1250;
  }

  wait() {
    this.hunger -= 0.002;
    this.thirst -= 0.002;
    organicWaste += 0.002;
    if (new Date().getTime() - pause.total - this.dest.waitStart >= 2000) {
      this.dest = {};
      this.action = false;
    }
  }
  foundPartner() {
    //
    while (this.gender == this.dest.data.gender) {
      this.gender = Math.round(Math.random());
    }
    //

    this.dest.data = "waitingForReproduction";
    this.lookingForMate = false;
    this.dest.waitStart = new Date().getTime() - pause.total;
  }
  reproduce() {
    if (new Date().getTime() - pause.total - this.dest.waitStart >= 2000) {
      if (this.gender == 0) {
        let baby = new Fox(this.x, this.y, 0);
        this.thirst -= this.matingCost;
        this.hunger -= this.matingCost;
        baby.hunger = this.matingCost * 0.7;
        baby.thirst = this.matingCost * 0.7;

        organicWaste += this.matingCost * 0.3;

        animalTrees.fox.insert(this.x, this.y, baby);
        this.lastTimeReproduce = new Date().getTime() - pause.total;
      }

      this.dest = {};
      this.action = false;
    }
    //if (this.hunger > this.matingCost * 2) {
    //  //console.log("HEy");
    //  this.dest = {};
    //  this.action = false;
    //}
  }
}
