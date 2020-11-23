import React, { useState } from "react";
import { Value } from "../types";
import { useRenderCounter } from "../hooks/useRenderCounter";

const value = new Map<PropertyKey, string>();
value.set("name", "Lowe");
value.set("password", "1234");
type Observer<T> = {
  key: string;
  id: string;
  onChange: (value: T) => void;
};
type FieldValue = string | number | boolean;
const observers = new Set<Observer<FieldValue>>();
const notifyObservers = (key: PropertyKey, value: any) => {
  observers.forEach((obs) => obs.onChange(value));
};
const handler: ProxyHandler<Map<PropertyKey, string>> = {
  get(target, prop, receiver) {
    let value = Reflect.get(target, prop, receiver);
    return typeof value === "function" ? value.bind(target) : value;
  },
  set: function (
    target: Map<PropertyKey, string>,
    key: PropertyKey,
    value: any,
    receiver: any
  ): boolean {
    notifyObservers(key, value);
    return Reflect.set(target, key, value, receiver);
  },
};

export const Proyxtest = () => {
  const values = new Proxy(value, handler);
  const [_, re] = useState();
  const onChange = () => {
    re(undefined);
  };
  observers.add({ key: "name", onChange, id: "123" });
  const r = useRenderCounter();
  const onPress = () => {
    values.set("name", "Patrik");
  };
  values.set("name", "Michael");
  return (
    <div>
      {r}
      {values.get("name")}
      {values.get("password")}
      <button onClick={onPress}>Change Name</button>
    </div>
  );
};
