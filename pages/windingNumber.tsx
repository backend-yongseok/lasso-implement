import React from "react"
import Canvas, { Point } from "./components/Canvas"
import { useSetRecoilState } from "recoil"
import { calcCountState, vertexLengthState } from "./stores/atoms"

const Drawing: React.FC = () => {
  const WIDTH = 1000
  const HEIGHT = 1000
  const setVertexLength = useSetRecoilState(vertexLengthState)
  const setCount = useSetRecoilState(calcCountState)

  const windingNumber = (point: Point, vertices: Point[]): boolean => {
    let windingNumber = 0
    const n = vertices.length
    for (let i = 0; i < n; i++) {
      const edgeStart = vertices[i]
      const edgeEnd = vertices[(i + 1) % n]
      if (edgeStart.y <= point.y) {
        if (edgeEnd.y > point.y && isLeftOf(point, edgeStart, edgeEnd) > 0) {
          windingNumber++
        }
      } else {
        if (edgeEnd.y <= point.y && isLeftOf(point, edgeStart, edgeEnd) < 0) {
          windingNumber--
        }
      }
    }
    return windingNumber !== 0
  }

  const isLeftOf = (point: Point, start: Point, end: Point): number => {
    return (
      (end.x - start.x) * (point.y - start.y) -
      (end.y - start.y) * (point.x - start.x)
    )
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
        setCount((prev) => {
          console.log(prev)
          return prev + 1
        })

        if (windingNumber({ x: col, y: row }, vertices)) {
          context.fillStyle = "#032134"
          context.fillRect(col * 1, row * 1, 1, 1)
        }
      }
    }
  }

  return (
    <>
      <Canvas fillInsidePolygon={fillInsidePolygon}></Canvas>
    </>
  )
}

export default Drawing
