import React from "react";
import Canvas from "./components/Canvas";

interface Vertex {
  x: number;
  y: number;
}

const Drawing: React.FC = () => {
  const rayCasting = (
    point: Vertex,
    vertices: Vertex[],
    measure = false
  ): boolean => {
    let inside = false;
    let count = 0;

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i].x;
      const yi = vertices[i].y;
      const xj = vertices[j].x;
      const yj = vertices[j].y;

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

      if (intersect) {
        inside = !inside;
        ++count;
      }
    }

    if (measure) {
      console.log(count);
    }

    return inside;
  };

  return (
    <>
      <Canvas isInside={rayCasting}></Canvas>
    </>
  );
};

export default Drawing;
