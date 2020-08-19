import React from "react";
import { Value } from "./types";

const value = new Map<PropertyKey, string>();
value.set("name", "Lowe");
value.set("password", "1234");
const notifyObservers = (key: PropertyKey) => {};
const handler: ProxyHandler<Map<PropertyKey, string>> = {
  get: Reflect.get,
  set: function (
    target: Map<PropertyKey, string>,
    key: PropertyKey,
    value: any,
    receiver: any
  ): boolean {
    notifyObservers(key);
    return Reflect.set(target, key, value, receiver);
  },
};

export const Proyxtest = () => {
  const values = new Proxy(value, handler);
  //values.set("name", "Michael");
  return (
    <div>
      {values.get("name")}
      {values.get("password")}
    </div>
  );
};
