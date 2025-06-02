import { AlertBar } from "@dhis2/ui";
import {
  NOTIFICATION_CRITICAL,
  NOTIFICATION_SUCCESS,
} from "../utils/constants";

const MyNotification = ({ notification, setNotification }) => {
  const getNotificationContent = () => {
    if (notification?.show) {
      if (notification?.type === NOTIFICATION_CRITICAL)
        return (
          <AlertBar
            critical
            permanent
            onHidden={() =>
              setNotification({ show: false, message: null, type: null })
            }
          >
            {notification?.message}
          </AlertBar>
        );

      if (notification?.type === NOTIFICATION_SUCCESS)
        return (
          <AlertBar
            success
            onHidden={() =>
              setNotification({ show: false, message: null, type: null })
            }
          >
            {notification?.message}
          </AlertBar>
        );
    }
  };

  return (
    <div
      style={{
        bottom: 0,
        position: "fixed",
        maxWidth: "400px",
        left: "40%",
      }}
    >
      {getNotificationContent()}
    </div>
  );
};

export default MyNotification;
