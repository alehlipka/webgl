varying highp vec2 vTextureCoord;
varying highp vec3 vFragPosition;
varying highp vec3 vNormal;

uniform sampler2D uSampler;

precision highp float;

void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
    highp vec3 normal = normalize(vNormal);

    highp vec3 Ambient = vec3(0.2);

    highp vec3 DirectionalVector = normalize(vec3(3, 5, 1));
    highp vec3 DirectionalColor = vec3(2);
    highp vec3 Directional = DirectionalColor * max(dot(normal, DirectionalVector), 0.0);

    gl_FragColor = vec4(texelColor.rgb * (Ambient + Directional), texelColor.a);
}
