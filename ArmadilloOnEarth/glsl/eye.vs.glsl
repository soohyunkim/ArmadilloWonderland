// Shared variable passed to the fragment shader
varying vec3 color;
uniform vec3 eyePosition;
uniform vec3 lightPosition;

#define MAX_EYE_DEPTH 0.15

void main() {
  // simple way to color the pupil where there is a concavity in the sphere
  // position is in local space, assuming radius 1
  float d = min(1.0 - length(position), MAX_EYE_DEPTH);
  color = mix(vec3(1.0), vec3(0.0), d * 1.0 / MAX_EYE_DEPTH);

  mat4 rotationX = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, 0.0, -1.0, 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));

  mat4 rotationY = mat4(
  vec4(0.0, 0.0, -1.0, 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0), 
  vec4(1.0, 0.0, 0.0, 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));

  mat4 translation = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0), 
  vec4(0.0, 0.0, 1.0, 0.0),
  vec4(eyePosition, 1.0));

  mat4 scaling = mat4(
  vec4(0.05, 0.0, 0.0, 0.0), 
  vec4(0.0, 0.05, 0.0, 0.0), 
  vec4(0.0, 0.0, 0.05, 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));

  vec3 vUp = vec3(0.0, 1.0, 0.0);
  vec3 w = normalize(eyePosition - lightPosition);
  vec3 u = normalize(cross(vUp, w));
  vec3 v = cross(w, u);

  mat4 lookAt = mat4(vec4(w, 0.0), vec4(u, 0.0), vec4(v, 0.0), vec4(eyePosition, 1.0));

  // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
  gl_Position = projectionMatrix * viewMatrix * translation * lookAt * rotationY * rotationX * scaling * vec4(position, 1.0);
}
