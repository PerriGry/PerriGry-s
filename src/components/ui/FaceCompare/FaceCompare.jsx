"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function FaceCompare() {
  const videoRef = useRef(null);
  const faceapiRef = useRef(null);
  const router = useRouter();

  // Función para inicializar la cámara y los modelos
  const startCameraAndModels = async () => {
    // Importar face-api dinámicamente
    if (!faceapiRef.current) {
      const faceapi = await import("@vladmandic/face-api");
      faceapiRef.current = faceapi;

      // Registrar backends
      await import("@tensorflow/tfjs-backend-webgl");
      await import("@tensorflow/tfjs-backend-wasm");
      await import("@tensorflow/tfjs-backend-cpu");

      await faceapi.tf.setBackend("webgl");
      await faceapi.tf.ready();

      // Cargar modelos
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
    }

    // Activar cámara
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    videoRef.current.srcObject = stream;
    await videoRef.current.play();

    return stream; // devolver stream para poder detenerlo después
  };

  const compareFace = async (stored) => {
    const faceapi = faceapiRef.current;
    const video = videoRef.current;
    if (!faceapi) return alert("Face API no inicializada aún");
    if (!stored) return alert("No hay descriptor guardado. Primero guarda uno.");

    const det = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
    if (!det) return alert("No se detectó rostro para comparar");

    const labeled = new faceapi.LabeledFaceDescriptors("Coincidencia Exitosa", [new Float32Array(stored)]);
    const matcher = new faceapi.FaceMatcher([labeled], 0.35);
    const distance = matcher.findBestMatch(det.descriptor);

    alert("Resultado: " + distance.toString());

    return distance._distance <= 0.35;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let stream;

    try {
      // Iniciar cámara y modelos solo al momento de comparar
      stream = await startCameraAndModels();

      // Llamada a tu API para obtener descriptor almacenado
      const res = await fetch("/api/auth/faceReturn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al Iniciar Sesion");
        return;
      }

      const match = await compareFace(data.descriptor);

      if (match) {
        const resLogin = await fetch("/api/auth/login/loginFace", { method: "GET" });
        const dataLogin = await resLogin.json();

        if (dataLogin.rol === "Administrador") router.push("/admin_page");
        else router.push("/sale_register");
      } else {
        alert("Rostro invalido");
      }
    } catch (error) {
      alert("Ocurrió un error: " + error.message);
    } finally {
      // Detener la cámara inmediatamente
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <video
          ref={videoRef}
          autoPlay
          muted
          width="640"
          height="480"
          className="border rounded mb-4"
        />
        <div className="flex gap-3">
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
