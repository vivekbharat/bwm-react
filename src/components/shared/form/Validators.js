export const required = value => (value ? undefined : "This Input is Required");
const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or More` : undefined;
export const minLength4 = minLength(4);
