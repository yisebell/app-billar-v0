import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import Sphere from './Sphere';
import TextureWhiteBall from '../textures/textureWhiteBall.png';
import TextureBlackBall from '../textures/textureBlackBall.png';
import TextureRedBall from '../textures/textureRedBall.png';
import Mesa from './Mesa';

const Billar = () => {

    const mount = useRef(null);
    let scene, camera, renderer, controls, redBall, whiteBall, blackBall, mesa, light, t, plane, axisW, arrowHelper; 
    let bandaAnteriorW='salida',bandaAnteriorB='salida',bandaAnteriorR='salida';
    let ADD = 0.3, MAX_SPIN=0.6;   
    let marcoA, marcoB, marcoC, marcoD;
    let bandaA, bandaB, bandaC, bandaD;
    let lights = [];
    let minSpeed=0.1,maxSpeed=0.15;
    const FOV=75,WIW=window.innerWidth,WIH=window.innerHeight,NEAR=1,FAR=1000;
    let limiteSuperior=13.903, limiteInferior=limiteSuperior*-1, limiteDerecho=6.803, limiteIzquierdo=limiteDerecho*-1;
    
    let randomInRange = (from,to) => {
        let x = Math.random()*(from-to);
        return x+from;
    }

    let wb_deltaX=randomInRange(minSpeed,maxSpeed), wb_deltaY=randomInRange(minSpeed,maxSpeed), wb_SPIN=0.1;
    let yb_deltaX=randomInRange(minSpeed,maxSpeed), yb_deltaY=randomInRange(minSpeed,maxSpeed), yb_SPIN=0.1;
    let rb_deltaX=randomInRange(minSpeed,maxSpeed), rb_deltaY=randomInRange(minSpeed,maxSpeed), rb_SPIN=0.1;

    let colors = {
        blanco : 0xffffff,
        negro : 0x000000,
        verde : 0x00FF00,
        fondo : 0xd6dbd6
    }

    let crearCamara = () => {
        camera = new THREE.PerspectiveCamera(FOV,WIW/WIH,NEAR,FAR);
        camera.position.set(0,0,20);
        scene.add(camera);
    }

    let crearBolas = () => {
        whiteBall = Sphere.createSphere(TextureWhiteBall);
        blackBall = Sphere.createSphere(TextureBlackBall);
        redBall = Sphere.createSphere(TextureRedBall);

        whiteBall.position.x = -2.5;
        redBall.position.x = 2.5;
        // redBall.rotation.x = Math.PI / 4;
        //whiteBall.rotation.z = Math.PI / 2;

        whiteBall.castShadow = true;
        blackBall.castShadow = true;
        redBall.castShadow = true;

        scene.add(whiteBall);
        scene.add(blackBall);
        scene.add(redBall);
    }

    let crearMesa = () => {
        mesa = Mesa.createMesa();
        mesa.position.z = -0.7;
        mesa.castShadow = true;
        mesa.receiveShadow = true;
        scene.add(mesa);
    }

    let crearMarco = () => {
        let posicionX = 8.1, posicionY = 15.2, posicionZ = 0.11;
        marcoA = Mesa.createMarco('corto');
        marcoB = Mesa.createMarco('corto');
        marcoC = Mesa.createMarco('largo');
        marcoD = Mesa.createMarco('largo');

        marcoA.rotation.z = Math.PI/2;
        marcoB.rotation.z = Math.PI/2;
        marcoA.position.y = posicionY;
        marcoB.position.y = -posicionY;
        marcoC.position.x = posicionX;
        marcoD.position.x = -posicionX;

        marcoA.position.z = -posicionZ;
        marcoB.position.z = -posicionZ;
        marcoC.position.z = -posicionZ;
        marcoD.position.z = -posicionZ;

        marcoA.castShadow = true;
        marcoB.castShadow = true;
        marcoC.castShadow = true;
        marcoD.castShadow = true;

        scene.add(marcoA);
        scene.add(marcoB);
        scene.add(marcoC);
        scene.add(marcoD);
    }

    let crearBandas = () => {
        let ancho = 7.6, alto = 14.7, posicionZ = 0.27;
        bandaA = Mesa.createBanda(ancho);
        bandaB = Mesa.createBanda(ancho);
        bandaC = Mesa.createBanda(alto);
        bandaD = Mesa.createBanda(alto);
        bandaA.rotation.x = Math.PI/2;
        bandaB.rotation.x = Math.PI/2;
        bandaC.rotation.x = Math.PI/2;
        bandaD.rotation.x = Math.PI/2;
        bandaB.rotation.y = Math.PI;
        bandaC.rotation.y = Math.PI/2;
        bandaD.rotation.y = -Math.PI/2;
        bandaA.position.z = -posicionZ;
        bandaB.position.z = -posicionZ;
        bandaC.position.z = -posicionZ;
        bandaD.position.z = -posicionZ;
        bandaA.position.y = alto;
        bandaB.position.y = -alto;
        bandaC.position.x = -ancho;
        bandaD.position.x = ancho;
        scene.add(bandaA);
        scene.add(bandaB);
        scene.add(bandaC);
        scene.add(bandaD);
    }

    let crearLuces = () => {        
        createLight([-7,14,10]); 
        createLight([-7,-14,10]);
        createLight([7,14,10]);
        createLight([7,-14,10]);
        createLight([7,0,10]);
        createLight([-7,0,10]);
        createLight([0,0,0]);
        lights.forEach(luz => {
            luz.shadow.mapSize.width = 512;
            luz.shadow.mapSize.height = 512;
            luz.shadow.camera.near = 0.5;
            light.shadow.camera.far = 500; 
        });
    }

    let createLight = (posicion) => {
        let x = posicion[0];
        let y = posicion[1];
        light = new THREE.SpotLight(colors.blanco,0.5);
        light.position.set(...posicion);
        light.penumbra = 0.1;
        light.decay = 5;
        light.distance = 200;
        t = new THREE.Object3D();
        t.position.set(x,y,0);
        scene.add(t);
        light.target = t;
        light.castShadow = true;
        scene.add(light);
        lights.push(light);
    }

    let createPlane = () => {
        let geometry = new THREE.PlaneGeometry(100,100,10,10);
        let material = new THREE.MeshLambertMaterial({
            color: 0x00ff00,
            wireframe: false
        });
        plane = new THREE.Mesh(geometry,material);
        plane.position.z = -8;
        plane.receiveShadow = true;
        scene.add(plane);
    }

    let init = () => {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(colors.fondo);

        let ambient = new THREE.AmbientLight(0x006699);
        scene.add(ambient);

        crearCamara();
        crearLuces();
        crearMesa();
        crearMarco();
        crearBandas();
        //createPlane();
        crearBolas();

        axisW = new THREE.Vector3(-1,1,0).normalize();
        //axisW.rotation.x = Math.PI/4;
        var origin = new THREE.Vector3( 0, 0, 0 );
        var length = 2;
        var hex = 0xffff00;
        arrowHelper = new THREE.ArrowHelper( axisW, origin, length, hex );
        scene.add( arrowHelper );
        
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(WIW,WIH);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        controls = new OrbitControls(camera,renderer.domElement);
        controls.update();
        mount.current.appendChild(renderer.domElement)
    }

    let validarContactobandas = () => {
        if(whiteBall.position.y <= limiteInferior) {
            console.log('whiteBall: ',bandaAnteriorW);
            bandaAnteriorW = 'abajo';
            wb_deltaY *= -1;
            wb_SPIN *= -1;
            axisW.set(-1*axisW.x,axisW.y,0).normalize();
        }
        if(whiteBall.position.y >= limiteSuperior) {
            console.log('whiteBall: ',bandaAnteriorW);
            bandaAnteriorW = 'arriba';
            wb_deltaY *= -1;
            wb_SPIN *= -1;
            axisW.set(axisW.x,axisW.y*-1,0).normalize();
        }
        if(whiteBall.position.x <= limiteIzquierdo) {
            console.log('whiteBall: ',bandaAnteriorW);
            bandaAnteriorW = 'izquierda';
            wb_deltaX *= -1;
            axisW.set(axisW.x,axisW.y,0).normalize();
        }
        if(whiteBall.position.x >= limiteDerecho) {
            console.log('whiteBall: ',bandaAnteriorW);
            bandaAnteriorW = 'derecha';
            wb_deltaX *= -1;
            axisW.set(-1*axisW.x,-1*axisW.y,0).normalize();
        } 
        if(blackBall.position.y <= limiteInferior || blackBall.position.y >= limiteSuperior) {
            yb_deltaY *= -1;
            yb_SPIN *= -1;
        }
        if(blackBall.position.x <= limiteIzquierdo || blackBall.position.x >= limiteDerecho) {
            yb_deltaX *= -1;
        }
        if(redBall.position.y <= limiteInferior || redBall.position.y >= limiteSuperior) {
            rb_deltaY *= -1;
            rb_SPIN *= -1;
        }
        if(redBall.position.x <= limiteIzquierdo || redBall.position.x >= limiteDerecho) {
            rb_deltaX *= -1;
        }       
        // if(whiteBall.position.y >= limiteSuperior) {
        //     axisW.set(0,1,0).normalize();
        //     whiteBall.rotation.x = Math.PI / 4;
        //     console.log(whiteBall.position)
        // }
        // if(whiteBall.position.y <= limiteInferior) {
        //     console.log(whiteBall.position)
        //     //axisW.set(0,0,0).normalize();
        //     //whiteBall.rotation.x = Math.PI / 2;
        // }
        // if(whiteBall.position.x >= limiteDerecho) {
        //     console.log(whiteBall.position)
        //     axisW.set(-1,0,0).normalize();
        //     whiteBall.rotation.x = Math.PI / 2;
        // }
        // if(whiteBall.position.x <= limiteIzquierdo) {
        //     console.log(whiteBall.position)
        //     axisW.set(-1,0,0).normalize();
        //     whiteBall.rotation.x = Math.PI / 2;
        // } 
    }

    let calcularDistancia = (x0,y0,x1,y1) => {
        return Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
    }

    let validarColisionBolas = () => {
        let wbx=whiteBall.position.x,wby=whiteBall.position.y;
        let bbx=blackBall.position.x,bby=blackBall.position.y;
        let rbx=redBall.position.x,rby=redBall.position.y;
        if(calcularDistancia(wbx,wby,bbx,bby) <= 0.61){
            wb_deltaY *= -1;
            wb_deltaX *= -1;
            yb_deltaY *= -1;
            yb_deltaX *= -1;
            console.log('colision blanca-negra')
        }
        if(calcularDistancia(wbx,wby,rbx,rby) <= 0.61){
            wb_deltaY *= -1;
            wb_deltaX *= -1;
            rb_deltaY *= -1;
            rb_deltaX *= -1;
            console.log('colision blanca-roja')
        }
        if(calcularDistancia(bbx,bby,rbx,rby) <= 0.61){
            yb_deltaY *= -1;
            yb_deltaX *= -1;
            rb_deltaY *= -1;
            rb_deltaX *= -1;
            console.log('colision negra-roja')
        }
    }

    let mainloop = () => {

        // whiteBall.rotation.x -= wb_SPIN;
        // whiteBall.rotation.z += wb_SPIN;
        whiteBall.rotateOnAxis(axisW,wb_SPIN);
        // blackBall.rotation.x -= ADD;
        // redBall.rotation.x -= ADD;

        whiteBall.position.y += wb_deltaY;
        whiteBall.position.x += wb_deltaX;
        blackBall.position.y += yb_deltaY;
        blackBall.position.x += yb_deltaX;
        redBall.position.y += rb_deltaY;
        redBall.position.x += rb_deltaX;
        // blackBall.position.y += ADD;
        // redBall.position.y += ADD;

        validarContactobandas();
        validarColisionBolas();

        window.addEventListener('resize', () => {
            renderer.setSize(WIW,WIH);
            camera.aspect = WIW/WIH;
            camera.updateProjectionMatrix();
        })

        controls.update();

        renderer.render(scene,camera);
        requestAnimationFrame(mainloop);
    }

    useEffect(() => {
        init();
        mainloop();
    })

    return ( 
        <div ref={mount}></div>
     );
}
 
export default Billar;