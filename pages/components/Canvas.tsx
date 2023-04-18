import React, { useRef, useEffect } from "react";

interface Vertex {
  x: number;
  y: number;
}

interface Block {
  name: string;
  color: string;
}

const Canvas: React.FC<{
  isInside: (point: Vertex, vertices: Vertex[], measure?: boolean) => boolean;
}> = ({ isInside: propsInside }) => {
  const isInside = (point: Vertex, vertices: Vertex[], measure?: boolean) => {
    const result = propsInside(point, vertices, measure);
    return result;
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = React.useState<boolean>(false);
  const [vertices, setVertices] = React.useState<Vertex[]>([]);

  const generateColor = (): string => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const drawGrid = () => {
    if (!canvasRef.current || !contextRef.current) {
      return;
    }

    const context = contextRef.current;
    const blockSize = 50;
    const rows = 50;
    const cols = 50;

    const blocks: Block[][] = [];

    for (let row = 0; row < rows; row++) {
      const blockRow: Block[] = [];
      const rowName = String.fromCharCode("A".charCodeAt(0) + row);

      for (let col = 0; col < cols; col++) {
        const blockName = rowName + (col + 1);
        const blockColor = generateColor();

        context.fillStyle = blockColor;
        context.fillRect(
          col * blockSize,
          row * blockSize,
          blockSize,
          blockSize
        );

        context.fillStyle = "#000";
        context.font = "16px Arial";
        context.fillText(blockName, col * blockSize + 20, row * blockSize + 30);

        blockRow.push({ name: blockName, color: blockColor });
      }

      blocks.push(blockRow);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = 1000;
    canvas.height = 1000;
    canvas.style.width = `${1000}px`;
    canvas.style.height = `${1000}px`;

    const context = canvas.getContext("2d");
    if (context) {
      context.lineCap = "round";
      context.strokeStyle = "red";
      context.lineWidth = 5;
      contextRef.current = context;
    }
    drawGrid();
  }, []);

  const startDrawing = (nativeEvent: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = nativeEvent;
    if (contextRef.current) {
      setVertices([]);
      contextRef.current.beginPath();
      contextRef.current.moveTo(clientX, clientY);
      setVertices((prev) => [...prev, { x: clientX, y: clientY }]);
      setIsDrawing(true);
    }
  };

  const finishDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
    }
    setIsDrawing(false);
  };

  const draw = (nativeEvent: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) {
      return;
    }
    const { clientX, clientY } = nativeEvent;
    contextRef.current.lineWidth = 1;
    contextRef.current.lineTo(clientX, clientY);
    contextRef.current.stroke();
    setVertices((prev) => [...prev, { x: clientX, y: clientY }]);
  };

  const isBlockInsidePolygon = (
    vertices: Vertex[],
    topLeft: Vertex,
    blockSize: number
  ): boolean => {
    const topRight: Vertex = { x: topLeft.x + blockSize, y: topLeft.y };
    const bottomLeft: Vertex = { x: topLeft.x, y: topLeft.y + blockSize };
    const bottomRight: Vertex = {
      x: topLeft.x + blockSize,
      y: topLeft.y + blockSize,
    };

    return (
      isInside(topLeft, vertices) ||
      isInside(topRight, vertices) ||
      isInside(bottomLeft, vertices) ||
      isInside(bottomRight, vertices)
    );
  };

  // 개선 필요
  const fillInnerBlocks = () => {
    if (!canvasRef.current || !contextRef.current || vertices.length === 0) {
      return;
    }

    const context = contextRef.current;
    const blockSize = 50;
    const rows = 50;
    const cols = 50;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const topLeft: Vertex = {
          x: col * blockSize,
          y: row * blockSize,
        };

        const isInsidePolygon = isBlockInsidePolygon(
          vertices,
          topLeft,
          blockSize
        );

        if (isInsidePolygon) {
          context.fillStyle = "#032134";
          context.fillRect(
            col * blockSize,
            row * blockSize,
            blockSize,
            blockSize
          );

          // 블록 이름을 다시 그립니다.
          context.fillStyle = "#000";
          context.font = "16px Arial";
          context.fillText(
            String.fromCharCode("A".charCodeAt(0) + row) + (col + 1),
            col * blockSize + 20,
            row * blockSize + 30
          );
        }
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = e;
    const point: Vertex = { x: clientX, y: clientY };
    const isInsidePolygon = isInside(point, vertices, true);

    if (isInsidePolygon) {
      console.log("Selected point is inside the polygon");
      fillInnerBlocks();
    } else {
      console.log("Selected point is outside the polygon");
    }
  };

  return (
    <>
      <canvas
        onClick={handleCanvasClick}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </>
  );
};

export default Canvas;
