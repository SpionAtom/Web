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
        console.log("\t- Next unsorted tile is: %d - %d,%d", tile,  destination.x, destination.y);

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

        /**
         * At this point we have a destination and a target which
         * needs to be moved to the destination.
         * To be more specific: The target needs to move in the
         * correct column and then in the correct row.
         * 
         * New sub cases emerge:
         * s,s,s,s,s,s,s,s,s,s
         * s,s,s,s,D,R,R,R,R,R
         * e,e,e,e,e,e,e,e,e,e
         * e,e,e,e,e,e,e,e,e,e
         * e,e,e,e,e,e,e,e,e,e
         * e,e,e,e,e,e,e,e,e,e
         * Here s are the already sorted tiles. D is the destination.
         * 
         * R. T is right of D (Topleft.Right)
         * E. T is somewhere else (Topleft.Else)
         * 
         * 
         */

        switch(this.getTopleftCase(target, destination)) {
            case TopleftCase.Right:
                return this.doTopleftCaseRight(target, destination);
            case TopleftCase.Else:
                return this.doTopleftCaseElse(target, destination);
        }
    }

    doMajorCaseRight(destination):Point {
        console.log("\t- Major Case: Right");

        /**
         * s,s,s,s,s
         * s,s,s,D,E
         * x,x,x,x,x
         * x,x,x,x,x
         * x,x,x,x,x
         * 
         * Here we have some solved tiles (s), and some unsolved tiles (x).
         * D is the destination as in Major Case Topleft, but now there is
         * a seconds destination called E.
         * We want to reach the following configuration:
         * 
         * s,s,s,s,s
         * s,s,s,x,D
         * x,x,x,x,E
         * x,x,x,x,x
         * x,x,x,x,x
         */

        
        var tile = 1 + destination.x + destination.y * this.map.width;        
        destination.x++; 
        var target:Point = this.getPointOfTile(tile);
        var tile2 = 2 + destination.x + destination.y * this.map.width;
        var target2:Point = this.getPointOfTile(tile2);
        var destination2:Point = {x:destination.x, y: destination.y + 1};

        
        console.log("\t- Target is in: %d,%d", target.x, target.y);

        // first move D-target to D.
        // There is one special case: T is already there. Then move on to E
        if (target === destination) {

        }
        // move the second 
        else {
            if (target2 === destination2) {
                return this.doMajorCaseRightFinal(destination);
            }
            // move target2 to destination
            
        }

        
        

        return this.map.gap;
    }

    doMajorCaseRightFinal(destination:Point):Point {

        return this.map.gap;
    }

    doMajorCaseBottom(destination):Point {
        console.log("\t- Major Case: Bottom")

        return this.map.gap;
    }

    doTopleftCaseRight(target:Point, destination:Point):Point {
        console.log("\t\t- Topleftcase: Right")

        /**
         * To move the target left to the destination the gap has to
         * be in front of the target.
         * 
         * 1. The gap is below destination and behind the target.
         *      > return D.x|G.y, it will move the gap in the
         *        destination-col. That results in situation 2.
         * 2. The gap is below destination and in front of the
         *    target and not left of the destination.
         *      > return G.x|D.y, it will move the gap in front of the
         *        target.
         * 3. The gap is below destination and left of the destination.
         *      > return D.x\G.y, it will move the gap under the 
         *        destination. That results in situation 2
         * 4. The gap is in destination-row and in front of target.
         *      > return T.x|T.y, it will move the target towards
         *        its destination
         * 5. The gap is in destination-row and behind the target.
         *      > return G.x|G.y + 1, it will move the gap one row
         *        down. That results in situation 1.
         */
        if (this.map.gap.y > destination.y) {

            // situation 1
            if (!this.isInFrontOf(this.map.gap, target, destination)) {
                return {x: destination.x, y: this.map.gap.y};
            }
            // situation 2
            else if (this.map.gap.x >= destination.x) {
                return {x: this.map.gap.x, y: destination.y};
            }
            // situation 3
            else {
                return {x: destination.x , y: this.map.gap.y};
            }            
        } else {
            // situation 4
            if (this.isInFrontOf(this.map.gap, target, destination)) {
                return target;
            }
            // situation 5
            else {
                return {x: this.map.gap.x, y: this.map.gap.y + 1};
            }
        }
    }

    doTopleftCaseElse(target:Point, destination:Point):Point {
        console.log("\t\t- Topleftcase: Else")


        if (target.x === destination.x) {
            
            // gap is same col as target
            if (this.map.gap.x === target.x) {                
                if (this.map.gap.y < target.y) {
                    return target;
                }                
                else {
                    return {x: this.map.gap.x + 1, y: this.map.gap.y}
                }
            // gap is right of target
            } else if (this.map.gap.x > target.x) {
                if (this.map.gap.y < target.y) {
                    return {x: destination.x, y: this.map.gap.y};
                } else {
                    return {x: this.map.gap.x, y: destination.y};
                }
            // gap is left of target
            } else {
                if (this.map.gap.y < target.y) {
                    return {x: destination.x, y: this.map.gap.y};
                } else if (target.y === destination.y + 1) {
                    if (this.map.gap.y === target.y) {
                        return {x: this.map.gap.x, y: this.map.gap.y + 1};
                    } else {
                        return {x: target.x + 1, y: this.map.gap.y};
                    }
                }
            }
        }




        /**
         * 
         * To move the T to the correct column (D.x) the gap needs
         * to be in the same row as T and "in front of T":
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
         * 1. The gap is not in the same row as T and in front of T.
         *      > return G.x|T.y, it will move the gap in the target
         *        row.
         * 2. The gap is not in the same row as T and behind T.
         *      > return D.x|G.y, it will move the gap in the destination
         *        column (and therefore will move G in front of T - which
         *        is situation 1).
         * 3. The gap is in the same row as T and in front of T.
         *      > return T.x|T.y, it will move T towards the destination
         *        column
         * 4. The gap is in the same row as T and behind T.
         *      If T is in last row:
         *      > return G.x|G.y - 1, it will move G above one row.
         *      If T is not in the last row:
         *      > return G.x|G.y + 1, it will move G below one row.
         *        (Then we have situation 2.)
         */
        if (this.map.gap.y !== target.y) {
            // situation 1
            if (this.isInFrontOf(this.map.gap, target, destination)) {
                return {x: this.map.gap.x, y: target.y};
            }
            // situation 2
            else {
                return {x: destination.x, y: this.map.gap.y};
            }
        } else {
            // situation 3
            if (this.isInFrontOf(this.map.gap, target, destination)) {
                return target;
            }
            // situation 4
            else {
                // situation 4.a
                if (target.y === this.map.height - 1) {
                    return {x: this.map.gap.x, y: this.map.gap.y - 1};
                }
                // situation 4.b
                else {
                    return {x: this.map.gap.x, y: this.map.gap.y + 1};
                }
            }
        }
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

    getTopleftCase(target:Point, destination:Point):TopleftCase {
        if (target.y === destination.y) {
            return TopleftCase.Right;
        } else {
            return TopleftCase.Else;
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

    moveToRow(target:Point, destination:Point):Point {
        /**
         * At this point target is already in the correct column.
         * 
         * To move the target up to the destination the gap needs to be
         * above the target.
         * 
         * 1. The gap is not in the same column and above T.
         *      > return T.x|G.y, it will move the gap directly above T
         * 2. the gap is not in the same column and below T.
         * 
         */

        if (this.map.gap.x !== target.x) {
            // situation 1:
            if (this.isInFrontOf(this.map.gap, target, destination)) {
                console.log("\t\t\t- Gap not in the same row, and in front of Target");
                return {x: this.map.gap.x, y: target.y};
            }
            // situation 2:
            else {
                console.log("\t\t\t- Gap not in the same row, and behind Target");
                return {x: destination.x, y: this.map.gap.y};
            }
        } else {
            // situation 3:
            if (this.isInFrontOf(this.map.gap, target, destination)) {
                console.log("\t\t\t- Gap in the same row, and in front of Target");
                return target;
            }
            // situation 4:
            else {
                console.log("\t\t\t- Gap in the same row, and behind Target");
                return {x: this.map.gap.x, y: this.map.gap.y + 1};
            }
        }
    }

}