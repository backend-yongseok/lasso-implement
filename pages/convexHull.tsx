import React from "react"
import Canvas, { Point } from "./components/Canvas"
import { useSetRecoilState } from "recoil"
import { calcCountState, vertexLengthState } from "./stores/atoms"

const Drawing: React.FC = () => {
  const WIDTH = 1000
  const HEIGHT = 1000
  const setVertexLength = useSetRecoilState(vertexLengthState)
  const setCount = useSetRecoilState(calcCountState)

  const getConvexHull = (points: Point[]) => {
    const sortedPoints = points.sort((a, b) => a.x - b.x)

    const upperHull = buildHull(sortedPoints)
    const lowerHull = buildHull(sortedPoints.reverse())
    const result = upperHull.concat(lowerHull.slice(1, -1))

    return result
  }

  const buildHull = (points: Point[]): Point[] => {
    const hull: Point[] = []

    for (const point of points) {
      while (
        hull.length >= 2 &&
        ccw(hull[hull.length - 2], hull[hull.length - 1], point) <= 0
      ) {
        hull.pop()
      }
      hull.push(point)
    }

    return hull
  }

  const isPointInsideConvexHull = (point: Point, hull: Point[]): boolean => {
    const lineSegments = hull.map((p, i) => [p, hull[(i + 1) % hull.length]])

    return lineSegments.every(([a, b]) => ccw(a, b, point) >= 0)
  }

  const ccw = (a: Point, b: Point, c: Point): number => {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
  }

  const fillInsidePolygon = (
    contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
    vertices: Point[]
  ) => {
    setVertexLength(vertices.length)
    setCount(0)
    if (!contextRef?.current || vertices.length === 0) {
      return
    }

    const context = contextRef.current
    const cols = WIDTH
    const rows = HEIGHT
    const hull = getConvexHull(vertices)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // setCount((prev) => prev + 1)

        if (isPointInsideConvexHull({ x: col, y: row }, hull)) {
          context.fillStyle = "#032134"
          context.fillRect(col * 1, row * 1, 1, 1)
        }
      }
    }
  }

  return (
    <>
      <Canvas
        width={WIDTH}
        height={HEIGHT}
        fillInsidePolygon={fillInsidePolygon}
      ></Canvas>
    </>
  )
}

export default Drawing
