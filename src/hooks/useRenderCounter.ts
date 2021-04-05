import { useRef } from "react";

export const useRenderCounter = () => {
  const counter = useRef(0);
  counter.current++;
  return counter.current;
};
