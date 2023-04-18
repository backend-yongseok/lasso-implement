import React, { useRef, useEffect } from "react"

export interface Point {
  x: number
  y: number
}

interface Block {
  name: string
  color: string
}

const Canvas: React.FC<{
  width?: number
  height?: number
  fillInsidePolygon: (
    contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
    vertices: Point[]
  ) => void
}> = ({ width = 1000, height = 1000, fillInsidePolygon }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)

  const [isDrawing, setIsDrawing] = React.useState<boolean>(false)
  const [vertices, setVertices] = React.useState<Point[]>([])

  const generateColor = (): string => {
    const letters = "0123456789ABCDEF"
    let color = "#"
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  const drawGrid = () => {
    if (!canvasRef.current || !contextRef.current) {
      return
    }

    const context = contextRef.current
    const blockSize = 50
    const rows = 50
    const cols = 50

    const blocks: Block[][] = []

    for (let row = 0; row < rows; row++) {
      const blockRow: Block[] = []
      const rowName = String.fromCharCode("A".charCodeAt(0) + row)

      for (let col = 0; col < cols; col++) {
        const blockName = rowName + (col + 1)
        const blockColor = generateColor()

        context.fillStyle = blockColor
        context.fillRect(col * blockSize, row * blockSize, blockSize, blockSize)

        context.fillStyle = "#000"
        context.font = "16px Arial"
        context.fillText(blockName, col * blockSize + 20, row * blockSize + 30)

        blockRow.push({ name: blockName, color: blockColor })
      }

      blocks.push(blockRow)
    }
  }

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const canvas = canvasRef.current
    // canvas.width = 1000
    // canvas.height = 1000
    // canvas.style.width = `${1000}px`
    // canvas.style.height = `${1000}px`

    const context = canvas.getContext("2d")
    if (context) {
      context.lineCap = "round"
      context.strokeStyle = "red"
      context.lineWidth = 1
      contextRef.current = context
    }
    drawGrid()
  }, [])

  const startDrawing = (nativeEvent: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = nativeEvent
    if (contextRef.current) {
      setVertices([])
      contextRef.current.beginPath()
      contextRef.current.moveTo(clientX, clientY)
      setVertices((prev) => {
        return [...prev, { x: clientX, y: clientY }]
      })
      setIsDrawing(true)
    }
  }

  const finishDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath()
    }
    setIsDrawing(false)
  }

  const draw = (nativeEvent: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) {
      return
    }
    const { clientX, clientY } = nativeEvent
    contextRef.current.lineWidth = 1
    contextRef.current.lineTo(clientX, clientY)
    contextRef.current.stroke()
    setVertices((prev) => [...prev, { x: clientX, y: clientY }])
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    fillInsidePolygon(contextRef, vertices)
  }

  return (
    <>
      <canvas
        width={width}
        height={height}
        onClick={handleCanvasClick}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </>
  )
}

export default Canvas
