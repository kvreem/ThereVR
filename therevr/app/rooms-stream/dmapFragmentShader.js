
export default `

uniform sampler2D map;
uniform sampler2D colorMap;

varying vec2 vUv;

float getDepthVal(vec2 uv) {
  int r = int(texture2D(map, uv*vec2(1., -1.)).r * 255.0);
  int g = int(texture2D(map, uv*vec2(1., -1.)).g * 255.0) * 256;

  float depthVal = 1.0 - float(r + g) / 1500.0;
  return depthVal;
}

float averageDist(vec2 point) {
  float baseDepthVal = getDepthVal(point);
  float s, n;
  s = 0.;
  n = 0.;
  for (float x = -3.; x <= 3.; x+=1.) {
    for (float y = -3.; y <= 3.; y+=1.) {
      float compDepthVal = getDepthVal(point + vec2(x/400., y/400.));

      float r = abs(baseDepthVal - compDepthVal);
      // float r = compDepthVal;

      n += 1.;
      s += r;
    }
  }

  // return s/n;
  return s/n;
}

void main() {

  // float depthVal = getDepthVal(vUv);
  float avgDist = averageDist(vUv);

  // if (depthVal > 0.9 || depthVal < 0.1) {
  //   gl_FragColor = vec4(vec3(texture2D(colorMap, vUv)), 0);
  // } else {  
      gl_FragColor = vec4(vec3(texture2D(colorMap, vec2(vUv))), 1.0-(avgDist*5.0));
  // }

}

`