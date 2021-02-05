//Tile Properties
const TILE_SIZE = 14; //
const MAP_SIZE = 100; //100
//Vizualation
function visualizeTiles() {
  c.beginPath();
  c.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += TILE_SIZE) {
    c.moveTo(i, 0);
    c.lineTo(i, canvas.height);
  }

  for (let i = 0; i < canvas.height; i += TILE_SIZE) {
    c.moveTo(0, i);
    c.lineTo(canvas.width, i);
  }
  c.stroke();
}
//Create terrains
function createNoise(seed) {
  noiseSeed(seed);
  let mapData = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    mapData[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) mapData[y][x] = noise(x / 14, y / 14);
  }
  return mapData;
}
let terrainTypes = { grass: [], water: [] };
function generateTerrainFromMapData(mapData) {
  return mapData.map((row, rIndex) =>
    row.map((v, cIndex) => {
      if (v < 0.3) {
        //terrainTypes.water.push([cIndex * TILE_SIZE, rIndex * TILE_SIZE]);
        return 5;
      }
      if (v < 0.4) {
        //terrainTypes.water.push([cIndex * TILE_SIZE, rIndex * TILE_SIZE]);
        shallowWaterTree.insert(cIndex * TILE_SIZE, rIndex * TILE_SIZE, {
          x: cIndex * TILE_SIZE + TILE_SIZE / 2,
          y: rIndex * TILE_SIZE + TILE_SIZE / 2,
        });
        return 0;
      }
      if (v < 0.45) return 1;
      if (v < 0.6) {
        terrainTypes.grass.push([cIndex * TILE_SIZE, rIndex * TILE_SIZE]);
        return 2;
      }
      if (v < 0.7) return 3;
      else return 4;
    })
  );
}

function generateTerrain(seed) {
  return generateTerrainFromMapData(createNoise(seed));
}

const COLORS = {
  5: "rgb(50,180,180)",
  0: "rgb(102,255,255)",
  1: "rgb(255,255,102)",
  2: "rgb(154,205,50)",
  3: "grey",
  4: "white",
};
function drawTerrain(mapData) {
  for (
    let y = Math.max(-Math.floor(camera.y / TILE_SIZE) - 3, 0);
    y < Math.min((canvas.height - camera.y) / TILE_SIZE, MAP_SIZE);
    y++
  )
    for (
      let x = Math.max(-Math.floor(camera.x / TILE_SIZE) - 3, 0);
      x < Math.min((canvas.width - camera.x) / TILE_SIZE, MAP_SIZE);
      x++
    ) {
      let v = mapData[y][x];
      let color = COLORS[v];
      fill(color);
      rect(
        x * TILE_SIZE + camera.x,
        y * TILE_SIZE + camera.y,
        TILE_SIZE,
        TILE_SIZE
      );
    }
}
