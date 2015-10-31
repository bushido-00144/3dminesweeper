var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0xeeeeee));
renderer.shadowMapEnabled = true;
document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement);

var geometry = new THREE.CubeGeometry(1,1,1);
var material = new THREE.MeshPhongMaterial({color: 0x98fb98});

var cubeArray = [];
var margin = 0.5;

for(var i=0;i<10;i++) {
    cubeArray[i] = [];
    for(var j=0;j<10;j++) {
        cubeArray[i][j] = [];
        for(var k=0;k<10;k++) {
            cubeArray[i][j][k] = new THREE.Mesh(geometry, material);
            cubeArray[i][j][k].position.set(i+i*margin,j+j*margin,k+k*margin);
            cubeArray[i][j][k].castShadow = true;
            cubeArray[i][j][k].receiveShadow = true;
            scene.add(cubeArray[i][j][k]);
        }
    }
}  

camera.position.z = 5;

var light    = new THREE.AmbientLight('#888888', 0.01);
scene.add(light);

var dlight    = new THREE.DirectionalLight('#ffffff', 1);
dlight.position.set(100,200,100);
dlight.castShadow = true;
scene.add(dlight);

var render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

render();
