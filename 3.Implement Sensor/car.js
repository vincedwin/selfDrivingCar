class Car{
    /*
        Car > Draw Car > Update? Move
    */
    
    constructor(x,y,width,height){
        //car basic size
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        
        //car movement physic
        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=3;
        this.friction=0.05;
        this.angle=0;

        //movement controls from controls.js
        this.sensor=new Sensor(this);//update
        this.controls=new Controls();
    }

    update(roadBorders){
        this.#move();
        this.sensor.update(roadBorders);
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

    draw(ctx){
        ctx.save();//save
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.fill();//fill up

        ctx.restore();

        this.sensor.draw(ctx);//draw sensor
    }
}