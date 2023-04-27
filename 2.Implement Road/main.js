//bg canvas

const canvas=document.getElementById("Canvas"); //location
canvas.width=200; //height moved to animate
canvas.height=window.innerHeight;

const ctx = canvas.getContext("2d");
const road=new Road(canvas.width/2,canvas.width*0.9);
const car=new Car(road.getLaneCenter(1),100,30,50); //car position - (initial lane, x, y, w, h)

animate();

function animate(){
    car.update();

    canvas.height=window.innerHeight;

    //move road but not the car (camera on top of the car)
    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.7); //camera position

    road.draw(ctx);
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}