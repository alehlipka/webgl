varying highp vec2 vTextureCoord;
varying highp vec3 vFragPosition;
varying highp vec3 vNormal;

uniform sampler2D uSampler;

precision highp float;

void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    highp vec3 ambientLight = vec3(0.2);
    highp vec3 directionalLightColor = vec3(5);
    highp vec3 directionalVector = normalize(vec3(6, 1, -6) + vFragPosition);

    highp float directional = max(dot(normalize(vNormal), directionalVector), 0.0);
    highp vec3 vLighting = ambientLight + (directionalLightColor * directional);

    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}
