"use client";
import { useEffect, useRef } from "react";

export default function FaceRegister() {
  const videoRef = useRef(null);
  const faceapiRef = useRef(null);
  const emailRef = useRef(null);
  const rolRef = useRef(null);
  const descriptorRef = useRef(null);

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

    async function saveFaceDescriptor() {
        const faceapi = faceapiRef.current;
        const video = videoRef.current;
        if (!faceapi) return alert("Face API no inicializada aún");
        const det = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
        if (!det) return alert("No se detectó rostro");
        return descriptorRef.current = Array.from(det.descriptor);
    }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
        const email = (emailRef.current.value || "").trim().toLowerCase();
        const rol = (rolRef.current.value || "").trim();

        const res = await fetch("/api/auth/faceRegister", {
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, rol, descriptor: descriptorRef.current }),
        });

        const data = await res.json();
        if (!res.ok) {
            alert(data.message || "Error al registrar usuario");
            return;
        }

        alert("Usuario registrado correctamente");
    } catch (error) {
        alert("Ocurrió un error: " + error.message);
    }
        
  }

  return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" ref={emailRef} placeholder="Email" />
                <input type="text" ref={rolRef} placeholder="Rol" />

                <video ref={videoRef} id="inputVideo" autoPlay muted width="640" height="480" />

                <button type="button" onClick={saveFaceDescriptor} 
                    className="px-4 py-2 bg-green-500 text-white rounded-lg">
                    💾 Capturar descriptor
                </button>

                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                    📤 Registrar Usuario
                </button>
            </form>
        </div>
    )

}

