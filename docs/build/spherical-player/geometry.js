import { cos, cross, mult, PI, sin, tan, sub } from "./matrix.js";
export function viewMatrix(pos, dir, right) {
    const up = cross(right, dir);
    // prettier-ignore
    return mult([
        right[0], up[0], -dir[0], 0,
        right[1], up[1], -dir[1], 0,
        right[2], up[2], -dir[2], 0,
        0, 0, 0, 1
    ], [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        -pos[0], -pos[1], -pos[2], 1
    ]);
}
export function projectionMatrix(angle, n, f) {
    const L = n * tan(angle / 2);
    // prettier-ignore
    return [
        n / L, 0, 0, 0,
        0, n / L, 0, 0,
        0, 0, -(f + n) / (f - n), -1,
        0, 0, -2 * f * n / (f - n), 0
    ];
}
export function sphere(r, m, n) {
    let vertices = [];
    let normals = [];
    let uvs = [];
    for (let i = 0; i < m; ++i) {
        for (let j = 0; j < n; ++j) {
            const phi1 = (PI / m) * i;
            const phi2 = (PI / m) * (i + 1);
            const theta1 = ((2 * PI) / n) * j + PI;
            const theta2 = ((2 * PI) / n) * (j + 1) + PI;
            const tl = [
                r * sin(phi1) * sin(theta1),
                r * cos(phi1),
                r * sin(phi1) * cos(theta1),
            ];
            const tr = [
                r * sin(phi1) * sin(theta2),
                r * cos(phi1),
                r * sin(phi1) * cos(theta2),
            ];
            const bl = [
                r * sin(phi2) * sin(theta1),
                r * cos(phi2),
                r * sin(phi2) * cos(theta1),
            ];
            const br = [
                r * sin(phi2) * sin(theta2),
                r * cos(phi2),
                r * sin(phi2) * cos(theta2),
            ];
            vertices = vertices.concat(tl, bl, tr, tr, bl, br);
            const s = sub(br, bl);
            const t = sub(tl, bl);
            const normal = cross(s, t);
            normals = normals.concat(normal, normal, normal, normal, normal, normal);
            const tl_uv = [j / n, i / m];
            const tr_uv = [(j + 1) / n, i / m];
            const bl_uv = [j / n, (i + 1) / m];
            const br_uv = [(j + 1) / n, (i + 1) / m];
            uvs = uvs.concat(tl_uv, bl_uv, tr_uv, tr_uv, bl_uv, br_uv);
        }
    }
    return {
        count: m * n * 6,
        vertices: new Float32Array(vertices),
        normals: new Float32Array(normals),
        uvs: new Float32Array(uvs),
    };
}
