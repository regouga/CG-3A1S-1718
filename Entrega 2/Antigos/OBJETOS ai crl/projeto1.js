/*global THREE*/
 
var camera, scene, renderer, material, materialOrange, geometry, mesh, orange, torus, mesh1, car;

var cameraFlag = 0;

var maxX = 340;
var minX = -340;
var maxZ = 190;
var minZ = -190;
var arrayOranges = new Array(); // Array usado para organizar as laranjas
var arrayAngulos = new Array(); //Array usado para organizar os angulos de cada uma das laranjas. cada posicao deste vetor e uma das laranjas
var MAX_ANGLE = 2 * Math.PI;
var MIN_ANGLE = 0;

var MOV_LARANJA = true;

var numeroOranges = 4;
var MAX_VEL_LARANJAS = 1;

var materialArray = new Array(); // Array usado para alterar as wireframes das mesh
var cameraArray = new Array(3);
var clock = new THREE.Clock();

//vetor de cheerios com todos os que foram criados la guardados
var arrayCheerios = new Array();


// Estados dos movimentos
var stopUP = false;
var stopDOWN = false;

var controlUP = false;
var controlDOWN = false;

var stopLEFT = false;
var stopRIGHT = false;

var controlLEFT = false;
var controlRIGHT = false;

var aspectratio;
var rotMatrix;



class Object3D extends THREE.Object3D {
	constructor() {
		super();
		this.velocity = 0;
		this.maximumVelocity = 0;
		this.minimumVelocity = 0;
		this.acceleration = 0;
	}

}

class Orange extends Object3D {
	constructor(x, y, z, materialOz) {
		super();
		this.maximumVelocity = 1;
		this.radius = 10;
		this.createOrangeBall(0, 0, 0, materialOz);
		this.position.set(x, y, z);
	}
	createOrangeBall(x, y, z, materialO) {
		'use strict';
		geometry = new THREE.SphereGeometry(10, 10, 10);
		mesh = new THREE.Mesh(geometry, materialO);
		mesh.position.set(x, y, z);
		this.add(mesh);
		//arrayOranges.push(orange);
		//arrayAngulos.push(angulo);
		//rotate(orange, new THREE.Vector3(0,1,0), angulo);
	}
}

class Car extends Object3D {
	constructor(x, y, z) {
		super();
		this.maximumVelocity = 2;
		this.createMainTube(0, 0, 0);
		this.createWheel(-5, 0, 4);
		this.createWheel(-5, 0, -4);
		this.createWheel(5, 0, 4);
		this.createWheel(5, 0, -4);
		this.createCone(-11, 0, 0);
		this.createBiggerCone(13, 0, 0);
		this.createUpperTube(0, 4, 0);
		this.position.set(x, y, z);
	}

	createMainTube(x, y, z) {
		'use strict';
		geometry = new THREE.CylinderGeometry(4, 4, 20);
		material = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});
		materialArray.push(material);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		mesh.rotateX( Math.PI / 2 );
		mesh.rotateZ( Math.PI / 2 );
		this.add(mesh);
	}

	createWheel(x, y, z) {
		'use strict';
		geometry = new  THREE.TorusGeometry(3, 1, 10, 10);
		material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
		materialArray.push(material);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		this.add(mesh);
	}

	createCone(x, y, z) {
		'use strict';
		geometry = new THREE.CylinderGeometry(0, 4, 2);
		material = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});
		materialArray.push(material);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		mesh.rotateX( -Math.PI / 2 );
		mesh.rotateZ( -Math.PI / 2 );
		this.add(mesh);

	}


	createBiggerCone(x, y, z) {
		'use strict';
		geometry = new THREE.CylinderGeometry(0, 4, 6);
		material = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});
		materialArray.push(material);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		mesh.rotateX( -Math.PI / 2 );
		mesh.rotateZ( -Math.PI / 2 );
		this.add(mesh);

	}

	createUpperTube(x, y, z) {
		'use strict';
		geometry = new THREE.CylinderGeometry(2, 2, 10);
		material = new THREE.MeshBasicMaterial({color: 0xdf0101, wireframe: true});
		materialArray.push(material);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		mesh.rotateX( Math.PI / 2 );
		mesh.rotateZ( Math.PI / 2 );
		this.add(mesh);
	}
}

class Butter extends Object3D {
	constructor(x, y, z, material1, material2) {
		'use strict';
		super();
		this.addButterTop(0, 3, 0, material1);
		this.addButterPlate(0, 0, 0, material2);
		this.position.set(x, y, z);
	}

	addButterTop(x, y, z, materialTOP) {
		'use strict';
		geometry = new THREE.CubeGeometry(19, 9, 8);
		mesh = new THREE.Mesh(geometry, materialTOP);
		mesh.position.set(x, y, z);
		this.add(mesh);
	}

	addButterPlate(x, y, z, materialPLATE) { 					// Prato da manteiga
		'use strict';
		geometry = new THREE.CubeGeometry(23, 3, 12);
		
		mesh = new THREE.Mesh(geometry, materialPLATE);
		mesh.position.set(x, y, z);
		this.add(mesh);
	}	
}

class Mesa extends Object3D {
	constructor(x, y, z, material) {
		super();
		this.addTableTop(x, y, z, material);

	}
	addTableTop(x, y, z, mate) {
		'use strict';
		material = new THREE.MeshBasicMaterial({color: 0xA9A9A9, wireframe: false});
		geometry = new THREE.CubeGeometry(700, 100, 400);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		this.add(mesh);
	}
}

class Cheerio extends Object3D {
	constructor(x, y, z, materialC) {
		super();
		this.createCheerio(materialC, x, y, z);
		this.position.set(x, y, z);
	}

	createCheerio(material, x, y, z) { 			
		'use strict';
		torus = new THREE.Object3D();
		geometry = new  THREE.TorusGeometry(2.5, 1, 10, 10);
		mesh = new THREE.Mesh(geometry, material);
		mesh.rotateX( Math.PI / 2 );
		torus.add(mesh);
		torus.position.set(x, y, z);
		this.add(mesh)	
	}


}


 //---------------------------------------------------------------------------//
 //									Laranja
 //---------------------------------------------------------------------------//





 //---------------------------------------------------------------------------//
 //									Cheerio
 //---------------------------------------------------------------------------//





 //---------------------------------------------------------------------------//
 //									Manteiga
 //---------------------------------------------------------------------------//





 //---------------------------------------------------------------------------//
 //									Mesa
 //---------------------------------------------------------------------------//
 




 //---------------------------------------------------------------------------//
 //									Carro
 //---------------------------------------------------------------------------//



 //---------------------------------------------------------------------------//
 //									Pista
 //---------------------------------------------------------------------------//




 //---------------------------------------------------------------------------//
 //									Camera
 //---------------------------------------------------------------------------//

function createOrtographicCamera() {
	'use strict';
	cameraArray[0] = new THREE.OrthographicCamera( window.innerWidth / - 2, 
		window.innerWidth / 2, window.innerHeight / 2, 
		window.innerHeight / - 2, 1, 1000 );
	console.log(window.innerWidth / 2);
	console.log(window.innerHeight / 2);
	cameraArray[0].position.y = 600;
	cameraArray[0].lookAt(scene.position);
}

function createPerspectiveCamera() {
	'use strict';
    cameraArray[1] = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    cameraArray[1].position.x = 0;
    cameraArray[1].position.y = 500;
    cameraArray[1].position.z = 500;
    cameraArray[1].lookAt(scene.position);
}

function createMobileCamera() {
	'use strict';
	cameraArray[2] = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	car.add(cameraArray[2]);
	cameraArray[2].position.x = -40;
	cameraArray[2].position.y = 40;
	cameraArray[2].position.z = 0;
	cameraArray[2].lookAt(new THREE.Vector3(0,0,0))


}



 //---------------------------------------------------------------------------//
 //									Cena
 //---------------------------------------------------------------------------//
 
function createScene() {
	
	var x, z;
	'use strict';
	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(10));
	
	
	//material usado para criar os cheerios
	material = new THREE.MeshBasicMaterial( { color: 0xFACC2E , wireframe: true} );
	materialArray.push(material);

	//criacao da pista de cheerios
	var teta;

	for (x = -230; x <= 230; x+= 10) {
		cheerio1 = new Cheerio(x, 50, -180, material);
		cheerio2 = new Cheerio(x, 50, 180, material);
		cheerio3 = new Cheerio(x, 50, -130, material);
		cheerio4 = new Cheerio(x, 50, 130, material);
		scene.add(cheerio1);
		scene.add(cheerio2);
		scene.add(cheerio3);
		scene.add(cheerio4);
		arrayCheerios.push(cheerio1);
		arrayCheerios.push(cheerio2);
		arrayCheerios.push(cheerio3);
		arrayCheerios.push(cheerio4);
	}
	for (z = -80; z <= 80; z+= 10) {
		cheerio1 = new Cheerio(-330, 50, z, material);
		cheerio2 = new Cheerio(-280, 50, z, material);
		cheerio3 = new Cheerio(330, 50, z, material);
		cheerio4 = new Cheerio(280, 50, z, material);
		scene.add(cheerio1);
		scene.add(cheerio2);
		scene.add(cheerio3);
		scene.add(cheerio4);
		arrayCheerios.push(cheerio1);
		arrayCheerios.push(cheerio2);
		arrayCheerios.push(cheerio3);
		arrayCheerios.push(cheerio4);
	}

	for (teta=-Math.PI/2; teta>-Math.PI; teta-=Math.PI/26) {
		cheerio1 = new Cheerio(-230 + 100 * Math.cos(teta), 50, -80 + 100 *Math.sin(teta), material);
		cheerio2 = new Cheerio(230 + 100 * -Math.cos(teta), 50, -80 + 100 *Math.sin(teta), material);
		cheerio3 = new Cheerio(-230 + 100 * Math.cos(teta), 50, -(-80 + 100 *Math.sin(teta)), material);
		cheerio4 = new Cheerio(230 + 100 * -Math.cos(teta), 50, -(-80 + 100 *Math.sin(teta)), material);
		scene.add(cheerio1);
		scene.add(cheerio2);
		scene.add(cheerio3);
		scene.add(cheerio4);
		arrayCheerios.push(cheerio1);
		arrayCheerios.push(cheerio2);
		arrayCheerios.push(cheerio3);
		arrayCheerios.push(cheerio4);
	}

	for(teta=-Math.PI/2; teta>-Math.PI; teta-=Math.PI/18) {
	 	cheerio1 = new Cheerio(-230 + 50 * Math.cos(teta), 50, -80 + 50 *Math.sin(teta), material);
	 	cheerio2 = new Cheerio(230 + 50 * -Math.cos(teta), 50, -80 + 50 *Math.sin(teta), material);
	 	cheerio3 = new Cheerio(-230 + 50 * Math.cos(teta), 50, -(-80 + 50 *Math.sin(teta)), material);
	 	cheerio4 = new Cheerio(230 + 50 * -Math.cos(teta), 50, -(-80 + 50 *Math.sin(teta)), material);
	 	scene.add(cheerio1);
		scene.add(cheerio2);
		scene.add(cheerio3);
		scene.add(cheerio4);
		arrayCheerios.push(cheerio1);
		arrayCheerios.push(cheerio2);
		arrayCheerios.push(cheerio3);
		arrayCheerios.push(cheerio4);
	}
	
	

	materialLaranja = new THREE.MeshBasicMaterial({color: 0xEB9100, wireframe: true});
	materialArray.push(materialLaranja);
	var i = 0;
	var Ox = Math.floor(Math.random() * (maxX - minX + 1) + minX);
	var Oz = Math.floor(Math.random() * (maxZ - minZ + 1) + minZ);
	while (i < numeroOranges) {
		var Ox = Math.random() * (maxX - minX) + minX;
		var Oz = Math.random() * (maxZ - minZ) + minZ;
		laranja = new Orange(Ox, 56, Oz, materialLaranja);
		arrayOranges.push(laranja);
		scene.add(laranja);
		i++;
	}	
	
	mesa = new Mesa(0, 0, 0);
	scene.add(mesa);

	materialPrato = new THREE.MeshBasicMaterial({color: 0xffd700, wireframe: true});
	materialArray.push(materialPrato);
	materialTopo = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
	materialArray.push(materialTopo);

	butter1 = new Butter(0, 56, 100, materialPrato, materialTopo);
	scene.add(butter1);
	butter2 = new Butter(0, 56, -35, materialPrato, materialTopo);
	scene.add(butter2);
	butter3 = new Butter(50, 56, 25, materialPrato, materialTopo);
	scene.add(butter3);
	butter4 = new Butter(-250, 56, 20, materialPrato, materialTopo);
	scene.add(butter4);

	car = new Car(0, 53, 155);
	scene.add(car);

	cheerio = new Cheerio()

}



 //---------------------------------------------------------------------------//
 //									On Resize
 //---------------------------------------------------------------------------//

function onResize() {

	cameraArray[1].aspect = window.innerWidth / window.innerHeight;
    cameraArray[1].updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    //ISTO ESTA A FUNCIONAR MAL COMO A MERDA. TEMOS QUE REVER


    
	/*var new_height = window.innerWidth / aspectratio;



	
		if (new_height <= window.innerHeight ) {
			cameraArray[cameraFlag].aspect = aspectratio;
			renderer.setSize( window.innerWidth, new_height );
		} 

		else {
			cameraArray[cameraFlag].aspect = 1/aspectratio;
			renderer.setSize( window.innerHeight * aspectratio, window.innerHeight );
		}
		cameraArray[cameraFlag].updateProjectionMatrix();

	else {
		cameraArray[0].left = -window.innerWidth / 2;
        cameraArray[0].right = window.innerWidth / 2;
     	cameraArray[0].top = window.innerHeight / 2;
		cameraArray[0].bottom = -window.innerHeight / 2;
		cameraArray[0].updateProjectionMatrix();

		camera[number].aspect = window.innerWidth / window.innerHeight;
  		camera[number].updateProjectionMatrix();
	}*/
 
}



 //---------------------------------------------------------------------------//
 //					On Key Down (quando uma tecla e pressionada)
 //---------------------------------------------------------------------------//

function onKeyDown(e) {
	'use strict';
	
	switch(e.keyCode) {
		case 65: // Tecla A
			for (var i = 0; i < materialArray.length; i++) {
				materialArray[i].wireframe = !materialArray[i].wireframe;
			}
			break;
			
		case 97: // Tecla a
			for (var i = 0; i < materialArray.length; i++) {
				materialArray[i].wireframe = !materialArray[i].wireframe;
			}
			break;

		case 38: // Tecla Cima
			stopUP = false;
			stopDOWN = false;
			controlUP = true;
			controlDOWN = false;
			break;

		case  40: // Tecla Baixo
			stopUP = false;
			stopDOWN = false;
			controlUP = false;
			controlDOWN = true;
			break;

		case 37: // Tecla Esquerda
			stopLEFT = false;
			stopRIGHT = false;
			controlLEFT = true;
			controlRIGHT = false;
			break;

		case 39: // Tecla Direita
			stopLEFT = false;
			stopRIGHT = false;
			controlLEFT = false;
			controlRIGHT = true;
			break;

		case 49: //tecla numero 1
			cameraFlag = 0;
			break;

		case 50: //tecla numero 2
			cameraFlag = 1;
			break;

		case 51: //tecla numero 3
			cameraFlag = 2;
			break;

	}
}



 //---------------------------------------------------------------------------//
 //			On Key Up (quando uma tecla deixa de estar pressionada)
 //---------------------------------------------------------------------------//

function onKeyUp(e){
	'use strict';

	switch (e.keyCode){

		case 38: // Tecla Cima
			stopUP = true;
			stopDOWN = false;
			controlUP = false;
			controlDOWN = false;
			break;

		case 40: // Tecla Baixo
			stopUP = false;
			stopDOWN = true;
			controlDOWN = false;
			controlUP = false;
			break;

		case 37: // Tecla Esquerda
			stopLEFT = true;
			stopRIGHT = false;
			controlLEFT = false;
			controlRIGHT = false;
			break;

		case 39: // Tecla Direita
			stopLEFT = false;
			stopRIGHT = true;
			controlLEFT = false;
			controlRIGHT = false;
			break;
	}
}



 //---------------------------------------------------------------------------//
 //								Movimento do Carro
 //---------------------------------------------------------------------------//

function rotate(object, axis, radians) {					// Rotacao
	rotateMatrix = new THREE.Matrix4();
	rotateMatrix.makeRotationAxis(axis.normalize(), radians);
	object.matrix.multiply(rotateMatrix);
	object.rotation.setFromRotationMatrix(object.matrix);

}


function moveUP(maximumVelocity, delta){					// Frente
	'use strict';
	if (car.userData.velocity < maximumVelocity){
		car.userData.velocity += delta;
	}

	else {
		car.userData.velocity = maximumVelocity;
	}
}


function moveDOWN(maximumVelocity, delta){					// Tras
	'use strict';
	if(car.userData.velocity > -maximumVelocity){
		car.userData.velocity -= delta;
	 }

	 else {
		car.userData.velocity = -maximumVelocity;
	 }
}

function moveLEFT() {										// Esquerda
	'use strict';
	rotate(car, new THREE.Vector3(0,1,0), Math.PI/48);

}

function moveRIGHT() {										// Direita
	'use strict';
	rotate(car, new THREE.Vector3(0,1,0), -(Math.PI/48));

}


function checkMove(){										// Detecao
	'use strict';
	var delta = clock.getDelta();

	if(controlUP){ 			moveUP(2, delta); }
	else if(stopUP){ 		moveDOWN(0, delta); }
	else if(controlDOWN){ 	moveDOWN(2, delta); }
	else if(stopDOWN) { 	moveUP(0, delta); }

	if(controlLEFT) { 		moveLEFT(); }
	if (controlRIGHT) {		moveRIGHT(); }

	car.translateX(car.userData.velocity);
}

//---------------------------------------------------------------------------//
//							Movimento das Laranjas
//---------------------------------------------------------------------------//

function moveOrange() {
	'use strict'
	var delta = clock.getDelta();
	for(var i in arrayOranges) {
		if(arrayOranges[i].userData.velocity < MAX_VEL_LARANJAS) {
			arrayOranges[i].userData.velocity += delta;
		}
		else {
			arrayOranges[i].userData.velocity = MAX_VEL_LARANJAS;
		}
		arrayOranges[i].translateX(arrayOranges[i].userData.velocity);

	}
}
function removeOrange() {
	for (var i in arrayOranges) {
		if (arrayOranges[i].position.x > 350 || arrayOranges[i].position.x < -350 || arrayOranges[i].position.z > 200 || arrayOranges[i].position.z < -200) {
			scene.remove(arrayOranges[i]);
			var Ox = Math.random() * (maxX - minX) + minX;
			var Oz = Math.random() * (maxY - minY) + minY;
			var anguloNovo = Math.random() * (MAX_ANGLE - MIN_ANGLE) + MIN_ANGLE;
			arrayOranges[i].position.set(Ox, 56, Oz);
			arrayAngulos[i] = anguloNovo;
			rotate(arrayOranges[i], new THREE.Vector3(0,1,0), arrayAngulos[i]);
			setTimeout(reAddOrange, 1000, arrayOranges[i]);
		}
	}

}

function reAddOrange(laranjinha) {
	scene.add(laranjinha);
}

 //---------------------------------------------------------------------------//
 //									Main
 //---------------------------------------------------------------------------//

function render(){
	'use strict';
	renderer.render(scene, cameraArray[cameraFlag]);
 
}
 


function animate() {
	'use strict';
	checkMove();
	moveOrange();
	removeOrange();
	render();
	requestAnimationFrame(animate);
}
 

 
function init() {
	'use strict';
 
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	aspectratio = window.innerWidth / window.innerHeight;
	document.body.appendChild(renderer.domElement);
 
	createScene();
	createOrtographicCamera();
	createPerspectiveCamera();
	createMobileCamera();
 
	render();
 
	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
}