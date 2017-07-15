const enum MajorCase {    
    Topleft,
    Right,
    Bottom
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
         * Here targetTile is 7 and targetPoint is {x:2, y:1}
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
         * decide in which of the three major cases the targetPoint is.
         * 1,1,1,1,2,2
         * 1,1,1,1,2,2
         * 1,1,1,1,2,2
         * 1,1,1,1,2,2
         * 1,1,1,1,2,2
         * 3,3,3,3,3,3
         * 3,3,3,3,3,3
         * If targetPoint is not in the last two rows and not in the last
         * two columns then it's case Topleft (1 in the example grid).
         * If targetPoint is not in the last two rows but in the last two
         * columns then it's case Right (2 in the example grid).
         * If targetPoint is in the last two rows then it's case Bottom
         * (3 in the example grid)
         */
        var majorCase:MajorCase = this.getMajorCase(destination);

        switch(majorCase) {
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
        var target:Point = this.getPointOfTile(destination.tile);
        console.log("\t- Target is in: %d,%d", target.x, target.y);

        /**
         * At this point we have a destination and a target which
         * needs to be moved to the destination.
         * To be more specific: The target needs to move in the
         * correct column and in the correct row.         
         */
        if (target.x !== destination.point.x) {
            return this.moveToColumn(target, destination);
        } else {
            return this.moveToRow(target, destination);            
        }
    }

    doMajorCaseRight(destination):Point {
        console.log("\t- Major Case: Right")

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
        if (target.point.y >= this.map.height - 2) {
            return MajorCase.Bottom;
        } else if (target.point.x >= this.map.width - 2) {
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

    moveToColumn(target:Point, destination):Point {
        /**
         * D - destination
         * T - target
         * G - gap
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
         *      > return G.x|G.y + 1, it will move G below one row.
         *        (Then we have situation 2.)

         */
        
        if (this.map.gap.y !== target.y) {
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
        var pointDir = sign(point.x - target.x);
        if (pointDir === 0) { pointDir = -targetDir}

        return targetDir === pointDir;
    }

    moveToRow(target:Point, destination):Point {

        return this.map.gap;
    }
}