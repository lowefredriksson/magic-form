const renders: { [Key: string]: number; } = {};
export const registerRender = (name: string) => {
  if (renders[name] === undefined) {
    renders[name] = 0;
  }
  renders[name] = renders[name] + 1;
  console.log("renders", renders);
};
