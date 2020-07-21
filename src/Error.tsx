export type Error = {
  message?: string;
  value: boolean;
};

export const errorEquals = (oldError: Error | null, newError: Error | null) => {
  
  if (oldError === null && newError === null) {
    return true;
  }

  if (oldError === null && newError !== null) {
    return false;
  }

  if (oldError !== null && newError === null) {
    return false;
  }

  if (oldError!.value !== newError!.value) {
    return false;
  }

  if (oldError!.message !== newError!.message) {
    return false;
  }

};
