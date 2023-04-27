//bg canvas

const canvas=document.getElementById("Canvas"); //location
canvas.width=window.innerWidth; //height moved to animate
canvas.height=window.innerHeight;

const ctx = canvas.getContext("2d");
const Initialheight = window.innerHeight/2
const InitialWidth = window.innerWidth/2
const car=new Car(InitialWidth,Initialheight,30,50); //car position - (initial lane, x, y, w, h)

animate();

function animate(){
    car.update();

    canvas.height=window.innerHeight;

    //move road but not the car (camera on top of the car)
    //ctx.save();
    //ctx.translate(0,-car.y+canvas.height*0.7);

    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}