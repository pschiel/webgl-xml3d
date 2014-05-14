attribute vec3 position;
attribute vec3 normal;
attribute vec3 color;
attribute vec2 texcoord;

varying vec3 fragNormal;

uniform mat4 modelViewProjectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat3 modelViewMatrixN;

uniform float lod;
uniform float baseunit;

void main(void) {
	vec3 newpos = position;
	float lodpow = pow(2.0, lod);
	newpos = floor(newpos / lodpow / baseunit) * lodpow * baseunit;
    gl_Position = modelViewProjectionMatrix * vec4(newpos, 1.0);
	fragNormal = normalize(modelViewMatrixN * newpos);
}
