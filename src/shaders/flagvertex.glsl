uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;
varying float vElevation;


void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
//   elevation += sin(modelPosition.z * uFrequency.z - uTime) * 0.1;


  modelPosition.z += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 porjectedPosition = projectionMatrix * viewPosition;

  gl_Position = porjectedPosition;

  vUv = uv;
  vElevation = elevation;  
}