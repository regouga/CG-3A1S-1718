/*global THREE*/
 
var camera, scene, renderer, material, materialOrange, geometry, mesh, orange, torus, mesh1, car;

var carDirection;

var cameraFlag = 2;

var maxX = 340;
var minX = -340;
var maxZ = 190;
var minZ = -190;
var arrayOranges = new Array(); // Array usado para organizar as laranjas
var arrayAngulos = new Array(); //Array usado para organizar os angulos de cada uma das laranjas. cada posicao deste vetor e uma das laranjas
var MAX_ANGLE = 2 * Math.PI;
var MIN_ANGLE = 0;

var objectsgroup = new THREE.Group();

var MOV_LARANJA = true;

var numeroOranges = 5;
var numeroManteigas = 4;
var MAX_VEL_LARANJAS = 5;

var materialArray = new Array(); // Array usado para alterar as wireframes das mesh
var cameraArray = new Array(3);
var clock = new THREE.Clock();

//vetor de cheerios com todos os que foram criados la guardados
var arrayCheerios = new Array();

//iluminacao 

var sun;

//cada objeto tem um vetor com os materiais em cada um dos estilos
orangeMaterialsLambert = new Array();
orangeMaterialsPhong = new Array();

carMaterialsLambert = new Array();
carMaterialsPhong = new Array();

cheeriosMaterialsLambert = new Array();
cheeriosMaterialsPhong = new Array();

butterMaterialsLambert = new Array();
butterMaterialsPhong = new Array();



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
		this.radius = 0;
		this.lightmaterial = 0; //se estiver a zero, temos phong
	}

	checkCollisions(ob) { // Verificacao da colisao
		var ourPos = this.position;
		var objPos = ob.position;
		var dist = ourPos.distanceTo(objPos); 
		if(dist <= this.radius + ob.radius) { 
			this.treatCollision(ob); // Se houver colisao, trata-a
		}
	}

	treatCollision(ob){}

	whatAmI() {return "object3d";}

}

class Orange extends Object3D {
	constructor(x, y, z, materialOz, materialCC) {
		super();
		this.maximumVelocity = 1;
		this.createOrangeBall(0, 0, 0, materialOz);
		this.createOrangeCone(0, 5, 0, materialCC);
		this.position.set(x, y, z);
		this.lightMaterial = 0; //se estiver a zero, temos phong

		objectsgroup.add(this);

	}

	createOrangeCone(x, y, z, materialC) {
		geometry = new THREE.ConeGeometry( 5, 20, 32 );
		mesh = new THREE.Mesh( geometry, materialC);
		mesh.position.set(x, y, z);
		this.add(mesh);
	}
	createOrangeBall(x, y, z, materialO) {
		'use strict';
		geometry = new THREE.SphereGeometry(10, 10, 10);
		mesh = new THREE.Mesh(geometry, materialO);
		mesh.position.set(x, y, z);
		this.add(mesh);
	}

	whatAmI() {return "orange";}

	changeMaterials() {

		if (this.lightmaterial == 0) { //se tivermos um shadding phong
			this.lightmaterial = 1; //torna se em gouraud
			this.children[0].material = orangeMaterialsLambert[0];
			this.children[1].material = orangeMaterialsLambert[1];
		}
		else {
			this.lightmaterial = 0; //torna se em phong
			this.children[0].material = orangeMaterialsPhong[0];
			this.children[1].material = orangeMaterialsPhong[1];
		}
	}
}

class Car extends Object3D {
	constructor(x, y, z, materialMain, materialWheel, materialCone, materialBigCone, materialUpper) {
		super();
		this.maximumVelocity = 2;
		this.createMainTube(0, 0, 0, materialMain);
		this.createWheel(-5, 0, 4, materialWheel);
		this.createWheel(-5, 0, -4, materialWheel);
		this.createWheel(5, 0, 4, materialWheel);
		this.createWheel(5, 0, -4, materialWheel);
		this.createCone(-11, 0, 0, materialCone);
		this.createBiggerCone(13, 0, 0, materialBigCone);
		this.createUpperTube(0, 4, 0, materialUpper);
		this.position.set(x, y, z);
		this.radius = 12;
		this.lightMaterial = 0; //se estiver a zero, temos phong
		
	}

	whatAmI() {return "car";}

	createMainTube(x, y, z, mat) {
		'use strict';
		geometry = new THREE.CylinderGeometry(4, 4, 20);
		mesh = new THREE.Mesh(geometry, mat);
		mesh.position.set(x, y, z);
		mesh.rotateX( Math.PI / 2 );
		mesh.rotateZ( Math.PI / 2 );
		this.add(mesh);
	}

	createWheel(x, y, z, mat) {
		'use strict';
		geometry = new  THREE.TorusGeometry(3, 1, 10, 10);
		mesh = new THREE.Mesh(geometry, mat);
		mesh.position.set(x, y, z);
		this.add(mesh);
	}

	createCone(x, y, z, mat) {
		'use strict';
		geometry = new THREE.CylinderGeometry(0, 4, 2);
		mesh = new THREE.Mesh(geometry, mat);
		mesh.position.set(x, y, z);
		mesh.rotateX( -Math.PI / 2 );
		mesh.rotateZ( -Math.PI / 2 );
		this.add(mesh);

	}


	createBiggerCone(x, y, z, mat) {
		'use strict';
		geometry = new THREE.CylinderGeometry(0, 4, 6);
		mesh = new THREE.Mesh(geometry, mat);
		mesh.position.set(x, y, z);
		mesh.rotateX( -Math.PI / 2 );
		mesh.rotateZ( -Math.PI / 2 );
		this.add(mesh);

	}

	createUpperTube(x, y, z, mat) {
		'use strict';
		geometry = new THREE.CylinderGeometry(2, 2, 10);
		mesh = new THREE.Mesh(geometry, mat);
		mesh.position.set(x, y, z);
		mesh.rotateX( Math.PI / 2 );
		mesh.rotateZ( Math.PI / 2 );
		this.add(mesh);
	}

	treatCollision(obj) {
		if(obj.whatAmI() == "orange"){
			
			this.position.set(0, 53, 155);
			this.userData.velocity = 0;
			this.rotation.set(0, 0, 0);
		}

		if(obj.whatAmI() == "cheerio"){
			obj.translateX(car.userData.velocity);
			obj.translateZ(car.userData.velocity);
		}

		if(obj.whatAmI() == "butter"){
			this.userData.velocity = 0;
		}
	}

	changeMaterials() {

		if (this.lightmaterial == 0) { //se tivermos um shadding phong
			this.lightmaterial = 1; //torna se em gouraud
			this.children[0].material = carMaterialsLambert[0];
			this.children[1].material = carMaterialsLambert[1];
			this.children[2].material = carMaterialsLambert[2];
		}
		else {
			this.lightmaterial = 0; //torna se em phong
			this.children[0].material = carMaterialsPhong[0];
			this.children[1].material = carMaterialsPhong[1];
			this.children[2].material = carMaterialsPhong[2];
		}
	}
}

class Butter extends Object3D {
	constructor(x, y, z, material1, material2) {
		'use strict';
		super();
		this.addButterTop(0, 3, 0, material1);
		this.addButterPlate(0, 0, 0, material2);
		this.position.set(x, y, z);
		this.radius = 10;
		this.lightMaterial = 0; //se estiver a zero, temos phong
	}

	whatAmI() { return "butter"; }

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

	changeMaterials() {

		if (this.lightmaterial == 0) { //se tivermos um shadding phong
			this.lightmaterial = 1; //torna se em gouraud
			this.children[0].material = butterMaterialsLambert[0];
			this.children[1].material = butterMaterialsLambert[1];
		}
		else {
			this.lightmaterial = 0; //torna se em phong
			this.children[0].material = butterMaterialsPhong[0];
			this.children[1].material = butterMaterialsPhong[1];
		}
	}
}

class Mesa extends Object3D {
	constructor(x, y, z, material) {
		super();
		this.addTableTop(x, y, z, material);
		this.lightMaterial = 0; //se estiver a zero, temos phong

	}

	whatAmI() {return "mesa";}

	addTableTop(x, y, z, mate) {
		'use strict';
		material = new THREE.MeshPhongMaterial({color: 0xA9A9A9, wireframe: false});
		geometry = new THREE.CubeGeometry(700, 100, 400);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		this.add(mesh);
	}

	changeMaterials() {
		console.log("mesa");
	}
}

class Cheerio extends Object3D {
	constructor(x, y, z, materialC) {
		super();
		this.createCheerio(materialC, x, y, z);
		this.position.set(x, y, z);
		this.radius = 2.5;
		this.lightMaterial = 0; //se estiver a zero, temos phong
	}

	whatAmI() {return "cheerio";}

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

	treatCollision(obj) {
		if(obj.whatAmI() == "cheerio"){
			obj.translateX(0.5);
			obj.translateZ(0.5);

		}
	}
	changeMaterials() {

		if (this.lightmaterial == 0) { //se tivermos um shadding phong
			this.lightmaterial = 1; //torna se em gouraud
			this.children[0].material = cheeriosMaterialsLambert[0];
		}
		else {
			this.lightmaterial = 0; //torna se em phong
			this.children[0].material = cheeriosMaterialsPhong[0];
		}
	}


}

function createOrtographicCamera() {
	'use strict';
	cameraArray[0] = new THREE.OrthographicCamera( window.innerWidth / - 2, 
		window.innerWidth / 2, window.innerHeight / 2, 
		window.innerHeight / - 2, 1, 1000 );
	cameraArray[0].position.y = 600;
	cameraArray[0].lookAt(scene.position);
	cameraArray[0].zoom = 1.5;
	cameraArray[0].updateProjectionMatrix();
}

function createPerspectiveCamera() {
	'use strict';
    cameraArray[1] = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    cameraArray[1].position.x = 0;
    cameraArray[1].position.y = 500;
    cameraArray[1].position.z = 500;
    cameraArray[1].lookAt(scene.position);
    cameraArray[1].zoom = 1.5;
	cameraArray[1].updateProjectionMatrix();
}

function createMobileCamera() {
	'use strict';
	cameraArray[2] = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	car.add(cameraArray[2]);
	cameraArray[2].position.x = -40;
	cameraArray[2].position.y = 25;
	cameraArray[2].position.z = 0;
	cameraArray[2].lookAt(new THREE.Vector3(0,0,0))


}


function createMaterials() {
	
//LARANJAS
	materialLaranja = new THREE.MeshPhongMaterial({color: 0xEB9100, wireframe: true});
	materialLaranja2 = new THREE.MeshPhongMaterial({color: 0x32CD32, wireframe: true});
	orangeMaterialsPhong.push(materialLaranja);
	orangeMaterialsPhong.push(materialLaranja2);

	materialArray.push(materialLaranja);
	materialArray.push(materialLaranja2);

	materialLaranja = new THREE.MeshLambertMaterial({color: 0xEB9100, wireframe: true});
	materialLaranja2 = new THREE.MeshLambertMaterial({color: 0x32CD32, wireframe: true});
	orangeMaterialsLambert.push(materialLaranja);
	orangeMaterialsLambert.push(materialLaranja2);

	materialArray.push(materialLaranja);
	materialArray.push(materialLaranja2);

//MANTEIGAS 
	materialPrato = new THREE.MeshPhongMaterial({color: 0xffd700, wireframe: true});
	materialTopo = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: true});
	butterMaterialsPhong.push(materialPrato);
	butterMaterialsPhong.push(materialTopo);

	materialArray.push(materialTopo);
	materialArray.push(materialPrato);

	materialPrato = new THREE.MeshLambertMaterial({color: 0xffd700, wireframe: true});
	materialTopo = new THREE.MeshLambertMaterial({color: 0xffffff, wireframe: true});
	butterMaterialsLambert.push(materialPrato);
	butterMaterialsLambert.push(materialTopo);

	materialArray.push(materialTopo);
	materialArray.push(materialPrato);


//CHEERIOS 
	material = new THREE.MeshPhongMaterial( { color: 0xFACC2E , wireframe: true} );
	cheeriosMaterialsPhong.push(material);
	materialArray.push(material);

	material = new THREE.MeshLambertMaterial( { color: 0xFACC2E , wireframe: true} );
	cheeriosMaterialsLambert.push(material);
	materialArray.push(material);


//CARRO

	//materiais usados para os dois cones e para o main tube
	material = new THREE.MeshPhongMaterial({color: 0x0000ff, wireframe: true});
	carMaterialsPhong.push(material);
	materialArray.push(material);

	material = new THREE.MeshLambertMaterial({color: 0x0000ff, wireframe: true});
	carMaterialsLambert.push(material);
	materialArray.push(material);

	//materiais usados para as rodas
	material = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: true});
	carMaterialsPhong.push(material);
	materialArray.push(material);

	material = new THREE.MeshLambertMaterial({color: 0xffffff, wireframe: true});
	carMaterialsLambert.push(material);
	materialArray.push(material);

	//materiais usados para o upper tube
	material = new THREE.MeshPhongMaterial({color: 0xdf0101, wireframe: true});
	carMaterialsPhong.push(material);
	materialArray.push(material);

	material = new THREE.MeshLambertMaterial({color: 0xdf0101, wireframe: true});
	carMaterialsLambert.push(material);
	materialArray.push(material);



}

 //---------------------------------------------------------------------------//
 //									Cena
 //---------------------------------------------------------------------------//
 
function createScene() {
	
	var x, z;
	'use strict';
	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(10));
	
	createMaterials();

	//criacao da pista de cheerios
	var teta;

	for (x = -230; x <= 230; x+= 10) {
		cheerio1 = new Cheerio(x, 50, -180, cheeriosMaterialsPhong[0]);
		cheerio2 = new Cheerio(x, 50, 180, cheeriosMaterialsPhong[0]);
		cheerio3 = new Cheerio(x, 50, -130, cheeriosMaterialsPhong[0]);
		cheerio4 = new Cheerio(x, 50, 130, cheeriosMaterialsPhong[0]);
		objectsgroup.add(cheerio1);
		objectsgroup.add(cheerio2);
		objectsgroup.add(cheerio3);
		objectsgroup.add(cheerio4);
		arrayCheerios.push(cheerio1);
		arrayCheerios.push(cheerio2);
		arrayCheerios.push(cheerio3);
		arrayCheerios.push(cheerio4);
	}
	for (z = -80; z <= 80; z+= 10) {
		cheerio1 = new Cheerio(-330, 50, z, cheeriosMaterialsPhong[0]);
		cheerio2 = new Cheerio(-280, 50, z, cheeriosMaterialsPhong[0]);
		cheerio3 = new Cheerio(330, 50, z, cheeriosMaterialsPhong[0]);
		cheerio4 = new Cheerio(280, 50, z, cheeriosMaterialsPhong[0]);
		objectsgroup.add(cheerio1);
		objectsgroup.add(cheerio2);
		objectsgroup.add(cheerio3);
		objectsgroup.add(cheerio4);
		arrayCheerios.push(cheerio1);
		arrayCheerios.push(cheerio2);
		arrayCheerios.push(cheerio3);
		arrayCheerios.push(cheerio4);
	}

	for (teta=-Math.PI/2; teta>-Math.PI; teta-=Math.PI/26) {
		cheerio1 = new Cheerio(-230 + 100 * Math.cos(teta), 50, -80 + 100 *Math.sin(teta), cheeriosMaterialsPhong[0]);
		cheerio2 = new Cheerio(230 + 100 * -Math.cos(teta), 50, -80 + 100 *Math.sin(teta), cheeriosMaterialsPhong[0]);
		cheerio3 = new Cheerio(-230 + 100 * Math.cos(teta), 50, -(-80 + 100 *Math.sin(teta)), cheeriosMaterialsPhong[0]);
		cheerio4 = new Cheerio(230 + 100 * -Math.cos(teta), 50, -(-80 + 100 *Math.sin(teta)), cheeriosMaterialsPhong[0]);
		objectsgroup.add(cheerio1);
		objectsgroup.add(cheerio2);
		objectsgroup.add(cheerio3);
		objectsgroup.add(cheerio4);
		arrayCheerios.push(cheerio1);
		arrayCheerios.push(cheerio2);
		arrayCheerios.push(cheerio3);
		arrayCheerios.push(cheerio4);
	}

	for(teta=-Math.PI/2; teta>-Math.PI; teta-=Math.PI/18) {
	 	cheerio1 = new Cheerio(-230 + 50 * Math.cos(teta), 50, -80 + 50 *Math.sin(teta), cheeriosMaterialsPhong[0]);
	 	cheerio2 = new Cheerio(230 + 50 * -Math.cos(teta), 50, -80 + 50 *Math.sin(teta), cheeriosMaterialsPhong[0]);
	 	cheerio3 = new Cheerio(-230 + 50 * Math.cos(teta), 50, -(-80 + 50 *Math.sin(teta)), cheeriosMaterialsPhong[0]);
	 	cheerio4 = new Cheerio(230 + 50 * -Math.cos(teta), 50, -(-80 + 50 *Math.sin(teta)), cheeriosMaterialsPhong[0]);
	 	objectsgroup.add(cheerio1);
		objectsgroup.add(cheerio2);
		objectsgroup.add(cheerio3);
		objectsgroup.add(cheerio4);
		arrayCheerios.push(cheerio1);
		arrayCheerios.push(cheerio2);
		arrayCheerios.push(cheerio3);
		arrayCheerios.push(cheerio4);
	}



	var i = 0;
	var o = 0;

	while (i < numeroOranges) {
		var Ox = Math.random() * (maxX - minX) + minX;
		var Oz = Math.random() * (maxZ - minZ) + minZ;
		laranja = new Orange(Ox, 56, Oz, orangeMaterialsPhong[0], orangeMaterialsPhong[1]);
		arrayOranges.push(laranja);
		objectsgroup.add(laranja);
		var anguloNovo = Math.random() * (MAX_ANGLE - MIN_ANGLE) + MIN_ANGLE;
		laranja.position.set(Ox, 56, Oz);
		arrayAngulos[i] = anguloNovo;
		rotate(laranja, new THREE.Vector3(0,1,0), arrayAngulos[i]);
		i++;
	}
	while (o < numeroManteigas) {  
		var Ox = Math.random() * (maxX - minX) + minX;
		var Oz = Math.random() * (maxZ - minZ) + minZ;
		butter = new Butter(Ox, 53, Oz, butterMaterialsPhong[0], butterMaterialsPhong[1]);
		objectsgroup.add(butter);
		o++;
	}


	mesa = new Mesa(0, 0, 0);
	objectsgroup.add(mesa);

	car = new Car(0, 53, 155, carMaterialsPhong[0], carMaterialsPhong[1], carMaterialsPhong[0], carMaterialsPhong[0], carMaterialsPhong[2]);
	
	objectsgroup.add(car);

	scene.add(objectsgroup);

}



 //---------------------------------------------------------------------------//
 //									On Resize
 //---------------------------------------------------------------------------//


function onResize() {

	renderer.setSize( window.innerWidth, window.innerHeight );

	if (cameraFlag == 0) {
		var new_height = window.innerWidth / aspectratio;
		
		if (new_height <= window.innerHeight ) {
			cameraArray[0].aspect = aspectratio;
			renderer.setSize( window.innerWidth, new_height );
		} 

		else {
			cameraArray[0].aspect = 1/aspectratio;
			renderer.setSize( window.innerHeight * aspectratio, window.innerHeight );
		}
		cameraArray[0].updateProjectionMatrix();
	}

	cameraArray[1].aspect = window.innerWidth / window.innerHeight;
    cameraArray[1].updateProjectionMatrix();

    

	cameraArray[2].aspect = window.innerWidth / window.innerHeight;
  	cameraArray[2].updateProjectionMatrix();

 
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

		case 78: //N
		case 110: //n
			toggleSunLight();
			break;
		case 71: //G
		case 103: //g
			changeShading();
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
 //								    LUZES
 //---------------------------------------------------------------------------//


function createSunLight() {

	sun = new THREE.DirectionalLight(0xffffff, 1);
	sun.position.set(-50, 200, 0);
	sun.target.position.set(0, 0 ,0 );
	sun.target.updateMatrixWorld();
	sun.castShadow = true;

	var helper = new THREE.DirectionalLightHelper(sun);
	scene.add(helper);

	scene.add(sun.target);
	scene.add(sun);
}

function createLight() {
	createSunLight();
}

function toggleSunLight() {
	sun.visible = !sun.visible;
	console.log("desliguei o sol");
}


function changeShading() {
	for (var obj of objectsgroup.children) {
		obj.changeMaterials();
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
	carDirection += Math.PI/48;

}

function moveRIGHT() {										// Direita
	'use strict';
	rotate(car, new THREE.Vector3(0,1,0), -(Math.PI/48));
	carDirection -= Math.PI/48;
}

function rotateItself(object) {									
	'use strict';
	//object.rotateX(Math.PI/48);
	rotate(object, new THREE.Vector3(1,0,0), Math.PI/48);

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

	for(var i in arrayOranges) {
		if(arrayOranges[i].userData.velocity < arrayOranges[i].maximumVelocity) {
			arrayOranges[i].userData.velocity += delta;
		}
		else if (arrayOranges[i].position.x > 350 || arrayOranges[i].position.x < -350 || arrayOranges[i].position.z > 200 || arrayOranges[i].position.z < -200) {
			objectsgroup.remove(arrayOranges[i]);
			var Ox = Math.random() * (maxX - minX) + minX;
			var Oz = Math.random() * (maxZ - minZ) + minZ;
			var anguloNovo = Math.random() * (MAX_ANGLE - MIN_ANGLE) + MIN_ANGLE;
			arrayOranges[i].position.set(Ox, 56, Oz);
			arrayAngulos[i] = anguloNovo;
			var newMaxVelocity = Math.random() * (2 - 0.5) + 0.5;
			arrayOranges[i].maximumVelocity = newMaxVelocity;
			setTimeout(reAddOrange, 1000, arrayOranges[i]);
		}

		else {
			arrayOranges[i].userData.velocity = arrayOranges[i].maximumVelocity;
		}
		rotateItself(arrayOranges[i]);
		arrayOranges[i].translateX(arrayOranges[i].userData.velocity);
		
	}

	handleCollisions();
}

function handleCollisions() {

	for(var i = 0; i < objectsgroup.children.length-1; i++){
		car.checkCollisions(objectsgroup.children[i])

		if (objectsgroup.children[i].whatAmI() == "cheerio") {

			for(var j = i+1; j < objectsgroup.children.length; j++){
				objectsgroup.children[i].checkCollisions(objectsgroup.children[j]);
			}
		}
	}


}

//---------------------------------------------------------------------------//
//							Movimento das Laranjas
//---------------------------------------------------------------------------//


function reAddOrange(laranjinha) {
	objectsgroup.add(laranjinha);
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
	createLight();

 
	render();
 
	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
}