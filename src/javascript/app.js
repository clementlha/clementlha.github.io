if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("javascript/sw.js").then(function (registration) {
    }).catch(function (error) {
        console.log("Service Worker registration failed:", error);
    });
}

let scene, camera, renderer, controls, sphereGifO3, echelleO3, Tablecarteposte;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
const objects = [];
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let prevTime = performance.now();
let initialCameraY;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(15, 10, 30);
    camera.position.y = 10;
    camera.rotation.y = 1.1;
    initialCameraY = camera.position.y;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext('2d');

    const gradient = context.createLinearGradient(0, 0, 0, 16);
    gradient.addColorStop(0, '#6ec7ff');
    gradient.addColorStop(1, '#ffffff');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 16, 16);

    const backgroundTexture = new THREE.CanvasTexture(canvas);
    scene.background = backgroundTexture;

    controls = new THREE.PointerLockControls(camera, renderer.domElement);
    scene.add(controls.getObject());

    document.addEventListener('click', function () {
        controls.lock();
    });

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 100, 0);
    light.castShadow = true;
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x363636);
    scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();
    const floorTexture = textureLoader.load('./assets/textures/sol.jpg', function (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(5, 5);
    });

    const floorGeometry = new THREE.PlaneGeometry(100, 120);
    const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = - Math.PI / 2;
    scene.add(floor);

    const wallTexture = textureLoader.load('./assets/textures/mur.jpg', function (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 5);
    });

    const wall100Geometry = new THREE.BoxGeometry(100, 30, 1);
    const wall45Geometry = new THREE.BoxGeometry(40, 30, 1);
    const wall30Geometry = new THREE.BoxGeometry(20, 16.66, 1);
    const wallDroiteGeometry = new THREE.BoxGeometry(20, 20, 1);
    const wallGaucheGeometry = new THREE.BoxGeometry(22, 20, 1);
    const wallMaterialMur = new THREE.MeshStandardMaterial({ map: wallTexture });

    const wallCylindreDroite = new THREE.Mesh(wall45Geometry, wallMaterialMur);
    wallCylindreDroite.position.set(-30, 10, -50);
    scene.add(wallCylindreDroite);
    objects.push(wallCylindreDroite);

    const wallCylindreGauche = new THREE.Mesh(wall45Geometry, wallMaterialMur);
    wallCylindreGauche.position.set(30, 10, -50);
    scene.add(wallCylindreGauche);
    objects.push(wallCylindreGauche);

    const geometryCy = new THREE.CylinderGeometry(10, 10, 30, 32, 1, true, 0, Math.PI);
    const geometryCyPillier = new THREE.CylinderGeometry(1, 4, 10, 32, 1, false);
    const materialCy = new THREE.MeshPhongMaterial({
        map: wallTexture,
        side: THREE.DoubleSide,
    });

    const cylinder = new THREE.Mesh(geometryCy, materialCy);
    cylinder.position.set(0, 10, -50);
    cylinder.rotation.y = Math.PI / 2;
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    scene.add(cylinder);
    objects.push(cylinder);

    const cylinderPillier = new THREE.Mesh(geometryCyPillier, materialCy);
    cylinderPillier.position.set(0, 0, -55);
    scene.add(cylinderPillier);
    objects.push(cylinderPillier);

    const geometryCyP1 = new THREE.CylinderGeometry(1 / 3, 1 / 3, 10, 32, 1, false);
    const cylinderPillier1 = new THREE.Mesh(geometryCyP1, materialCy);
    cylinderPillier1.position.set(-5, 0, -45);
    scene.add(cylinderPillier1);
    objects.push(cylinderPillier1);
    const cylinderPillier2 = new THREE.Mesh(geometryCyP1, materialCy);
    cylinderPillier2.position.set(5, 0, -45);
    scene.add(cylinderPillier2);
    objects.push(cylinderPillier2);
    const echelleO3Box = new THREE.BoxGeometry(12, 6, 1 / 5);

    const videoEchelle = document.getElementById('videoTextureEchelleO3');
    videoEchelle.play();
    const videoTextureEchelleO3 = new THREE.VideoTexture(videoEchelle);
    videoTextureEchelleO3.colorSpace = THREE.SRGBColorSpace;
    const materialEchelleO3 = [
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ map: videoTextureEchelleO3 })
    ];

    echelleO3 = new THREE.Mesh(echelleO3Box, materialEchelleO3);
    echelleO3.position.set(0, 5, -45);
    echelleO3.rotation.x = 1.78;
    echelleO3.rotation.z = Math.PI;
    scene.add(echelleO3);
    objects.push(echelleO3);
    const geometryInvisibleEchelle = new THREE.BoxGeometry(12, 25, 6);
    const InvisibleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false });
    const InvisibleBox = new THREE.Mesh(geometryInvisibleEchelle, InvisibleMaterial);
    InvisibleBox.position.set(0, 5, -45);
    scene.add(InvisibleBox);
    objects.push(InvisibleBox);


    const wall2 = new THREE.Mesh(wall100Geometry, wallMaterialMur);
    wall2.position.set(50, 10, 0);
    wall2.rotation.y = Math.PI / 2;
    scene.add(wall2);
    objects.push(wall2);

    const wall3 = new THREE.Mesh(wall100Geometry, wallMaterialMur);
    wall3.position.set(0, 10, 50);
    scene.add(wall3);
    objects.push(wall3);

    //wall graph HT
    const TexturegraphHT = textureLoader.load('./assets/BASSETension_796-549.png');
    const materialgraphHT = [
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ map: TexturegraphHT })
    ];
    const wallgraphHT = new THREE.Mesh(wall30Geometry, materialgraphHT);
    wallgraphHT.position.set(20, 12.5, 49.5);
    scene.add(wallgraphHT);
    objects.push(wallgraphHT);

    const cylinderPillier1d = new THREE.Mesh(geometryCyP1, materialCy);
    cylinderPillier1d.position.set(43, -0.5, 27.5);
    scene.add(cylinderPillier1d);
    objects.push(cylinderPillier1d);
    const cylinderPillier2d = new THREE.Mesh(geometryCyP1, materialCy);
    cylinderPillier2d.position.set(43, -0.5, 32.5);
    scene.add(cylinderPillier2d);
    objects.push(cylinderPillier2d);
    const echelleO3Boxd = new THREE.BoxGeometry(8, 4, 1 / 5);

    const TexturegraphGristable = textureLoader.load('./assets/tableGraphGris.png');
    const materialGristable = [
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ map: TexturegraphGristable }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 })
    ];

    TableGraphGris = new THREE.Mesh(echelleO3Boxd, materialGristable);
    TableGraphGris.position.set(43, 5, 30);
    TableGraphGris.rotation.x = Math.PI / 2;//-1.98;
    TableGraphGris.rotation.y = -2.68;
    TableGraphGris.rotation.z = Math.PI / 2;
    scene.add(TableGraphGris);
    objects.push(TableGraphGris);
    const geometryInvisibleGraphGris = new THREE.BoxGeometry(6, 25, 4);
    const InvisibleBoxGris = new THREE.Mesh(geometryInvisibleGraphGris, InvisibleMaterial);
    InvisibleBoxGris.position.set(43, 5, 30);
    scene.add(InvisibleBoxGris);
    objects.push(InvisibleBoxGris);

    const TexturegraphBT = textureLoader.load('./assets/RplotHT_796-549.png');
    const materialgraphBT = [
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }), // face 1
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }), // face 2
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }), // face 3
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }), // face 4
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }), // face 5 avec la vidéo
        new THREE.MeshBasicMaterial({ map: TexturegraphBT })  // face 6
    ];
    const wallgraphbT = new THREE.Mesh(wall30Geometry, materialgraphBT);
    wallgraphbT.position.set(49.5, 12.5, 30);
    wallgraphbT.rotation.y = Math.PI / 2;
    scene.add(wallgraphbT);
    objects.push(wallgraphbT);
    const cylinderPillier1c = new THREE.Mesh(geometryCyP1, materialCy);
    cylinderPillier1c.position.set(17.5, -0.5, 45);
    scene.add(cylinderPillier1c);
    objects.push(cylinderPillier1c);
    const cylinderPillier2c = new THREE.Mesh(geometryCyP1, materialCy);
    cylinderPillier2c.position.set(22.5, -0.5, 45);
    scene.add(cylinderPillier2c);
    objects.push(cylinderPillier2c);
    const echelleO3Boxc = new THREE.BoxGeometry(8, 4, 1 / 5);

    const Texturegraphbleutable = textureLoader.load('./assets/tableGraphBleu.png');
    const materialbleutable = [
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ map: Texturegraphbleutable })
    ];

    TableGraphBleu = new THREE.Mesh(echelleO3Boxc, materialbleutable);
    TableGraphBleu.position.set(20, 5, 45);
    TableGraphBleu.rotation.x = -1.98;
    TableGraphBleu.rotation.y = Math.PI;
    TableGraphBleu.rotation.z = Math.PI;
    scene.add(TableGraphBleu);
    objects.push(TableGraphBleu);
    const geometryInvisibleGraphBleu = new THREE.BoxGeometry(6, 25, 4);
    const InvisibleBoxBleu = new THREE.Mesh(geometryInvisibleGraphBleu, InvisibleMaterial);
    InvisibleBoxBleu.position.set(20, 5, 45);
    scene.add(InvisibleBoxBleu);
    objects.push(InvisibleBoxBleu);

    const TextureCartePosteSource = textureLoader.load('./assets/carteposteS.png');
    const materialCartePosteSource = [
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ map: TextureCartePosteSource })
    ];
    const wallCarte = new THREE.Mesh(wall30Geometry, materialCartePosteSource);
    wallCarte.position.set(-20, 12.5, 49.5);
    scene.add(wallCarte);
    objects.push(wallCarte);
    const cylinderPillier1a = new THREE.Mesh(geometryCyP1, materialCy);
    cylinderPillier1a.position.set(-17.5, -0.5, 45);
    scene.add(cylinderPillier1a);
    objects.push(cylinderPillier1a);
    const cylinderPillier2a = new THREE.Mesh(geometryCyP1, materialCy);
    cylinderPillier2a.position.set(-22.5, -0.5, 45);
    scene.add(cylinderPillier2a);
    objects.push(cylinderPillier2a);
    const echelleO3Boxa = new THREE.BoxGeometry(8, 4, 1 / 5);

    const TextureCartePosteSourcetable = textureLoader.load('./assets/tableCartePoste.png');
    const materialtable = [
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ map: TextureCartePosteSourcetable })
    ];

    Tablecarteposte = new THREE.Mesh(echelleO3Boxa, materialtable);
    Tablecarteposte.position.set(-20, 5, 45);
    Tablecarteposte.rotation.x = -1.98;
    Tablecarteposte.rotation.y = Math.PI;
    Tablecarteposte.rotation.z = Math.PI;
    scene.add(Tablecarteposte);
    objects.push(Tablecarteposte);
    ClickToSiteExterne(Tablecarteposte, 'posteSource.html', -30, 0, 200);
    const geometryInvisibleCartePoste = new THREE.BoxGeometry(6, 25, 4);
    const InvisibleBoxCP = new THREE.Mesh(geometryInvisibleCartePoste, InvisibleMaterial);
    InvisibleBoxCP.position.set(-20, 5, 45);
    scene.add(InvisibleBoxCP);
    objects.push(InvisibleBoxCP);

    const TextureCarteligneElec = textureLoader.load('./assets/htaAS.png');
    const materialCarteLigneElec = [
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ map: TextureCarteligneElec }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 })
    ];
    const wallCarteLigne = new THREE.Mesh(wall30Geometry, materialCarteLigneElec);
    wallCarteLigne.position.set(-49.5, 12.5, 10);
    wallCarteLigne.rotation.y = Math.PI / 2;
    scene.add(wallCarteLigne);
    objects.push(wallCarteLigne);

    const cylinderPillier1b = new THREE.Mesh(geometryCyP1, materialCy);
    cylinderPillier1b.position.set(-45, -0.2, 7.5);
    scene.add(cylinderPillier1b);
    objects.push(cylinderPillier1b);
    const cylinderPillier2b = new THREE.Mesh(geometryCyP1, materialCy);
    cylinderPillier2b.position.set(-45, -0.2, 12.5);
    scene.add(cylinderPillier2b);
    objects.push(cylinderPillier2b);
    const echelleO3Boxb = new THREE.BoxGeometry(8, 4, 1 / 5);

    const TextureCarteHTAtable = textureLoader.load('./assets/tableCarteHTA.png');
    const materialtableHTA = [
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ map: TextureCarteHTAtable }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 })
    ];

    Tablecarteposte = new THREE.Mesh(echelleO3Boxb, materialtableHTA);
    Tablecarteposte.position.set(-45, 5, 10);
    Tablecarteposte.rotation.x = Math.PI / 2;//-1.98;
    Tablecarteposte.rotation.y = 2.68;
    Tablecarteposte.rotation.z = Math.PI / 2 + Math.PI;
    scene.add(Tablecarteposte);
    objects.push(Tablecarteposte);
    ClickToSiteExterne(Tablecarteposte, 'posteSource.html', -90, 15, 0);
    const geometryInvisibleCarteHTA = new THREE.BoxGeometry(6, 25, 4);
    const InvisibleBoxHTA = new THREE.Mesh(geometryInvisibleCarteHTA, InvisibleMaterial);
    InvisibleBoxHTA.position.set(-45, 5, 10);
    scene.add(InvisibleBoxHTA);
    objects.push(InvisibleBoxHTA);

    const cylinderPillier1z = new THREE.Mesh(geometryCyP1, materialCy);
    cylinderPillier1z.position.set(-28, -0.2, -38);
    scene.add(cylinderPillier1z);
    objects.push(cylinderPillier1z);
    const cylinderPillier2z = new THREE.Mesh(geometryCyP1, materialCy);
    cylinderPillier2z.position.set(-28, -0.2, -42);
    scene.add(cylinderPillier2z);
    objects.push(cylinderPillier2z);
    const echelleO3Boxz = new THREE.BoxGeometry(8, 4, 1 / 5);

    const TextureCarteHTAtablz = textureLoader.load('./assets/tableHisto.png');
    const materialtableHTz = [
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshBasicMaterial({ map: TextureCarteHTAtablz }),
        new THREE.MeshBasicMaterial({ color: 0xb0b0b0 })
    ];

    TableHisto = new THREE.Mesh(echelleO3Boxz, materialtableHTz);
    TableHisto.position.set(-28, 5, -40);
    TableHisto.rotation.x = Math.PI / 2;//-1.98;
    TableHisto.rotation.y = 2.68;
    TableHisto.rotation.z = Math.PI / 2 + Math.PI;
    scene.add(TableHisto);
    objects.push(TableHisto);
    ClickToSiteExterne(TableHisto, 'i4.html', -90, 15, 0);
    const geometryInvisibleHisto = new THREE.BoxGeometry(6, 25, 4);
    const InvisibleHisto = new THREE.Mesh(geometryInvisibleHisto, InvisibleMaterial);
    InvisibleHisto.position.set(-28, 5, -40);
    scene.add(InvisibleHisto);
    objects.push(InvisibleHisto);

    const wall4 = new THREE.Mesh(wall100Geometry, wallMaterialMur);
    wall4.position.set(-50, 10, 0);
    wall4.rotation.y = Math.PI / 2;
    scene.add(wall4);
    objects.push(wall4);

    const geometryCollision = new THREE.BoxGeometry(2, 25, 1);
    const collisionMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false });
    const collisionPerso = new THREE.Mesh(geometryCollision, collisionMaterial);
    controls.getObject().add(collisionPerso);

    const loader = new THREE.GLTFLoader();
    loader.load('./assets/scene.glb',
        function (gltf) {
            const model = gltf.scene;

            const scaleFactor = 1 / 55;
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            model.position.x = -center.x + 30; //x
            model.position.y = 0.5; //hauteur
            model.position.z = -center.z - 20; //y

            model.rotation.y = Math.PI / 2 + Math.PI;

            model.traverse((node) => {
                if (node.isMesh) {
                    node.material.metalness = 0.2;
                    node.material.roughness = 0.2;
                    node.material.needsUpdate = true;
                }
            });

            scene.add(model);
        },
        undefined,
        function (error) {
            console.error('Une erreur est survenue lors du chargement du modèle GLB', error);
        }
    );

    const wallTextureHistoDroite = textureLoader.load('./assets/textures/echelleDroite.png', function (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
    });
    const materialHistoD = [
        new THREE.MeshBasicMaterial({ color: 0xfbfbfbf }),
        new THREE.MeshBasicMaterial({ color: 0xfbfbfbf }),
        new THREE.MeshBasicMaterial({ color: 0xfbfbfbf }),
        new THREE.MeshBasicMaterial({ color: 0xfbfbfbf }),
        new THREE.MeshBasicMaterial({ map: wallTextureHistoDroite }),
        new THREE.MeshBasicMaterial({ color: 0xfbfbfbf })
    ];

    const wallTextureHistoGauche = textureLoader.load('./assets/textures/echelleGauche.png', function (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
    });
    const materialHistoG = [
        new THREE.MeshBasicMaterial({ color: 0xfbfbfbf }),
        new THREE.MeshBasicMaterial({ color: 0xfbfbfbf }),
        new THREE.MeshBasicMaterial({ color: 0xfbfbfbf }),
        new THREE.MeshBasicMaterial({ color: 0xfbfbfbf }),
        new THREE.MeshBasicMaterial({ map: wallTextureHistoGauche }),
        new THREE.MeshBasicMaterial({ color: 0xfbfbfbf })
    ];

    const wallHistoDroite = new THREE.Mesh(wallDroiteGeometry, materialHistoD);
    wallHistoDroite.position.set(-41, 10, -49);
    scene.add(wallHistoDroite);
    objects.push(wallHistoDroite);
    const wallHistoGauche = new THREE.Mesh(wallGaucheGeometry, materialHistoG);
    wallHistoGauche.position.set(-49.5, 10, -38);
    wallHistoGauche.rotation.y = Math.PI / 2;
    scene.add(wallHistoGauche);
    objects.push(wallHistoGauche);

    const AnneeHisto = {
        wallHisto2018: ["-32", "2018"],
        wallHisto2019: ["-35", "2019"],
        wallHisto2020: ["-38", "2020"],
        wallHisto2021: ["-41", "2021"],
        wallHisto2022: ["-44", "2022"],
        wallHisto2023: ["-47", "2023"]
    };

    Object.entries(AnneeHisto).forEach(([key, value]) => {
        const [numericValue, textValue] = value;

        const textTexture = createTextTexture(textValue, { fontsize: 64, color: 'rgba(0, 0, 0, 1)', backgroundColor: 'rgba(255, 255, 255, 1)' }, 256, 128);

        const material = [
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({ map: textTexture }),
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        ];

        const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1 / 10, 1), material);
        mesh.position.set(-33, 0.5, parseFloat(numericValue));
        mesh.rotation.x = Math.PI;
        mesh.rotation.y = Math.PI / 2;

        scene.add(mesh);
    });

    const techHisto = {
        wallHisto2018: ["-35.5", "Turbine à combustion"],
        wallHisto2019: ["-38.5", "Photovoltaïque"],
        wallHisto2020: ["-41.5", "Liaisons"],
        wallHisto2021: ["-44.5", "Hydraulique"],
        wallHisto2022: ["-47.5", "Moteur diesel"]
    };

    Object.entries(techHisto).forEach(([key, value]) => {
        const [numericValue, textValue] = value;

        const textTexture = createTextTexture(textValue, { fontsize: 64, color: 'rgba(0, 0, 0, 1)', backgroundColor: 'rgba(255, 255, 255, 1)' }, 1024, 128);

        const material = [
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // face 1
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // face 3
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // face 4
            new THREE.MeshBasicMaterial({ map: textTexture }), // face 2
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // face 5
            new THREE.MeshBasicMaterial({ color: 0xffffff })  // face 6
        ];

        const mesh = new THREE.Mesh(new THREE.BoxGeometry(8, 1 / 10, 1), material);
        mesh.position.set(parseFloat(numericValue), 0.5, -26);
        mesh.rotation.x = Math.PI;
        mesh.rotation.y = Math.PI / 2;

        scene.add(mesh);
    });



    loader.load('./assets/Hist3DBlender.glb',
        function (gltf) {
            const Hist3DBlender = gltf.scene;

            const scaleFactor = 3;
            Hist3DBlender.scale.set(scaleFactor, scaleFactor, scaleFactor);

            const box = new THREE.Box3().setFromObject(Hist3DBlender);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            Hist3DBlender.position.x = -center.x - 25;
            Hist3DBlender.position.y = 0.5;
            Hist3DBlender.position.z = -center.z - 38;

            Hist3DBlender.traverse((node) => {
                if (node.isMesh) {
                    node.material.metalness = 0.2;
                    node.material.roughness = 0.2;
                    node.material.needsUpdate = true;
                }
            });

            Hist3DBlender.rotation.y = Math.PI / 2;

            scene.add(Hist3DBlender);

        },
        undefined,
        function (error) {
            console.error('Une erreur est survenue lors du chargement du modèle GLB', error);
        }
    );

    const video = document.getElementById('videoTextureMp4O3');
    video.play();
    const videoTextureMp4O3 = new THREE.VideoTexture(video);
    videoTextureMp4O3.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(6, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: videoTextureMp4O3 });
    sphereGifO3 = new THREE.Mesh(geometry, material);
    sphereGifO3.rotation.y = -3 / 2;
    sphereGifO3.position.set(0, 10, -55);

    scene.add(sphereGifO3);
    objects.push(sphereGifO3);

    window.addEventListener('resize', onWindowResize);

    controls.addEventListener('lock', function () {
        document.getElementById('instructions').style.display = 'none';
        controls.lock();
    });

    controls.addEventListener('unlock', function () {
        document.getElementById('instructions').style.display = '';   
        controls.unlock()  
    });
}

function ClickToSiteExterne(wall, url, x, y, z) {
    const raycaster = new THREE.Raycaster();
    document.addEventListener('click', () => {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        raycaster.set(camera.position, direction);

        const intersects = raycaster.intersectObject(wall);

        if (intersects.length > 0) {
            window.open(url, '_blank');
            camera.lookAt(x, y, z);
        }
    });
}


function createTextTexture(text, options = {}, width, height) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    const fontsize = options.fontsize || 64;
    const color = options.color || 'rgba(0, 0, 0, 1)';
    const backgroundColor = options.backgroundColor || 'rgba(255, 255, 255, 1)';

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.translate(width / 2, height / 2);
    context.rotate(Math.PI);
    context.translate(-width / 2, -height / 2);

    context.font = `${fontsize}px Arial`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
}

const floorSize = 50;

function checkBounds() {
    if (camera.position.x > floorSize || camera.position.x < -floorSize ||
        camera.position.z > floorSize || camera.position.z < -floorSize) {
        camera.position.set(0, 10, 0);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
}

function checkCollision() {
    const originPoint = controls.getObject().position.clone();
    const collisionDistance = 3.5;

    for (let i = 0; i < objects.length; i++) {
        const wall = objects[i];
        const wallBoundingBox = new THREE.Box3().setFromObject(wall);
        const cameraBoundingBox = new THREE.Box3().setFromCenterAndSize(
            originPoint,
            new THREE.Vector3(collisionDistance, collisionDistance, collisionDistance)
        );

        if (wallBoundingBox.intersectsBox(cameraBoundingBox)) {
            return true;
        }
    }
    return false;
}


function animate() {
    requestAnimationFrame(animate);
    checkBounds();
    if (controls.isLocked === true) {
        const time = performance.now();
        const delta = (time - prevTime) / 1000;
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.normalize();
        velocity.z -= direction.z * 400.0 * delta;
        velocity.x -= direction.x * 400.0 * delta;
        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateZ(velocity.z * delta);
        if (checkCollision()) {
            controls.getObject().translateX(-velocity.x * delta);
            controls.getObject().translateZ(-velocity.z * delta);
            velocity.x = 0;
            velocity.z = 0;
        }
        controls.getObject().position.y = initialCameraY;
        velocity.x *= 0.9;
        velocity.z *= 0.9;

        prevTime = time;
    }
    renderer.render(scene, camera);
}

init();
animate();