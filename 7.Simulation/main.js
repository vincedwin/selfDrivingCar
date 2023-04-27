const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N = 100
const cars= generateCars(N) //from single car to 100 cars

//defining the best car globaly
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    bestCar.brain = JSON.parse(
        localStorage.getItem("bestBrain")
    )
}

//traffic 
const traffic =[
    new Car(road.getLaneCenter(1),-100,30,50, "DUMMY",2)
]

animate();

//saving the best car at local storage
function save(){
    localStorage.setItem("bestBrain", 
    JSON.stringify(bestCar.brain)
    )
}
//removing the best car from local storage
function discard(){
    localStorage.removeItem("bestBrain")
}


//function to generate cars
function generateCars(N){
    const cars =[]
    for(let i = 1; i <N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i = 0 ; i < cars.length; i++){// loop cars as there are many
        cars[i].update(road.borders,traffic);
    }

    bestCar = cars.find(
        c=> c.y==Math.min(
            ...cars.map(c => c.y)
        )
    )

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);

    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }

    carCtx.globalAlpha = 0.2 //0.2 opacity for dummies
    for(let i = 0 ; i < cars.length; i++){// loop cars as there are many
        cars[i].draw(carCtx,"green");
    }
    carCtx.globalAlpha =  1 //keep 1 solid car to follow
    bestCar.draw(carCtx,"green", true); //add sensor for the best car

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}



