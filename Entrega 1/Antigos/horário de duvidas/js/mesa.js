
/*global THREE*/

var camera, scene, renderer, material, materialOrange, geometry, mesh, orange, torus, mesh1, car;
var materialArray = new Array();

//--------------------------------------------------------
 //--------------------OBSTACULOS-------------------------
 //--------------------------------------------------------

function createOrange(materialOrange, x, y, z) {
    'use strict';

    orange = new THREE.Object3D();

    geometry = new THREE.SphereGeometry(10, 10, 10);
    mesh = new THREE.Mesh(geometry, materialOrange);
    orange.add(mesh);
    orange.position.set(x, y, z);
    scene.add(orange);
}

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

//--------------------------BUTTER---------------------
function addButterTop(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(19, 9, 8);

    mesh = new THREE.Mesh(geometry, materialTopo);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addButterPlate(obj, x, y, z) {
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


 //--------------------------------------------------------
 //-------------------------MESA---------------------------
 //--------------------------------------------------------

function addTableTop(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(700, 100, 350);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createTable(x, y, z) {
    'use strict';
    var table = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({color: 0xA9A9A9, wireframe: true});

    materialArray.push(material);

    addTableTop(table, 0, 0, 0);

    scene.add(table);

    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
}



//---------------------------------------------------------
//--------------------------CARRO--------------------------
//---------------------------------------------------------

function createWheel(obj, x, y, z) {
	'use strict';
  geometry = new  THREE.TorusGeometry( 3, 1, 160, 100 );
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
  mesh.rotateX( Math.PI / 2 );
  mesh.rotateZ( Math.PI / 2 );
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
	createWheel(newCar, 0, 0, 0);
	createWheel(newCar, -10, 0, 0);
  createWheel(newCar, -10, 0, -10);
  createWheel(newCar, 0, 0, -10);
	createMainTube(newCar, -5,3, -5);
	createCone(newCar,-16, 3, -5);
	createUpperTube(newCar, -5, 6, -5);

	scene.add(newCar);

  newCar.position.x = x;
  newCar.position.y = y;
  newCar.position.z = z;

  return 	newCar;
}


//-------------------------------------------
//--------------PISTA------------------------
//-------------------------------------------


var teta;


function createTrack(mesh1) {
	for(teta=0; teta<360; teta+=3) {

		createCheerio(mesh1, 150 * Math.cos(teta), 52.5, 150 *Math.sin(teta));
		createCheerio(mesh1, 100 * Math.cos(teta), 52.5, 100 *Math.sin(teta));
	}

}



function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.x = 0;
    camera.position.y = 400;
    camera.position.z = 0;
    camera.lookAt(scene.position);
}

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
  createOrange(material, -10, 56, 20);
	createOrange(material, -100, 56, -30);
	createOrange(material, 100, 56, -20);
  createOrange(material, 0, 56, 0);


	materialPrato = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
	materialTopo = new THREE.MeshBasicMaterial({color: 0xffd700, wireframe: true});
  materialArray.push(materialPrato);
  materialArray.push(materialTopo);

	createButter(materialTopo, materialPrato, -50, 56, 20 );
	createButter(materialTopo, materialPrato, 0, 56, -35 );
	createButter(materialTopo, materialPrato, 50, 56, 25 );
	createButter(materialTopo, materialPrato, 100, 56, 25 );
	createButter(materialTopo, materialPrato, -125, 56, 25 );

	car = createCar(0, 53, 75);


}

function moveCar(currentCar){
	var pos = 0;
	var time = 1;
	var acceleration = 1;
	var velocity = 1;

	velocity+=velocity + acceleration * time
	pos+=pos + velocity*time;

	currentCar.position.x = pos;

}

function onResize() {
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = renderer.getSize().width / renderer.getSize().height;
        camera.updateProjectionMatrix();
    }


}

function onKeyDown(e) {
    'use strict';

    switch(e.keyCode) {
        case 65: //A
        case 97: //a
            /*scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            */
            materialArray.forEach(function (node) {
                //if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                //}
            });
            

            break;
        case 38: // up arrow
        	moveCar(car);

    }

}

function animate() {
    'use strict';

 /*   if (ball.userData.jumping) {
        ball.userData.step += 0.04;
        ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
        ball.position.z = 15 * (Math.cos(ball.userData.step));

    }
 */
    render();

    requestAnimationFrame(animate);
}

function render(){
    'use strict';
    renderer.render(scene, camera);

}

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();



    render();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
}
