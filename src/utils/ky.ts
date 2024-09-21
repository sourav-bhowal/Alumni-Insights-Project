import ky from "ky";

// CREATING A KY INSTANCE TO COVERT JSON DATE TO DATE OBJECT
export const kyInstance = ky.create({
  parseJson: (text) =>
    JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) return new Date(value);
      return value;
    }),
});
