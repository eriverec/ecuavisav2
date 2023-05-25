import AWS from "aws-sdk";
import base64 from "base64-stream";
import fetch from "node-fetch";
import { Router } from 'express';
import moment from 'moment-timezone';
import 'moment/locale/es.js';
import fs from 'fs';
import mongoose from "mongoose";
import { ACCESSKEY_ID } from "./../../src/config.js";
import { SECRET_ACCESSKEY } from "./../../src/config.js";
import { REGION } from "./../../src/config.js";
import { S3Client } from "@aws-sdk/client-s3";
import { pollySchema } from "./../../models/polly.js";

const MAX_TEXT_LENGTH = 2000;
export const routes = Router();
const ObjectIdS = mongoose.Types.ObjectId;
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

function textPARTS(text){
	const textParts = [];
	for (let i = 0; i < text.length; i += MAX_TEXT_LENGTH) {
	  const part = text.substr(i, MAX_TEXT_LENGTH);
	  textParts.push(part);
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

async function getArticleMongoDB(idarticulo) {
  var query = {
    $and:[ 
        {"idarticulo": idarticulo }
    ]
  };
  return await pollySchema.findOne(query);
}

async function addArticleMongoDB(idarticulo, audioData) {
  var archivoObj = { 
    idarticulo: idarticulo,
    audio: {
	    data: audioData, // Aquí debes proporcionar los datos binarios del archivo de audio
	    contentType: 'audio/mp3' // Aquí debes especificar el tipo de contenido del archivo
	  }
  };
  const addMongo = await pollySchema(archivoObj).save();
  if(addMongo){return {resp:true,data:addMongo};}
  return { resp:false,  data:[]};
}

routes.get("/", async function (req, res) {
	return res.json("Servicio de speechsynthesis: v0.04 - "+moment().format('MMMM Do YYYY, h:mm:ss a'));
});

routes.get("/speechsynthesis_2", async function (req, res) {
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
	  text_Article = textPARTS(text_Article)[0];

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

	  var getArticuloMongoDB = await getArticleMongoDB(idArticle);
    if(getArticuloMongoDB){
	    return res.send(getArticuloMongoDB);
    };

	  // Realiza una solicitud por cada parte del texto
	  const audioPromises = text_Article.map(part => {
	    const params = {
		    OutputFormat: 'mp3',
		    Text: part,
		    VoiceId: 'Mia',
		  };

	    return new Promise((resolve, reject) => {
	      polly.synthesizeSpeech(params, (err, data) => {
	        if (err) {
	          reject(err);
	        } else {
	          resolve(data.AudioStream);
	        }
	      });
	    });
	  });

	  // Espera a que todas las solicitudes se completen y concatena los resultados
	  var audioStreams = await Promise.all(audioPromises);
	  const concatenatedAudio = Buffer.concat(audioStreams);
    // Envía el audio como respuesta al cliente

    var base64Generado = concatenatedAudio.toString('base64');
    var sugerenciaResp = await addArticleMongoDB(idArticle, base64Generado);
		if(sugerenciaResp.resp){
			return res.send(base64Generado);
		}

	  console.error('Error al generar el audio:', error);
	  return res.status(200).send({ resp:false,message: "Error al generar el audio" }); 

	} catch (error) {
    console.error('Error al generar el audio:', error);
	  return res.status(200).send({ resp:false,message: "Error al generar el audio" }); 
  }
});

routes.get("/speechsynthesis_3", async function (req, res) {
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

	  var getArticuloMongoDB = await getArticleMongoDB(idArticle);
    if(getArticuloMongoDB){
	    return res.send((getArticuloMongoDB.audio.data).toString('base64'));
    };

	  // Realiza una solicitud por cada parte del texto
	  const audioPromises = text_Article.map(part => {
	    const params = {
		    OutputFormat: 'mp3',
		    Text: part,
		    VoiceId: 'Mia',
		  };

	    return new Promise((resolve, reject) => {
	      polly.synthesizeSpeech(params, (err, data) => {
	        if (err) {
	          reject(err);
	        } else {
	          resolve(data.AudioStream);
	        }
	      });
	    });
	  });

	  // Espera a que todas las solicitudes se completen y concatena los resultados
	  var audioStreams = await Promise.all(audioPromises);
	  const concatenatedAudio = Buffer.concat(audioStreams);
    // Envía el audio como respuesta al cliente

	  // Crear un objeto Buffer con los datos binarios del archivo
    const audioBuffer = Buffer.from(concatenatedAudio);

    // Crear el documento a ser guardado en la colección
    const audioDoc = { audio: audioBuffer };

		var sugerenciaResp = await addArticleMongoDB(idArticle, audioBuffer);
		if(sugerenciaResp.resp){
    	return res.send(audioDoc.audio.data.toString('base64'));
		}

	  console.error('Error al generar el audio:', error);
	  return res.status(200).send({ resp:false,message: "Error al generar el audio" }); 

	} catch (error) {
    console.error('Error al generar el audio:', error);
	  return res.status(200).send({ resp:false,message: "Error al generar el audio" }); 
  }
});

function textoABase64(texto) {
  const buffer = Buffer.from(texto, 'utf8');
  return buffer.toString('base64');
}

routes.post("/save/json", async function (req, res) {
	try {
		var { idArticle="5246039" } = req.query;
		if(idArticle=="" ){
			return res.status(200).send({ resp:false,message: "Falta el idArticle" });
		}
	  var text_Article = await getArticle(idArticle);
	  if(text_Article == ""){
	  	return res.status(200).send({ resp:false,message: "No existe el artículo" }); 
	  }
	  text_Article = textPARTS(text_Article);//.toString('base64')
		
		var newParts = [];
		for (var i = 0; i < (text_Article.length); i++) {
			newParts.push(textoABase64(text_Article[i]));
	  }

	  return res.status(200).send({ resp:true, partes: newParts }); 

	  console.error('Error al generar el audio:', error);
	  return res.status(200).send({ resp:false,message: "Error al generar el audio" }); 

	} catch (error) {
    console.error('Error al generar el audio:', error);
	  return res.status(200).send({ resp:false,message: "Error al generar el audio" }); 
  }
});