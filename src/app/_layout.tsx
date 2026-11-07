import { Fragment, type FC } from "react";

import { AppRoot } from "@/components/app-root";
import { AppStatusBar } from "@/components/app-status-bar";

export const unstable_settings = { anchor: "index" };

const RootLayout: FC = () => {
  return (
    <Fragment>
      <AppStatusBar />
      <AppRoot />
    </Fragment>
  );
};

export default RootLayout;
