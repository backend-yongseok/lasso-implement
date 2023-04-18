import { FC } from "react"
import Navigation from "./Navigation"
import Status from "./Status"

const Layout: FC<{ children: any }> = ({ children }) => {
  return (
    <>
      <div className="grid grid-cols-2 grid-cols-[1fr_minmax(900px,_1fr)_100px] gap-4">
        <main className="">{children}</main>
        <div className="grid grid-rows-2 gap-4">
          <Navigation></Navigation>
          <Status></Status>
        </div>
      </div>
    </>
  )
}

export default Layout
