import React from "react";
import Canvas from "./components/Canvas";

interface Vertex {
  x: number;
  y: number;
}

const Drawing: React.FC = () => {
  const windingNumber = (point: Vertex, polygon: Vertex[]): boolean => {
    let windingNumber = 0;
    const n = polygon.length;
    for (let i = 0; i < n; i++) {
      const edgeStart = polygon[i];
      const edgeEnd = polygon[(i + 1) % n];
      if (edgeStart.y <= point.y) {
        if (edgeEnd.y > point.y && isLeftOf(point, edgeStart, edgeEnd) > 0) {
          windingNumber++;
        }
      } else {
        if (edgeEnd.y <= point.y && isLeftOf(point, edgeStart, edgeEnd) < 0) {
          windingNumber--;
        }
      }
    }
    return windingNumber !== 0;
  };

  const isLeftOf = (point: Vertex, start: Vertex, end: Vertex): number => {
    return (
      (end.x - start.x) * (point.y - start.y) -
      (end.y - start.y) * (point.x - start.x)
    );
  };

  return (
    <>
      <Canvas isInside={windingNumber}></Canvas>
    </>
  );
};

export default Drawing;
