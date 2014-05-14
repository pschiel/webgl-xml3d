#ifdef GL_ES
	precision highp float;
#endif

uniform mat4 viewMatrix;

varying vec3 fragNormal;

void main() {
	gl_FragColor = vec4(fragNormal, 1.0);
}
