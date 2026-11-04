import { Fragment, type FC } from "react";

import { useAppBootstrap } from "@/bootstrap/use-app-bootstrap";
import { AppLoadingScreen } from "@/components/app-loading-screen";
import { AppTabs } from "@/components/app-tabs";
import { NotificationLifecycle } from "@/notifications/notification-lifecycle";

export const AppRoot: FC = () => {
  const { ready } = useAppBootstrap();

  if (!ready) {
    return <AppLoadingScreen />;
  }

  return (
    <Fragment>
      <NotificationLifecycle />
      <AppTabs />
    </Fragment>
  );
};
