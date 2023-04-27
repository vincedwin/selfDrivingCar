class Car{
    /*
        Car > Draw Car > Update? Move
        update - change dot car to polygon car
    */
    
    constructor(x,y,width,height, controlType, maxSpeed=3){
        //car basic size
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        
        //car movement physic
        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;
        this.damaged = false

        //movement controls from controls.js
        if(controlType !="DUMMY"){
            this.sensor=new Sensor(this);//update
        }
        this.controls=new Controls(controlType);
    }

    update(roadBorders, traffic){
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders, traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
        }
    }

    
    //define car corners
    #createPolygon(){
        const points=[];
        const rad = Math.hypot(this.width, this.height)/2 //a2 + b2 = c2 = diagonal length  / 2  = 1/4
        const alpha = Math.atan2(this.width, this.height)

        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    //damage detect - road borders
    #assessDamage(roadBorders, traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }
    

    #move(){
        //move forward
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        //move backward
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }

        //max speed
        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        //physic - friction
        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }
        }

        //physic turning speed control
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }


    //update - draw polygon car instead of point car
    draw(ctx, color){
        if(this.damaged){
            ctx.fillStyle="gray";
        }else{
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();

        if(this.sensor){
            this.sensor.draw(ctx);
        }
    }
}