<template>
	<section>
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
	
		<link rel="stylesheet" href="https://cdn-ecuavisa.pages.dev/ampliadas/ampliada-simple/ampliada-simple.css">
		
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
				
				<!-- Notas utilizadas -->
				<VCard class="mb-4">
				<VCardItem>
					<VCardTitle class="d-flex flex-wrap gap-2 align-center">
					Notas utilizadas
					</VCardTitle>
					<VCardSubtitle>
					Articulos utilizados para generar esta nota
					</VCardSubtitle>
				</VCardItem>
				<VCardText>
					<!-- Tags -->
					<div class="d-flex gap-2 align-center mt-2 flex-wrap mb-3">
					<small>Tags:</small>
					<VChip size="x-small" color="primary" v-for="item in articleIA.dataSend.keywords">
						{{ item }}
					</VChip>
					</div>
					<VDivider />
					
					<!-- Lista de artículos -->
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
					
					<!-- Detalles de nota -->
					<div class="mt-4">
					<h4 class="text-h6 mb-3">Detalles de nota creada</h4>
					
					<!-- Tono -->
					<div class="d-flex gap-2 align-center mt-2 flex-wrap mb-3">
						<small>Tono:</small>
						<VChip 
						v-if="loadingIA" 
						size="x-small" 
						color="warning" 
						class="skeleton-box" 
						style="width:80px;"
						>
						</VChip>
						<VChip 
						v-else 
						size="x-small" 
						color="warning"
						>
						{{ articleIA.dataSend?.tone || 'No especificado' }}
						</VChip>
					</div>
					
					<!-- Estilo -->
					<div class="d-flex gap-2 align-center mt-2 flex-wrap mb-3">
						<small>Estilo:</small>
						<VChip 
						v-if="loadingIA" 
						size="x-small" 
						color="warning" 
						class="skeleton-box" 
						style="width:100px;"
						>
						</VChip>
						<VChip 
						v-else 
						size="x-small" 
						color="warning"
						>
						{{ articleIA.dataSend?.style || 'No especificado' }}
						</VChip>
					</div>
					
					<!-- Conteo de palabras -->
					<div class="d-flex gap-2 align-center mt-2 flex-wrap mb-3">
						<small>Conteo de palabras:</small>
						<VChip 
						v-if="loadingIA" 
						size="x-small" 
						color="orange" 
						class="skeleton-box" 
						style="width:60px;"
						>
						</VChip>
						<VChip 
						v-else 
						size="x-small" 
						color="orange"
						>
						{{ articleIA.wordCount || 0 }} palabras
						</VChip>
					</div>
					
					<!-- Autor -->
					<div class="d-flex gap-2 align-center mt-2 flex-wrap mb-3">
						<small>Autor:</small>
						<VChip 
						v-if="loadingIA" 
						size="x-small" 
						color="orange" 
						class="skeleton-box" 
						style="width:120px;"
						>
						</VChip>
						<VChip 
						v-else 
						size="x-small" 
						color="orange"
						>
						{{ userData?.email || 'No disponible' }}
						</VChip>
					</div>
					</div>
				</VCardText>
				</VCard>

				<!-- Previsualización Móvil -->
				<VCard class="mb-4">
					<VCardItem>
						<VCardTitle class="d-flex flex-wrap gap-2 align-center">
							<VIcon icon="tabler-device-mobile" size="20" class="mr-1" />
							Previsualización en móvil
						</VCardTitle>
						<VCardSubtitle>
							Vista previa del artículo en dispositivos móviles
						</VCardSubtitle>
					</VCardItem>
					<VCardText class="pa-0">
						<div class="mobile-preview-container">
							<div class="mobile-device">
								<!-- Celular -->
								<div class="mobile-frame">
									<!-- Header de móvil -->
									<div class="mobile-header">
										<img 
											src="https://services.ecuavisa.com/gestor/header-ia.jpeg" 
											alt="Header Ecuavisa" 
											class="header-image"
										>
									</div>
									
									<!-- Contenido del artículo móvil con scroll -->
									<div class="mobile-content">
										<!-- Categoría y fecha -->
										<div class="mobile-header-info">
											<div class="mobile-category">
												<span v-if="loadingIA" class="skeleton-box-mobile" style="width:120px; height:12px;"></span>
												<span v-else class="category-text">INTELIGENCIA ARTIFICIAL</span>
											</div>
											<div class="mobile-date">
												<span v-if="loadingIA" class="skeleton-box-mobile" style="width:80px; height:10px;"></span>
												<span v-else>{{ getArticleDateTime() }}</span>
											</div>
										</div>
										
										<!-- Título -->
										<div class="mobile-title">
											<h1 v-if="loadingIA">
												<div class="skeleton-box-mobile mb-1" style="width:100%; height:18px;"></div>
												<div class="skeleton-box-mobile mb-1" style="width:90%; height:18px;"></div>
												<div class="skeleton-box-mobile" style="width:75%; height:18px;"></div>
											</h1>
											<h1 v-else>{{ articleIA.title }}</h1>
										</div>
										
										<!-- Imagen del artículo -->
										<div class="mobile-image">
											<div v-if="selectedImage" class="mobile-article-image">
												<img :src="selectedImage" alt="Imagen del artículo" />
											</div>
											<div v-else class="mobile-image-placeholder">
												<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
													<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
													<circle cx="8.5" cy="8.5" r="1.5"/>
													<polyline points="21,15 16,10 5,21"/>
												</svg>
											</div>
										</div>
										
										<!-- Autor info  -->
										<div class="mobile-author">
											<div class="mobile-author-avatar">
												<img 
													src="https://www.ecuavisa.com/binrepository/logo_754850_20221223213001.png" 
													alt="IA Redacción"
													class="author-avatar-mobile"
												>
											</div>
											<div class="mobile-author-info">
												<div class="author-name">REDACCIÓN</div>
												<div class="author-tag">Artículo con IA</div>
											</div>
											<div class="mobile-social-icons">
												<div class="social-icon-mobile whatsapp">
													<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
														<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
													</svg>
												</div>
												<div class="social-icon-mobile bookmark">
													<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
														<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
													</svg>
												</div>
												<div class="social-icon-mobile share">
													<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
														<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
														<polyline points="16,6 12,2 8,6"/>
														<line x1="12" y1="2" x2="12" y2="15"/>
													</svg>
												</div>
											</div>
										</div>
										
										<!-- Contenido de texto completo -->
										<div class="mobile-text-content">
											<div v-if="loadingIA">
												<div class="skeleton-box-mobile mb-2" style="width:100%; height:12px;"></div>
												<div class="skeleton-box-mobile mb-2" style="width:95%; height:12px;"></div>
												<div class="skeleton-box-mobile mb-2" style="width:88%; height:12px;"></div>
												<div class="skeleton-box-mobile mb-2" style="width:92%; height:12px;"></div>
												<div class="skeleton-box-mobile mb-2" style="width:97%; height:12px;"></div>
												<div class="skeleton-box-mobile mb-2" style="width:85%; height:12px;"></div>
												<div class="skeleton-box-mobile mb-2" style="width:100%; height:12px;"></div>
												<div class="skeleton-box-mobile mb-2" style="width:90%; height:12px;"></div>
											</div>
											<div v-else>
												<div v-html="lectorMD(articleIA.content)" class="mobile-article-content"></div>
											</div>
										</div>
										
										<!-- TEMAS móvil -->
										<div class="mobile-temas" v-if="!loadingIA && articleIA.keywords">
											<div class="mobile-temas-title">TEMAS</div>
											<div class="mobile-temas-list">
												<div 
													v-for="tema in articleIA.keywords" 
													:key="tema"
													class="mobile-tema-tag"
												>
													{{ tema.toUpperCase() }}
													<span class="tema-plus">+</span>
												</div>
											</div>
										</div>
										
										<!-- TEMAS móvil -->
										<div class="mobile-temas" v-if="loadingIA">
											<div class="mobile-temas-title">TEMAS</div>
											<div class="mobile-temas-list">
												<div v-for="item in 4" :key="item" class="mobile-tema-skeleton">
													<div class="skeleton-box-mobile" style="width:80px; height:24px; border-radius:2px;"></div>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								<!-- Botón home del celular -->
								<div class="mobile-home-button"></div>
							</div>
						</div>
					</VCardText>
				</VCard>

			
			</VCol>

			<VCol cols="12" md="8" lg="8">
				<!-- Estructura exacta de Ecuavisa -->
				<div class="u-noticia-principal">
					<div class="DETAIL_INF1_TIT_INF2_IMG_TXT AMPLIADA_FIRST">
						
						<!-- botones IA -->
						<div class="ai-controls-header">
							<div class="ai-header-content">
								<div class="ai-generated-section" v-if="!loadingIA">
									<span class="ai-badge-text">Generado con IA</span>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ai-icon">
										<polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
										<polygon points="12,8 18,11.5 18,16.5 12,20 6,16.5 6,11.5"/>
										<circle cx="12" cy="14" r="2"/>
									</svg>
								</div>
								<VBtn 
									@click="$router.push('/apps/radar/ia/')" 
									color="primary" 
									size="small" 
									:disabled="loadingIA"
									prepend-icon="tabler-arrow-left"
									class="return-button"
								>
									REGRESAR Y GENERAR OTRA NOTA
								</VBtn>
							</div>
						</div>

						<!-- Body con categoría y fecha -->
						<div class="body-ec">
							<div class="categoria-ecuavisa">
								<div class="article-section">
									<a class="section" href="#">
										<span v-if="loadingIA" class="skeleton-box" style="width:120px; height:16px;"></span>
										<span v-else>INTELIGENCIA ARTIFICIAL</span>
									</a>
								</div>
							</div>
							<div class="date-ec">
								<div class="date-format">
									<span v-if="loadingIA" class="skeleton-box" style="width:150px; height:16px;"></span>
									<span v-else>{{ getArticleDateTime() }}</span>
								</div>
							</div>

							<!-- Título y subtítulo-->
							<div class="title-section">
								<h1 class="headline fw-bolder">
									<span class="priority-content">
										<span v-if="loadingIA" class="skeleton-box" style="width:95%; height:80px; display:block;"></span>
										<span v-else>{{ articleIA.title }}</span>
									</span>
								</h1>
								
								<h2 class="subheadline-text fw-normal" style="margin-bottom: 20px!important;">
									<span v-if="loadingIA" class="skeleton-box" style="width:100%; height:48px; display:block;"></span>
									<span v-else>{{ articleIA.metaDescription }}</span>
								</h2>
							</div>
						</div>

						<!-- Imagen principal -->
						<div class="multimedia">
							<div class="multimediaMacroWrapper">
								<ul class="bxMultimedia">
									<li class="contentMedia art-gallery">
										<figure class="cutlineShow">
											<div frame="crop_amp" style="position: relative; width: 100%; padding-top: 50.00%;">
												<!-- Input file oculto -->
												<input 
													type="file" 
													id="imageInput" 
													accept="image/*" 
													@change="handleImageSelect" 
													style="display: none;"
												>
												
												<!-- Área de drop con imagen o placeholder -->
												<div 
													class="image-drop-area"
													:class="{ 'drag-over': isDragOver, 'has-image': selectedImage }"
													@drop="handleDrop"
													@dragover="handleDragOver"
													@dragenter="handleDragEnter"
													@dragleave="handleDragLeave"
													@click="openFileSelector"
												>
													<!-- Imagen seleccionada -->
													<img 
														v-if="selectedImage" 
														:src="selectedImage" 
														alt="Imagen del artículo"
														class="selected-image"
													>
													
													<!-- Placeholder -->
													<div v-else class="image-placeholder-ecuavisa">
														<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: #999;">
															<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
															<circle cx="8.5" cy="8.5" r="1.5"/>
															<polyline points="21,15 16,10 5,21"/>
														</svg>
														<p class="mt-3 text-grey-lighten-1">Arrastra una imagen aquí o haz clic para seleccionar</p>
													</div>
													
													<!-- Overlay de drag -->
													<div v-if="isDragOver" class="drag-overlay">
														<p>Suelta la imagen aquí</p>
													</div>
												</div>
											</div>
											<div class="cutline">
												<span class="cutline-text">
													<span v-if="loadingIA" class="skeleton-box" style="width:80%; height:16px;"></span>
													<span v-else>{{ selectedImage ? `Imagen para el artículo: ${articleIA.title}` : `Imagen para el artículo: ${articleIA.title || 'Artículo de IA'}` }}</span>
												</span>
												(<span class="byline-image">IA Ecuavisa</span>)
											</div>
										</figure>
									</li>
								</ul>
							</div>
						</div>

						<!-- Información del autor -->
						<div class="inf2 bAutorRedes d-flex justify-content-between align-items-center">
							<div class="author d-flex">
								<div class="autor-img">
									<img 
										alt="IA Redacción" 
										src="https://www.ecuavisa.com/binrepository/logo_754850_20221223213001.png" 
										class="img-ec" 
										width="50px" 
										height="50px"
									>
								</div>
								<div class="autor-description">
									<div class="byline autordiv">
										<h2>Redacción Digital</h2>
									</div>
									<div class="cargo-ec">Artículo generado con IA</div>
								</div>
							</div>
							<div class="btn-compartir d-flex ver">
								<!-- Iconos de compartir  -->
								<div class="social-icons-container">
									<div class="social-icon whatsapp-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
											<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
										</svg>
										<span class="icon-text">Canal WhatsApp</span>
									</div>
									<div class="social-icon save-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
											<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
										</svg>
										<span class="icon-text">Guardar</span>
									</div>
									<div class="social-icon share-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
											<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
											<polyline points="16,6 12,2 8,6"/>
											<line x1="12" y1="2" x2="12" y2="15"/>
										</svg>
										<span class="icon-text">Compartir</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Contenido del artículo -->
					<div class="u-ampliada-contenido">
						<div class="DETAIL_TXT AMPLIADA_SECOND">
							<div class="text">
								<div v-if="articleIA.id && !loadingIA" class="paragraph">
									<div v-html="lectorMD(articleIA.content)"></div>
								</div>
								<div v-else-if="loadingIA" class="paragraph">
									<div class="skeleton-box mb-3" style="width:100%; height: 20px;"></div>
									<div class="skeleton-box mb-3" style="width:100%; height: 20px;"></div>
									<div class="skeleton-box mb-3" style="width:85%; height: 20px;"></div>
									<div class="skeleton-box mb-4" style="width:100%; height: 20px;"></div>
									<div class="skeleton-box mb-3" style="width:92%; height: 20px;"></div>
									<div class="skeleton-box mb-3" style="width:100%; height: 20px;"></div>
									<div class="skeleton-box mb-3" style="width:78%; height: 20px;"></div>
								</div>
								<div v-else class="paragraph">
									<p>No existe contenido disponible</p>
								</div>
							</div>
						</div>

						<!-- Sección TEMAS -->
						<div class="u-temas" v-if="!loadingIA">
							<div class="tags_temas">
								<div class="title-tag">TEMAS</div>
								<div class="metas">
									<div 
										v-for="item in articleIA.keywords" 
										:key="item"
										class="keywords font-2 fs13"
									>
										<div class="item_tema">
											<span class="tag-button">
												{{ item.toUpperCase() }} +
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Skeletons para TEMAS cuando está cargando -->
						<div class="u-temas" v-if="loadingIA">
							<div class="tags_temas">
								<div class="title-tag">TEMAS</div>
								<div class="metas">
									<div v-for="item in 6" :key="item" class="keywords font-2 fs13">
										<div class="item_tema">
											<div class="skeleton-box" style="width:100px; height:32px; border-radius:3px;"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</VCol>
		</VRow>
	</section>
</template>

<script setup>
import Moment from "moment";
import { extendMoment } from "moment-range";
import esLocale from "moment/locale/es";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from 'vue-router';
import lectorMD from '../lectorMD.js';
import { LocalStorageCRUD } from '../LocalStorageCRUD.js';

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
const selectedImage = ref(null);
const isDragOver = ref(false);

const userData = ref({});

// Función para obtener preview del contenido
const getContentPreview = () => {
	if (!articleIA.value?.content) return '';
	
	// Remover markdown y HTML básico
	let preview = articleIA.value.content
		.replace(/#{1,6}\s/g, '') // quitar headers
		.replace(/\*\*(.*?)\*\*/g, '$1') // quitar negritas
		.replace(/\*(.*?)\*/g, '$1') // quitar cursivas
		.replace(/\[(.*?)\]\(.*?\)/g, '$1') // quitar links
		.replace(/`(.*?)`/g, '$1') // quitar código
		.replace(/^\s*[\-\*]\s+/gm, '') // quitar bullets
		.trim();
	
	// Limitar a 120 caracteres
	return preview.length > 120 ? preview.substring(0, 120) + '...' : preview;
};

// Funciones para manejo de imágenes
const handleImageSelect = (event) => {
	const file = event.target.files[0];
	if (file && file.type.startsWith('image/')) {
		const reader = new FileReader();
		reader.onload = (e) => {
			selectedImage.value = e.target.result;
			// Guardar en el artículo
			articleIA.value.selectedImage = e.target.result;
			LocalStorageCRUD.updateById(idArticleIA.value, articleIA.value);
		};
		reader.readAsDataURL(file);
	}
};

const handleDrop = (event) => {
	event.preventDefault();
	isDragOver.value = false;
	
	const files = event.dataTransfer.files;
	if (files.length > 0 && files[0].type.startsWith('image/')) {
		const reader = new FileReader();
		reader.onload = (e) => {
			selectedImage.value = e.target.result;
			// Guardar en el artículo
			articleIA.value.selectedImage = e.target.result;
			LocalStorageCRUD.updateById(idArticleIA.value, articleIA.value);
		};
		reader.readAsDataURL(files[0]);
	}
};

const handleDragOver = (event) => {
	event.preventDefault();
	event.dataTransfer.dropEffect = 'copy';
	isDragOver.value = true;
};

const handleDragLeave = (event) => {
	event.preventDefault();
	// Solo cambiar estado si realmente salimos del contenedor
	if (!event.currentTarget.contains(event.relatedTarget)) {
		isDragOver.value = false;
	}
};

const handleDragEnter = (event) => {
	event.preventDefault();
	isDragOver.value = true;
};

const openFileSelector = () => {
	document.getElementById('imageInput').click();
};

// Función para obtener fecha y hora del artículo
const getArticleDateTime = () => {
	if (!articleIA.value?.generateDate) {
		return moment().format('D MMM YYYY, HH:mm');
	}
	
	// La fecha está en formato DD/MM/YYYY HH:mm:ss
	const fecha = moment(articleIA.value.generateDate, 'DD/MM/YYYY HH:mm:ss');
	
	// Si no es válido, usar fecha actual como fallback
	if (!fecha.isValid()) {
		return moment().format('D MMM YYYY, HH:mm');
	}
	
	return fecha.format('D MMM YYYY, HH:mm');
};
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

  // Cargar userData del localStorage
  userData.value = JSON.parse(localStorage.getItem('userData') || '{}');

  if(!articleIA.value?.dataSend){
	LocalStorageCRUD.deleteById(idArticleIA.value)
    router.push('/apps/radar/ia/')
    return;
  }
  
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
		// Agregar fecha de generación si no existe
		if (!articleIA.value.generateDate) {
	articleIA.value["generateDate"] = moment().format('YYYY-MM-DD HH:mm:ss');
}
		LocalStorageCRUD.updateById(idArticleIA.value, articleIA.value);
	}else{
		snackbar.value = {
			show: true,
			text: `Error, no se pudo generar la nota con IA, intente recargar la página: ${JSON.stringify(respAI)}`,
			color: 'error'
		}
	}

	// Cargar imagen guardada si existe
if (articleIA.value.selectedImage) {
	selectedImage.value = articleIA.value.selectedImage;
}
	loadingIA.value = false;
  }else{
	loadingIA.value = false;
  }
})
</script>

<style scoped>
/* Previsualización Móvil */
.mobile-preview-container {
	display: flex;
	justify-content: center;
	padding: 16px;
	background: #f8f9fa;
	border-radius: 12px;
}

.mobile-device {
	position: relative;
	padding: 20px 8px 25px 8px;
	background: #1a1a1a;
	border-radius: 25px;
	box-shadow: 0 0 0 2px #333, 0 8px 32px rgba(0,0,0,0.3);
}

.mobile-frame {
	width: 280px;
	height: 560px;
	background: #000;
	border-radius: 20px;
	overflow: hidden;
	position: relative;
	box-shadow: inset 0 0 0 1px #333;
}

.mobile-header {
	height: 120px;
	overflow: hidden;
	position: relative;
}

.header-image {
	width: 100%;
	height: 100%;
	object-fit: contain;
	object-position: center center;
}

.mobile-content {
	background: #fff;
	padding: 12px;
	height: calc(100% - 120px);
	overflow-y: auto;
	font-family: "Archivo", sans-serif;
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.mobile-content::-webkit-scrollbar {
	display: none;
}

.mobile-home-button {
	position: absolute;
	bottom: 8px;
	left: 50%;
	transform: translateX(-50%);
	width: 35px;
	height: 4px;
	background: #666;
	border-radius: 2px;
}

.mobile-header-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	gap: 10px;
}

.mobile-category {
	flex: 1;
}

.category-text {
	color: #2927B9;
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	font-family: "Archivo", sans-serif;
}

.mobile-date {
	flex-shrink: 0;
}

.mobile-date span {
	font-size: 10px;
	color: #666;
	font-family: "Archivo", sans-serif;
	font-weight: 300;
}

.mobile-title {
	margin-bottom: 15px;
}

.mobile-title h1 {
	font-size: 18px;
	font-weight: 700;
	line-height: 22px;
	color: #060127;
	margin: 0;
	font-family: "Archivo", sans-serif;
}

.mobile-image {
	margin-bottom: 15px;
	height: 150px;
	background: #f0f0f0;
	border-radius: 6px;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
}

.mobile-article-image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.mobile-image-placeholder {
	color: #999;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.mobile-text-content {
	margin-bottom: 20px;
	margin-top: 15px;
}

.mobile-article-content {
	font-size: 14px;
	line-height: 18px;
	color: #060127;
	font-family: "Archivo", sans-serif;
	font-weight: 400;
}

.mobile-article-content p {
	margin-bottom: 12px;
	font-size: 14px;
	line-height: 18px;
	color: #060127;
}

.mobile-article-content h2 {
	font-size: 16px;
	font-weight: 700;
	color: #060127;
	margin: 16px 0 8px 0;
	font-family: "Archivo", sans-serif;
}

.mobile-article-content h3 {
	font-size: 15px;
	font-weight: 600;
	color: #060127;
	margin: 12px 0 6px 0;
	font-family: "Archivo", sans-serif;
}

.mobile-text-preview {
	margin-bottom: 12px;
}

.mobile-text-preview p {
	font-size: 12px;
	line-height: 16px;
	color: #333;
	margin: 0;
}

.mobile-author {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 12px 0;
	border-top: 1px solid #eee;
	border-bottom: 1px solid #eee;
	margin-bottom: 0;
}

.mobile-author-avatar {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
}

.author-avatar-mobile {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.mobile-author-info {
	flex: 1;
}

.author-name {
	font-size: 12px;
	font-weight: 600;
	color: #060127;
	text-transform: uppercase;
	font-family: "Archivo", sans-serif;
	margin-bottom: 2px;
}

.author-tag {
	font-size: 10px;
	color: #666;
	font-family: "Archivo", sans-serif;
}

.mobile-social-icons {
	display: flex;
	gap: 8px;
	align-items: center;
}

.social-icon-mobile {
	width: 28px;
	height: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.2s;
}

.social-icon-mobile.whatsapp {
	background: transparent;
}

.social-icon-mobile.whatsapp svg {
	stroke: #25D366;
}

.social-icon-mobile.bookmark {
	background: transparent;
}

.social-icon-mobile.bookmark svg {
	stroke: #333;
}

.social-icon-mobile.share {
	background: transparent;
}

.social-icon-mobile.share svg {
	stroke: #333;
}

.mobile-temas {
	margin-top: 20px;
	padding-top: 15px;
	border-top: 1px solid #eee;
}

.mobile-temas-title {
	font-size: 14px;
	font-weight: 700;
	color: #060127;
	text-transform: uppercase;
	font-family: "Archivo", sans-serif;
	margin-bottom: 10px;
}

.mobile-temas-list {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
}

.mobile-tema-tag {
	background: #fff;
	border: 1px solid #2927B9;
	color: #2927B9;
	padding: 4px 8px;
	border-radius: 2px;
	font-size: 9px;
	font-weight: 500;
	text-transform: uppercase;
	font-family: "Archivo", sans-serif;
	display: flex;
	align-items: center;
	gap: 4px;
}

.tema-plus {
	font-weight: 700;
	font-size: 10px;
}

.mobile-tema-skeleton {
	margin-bottom: 6px;
}

/* Skeleton para móvil */
.skeleton-box-mobile {
	display: inline-block;
	background: #e0e0e0;
	border-radius: 2px;
	animation: shimmer 2s infinite;
}

@keyframes shimmer {
	0% { background-position: -200px 0; }
	100% { background-position: calc(200px + 100%) 0; }
}

/* Área de drop de imagen */
.image-drop-area {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	cursor: pointer;
	transition: all 0.3s ease;
	border: none;
}

.image-drop-area:hover {
	background: rgba(41, 39, 185, 0.05);
}

.image-drop-area.drag-over {
	background: rgba(41, 39, 185, 0.1);
}

.selected-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
	border: none;
	box-shadow: none;
	outline: none;
}

.image-placeholder-ecuavisa {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
	color: #999;
	background: #f8f9fa;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 2px dashed #ddd;
	font-family: "Archivo", sans-serif;
}

/* Asegurar que no hay bordes en el contenedor */
.image-drop-area.has-image {
	border: none;
	background: transparent;
}

.selected-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.drag-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(41, 39, 185, 0.8);
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
	font-size: 18px;
	z-index: 10;
	pointer-events: none;
}
.image-placeholder-ecuavisa {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
	color: #999;
	background: #f8f9fa;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 2px dashed #ddd;
	font-family: "Archivo", sans-serif;
}
* {
	font-family: "Archivo", sans-serif;
	font-optical-sizing: auto;
	font-variation-settings: "wdth" 100;
}

/* Header IA  */
.ai-controls-header {
	background: #f8f9fa;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 16px;
	margin-bottom: 20px;
}

.ai-header-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 16px;
}

.ai-generated-section {
	display: flex;
	align-items: center;
	gap: 8px;
	background: #e3f2fd;
	padding: 8px 16px;
	border-radius: 6px;
	border: 1px solid #bbdefb;
}

.ai-badge-text {
	color: #1976d2;
	font-weight: 600;
	font-size: 14px;
	font-family: "Archivo", sans-serif;
}

.ai-icon {
	width: 18px;
	height: 18px;
	color: #1976d2;
	fill: none;
	stroke: #1976d2;
	stroke-width: 1.5;
}

.return-button {
	font-family: "Archivo", sans-serif !important;
	font-weight: 600 !important;
	text-transform: uppercase !important;
	letter-spacing: 0.5px !important;
	font-size: 12px !important;
}

/* Estructura principal usando las clases de Ecuavisa */
.u-noticia-principal {
	font-family: "Archivo", sans-serif;
}

/* Categoría y fecha */
.categoria-ecuavisa .article-section a {
	color: #2927B9 !important;
	font-family: "Archivo", sans-serif !important;
	font-weight: 600 !important;
	text-transform: uppercase !important;
	font-size: 14px !important;
	text-decoration: none;
}

.date-ec .date-format {
	color: #060127;
	font-family: "Archivo", sans-serif;
	font-weight: 300;
	font-size: 14px;
}


.title-section {
	margin: 0;
	padding: 0;
}

.headline.fw-bolder {
	font-family: "Archivo", sans-serif !important;
	font-weight: 700 !important;
	font-size: 36px !important;
	line-height: 40px !important;
	color: #060127 !important;
	margin: 10px 0 5px 0 !important;
}

.subheadline-text.fw-normal {
	font-family: "Archivo", sans-serif !important;
	font-weight: 400 !important;
	font-size: 20px !important;
	line-height: 27px !important;
	color: #333 !important;
	margin: 0 !important;
	padding: 0 !important;
}

/* Autor */
.autor-description .byline h2 {
	font-family: "Archivo", sans-serif !important;
	font-weight: 600 !important;
	font-size: 16px !important;
	color: #060127 !important;
	text-transform: uppercase;
	margin: 0;
}

.cargo-ec {
	font-family: "Archivo", sans-serif !important;
	font-weight: 300 !important;
	font-size: 14px !important;
	color: #666 !important;
}

/* Contenido del artículo */
.DETAIL_TXT .text {
	font-family: "Archivo", sans-serif !important;
	font-weight: 500 !important;
	font-size: 18px !important;
	line-height: 23px !important;
	color: #060127 !important;
}

.DETAIL_TXT .text p {
	font-family: "Archivo", sans-serif !important;
	font-weight: 500 !important;
	font-size: 18px !important;
	line-height: 23px !important;
	color: #060127 !important;
	margin-bottom: 16px;
}

.DETAIL_TXT .text h2 {
	font-family: "Archivo", sans-serif !important;
	font-weight: 700 !important;
	color: #060127 !important;
	margin: 24px 0 16px 0;
}

/* Pie de foto */
.cutline {
	background: #2927B9 !important;
	color: #EEE !important;
	padding: 17px !important;
	font-family: "Archivo", sans-serif !important;
	font-weight: 300 !important;
	font-style: italic;
}

.cutline-text {
	font-family: "Archivo", sans-serif !important;
	font-weight: 300 !important;
	font-style: italic;
}

.byline-image {
	font-family: "Archivo", sans-serif !important;
	font-weight: 600 !important;
}

/* Iconos sociales del autor - más pequeños, negros y alineados a la derecha */
.inf2.bAutorRedes {
	justify-content: space-between !important;
	align-items: center !important;
}

.social-icons-container {
	display: flex;
	gap: 12px;
	align-items: center;
	justify-content: flex-end;
	margin-left: auto;
}

.social-icon {
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #000 !important;
	cursor: pointer;
	transition: opacity 0.3s ease;
}

.social-icon:hover {
	opacity: 0.7;
}

.social-icon svg {
	margin-bottom: 4px;
	color: #000 !important;
	fill: none !important;
	stroke: #000 !important;
	stroke-width: 1.5;
}

.social-icon .icon-text {
	font-family: "Archivo", sans-serif !important;
	font-weight: 600;
	font-size: 12px;
	line-height: 13px;
	text-align: center;
	color: #000 !important;
}

/* TEMAS */
.tags_temas .title-tag {
	font-family: "Archivo", sans-serif !important;
	font-weight: 700 !important;
	font-size: 40px !important;
	line-height: 45px !important;
	color: #060127 !important;
	text-transform: uppercase !important;
	margin: 0 0 40px 0 !important;
	position: relative;
	padding-bottom: 40px;
}

.tags_temas .title-tag::before {
	position: absolute;
	content: "";
	width: 100%;
	height: 27px;
	bottom: 0px;
	background-image: url("https://estadisticas.ecuavisa.com/sites/gestor/Recursos/separador-escritorio-azul.png");
	background-size: contain;
	background-position: left center;
	background-repeat: no-repeat;
}

.tags_temas .metas {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	align-items: flex-start;
	padding-top: 20px;
}

.tags_temas .keywords {
	margin-bottom: 8px;
}

.tags_temas .item_tema {
	display: inline-block;
}

.tag-button {
	border: 1px solid #2927B9;
	color: #2927B9;
	background: white;
	padding: 8px 15px;
	text-transform: uppercase;
	font-family: "Archivo", sans-serif;
	font-weight: 500;
	font-size: 13px;
	margin-right: 8px;
	margin-bottom: 8px;
	display: inline-block;
	border-radius: 3px;
	text-decoration: none;
	transition: all 0.3s ease;
	line-height: 1.2;
	min-height: 32px;
	white-space: nowrap;
	cursor: pointer;
}

.tag-button:hover {
	border-color: #060127;
	color: #060127;
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Placeholder para imagen */
.image-placeholder-ecuavisa {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
	color: #999;
	background: #f8f9fa;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 2px dashed #ddd;
	font-family: "Archivo", sans-serif;
}

.image-placeholder-ecuavisa p {
	font-family: "Archivo", sans-serif !important;
	font-weight: 300;
	margin: 0;
}

.skeleton-box {
	display: inline-block;
	position: relative;
	overflow: hidden;
	background-color: #e0e0e0;
	border-radius: 4px;
	background-image: linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 50%, #e0e0e0 100%);
	background-size: 200px 100%;
	background-repeat: no-repeat;
	animation: shimmer 2s infinite;
}

@keyframes shimmer {
	0% {
		background-position: -200px 0;
	}
	100% {
		background-position: calc(200px + 100%) 0;
	}
}


@media (max-width: 768px) {
	.ai-header-content {
		flex-direction: column;
		align-items: stretch;
	}
	
	.ai-generated-section {
		justify-content: center;
	}
	
	.headline.fw-bolder {
		font-size: 28px !important;
		line-height: 32px !important;
	}
	
	.subheadline-text.fw-normal {
		font-size: 18px !important;
		line-height: 24px !important;
	}
	
	.tags_temas .title-tag {
		font-size: 24px !important;
		line-height: 28px !important;
	}
	
	.tag-button {
		font-size: 10px !important;
		padding: 6px 12px !important;
	}
	
	.DETAIL_TXT .text,
	.DETAIL_TXT .text p {
		font-size: 15px !important;
		line-height: 23px !important;
	}
	
	.mobile-device {
		padding: 15px 6px 20px 6px;
	}
	
	.mobile-frame {
		width: 250px;
		height: 500px;
	}
	
	.mobile-header {
		height: 100px;
	}
	
	.mobile-content {
		height: calc(100% - 100px);
	}
}

@media (max-width: 576px) {
	.return-button {
		width: 100%;
		justify-content: center;
	}
	
	.mobile-preview-container {
		padding: 8px;
	}
	
	.mobile-device {
		padding: 12px 4px 15px 4px;
	}
	
	.mobile-frame {
		width: 220px;
		height: 440px;
	}
	
	.mobile-header {
		height: 80px;
	}
	
	.mobile-content {
		padding: 10px;
		height: calc(100% - 80px);
	}
}
</style>