// src/utils/formatTime.ts
import dayjs from "dayjs";

export const formatTime = (timestamp: number | undefined) => {
  return timestamp ? dayjs(timestamp).format("HH:mm:ss") : "-";
};
