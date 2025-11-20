"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function FaceRegister() {
  const router = useRouter();
  const videoRef = useRef(null);
  const faceapiRef = useRef(null);
  const emailRef = useRef(null);
  const rolRef = useRef(null);
  const descriptorRef = useRef(null);

  // Función para iniciar cámara y modelos
  const startCameraAndModels = async () => {
    // Cargar face-api si no se ha cargado
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
    const video = videoRef.current;
    video.srcObject = stream;
    await video.play();

    return stream;
  };

  // Capturar descriptor facial
  const saveFaceDescriptor = async () => {
    let stream;
    try {
      stream = await startCameraAndModels();

      const faceapi = faceapiRef.current;
      const video = videoRef.current;

      const det = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
      if (!det) return alert("No se detectó rostro");

      descriptorRef.current = Array.from(det.descriptor);
      alert("Descriptor capturado correctamente");
    } catch (error) {
      alert("Error al capturar descriptor: " + error.message);
    } finally {
      // Detener cámara inmediatamente
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = (emailRef.current.value || "").trim();
      const rol = (rolRef.current.value || "").trim();

      if (!descriptorRef.current) return alert("Primero captura el descriptor facial");

      const res = await fetch("/api/auth/faceRegister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, rol, descriptor: descriptorRef.current }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Error al registrar usuario");

      alert("Usuario registrado correctamente");
      router.push("/admin_page");
    } catch (error) {
      alert("Ocurrió un error: " + error.message);
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center">

    <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10 border border-gray-200">

      <h2 className="text-3xl font-bold text-center mb-8 text-black">
        Registrar Usuario con Rostro
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* EMAIL */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Email:</label>
          <input
            type="text"
            ref={emailRef}
            placeholder="Email"
            className="w-full rounded-xl px-4 py-3 bg-gray-100 border text-black border-gray-300 focus:outline-none"
          />
        </div>

        {/* ROL */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Rol:</label>
          <input
            type="text"
            ref={rolRef}
            placeholder="Rol"
            className="w-full rounded-xl px-4 py-3 bg-gray-100 border text-black border-gray-300 focus:outline-none"
          />
        </div>

        {/* VIDEO */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Cámara:</label>
          <video
            ref={videoRef}
            autoPlay
            muted
            width="640"
            height="480"
            className="w-full rounded-xl bg-black border border-gray-300 shadow"
          />
        </div>

        {/* BOTÓN CAPTURAR */}
        <button
          type="button"
          onClick={saveFaceDescriptor}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
        >
          Capturar descriptor
        </button>

        {/* BOTÓN REGISTRAR */}
        <button
          type="submit"
          className="w-full py-3 bg-[#123C83] text-white font-semibold rounded-xl hover:bg-[#0F2F6A] transition"
        >
          Registrar Usuario
        </button>
      </form>
    </div>

  </div>
);


}
