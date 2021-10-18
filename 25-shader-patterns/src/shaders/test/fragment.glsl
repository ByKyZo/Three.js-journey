varying vec2 vUv;

float random2d(vec2 coord){
    return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{   
    // //  PATTERN_1
    // gl_FragColor=vec4(vUv,1.0,1.0);
    
    // //  PATTERN_2
    // gl_FragColor=vec4(vUv,0.0 ,1.0);

    // // PATTERN_3
    // float strengthX = vUv.x ;
    // gl_FragColor= vec4(vec3(strengthX),1.0);

    // // PATTERN_4
    // float strengthY = vUv.y ;
    // gl_FragColor= vec4(vec3(strengthY),1.0);

    // // PATTERN_5
    // float strengthY = 1.0 - vUv.y;
    // gl_FragColor= vec4(vec3(strengthY),1.0);
    
    // // PATTERN_6
    // float strengthY = vUv.y * 10.0;
    // gl_FragColor= vec4(vec3(strengthY),1.0);

    // // PATTERN_7
    // float strengthY = mod(vUv.y * 10.0, 1.0) ;
    // gl_FragColor= vec4(vec3(strengthY),1.0);

    // // PATTERN_8
    // float strengthY = mod(vUv.y * 10.0 , 1.0);
    // strengthY = strengthY > 0.5 ? 0.0 : 1.0;
    // gl_FragColor= vec4(vec3(strengthY),1.0);

    // // PATTERN_9
    // float strengthY = mod(vUv.y * 10.0 , 1.0);
    // strengthY = step(0.5 ,strengthY);
    // gl_FragColor= vec4(vec3(strengthY),1.0);

    // // PATTERN_10
    // float strengthY = mod(vUv.y * 10.0 , 1.0);
    // strengthY = step(0.8 ,strengthY);
    // gl_FragColor= vec4(vec3(strengthY),1.0);

    // // PATTERN_11
    // float strengthY = mod(vUv.x * 10.0 , 1.0);
    // strengthY = step(0.8 ,strengthY);
    // gl_FragColor= vec4(vec3(strengthY),1.0);

    // // PATTERN_12
    // float strength = step(0.8,mod(vUv.x * 10.0 , 1.0));
    // strength += step(0.8,mod(vUv.y * 10.0 , 1.0));
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_13
    // float strength = step(0.8,mod(vUv.x * 10.0 , 1.0));
    // strength *=  step(0.8,mod(vUv.y * 10.0 , 1.0));
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_14
    // float strength = step(0.2,mod(vUv.x * 10.0 , 1.0)) ;
    // strength *= step(0.8,mod(vUv.y * 10.0 , 1.0));
    // // float strength = step(0.8,mod(vUv.y * 10.0 , 1.0));
    // // strength -= step(0.8,mod(vUv.x * 10.0 , 1.0));
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_15
    // float barX = step(0.4,mod(vUv.x * 10.0 , 1.0)) ;
    // barX *= step(0.8,mod(vUv.y * 10.0 , 1.0));
    // float barY = step(0.8,mod(vUv.x * 10.0 , 1.0)) ;
    // barY *= step(0.4,mod(vUv.y * 10.0 , 1.0));
    // float strength = barX + barY;
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_16
    // float barOffset = 0.20;
    // float barX = step(0.4,mod((vUv.x * 10.0) - barOffset , 1.0));
    // barX *= step(0.8,mod(vUv.y * 10.0  , 1.0));
    // float barY = step(0.8,mod(vUv.x * 10.0, 1.0));
    // barY *= step(0.4,mod(vUv.y * 10.0 - barOffset , 1.0));
    // float strength = barX + barY;
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_17
    // float strength = abs(vUv.x - 0.5);
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_18
    // float strength =min(abs(vUv.x - 0.5),abs(vUv.y - 0.5)) * 2.0 ;
    // gl_FragColor= vec4(vec3(strength),1.0);
    
    // // PATTERN_19
    // float strength = max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)) ;
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_20
    // float strength = step(0.2, max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_21
    // float square1 = step(0.2, max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));
    // float square2 = 1.0 - step(0.3, max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));
    // float strength = square1 * square2;
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_22
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_23
    // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_24
    // float strength = random2d(floor(vUv * 10.0) / 10.0);
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_25
    // vec2 grid = vec2(
    //     floor(vUv.x * 10.0) / 10.0, 
    //     floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0
    // );
    // float strength = random2d(vec2(grid.x / grid.y, grid.y));
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // // PATTERN_26
    // float strength = length(vUv) ;
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_27
    // float strength = distance(vUv, vec2(0.5,0.5)) ;
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_28
    // float strength = 1.0 - distance(vUv, vec2(0.5,0.5)) ;
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_29
    // float strength = 0.015 / distance(vUv, vec2(0.5,0.5)) ;
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_30
    // float strength = 0.015 / distance(vUv, vec2(0.5,0.5)) ;
    // gl_FragColor= vec4(vec3(strength),1.0);

    // // PATTERN_31
    // float strength = 0.015 / distance(vec2(vUv.x * 0.1 + 0.45,vUv.y * 0.6 + 0.20), vec2(0.5,0.5)) ;
    // gl_FragColor= vec4(vec3(strength),1.0);
    
    // // PATTERN_32
    float strength = 0.015 / distance(vec2(vUv.x * 0.1 + 0.45,vUv.y * 0.6 + 0.20), vec2(0.5,0.5)) ;
    gl_FragColor= vec4(vec3(strength),1.0);


    // gl_FragColor= vec4(1.0,(vUv.x ) ,1.0,1.0);
    // gl_FragColor= vec4(1.0 ,vUv.r / vUv.g ,1.0 ,1.0); // ! diagonal effect
}

