var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SimpleSolver = (function (_super) {
    __extends(SimpleSolver, _super);
    function SimpleSolver(map) {
        return _super.call(this, map) || this;
    }
    SimpleSolver.prototype.step = function () {
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
        var destination = this.getFirstUnsortedTile();
        var tile = 1 + destination.x + destination.y * this.map.width;
        // in case we solved already we return the coordinates of the gap.
        if (tile === this.map.width * this.map.height) {
            return destination;
        }
        console.log("\t- Next unsorted tile is: %d - %d,%d", tile, destination.x, destination.y);
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
        var majorCase = this.getMajorCase(destination);
        switch (majorCase) {
            case 0 /* Topleft */:
                return this.doMajorCaseTopleft(destination);
            case 1 /* Right */:
                return this.doMajorCaseRight(destination);
            case 2 /* Bottom */:
                return this.doMajorCaseBottom(destination);
        }
    };
    SimpleSolver.prototype.doMajorCaseTopleft = function (destination) {
        console.log("\t- Major Case: Topleft");
        /**
         * Get the position of the destination tile and save it
         * in target.
         */
        var target = this.getPointOfTile(destination.tile);
        console.log("\t- Target is in: %d,%d", target.x, target.y);
        /**
         * At this point we have a destination and a target which
         * needs to be moved to the destination.
         * To be more specific: The target needs to move in the
         * correct column and in the correct row.
         */
        if (target.x !== destination.point.x) {
            return this.moveToColumn(target, destination);
        }
        else {
            return this.moveToRow(target, destination);
        }
    };
    SimpleSolver.prototype.doMajorCaseRight = function (destination) {
        console.log("\t- Major Case: Right");
        return this.map.gap;
    };
    SimpleSolver.prototype.doMajorCaseBottom = function (destination) {
        console.log("\t- Major Case: Bottom");
        return this.map.gap;
    };
    SimpleSolver.prototype.getFirstUnsortedTile = function () {
        var i = 1, x = 0, y = 0;
        while (this.map.map[x][y] === i) {
            i++;
            x = (i - 1) % this.map.width;
            y = Math.floor((i - 1) / this.map.width);
        }
        return { x: x, y: y };
    };
    SimpleSolver.prototype.getMajorCase = function (target) {
        if (target.point.y >= this.map.height - 2) {
            return 2 /* Bottom */;
        }
        else if (target.point.x >= this.map.width - 2) {
            return 1 /* Right */;
        }
        else {
            return 0 /* Topleft */;
        }
    };
    SimpleSolver.prototype.getPointOfTile = function (tile) {
        if (tile < 0 || tile >= this.map.width * this.map.height) {
            console.error("- ! Wrong tile number passed to method getPointOfTile(%d)", tile);
            return;
        }
        var i = 1, x = 0, y = 0;
        while (this.map.map[x][y] !== tile) {
            i++;
            x = (i - 1) % this.map.width;
            y = Math.floor((i - 1) / this.map.width);
        }
        return { x: x, y: y };
    };
    SimpleSolver.prototype.moveToColumn = function (target, destination) {
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
                return { x: this.map.gap.x, y: target.y };
            }
            else {
                console.log("\t\t\t- Gap not in the same row, and behind Target");
                return { x: destination.x, y: this.map.gap.y };
            }
        }
        else {
            // situation 3:
            if (this.isInFrontOf(this.map.gap, target, destination)) {
                console.log("\t\t\t- Gap in the same row, and in front of Target");
                return target;
            }
            else {
                console.log("\t\t\t- Gap in the same row, and behind Target");
                return { x: this.map.gap.x, y: this.map.gap.y + 1 };
            }
        }
    };
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
    SimpleSolver.prototype.isInFrontOf = function (point, target, destination) {
        // will be -1 if target is left of destination, and will be +1 if
        // target is right of destination
        var targetDir = sign(target.x - destination.x);
        // special rule: if point.x == target.x then
        // pointDir will be opposite of targetDir
        // and therefore will be behind.
        var pointDir = sign(point.x - target.x);
        if (pointDir === 0) {
            pointDir = -targetDir;
        }
        return targetDir === pointDir;
    };
    SimpleSolver.prototype.moveToRow = function (target, destination) {
        return this.map.gap;
    };
    return SimpleSolver;
}(Solver));
