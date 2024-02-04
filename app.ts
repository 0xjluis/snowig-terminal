const readline = require("readline")

const width = 150;
const heigth = 60;

const empty = "░";
const snow = "▓";
const faling = "▒";


let display = new Array((width * heigth)) //96
display.fill(empty);
//console.log("Start");

function addOne(where:number){
	display[where] = snow;
}

function removeOne(where:number) {
	display[where] = empty;
}

function addFaling(where:number) {
	display[where] = faling;
}

function addMany(where:number[]){
	for(let i=0; i<where.length;i++){
		display[where[i]] = snow;
	}
}

function parseDisplay(toParse:string[]){
	let toPrintDisplay = [...toParse];
	const initLenght = toPrintDisplay.length;
	let added = 0;
	const loops = initLenght/width; // un loop por cada row
	for(let i=0; i<loops ;i++){
		let where = (width * (i+1)) + added
		toPrintDisplay.splice(where, 0, "\n");
		added = toPrintDisplay.length - initLenght;
	}
	console.log(toPrintDisplay.join(""))
}

function clearConsole() {
	for (let i=0; i<=heigth;i++ ) {
		readline.moveCursor(process.stdout, 0, -1);
		readline.clearLine(process.stdout, 0);
	}
}

function isTheLeftBorder(position:number){
	if(position%width === 0){
		return true;
	} else {
		return false;
	}
}

function isTheRigthBorder(position:number){
	if((position+1)%width === 0){
		return true;
	} else {
		return false;
	}
}


function moveDown(where:number) {
	removeOne(where);
	let newWhere;

	if(where + width < display.length){
		newWhere = where + width;
		//console.log("move down");
	}else {
		//console.log("Dont move down");
		newWhere = where
	}
	addFaling(newWhere);
}

function moveDownRigth(where:number) {
	let border = isTheRigthBorder(where)
	if(where + width + 1 > display.length || isTheRigthBorder(where)){
		//console.log(`moveDownRigth where ---> ${where} salimos sin modificar && ${border}`)
		return
	}else {
		//console.log(`moveDownRigth where ---> ${where} modificamos`)
		removeOne(where);
		addFaling(where + width + 1);
	}
}

function moveDownLeft(where:number) {
	let border = isTheLeftBorder(where)
	if(where + width - 1 > display.length || isTheLeftBorder(where)){ 
		//console.log(`moveDownLeft where ---> ${where} salimos sin modificar && ${border}`)
		return
	}else{
		//console.log(`moveDownRigth where ---> ${where} modificamos`)
	 	removeOne(where);
		addFaling(where + width - 1);
	}
}


function updateState(oneCell:number) {

	if(display[oneCell] !== snow){
		return;
	}

	if(display[oneCell + width] === empty){
	//console.log(`moveDown call`)
		moveDown(oneCell);
	}else if(display[oneCell + width + 1] === empty){
	//console.log(`moveDownRIgth call`)
		moveDownRigth(oneCell);
		return;
	}else if(display[oneCell + width - 1] === empty){
	//console.log(`moveDownLeft call`)
		moveDownLeft(oneCell);
		return;
	}
}

function stopFalling(display:string[]) {
	for(let i=0; i<display.length; i++){
		if(display[i] === faling){
			display[i] = snow;
		}
	}
}

function runtime(cicles:number){
	addMany([8,7,5,2])
	parseDisplay(display);
	for(let i=0; i<cicles; i++){
		for(let j=0; j< display.length;j++){
			updateState(j);
		}
		stopFalling(display);
		parseDisplay(display);
	}
}

//runtime(50);

function randomSnow(howMany:number){
	const max = width;
	let snowArr:number[] = [];
	for(let i=0;i<howMany;i++){
		const rand =  Math.floor(Math.random() * max);
		snowArr.push(rand);
	}
	return snowArr;
}

const msRefresh = 50;
function runtimeFPS(cicles:number, currentCycle = 0) {
    const inicio = Date.now();

	if(currentCycle%24 === 0){
    	addMany([20, 22, 24, 26, 82, 84, 91, 154, 153, 163, 200, 202,205, 208, 260, 258,262, 268]);
	}

	if(currentCycle%6 === 0){
    	let randoms = randomSnow(3)
    	addMany(randoms);
	}
    
    if (currentCycle < cicles) {
        for (let j = 0; j < display.length; j++) {
            updateState(j);
        }
        stopFalling(display);
        //clearConsole(); // Clearing can cause flickering
        parseDisplay(display);

        const duracion = Date.now() - inicio;
        const retraso = Math.max(msRefresh - duracion, 0); 
        
        setTimeout(() => runtimeFPS(cicles, currentCycle + 1), retraso); 
        //runtimeFPS(cicles, currentCycle + 1); // No throtled 
    }
}

runtimeFPS(5000);
