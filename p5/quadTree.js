class QuadTreeNode {
  // create the quad tree
  constructor(x, y, w, h, size) {
    this.tl = null;
    this.tr = null;
    this.bl = null;
    this.br = null;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.size = size;
    this.array = [];
  }

  createChildNodes() {
    // init all child nodes
    // console.log(this);
    this.tl = new QuadTreeNode(
      this.x,
      this.y,
      this.w / 2,
      this.h / 2,
      this.size
    );
    this.tr = new QuadTreeNode(
      this.x + this.w / 2,
      this.y,
      this.w / 2,
      this.h / 2,
      this.size
    );
    this.bl = new QuadTreeNode(
      this.x,
      this.y + this.h / 2,
      this.w / 2,
      this.h / 2,
      this.size
    );
    this.br = new QuadTreeNode(
      this.x + this.w / 2,
      this.y + this.h / 2,
      this.w / 2,
      this.h / 2,
      this.size
    );
  }

  insert(x, y, data) {
    if (this.array.length == 0) this.createChildNodes();
    if (this.array.length < this.size) this.array.push(data);
    else if (this.x <= x && x <= this.x + this.w / 2) {
      if (this.y <= y && y <= this.y + this.h / 2) this.tl.insert(x, y, data);
      else this.bl.insert(x, y, data);
    } else {
      if (this.y <= y && y <= this.y + this.h / 2) this.tr.insert(x, y, data);
      else this.br.insert(x, y, data);
    }
  }
  queryAABB(x, y, w, h) {
    let res = [];
    // if colling aabb res.push(this.array); then recurse
    if (
      x <= this.x + this.w &&
      x + w >= this.x &&
      y <= this.y + this.h &&
      y + h >= this.y
    ) {
      res.push(...this.array);
      if (this.tl) res.push(...this.tl.queryAABB(x, y, w, h));
      if (this.tr) res.push(...this.tr.queryAABB(x, y, w, h));
      if (this.bl) res.push(...this.bl.queryAABB(x, y, w, h));
      if (this.br) res.push(...this.br.queryAABB(x, y, w, h));
    }
    return res;
  }
  queryAll() {
    let res = [];
    res.push(...this.array);
    if (this.tl) res.push(...this.tl.queryAll());
    if (this.tr) res.push(...this.tr.queryAll());
    if (this.bl) res.push(...this.bl.queryAll());
    if (this.br) res.push(...this.br.queryAll());
    return res;
  }
  //   getChildNodes() {
  //     let res = {
  //       xy: [this.x, this.y],
  //       array: this.array,
  //     };
  //     if (this.tl) res.tl = this.tl.getChildNodes();
  //     if (this.tr) res.tr = this.tr.getChildNodes();
  //     if (this.bl) res.bl = this.bl.getChildNodes();
  //     if (this.br) res.br = this.br.getChildNodes();
  //     return res;
  //   }
  deleteDeadElements() {
    this.array = this.array.filter((value) => {
      return value.isAlive;
    });
    if (this.tl) this.tl.deleteDeadElements();
    if (this.tr) this.tr.deleteDeadElements();
    if (this.bl) this.bl.deleteDeadElements();
    if (this.br) this.br.deleteDeadElements();
  }
}

/*

res = [(0,0)]

[1,1,2,2]

[(0,0),(1,1),(2,2)]

root
0   1
[ ][*]
[ ][ ]
2   3

[(0,0)] capacity 1

1
[ ][*]
[ ][ ]

[(1,1)] 

let a = [0,0,0]
let b = [1,1,1, ...a]
let c = [1,1,1, a]
b : [1,1,1,0,0,0]
c: [1,1,1,[0,0,0]]

*/

let vegetationTree = new QuadTreeNode(
  0,
  0,
  TILE_SIZE * MAP_SIZE,
  TILE_SIZE * MAP_SIZE,
  20
);
let shallowWaterTree = new QuadTreeNode(
  0,
  0,
  TILE_SIZE * MAP_SIZE,
  TILE_SIZE * MAP_SIZE,
  15
);
let animalTrees = {
  rabbit: new QuadTreeNode(
    0,
    0,
    TILE_SIZE * MAP_SIZE,
    TILE_SIZE * MAP_SIZE,
    20
  ),
  blackRabbit: new QuadTreeNode(
    0,
    0,
    TILE_SIZE * MAP_SIZE,
    TILE_SIZE * MAP_SIZE,
    20
  ),
  fox: new QuadTreeNode(0, 0, TILE_SIZE * MAP_SIZE, TILE_SIZE * MAP_SIZE, 20),
};

//let rabbitTree = new QuadTreeNode(
//  0,
//  0,
//  TILE_SIZE * MAP_SIZE,
//  TILE_SIZE * MAP_SIZE,
//  20
//);
//
