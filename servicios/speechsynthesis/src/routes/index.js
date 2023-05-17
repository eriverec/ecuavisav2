import AWS from "aws-sdk";
import fetch from "node-fetch";
import { Router } from 'express';
import moment from 'moment-timezone';
import 'moment/locale/es.js';
import fs from 'fs';
import { ACCESSKEY_ID } from "./../../src/config.js";
import { SECRET_ACCESSKEY } from "./../../src/config.js";
import { REGION } from "./../../src/config.js";
import { S3Client } from "@aws-sdk/client-s3";

export const routes = Router();
moment.tz.setDefault('America/Guayaquil');

var formatDates = "MM/DD/YYYY";
var toFormatDates = "YYYY-MM-DD";

var fechas = {
  getDate: () => {
    return moment().format(toFormatDates);
  },
  getDateAdd: (number, fecha="", format = "MM-DD-YYYY")=>{
    return moment((fecha==""?new Date():fecha), format).add(number, 'days').format(toFormatDates);
  },
  getStartYear: ()=>{
    return moment().startOf('year').format(toFormatDates);
  },
  getEndYear: ()=>{
    return moment().endOf('year').format(toFormatDates);
  },
}

AWS.config.update({
  accessKeyId: ACCESSKEY_ID,
  secretAccessKey: SECRET_ACCESSKEY,
  region: REGION,
});
// Crea una instancia del cliente S3
const s3 = new AWS.S3();

// Crea una instancia del cliente Polly
const polly = new AWS.Polly();

routes.get("/", async function (req, res) {
  // Define el texto que quieres convertir a voz
  const texto = 'Hola, esto es un ejemplo de texto a voz utilizando AWS Polly.';

  // Configura los parámetros para la solicitud de Polly
  const params = {
    OutputFormat: 'mp3',
    Text: texto,
    VoiceId: 'Mia',
  };

  // Realiza la solicitud a Polly para obtener el audio
  polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      console.log('Error al obtener el audio de Polly:', err);
      res.status(500).send('Error al obtener el audio de Polly');
    } else if (data.AudioStream instanceof Buffer) {
      // Guarda el archivo de audio en el bucket de S3
      const bucketParams = {
        Bucket: 'TU_BUCKET_NAME',
        Key: 'audio.mp3', // Nombre del archivo de audio en S3
        Body: data.AudioStream,
        ContentType: 'audio/mpeg',
      };

      s3.upload(bucketParams, (err, data) => {
        if (err) {
          console.log('Error al subir el archivo de audio a S3:', err);
          res.status(500).send('Error al subir el archivo de audio a S3');
        } else {
          console.log('Archivo de audio subido exitosamente a S3:', data.Location);
          res.send('Archivo de audio subido exitosamente a S3');
        }
      });
    }
  });
});
