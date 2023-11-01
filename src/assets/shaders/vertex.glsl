attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoords;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vFragPosition;
varying highp vec3 vNormal;

void main(void) {
    vFragPosition = vec3(uModelMatrix * vec4(aVertexPosition, 1.0));
    vTextureCoord = aTextureCoords;
    vNormal = (uModelMatrix * vec4(aVertexNormal, 0)).xyz;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
}
