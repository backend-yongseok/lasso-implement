import React from "react"
import Canvas, { Point } from "./components/Canvas"

// class QuadTree {
//   public points: Point[] = []
//   topLeft?: QuadTree = undefined
//   topRight?: QuadTree = undefined
//   bottomLeft?: QuadTree = undefined
//   bottomRight?: QuadTree = undefined

//   constructor(
//     private x: number,
//     private y: number,
//     private width: number,
//     private height: number,
//     private capacity: number,
//     public depth: number = 0
//   ) {
//     console.log(x, y, width, height, capacity, depth)
//     console.log("coco", coco++)
//   }

//   // Insert a point
//   insert(point: Point): boolean {
//     console.log("insert", point)
//     if (!this.contains(point)) {
//       console.log("not contain")
//       return false
//     }

//     if (this.points.length < this.capacity) {
//       this.points.push(point)
//       // return true
//     }

//     if (this.depth === 0) {
//       console.log("depth = 0")
//       this.subdivide()
//       return false
//     }

//     return (
//       this.topLeft?.insert(point) ||
//       this.topRight?.insert(point) ||
//       this.bottomLeft?.insert(point) ||
//       this.bottomRight?.insert(point) ||
//       false
//     )
//   }

//   // Check if the quadtree contains a point
//   contains(point: Point) {
//     console.log(this.x, this.x + this.width, this.y, this.y + this.height)
//     return (
//       point.x >= this.x &&
//       point.x <= this.x + this.width &&
//       point.y >= this.y &&
//       point.y <= this.y + this.height
//     )
//   }

//   // Subdivide the quadtree
//   subdivide() {
//     const self = this
//     const halfWidth = Math.round(self.width / 2)
//     const halfHeight = Math.round(self.height / 2)
//     console.log(halfWidth, halfHeight, self.depth)
//     self.width = halfWidth
//     self.height = halfHeight

//     self.topLeft = new QuadTree(
//       self.x,
//       self.y,
//       halfWidth,
//       halfHeight,
//       self.capacity,
//       self.depth + 1
//     )

//     self.topRight = new QuadTree(
//       self.x + halfWidth,
//       self.y,
//       halfWidth,
//       halfHeight,
//       self.capacity,
//       self.depth + 1
//     )

//     self.bottomLeft = new QuadTree(
//       self.x,
//       self.y + halfHeight,
//       halfWidth,
//       halfHeight,
//       self.capacity,
//       self.depth + 1
//     )

//     self.bottomRight = new QuadTree(
//       self.x + halfWidth,
//       self.y + halfHeight,
//       halfWidth,
//       halfHeight,
//       self.capacity,
//       self.depth + 1
//     )

//     for (const point of self.points) {
//       console.log("point", point)
//       self.topLeft.insert(point) ||
//         self.topRight.insert(point) ||
//         self.bottomLeft.insert(point) ||
//         self.bottomRight.insert(point)
//     }

//     self.points = []
//   }
// }

// class Point {
//   x: number;
//   y: number;

//   constructor(x: number, y: number) {
//     this.x = x;
//     this.y = y;
//   }
// }

class Rectangle {
  x: number
  y: number
  w: number
  h: number

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  public contains(point: Point): boolean {
    return (
      point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h
    )

    // return (
    //   point.x >= this.x &&
    //   point.x <= this.x + this.w &&
    //   point.y >= this.y &&
    //   point.y <= this.y + this.h
    // )
  }

  public intersects(other: Rectangle): boolean {
    return !(
      this.x + this.w < other.x - other.w ||
      this.x - this.w > other.x + other.w ||
      this.y + this.h < other.y - other.h ||
      this.y - this.h > other.y + other.h
    )
  }
}

class QuadTree {
  boundary: Rectangle
  capacity: number
  points: Point[]
  divided: boolean
  northWest: QuadTree | null
  northEast: QuadTree | null
  southWest: QuadTree | null
  southEast: QuadTree | null

  constructor(boundary: Rectangle, capacity: number) {
    this.boundary = boundary
    this.capacity = capacity
    this.points = []
    this.divided = false
    this.northWest = null
    this.northEast = null
    this.southWest = null
    this.southEast = null
  }

  insert(point: Point): boolean {
    if (!this.boundary.contains(point)) {
      // console.log("point not in boudary", this.boundary, point)
      return false
    }

    if (this.points.length < this.capacity) {
      this.points.push(point)
      return true
    }

    if (!this.divided) {
      this.subdivide()
    }

    return (
      this.northWest!.insert(point) ||
      this.northEast!.insert(point) ||
      this.southWest!.insert(point) ||
      this.southEast!.insert(point)
    )
  }

  subdivide(): void {
    const x = this.boundary.x
    const y = this.boundary.y
    const w = this.boundary.w / 2
    const h = this.boundary.h / 2

    const nw = new Rectangle(x - w / 2, y - h / 2, w, h)
    const ne = new Rectangle(x + w / 2, y - h / 2, w, h)
    const sw = new Rectangle(x - w / 2, y + h / 2, w, h)
    const se = new Rectangle(x + w / 2, y + h / 2, w, h)

    this.northWest = new QuadTree(nw, this.capacity)
    this.northEast = new QuadTree(ne, this.capacity)
    this.southWest = new QuadTree(sw, this.capacity)
    this.southEast = new QuadTree(se, this.capacity)

    this.divided = true

    for (const point of this.points) {
      // console.log("ppp", point)
      this.northWest.insert(point)
      this.northEast.insert(point)
      this.southWest.insert(point)
      this.southEast.insert(point)
    }

    this.points = []
  }

  query(range: Rectangle, found: Point[] = []): Point[] {
    if (!range.intersects(this.boundary)) {
      return found
    }

    for (const point of this.points) {
      if (range.contains(point)) {
        found.push(point)
      }
    }

    if (this.divided) {
      this.northWest!.query(range, found)
      this.northEast!.query(range, found)
      this.southWest!.query(range, found)
      this.southEast!.query(range, found)
    }

    return found
  }
}

const Drawing: React.FC = () => {
  const rayCasting = (
    point: Point,
    vertices: Point[],
    measure = false
  ): boolean => {
    let inside = false
    let count = 0

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i].x
      const yi = vertices[i].y
      const xj = vertices[j].x
      const yj = vertices[j].y

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi

      if (intersect) {
        inside = !inside
        ++count
      }
    }

    if (measure) {
      console.log(count)
    }

    return inside
  }

  const getBoundingBox = (vertices: Point[]) => {
    let minX = vertices[0].x
    let maxX = vertices[0].x
    let minY = vertices[0].y
    let maxY = vertices[0].y

    for (const point of vertices) {
      minX = Math.min(minX, point.x)
      maxX = Math.max(maxX, point.x)
      minY = Math.min(minY, point.y)
      maxY = Math.max(maxY, point.y)
    }

    return { minX, maxX, minY, maxY }
  }

  const fillInsidePolygon = (
    contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
    vertices: Point[]
  ) => {
    if (!contextRef?.current || vertices.length === 0) {
      return
    }

    const context = contextRef.current

    const { minX, minY, maxX, maxY } = getBoundingBox(vertices)

    // const quadTree = new QuadTree(minX, minY, maxX - minX, maxY - minY, 10)
    // const boundary = new Rectangle(minX, minY, maxX - minX, maxY - minY)
    const width = maxX - minX
    const height = maxY - minY
    const boundary = new Rectangle(0, 0, 1000, 1000)

    const quadTree = new QuadTree(boundary, 1000000)

    for (const vertex of vertices) {
      quadTree.insert(vertex)
    }

    function findPointsInsidePolygon(polygon: Point[]) {
      const { minX, minY, maxX, maxY } = getBoundingBox(polygon)

      // const quadTree = new QuadTree(minX, minY, maxX - minX, maxY - minY, 10)
      // const boundary = new Rectangle(minX, minY, maxX - minX, maxY - minY)
      const width = maxX - minX
      const height = maxY - minY
      const boundary = new Rectangle(minX + width, minY + height, width, height)

      const qt = new QuadTree(boundary, 1000)

      for (const point of polygon) {
        qt.insert(point)
      }

      const searchArea = new Rectangle(0, 0, 1000, 1000)
      const allPoints = qt.query(searchArea)

      allPoints.map((point) => {
        if (rayCasting(point, polygon)) {
          context.fillStyle = "#032134"
          context.fillRect(point.x * 1, point.y * 1, 10, 10)
        }
      })
    }

    console.log(findPointsInsidePolygon(vertices))

    // const printPointsInsidePolygon = (
    //   vertices: Point[],
    //   quadTree?: QuadTree | null
    // ): void => {
    //   console.log(quadTree, quadTree?.divided)
    //   if (quadTree && !quadTree?.divided) {
    //     for (const point of quadTree.points) {
    //       console.log("tree point", point)
    //       if (rayCasting(point, vertices)) {
    //         console.log("rrrrrr", point.x, point.y)
    //         console.log(context)
    //         context.fillStyle = "#032134"
    //         context.fillRect(point.x * 1, point.y * 1, 10, 10)
    //       }
    //     }
    //   } else {
    //     printPointsInsidePolygon(vertices, quadTree?.northWest)
    //     printPointsInsidePolygon(vertices, quadTree?.northEast)
    //     printPointsInsidePolygon(vertices, quadTree?.southWest)
    //     printPointsInsidePolygon(vertices, quadTree?.southEast)
    //   }
    // }

    // printPointsInsidePolygon(vertices, quadTree)
  }

  return (
    <>
      <Canvas fillInsidePolygon={fillInsidePolygon}></Canvas>
    </>
  )
}

export default Drawing
