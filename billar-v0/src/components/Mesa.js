import * as THREE from 'three';

class Mesa {

    createBanda = (x) => {
        let cara, ancho = 0.5, neg=-1, alto = 0.37;
        let geometry = new THREE.Geometry();
        let material = new THREE.MeshBasicMaterial({
            color : 0x006bb3,
            side : THREE.DoubleSide,
            wireframe : false
        });

        geometry.vertices.push(new THREE.Vector3(x*neg,0,0));
        geometry.vertices.push(new THREE.Vector3(x*neg,alto,0));
        geometry.vertices.push(new THREE.Vector3(x*neg+ancho,alto,0));
        geometry.vertices.push(new THREE.Vector3(x*neg+ancho,alto,ancho));
        geometry.vertices.push(new THREE.Vector3(x,0,0));
        geometry.vertices.push(new THREE.Vector3(x,alto,0));
        geometry.vertices.push(new THREE.Vector3(x-ancho,alto,0));
        geometry.vertices.push(new THREE.Vector3(x-ancho,alto,ancho));

        // Arriba
        cara = new THREE.Face3(1,2,3);
        geometry.faces.push(cara);
        cara = new THREE.Face3(2,6,7);
        geometry.faces.push(cara);
        cara = new THREE.Face3(2,3,7);
        geometry.faces.push(cara);
        cara = new THREE.Face3(5,6,7);
        geometry.faces.push(cara);
        // Atras
        cara = new THREE.Face3(0,1,5);
        geometry.faces.push(cara);
        cara = new THREE.Face3(0,4,5);
        geometry.faces.push(cara);
        // Izquierda
        cara = new THREE.Face3(0,1,3);
        geometry.faces.push(cara);
        // Derecha
        cara = new THREE.Face3(4,5,7);
        geometry.faces.push(cara);
        // Frontal
        cara = new THREE.Face3(0,3,7);
        geometry.faces.push(cara);
        cara = new THREE.Face3(0,4,7);
        geometry.faces.push(cara);


        return new THREE.Mesh(geometry,material);
    }

    createMarco = (tipo) => {
        let ancho = 1, marcolargo = 31.4, marcoCorto = 17.2, alto = 0.37;
        let color = 0x000000;
        let geometry = new THREE.BoxGeometry(ancho, tipo === 'corto' ? marcoCorto : marcolargo, alto);
        let material = new THREE.MeshStandardMaterial({
            color : color
        });
        return new THREE.Mesh(geometry, material);
    }

    createMesa = () => {
        let ancho = 17.2, largo = 31.4, alto = 0.8;
        let color = 0x007acc;
        let geometry = new THREE.BoxGeometry(ancho, largo, alto, 4, 8);
        let material = new THREE.MeshStandardMaterial({
            color : color,
            wireframe : false
        });
        return new THREE.Mesh(geometry, material);
    }

}

export default new Mesa();