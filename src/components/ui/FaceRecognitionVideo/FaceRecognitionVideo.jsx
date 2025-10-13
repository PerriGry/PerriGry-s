// "use client";

// import { useEffect } from "react";
// import * as faceapi from "@vladmandic/face-api";

// export default function FaceRecognitionVideo() {
//   useEffect(() => {
//     const init = async () => {
//       const video = document.getElementById("inputVideo");

//       //Pedir acceso a la cámara
//       const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
//       video.srcObject = stream;

//       //Ruta para acceder a los modelos
//       //Directorio models ubicado dentro de /public
//       const MODEL_URL = "/models";

//       //Cargar modelos De Reconocmiento
//       await Promise.all([
//         //Modelo de Deteccion de Rostros
//         faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
//         //Modelo de Deteccion de Puntos de Referencia de Rostros
//         //Ubicar (Nariz, Ojos, Boca)
//         faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//         //Modelo Generador de Vectores del Rostro
//         //Poder Comparar y Reconocer Distintos Rostros
//         faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
//       ]);

//       video.addEventListener("play", onPlay);
//     };

//     //Funcion Inicializadora
//     //Encargada de Iniciar los procesos Cuando los modelos y el video están Preparados
//     init();

//     // Detección continua en video
//     async function onPlay() {
//       const video = document.getElementById("inputVideo");

//       //Obtencion de Datos en Array fullFaceDescriptions
//       const fullFaceDescriptions = await faceapi
//         //Deteccion de Todas las Caras del Video
//         .detectAllFaces(video)
//         //Obtencion de Puntos De Referencia del Rostro
//         .withFaceLandmarks()
//         //Obtencion de Vector del Rostro
//         .withFaceDescriptors();

//       //Volver a Llamar la Funcion onPlay por Frame
//       requestAnimationFrame(onPlay);
//     }
//   }, []);

//   //Guardar descriptor en localStorage
//   async function saveFaceDescriptor() {
//     const video = document.getElementById("inputVideo");

//     //Obtener Datos en array 'detection'
//     const detection = await faceapi
//       //Reconocer un Solo Rostro de Video
//       .detectSingleFace(video)
//       //Obtener Puntos de Referencia del Rostro
//       .withFaceLandmarks()
//       //Obtener Vector del Rostro
//       //El vector es de 128 numeros, es un tipo Float32Array(128)
//       .withFaceDescriptor();

//     //Validar si se ha guardado un rostro en 'detection'
//     if (!detection) {
//       alert("No se detectó rostro");
//       return;
//     }
//     //Extraer los Datos Necesarios, los datos que vienen de: .withFaceDescriptor();
//     const descriptor = detection.descriptor;
//     //Convertir los Datos a Formato Array Simple
//     const jsonDescriptor = Array.from(descriptor);

//     console.log(jsonDescriptor)
//     //Guardar en Localstorage
//     //JSON.stringify(jsonDescriptor) -> Convertirlo a Formato JSON
//     localStorage.setItem("miRostro", JSON.stringify(jsonDescriptor));
//     alert("✅ Descriptor guardado correctamente");
//   }

//   //Comparar rostro en vivo con el guardado
//   async function compareFace() {
//     const video = document.getElementById("inputVideo");
//     //Obtener los datos del LocalStorage
//     const storedDescriptor = JSON.parse(localStorage.getItem("miRostro"));
//     //Validar Si hay Datos en Localstorage
//     if (!storedDescriptor) {
//       alert("No hay descriptor guardado. Primero guarda uno.");
//       return;
//     }
//     //Objetivo -> Capturar Rostro, para luego ser comparado
//     //Obtener datos en array 'detection'
//     const detection = await faceapi
//       //Ubicar un Solo Rostro del Video
//       .detectSingleFace(video)
//       //Obtener Puntos de Referencia del Rostro
//       .withFaceLandmarks()
//       //Obtener Vectores del Rostro
//       .withFaceDescriptor();
//     //Validar Si hay datos en 'detection'
//     if (!detection) {
//       alert("No se detectó rostro para comparar");
//       return;
//     }
//     //Extraer los vectores del Rostro a 'queryDescriptor'
//     const queryDescriptor = detection.descriptor;

//     //LabeledFaceDescriptors() -> Crear Representacion de un Rostro Existente
//     /*
//     Sintaxis:
//     LabeledFaceDescriptors(
//     'label', -> Nombre del User
//     descriptror -> Vectores en formato Float32Array(128)
//     )
//     */
//     //Debemos hacer conversion del Array De Localstorage a formato Float32Array(128)
//     // Sintaxis -> new Float32Array(storedDescriptor)
//     const labeledDescriptor = new faceapi.LabeledFaceDescriptors("UserStoraged", [
//       new Float32Array(storedDescriptor),
//     ]);

//     /*
//     FaceMatcher() -> Recibir Rostros Conocidos para Luego ser Comparados
//     Sintaxis:
//     FaceMatcher(
//     [Vectores], -> Un array porque se puede agregar varios Rostros (En nuestro caso solo Uno)
//     0.6 -> Umbral de Reconocimiento (Menor sea el umbral, va a ser mas estricto)
//     )
//     */
//     const faceMatcher = new faceapi.FaceMatcher([labeledDescriptor], 0.35);
//     /*
//     Objetivo:
//         - Comparar Rostro 'queryDescriptor' con el Rostro Almacenado en 'faceMatcher'
//     */
//     const bestMatch = faceMatcher.findBestMatch(queryDescriptor);
//     //Mostrar Resultado en Formato Texto
//     alert("Resultado: " + bestMatch.toString());
//   }

//   return (
//     <div className="flex flex-col items-center gap-4">
//       <div className="relative">
//         <video id="inputVideo" autoPlay muted width="640" height="480" />
//       </div>

//       <div className="flex gap-3">
//         <button
//           onClick={saveFaceDescriptor}
//           className="px-4 py-2 bg-green-500 text-white rounded-lg"
//         >
//           💾 Guardar descriptor
//         </button>
//         <button
//           onClick={compareFace}
//           className="px-4 py-2 bg-purple-500 text-white rounded-lg"
//         >
//           🔍 Comparar rostro
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useRef } from "react";

export default function FaceRecognitionVideo() {
  const videoRef = useRef(null);
  const faceapiRef = useRef(null);

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
    localStorage.setItem("miRostro", JSON.stringify(Array.from(det.descriptor)));
    alert("✅ Descriptor guardado correctamente");
  }

  async function compareFace() {
    const faceapi = faceapiRef.current;
    const video = videoRef.current;
    if (!faceapi) return alert("Face API no inicializada aún");
    const stored = JSON.parse(localStorage.getItem("miRostro"));
    if (!stored) return alert("No hay descriptor guardado. Primero guarda uno.");
    const det = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
    if (!det) return alert("No se detectó rostro para comparar");
    const labeled = new faceapi.LabeledFaceDescriptors("UserStoraged", [new Float32Array(stored)]);
    const matcher = new faceapi.FaceMatcher([labeled], 0.35);
    alert("Resultado: " + matcher.findBestMatch(det.descriptor).toString());
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={videoRef} id="inputVideo" autoPlay muted width="640" height="480" />
      <div className="flex gap-3">
        <button onClick={saveFaceDescriptor} className="px-4 py-2 bg-green-500 text-white rounded-lg">
          💾 Guardar descriptor
        </button>
        <button onClick={compareFace} className="px-4 py-2 bg-purple-500 text-white rounded-lg">
          🔍 Comparar rostro
        </button>
      </div>
    </div>
  );
}

