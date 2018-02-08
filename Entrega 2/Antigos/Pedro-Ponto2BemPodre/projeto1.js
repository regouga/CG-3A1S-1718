
/*global THREE*/
 
var camera, scene, renderer, material, materialOrange, geometry, mesh, orange, torus, mesh1, car;

var cameraFlag = 1;

var max = 330;
var min = -330;
var arrayOranges = new Array(); // Array usado para organizar as laranjas

var materialArray = new Array(); // Array usado para alterar as wireframes das mesh
var cameraArray = new Array(3);
var clock = new THREE.Clock();


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



 //---------------------------------------------------------------------------//
 //									Laranja
 //---------------------------------------------------------------------------//

function createOrange(materialOrange, x, y, z) {
	'use strict';
	orange = new THREE.Object3D();
	geometry = new THREE.SphereGeometry(10, 10, 10);
	mesh = new THREE.Mesh(geometry, materialOrange);
	orange.add(mesh);
	orange.position.set(x, y, z);
	arrayOranges.push(orange);
	scene.add(orange);
}



 //---------------------------------------------------------------------------//
 //									Cheerio
 //---------------------------------------------------------------------------//

function createCheerio(material, x, y, z) { 			
	'use strict';
	torus = new THREE.Object3D();
	geometry = new  THREE.TorusGeometry( 2.5, 1, 10, 10);
	mesh = new THREE.Mesh(geometry, material);
	mesh.rotateX( Math.PI / 2 );
	torus.add(mesh);
	torus.position.set(x, y, z);
	scene.add(torus);	
}



 //---------------------------------------------------------------------------//
 //									Manteiga
 //---------------------------------------------------------------------------//

function addButterTop(obj, x, y, z) {
	'use strict';
	geometry = new THREE.CubeGeometry(19, 9, 8);
	mesh = new THREE.Mesh(geometry, materialTopo);
	mesh.position.set(x, y, z);
	obj.add(mesh);
}

function addButterPlate(obj, x, y, z) { 					// Prato da manteiga
	'use strict';
	geometry = new THREE.CubeGeometry(23, 3, 12);
	
	mesh = new THREE.Mesh(geometry, materialPrato);
	mesh.position.set(x, y, z);
	obj.add(mesh);
}

function createButter(materialTop, materialPlate, x, y, z) {
	'use strict';
	var butter = new THREE.Object3D();
	
	addButterPlate(butter, 0, 0, 0);
	addButterTop(butter, 0, 3, 0);
	
 
	scene.add(butter);
 
	butter.position.x = x;
	butter.position.y = y;
	butter.position.z = z;
}



 //---------------------------------------------------------------------------//
 //									Mesa
 //---------------------------------------------------------------------------//
 
function addTableTop(obj, x, y, z) {
	'use strict';
	geometry = new THREE.CubeGeometry(700, 100, 400);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	obj.add(mesh);
}
 
function createTable(x, y, z) {
	'use strict';
	var table = new THREE.Object3D();
	material = new THREE.MeshBasicMaterial({color: 0xA9A9A9, wireframe: false});
	addTableTop(table, 0, 0, 0);
	scene.add(table);
	table.position.x = x;
	table.position.y = y;
	table.position.z = z;
}



 //---------------------------------------------------------------------------//
 //									Carro
 //---------------------------------------------------------------------------//

function createWheel(obj, x, y, z) {
	'use strict';
	geometry = new  THREE.TorusGeometry(3, 1, 10, 10);
	material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
	materialArray.push(material);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	obj.add(mesh);
}


function createMainTube(obj, x, y, z) {
	'use strict';
	geometry = new THREE.CylinderGeometry(4, 4, 20);
	material = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});
	materialArray.push(material);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	mesh.rotateX( Math.PI / 2 );
	mesh.rotateZ( Math.PI / 2 );
	obj.add(mesh);

}


function createCone(obj, x, y, z) {
	'use strict';
	geometry = new THREE.CylinderGeometry(0, 4, 2);
	material = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});
	materialArray.push(material);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	mesh.rotateX( -Math.PI / 2 );
	mesh.rotateZ( -Math.PI / 2 );
	obj.add(mesh);

}


function createBiggerCone(obj, x, y, z) {
	'use strict';
	geometry = new THREE.CylinderGeometry(0, 4, 6);
	material = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});
	materialArray.push(material);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	mesh.rotateX( -Math.PI / 2 );
	mesh.rotateZ( -Math.PI / 2 );
	obj.add(mesh);

}


function createUpperTube(obj, x, y, z) {
	'use strict';
	geometry = new THREE.CylinderGeometry(2, 2, 10);
	material = new THREE.MeshBasicMaterial({color: 0xdf0101, wireframe: true});
	materialArray.push(material);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	mesh.rotateX( Math.PI / 2 );
	mesh.rotateZ( Math.PI / 2 );
	obj.add(mesh);
}


function createCar(x, y, z) {
	
	'use strict';
	var newCar = new THREE.Object3D();
	createMainTube(newCar, 0, 0, 0);
	createWheel(newCar, -5, 0, 4);
	createWheel(newCar, -5, 0, -4);
	createWheel(newCar, 5, 0, 4);
	createWheel(newCar, 5, 0, -4);
	createCone(newCar, -11, 0, 0);
	createBiggerCone(newCar, 13, 0, 0);
	createUpperTube(newCar, 0, 4, 0);
	scene.add(newCar);
	newCar.position.x = x;
	newCar.position.y = y;
	newCar.position.z = z;
	return 	newCar;
}



 //---------------------------------------------------------------------------//
 //									Pista
 //---------------------------------------------------------------------------//

var teta;
function createTrack(mesh1) {

	for (x = -230; x <= 230; x+= 10) {
		createCheerio(mesh1, x, 52.5, -180);
		createCheerio(mesh1, x, 52.5, -130);
		createCheerio(mesh1, x, 52.5, 180);
		createCheerio(mesh1, x, 52.5, 130);
	}

	for (z = -80; z <= 80; z+= 10) {
		createCheerio(mesh1, -330, 52.5, z);
		createCheerio(mesh1, -280, 52.5, z);
		createCheerio(mesh1, 330, 52.5, z);
		createCheerio(mesh1, 280, 52.5, z);
	}

	for (teta=-Math.PI/2; teta>-Math.PI; teta-=Math.PI/26) {
		createCheerio(mesh1, -230 + 100 * Math.cos(teta), 52.5, -80 + 100 *Math.sin(teta));
		createCheerio(mesh1, 230 + 100 * -Math.cos(teta), 52.5, -80 + 100 *Math.sin(teta));
		createCheerio(mesh1, -230 + 100 * Math.cos(teta), 52.5, -(-80 + 100 *Math.sin(teta)));
		createCheerio(mesh1, 230 + 100 * -Math.cos(teta), 52.5, -(-80 + 100 *Math.sin(teta)));
	}

	for(teta=-Math.PI/2; teta>-Math.PI; teta-=Math.PI/18) {
	 	createCheerio(mesh1, -230 + 50 * Math.cos(teta), 52.5, -80 + 50 *Math.sin(teta));
	 	createCheerio(mesh1, 230 + 50 * -Math.cos(teta), 52.5, -80 + 50 *Math.sin(teta));
	 	createCheerio(mesh1, -230 + 50 * Math.cos(teta), 52.5, -(-80 + 50 *Math.sin(teta)));
	 	createCheerio(mesh1, 230 + 50 * -Math.cos(teta), 52.5, -(-80 + 50 *Math.sin(teta)));
	}
}



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
    cameraArray[1].position.z = 0;
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
	createTable(0, 0, 0);
	
	
	material = new THREE.MeshBasicMaterial( { color: 0xFACC2E , wireframe: true} );
	materialArray.push(material);
	createTrack(material);
	
	

	material = new THREE.MeshBasicMaterial({color: 0xEB9100, wireframe: true});
	materialArray.push(material);

	var firstO = Math.random() * (max - min) + min;
	var secondO = Math.random() * (max - min) + min;
	var thirdO = Math.random() * (max - min) + min;
	var fourthO = Math.random() * (max - min) + min;
	createOrange(material, firstO, 56, 20);
	createOrange(material, secondO, 56, -30);
	createOrange(material, thirdO, 56, -20);
	createOrange(material, fourthO, 56, 0);

	
	
	materialPrato = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
	materialArray.push(materialPrato);
	materialTopo = new THREE.MeshBasicMaterial({color: 0xffd700, wireframe: true});
	materialArray.push(materialTopo);
	
	createButter(materialTopo, materialPrato, -50, 56, 20 );
	createButter(materialTopo, materialPrato, 0, 56, -35 );
	createButter(materialTopo, materialPrato, 50, 56, 25 );
	createButter(materialTopo, materialPrato, 100, 56, 25 );
	createButter(materialTopo, materialPrato, -125, 56, 25 );
	
	
	car = createCar(0, 53, 155);

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

function moveOrange(maximumVelocity) {
	'use strict'
	var delta = clock.getDelta();
	for(var i in arrayOranges) {
		if(arrayOranges[i].userData.velocity < maximumVelocity) {
			arrayOranges[i].userData.velocity += delta;
		}
		else {
			arrayOranges[i].userData.velocity = maximumVelocity;
		}
		var valor = Math.round(Math.random());
		if (valor == 1)
			arrayOranges[i].translateX(arrayOranges[i].userData.velocity);
		else
			arrayOranges[i].translateZ(arrayOranges[i].userData.velocity);

	}
}
function removeOrange() {
	for (var i in arrayOranges) {
		if (arrayOranges[i].position.x > 350 || arrayOranges[i].position.x < -350) {
			scene.remove(arrayOranges[i]);
		}
		if (arrayOranges[i].position.z > 200 || arrayOranges[i].position.z < -200) {
			scene.remove(arrayOranges[i]);
		}

	}
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
	moveOrange(1);
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