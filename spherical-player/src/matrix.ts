export type vec3 = [number, number, number];
export type vec4 = [number, number, number, number];
export type mat4 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

export const { cos, sin, tan, sqrt, PI } = Math;

export function add(a: vec3, b: vec3): vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function sub(a: vec3, b: vec3): vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function norm(v: vec3): number {
  return sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

export function cross(a: vec3, b: vec3): vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function apply(m: mat4, v: vec4) {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3] * v[3],
    m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7] * v[3],
    m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11] * v[3],
    m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15] * v[3],
  ];
}

export function mult(a: mat4, b: mat4): mat4 {
  const res: mat4 = Array<number>(16).fill(0) as mat4;
  for (let i = 0; i < 4; ++i) {
    for (let j = 0; j < 4; ++j) {
      for (let k = 0; k < 4; ++k) {
        res[i + 4 * j] += a[i + 4 * k] * b[k + 4 * j];
      }
    }
  }
  return res;
}
