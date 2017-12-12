// Shared variable passed to the fragment shader
uniform vec3 eyePosition;
uniform vec3 lightPosition;

void main() {

  mat4 rotationX = mat4(
  vec4(1.0, 0.0, 0.0, 0.0),
  vec4(0.0, 0.0, -1.0, 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));

  mat4 rotationZ = mat4(
  vec4(0.0, 1.0, 0.0, 0.0), 
  vec4(-1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, 0.0, 1.0, 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));

  mat4 translation = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0), 
  vec4(0.0, 0.0, 1.0, 0.0),
  vec4(eyePosition, 1.0));

  vec4 translatedPos = translation * vec4(eyePosition, 1.0);
  float dist = distance(translatedPos.xyz, lightPosition);

  vec3 vUp = vec3(0.0, 1.0, 0.0);
  vec3 w = normalize(translatedPos.xyz - lightPosition);
  vec3 u = normalize(cross(vUp, w));
  vec3 v = cross(w, u);

  mat4 lookAt = mat4(vec4(w, 0.0), vec4(u, 0.0), vec4(v, 0.0), vec4(translatedPos.xyz, 1.0));

  mat4 scaling = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, dist * 0.5, 0.0, 0.0), 
  vec4(0.0, 0.0, 1.0, 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));

  gl_Position = projectionMatrix * viewMatrix * lookAt * rotationX * rotationZ * scaling * vec4(position, 1.0);
}
