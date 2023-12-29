import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useEffect, useState } from "react";

const formatTime = (date: Date) => {
  return `${formatDistanceToNow(date, {
    includeSeconds: true,
  })} ago`;
};

const useFormatDistanceToNow = (date: Date) => {
  const [formattedTime, setFormattedTime] = useState<string | null>(null);
  useEffect(() => {
    setFormattedTime(formatTime(date));
    const interval = setInterval(() => {
      setFormattedTime(formatTime(date));
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return formattedTime;
};

export default useFormatDistanceToNow;
