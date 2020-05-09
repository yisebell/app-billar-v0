import * as THREE from 'three';

class Sphere {

    createSphere = (textureBall) => {
        let texture = new THREE.TextureLoader().load(textureBall);
        let geometry = new THREE.SphereGeometry(0.305,128,128);
        let material = new THREE.MeshPhongMaterial({
            map:texture,
            shininess:100
        })
        return new THREE.Mesh(geometry,material);
    }
}
 
export default new Sphere();