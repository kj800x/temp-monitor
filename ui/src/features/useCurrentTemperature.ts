import { useState } from "react";
import {
  useLiveTemperatureSubscription,
  useRecentDataQuery,
} from "../generated/graphql";

export const useCurrentTemperature = () => {
  const [temp, setTemp] = useState<null | number>(null);

  useRecentDataQuery({
    onCompleted: (data) => {
      if (!temp && data.data.length > 0) {
        setTemp(data.data[data.data.length - 1].temperature);
      }
    },
  });

  useLiveTemperatureSubscription({
    onSubscriptionData: (data) => {
      setTemp(data.subscriptionData.data!.liveTemperature!.temperature);
    },
  });

  return temp;
};
