function GRID(x, y, z, isMine) {
    this.isMine = isMine;
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
        var randX = Math.floor(Math.random()*GRIDNUM)+1;
        var randY = Math.floor(Math.random()*GRIDNUM)+1;
        var randZ = Math.floor(Math.random()*GRIDNUM)+1;
        if(grids[cubes[randX][randY][randZ].uuid].isMine) {
            i--;
        } else {
            grids[cubes[randX][randY][randZ].uuid].isMine = true;
        }
    }
}

function dig(uuid) {
    if(grids[uuid].isMine) gameover();
    var numMine = searchMine(uuid);
    if(numMine > 0) {
        //creaete number sprite
    } else {
        var surroundGridUuids = getSurroundIndexes(uuid);
        var numSurroundGrids = surroundGridUuids.length;
        for(var i=0;i<numSurroundGrids;i++) {
            dig(surroundGridUuids[i]);
        }
        grids[uuid].deleteFlag = true;
        scene.remove(cubes[grids[uuid].pos.x][grids[uuid].pos.y][grids[uuid].pos.z]);
    }
}

function getSurroundIndexes(uuid) {
    var uuids = [];
    var gridPos = grids[uuid].pos;
    var min_x = (gridPos.x>0)? gridPos.x-1 : 0;
    var max_x = (gridPos.x<GRIDNUM)? gridPos.x+1 : GRIDNUM;
    var min_y = (gridPos.y>0)? gridPos.y-1 : 0;
    var max_y = (gridPos.y<GRIDNUM)? gridPos.y+1 : GRIDNUM;
    var min_z = (gridPos.z>0)? gridPos.z-1 : 0;
    var max_z = (gridPos.z<GRIDNUM)? gridPos.z+1 : GRIDNUM;
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
