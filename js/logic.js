function GRID(x, y, z, isMine) {
    this.isMine = isMine;
    this.surroundMine = 0;
    this.deleteFlag = false;
    this.pos = {
        x:x,
        y:y,
        z:z
    };
    return this;
}

function genMine() {
    for(var i=0;i<MINENUM;i++) {
        var randX = Math.floor(Math.random()*GRIDNUM);
        var randY = Math.floor(Math.random()*GRIDNUM);
        var randZ = Math.floor(Math.random()*GRIDNUM);
        if(grids[cubes[randX][randY][randZ].uuid].isMine) {
            i--;
        } else {
            grids[cubes[randX][randY][randZ].uuid].isMine = true;
        }
    }
}

function dig(uuid) {
    if(grids[uuid].deleteFlag) return;
    if(grids[uuid].isMine) gameover();
    var numMine = grids[uuid].surroundMine;
    var cubepos;
    if(numMine > 0) {
        //creaete number sprite
        cubepos = cubes[grids[uuid].pos.x][grids[uuid].pos.y][grids[uuid].pos.z].position;
        var textGeometry = new THREE.TextGeometry(String(numMine), {
            size   : STRSIZE,
            height : 0.1,
            font   : "optimer",
        });
        numObjects.push(new THREE.Mesh(textGeometry, new THREE.MeshPhongMaterial({
                color:numberColor,
                transparent : true,
                opacity : 0.5})));
        numObjects[numObjects.length-1].position.set(cubepos.x,cubepos.y,cubepos.z);
        scene.add(numObjects[numObjects.length-1]);
    } else {
        var surroundGridUuids = getSurroundIndexes(uuid);
        for(var i=0;i<surroundGridUuids.length;i++) {
            var tmpuuid = surroundGridUuids[i];
            if(grids[tmpuuid].deleteFlag) continue;
            var tmpGridMines = grids[tmpuuid].surroundMine;
            if(tmpGridMines > 0) {
                //create number sprite
                cubepos = cubes[grids[tmpuuid].pos.x][grids[tmpuuid].pos.y][grids[tmpuuid].pos.z].position;
                var textGeometry = new THREE.TextGeometry(String(tmpGridMines), {
                    size   : STRSIZE,
                    height : 0.1,
                    font   : "optimer",
                });
                numObjects.push(new THREE.Mesh(textGeometry, new THREE.MeshPhongMaterial({
                    color:numberColor,
                    transparent : true,
                    opacity : 0.5})));
                numObjects[numObjects.length-1].position.set(cubepos.x,cubepos.y,cubepos.z);
                scene.add(numObjects[numObjects.length-1]);
            } else {
                Array.prototype.push.apply(surroundGridUuids, getSurroundIndexes(surroundGridUuids[i]));
            }
            if(grids[surroundGridUuids[i]].deleteFlag) continue;
            grids[surroundGridUuids[i]].deleteFlag = true;
            scene.remove(cubes
                            [grids[surroundGridUuids[i]].pos.x]
                            [grids[surroundGridUuids[i]].pos.y]
                            [grids[surroundGridUuids[i]].pos.z]);
            GRIDSUM--;
        }
    }
    grids[uuid].deleteFlag = true;
    scene.remove(cubes[grids[uuid].pos.x][grids[uuid].pos.y][grids[uuid].pos.z]);
    GRIDSUM--;
    if(GRIDSUM === MINENUM) gameclear();

}

function getSurroundIndexes(uuid) {
    var uuids = [];
    var gridPos = grids[uuid].pos;
    var min_x = (gridPos.x>0)? gridPos.x-1 : 0;
    var max_x = (gridPos.x<GRIDNUM-1)? gridPos.x+1 : GRIDNUM-1;
    var min_y = (gridPos.y>0)? gridPos.y-1 : 0;
    var max_y = (gridPos.y<GRIDNUM-1)? gridPos.y+1 : GRIDNUM-1;
    var min_z = (gridPos.z>0)? gridPos.z-1 : 0;
    var max_z = (gridPos.z<GRIDNUM-1)? gridPos.z+1 : GRIDNUM-1;
    for(var i=min_x;i<=max_x;i++) {
        for(var j=min_y;j<=max_y;j++) {
            for(var k=min_z;k<=max_z;k++) {
                if(i===j&&j===k) continue;
                uuids.push(cubes[i][j][k].uuid);
            }
        }
    }
    return uuids;
}
    

function searchMine(uuid) {
    var count = 0;
    var surroundGridUuids = getSurroundIndexes(uuid);
    var numSurroundGrids = surroundGridUuids.length;
    for(var i=0;i<numSurroundGrids;i++) {
        if(grids[surroundGridUuids[i]].isMine) count++;
    }
    return count;
}

function gameover() {
    $('#gameover_dialog').modal();
}

function gameclear() {
    $('#gameclear_dialog').modal();
}
