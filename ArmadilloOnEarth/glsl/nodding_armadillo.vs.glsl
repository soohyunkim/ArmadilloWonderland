// Shared variable passed to the fragment shader
varying vec3 color;

// Constant set via your javascript code
uniform float headPosition;

void main() {
	// No lightbulb, but we still want to see the armadillo!
	vec3 l = vec3(0.0, 0.0, -1.0);
	color = vec3(1.0) * dot(l, normal);

	// neckFrame -> neckPos -> rotate -> back to Body position
	vec3 neckPoint = vec3(0.0, 2.5, -0.2);

	mat4 neckFrame = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0), 
  vec4(0.0, 0.0, 1.0, 0.0),
  vec4(neckPoint, 1.0));

	mat4 inverseNeckFrame = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0), 
  vec4(0.0, 0.0, 1.0, 0.0),
  vec4(-neckPoint, 1.0));

	// multiply by inverse Neck Frame because we want to bring the armadillo up to the neck coordinates
	vec4 neckPosition = inverseNeckFrame * vec4(position, 1.0);

  mat4 rotationX = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, cos(headPosition), -sin(headPosition), 0.0),
	vec4(0.0, sin(headPosition), cos(headPosition), 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));

  mat4 rotationY = mat4(
  vec4(cos(headPosition), 0.0, sin(headPosition), 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0),
	vec4(-sin(headPosition), 0.0, cos(headPosition), 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));

  mat4 rotationZ = mat4(
  vec4(cos(headPosition), sin(headPosition), 0.0, 0.0), 
  vec4(-sin(headPosition), cos(headPosition), 0.0, 0.0), 
  vec4(0.0, 0.0, 1.0, 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));

	// Identifying the head
	if (position.z < -0.33 && abs(position.x) < 0.46) {
		neckPosition = rotationX * neckPosition;
	}
	vec4 finalPosition = neckFrame * neckPosition;

	// Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
	gl_Position = projectionMatrix * viewMatrix * finalPosition;
}
