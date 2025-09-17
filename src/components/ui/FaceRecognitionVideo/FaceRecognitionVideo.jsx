"use client";

import { useEffect } from "react";
import * as faceapi from "@vladmandic/face-api";

export default function FaceRecognitionVideo() {
  useEffect(() => {
    const init = async () => {
      const video = document.getElementById("inputVideo");

      //Pedir acceso a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      video.srcObject = stream;

      //Ruta para acceder a los modelos
      //Directorio models ubicado dentro de /public
      const MODEL_URL = "/models";

      //Cargar modelos De Reconocmiento
      await Promise.all([
        //Modelo de Deteccion de Rostros
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        //Modelo de Deteccion de Puntos de Referencia de Rostros
        //Ubicar (Nariz, Ojos, Boca)
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        //Modelo Generador de Vectores del Rostro 
        //Poder Comparar y Reconocer Distintos Rostros
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        //Modelo Clasificador de Emociones (Agregado Extra)
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      video.addEventListener("play", onPlay);
    };

    //Funcion Inicializadora 
    //Encargada de Iniciar los procesos Cuando los modelos y el video están Preparados
    init();

    // Detección continua en video
    async function onPlay() {
      const video = document.getElementById("inputVideo");
      const canvas = document.getElementById("overlay");
        
      //Obtencion de Datos en Array fullFaceDescriptions
      const fullFaceDescriptions = await faceapi
        //Deteccion de Todas las Caras del Video
        .detectAllFaces(video)
        //Obtencion de Puntos De Referencia del Rostro
        .withFaceLandmarks()
        //Obtencion de Vector del Rostro 
        .withFaceDescriptors()
        //Obtencion de Emociones
        .withFaceExpressions();

      //Redimension del Canvas
      //Objetivo -> Que Los Datos de fullFaceDescriptions se Dibujen Correctamente en el canva
      //matchDimensions -> Adapta el canvas a las dimensiones del Video
      const dims = faceapi.matchDimensions(canvas, video, true);
      //Escala las Coordenadas de Deteccion para que Coincidan con el Canvas
      const resizedResults = faceapi.resizeResults(fullFaceDescriptions, dims);

      //Objetivo -> Limpiar el Canvas Cada Frame
      //ctx -> Contexto
      //Obtener los Dibujos Realizados en el Canvas
      const ctx = canvas.getContext("2d");
      //Limpiar el canvas Completamente
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //Dibujar Resultados en el Canvas
      //Dibuja un recuadro alrededor del Rostro
      faceapi.draw.drawDetections(canvas, resizedResults);
      //Dibuja Puntos de Referencia 
      faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
      //Muestra una Etiqueta que Representa las Emociones
      faceapi.draw.drawFaceExpressions(canvas, resizedResults);

      //Volver a Llamar la Funcion onPlay por Frame
      requestAnimationFrame(onPlay);
    }
  }, []);

  //Captura rostro y guarda como PNG
  async function captureFace() {
    const video = document.getElementById("inputVideo");
    const detections = await faceapi
      .detectSingleFace(video)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      alert("No se detectó ningún rostro");
      return;
    }

    const box = detections.detection.box;
    const regionsToExtract = [
      new faceapi.Rect(box.x, box.y, box.width, box.height),
    ];
    const faceCanvas = await faceapi.extractFaces(video, regionsToExtract);

    if (faceCanvas.length > 0) {
      const faceImg = faceCanvas[0].toDataURL("image/png");

      // Descargar la imagen
      const link = document.createElement("a");
      link.href = faceImg;
      link.download = "rostro.png";
      link.click();
    }
  }

  //Guardar descriptor en localStorage
  async function saveFaceDescriptor() {
    const video = document.getElementById("inputVideo");
    const detection = await faceapi
      .detectSingleFace(video)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No se detectó rostro");
      return;
    }

    const descriptor = detection.descriptor;
    const jsonDescriptor = Array.from(descriptor);

    console.log(jsonDescriptor)
    localStorage.setItem("miRostro", JSON.stringify(jsonDescriptor));
    alert("✅ Descriptor guardado correctamente");
  }

  // 📌 Comparar rostro en vivo con el guardado
  async function compareFace() {
    const video = document.getElementById("inputVideo");
    const storedDescriptor = JSON.parse(localStorage.getItem("miRostro"));

    if (!storedDescriptor) {
      alert("No hay descriptor guardado. Primero guarda uno.");
      return;
    }

    const detection = await faceapi
      .detectSingleFace(video)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No se detectó rostro para comparar");
      return;
    }

    const queryDescriptor = detection.descriptor;

    const labeledDescriptor = new faceapi.LabeledFaceDescriptors("Usuario1", [
      new Float32Array(storedDescriptor),
    ]);

    const faceMatcher = new faceapi.FaceMatcher([labeledDescriptor], 0.35);
    const bestMatch = faceMatcher.findBestMatch(queryDescriptor);

    alert("Resultado: " + bestMatch.toString());
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <video id="inputVideo" autoPlay muted width="640" height="480" />
        <canvas
          id="overlay"
          width="640"
          height="480"
          className="absolute top-0 left-0"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={captureFace}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          📸 Capturar rostro
        </button>
        <button
          onClick={saveFaceDescriptor}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          💾 Guardar descriptor
        </button>
        <button
          onClick={compareFace}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg"
        >
          🔍 Comparar rostro
        </button>
      </div>
    </div>
  );
}
