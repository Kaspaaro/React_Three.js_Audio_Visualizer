import {useEffect, useRef, useState} from "react";
import {useFrame, useLoader} from "@react-three/fiber";
import {RepeatWrapping, TextureLoader} from "three";

const Objects = ({ audioSrc }) =>{
    const keyboardRef = useRef();
    const meshrefBassBlock = useRef();
    const meshrefBassBlockTwo = useRef();
    const meshrefBassBlockThree = useRef();
    const meshrefzplus = useRef();
    const meshrefzminus = useRef();
    const meshrefxplus = useRef();
    const meshrefxminus = useRef();
    const meshrefyplus = useRef();
    const meshrefyminus = useRef();
    const [exploded, setExploded] = useState(false);

    // Create an AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    const roughnessTexture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/Textures/Obsidian/Obsidianroughness.jpg`);
    const normalTexture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/Textures/Obsidian/Obsidiannormal.jpg`);
    const bumpTexture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/Textures/Obsidian/Obsidianheight.png`);
    const AOTexture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/Textures/Obsidian/ObsidianambientOcclusion.jpg`);
    bumpTexture.wrapS = bumpTexture.wrapT = RepeatWrapping;

    // Load audio file
    useEffect(() => {
        const audioElement = new Audio(audioSrc);
        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        audioElement.play();

        const handleEnded = () => {
            audioElement.currentTime = 0;
            audioElement.play();
        };

        audioElement.addEventListener('ended', handleEnded);

        return () => {
            audioElement.removeEventListener('ended', handleEnded);
        };

    }, [audioSrc, audioContext, analyser]);

    useFrame(() => {
        function lerp(start, end, t) {
            return start * (1 - t) + end * t;
        }
        Math.easeOutCubic = function(t) {
            return 1 - Math.pow(1 - t, 3);
        };

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const bassStartIndex = 0;
        const bassEndIndex = 1500;
        const interpolationFactor = 0.01;
        const bassData = dataArray.slice(bassStartIndex, bassEndIndex);

        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        const averageBass = bassData.reduce((acc, val) => acc + val, 0) / bassData.length;

        const scaleFactor = (average / 255) * 5;
        const bassScaleFactor = (averageBass / 150) * 5;

        keyboardRef.current.scale.y = 1 + scaleFactor;
        keyboardRef.current.scale.x = 1 + scaleFactor;
        keyboardRef.current.scale.z = 1 + scaleFactor;

        const color = `rgb(${scaleFactor}, ${5 * (1 - scaleFactor)}, ${7 * (1 - scaleFactor)})`;
        keyboardRef.current.material.color.set(color);
        meshrefzminus.current.position.z = -0.3 - scaleFactor
        meshrefzplus.current.position.z = 0.3 + scaleFactor
        meshrefxminus.current.position.x = -0.3 - scaleFactor
        meshrefxplus.current.position.x = 0.3 + scaleFactor
        meshrefyminus.current.position.y = -0.3 - scaleFactor
        meshrefyplus.current.position.y = 0.3 + scaleFactor

        //BassSection
        if (bassScaleFactor > 1.6234){
            const targetScale = 0.3 + bassScaleFactor * 2;
            const targetScaleTwo = 0.5 + bassScaleFactor * 2 ;
            const targetScaleThree = 0.4 + bassScaleFactor * 3;

            const t = Math.easeOutCubic(0.1);
            meshrefBassBlock.current.scale.y = lerp(meshrefBassBlock.current.scale.y, targetScale, t)
            meshrefBassBlock.current.scale.x = lerp(meshrefBassBlock.current.scale.y, targetScale, t)
            meshrefBassBlock.current.scale.z = lerp(meshrefBassBlock.current.scale.y, targetScale, t)

            meshrefBassBlockTwo.current.scale.y = lerp(meshrefBassBlockTwo.current.scale.y, targetScaleTwo, t)
            meshrefBassBlockTwo.current.scale.x = lerp(meshrefBassBlockTwo.current.scale.y, targetScaleTwo, t)
            meshrefBassBlockTwo.current.scale.z = lerp(meshrefBassBlockTwo.current.scale.y, targetScaleTwo, t)

            meshrefBassBlockThree.current.scale.y = lerp(meshrefBassBlockThree.current.scale.y, targetScaleThree, t)
            meshrefBassBlockThree.current.scale.x = lerp(meshrefBassBlockThree.current.scale.y, targetScaleThree, t)
            meshrefBassBlockThree.current.scale.z = lerp(meshrefBassBlockThree.current.scale.y, targetScaleThree, t)
        }else{
            meshrefBassBlock.current.scale.y = lerp(meshrefBassBlock.current.scale.y, 0, interpolationFactor)
            meshrefBassBlock.current.scale.x = lerp(meshrefBassBlock.current.scale.y, 0, interpolationFactor)
            meshrefBassBlock.current.scale.z = lerp(meshrefBassBlock.current.scale.y, 0, interpolationFactor)

            meshrefBassBlockTwo.current.scale.y = lerp(meshrefBassBlockTwo.current.scale.y, 0, interpolationFactor)
            meshrefBassBlockTwo.current.scale.x = lerp(meshrefBassBlockTwo.current.scale.y, 0, interpolationFactor)
            meshrefBassBlockTwo.current.scale.z = lerp(meshrefBassBlockTwo.current.scale.y, 0, interpolationFactor)

            meshrefBassBlockThree.current.scale.y = lerp(meshrefBassBlockThree.current.scale.y, 0, interpolationFactor)
            meshrefBassBlockThree.current.scale.x = lerp(meshrefBassBlockThree.current.scale.y, 0, interpolationFactor)
            meshrefBassBlockThree.current.scale.z = lerp(meshrefBassBlockThree.current.scale.y, 0, interpolationFactor)
        }

        console.log(bassScaleFactor)
    });
    const handleClick = () => {
        setExploded(!exploded);

        setTimeout(() => {
            setExploded(false);
        }, 6000);

    };



    useFrame(() => {
        if (keyboardRef.current) {
            keyboardRef.current.rotation.x += 0.01;
            keyboardRef.current.rotation.y += 0.01;
        }
    });


    useFrame(() => {
        if (exploded) {
            keyboardRef.current.scale.multiplyScalar(0.98);
            keyboardRef.current.rotation.x += 0.005;
            keyboardRef.current.rotation.y += 0.005;

        } else if (keyboardRef.current.scale.x !== 1 && keyboardRef.current.scale.y !== 1 && keyboardRef.current.scale.z !== 1 ){
            keyboardRef.current.scale.x += (0.5 + keyboardRef.current.scale.x) * 0.005;
            keyboardRef.current.scale.y += (0.5 + keyboardRef.current.scale.y) * 0.005;
            keyboardRef.current.scale.z += (0.5 + keyboardRef.current.scale.z) * 0.005;
        }
    });

    useEffect(() => {
        if (!exploded) {
            const scaleBackInterval = setInterval(() => {
                keyboardRef.current.scale.x += (1 - keyboardRef.current.scale.x) * 0.005;
                keyboardRef.current.scale.y += (1 - keyboardRef.current.scale.y) * 0.005;
                keyboardRef.current.scale.z += (1 - keyboardRef.current.scale.z) * 0.005;

                if (
                    Math.abs(keyboardRef.current.scale.x - 1) < 0.01 &&
                    Math.abs(keyboardRef.current.scale.y - 1) < 0.01 &&
                    Math.abs(keyboardRef.current.scale.z - 1) < 0.01
                ) {
                    keyboardRef.current.scale.set(1, 1, 1);
                    clearInterval(scaleBackInterval);
                }
            }, 1000 / 60);

            return () => {
                clearInterval(scaleBackInterval);
            };
        }
    }, [exploded]);


    return(
        <mesh ref={keyboardRef} position={[0, 0, -15]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                roughnessMap={roughnessTexture}
                roughness={7}
                metalness={1}
                bumpMap={bumpTexture}
                bumpScale={10}
                normalMap={normalTexture}
                normalScale={2}
                aoMap={AOTexture}
            />

            <mesh ref={meshrefBassBlock} position={[0, 0, 0]}> {/* X-plus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={0.5}
                    metalness={1}
                    bumpMap={bumpTexture}
                    bumpScale={10}
                    normalMap={normalTexture}
                    normalScale={2}
                    aoMap={AOTexture}
                    transparent = {true}
                    opacity ={0.2}
                />
            </mesh>

            <mesh ref={meshrefBassBlockTwo} position={[0, 0, 0]}> {/* X-plus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={0.5}
                    metalness={1}
                    bumpMap={bumpTexture}
                    bumpScale={10}
                    normalMap={normalTexture}
                    normalScale={2}
                    aoMap={AOTexture}
                    transparent = {true}
                    opacity ={0.3}
                />
            </mesh>

            <mesh ref={meshrefBassBlockThree} position={[0, 0, 0]}> {/* X-plus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={0.5}
                    metalness={1}
                    bumpMap={bumpTexture}
                    bumpScale={10}
                    normalMap={normalTexture}
                    normalScale={2}
                    aoMap={AOTexture}
                    transparent = {true}
                    opacity ={0.09}
                />
            </mesh>

            <mesh ref={meshrefxplus} position={[3, 0, 0]}> {/* X-plus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={0.5}
                    metalness={1}
                    bumpMap={bumpTexture}
                    bumpScale={10}
                    normalMap={normalTexture}
                    normalScale={2}
                    aoMap={AOTexture}
                />
            </mesh>

            <mesh ref={meshrefxminus} position={[-3, 0, 0]}> {/* X-minus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={0.5}
                    metalness={1}
                    bumpMap={bumpTexture}
                    bumpScale={10}
                    normalMap={normalTexture}
                    normalScale={2}
                    aoMap={AOTexture}
                />
            </mesh>

            <mesh ref={meshrefyplus} position={[0, 3, 0]}> {/* Y-plus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={0.5}
                    metalness={1}
                    bumpMap={bumpTexture}
                    bumpScale={10}
                    normalMap={normalTexture}
                    normalScale={2}
                    aoMap={AOTexture}
                />
            </mesh>

            <mesh ref={meshrefyminus} position={[0, -3, 0]}> {/* Y-minus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={0.5}
                    metalness={1}
                    bumpMap={bumpTexture}
                    bumpScale={10}
                    normalMap={normalTexture}
                    normalScale={2}
                    aoMap={AOTexture}
                />
            </mesh>

            <mesh ref={meshrefzminus} position={[0, 0, -3]}> {/* Z-minus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={0.5}
                    metalness={1}
                    bumpMap={bumpTexture}
                    bumpScale={10}
                    normalMap={normalTexture}
                    normalScale={2}
                    aoMap={AOTexture}
                />
            </mesh>

            <mesh ref={meshrefzplus} position={[0, 0, 0]}> {/* Z-plus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={0.5}
                    metalness={1}
                    bumpMap={bumpTexture}
                    bumpScale={10}
                    normalMap={normalTexture}
                    normalScale={2}
                    aoMap={AOTexture}
                />
            </mesh>

        </mesh>

    );
}
export default Objects;
