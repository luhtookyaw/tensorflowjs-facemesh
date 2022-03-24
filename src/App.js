import {useRef, useState} from 'react';
import "@tensorflow/tfjs-backend-webgl";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from 'react-webcam';
import { drawMesh } from './utils';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [openCam, setOpenCam] = useState(false);

  const runFacemesh = async() => {
    setOpenCam(!openCam);

    const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);

    setInterval(() => {
      detect(net);
    }, 1);
  }

  const detect = async(net) => {
    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await net.estimateFaces({
        input: video
      });

      console.log(face);

      const ctx = canvasRef.current.getContext("2d");

      requestAnimationFrame(()=>{
        drawMesh(face, ctx)
      });
    }
  }


  return (
    <div className="App">
      {openCam && <Webcam className={`cam ${openCam && 'cam-opened'}`} ref={webcamRef}/>}
      <canvas className={`cam ${openCam && 'cam-opened'}`} onClick={runFacemesh} ref={canvasRef}/>
    </div>
  );
}

export default App;
