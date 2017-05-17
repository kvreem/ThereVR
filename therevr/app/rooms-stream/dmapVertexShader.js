
export default `

uniform sampler2D map;
uniform sampler2D colorMap;
uniform float depth;
uniform float xzFactor;
uniform float yzFactor;

varying vec2 vUv;

void main() {

    float inverseFocalLengthInPixels = 0.003501;

    vUv = uv;

    int r = int(texture2D(map, vUv*vec2(1., -1.)).r * 255.0);
    int g = int(texture2D(map, vUv*vec2(1., -1.)).g * 255.0) * 256;
    // float depthVal = 1.0 - float(r + g) / 65536.0 * 2.0;
    float depthVal = 1.0 - float(r + g) / 1500.0; // / 65536.0 * 20.0;

    // if (depthVal > 0.8 || depthVal < 0.1) {
    if (depthVal > 0.99 || depthVal < 0.01) {
      depthVal = 0.0;
    }

    vec3 orgPos = position;
    orgPos.xy = (vUv - vec2( .5, .5 )) * 2.;

    float fSkeletonZ = depthVal;
    // float fSkeletonX = orgPos.x * xzFactor * depthVal;
    // float fSkeletonY = -orgPos.y * yzFactor * depthVal;
    float fSkeletonX = orgPos.x * 1.12005 * depthVal;
    float fSkeletonY = orgPos.y * 0.84072 * depthVal;

    vec3 v3 = vec3(fSkeletonX, fSkeletonY, fSkeletonZ);

    gl_Position = projectionMatrix * modelViewMatrix * vec4 (position + v3, 1);
    // gl_Position = projectionMatrix * vec4(vUv*4., -4, 1);

    /*
    vUv = uv;

    float depthCompare = texture2D(map, vUv).r;
    float d = (1.0-depthCompare);
    d = d;
    // d = 0.0;

    if ((abs(texture2D(map, vUv + vec2(0.0, 0.01)).r - depthCompare) > 0.1)
      ||(abs(texture2D(map, vUv - vec2(0.0, 0.01)).r - depthCompare) > 0.1)
      ||(abs(texture2D(map, vUv + vec2(0.01, 0.0)).r - depthCompare) > 0.1)
      ||(abs(texture2D(map, vUv - vec2(0.01, 0.0)).r - depthCompare) > 0.1)
    ) {
      // d = 0.0;
    }

    if (texture2D(map, vUv).r == 0.0) {
      d = 0.0;
    }

    vec3 orgPos = position;
    orgPos.xy = (vUv - vec2(230/2, 307/2));
    orgPos.z = d;
    orgPos.xy *= orgPos.z / 370.0;
    orgPos.xy *= orgPos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4 (position + vec3((vUv - vec2(0.5, 0.5)) * d * depth, d * depth), 1);

    // vec3 newPosition = position + orgPos;

    // vec3 newPosition = position + (normal * d * depth);
    // gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
    */
}
`