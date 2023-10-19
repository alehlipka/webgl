varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
varying highp vec3 vFragPosition;
varying highp vec3 vNormal;

uniform sampler2D uSampler;

precision highp float;

void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    // ambient
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * vec3(0,10,0);

    // diffuse
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(vec3(0, 0, 10) - vFragPosition);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * vec3(10,0,0);

    vec3 result = (ambient + diffuse) * (texelColor.rgb);

    gl_FragColor = vec4(result, texelColor.a);
}
