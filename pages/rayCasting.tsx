import React from "react"
import Canvas, { Point } from "./components/Canvas"
import { useSetRecoilState } from "recoil"
import { calcCountState, vertexLengthState } from "./stores/atoms"

const Drawing: React.FC = () => {
  const WIDTH = 1000
  const HEIGHT = 1000
  const setVertexLength = useSetRecoilState(vertexLengthState)
  const setCount = useSetRecoilState(calcCountState)

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

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // setCount((prev) => {
        //   console.log(prev)
        //   return prev + 1
        // })

        if (rayCasting({ x: col, y: row }, vertices)) {
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
