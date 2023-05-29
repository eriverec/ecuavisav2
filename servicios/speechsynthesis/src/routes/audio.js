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

const MAX_TEXT_LENGTH = 1000;
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
	text = text.replace(/<[^>]+>/g, '');
  return text.replace(/\\/g, '');
}

function textPARTS(text) {
  const textParts = [];

  let startIndex = 0;
  let endIndex = Math.min(Math.ceil(MAX_TEXT_LENGTH / 2), text.length);

  if (endIndex < text.length && text[endIndex] !== ' ' && text[endIndex] !== '\n') {
    // Encontrar el último espacio en blanco antes de endIndex
    while (endIndex > startIndex && text[endIndex] !== ' ' && text[endIndex] !== '\n') {
      endIndex--;
    }
  }

  while (startIndex < text.length) {
    const part = text.substring(startIndex, endIndex);
    textParts.push(part);

    startIndex = endIndex;

    if (startIndex < text.length) {
      endIndex = Math.min(startIndex + MAX_TEXT_LENGTH, text.length);

      if (endIndex < text.length && text[endIndex] !== ' ' && text[endIndex] !== '\n') {
        // Encontrar el último espacio en blanco antes de endIndex
        while (endIndex > startIndex && text[endIndex] !== ' ' && text[endIndex] !== '\n') {
          endIndex--;
        }
      }
    }
  }

  return textParts;
}

async function getArticle(getIdArticle) {
  var resp = await fetch(`https://estadisticas.ecuavisa.com/sites/services/global/mirrorGetVoice.php?idarticulo=${getIdArticle}`); 
  var obtener = await resp.json();

  if(obtener != null){
  	const components = obtener.article.content.component;
	  var textValues = "";
	  for (let component of components) {
	    if (component.name === 'Text' || component.name === 'Quotecv' || component.name === 'Cita' || component.name === 'H2' || component.name === 'bullet' || component.name === 'SabiasQue') {
	      textValues += component.__text;
	    }
	  }
	  var plainText = stripHtmlTags(textValues);
	  return plainText;
  }

  return "";
};

routes.get("/", async function (req, res) {
	return res.json("Servicio de speechsynthesis: v0.02 - "+moment().format('MMMM Do YYYY, h:mm:ss a'));
});

function textoABase64(texto) {
  const buffer = Buffer.from(texto, 'utf8');
  return buffer.toString('base64');
}

async function getJsonEstadisticas(idarticulo, parte) {
  var resp = await fetch(`https://estadisticas.ecuavisa.com/sites/gestor/Tools/awsjson/index.php?id=${idarticulo}&parte=${parte}`,{
  /*  method: "GET",
    headers: { "Content-Type": "application/json" },
  }); */
  //var resp = await fetch(`http://localhost/ecuavisa/ecuavisav2/escucharUnTexto/awsv2/index.php?id=${idarticulo}&parte=${parte}`,{
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }); 
  return await resp.json();
}

async function addJsonEstadisticas(data, parte) {
  var resp = await fetch(`https://estadisticas.ecuavisa.com/sites/gestor/Tools/awsjson/endpoindAWS.php?parte=${parte}`,{
	//var resp = await fetch(`http://localhost/ecuavisa/ecuavisav2/escucharUnTexto/awsv2/endpoindAWS.php?parte=${parte}`,{
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  }); 
  return await resp.json();
}

routes.get('/audio', async (req, res) => {
	var { idArticle="5233399", part = 0 } = req.query;
	if (!idArticle) {
    return res.status(400).json({ resp: false, message: "Falta el idArticle" });
  }

  try {
  	const outputFormat = 'mp3';

	  var parte = part;
	  var respJson = await getJsonEstadisticas(idArticle, parte);
	  if(respJson.resp){
	  	res.setHeader('Content-Type', 'audio/mpeg');
	    res.set({
		    'Content-Type': 'audio/mpeg',
		    'Accept-Ranges': 'bytes',
		  });

		  var decodedData = Buffer.from(respJson.data.audioBase64, 'base64');
	    res.write(decodedData);

	    for (let i = (part*1 + 1); i < respJson.totalPartes; i++) {
	      //if (i < part) continue; // Salta las partes anteriores si se especifica un valor de 'part'

	  		var respJson = await getJsonEstadisticas(idArticle, i);
	      // Convertir a base64
				// Decodificar desde base64
				if(respJson.resp){
					var decodedData = Buffer.from(respJson.data.audioBase64, 'base64');
					await new Promise((resolve) => {
				    setTimeout(resolve, 700); // Esperar 1 segundo (1000 milisegundos)
				  });
		      res.write(decodedData);
		      // Si es el último fragmento, finalizar la respuesta
		      if (i === respJson.totalPartes - 1) {
		        return res.end();
		      }
				}
	    }
	  }else{
		  const text_Article = await getArticle(idArticle);
		  if(text_Article == ""){
		  	return res.status(200).send({ resp:false,message: "No existe el artículo" }); 
		  }
	  	// Dividir el texto en partes pequeñas
	    const parts = splitTextIntoParts(text_Article);
	  	res.setHeader('Content-Type', 'audio/mpeg');
	    res.set({
		    'Content-Type': 'audio/mpeg',
		    'Accept-Ranges': 'bytes',
		  });

	    //return res.status(200).send({ resp:true,message: parts }); 
	    // Establecer los encabezados de la respuesta para indicar que es un audio
	    //return res.status(200).send({resp: parts.length});

	    // Generar y enviar cada parte del audio en tiempo real
	    for (let i = 0; i < parts.length; i++) {
	      //if (i < part) continue; // Salta las partes anteriores si se especifica un valor de 'part'

	      const audioData = await generateAudioData(parts[i], outputFormat);
	      console.log("-----------------------")
	      console.log(parts[i])
	      console.log("-----------------------")

	      // Convertir a base64
				const base64Data = Buffer.from(audioData).toString('base64');

				// Decodificar desde base64
				//const decodedData = Buffer.from(base64Data, 'base64');

	      var addJson = await addJsonEstadisticas({
	        "id": idArticle.toString(),
	        "base64": base64Data,
	        "encode": false,
	        "totalPartes" : parts.length
	      }, i);

	      res.write(audioData);

	      // Si es el último fragmento, finalizar la respuesta
	      if (i === parts.length - 1) {
	        return res.end();
	      }
	    }
	  }

	  

    // Finalizar la respuesta
    //res.end();
  } catch (err) {
    console.error('Error al generar el audio:', err);
    res.status(500).send('Error al generar el audio');
  }
});

function splitTextIntoParts(text) {
  // Lógica para dividir el texto en partes pequeñas
  return textPARTS(text);
}

// Función para generar los datos de audio utilizando AWS Polly
async function generateAudioData(text, outputFormat) {
  var params = {
    OutputFormat: outputFormat,
    Text: text,
    VoiceId: 'Mia',
  };

  const { AudioStream } = await polly.synthesizeSpeech(params).promise();
  const audioData = AudioStream;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(audioData);
    }, 700); // Tiempo en milisegundos
  });
}

async function convertToBase64(audioData) {
  return new Promise((resolve) => {
    const stream = new Readable();
    stream.push(audioData);
    stream.push(null);

    const encoderStream = new Base64EncodeStream();

    stream.pipe(encoderStream);

    let base64Data = '';
    encoderStream.on('data', (chunk) => {
      base64Data += chunk.toString();
    });

    encoderStream.on('end', () => {
      resolve(base64Data);
    });
  });
}