import {useEffect, useRef, useState} from "react";
import {useFrame, useLoader} from "@react-three/fiber";
import {RepeatWrapping, TextureLoader} from "three";

const Objects = ({ audioSrc }) =>{
    // Create an AudioContext
    const keyboardRef = useRef(), meshrefBassBlock = useRef(), meshrefBassBlockTwo = useRef(),
        meshrefBassBlockThree = useRef(), meshrefzplus = useRef(), meshrefzminus = useRef(), meshrefxplus = useRef(),
        meshrefxminus = useRef(), meshrefyplus = useRef(),
        meshrefyminus = useRef(), [exploded, setExploded] = useState(false),
        audioContext = new (window.AudioContext || window.webkitAudioContext)(),
        analyser = audioContext.createAnalyser(),
        roughnessTexture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/Textures/Obsidian/Obsidianroughness.jpg`),
        normalTexture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/Textures/Obsidian/Obsidiannormal.jpg`),
        bumpTexture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/Textures/Obsidian/Obsidianheight.png`),
        AOTexture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/Textures/Obsidian/ObsidianambientOcclusion.jpg`);
        bumpTexture.wrapS = bumpTexture.wrapT = RepeatWrapping;

        const metalness = 1;
        const roughness = 4;
        const bumpScale = 5;
        const normalScale = 1;
    // Load audio file
    useEffect(() => {
            const audioElement = new Audio(audioSrc);
            const source = audioContext.createMediaElementSource(audioElement);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(function (stream) {
                        console.log("Audio access granted");
                        audioElement.play().then(r => console.log(r));
                    })
                    .catch(function (error) {
                        console.error("Error accessing Audio:", error);
                    });
            } else {
                console.error("getUserMedia not supported in this browser");
            }

            const handleEnded = () => {
                audioElement.currentTime = 0;
                audioElement.play().then(r => console.log(r));
            };

            audioElement.addEventListener('ended', handleEnded);

            return () => {
                audioElement.removeEventListener('ended', handleEnded);
            };

        },
        [audioSrc, audioContext, analyser]);

    useFrame(() => {
        function lerp(start, end, t) {
            return start * (1 - t) + end * t;
        }
        Math.easeOutCubic = function(t) {
            return 1 - Math.pow(1 - t, 3);
        };

        if (keyboardRef.current) {
            keyboardRef.current.rotation.x += 0.01;
            keyboardRef.current.rotation.y += 0.01;
        }

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const bassStartIndex = 0, bassEndIndex = 1500, interpolationFactor = 0.01,
            bassData = dataArray.slice(bassStartIndex, bassEndIndex),
            average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length,
            averageBass = bassData.reduce((acc, val) => acc + val, 0) / bassData.length,
            scaleFactor = (average / 255) * 5, bassScaleFactor = (averageBass / 150) * 5;


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
            const targetScale = 0.3 + bassScaleFactor * 2, targetScaleTwo = 0.5 + bassScaleFactor * 2,
                targetScaleThree = 0.4 + bassScaleFactor * 3, t = Math.easeOutCubic(0.1);

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


    return(
        <mesh ref={keyboardRef} position={[0, 0, -15]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                roughnessMap={roughnessTexture}
                roughness={roughness}
                metalness={metalness}
                bumpMap={bumpTexture}
                bumpScale={bumpScale}
                normalMap={normalTexture}
                normalScale={normalScale}
                aoMap={AOTexture}
            />

            <mesh ref={meshrefBassBlock} position={[0, 0, 0]}> {/* X-plus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={roughness}
                    metalness={metalness}
                    bumpMap={bumpTexture}
                    bumpScale={bumpScale}
                    normalMap={normalTexture}
                    normalScale={normalScale}
                    aoMap={AOTexture}
                    transparent = {true}
                    opacity ={0.2}
                />
            </mesh>

            <mesh ref={meshrefBassBlockTwo} position={[0, 0, 0]}> {/* X-plus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={roughness}
                    metalness={metalness}
                    bumpMap={bumpTexture}
                    bumpScale={bumpScale}
                    normalMap={normalTexture}
                    normalScale={normalScale}
                    aoMap={AOTexture}
                    transparent = {true}
                    opacity ={0.3}
                />
            </mesh>

            <mesh ref={meshrefBassBlockThree} position={[0, 0, 0]}> {/* X-plus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={roughness}
                    metalness={metalness}
                    bumpMap={bumpTexture}
                    bumpScale={bumpScale}
                    normalMap={normalTexture}
                    normalScale={normalScale}
                    aoMap={AOTexture}
                    transparent = {true}
                    opacity ={0.09}
                />
            </mesh>

            <mesh ref={meshrefxplus} position={[3, 0, 0]}> {/* X-plus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={roughness}
                    metalness={metalness}
                    bumpMap={bumpTexture}
                    bumpScale={bumpScale}
                    normalMap={normalTexture}
                    normalScale={normalScale}
                    aoMap={AOTexture}
                />
            </mesh>

            <mesh ref={meshrefxminus} position={[-3, 0, 0]}> {/* X-minus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={roughness}
                    metalness={metalness}
                    bumpMap={bumpTexture}
                    bumpScale={bumpScale}
                    normalMap={normalTexture}
                    normalScale={normalScale}
                    color = {'blue'}
                    aoMap={AOTexture}
                />
            </mesh>

            <mesh ref={meshrefyplus} position={[0, 3, 0]}> {/* Y-plus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={roughness}
                    metalness={metalness}
                    bumpMap={bumpTexture}
                    bumpScale={bumpScale}
                    normalMap={normalTexture}
                    color = {'red'}
                    normalScale={normalScale}
                    aoMap={AOTexture}
                />
            </mesh>

            <mesh ref={meshrefyminus} position={[0, -3, 0]}> {/* Y-minus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={roughness}
                    metalness={metalness}
                    bumpMap={bumpTexture}
                    color = {'gold'}
                    bumpScale={bumpScale}
                    normalMap={normalTexture}
                    normalScale={normalScale}
                    aoMap={AOTexture}
                />
            </mesh>

            <mesh ref={meshrefzminus} position={[0, 0, -3]}> {/* Z-minus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={roughness}
                    metalness={metalness}
                    bumpMap={bumpTexture}
                    color = {'green'}
                    bumpScale={bumpScale}
                    normalMap={normalTexture}
                    normalScale={normalScale}
                    aoMap={AOTexture}
                />
            </mesh>

            <mesh ref={meshrefzplus} position={[0, 0, 0]}> {/* Z-plus axis mesh block*/}
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    roughnessMap={roughnessTexture}
                    roughness={roughness}
                    metalness={metalness}
                    bumpMap={bumpTexture}
                    bumpScale={bumpScale}
                    color = {'cyan'}
                    normalMap={normalTexture}
                    normalScale={normalScale}
                    aoMap={AOTexture}
                />
            </mesh>

        </mesh>

    );
}
export default Objects;
