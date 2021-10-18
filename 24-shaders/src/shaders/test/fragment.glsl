precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 textureColor = texture2D(uTexture,vUv);
    textureColor.rgb *= vElevation  + 0.5;
    // gl_FragColor = vec4(0.015, vRandom, 0.662, 1.0);
    // gl_FragColor = vec4(0.015, 0.572, 0.662, 1.0);
    // gl_FragColor = vec4(uColor, 1.0);
    gl_FragColor = textureColor;
}