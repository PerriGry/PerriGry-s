"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function FaceCompare(){
    const videoRef = useRef(null);
    const faceapiRef = useRef(null);
    const emailRef = useRef(null);
    const descriptorRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
            let rafId;

            const init = async () => {
            // importar solo en cliente
            const faceapi = await import("@vladmandic/face-api");
            faceapiRef.current = faceapi;

            // registrar backends
            await import("@tensorflow/tfjs-backend-webgl");
            await import("@tensorflow/tfjs-backend-wasm");
            await import("@tensorflow/tfjs-backend-cpu");

            // elegir backend y esperar readiness ANTES de cargar modelos
            await faceapi.tf.setBackend("webgl");
            await faceapi.tf.ready();

            // cámara
            const video = videoRef.current;
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            video.srcObject = stream;
            await video.play();

            // modelos (de /public/models)
            const MODEL_URL = "/models";
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            ]);

            // loop detección
            const onPlay = async () => {
                const f = faceapiRef.current;
                if (video.readyState >= 2) {
                await f.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
                }
                rafId = requestAnimationFrame(onPlay);
            };
            onPlay();
            };

            init().catch((e) => console.error("Init face recognition failed:", e));

            return () => {
            if (rafId) cancelAnimationFrame(rafId);
            const v = videoRef.current;
            v?.srcObject?.getTracks?.().forEach((t) => t.stop());
            };
    }, []);

    async function compareFace(stored) {
      const faceapi = faceapiRef.current;
      const video = videoRef.current;
      if (!faceapi) return alert("Face API no inicializada aún");
      if (!stored) return alert("No hay descriptor guardado. Primero guarda uno.");
      const det = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
      if (!det) return alert("No se detectó rostro para comparar");
      const labeled = new faceapi.LabeledFaceDescriptors("Coincidencia Exitosa: ", [new Float32Array(stored)]);
      const matcher = new faceapi.FaceMatcher([labeled], 0.35);
      let distance = matcher.findBestMatch(det.descriptor)
      alert("Resultado: " + matcher.findBestMatch(det.descriptor).toString());
      if(distance._distance <= 0.35) return true
    }

   const handleSubmit = async (e) =>{
        e.preventDefault();
        try {

            const res = await fetch("/api/auth/faceReturn", {
                method:"POST",
                headers: { "Content-Type": "application/json" },
            });
            
            const data = await res.json();
            

            if (!res.ok) {
                alert(data.message || "Error al Iniciar Sesion");
                return;
            }

            let match = await compareFace(data.descriptor)

            if(match === true) {
              try {
                const res = await fetch("/api/auth/login/loginFace", {
                  method:'GET'
                })

                const data = await res.json();

                console.log(data)

                // Redirección por rol
                if (data.rol === "Administrador") {
                  router.push("/admin_page");
                } else {
                  router.push("/sale_register");
                } 
                
              } catch (error) {
                alert("Ocurrió un error: " + error.message);
              }
            }

            if(match != true) alert("Rostro invalido")
              
        } catch (error) {
            alert("Ocurrió un error: " + error.message);
        }

    }

return (
  <div>
    <form onSubmit={handleSubmit}>

      <video 
        ref={videoRef} 
        id="inputVideo" 
        autoPlay 
        muted 
        width="640" 
        height="480" 
        className="border rounded mb-4"
      />

      <div className="flex gap-3">
        {/* Botón para iniciar comparación (form submit) */}
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          🔍 Comparar rostro
        </button>
      </div>
    </form>
  </div>
);


}