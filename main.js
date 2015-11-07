var HEIGHT = window.innerHeight * 0.8;
var WIDTH  = window.innerWidth * 0.8;
var MINENUM  = 80;
var GRIDNUM  = 10;
var GRIDSIZE = 2;
var STRSIZE  = 1;
var flagedGrids = 0;

var param = location.search.substring(1).split('&');
var params = {};
if(param.length > 1) {
    for(var i=0;i<param.length;i++) {
        var element  =param[i].split('=');
        var paramName = decodeURI(element[0]);
        var paramValue= decodeURI(element[1]);
        params[paramName] = paramValue;
    }
    MINENUM = Number(params.minenum);
    GRIDNUM = params.gridnum;
}
var GRIDSUM  = GRIDNUM * GRIDNUM * GRIDNUM;

var baseColor = 0x778899;
var flagColor = 0xffa500;
var intersectColor = 0xfafa98;
var numberColor = 0x000080;

var lightPositions = [
    { x : 0, y : 10, z : 10},
    { x : 0, y : -10, z : -10}];

var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var intersected;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(15, 10, 15);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0xeeeeee));
renderer.shadowMapEnabled = true;
//document.body.appendChild(renderer.domElement);
document.getElementById("screen").appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement);

var geometry = new THREE.CubeGeometry(GRIDSIZE, GRIDSIZE, GRIDSIZE);

var cubes = [];
var grids = {};
var numObjects = [];
var lights = [];
var margin = 2;
var offset = {
        x : (GRIDNUM * (GRIDSIZE + margin) - margin) / 2,
        y : (GRIDNUM * (GRIDSIZE + margin) - margin) / 2,
        z : (GRIDNUM * (GRIDSIZE + margin) - margin) / 2
};

for(var i=0;i<GRIDNUM;i++) {
    cubes[i] = [];
    for(var j=0;j<GRIDNUM;j++) {
        cubes[i][j] = [];
        for(var k=0;k<GRIDNUM;k++) {
            cubes[i][j][k] = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:baseColor}));
            cubes[i][j][k].position.set(i+i*margin-offset.x,j+j*margin-offset.y,k+k*margin-offset.z);
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

var envLight    = new THREE.AmbientLight('#ffffff', 0.01);
scene.add(envLight);

_.each(lightPositions, function(pos) {
    lights.push(new THREE.DirectionalLight('#ffffff', 0.3));
    lights[lights.length-1].position.set(pos.x, pos.y, pos.z);
    lights[lights.length-1].castShadow = true;
    scene.add(lights[lights.length-1]);
});

var render = function() {
    _.each(numObjects, function(obj) {
        obj.rotation.x = camera.rotation.x;
        obj.rotation.y = camera.rotation.y;
        obj.rotation.z = camera.rotation.z;
        if(obj.position.distanceTo(camera.position)>GRIDSIZE*10) {
            obj.material.visible = false;
        } else {
            obj.material.visible = true;
        }
    });
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
            if(!grids[intersected.uuid]) return;
            dig(intersected.uuid);
        }
    } else if(intersected) {
        intersected.material.color.setHex(baseColor);
        intersected = null;
    }
};

var raycaster2 = new THREE.Raycaster();
var flagOn = function(e) {
    if(!e.shiftKey) return;
    mouse.x = (e.clientX/window.innerWidth) *2 - 1;
    mouse.y =-(e.clientY/window.innerHeight)*2 + 1;

    raycaster2.setFromCamera(mouse, camera);

    var intersections = raycaster2.intersectObjects(scene.children);

    if(intersections.length > 0) {
        if(!grids[intersections[0].object.uuid]) return;
        if(intersections[0].object.material.color.getHex() === baseColor){ 
            intersections[0].object.material.color.setHex(flagColor);
            flagedGrids++;
        } else {
            intersections[0].object.material.color.setHex(baseColor);
            flagedGrids--;
        }
    }
};

function showMainMenu(e) {
    if(e.keyCode!==27) return;
    $('#main_menu').modal();
}

window.addEventListener("dblclick", onMouseClick, false);
window.addEventListener("click", flagOn, false);
window.addEventListener("keydown", showMainMenu, false);

render();
