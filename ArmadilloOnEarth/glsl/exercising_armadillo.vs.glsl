varying vec3 color;
uniform float originalArmPosition;
uniform float LeftLegPosition;
uniform float LeftUpperLegPosition;
uniform float RightLegPosition;
uniform float RightUpperLegPosition;

void main() {
	// No lightbulb, but we still want to see the armadillo!
	vec3 l = vec3(0.0, 0.0, -1.0);
	color = vec3(1.0) * dot(l, normal);

  // ARMS
	vec3 armPoint = vec3(0.0, 2.5, -0.2);

	mat4 armFrame = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0), 
  vec4(0.0, 0.0, 1.0, 0.0),
  vec4(armPoint, 1.0));

	mat4 inverseArmFrame = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0), 
  vec4(0.0, 0.0, 1.0, 0.0),
  vec4(-armPoint, 1.0));

	vec4 armPosition = inverseArmFrame * vec4(position, 1.0);

  mat4 rotationArmX = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, cos(originalArmPosition), -sin(originalArmPosition), 0.0),
	vec4(0.0, sin(originalArmPosition), cos(originalArmPosition), 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));

  mat4 rotationArmY = mat4(
  vec4(cos(originalArmPosition), 0.0, sin(originalArmPosition), 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0),
	vec4(-sin(originalArmPosition), 0.0, cos(originalArmPosition), 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));

  mat4 rotationArmZ = mat4(
  vec4(cos(originalArmPosition), sin(originalArmPosition), 0.0, 0.0), 
  vec4(-sin(originalArmPosition), cos(originalArmPosition), 0.0, 0.0), 
  vec4(0.0, 0.0, 1.0, 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));

  // LEGS
  vec3 legPoint = vec3(0.0, 0.8, -0.2);

	mat4 legFrame = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0), 
  vec4(0.0, 0.0, 1.0, 0.0),
  vec4(legPoint, 1.0));

	mat4 inverseLegFrame = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0), 
  vec4(0.0, 0.0, 1.0, 0.0),
  vec4(-legPoint, 1.0));

	// multiply by inverse Leg Frame because we want to bring the armadillo up to the leg coordinates
	vec4 legPosition = inverseLegFrame * vec4(position, 1.0);

  mat4 rotationLeftLegX = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, cos(LeftLegPosition), -sin(LeftLegPosition), 0.0),
	vec4(0.0, sin(LeftLegPosition), cos(LeftLegPosition), 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));


  mat4 rotationRightLegX = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, cos(RightLegPosition), -sin(RightLegPosition), 0.0),
	vec4(0.0, sin(RightLegPosition), cos(RightLegPosition), 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));


  // UPPER LEGS
  vec3 upperLegPoint = vec3(0.0, 1.6, -0.2);

	mat4 upperLegFrame = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0), 
  vec4(0.0, 0.0, 1.0, 0.0),
  vec4(upperLegPoint, 1.0));

	mat4 inverseUpperLegFrame = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, 1.0, 0.0, 0.0), 
  vec4(0.0, 0.0, 1.0, 0.0),
  vec4(-upperLegPoint, 1.0));

	vec4 upperLegPosition = inverseUpperLegFrame * vec4(position, 1.0);

  mat4 rotationLeftUpperLegX = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, cos(LeftUpperLegPosition), -sin(LeftUpperLegPosition), 0.0),
	vec4(0.0, sin(LeftUpperLegPosition), cos(LeftUpperLegPosition), 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));

  mat4 rotationRightUpperLegX = mat4(
  vec4(1.0, 0.0, 0.0, 0.0), 
  vec4(0.0, cos(RightUpperLegPosition), -sin(RightUpperLegPosition), 0.0),
	vec4(0.0, sin(RightUpperLegPosition), cos(RightUpperLegPosition), 0.0),
  vec4(0.0, 0.0, 0.0, 1.0));

  // NOTE: hands are around point 1.5
	if (abs(position.x) > 0.6 && abs(position.x) < 2.5 && position.z > -3.0 && position.y > 1.8) {
		armPosition = rotationArmY * armPosition;
	}

  // Identifying the leg
	if (position.y > 0.0 && position.y < 0.8) {
    if (position.x > 0.0) {
      legPosition = rotationLeftLegX * legPosition;
    } else {
      legPosition = rotationRightLegX * legPosition;
    }
	}

  // Identifying the upper leg
	if (position.y > 0.8 && position.y < 1.6) {
    if (position.x > 0.0) {
      upperLegPosition = rotationLeftUpperLegX * upperLegPosition;
    } else {
      upperLegPosition = rotationRightUpperLegX * upperLegPosition;
    }
	}

	vec4 finalPosition = upperLegFrame * upperLegPosition + legFrame * legPosition + armFrame * armPosition;

	// Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
	gl_Position = projectionMatrix * viewMatrix * finalPosition;
}
