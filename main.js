var MINENUM = 80;
var GRIDNUM = 10;

var baseColor = 0x98fb98;
var intersectColor = 0xfafa98;
var numberColor = 0x000080;

var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var intersected;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 50;
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0xeeeeee));
renderer.shadowMapEnabled = true;
document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement);

var geometry = new THREE.CubeGeometry(1,1,1);

var textGeometry = new THREE.TextGeometry("1", {
        size:1,
        height : 1,
        font : "optimer",
});

var cubes = [];
var grids = {};
var numObjects = [];
var margin = 0.2;

for(var i=0;i<GRIDNUM;i++) {
    cubes[i] = [];
    for(var j=0;j<GRIDNUM;j++) {
        cubes[i][j] = [];
        for(var k=0;k<GRIDNUM;k++) {
            cubes[i][j][k] = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:baseColor}));
            cubes[i][j][k].position.set(i+i*margin,j+j*margin,k+k*margin);
            cubes[i][j][k].castShadow = true;
            cubes[i][j][k].receiveShadow = true;
            scene.add(cubes[i][j][k]);
            grids[cubes[i][j][k].uuid] = new GRID(i, j, k, false);
        }
    }
}  

genMine();
_.each(grids, function(grid, uuid) {
    grid.surroundMine = searchMine(uuid);
});

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

var onMouseClick = function(e) {
    mouse.x = (e.clientX/window.innerWidth) *2 - 1;
    mouse.y =-(e.clientY/window.innerHeight)*2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersections = raycaster.intersectObjects(scene.children);

    if(intersections.length > 0) {
        if(intersected != intersections[0].object) {
            if(intersected) intersected.material.color.setHex(baseColor);
            intersected = intersections[0].object;
            /*
            intersected.material.color.setHex(intersectColor);
            scene.remove(intersected);
            */
            dig(intersected.uuid);
        }
    } else if(intersected) {
        intersected.material.color.setHex(baseColor);
        intersected = null;
    }
};

/*
var raycaster2 = new THREE.Raycaster();
var intersected2;
var onMouseMove = function(e) {
    mouse.x = (e.clientX/window.innerWidth) *2 - 1;
    mouse.y =-(e.clientY/window.innerHeight)*2 + 1;

    raycaster2.setFromCamera(mouse, camera);

    var intersections = raycaster2.intersectObjects(scene.children);

    if(intersections.length > 0) {
        if(intersected2 != intersections[0].object) {
            if(intersected2) intersected.material.color.setHex(baseColor);
            intersected2 = intersections[0].object;
            console.log(searchMine(intersected2.uuid));
        }
    } else if(intersected2) {
        intersected2.material.color.setHex(baseColor);
        intersected2 = null;
    }
};
*/

window.addEventListener("dblclick", onMouseClick, false);
/*
window.addEventListener("mousemove", onMouseMove, false);
*/

render();
