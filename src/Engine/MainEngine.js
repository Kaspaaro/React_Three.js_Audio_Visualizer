import {Canvas} from "@react-three/fiber";
import {Bloom, EffectComposer, HueSaturation, SSAO} from "@react-three/postprocessing";
import Objects from "./Objects";
import React, {useEffect, useState} from "react";
import '../App.css';

const Engine = () =>{

    const getRandomColor = () => {
        return Math.random() * 0xffffff;
    };

    const getRandomPosition = () => {
        const range = 20;
        return Math.random() * range - range / 2;
    };

    const directionalLights = Array.from({ length: 15 }, (_, index) => (
        <directionalLight
            key={index}
            position={[getRandomPosition(), getRandomPosition(), getRandomPosition()]}
            color={getRandomColor()}
            intensity={100}
        />
    ));
    const audioSrc = process.env.PUBLIC_URL + '/song.mp3';

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();

        if (userAgent.includes('chrome') || userAgent.includes('firefox')) {
            setShowModal(true);
        }
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
    };

return (
    <div>
    <div className={"instructions"}>
        {showModal && (
            <div className="autoplay-instructions-modal">
                <h1>PLEASE READ</h1>
                <p className={"instruction-text"}>
                    Autoplay is required for the best experience and for the website to function.
                    enable autoplay in your browser settings.<br/>
                    You can also press the premission button next to the url bar, to give the website premission to use audio.<br/>
                    after that refresh the page.
                </p>
                <button className={"closeButton"} onClick={handleCloseModal}>Close</button>
            </div>
        )}
    </div>

        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <div id={'programCreds'}> <p>Audio Visualizer by Kaspar Tullus (Github: Kaspaaro)</p></div>
            <div id={'audioCreds'}> <p>Audio by Kaspar Tullus (Github: Kaspaaro)</p></div>
            <Canvas style={{ background: '#000000' , width: '100%', height: '100vh' }} >
                <ambientLight intensity={100}  />
                <Objects audioSrc={audioSrc} type="audio/mp3" />
                {directionalLights}
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
    </div>
    );
}

export default Engine;
