import { FC } from "react";
import Navigation from "./Navigation";

const Layout: FC<{ children: any }> = ({ children }) => {
  return (
    <>
      <div className="grid grid-cols-2 grid-cols-[1fr_minmax(900px,_1fr)_100px] gap-4">
        <main className="">{children}</main>
        <Navigation></Navigation>
      </div>
    </>
  );
};

export default Layout;
