const enum MajorCase {    
    Topleft,
    Right,
    Bottom
}
const enum TopleftCase {
    Right,
    Else
}

class SimpleSolver extends Solver {

    map:Map;
    constructor(map:Map) {
        super(map);        
    }

    step():Point {
        /**
         * 1)
         * Get the first unsorted tile from the grid and save it
         * in destination.
         * 01,02,03,04,
         * 05,06,08,  ,
         * 09,10,07,11,
         * 13,14,15,12,
         * Here the first unsorted tile is 7 and destination is {x:2, y:1}
         */
        var destination:Point = this.getFirstUnsortedTile();        
        var tile = 1 + destination.x + destination.y * this.map.width;
        // in case we solved already we return the coordinates of the gap.
        if (tile === this.map.width * this.map.height) {
            return destination;
        }        
        console.log("- Next unsorted tile is: %d - %d|%d", tile,  destination.x, destination.y);

        /**
         * 2)
         * decide in which of the three major cases the destination is.
         * 1,1,1,1,2,2
         * 1,1,1,1,2,2
         * 1,1,1,1,2,2
         * 1,1,1,1,2,2
         * 1,1,1,1,2,2
         * 3,3,3,3,3,3
         * 3,3,3,3,3,3
         * If destination is not in the last two rows and not in the last
         * two columns then it's case Topleft (1 in the example grid).
         * If destination is not in the last two rows but in the last two
         * columns then it's case Right (2 in the example grid).
         * If destination is in the last two rows then it's case Bottom
         * (3 in the example grid)
         */

        /**
         * Here some abbreviation:
         * D - destination
         * T - target
         * G - gap
         */

        switch(this.getMajorCase(destination)) {
            case MajorCase.Topleft:
                return this.doMajorCaseTopleft(destination);
            case MajorCase.Right:
                return this.doMajorCaseRight(destination);                
            case MajorCase.Bottom:
                return this.doMajorCaseBottom(destination);                
        }
    }

    doMajorCaseTopleft(destination):Point {
        console.log("\t- Major Case: Topleft");

        /**
         * Get the position of the destination tile and save it
         * in target.
         */
        var tile = 1 + destination.x + destination.y * this.map.width;
        var target:Point = this.getPointOfTile(tile);
        console.log("\t- Target is in: %d,%d", target.x, target.y);

        return this.moveToDestination(target, destination)

    }

    doMajorCaseRight(destination):Point {
        console.log("\t- Major Case: Right");

        var gap = this.map.gap;

        var tile1:number, tile2:number, target1:Point, target2:Point, destination1:Point, destination2:Point;

        // if the second last tile is destination
        if (destination.x == this.map.width - 2) {            
            tile1 = 1 + destination.x + destination.y * this.map.width;
            target1 = this.getPointOfTile(tile1);
            destination1 = {x: destination.x + 1, y: destination.y};        

            tile2 = tile1 + 1;
            target2 = this.getPointOfTile(tile2);
            destination2 = {x: destination1.x, y: destination1.y + 1};
        }
        // if the last tile is destination
        else {
            console.log("target1 is already in destination1");
            tile1 = 1 + destination.x + destination.y * this.map.width - 1;
            target1 = this.getPointOfTile(tile1);
            destination1 = {x: destination.x, y: destination.y + 1}; 

            tile2 = 1 + destination.x + destination.y * this.map.width;
            target2 = this.getPointOfTile(tile2);
            destination2 = {x: destination.x, y: destination.y};
            
            if (gap.x === destination2.x && gap.y === destination2.y) {
                return target2;
            } else {
                return this.moveToDestination(target1, destination1);
            }
        }       

        console.log("\t- Target 1 is in: %d,%d", target1.x, target1.y);
        console.log("\t- Target 2 is in: %d,%d", target2.x, target2.y);

        // if target2 is in destination1 then move it down
        if (equalPoints(target2, destination1)) {
            this.moveToDestination(target2, {x: destination1.x, y: destination1.y + 1});
        }

        // first check if target1 and target2 are in place
        if (equalPoints(target1, destination1) && equalPoints(target2, destination2)) {
            // bring gap to destination
            if (equalPoints(gap, destination)) {
                return destination1;
            } else if (gap.x === destination.x) {
                return destination;
            } else {
                return {x: destination.x, y: gap.y};
            }
        }
        // then check if target1 is on destination and target2 on destination2
        if (equalPoints(target1, destination) && equalPoints(target2, destination2)
            && equalPoints(gap, destination1)) {                
                return target2;
        }

        if (!equalPoints(target1, destination1)) {
            return this.moveToDestination(target1, destination1);
        }
        else {
            return this.moveToDestination(target2, destination2);
        }
        
    }

    doMajorCaseRightFinal(destination:Point):Point {

        return this.map.gap;
    }

    doMajorCaseBottom(destination):Point {
        console.log("\t- Major Case: Bottom")

        return this.map.gap;
    }

    getFirstUnsortedTile():Point {
        let i = 1, x = 0, y = 0;        
        while (this.map.map[x][y] === i) {
            i++;
            x = (i - 1) % this.map.width;
            y = Math.floor((i - 1) / this.map.width);
        }
        return {x: x, y: y};
    }

    getMajorCase(target):MajorCase {
        if (target.y >= this.map.height - 2) {
            return MajorCase.Bottom;
        } else if (target.x >= this.map.width - 2) {
            return MajorCase.Right;
        } else {
            return MajorCase.Topleft;
        }        
    }

    getPointOfTile(tile:number) {
        if (tile < 0 || tile >= this.map.width * this.map.height) {
            console.error("- ! Wrong tile number passed to method getPointOfTile(%d)", tile);
            return;
        }
        let i = 1, x = 0, y = 0;        
        while (this.map.map[x][y] !== tile) {
            i++;
            x = (i - 1) % this.map.width;
            y = Math.floor((i - 1) / this.map.width);
        }
        return {x: x, y: y};
    }

    /**
     *      <,<,<,<,D,<,<,T,>,>
     * Here we have an example row with 10 cols. D is the destination
     * column, T is the target. Imagine arrows coming out of T. "In
     * front of T" means all the arrows that point to the same direction
     * in that D lies. In this case D is left, all positions that
     * are left are "in front of T", and all the positions that are
     * right are "behind T". (In the case that D is on the right
     * those meanings would be mirrored.). Also T itself is considered
     * behind.
     * 
     * This methods checks if point is in front of target.
     */
    isInFrontOf(point:Point, target:Point, destination:Point):boolean {
        // will be -1 if target is left of destination, and will be +1 if
        // target is right of destination
        var targetDir = sign(target.x - destination.x);
        
        // special rule: if point.x == target.x then
        // pointDir will be opposite of targetDir
        // and therefore will be behind.
        var pointDir = sign(target.x - point.x);
        if (pointDir === 0) { pointDir = -targetDir}

        return targetDir === pointDir;
    }

    moveToDestination(target:Point, destination:Point):Point {
        console.log("moving %d|%d to %d|%d", target.x, target.y, destination.x, destination.y);
        if (target.x !== destination.x) {
            return this.moveToColumn(target, destination);
        } else {
            return this.moveToRow(target, destination);
        }           
    }

    moveToColumn(target:Point, destination:Point):Point {
        var gap = this.map.gap;
        if (gap.y === target.y) {
            // gap in same row and in front of target
            if (this.isInFrontOf(gap, target, destination)) {
                return target;
            }
            // gap is behind target then gap needs to be moved up or down
            // depending of target position
            else {
                var plus = (target.y === this.map.height - 1) ? -1 : 1;
                return {x: gap.x, y: gap.y + plus};
            }
        } 
        // gap is not in the same row, the gap needs to be in the same column
        // and then in the same row.
        else {
            if (gap.x === destination.x) {
                return {x: gap.x, y: target.y};
            }
            return {x: destination.x, y: gap.y};
        }    

    }

    moveToRow(target:Point, destination:Point):Point {
        var gap = this.map.gap;
        
        // gap above target
        if (gap.y < target.y) {            
            if (gap.x === target.x) {
                return target;
            }
            else {
                return {x: target.x, y: gap.y};
            }
        }
        // if gap is not above target then there are more cases
        else {
            // gap is directly below target
            if (gap.x === target.x) {
                console.log("gap right below target");
                // move gap one left or right depending on target
                var plus = (target.x === this.map.width - 1) ? -1 : 1;
                return {x: gap.x + plus, y: gap.y};
            }
            // gap is left
            else if (gap.x < target.x) {
                // target at the right edge
                if (target.x === this.map.width - 1) {
                    if (gap.x === target.x - 1) {
                        return {x: gap.x, y: destination.y};
                    } else {
                        return {x: target.x - 1, y: gap.y};
                    }
                }
                else {
                    if (target.y > destination.y + 1) {
                        return {x: gap.x, y: gap.y - 1};
                    } else {
                        if (gap.y === target.y) {
                            return {x: gap.x, y: gap.y + 1};
                        } else {
                            return {x: target.x + 1, y: gap.y};
                        }
                        
                    }                    
                }
            }
            // gap is right
            else {
                return {x: gap.x, y: destination.y};
            }

        }

    }



}