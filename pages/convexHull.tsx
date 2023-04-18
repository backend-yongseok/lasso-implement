import React from "react";
import Canvas from "./components/Canvas";

interface Vertex {
  x: number;
  y: number;
}

const Drawing: React.FC = () => {
  const isPointInsidePolygon = (point: Vertex, polygon: Vertex[]): boolean => {
    // Convex Hull을 구합니다.
    const hull = getConvexHull(polygon);

    // 주어진 점이 Convex Hull 내부에 있는지 검사합니다.
    return isPointInsideConvexHull(point, hull);
  };

  const getConvexHull = (points: Vertex[]): Vertex[] => {
    // x 좌표가 가장 작은 점을 기준으로 정렬합니다.
    const sortedPoints = points.sort((a, b) => a.x - b.x);

    // 볼록 껍질을 만듭니다.
    const upperHull = buildHull(sortedPoints);
    const lowerHull = buildHull(sortedPoints.reverse());

    // 볼록 껍질을 합칩니다.
    return upperHull.concat(lowerHull.slice(1, -1));
  };

  const buildHull = (points: Vertex[]): Vertex[] => {
    const hull: Vertex[] = [];

    for (const point of points) {
      while (
        hull.length >= 2 &&
        ccw(hull[hull.length - 2], hull[hull.length - 1], point) <= 0
      ) {
        hull.pop();
      }
      hull.push(point);
    }

    return hull;
  };

  const isPointInsideConvexHull = (point: Vertex, hull: Vertex[]): boolean => {
    // 볼록 껍질의 모든 선분과 주어진 점을 연결합니다.
    const lineSegments = hull.map((p, i) => [p, hull[(i + 1) % hull.length]]);

    // 주어진 점이 모든 선분의 왼쪽에 있는지 검사합니다.
    return lineSegments.every(([a, b]) => ccw(a, b, point) >= 0);
  };

  // 세 점의 위치 관계를 구합니다. (ccw: counter clockwise)
  const ccw = (a: Vertex, b: Vertex, c: Vertex): number => {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  };

  return (
    <>
      <Canvas isInside={isPointInsidePolygon}></Canvas>
    </>
  );
};

export default Drawing;
