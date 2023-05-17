import AWS from "aws-sdk";
import base64 from "base64-stream";
import fetch from "node-fetch";
import { Router } from 'express';
import moment from 'moment-timezone';
import 'moment/locale/es.js';
import fs from 'fs';
import { ACCESSKEY_ID } from "./../../src/config.js";
import { SECRET_ACCESSKEY } from "./../../src/config.js";
import { REGION } from "./../../src/config.js";
import { S3Client } from "@aws-sdk/client-s3";

const MAX_TEXT_LENGTH = 3000;
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

function stripHtmlTags(text) {
  return text.replace(/<[^>]+>/g, '');
}

function textPARTS(text){
	const textParts = [];
	for (let i = 0; i < text.length; i += MAX_TEXT_LENGTH) {
	  const part = text.substr(i, MAX_TEXT_LENGTH);
	  textParts.push(part);
	}
	return textParts[0];
}

async function getArticle(getIdArticle) {
  var resp = await fetch(`https://estadisticas.ecuavisa.com/sites/services/global/mirrorGetVoice.php?idarticulo=${getIdArticle}`); 
  var obtener = await resp.json();

  if(obtener != null){
  	const components = obtener.article.content.component;
	  var textValues = "";
	  for (let component of components) {
	    if (component.name === 'Text') {
	      textValues += component.__text;
	    }
	  }
	  var plainText = stripHtmlTags(textValues);
	  return plainText;
  }

  return "";
};

routes.get("/", async function (req, res) {
	return res.json("Servicio de speechsynthesis: v0.03 - "+moment().format('MMMM Do YYYY, h:mm:ss a'));
});

routes.get("/speechsynthesis", async function (req, res) {
	try {
		var { idArticle="" } = req.query;
		if(idArticle=="" ){
			return res.status(200).send({ resp:false,message: "Falta el idArticle" });
		}
		// Define el texto que quieres convertir a voz
	  //const texto = 'Hola, esto es un ejemplo de texto a voz utilizando AWS Polly.';

	  // Configura los parámetros para la solicitud de Polly
	  var text_Article = await getArticle(idArticle);
	  if(text_Article == ""){
	  	return res.status(200).send({ resp:false,message: "No existe el artículo" }); 
	  }
	  text_Article = textPARTS(text_Article);

	  const params = {
	    OutputFormat: 'mp3',
	    Text: text_Article,
	    VoiceId: 'Mia',
	  };

	  // Realiza la solicitud a Polly para obtener el audio
	  polly.synthesizeSpeech(params, (err, data) => {
	    if (err) {
	      //console.log('Error al obtener el audio de Polly:', err);
	      res.status(500).send('Error al obtener el audio de Polly'+err);
	    } else if (data.AudioStream instanceof Buffer) {
	      // Guarda el archivo de audio en el bucket de S3
	      const audioBuffer = Buffer.from(data.AudioStream);
		    // Convierte el buffer en una cadena base64
		    const audioData = audioBuffer.toString('base64');
		    // audioData contiene el audio en formato base64
		    return res.send(audioData);
	    }
	  });
	} catch (error) {
    console.error('Error al generar el audio:', error);
    res.status(500).send('Error al generar el audio.');
  }
});
