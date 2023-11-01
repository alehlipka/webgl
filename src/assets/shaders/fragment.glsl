varying highp vec2 vTextureCoord;
varying highp vec3 vModelPosition;
varying highp vec3 vNormal;
varying highp vec3 vCameraPosition;

uniform sampler2D uSampler;

precision highp float;

void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
    highp vec3 normal = normalize(vNormal);

    highp vec3 Ambient = vec3(0.2);

    highp vec3 DirectionalVector = normalize(vec3(3, 5, 1));
    highp vec3 DirectionalColor = vec3(1);
    highp vec3 Directional = DirectionalColor * max(dot(normal, DirectionalVector), 0.0);

    highp float SpecularShininess = 30.0;
    highp vec3 SpecularLightPosition = vec3(0, 0, 0);
    highp vec3 SpecularColor = vec3(2);
    highp vec3 SpecularToFragmentDistance = normalize(SpecularLightPosition - vModelPosition);
    highp vec3 SpecularReflection = normalize(2.0 * dot(normal, SpecularToFragmentDistance) * normal - SpecularToFragmentDistance);
    highp vec3 SpecularToCameraDistance = normalize(vCameraPosition - vModelPosition);
    float SpecularCosAngle = pow(clamp(dot(SpecularReflection, SpecularToCameraDistance), 0.0, 1.0), SpecularShininess);
    highp vec3 Specular = SpecularColor * SpecularCosAngle;

    gl_FragColor = vec4(texelColor.rgb * (Ambient + Directional + Specular), texelColor.a);
}
