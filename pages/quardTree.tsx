import React from "react";
import Canvas from "./components/Canvas";

interface Vertex {
  x: number;
  y: number;
}

const Drawing: React.FC = () => {
  type BoundingBox = { minX: number; maxX: number; minY: number; maxY: number };

  type QuadTreeNode = {
    boundingBox: BoundingBox;
    points: Vertex[];
    nw?: QuadTreeNode;
    ne?: QuadTreeNode;
    sw?: QuadTreeNode;
    se?: QuadTreeNode;
  };

  const createBoundingBox = (vertices: Vertex[]): BoundingBox => {
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    vertices.forEach(({ x, y }) => {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });

    return { minX, maxX, minY, maxY };
  };

  const createQuadTreeNode = (
    boundingBox: BoundingBox,
    points: Vertex[] = [],
    maxDepth: number = 4,
    depth: number = 0
  ): QuadTreeNode => {
    const node: QuadTreeNode = { boundingBox, points };

    if (depth < maxDepth && points.length > 1) {
      const { minX, maxX, minY, maxY } = boundingBox;
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;

      const nwBox: BoundingBox = { minX, maxX: midX, minY, maxY: midY };
      const neBox: BoundingBox = { minX: midX, maxX, minY, maxY: midY };
      const swBox: BoundingBox = { minX, maxX: midX, minY: midY, maxY };
      const seBox: BoundingBox = { minX: midX, maxX, minY: midY, maxY };

      const nwVertexs: Vertex[] = [];
      const neVertexs: Vertex[] = [];
      const swVertexs: Vertex[] = [];
      const seVertexs: Vertex[] = [];

      points.forEach((point) => {
        if (point.x <= midX) {
          if (point.y <= midY) nwVertexs.push(point);
          else swVertexs.push(point);
        } else {
          if (point.y <= midY) neVertexs.push(point);
          else seVertexs.push(point);
        }
      });

      node.nw = createQuadTreeNode(nwBox, nwVertexs, maxDepth, depth + 1);
      node.ne = createQuadTreeNode(neBox, neVertexs, maxDepth, depth + 1);
      node.sw = createQuadTreeNode(swBox, swVertexs, maxDepth, depth + 1);
      node.se = createQuadTreeNode(seBox, seVertexs, maxDepth, depth + 1);
    }

    return node;
  };

  const pointInBoundingBox = (point: Vertex, box: BoundingBox): boolean => {
    return (
      point.x >= box.minX &&
      point.x <= box.maxX &&
      point.y >= box.minY &&
      point.y <= box.maxY
    );
  };

  const pointInPolygon = (point: Vertex, vertices: Vertex[]): boolean => {
    let intersections = 0;
    const { x, y } = point;

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const { x: xi, y: yi } = vertices[i];
      const { x: xj, y: yj } = vertices[j];

      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        intersections++;
      }
    }

    return intersections % 2 !== 0;
  };

  const searchQuadTree = (
    node: QuadTreeNode,
    point: Vertex
  ): QuadTreeNode | undefined => {
    if (!pointInBoundingBox(point, node.boundingBox)) {
      return undefined;
    }

    if (!node.nw && !node.ne && !node.sw && !node.se) {
      return node;
    }

    return (
      searchQuadTree(node.nw!, point) ||
      searchQuadTree(node.ne!, point) ||
      searchQuadTree(node.sw!, point) ||
      searchQuadTree(node.se!, point)
    );
  };

  const pointInPolygonWithQuadTree = (
    point: Vertex,
    polygonVertices: Vertex[]
  ): boolean => {
    const boundingBox = createBoundingBox(polygonVertices);
    const quadTree = createQuadTreeNode(boundingBox, polygonVertices);

    const containingNode = searchQuadTree(quadTree, point);
    if (!containingNode) {
      return false;
    }

    return pointInPolygon(point, containingNode.points);
  };

  // WIP
  const getVertexsInPolygon = (
    point: Vertex,
    polygonVertices: Vertex[]
  ): boolean => {
    return true;
  };

  return (
    <>
      <Canvas isInside={getVertexsInPolygon}></Canvas>
    </>
  );
};

export default Drawing;
