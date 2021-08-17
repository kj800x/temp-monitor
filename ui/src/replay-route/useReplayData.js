import { useQuery } from "@apollo/react-hooks";
import { FETCH_REPLAY_DATA } from "../queries";

export const useReplayData = (date) => {
  const { data, loading, error } = useQuery(FETCH_REPLAY_DATA, {
    variables: { date },
  });

  return {
    data: data && data.replayData.map((d) => d.data),
    loading,
    error,
  };
};
