class CollisionManager {
    constructor() {

    }
    isCollide(obj1, obj2) {
        // obj {type : string, points:[]} if circle  obj {type : circle, radius:int}
        if (obj1.type == 'circle' && obj2.type == 'circle') return false;
        if (obj1.type == 'circle' || obj2.type == 'circle') {
            if (obj1.type != 'circle')
                [obj2, obj1] = [obj1, obj2];
            return this._circleConvexPolygonCollision(obj1, obj2.points);
        }
        return this._convexPolygonCollision(obj1.points, obj2.points);
    }
    _normalize(v) {
        const len = Math.hypot(v.x, v.y);
        return { x: v.x / len, y: v.y / len };
    }
    _circleProjection(circle, axis) {
        axis = this._normalize(axis);
        const dotValue = axis.x * circle.pos.x + axis.y * circle.pos.y;
        return [dotValue - circle.radius, dotValue + circle.radius];
    }
    _polygonProjection(points, axis) {
        axis = this._normalize(axis);
        let min = Infinity, max = -Infinity;
        for (const a of points) {
            const dotValue = axis.x * a.x + axis.y * a.y;
            min = Math.min(min, dotValue);
            max = Math.max(max, dotValue);
        }
        return [min, max];
    }
    _convexPolygonCollision(points1, points2) {
        // this function use seperate axis theory(SAT)
        // to detect intersection of two convext polygon
        //console.log(points1);
        for (let i = 0; i < 2; i++) {
            for (let p = 0; p < points1.length; p++) {
                const cur = points1[p];
                const next = points1[(p + 1) % points1.length];
                const vec = { x: next.x - cur.x, y: next.y - cur.y };
                const axis = { x: -vec.y, y: vec.x };//this prependicular vector
                const [min1, max1] = this._polygonProjection(points1, axis);
                const [min2, max2] = this._polygonProjection(points2, axis);
                if ((min1 > max2 || min2 > max1)) return false;// no intersection 
            }
            [points1, points2] = [points2, points1];
        }
        return true;// intersection found

    }


    _circleConvexPolygonCollision(circle, polygonPoints) {
        // this function use seperate axis theory(SAT)
        // to detect intersection of circle vs convext polygon
        //console.log(points1);

        for (let p = 0; p < polygonPoints.length; p++) {
            const cur = polygonPoints[p];
            const next = polygonPoints[(p + 1) % polygonPoints.length];
            const vec = { x: next.x - cur.x, y: next.y - cur.y };
            const axis = { x: -vec.y, y: vec.x };//this prependicular vector
            const [min1, max1] = this._polygonProjection(polygonPoints, axis);
            const [min2, max2] = this._circleProjection(circle, axis);
            if ((min1 > max2 || min2 > max1)) return false;// no intersection 
        }
        let closestPoint = polygonPoints[0];
        for (const p of polygonPoints) {
            const cur = Math.hypot(p.y - circle.pos.y, p.x - circle.pos.x);
            const close = Math.hypot(closestPoint.y - circle.pos.y, closestPoint.x - circle.pos.x);
            if (cur < close) closestPoint = p;
        }
        const axis = { x: closestPoint.x - circle.pos.x, y: closestPoint.y - circle.pos.y };

        const [min1, max1] = this._polygonProjection(polygonPoints, axis);
        const [min2, max2] = this._circleProjection(circle, axis);
        if ((min1 > max2 || min2 > max1)) return false;// no intersection 

        return true;// intersection found

    }


}

export default new CollisionManager();