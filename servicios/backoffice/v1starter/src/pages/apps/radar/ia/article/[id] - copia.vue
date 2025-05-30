<script setup>
import Moment from "moment";
import { extendMoment } from "moment-range";
import esLocale from "moment/locale/es";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from 'vue-router';
import lectorMD from '../lectorMD.js';
import {LocalStorageCRUD} from '../LocalStorageCRUD.js';

const router = useRouter();
const route = useRoute();

const idArticleIA = ref(route.params.id);

const moment = extendMoment(Moment);
moment.locale("es", [esLocale]);

const snackbar = ref({
	show: false,
	text: "",
	color: "success",
	timeout: 3000,
});

const articleIA = ref({});

// Logica con ia
const loadingIA = ref(true);

const generarNotaIA = async (dataSend) => {
  try {
    const response = await fetch('https://ecuavisa-scrapping.vercel.app/ecuavisa-ai/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataSend)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data);
    }

    return data;
    
  } catch (error) {
    console.error(error);
    snackbar.value = {
      show: true,
      text: `Error, no se pudo generar la nota con IA, intente nuevamente`,
      color: 'error'
    }
    return null;
  }
}

onMounted(async()=>{
  articleIA.value = JSON.parse(JSON.stringify(LocalStorageCRUD.findById(idArticleIA.value)));
  if(!articleIA.value?.dataSend){
	LocalStorageCRUD.deleteById(idArticleIA.value)
    router.push('/apps/radar/ia/')
    return;
  }
  
//   articleIA.value.generate = false;
//   LocalStorageCRUD.updateById(idArticleIA.value, articleIA.value);
  if(!articleIA.value?.generate){
	const respAI = await generarNotaIA(articleIA.value.dataSend);
	if(respAI){
		articleIA.value.generate = true;
		articleIA.value["title"] = respAI.synthesizedArticle.title;
		articleIA.value["content"] = respAI.synthesizedArticle.content;
		articleIA.value["keywords"] = respAI.synthesizedArticle.keywords;
		articleIA.value["headings"] = respAI.synthesizedArticle.headings;
		articleIA.value["metaDescription"] = respAI.synthesizedArticle.metaDescription;
		articleIA.value["readabilityScore"] = respAI.synthesizedArticle.readabilityScore;
		articleIA.value["wordCount"] = respAI.synthesizedArticle.wordCount;
		LocalStorageCRUD.updateById(idArticleIA.value, articleIA.value);
		// console.log(articleIA.value);
		// console.log(respAI);
	}else{
		snackbar.value = {
			show: true,
			text: `Error, no se pudo generar la nota con IA, intente recargar la página: ${JSON.stringify(respAI)}`,
			color: 'error'
		}
	}
	loadingIA.value = false;
  }else{
	loadingIA.value = false;
  }
})
// Fin logica con ia
</script>

<template>
	<section>
		<VSnackbar
			v-model="snackbar.show"
			:color="snackbar.color"
			:timeout="snackbar.timeout"
			location="top end"
		>
			{{ snackbar.text }}
		</VSnackbar>
    <VRow v-if="articleIA?.dataSend">
      <VCol cols="12" md="4" lg="4">
        <VCard>
			<VCardItem>
				<VCardTitle class="d-flex flex-wrap gap-2 align-center">
					Notas utilizadas
				</VCardTitle>
				<VCardSubtitle>
					Articulos utilizados para generar esta nota
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<div class="d-flex gap-2 align-center mt-2 flex-wrap mb-3">
					<small>Tags:</small>
					<VChip size="x-small" color="primary" v-for="item in articleIA.dataSend.keywords">
						{{ item }}
					</VChip>
				</div>
				<VDivider />
				<VList lines="two">
					<VListItem
						v-if="articleIA"
						class="px-0"
						v-for="(notaIA, index) in articleIA.dataSend.articles"
						:key="index"
					>
					<VListItemTitle class="text-truncate" :title="notaIA.title">
					{{ notaIA.title }}
					</VListItemTitle>
					<VListItemSubtitle>
						{{ notaIA.content.substring(0, 50) + '...' }}
					</VListItemSubtitle>
					<template #prepend>
						<VAvatar
							color="secondary"
							variant="tonal"
						>
							<VIcon icon="tabler-file-text" />
						</VAvatar>
					</template>

					<template #append>
						<VBtn
							class="ml-2 rounded-sm"
							:href="articleIA.dataOld[index].enlace"
							target="_blank"
							variant="tonal"
							size="x-small"
							color="primary"
							icon="tabler-link"
						/>
					</template>
					</VListItem>
					<VDivider />
				</VList>
			</VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="8" lg="8">
        <VCard>
          <VCardItem>
            <VCardTitle class="d-flex flex-wrap gap-2 align-center justify-between">
				<div class="d-flex flex-wrap gap-2 align-center">
					<span v-if="loadingIA">
						Generando nota..
					</span>
					<span v-else>
						Nota generada con IA 
					</span>
					
					<div class="svg-icon-start mt-1">
						<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512" style="width: 25px; height: 25px; shape-rendering: geometricPrecision; text-rendering: geometricPrecision; image-rendering: optimizeQuality; fill-rule: evenodd; clip-rule: evenodd;">
						<g>
							<path style="opacity:0.978" fill="#000000"
							d="M -0.5,192.5 C -0.5,191.833 -0.5,191.167 -0.5,190.5C 28.0041,186.207 56.0041,179.707 83.5,171C 108.001,163.349 128.501,149.849 145,130.5C 160.188,107.957 170.521,83.2901 176,56.5C 179.885,38.7326 183.885,21.0659 188,3.5C 193.095,32.6418 200.095,61.3085 209,89.5C 217.959,118.435 235.125,140.935 260.5,157C 275.526,164.898 291.193,171.231 307.5,176C 330.487,181.728 353.487,187.062 376.5,192C 347.003,196.966 318.003,203.966 289.5,213C 261.252,222.018 239.085,238.851 223,263.5C 210.823,286.516 202.156,310.849 197,336.5C 193.785,351.12 190.785,365.786 188,380.5C 183.062,357.487 177.728,334.487 172,311.5C 166.455,290.176 157.455,270.509 145,252.5C 128.954,233.815 109.121,220.648 85.5,213C 57.3611,203.939 28.6944,197.106 -0.5,192.5 Z" />
						</g>
						<g>
							<path style="opacity:0.965" fill="#000000"
							d="M 511.5,387.5 C 511.5,387.833 511.5,388.167 511.5,388.5C 493.583,391.584 475.917,395.75 458.5,401C 435.14,407.753 418.64,422.253 409,444.5C 401.312,464.935 395.645,485.935 392,507.5C 388.133,489.034 383.467,470.701 378,452.5C 367.184,423.028 346.351,404.861 315.5,398C 300.891,394.412 286.224,391.078 271.5,388C 291.141,384.256 310.474,379.256 329.5,373C 353,364.833 368.833,349 377,325.5C 383.256,306.474 388.256,287.141 392,267.5C 395.591,287.53 400.591,307.197 407,326.5C 415.635,350.468 432.135,366.301 456.5,374C 474.599,379.608 492.932,384.108 511.5,387.5 Z" />
						</g>
						</svg>

					</div>
				</div>
				<VBtn @click="$router.push('/apps/radar/ia/')" color="primary" class="text-black" :disabled="loadingIA"> 
					<div class="svg-icon-start mt-1">
					<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512" style="width: 20px; height: 20px; shape-rendering: geometricPrecision; text-rendering: geometricPrecision; image-rendering: optimizeQuality; fill-rule: evenodd; clip-rule: evenodd;">
						<g>
						<path style="opacity:0.978" fill="#fff"
							d="M -0.5,192.5 C -0.5,191.833 -0.5,191.167 -0.5,190.5C 28.0041,186.207 56.0041,179.707 83.5,171C 108.001,163.349 128.501,149.849 145,130.5C 160.188,107.957 170.521,83.2901 176,56.5C 179.885,38.7326 183.885,21.0659 188,3.5C 193.095,32.6418 200.095,61.3085 209,89.5C 217.959,118.435 235.125,140.935 260.5,157C 275.526,164.898 291.193,171.231 307.5,176C 330.487,181.728 353.487,187.062 376.5,192C 347.003,196.966 318.003,203.966 289.5,213C 261.252,222.018 239.085,238.851 223,263.5C 210.823,286.516 202.156,310.849 197,336.5C 193.785,351.12 190.785,365.786 188,380.5C 183.062,357.487 177.728,334.487 172,311.5C 166.455,290.176 157.455,270.509 145,252.5C 128.954,233.815 109.121,220.648 85.5,213C 57.3611,203.939 28.6944,197.106 -0.5,192.5 Z" />
						</g>
						<g>
						<path style="opacity:0.965" fill="#fff"
							d="M 511.5,387.5 C 511.5,387.833 511.5,388.167 511.5,388.5C 493.583,391.584 475.917,395.75 458.5,401C 435.14,407.753 418.64,422.253 409,444.5C 401.312,464.935 395.645,485.935 392,507.5C 388.133,489.034 383.467,470.701 378,452.5C 367.184,423.028 346.351,404.861 315.5,398C 300.891,394.412 286.224,391.078 271.5,388C 291.141,384.256 310.474,379.256 329.5,373C 353,364.833 368.833,349 377,325.5C 383.256,306.474 388.256,287.141 392,267.5C 395.591,287.53 400.591,307.197 407,326.5C 415.635,350.468 432.135,366.301 456.5,374C 474.599,379.608 492.932,384.108 511.5,387.5 Z" />
						</g>
					</svg>

					</div>
					<span>Regresar y generar otra nota</span>
				</VBtn>
			</VCardTitle>
          </VCardItem>
		  <VCardText>
			<div class="d-flex flex-column mb-3" style="line-height: 1.3;">
				<div class="titulo-ia mb-2">
				<small>Título generado con IA</small>
				<h3 class="h2">
					<span v-if="loadingIA" class="skeleton-box" style="width:95%;"></span>
					<span v-else>{{ articleIA.title }}</span>
				</h3>
				</div>
				<div class="headings-ia mb-2">
				<small>Subtítulos sugeridos generados con IA</small>
				<h4 class="h4 ">
					<ul>
					<li v-for="item in articleIA.headings" v-if="!loadingIA">
						- {{ item }}
					</li>
					<li v-if="loadingIA" v-for="item in 5" class="skeleton-box" style="width:55%;"></li>
					</ul>
				</h4>
				</div>
				<div class="headings-ia mb-2">
				<small>Meta description generado con IA</small>
				<h4 class="h4 ">
					<span v-if="loadingIA" class="skeleton-box" style="width:95%;"></span>
					<span v-else>{{ articleIA.metaDescription }}</span>
				</h4>
				</div>
				<div class="headings-ia mb-2">
				<small>Legibilidad generado con IA</small>
				<h4 class="h4 ">
					<span v-if="loadingIA" class="skeleton-box" style="width:25%;"></span>
					<span v-else>{{ articleIA.readabilityScore }}</span>
				</h4>
				</div>
				<div class="headings-ia mb-2">
				<small>Palabras generadas con IA</small>
				<h4 class="h4 ">
					<span v-if="loadingIA" class="skeleton-box" style="width:15%;"></span>
					<span v-else>{{ articleIA.wordCount }}</span>
				</h4>
				</div>
				<div class="d-flex gap-2 align-center mt-2 flex-wrap">
				<small>Tags:</small>
				<VChip size="x-small" color="primary" v-for="item in articleIA.keywords" v-if="!loadingIA">
					{{ item }}
				</VChip>
				<VChip size="x-small" color="primary" v-for="item in 5" v-if="loadingIA" class="skeleton-box" style="width:55%;"></VChip>
				</div>
			</div>
			<div v-if="articleIA.id && !loadingIA">
				<div v-html="lectorMD(articleIA.content)"></div>
			</div>
			<div v-else>
				<div v-if="loadingIA" class="skeleton-box" style="width:100%;"></div>
				<div v-if="loadingIA" class="skeleton-box" style="width:100%;"></div>
				<div v-if="loadingIA" class="skeleton-box" style="width:100%;"></div>
				<div v-if="loadingIA" class="skeleton-box" style="width:100%;"></div>
				<div v-if="loadingIA" class="skeleton-box" style="width:100%;"></div>
				<div v-if="loadingIA" class="skeleton-box" style="width:100%;"></div>
				<div v-if="loadingIA" class="skeleton-box" style="width:100%;"></div>
				<div v-else class="no-results">No se existe contenido</div>
			</div>
        </VCardText>
        </VCard>
      </VCol>
    </VRow>
	</section>
</template>
<style scoped>
	.justify-between {
		justify-content: space-between;
	}
	.text-black span.v-btn__content > * {
		color: #fff;
		text-transform: none;
		font-weight: 200;
		letter-spacing: 0;
	}
	.skeleton-box {
		display: inline-block;
		height: 1em;
		position: relative;
		overflow: hidden;
		background-color: #DDDBDD;
	}
	.skeleton-box::after {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		transform: translateX(-100%);
		background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0));
		-webkit-animation: shimmer 2s infinite;
				animation: shimmer 2s infinite;
		content: "";
	}
	@-webkit-keyframes shimmer {
		100% {
			transform: translateX(100%);
		}
	}
	@keyframes shimmer {
		100% {
			transform: translateX(100%);
		}
	}
</style>
