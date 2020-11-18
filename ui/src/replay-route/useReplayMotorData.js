import { useQuery } from "@apollo/react-hooks";
import { FETCH_REPLAY_DATA } from "../queries";

export const useReplayMotorData = ({ file }) => {
  const { data, loading, error } = useQuery(FETCH_REPLAY_DATA, {
    variables: { file },
  });

  return {
    historicalMotorData: data && data.replayData.map((d) => d.data),
    loading,
    error,
  };
};
