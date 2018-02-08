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
var numeroManteigas = 5;
var MAX_VEL_LARANJAS = 5;

var materialArray = new Array(); // Array usado para alterar as wireframes das mesh
var cameraArray = new Array(3);
var clock = new THREE.Clock();

//vetor de cheerios com todos os que foram criados la guardados
var arrayCheerios = new Array();

//iluminacao

var sun;
var vela1;
var candleLightArray = new Array();

//cada objeto tem um vetor com os materiais em cada um dos estilos
orangeMaterialsLambert = new Array();
orangeMaterialsPhong = new Array();
orangeMaterialsBasic = new Array();

carMaterialsLambert = new Array();
carMaterialsPhong = new Array();
carMaterialsBasic = new Array();

cheeriosMaterialsLambert = new Array();
cheeriosMaterialsPhong = new Array();
cheeriosMaterialsBasic = new Array();

butterMaterialsLambert = new Array();
butterMaterialsPhong = new Array();
butterMaterialsBasic = new Array();

candleMaterialsLambert = new Array();
candleMaterialsPhong = new Array();
candleMaterialsBasic = new Array();



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
		//this.createOrangeBall(0, 0, 0, materialOz);
		//this.createOrangeCone(0, 5, 0, materialCC);
		this.position.set(x, y, z);
		createOrange(this, x, y, z);
		this.lightMaterial = 0; //se estiver a zero, temos phong
		this.radius = 20;

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

	changeMaterials(flagLetra) {
		if (flagLetra == 0){ //significa que foi ativado o G
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

		else if (flagLetra == 1){ //significa que foi ativado o L
			if (this.basicMaterial == 0){
				this.basicMaterial = 1;
				this.children[0].material = orangeMaterialsBasic[0];
				this.children[1].material = orangeMaterialsBasic[1];
			}
			else{
				this.basicMaterial = 0;
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
	}
}

class Car extends Object3D {
	constructor(x, y, z) {
		super();
		this.maximumVelocity = 2;
		/*this.createMainTube(0, 0, 0, materialMain);
		this.createWheel(-5, 0, 4, materialWheel);
		this.createWheel(-5, 0, -4, materialWheel);
		this.createWheel(5, 0, 4, materialWheel);
		this.createWheel(5, 0, -4, materialWheel);
		this.createCone(-11, 0, 0, materialCone);
		this.createBiggerCone(13, 0, 0, materialBigCone);
		this.createUpperTube(0, 4, 0, materialUpper);
		this.position.set(x, y, z);*/
		this.radius = 12;
		createCar(this, x, y, z);
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

	changeMaterials(flagLetra) {
		if (flagLetra == 0){ //significa que foi ativado o G
			if (this.lightmaterial == 0) { //se tivermos um shadding phong
				this.lightmaterial = 1; //torna se em gouraud
				this.children[0].material = carMaterialsLambert[0];
			}
			else {
				this.lightmaterial = 0; //torna se em phong
				this.children[0].material = carMaterialsPhong[0];
			}
		}

		else{ //significa que foi ativado o L
			if (this.basicMaterial == 0){
				this.basicMaterial = 1;
				this.children[0].material = carMaterialsBasic[0];
			}
			else{
				this.basicMaterial = 0;
				if (this.lightmaterial == 0) { //se tivermos um shadding phong
					this.lightmaterial = 1; //torna se em gouraud
					this.children[0].material = carMaterialsLambert[0];
				}
				else {
					this.lightmaterial = 0; //torna se em phong
					this.children[0].material = carMaterialsPhong[0];
				}
			}
		}
	}
}

class Butter extends Object3D {
	constructor(x, y, z) {
		'use strict';
		super();
		//this.addButterTop(0, 3, 0, material1);
		//this.addButterPlate(0, 0, 0, material2);
		this.position.set(x, y, z);
		this.radius = 10;
		createButter(this, x, y, z);
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




	changeMaterials(flagLetra) {
		if (flagLetra == 0){ //significa que foi ativado o G
			if (this.lightmaterial == 0) { //se tivermos um shadding phong
				this.lightmaterial = 1; //torna se em gouraud
				this.children[0].material = butterMaterialsLambert[0];
			}
			else {
				this.lightmaterial = 0; //torna se em phong
				this.children[0].material = butterMaterialsPhong[0];
			}
		}

		else{ //significa que foi ativado o L
			if (this.basicMaterial == 0){
				this.basicMaterial = 1;
				this.children[0].material = butterMaterialsBasic[0];
			}
			else{
				this.basicMaterial = 0;
				if (this.lightmaterial == 0) { //se tivermos um shadding phong
					this.lightmaterial = 1; //torna se em gouraud
					this.children[0].material = butterMaterialsLambert[0];
				}
				else {
					this.lightmaterial = 0; //torna se em phong
					this.children[0].material = butterMaterialsPhong[0];
				}
			}
		}
	}
}

class Mesa extends Object3D {
	constructor(x, y, z) {
		super();
		
		//this.addTableTop(x, y, z, material);
		createMesa(this, x, y, z);
		this.lightMaterial = 0; //se estiver a zero, temos phong

	}

	whatAmI() {return "mesa";}

	addTableTop(x, y, z, mate) {
		'use strict';
		geometry = new THREE.CubeGeometry(700, 100, 400);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		this.add(mesh);
	}

	changeMaterials(flagLetra) {
		console.log("mesa");
	}
}

class Cheerio extends Object3D {
	constructor(x, y, z, materialC) {
		super();
		//this.createCheerio(materialC, x, y, z);
		this.position.set(x, y, z);
		this.radius = 2.5;
		createCheerio(this, x, y, z);
		this.lightMaterial = 0; //se estiver a zero, temos phong
	}

	whatAmI() {return "cheerio";}

	LcreateCheerio(material, x, y, z) {
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
	changeMaterials(flagLetra) {

		if (flagLetra == 0) { //significa que foi ativado o G

			if (this.lightmaterial == 0) { //se tivermos um shadding phong
				this.lightmaterial = 1; //torna se em gouraud
				this.children[0].material = cheeriosMaterialsLambert[0];
			}
			else {
				this.lightmaterial = 0; //torna se em phong
				this.children[0].material = cheeriosMaterialsPhong[0];
			}
		}
		if (flagLetra == 1){ //significa que foi ativado o L

			if (this.basicMaterial == 0){
				this.basicMaterial = 1;
				this.children[0].material = cheeriosMaterialsBasic[0];
			}
			else{
				this.basicMaterial = 0;
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
	}


}
class Candle extends Object3D {
	constructor(x, y, z, materialBase, materialFlame) {
		super();
		this.createCandleBase(0, 0, 0, materialBase);
		this.createCandleFlame(0, 15, 0, materialFlame);
		this.position.set(x, y, z);
		objectsgroup.add(this);
	}

	createCandleBase(x, y, z, materialBase) {
		geometry = new THREE.CylinderGeometry(3, 3, 17)
		mesh = new THREE.Mesh( geometry, materialBase);
		mesh.position.set(x, y, z);
		this.add(mesh);
	}
	createCandleFlame(x, y, z, materialFlame) {
		'use strict';
		geometry = new THREE.ConeGeometry( 3, 6, 32 );
		var geometry2 = new THREE.ConeGeometry( 3, 6, 32 );
		mesh = new THREE.Mesh(geometry, materialFlame);
		var mesh2  = new THREE.Mesh(geometry, materialFlame);
		mesh.rotateX(Math.PI);
		mesh.position.set(x, y - 3, z);
		mesh2.position.set(x, y + 3, z);
		this.add(mesh);
		this.add(mesh2);
	}

	whatAmI() {return "candle";}

	changeMaterials(flagLetra) {
		console.log("candle");
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
	orangeMaterialsPhong.push(materialLaranja);
	orangeMaterialsPhong.push(materialLaranja);
	materialArray.push(materialLaranja);
	
	materialLaranja = new THREE.MeshLambertMaterial({color: 0xEB9100, wireframe: true});
	orangeMaterialsLambert.push(materialLaranja);
	orangeMaterialsLambert.push(materialLaranja);
	materialArray.push(materialLaranja);

	materialLaranja = new THREE.MeshBasicMaterial({color: 0xEB9100, wireframe: true});
	orangeMaterialsBasic.push(materialLaranja);
	orangeMaterialsBasic.push(materialLaranja);
	materialArray.push(materialLaranja);

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

	materialPrato = new THREE.MeshBasicMaterial({color: 0xffd700, wireframe: true});
	materialTopo = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
	butterMaterialsBasic.push(materialPrato);
	butterMaterialsBasic.push(materialTopo);

	materialArray.push(materialTopo);
	materialArray.push(materialPrato);


//CHEERIOS
	material = new THREE.MeshPhongMaterial( { color: 0xFACC2E , wireframe: true} );
	cheeriosMaterialsPhong.push(material);
	materialArray.push(material);

	material = new THREE.MeshLambertMaterial( { color: 0xFACC2E , wireframe: true} );
	cheeriosMaterialsLambert.push(material);
	materialArray.push(material);

	material = new THREE.MeshBasicMaterial( { color: 0xFACC2E , wireframe: true} );
	cheeriosMaterialsBasic.push(material);
	materialArray.push(material);



//CARRO

	//materiais usados para os dois cones e para o main tube

	material = new THREE.MeshPhongMaterial( { color: 0x0000ff , wireframe: true} );
	carMaterialsPhong.push(material);
	materialArray.push(material);

	material = new THREE.MeshLambertMaterial( { color: 0x0000ff , wireframe: true} );
	carMaterialsLambert.push(material);
	materialArray.push(material);

	material = new THREE.MeshBasicMaterial( { color: 0x0000ff , wireframe: true} );
	carMaterialsBasic.push(material);
	materialArray.push(material);

	/*
	material = new THREE.MeshPhongMaterial({color: 0x0000ff, wireframe: true});
	carMaterialsPhong.push(material);
	materialArray.push(material);

	material = new THREE.MeshLambertMaterial({color: 0x0000ff, wireframe: true});
	carMaterialsLambert.push(material);
	materialArray.push(material);

	//materiais usados para as rodas
	material = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: true});
	carMaterialsPhong.push(material);
	carMaterialsPhong.push(material);
	carMaterialsPhong.push(material);
	carMaterialsPhong.push(material);
	materialArray.push(material);

	material = new THREE.MeshLambertMaterial({color: 0xffffff, wireframe: true});
	carMaterialsLambert.push(material);
	carMaterialsLambert.push(material);
	carMaterialsLambert.push(material);
	carMaterialsLambert.push(material);
	materialArray.push(material);

	//materiais usados para o upper tube
	material = new THREE.MeshPhongMaterial({color: 0xdf0101, wireframe: true});
	carMaterialsPhong.push(material);
	materialArray.push(material);

	material = new THREE.MeshLambertMaterial({color: 0xdf0101, wireframe: true});
	carMaterialsLambert.push(material);
	materialArray.push(material);*/

//CANDLE

	materialCandleBase = new THREE.MeshPhongMaterial({color: 0xfbfcfc, wireframe: true});
	materialCandleFlame = new THREE.MeshPhongMaterial({color: 0xffd700, wireframe: true});
	candleMaterialsPhong.push(materialCandleBase);
	candleMaterialsPhong.push(materialCandleFlame);

	materialArray.push(materialCandleBase);
	materialArray.push(materialCandleFlame);

	materialCandleBase = new THREE.MeshLambertMaterial({color: 0xfbfcfc, wireframe: true});
	materialCandleFlame = new THREE.MeshLambertMaterial({color: 0xffd700, wireframe: true});
	candleMaterialsLambert.push(materialCandleBase);
	candleMaterialsLambert.push(materialCandleFlame);

	materialArray.push(materialCandleBase);
	materialArray.push(materialCandleFlame);


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
		cheerio1 = new Cheerio(x, 50, -180);
		cheerio2 = new Cheerio(x, 50, 180);
		cheerio3 = new Cheerio(x, 50, -130);
		cheerio4 = new Cheerio(x, 50, 130);
		/*objectsgroup.add(cheerio1);
		objectsgroup.add(cheerio2);
		objectsgroup.add(cheerio3);
		objectsgroup.add(cheerio4);*/
		arrayCheerios.push(cheerio1);
		arrayCheerios.push(cheerio2);
		arrayCheerios.push(cheerio3);
		arrayCheerios.push(cheerio4);
	}
	for (z = -80; z <= 80; z+= 10) {
		cheerio1 = new Cheerio(-330, 50, z);
		cheerio2 = new Cheerio(-280, 50, z);
		cheerio3 = new Cheerio(330, 50, z);
		cheerio4 = new Cheerio(280, 50, z);
		/*objectsgroup.add(cheerio1);
		objectsgroup.add(cheerio2);
		objectsgroup.add(cheerio3);
		objectsgroup.add(cheerio4);*/
		arrayCheerios.push(cheerio1);
		arrayCheerios.push(cheerio2);
		arrayCheerios.push(cheerio3);
		arrayCheerios.push(cheerio4);
	}

	for (teta=-Math.PI/2; teta>-Math.PI; teta-=Math.PI/26) {
		cheerio1 = new Cheerio(-230 + 100 * Math.cos(teta), 50, -80 + 100 *Math.sin(teta));
		cheerio2 = new Cheerio(230 + 100 * -Math.cos(teta), 50, -80 + 100 *Math.sin(teta));
		cheerio3 = new Cheerio(-230 + 100 * Math.cos(teta), 50, -(-80 + 100 *Math.sin(teta)));
		cheerio4 = new Cheerio(230 + 100 * -Math.cos(teta), 50, -(-80 + 100 *Math.sin(teta)));
		/*objectsgroup.add(cheerio1);
		objectsgroup.add(cheerio2);
		objectsgroup.add(cheerio3);
		objectsgroup.add(cheerio4);*/
		arrayCheerios.push(cheerio1);
		arrayCheerios.push(cheerio2);
		arrayCheerios.push(cheerio3);
		arrayCheerios.push(cheerio4);
	}

	for(teta=-Math.PI/2; teta>-Math.PI; teta-=Math.PI/18) {
	 	cheerio1 = new Cheerio(-230 + 50 * Math.cos(teta), 50, -80 + 50 *Math.sin(teta));
	 	cheerio2 = new Cheerio(230 + 50 * -Math.cos(teta), 50, -80 + 50 *Math.sin(teta));
	 	cheerio3 = new Cheerio(-230 + 50 * Math.cos(teta), 50, -(-80 + 50 *Math.sin(teta)));
	 	cheerio4 = new Cheerio(230 + 50 * -Math.cos(teta), 50, -(-80 + 50 *Math.sin(teta)));
	 	/*objectsgroup.add(cheerio1);
		objectsgroup.add(cheerio2);
		objectsgroup.add(cheerio3);
		objectsgroup.add(cheerio4);*/
		arrayCheerios.push(cheerio1);
		arrayCheerios.push(cheerio2);
		arrayCheerios.push(cheerio3);
		arrayCheerios.push(cheerio4);
	}

	/*cheerio1 = new Cheerio(0, 50, 0);
	arrayCheerios.push(cheerio1);*/


	var i = 0;
	var o = 0;

	while (i < numeroOranges) {
		var Ox = Math.random() * (maxX - minX) + minX;
		var Oz = Math.random() * (maxZ - minZ) + minZ;
		laranja = new Orange(Ox, 56, Oz, orangeMaterialsPhong[0], orangeMaterialsPhong[1]);

		var anguloNovo = Math.random() * (MAX_ANGLE - MIN_ANGLE) + MIN_ANGLE;
		laranja.position.set(Ox, 56, Oz);
		arrayAngulos[i] = anguloNovo;
		rotate(laranja, new THREE.Vector3(0,1,0), arrayAngulos[i]);
		arrayOranges.push(laranja);
		objectsgroup.add(laranja);
		i++;
	}
	while (o < numeroManteigas) {
		var Ox = Math.random() * (maxX - minX) + minX;
		var Oz = Math.random() * (maxZ - minZ) + minZ;
		butter = new Butter(Ox, 53, Oz);
		o++;
	}


	mesa = new Mesa(0, 0, 0);

	car = new Car(0, 53, 155);


	candle1 = new Candle(0, 56, 50, materialCandleBase, materialCandleFlame);
	createCandleLight(0, 50);

	candle2 = new Candle(230, 56, 80, materialCandleBase, materialCandleFlame);
	createCandleLight(230, 80);

	candle3 = new Candle(-230, 56, 80, materialCandleBase, materialCandleFlame);
	createCandleLight(-230, 80);

	candle4 = new Candle(230, 56, -80, materialCandleBase, materialCandleFlame);
	createCandleLight(230, -80);

	candle5 = new Candle(-230, 56, -80, materialCandleBase, materialCandleFlame);
	createCandleLight(-230, -80);

	candle6 = new Candle(0, 56, -50, materialCandleBase, materialCandleFlame);
	createCandleLight(0, -50);


  	objectsgroup.add(candle1);
  	objectsgroup.add(candle2);
  	objectsgroup.add(candle3);
  	objectsgroup.add(candle4);
  	objectsgroup.add(candle5);
  	objectsgroup.add(candle6);


	scene.add(objectsgroup);

}




 //---------------------------------------------------------------------------//
 //										PARTE 3
 //---------------------------------------------------------------------------//


function createButter (butter, x, y, z) {
	var meshes = [];

	var butterMaterial = butterMaterialsPhong[0];

	var geo = createButterMalha();
	geo.computeFaceNormals();
	var mesh = new THREE.Mesh(geo, butterMaterial);
	butter.add(mesh);

	butter.position.x = x;
	butter.position.y = y;
	butter.position.z = z;

	objectsgroup.add(butter);
}

function createMesa (mesa, x, y, z) {
	var meshes = [];

	var mesaMaterial = new THREE.MeshPhongMaterial({color: 0xA9A9A9, wireframe: false});

	var geo = createMesaMalha();
	geo.computeFaceNormals();
	var mesh = new THREE.Mesh(geo, mesaMaterial);
	mesa.add(mesh);

	mesa.position.x = x;
	mesa.position.y = y;
	mesa.position.z = z;

	objectsgroup.add(mesa);
}

function createCheerio (cheerio, x, y, z) {
	var meshes = [];

	var cheerioMaterial = cheeriosMaterialsPhong[0];

	var geo = createCheerioMalha();
	geo.computeFaceNormals();
	var mesh = new THREE.Mesh(geo, cheerioMaterial);
	cheerio.add(mesh);

	cheerio.position.x = x;
	cheerio.position.y = y;
	cheerio.position.z = z;

	objectsgroup.add(cheerio);
}

function createCar (car, x, y, z) {
	var meshes = [];

	var carMaterial = carMaterialsPhong[0];

	var geo = createCarMalha();
	geo.computeFaceNormals();
	var mesh = new THREE.Mesh(geo, carMaterial);
	car.add(mesh);

	car.position.x = x;
	car.position.y = y;
	car.position.z = z;

	objectsgroup.add(car);
}

function createOrange (orange, x, y, z) {
	var meshes = [];

	var orangeMaterial1 = orangeMaterialsPhong[0];
	var orangeMaterial2 = orangeMaterialsPhong[1];

	var geo1 = createOrangeMalha();
	geo1.computeFaceNormals();
	var mesh1 = new THREE.Mesh(geo1, orangeMaterial1);
	orange.add(mesh1);

	var geo2 = createOrangeMalha();
	geo2.computeFaceNormals();
	geo2.rotateZ(Math.PI/4);
	geo2.rotateX(Math.PI/4);
	var mesh2 = new THREE.Mesh(geo2, orangeMaterial2);
	orange.add(mesh2);


	orange.position.x = x;
	orange.position.y = y;
	orange.position.z = z;

	objectsgroup.add(car);
}



/* Creates a face for a given geometry*/
function createFace(faces, v0, v1, v2, v3, side) {
	if (side) {
		faces.push(
			new THREE.Face3(v0, v2, v1),
			new THREE.Face3(v1, v2, v3)
		);
	}

	else {
		faces.push(
			new THREE.Face3(v0, v1, v2),
			new THREE.Face3(v1, v3, v2)
		);
	}
}

/* Creates a vertex group for a given shape*/
function createVertexGroup(vertex, x0, x1, y0, y1, z0, z1) {
	vertex.push(
		new THREE.Vector3(x0, y1, z0),  // v0  v1
		new THREE.Vector3(x1, y1, z0),	// v2  v3
		new THREE.Vector3(x0, y0, z0),
		new THREE.Vector3(x1, y0, z0),

		new THREE.Vector3(x0, y1, z1), 	// v4  v5
		new THREE.Vector3(x1, y1, z1),	// v6  v7
		new THREE.Vector3(x0, y0, z1),
		new THREE.Vector3(x1, y0, z1)
	);
}


function createButterMalha() {

	var geo = new THREE.Geometry();

	var vertex = [];

	createVertexGroup(vertex, -9.5, 9.5, -4.5, 4.5, -4, 4);

	var faces = [];

	createFace(faces, 0, 1, 2, 3, 0); 	//Back
	createFace(faces, 4, 5, 6, 7, 1); 	//Front

	createFace(faces, 0, 2, 4, 6, 0); 	//Left
	createFace(faces, 1, 3, 5, 7, 1);	//Right

	createFace(faces, 0, 1, 4, 5, 1);	//Top
	createFace(faces, 6, 7, 2, 3, 1);	//Bottom

	geo.vertices = vertex;
	geo.faces = faces;
	geo.computeFaceNormals();

	return geo;
}


function createMesaMalha() {

	var geo = new THREE.Geometry();

	var vertex = [];

	createVertexGroup(vertex, -350, 350, -50, 50, -200, 200);

	var faces = [];

	// Biggest Part
	createFace(faces, 0, 1, 2, 3, 0); 	//Back
	createFace(faces, 4, 5, 6, 7, 1); 	//Front

	createFace(faces, 0, 2, 4, 6, 0); 	//Left
	createFace(faces, 1, 3, 5, 7, 1);	//Right

	createFace(faces, 0, 1, 4, 5, 1);	//Top
	createFace(faces, 6, 7, 2, 3, 1);	//Bottom

	geo.vertices = vertex;
	geo.faces = faces;
	geo.computeFaceNormals();

	return geo;
}

function createCheerioMalha() {

	var geo = new THREE.Geometry();

	var vertex = [];
	createVertexGroup(vertex, -2.5, -1.25, -0.5, 0.5, -2.5, 0);
	createVertexGroup(vertex, 1.25, 2.5, -0.5, 0.5, -2.5, 0);
	createVertexGroup(vertex, -1.25, 1.25, -0.5, 0.5, 0, 1.25);
	createVertexGroup(vertex, -1.25, 1.25, -0.5, 0.5, -3.75, -2.5);
	createVertexGroup(vertex, -2.25, -1.25, -0.5, 0.5, -3.75, -2.5);



	var faces = [];

	// Biggest Part
	createFace(faces, 0, 1, 2, 3, 0); 	//Back
	createFace(faces, 4, 5, 6, 7, 1); 	//Top
	createFace(faces, 0, 2, 4, 6, 0); 	//Left
	createFace(faces, 1, 3, 5, 7, 1);	//Right
	createFace(faces, 0, 1, 4, 5, 1);	//TOP
	createFace(faces, 6, 7, 2, 3, 1);	//Front

	createFace(faces, 8, 9, 10, 11, 0);	//Bottom
	createFace(faces, 12, 13, 14, 15, 1);	//Top
	createFace(faces, 8, 10, 12, 14, 0); 	//Left
	createFace(faces, 9, 11, 13, 15, 1);	//Right
	createFace(faces, 8, 9, 12, 13, 1);		//Back
	createFace(faces, 14, 15, 10, 11, 1);	//Front

	createFace(faces, 16, 17, 18, 19, 0);	//Bottom
	createFace(faces, 20, 21, 22, 23, 1);	//Top
	createFace(faces, 16, 18, 20, 22, 0); 	//Left
	createFace(faces, 17, 19, 21, 23, 1);	//Right
	createFace(faces, 16, 17, 20, 21, 1);		//Back
	createFace(faces, 22, 23, 18, 19, 1);	//Front

	createFace(faces, 24, 25, 26, 27, 0);	//Bottom
	createFace(faces, 28, 29, 30, 31, 1);	//Top
	createFace(faces, 24, 26, 28, 30, 0); 	//Left
	createFace(faces, 25, 27, 29, 31, 1);	//Right
	createFace(faces, 24, 25, 28, 29, 1);		//Back
	createFace(faces, 30, 31, 26, 27, 1);	//Front*/

	//faces.push(new THREE.Face3(32, 33, 34));

	geo.vertices = vertex;
	geo.faces = faces;
	geo.computeFaceNormals();

	return geo;
}

function createCarMalha() {
	var geo = new THREE.Geometry();

	var vertex = [];

	createVertexGroup(vertex, -9.5, 9.5, -3.5, 3.5, -4, 4); //vertices da carrocaria 
	createVertexGroup(vertex, -5, 5, 4.5, 6.5, -4, 4); //vertices do tejadilho

	createVertexGroup(vertex, -7.5, -1.5, -2.5, 0.5, -6, -4); //vertices roda esquerda de tras
	createVertexGroup(vertex, -5.5, -3.5, -4.5, 2.5, -6, -4);

	createVertexGroup(vertex, 1.5, 7.5, -2.5, 0.5, -6, -4); //vertices da roda esquerda da frente
	createVertexGroup(vertex, 3.5, 5.5, -4.5, 2.5, -6, -4); 

	createVertexGroup(vertex, 1.5, 7.5, -2.5, 0.5, 4, 6); //vertices da roda direita da frente
	createVertexGroup(vertex, 3.5, 5.5, -4.5, 2.5, 4, 6); 

	createVertexGroup(vertex, -7.5, -1.5, -2.5, 0.5, 4, 6); //vertices da roda direita de tras
	createVertexGroup(vertex, -5.5, -3.5, -4.5, 2.5, 4, 6);



	var faces = [];

	createFace(faces, 0, 1, 2, 3, 0); 	//Back, ou seja, o lado que nao esta virado para nos na camara 2
	createFace(faces, 4, 5, 6, 7, 1); 	//Front, ou seja, o lado que esta virado para nos na camara 2

	createFace(faces, 0, 2, 4, 6, 0); 	//Left
	createFace(faces, 1, 3, 5, 7, 1);	//Right

	createFace(faces, 0, 1, 4, 5, 1);	//Top
	createFace(faces, 6, 7, 2, 3, 1);	//Bottom

//TEJADILHO 
	createFace(faces, 8, 9, 0, 1, 1); //back
	createFace(faces, 12, 13, 4, 5, 0); //front
	createFace(faces, 8, 9, 12, 13, 1); //top
	createFace(faces, 8, 12, 0, 4, 1); //left
	createFace(faces, 9, 13, 1, 5, 0); //right

//RODA ESQUERDA DE TRAS
	createFace(faces, 16, 24, 20, 28, 1); 
	createFace(faces, 24, 25, 28, 29, 1);
	createFace(faces, 25, 29, 17, 21, 0); 
	createFace(faces, 17, 19, 21, 23, 0); 
	createFace(faces, 19, 23, 27, 31, 1);
	createFace(faces, 30, 31, 26, 27, 0);
	createFace(faces, 30, 26, 22, 18, 0);
	createFace(faces, 28, 29, 30, 31, 1);
	createFace(faces, 24, 25, 26, 27, 0);
	createFace(faces, 20, 21, 22, 23, 0);
	createFace(faces, 16, 17, 18, 19, 0);
	createFace(faces, 17, 21, 19, 23, 0);
	createFace(faces, 16, 20, 18, 22, 1);

//RODA ESQUERDA DA FRENTE
	//exatamente igual ao de cima mas somamos 16 a cada um dos valores porque agora temos mais 16 vertices
	createFace(faces, 32, 40, 36, 44, 1);
	createFace(faces, 40, 41, 44, 45, 1);
	createFace(faces, 41, 45, 33, 37, 0); 
	createFace(faces, 33, 35, 37, 39, 1); 
	createFace(faces, 35, 39, 43, 47, 1);
	createFace(faces, 46, 47, 42, 43, 0);
	createFace(faces, 46, 42, 38, 34, 0);
	createFace(faces, 44, 45, 46, 47, 1);
	createFace(faces, 40, 41, 42, 43, 0);
	createFace(faces, 36, 37, 38, 39, 0);
	createFace(faces, 32, 33, 34, 35, 0);
	createFace(faces, 33, 37, 35, 39, 0);
	createFace(faces, 32, 36, 34, 38, 1);

//RODA DIREITA DA FRENTE
	//exatamente igual ao de cima mas somamos 16 a cada um dos valores porque agora temos mais 16 vertices
	createFace(faces, 48, 56, 52, 60, 1);
	createFace(faces, 56, 57, 60, 61, 1);
	createFace(faces, 57, 61, 49, 53, 0); 
	createFace(faces, 49, 51, 53, 55, 1); 
	createFace(faces, 51, 55, 59, 63, 1);
	createFace(faces, 62, 63, 58, 59, 0);
	createFace(faces, 62, 58, 54, 50, 0);
	createFace(faces, 60, 61, 62, 63, 1);
	createFace(faces, 56, 57, 58, 59, 0);
	createFace(faces, 52, 53, 54, 55, 1);
	createFace(faces, 48, 49, 50, 51, 0);
	createFace(faces, 49, 53, 51, 55, 0);
	createFace(faces, 48, 52, 50, 54, 1);

//RODA DIREITA DE TRAS
	//exatamente igual ao de cima mas somamos 16 a cada um dos valores porque agora temos mais 16 vertices
	createFace(faces, 64, 72, 68, 76, 1);
	createFace(faces, 72, 73, 76, 77, 1);
	createFace(faces, 73, 77, 65, 69, 0); 
	createFace(faces, 65, 67, 69, 71, 1); 
	createFace(faces, 67, 71, 75, 79, 1);
	createFace(faces, 78, 79, 74, 75, 0);
	createFace(faces, 78, 74, 70, 66, 0);
	createFace(faces, 76, 77, 78, 79, 1);
	createFace(faces, 72, 73, 74, 75, 0);
	createFace(faces, 68, 69, 70, 71, 1);
	createFace(faces, 64, 65, 66, 67, 0);
	createFace(faces, 65, 69, 67, 71, 0);
	createFace(faces, 64, 68, 66, 70, 1);







	geo.vertices = vertex;
	geo.faces = faces;
	geo.computeFaceNormals();

	return geo;


}

function createOrangeMalha() {
	var geo = new THREE.Geometry();

	var vertex = [];

	createVertexGroup(vertex, -10, 10, -10, 10, -10, 10);
	//createVertexGroup(vertex, x1, x2, -5, 5, z1, z2);
	//createVertexGroup(vertex, x1, x2, y1, y2, -5, 5);



	var faces = [];

	createFace(faces, 0, 1, 2, 3, 0); 	//Back, ou seja, o lado que nao esta virado para nos na camara 2
	createFace(faces, 4, 5, 6, 7, 1); 	//Front, ou seja, o lado que esta virado para nos na camara 2

	createFace(faces, 0, 2, 4, 6, 0); 	//Left
	createFace(faces, 1, 3, 5, 7, 1);	//Right

	createFace(faces, 0, 1, 4, 5, 1);	//Top
	createFace(faces, 6, 7, 2, 3, 1);	//Bottom

/*

//RODA ESQUERDA DA FRENTE
	//exatamente igual ao de cima mas somamos 16 a cada um dos valores porque agora temos mais 16 vertices
	createFace(faces, 32, 40, 36, 44, 1);
	createFace(faces, 40, 41, 44, 45, 1);
	createFace(faces, 41, 45, 33, 37, 0); 
	createFace(faces, 33, 35, 37, 39, 1); 
	createFace(faces, 35, 39, 43, 47, 1);
	createFace(faces, 46, 47, 42, 43, 0);
	createFace(faces, 46, 42, 38, 34, 0);
	createFace(faces, 44, 45, 46, 47, 1);
	createFace(faces, 40, 41, 42, 43, 0);
	createFace(faces, 36, 37, 38, 39, 0);
	createFace(faces, 32, 33, 34, 35, 0);
	createFace(faces, 33, 37, 35, 39, 0);
	createFace(faces, 32, 36, 34, 38, 1);

//RODA DIREITA DA FRENTE
	//exatamente igual ao de cima mas somamos 16 a cada um dos valores porque agora temos mais 16 vertices
	createFace(faces, 48, 56, 52, 60, 1);
	createFace(faces, 56, 57, 60, 61, 1);
	createFace(faces, 57, 61, 49, 53, 0); 
	createFace(faces, 49, 51, 53, 55, 1); 
	createFace(faces, 51, 55, 59, 63, 1);
	createFace(faces, 62, 63, 58, 59, 0);
	createFace(faces, 62, 58, 54, 50, 0);
	createFace(faces, 60, 61, 62, 63, 1);
	createFace(faces, 56, 57, 58, 59, 0);
	createFace(faces, 52, 53, 54, 55, 1);
	createFace(faces, 48, 49, 50, 51, 0);
	createFace(faces, 49, 53, 51, 55, 0);
	createFace(faces, 48, 52, 50, 54, 1);

//RODA DIREITA DE TRAS
	//exatamente igual ao de cima mas somamos 16 a cada um dos valores porque agora temos mais 16 vertices
	createFace(faces, 64, 72, 68, 76, 1);
	createFace(faces, 72, 73, 76, 77, 1);
	createFace(faces, 73, 77, 65, 69, 0); 
	createFace(faces, 65, 67, 69, 71, 1); 
	createFace(faces, 67, 71, 75, 79, 1);
	createFace(faces, 78, 79, 74, 75, 0);
	createFace(faces, 78, 74, 70, 66, 0);
	createFace(faces, 76, 77, 78, 79, 1);
	createFace(faces, 72, 73, 74, 75, 0);
	createFace(faces, 68, 69, 70, 71, 1);
	createFace(faces, 64, 65, 66, 67, 0);
	createFace(faces, 65, 69, 67, 71, 0);
	createFace(faces, 64, 68, 66, 70, 1);*/

	geo.vertices = vertex;
	geo.faces = faces;
	geo.computeFaceNormals();

	return geo;


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
			changeShading(0);
			
			break;

		case 76: //L
		case 108: //l
			changeShading(1);
			break;

		case 67: //C
		case 99: //C
			toggleCandleLight();
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


	//var helper = new THREE.DirectionalLightHelper(sun);
	//scene.add(helper);

	scene.add(sun.target);
	scene.add(sun);
}

function createCandleLight(x, z) {

	vela1 = new THREE.PointLight(0xffffff, 0.75, 350);
	vela1.rotateY(Math.PI);
	vela1.position.set(x, 63.5, z);
	vela1.castShadow = true;

	//var helper = new THREE.PointLightHelper(vela1);
	//scene.add(helper);

	scene.add(vela1);
	candleLightArray.push(vela1);
}

function toggleSunLight() {
	sun.visible = !sun.visible;
}

function toggleCandleLight() {

	var c;
	for(c in candleLightArray) {
		candleLightArray[c].visible = !candleLightArray[c].visible;
	}
}



function changeShading(flag) {
	for (var obj of objectsgroup.children) {
		obj.changeMaterials(flag);
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
			arrayOranges[i].visible = false;
			var Ox = Math.random() * (maxX - minX) + minX;
			var Oz = Math.random() * (maxZ - minZ) + minZ;
			var anguloNovo = Math.random() * (MAX_ANGLE - MIN_ANGLE) + MIN_ANGLE;
			arrayOranges[i].position.set(Ox, 56, Oz);
			arrayAngulos[i] = anguloNovo;
			var newMaxVelocity = Math.random() * (2 - 0.5) + 0.5;
			arrayOranges[i].maximumVelocity = newMaxVelocity;

			setTimeout(reAddOrange, 2000, arrayOranges[i]);
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
	laranjinha.visible = true;
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
	createSunLight();
	changeShading(1);


	render();

	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
}
