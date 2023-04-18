import { atom } from "recoil"
import { Point } from "../components/Canvas"

export const vertexLengthState = atom({
  key: "vertexLength",
  default: 0,
})

export const calcCountState = atom({
  key: "calcCount",
  default: 0,
})
