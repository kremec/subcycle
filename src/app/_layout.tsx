import { Fragment, type FC } from "react";

import { AppRoot } from "@/components/app-root";
import { AppStatusBar } from "@/components/app-status-bar";

const RootLayout: FC = () => {
  return (
    <Fragment>
      <AppStatusBar />
      <AppRoot />
    </Fragment>
  );
};

export default RootLayout;
