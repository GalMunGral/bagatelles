export function randomInt(range: number) {
  return Math.floor(Math.random() * range);
}

export function randomColor() {
  return `rgb(${randomInt(256)}, ${randomInt(256)}, ${randomInt(256)})`;
}
