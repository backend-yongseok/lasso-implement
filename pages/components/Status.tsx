import { FC } from "react"
import { useRecoilValue } from "recoil"
import {
  vertexLengthState,
  calcCountState,
  verticesState,
} from "../stores/atoms"

const Status: FC = () => {
  const vertexLength = useRecoilValue(vertexLengthState)
  const calcCount = useRecoilValue(calcCountState)

  return (
    <div>
      <p>선의 길이: {vertexLength} </p>
      <p>계산 횟수: {calcCount * vertexLength} </p>
    </div>
  )
}

export default Status
