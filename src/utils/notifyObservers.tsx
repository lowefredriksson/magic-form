import React from "react";
import { Observer } from "../types";

export function notifyObservers<T>(
  observers: React.MutableRefObject<Map<number, Observer<T>>>,
  key: string,
  state: T
) {
  observers.current.forEach((observer) => {
    if (observer.key === key) {
      observer.update(state);
    }
  });
}
