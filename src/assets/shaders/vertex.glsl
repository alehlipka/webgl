attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoords;

uniform mat4 uNormalMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
varying highp vec3 vFragPosition;
varying highp vec3 vNormal;

void main(void) {
    vFragPosition = vec3(uModelMatrix * vec4(aVertexPosition, 1.0));
    vTextureCoord = aTextureCoords;
    vNormal = aVertexNormal;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
//    highp vec3 ambientLight = vec3(0.05, 0.05, 0.05);
//    highp vec3 directionalLightColor = vec3(1, 1, 1);
//    highp vec3 directionalVector = normalize(vec3(0.5, 0.0, 0.5));
//    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
//    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
//    vLighting = ambientLight + (directionalLightColor * directional);
}
