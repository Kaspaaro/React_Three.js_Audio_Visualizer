import {Canvas} from "@react-three/fiber";
import {Bloom, EffectComposer, HueSaturation, SSAO} from "@react-three/postprocessing";
import Objects from "./Objects";
import React from "react";
import '../App.css';

const Engine = () =>{
    // Create an AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    const audioSrc = process.env.PUBLIC_URL + '/song.mp3';

    const getRandomColor = () => {
        return Math.random() * 0xffffff;
    };

    const getRandomPosition = () => {
        const range = 20;
        return Math.random() * range - range / 2;
    };

    const directionalLights = Array.from({ length: 20 }, (_, index) => (
        <group>

            <directionalLight
                key={index}
                position={[getRandomPosition(), getRandomPosition(), getRandomPosition()]}
                color={getRandomColor()}
                intensity={100}
            />
        </group>
    ));

return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <div id={'programCreds'}> <p>Audio Visualizer by Kaspar Tullus (Github: Kaspaaro)</p></div>
            <div id={'audioCreds'}> <p>Audio by Kaspar Tullus (Github: Kaspaaro)</p></div>
            <Canvas style={{ background: '#000000' , width: '100%', height: '100vh' }} >
                <ambientLight intensity={100} color={'0x404040'}  />
                {directionalLights}
                <Objects audioSrc={audioSrc} audioContext={audioContext} analyser={analyser} type="audio/mp3" />

                <EffectComposer>
                    <SSAO samples={20} radius={20} intensity={40} luminanceInfluence={0.1} />
                    <Bloom luminanceThreshold={1}
                           luminanceSmoothing={0.1}
                           intensity={0.2}
                           kernelSize={0} />
                    <HueSaturation
                        blendFunction={1}
                        hue={0}
                        saturation={0.016}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
}

export default Engine;
