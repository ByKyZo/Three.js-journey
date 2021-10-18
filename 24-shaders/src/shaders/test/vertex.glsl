uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;
attribute vec2 uv;
// attribute float aRandom;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main()
{
    
    const float speed = 1.0;

    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    float elevation = sin((modelPosition.x * uFrequency.x) + uTime * speed) * 0.1;
    elevation += sin((modelPosition.y * uFrequency.y) + uTime * speed) * 0.1;

    modelPosition.z += elevation;

    // modelPosition.z += aRandom * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;


    gl_Position = projectionPosition;

    vUv = uv;
    vElevation = elevation;

    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    // vRandom = aRandom;

}