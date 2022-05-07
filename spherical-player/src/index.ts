import { projectionMatrix, sphere, viewMatrix } from "./geometry.js";
import { cos, PI, sin, vec3, add, sub, cross, norm } from "./matrix.js";

const canvas = document.querySelector("canvas")!;
const gl = canvas.getContext("webgl")!;

const vertexShaderSrc = `
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;

  uniform mat4 M;
  uniform mat4 V;
  uniform mat4 P;

  varying highp vec2 texCoord;
  varying highp float shade;

  void main(void) {
    gl_Position = P * V * M * vec4(position, 1);
    texCoord = uv;
    vec4 normal_modelspace = M * vec4(normal, 0);
    shade = max(dot(normalize(normal_modelspace.xyz), vec3(0,0,1)), 0.0);
  }
`;

const fragmentShaderSrc = `
  varying highp vec2 texCoord;
  varying highp float shade;

  uniform sampler2D vSampler;

  void main(void) {
    highp vec3 diffuse_color = shade * texture2D(vSampler, texCoord).rgb;
    highp vec3 ambient_color = 0.1 * texture2D(vSampler, texCoord).rgb;
    gl_FragColor = vec4(diffuse_color + ambient_color, 1.0);
  }
`;

const program = gl.createProgram()!;

const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
gl.shaderSource(vertexShader, vertexShaderSrc);
gl.compileShader(vertexShader);

if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  console.log(gl.getShaderInfoLog(vertexShader));
}

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
gl.shaderSource(fragmentShader, fragmentShaderSrc);
gl.compileShader(fragmentShader);

if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  console.log(gl.getShaderInfoLog(fragmentShader));
}

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.log(gl.getProgramInfoLog(program));
}

gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

const positions = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positions);
const attribPosition = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(attribPosition);
gl.vertexAttribPointer(attribPosition, 3, gl.FLOAT, false, 0, 0);

const uvs = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvs);
const attribUV = gl.getAttribLocation(program, "uv");
gl.enableVertexAttribArray(attribUV);
gl.vertexAttribPointer(attribUV, 2, gl.FLOAT, false, 0, 0);

const normals = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normals);
const attribNormal = gl.getAttribLocation(program, "normal");
gl.enableVertexAttribArray(attribNormal);
gl.vertexAttribPointer(attribNormal, 3, gl.FLOAT, false, 0, 0);

const uniformM = gl.getUniformLocation(program, "M");
const uniformV = gl.getUniformLocation(program, "V");
const uniformP = gl.getUniformLocation(program, "P");
const uniformVSampler = gl.getUniformLocation(program, "vSampler");

const texture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.RGBA,
  1,
  1,
  0,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  new Uint8Array([0, 0, 0, 255])
);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

const camera = {
  alpha: PI / 4,
  theta: PI,
  phi: -PI / 3,
  pos: [0, 30 * sin(PI / 3), 30 * cos(PI / 3)] as vec3,
  get dir(): vec3 {
    return [
      cos(this.phi) * sin(this.theta),
      sin(this.phi),
      cos(this.phi) * cos(this.theta),
    ];
  },
  get right(): vec3 {
    return [sin(this.theta - PI / 2), 0, cos(this.theta - PI / 2)];
  },
  get up(): vec3 {
    return cross(this.right, this.dir);
  },
};

const model = sphere(10, 25, 50);
console.log(model);

let theta = 0;
setInterval(() => {
  theta += 0.05;
}, 30);

const speed = 0.05;
window.onkeydown = (e) => {
  switch (e.key) {
    case "i":
      camera.pos = add(camera.pos, camera.dir);
      break;
    case "o":
      camera.pos = sub(camera.pos, camera.dir);
      break;
    case "ArrowUp":
      camera.phi += speed;
      camera.phi = Math.min(Math.max(camera.phi, -PI / 2), PI / 2);
      break;
    case "ArrowDown":
      camera.phi -= speed;
      camera.phi = Math.min(Math.max(camera.phi, -PI / 2), PI / 2);
      break;
    case "ArrowLeft":
      camera.theta += speed;
      break;
    case "ArrowRight":
      camera.theta -= speed;
      break;
    case "w":
      camera.pos = add(camera.pos, camera.up);
      break;
    case "s":
      camera.pos = sub(camera.pos, camera.up);
      break;
    case "a":
      camera.pos = sub(camera.pos, camera.right);
      break;
    case "d":
      camera.pos = add(camera.pos, camera.right);
      break;
  }
};

const video = document.createElement("video");
video.autoplay = false;
video.loop = true;

let playing = false;
let timeupdate = false;
video.onplaying = () => {
  playing = true;
};
video.ontimeupdate = () => {
  timeupdate = true;
};

video.src = "video.mp4";
canvas.onclick = () => video.play();

requestAnimationFrame(function render() {
  gl.useProgram(program);

  gl.uniform1i(uniformVSampler, 0);

  gl.uniformMatrix4fv(
    uniformM,
    false,
    // prettier-ignore
    [
      cos(theta), 0, -sin(theta), 0,
      0, 1, 0, 0,
      sin(theta), 0, cos(theta), 0,
      0, 0, 0, 1
    ]
  );

  gl.uniformMatrix4fv(
    uniformV,
    false,
    viewMatrix(camera.pos, camera.dir, camera.right)
  );

  gl.uniformMatrix4fv(
    uniformP,
    false,
    projectionMatrix(camera.alpha, 0.1, 100)
  );

  if (playing && timeupdate) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, positions);
  gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, uvs);
  gl.bufferData(gl.ARRAY_BUFFER, model.uvs, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, normals);
  gl.bufferData(gl.ARRAY_BUFFER, model.normals, gl.STATIC_DRAW);

  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, model.count);

  requestAnimationFrame(render);
});
