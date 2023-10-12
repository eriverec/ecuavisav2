(async () => {
	var paqueteJSON = {
		nombre:"",
		precio_normal:0,
		precio_descuento:0,
		precio_final:0,
		esta_descuento:false,
		frecuencia:"",
		descuentos:[],
		beneficios:[],
		idpaquete:"",
		usuario:null,
		cupon:null,
		opcion_pago: 1,
		location:{
			country:"",
			city:""
		}
	};

	if (ECUAVISA_EC) {
		const contentgracias_btn = document.querySelector(`.content-gracias`);

		async function cargarNombresYPlanes() {
			const loadingElement = document.getElementById('loading');
			loadingElement.style.display = 'block';
			try {
				const response = await fetch('https://ecuavisa-suscripciones.vercel.app/paquete/display/all');
				if (!response.ok) {
					throw new Error('Error al obtener datos desde JSON');
				}
				const resp = await response.json();
				loadingElement.style.display = 'none';
				if (resp.resp) {
					return resp;
				}
				return [];
			} catch (error) {
				loadingElement.style.display = 'none';
				console.error('Error al obtener datos desde JSON:', error);
				throw error;
			}
		}

		async function cargarPaisesYCiudad() {
			try {
				const response = await fetch('https://ecuavisa-suscripciones.vercel.app/otros/obtener-paises-ciudades');
				if (!response.ok) {
					throw new Error('Error al obtener datos desde JSON');
				}
				const resp = await response.json();
				if (resp) {
					return resp;
				}
				return [];
			} catch (error) {
				console.error('Error al obtener datos desde JSON:', error);
				throw error;
			}
		}

		async function guardarTokenPago(token){
			localStorage.setItem('x-token-suscripcion', token);
			return localStorage.getItem('x-token-suscripcion');
		}

		function buscarPaquete(id) {
			for (let i = 0; i < productos.length; i++) {
				for (let x = 0; x < productos[i].planes.length; x++) {
					if (id === productos[i].planes[x].id) {
						return productos[i].planes[x]
					}
				}
			}
			return null;
		}

		function htmlTemplatePrice(precio, precioPromo) {
			precio = parseFloat(precio).toFixed(2);

			if (precioPromo > 0) {
				precioPromo = parseFloat(precioPromo).toFixed(2);
				return `<div class="precio-promo-content"><div class="precio-normal">${precio}</div><div class="precio-promo">${precioPromo}</div></div>`;
			} else {
				return precio;
			}
		}

		function htmlTemplatePriceCard(precio, precioPromo) {
			precio = parseFloat(precio).toFixed(2);
			if (precioPromo > 0) {
				precioPromo = parseFloat(precioPromo).toFixed(2);
				var save = (100 - ((precioPromo * 100) / precio)).toFixed(2)
				return `<div class="precio-promo-content">
					<div class="precio-normal mb-2">
						<div class="price_currency">$ ${precio}</div>
						<div class="save_price">Ahorre ${save} %</div>
					</div>
					<div class="precio-promo">$${precioPromo}</div>
				</div>`;
			} else {
				return "$" + precio;
			}
		}

		function URLParams() {
			if (new URLSearchParams(window.location.search).get('paquete')) {
				const valueParam = new URLSearchParams(window.location.search).get('paquete');
				detallesPaquete(valueParam.split("?")[0]);
			} else {
				if (localStorage.getItem('planId_paquete')) {
					detallesPaquete(localStorage.getItem('planId_paquete'));
				}

			}
		}

		function templatePlanes(producto, plan, descripcionHtml) {
			const imgPreder = "https://estadisticas.ecuavisa.com/sites/gestor/assets-rd/ecuavisayellow.jpg";
			return `<div class="col-12 col-md-4 col-lg-4 col-xl-4">
        <div class="card shadow-none" style="" data-producto='${JSON.stringify(producto)}'>
          <div class="card-body">
            <h5 class="card-title">${plan.nombre_plan}</h5>
            <h5 class="plan_precio">
              <span class="span_">${htmlTemplatePriceCard(plan.precio, plan.precio_promocional)}</span>
              <span>/${plan.frecuencia}</span>
            </h5>
            <div class="btn boton_sus" data-id="${plan.id}" data-plan='${JSON.stringify(plan)}'>Suscríbete</div>

            <img src="${plan.url_imagen ? plan.url_imagen : imgPreder}" alt="Ecuavisa">
            
            <hr class="hr-planes">
            <div class="plan_grupos">
            	<div class="h4 pb-2">Características principales</div>
              <ul class="caracteristicas-card p-0">
              	${descripcionHtml}
              </ul>
            </div>
          </div>
          <div class="card-footer text-muted">
            <p>${plan.condiciones}</p>
          </div>
        </div>
      </div>`;
		}

		function slug(text) {
			return text
				.toLowerCase()
				.replace(/ /g, '-')  // Reemplazar espacios por guiones
				.replace(/[^\w-]+/g, '')  // Eliminar caracteres especiales
				.replace(/--+/g, '-')  // Reemplazar múltiples guiones por uno solo
				.replace(/^-+|-+$/g, '');  // Eliminar guiones al principio y al final
		}

		function cabeceraTabTemplate() {
			var data = productos;

			var html = `<ul class="nav nav-pills mb-3 d-flex justify-content-center gap-3" id="pills-tab" role="tablist">`;
			for (var i in data) {
				html += `<li class="nav-item" role="presentation">
							    <button class="nav-link ${(i == 0 ? "active" : "")}" id="pills-${slug(data[i].nombre)}-tab" data-bs-toggle="pill" data-bs-target="#pills-${slug(data[i].nombre)}" type="button" role="tab" aria-controls="pills-${slug(data[i].nombre)}" aria-selected="true">${data[i].nombre}</button>
							  </li>`;
			}
			html += `</ul>`;
			return html;
		}

		function removerDatos(){
			document.querySelector(".bc_input").value = "";
			document.querySelector(".bloque_cupon").style.display = "none";
			var text = document.querySelector(".mensaje-text-cupon");
			text.classList.remove("valid-feedback");
			text.classList.remove("invalid-feedback");
			text.classList.remove("show");
		}

		function contentTabTemplate() {
			var data = productos;
			var html = `<div class="tab-content container" id="pills-tabContent">`;
			for (var i in data) {
				const planes = data[i].planes;
				html += `<div class="tab-pane fade ${(i == 0 ? "show active" : "")}" id="pills-${slug(data[i].nombre)}" role="tabpanel" aria-labelledby="pills-${slug(data[i].nombre)}-tab">`;
				html += `<div class="row  d-flex justify-content-center">`;
				planes.forEach(plan => {
					const descripcionHtml = plan.descripcion.map(item => `<li class="icono">${item}</li>`).join('');
					html += templatePlanes(data[i], plan, descripcionHtml);
				});
				html += `</div>`;
				html += `</div>`;
			}
			html += `</div>`;
			return html;
		}

		function templateBeneficios(beneficios) {
			return `<div class="item-beneficio">
                <div class="icon-beneficio">
                  <svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>check-all</title>
                    <path d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z"></path>
                  </svg>
                </div>
                <div class="caracteristica-beneficio">
                  ${beneficios}
                </div>
              </div>`;
		}

		//INICIO DE ACTUALZIAR DATA
		async function actualizarDatos(){
			document.querySelector('.title-plan').innerHTML = paqueteJSON.nombre;
			document.querySelector('.price-detaill .valor').innerHTML = htmlTemplatePrice(paqueteJSON.precio_normal, paqueteJSON.precio_descuento);
			document.querySelector('.price-detaill .frecuencia').innerHTML = `/${paqueteJSON.frecuencia}`;
			document.querySelector('.beneficios-list').innerHTML = "";
			paqueteJSON.beneficios.forEach(benefcio => {
				document.querySelector('.beneficios-list').innerHTML += templateBeneficios(benefcio);
			});

			//

			var total_finish = document.querySelector(".total-precio");
			var htmlTotal = ``;
			var totalValor = paqueteJSON.precio_normal;
			var precioPromo = paqueteJSON.precio_descuento;
			var precio = paqueteJSON.precio_normal;

			if (parseInt(precioPromo) != 0 && precioPromo != "" && precioPromo != null) {

				var save = (100 - ((precioPromo * 100) / precio)).toFixed(2)
				htmlTotal += `<div class="row-precios">`;
				htmlTotal += `<div class="column-precio">`;
				htmlTotal += `Descuento - ${save}%`;
				htmlTotal += `</div>`;
				htmlTotal += `<div class="column-precio valor">`;
				htmlTotal += `-$${precio - precioPromo}`;
				htmlTotal += `</div>`;
				htmlTotal += `</div>`;
				htmlTotal += `<hr class="precio-hr">`;
				totalValor = precioPromo;

			}

			if(paqueteJSON.descuentos.length > 0){
				for(var i in paqueteJSON.descuentos){
					var descuento = paqueteJSON.descuentos[i];
					htmlTotal += `<div class="row-precios">`;
					htmlTotal += `<div class="column-precio">`;
					htmlTotal += `Descuento, cupón - ${descuento.descuento_porcentaje}%`;
					htmlTotal += `</div>`;
					htmlTotal += `<div class="column-precio valor">`;
					htmlTotal += `-$${descuento.valor_cupon}`;
					htmlTotal += `</div>`;
					htmlTotal += `</div>`;
					htmlTotal += `<hr class="precio-hr">`;
				}

				totalValor = descuento.nuevo_valor;
			}


			htmlTotal += `<div class="row-precios">`;
			htmlTotal += `<div class="column-precio total">`;
			htmlTotal += `Total`;
			htmlTotal += `</div>`;
			htmlTotal += `<div class="column-precio valor">`;

			if (parseInt(precioPromo) != 0 && precioPromo != "" && precioPromo != null) {
				htmlTotal += `<div class="precio-normal-t">`;
				htmlTotal += `$${precio}`;
				htmlTotal += `</div>`;
				totalValor = precioPromo;
			}

			htmlTotal += `<div class="precio-promo-t">`;
			htmlTotal += `$${totalValor}`;
			htmlTotal += `</div>`;
			htmlTotal += `</div>`;
			htmlTotal += `</div>`;
			total_finish.innerHTML = htmlTotal;

			paqueteJSON.precio_final = totalValor;
		}
		//FIN DE ACTUALZIAR DATA

		const dataPlanes = await cargarNombresYPlanes();
		const dataPaisesCiudades = await cargarPaisesYCiudad();
		const productos = await dataPlanes.data;
		const x_Token = await guardarTokenPago(await dataPlanes.token);

		// Obtener referencias a los elementos del DOM
		const toggleCupon = document.getElementById("toggleCupon");
		const inputText = document.getElementById("inputText");

		const botonAplicarCupon = document.querySelector('.bc_aplicar');
		const inputAplicarCupon = document.querySelector('.bc_input');

		if (botonAplicarCupon) {
			botonAplicarCupon.addEventListener("click", async function () {
				if (inputAplicarCupon.value.length != 0) {
					const textCupon = inputAplicarCupon.value;

					//agregar el un nuevo parametro al url actual
					// var urlHREF = window.location.href;
					// if (urlHREF.indexOf('?') === -1) { urlHREF += '?'; } else { urlHREF += '&'; }
					// urlHREF += 'usocupon=true';
					// window.history.pushState({ path: urlHREF }, '', urlHREF);

					//enviar el cupo por el metodo post
					const planId = localStorage.getItem('planId_paquete');
					// console.log(planId);
					document.querySelector(".wizard-content").classList.add("disabled-content");
					fetch("https://ecuavisa-suscripciones.vercel.app/cupon/validar/usuario", {
						method: 'POST',
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({      
						    "userId": parseInt(ECUAVISA_EC.USER_data("id")),
						    "codigoCupon": textCupon,
						    // "paqueteJSON" : parseFloat(paqueteJSON.precio_final),
						    "paquete": paqueteJSON.idpaquete,
						    "country" : paqueteJSON.location.country,
						    "valorInicial" : paqueteJSON.precio_final,
						    "city": paqueteJSON.location.city
						}),
						redirect: 'follow'
					}).then(response => response.json())
						.then(result => {
							console.log(result);
							paqueteJSON.descuentos = [];
							if(document.querySelector(".mensaje-text-cupon")){
								var text = document.querySelector(".mensaje-text-cupon");
								text.classList.remove("valid-feedback");
								text.classList.remove("invalid-feedback");
								text.classList.remove("show");

								var continuar = false;
								if(result.resp){
									if(result.data.cambiar_precio_otros){
										if(paqueteJSON.esta_descuento){
											continuar = true;
											paqueteJSON.descuentos.push(result.data);
										}
										text.innerHTML = `Tu cupón fue insertado con éxito`;
										text.classList.add("valid-feedback");

									}else{
										//
										if(paqueteJSON.esta_descuento){
											text.innerHTML = `Cupón insertado no válido, el paquete ya se encuentra en oferta.`;
											text.classList.add("invalid-feedback");
											continuar = false;
										}else{
											text.innerHTML = `Cupón insertado aceptado.`;
											text.classList.add("valid-feedback");
											continuar = true;
											paqueteJSON.descuentos.push(result.data);
										}
									}

								}else{
									text.innerHTML = `Cupón insertado no válido`;
									text.classList.add("invalid-feedback");
									continuar = false;
								}

								text.classList.add("show");
							}

							paqueteJSON.cupon = textCupon;
							actualizarDatos();
							document.querySelector(".wizard-content").classList.remove("disabled-content");
						}).catch(error => {
							console.log(error);
							document.querySelector(".wizard-content").classList.remove("disabled-content");
						});
				}
			});
		}

		toggleCupon.addEventListener("click", function () {
			if (inputText.style.display === "none" || inputText.style.display === "") {
				inputText.style.display = "flex";
			} else {
				inputText.style.display = "none";
			}
		});

		paqueteJSON.opcion_pago = parseInt(document.querySelectorAll('.pago-list .btn.active').value || 1);

		var modalPaqueteID = document.getElementById('modalPaqueteHtml');
		var modalPaquete = new bootstrap.Modal(modalPaqueteID, {
			keyboard: false,
			backdrop: 'static'
		});

		modalPaqueteID.addEventListener('hidden.bs.modal', function (event) {
			var urlActual = window.location.href;
			var url = new URL(urlActual);
			url.searchParams.delete("paquete");
			url.searchParams.delete("usocupon");
			paqueteJSON.descuentos = [];
			//POJJO
			window.history.replaceState({}, document.title, url.toString());
			contentgracias_btn.classList.add('d-none');
			localStorage.removeItem("planId_paquete");
			wizard.reset();
			removerDatos();
		})

		modalPaqueteID.addEventListener('show.bs.modal', function (event) {
			document.querySelector(`#formWizard`).classList.remove('d-none');
			document.querySelector(".item-pago button[value='2']").setAttribute("disabled", "true");
			removerDatos();
			setTimeout(() => {
				var bg = document.querySelector(".modal-backdrop");
				bg.style.backgroundColor = "#e8ebf4";
				bg.style.opacity = "1";
			}, 200);
		})

		await armarPlanes();

		async function detallesPaquete(id) {
			planId = id;
			localStorage.setItem('planId_paquete', id);

			const planData = buscarPaquete(id);
			var nombrePlan = planData.nombre_plan;
			var precio = parseFloat(planData.precio || 0).toFixed(2);
			var precioPromo = parseFloat(planData.precio_promocional || 0).toFixed(2);
			var frecuencia = planData.frecuencia;

			localStorage.setItem('PlanID', planData.id);
			const classPLanSelect = document.querySelector('.plan_Select_id');
			if (classPLanSelect) {
				classPLanSelect.innerHTML = nombrePlan
			}

			paqueteJSON.idpaquete = id;
			paqueteJSON.nombre = nombrePlan;
			paqueteJSON.precio_normal = precio;
			paqueteJSON.precio_descuento = precioPromo;
			paqueteJSON.esta_descuento = (precioPromo != 0);
			paqueteJSON.frecuencia = frecuencia;
			paqueteJSON.beneficios = planData.descripcion;
			

			if (ECUAVISA_EC.login()) {
				var usuario = ECUAVISA_EC.USER_data();
				if (document.querySelector("#nombre")) {
					document.querySelector("#nombre").value = usuario.name;
					document.querySelector("#apellidos").value = usuario.lastname;
					document.querySelector('.no-login').style.display = "none";
					document.querySelector('.detalles .login').style.display = "block";
					// Obtén una referencia al botón por su clase
					const button = document.querySelector(".btn-ecuavisa.next");
					// Simula un clic en el botón
					button.click();
				}
			} else {
				document.querySelector('.no-login').style.display = "block";
				document.querySelector('.detalles .login').style.display = "none";
				document.querySelector('#btn-login-ec').href = `https://www.ecuavisa.com/servicios/login/?nextpage=${(window.location.href).split("?")[0]}`;
				wizard.lock();
			}

			await actualizarDatos();
			modalPaquete.show();
		}

		async function armarPlanes() {
			if (productos.length > 0) {
				const tabContent = document.querySelector('.list-card-plans');
				tabContent.innerHTML = ''; // Limpiar contenido anterior

				var tabCabecera = cabeceraTabTemplate();
				var tabContentPlan = contentTabTemplate();
				tabContent.innerHTML = tabCabecera + tabContentPlan;

				const suscribirseButtons = document.querySelectorAll('.btn.boton_sus');
				suscribirseButtons.forEach(button => {
					button.addEventListener('click', () => {
						const planData = JSON.parse(button.getAttribute('data-plan'));
						var varPaquete = planData.id;
						var parametrosURL = new URLSearchParams(window.location.search);
						parametrosURL.set('paquete', varPaquete);
						var urlBase = window.location.href.split('?')[0];
						var nuevaURL = urlBase + '?' + parametrosURL.toString();
						history.replaceState(null, null, nuevaURL);
						detallesPaquete(varPaquete);
					});
				});

				URLParams();
			}
		}

		// Obtén todos los botones dentro del elemento con la clase "pago-list"
		const botonesPago = document.querySelectorAll('.pago-list .btn');
		// Agrega un manejador de eventos "click" a cada botón
		botonesPago.forEach((boton) => {
			boton.addEventListener('click', () => {
				// Elimina la clase "active" de todos los botones
				botonesPago.forEach((b) => {
					b.classList.remove('active');
				});
				// Agrega la clase "active" al botón que se hizo clic
				boton.classList.add('active');
				valorMetodoPago = boton.value;
				paqueteJSON.opcion_pago = boton.value;
			});
		});

		$wz_doc.addEventListener("wz.form.submit", function (e) {
			if (ECUAVISA_EC.login()) {//VERIFICA SI EL USUARIO ESTÁ LOGUEADO
				if (buscarPaquete(planId)) {
					const idUser = ECUAVISA_EC.USER_data().id;
					const idwylexIdObject = ECUAVISA_EC.USER_data().wylexIdObject;
					const load_BTN = document.querySelector(`.btn-ecuavisa.finish`);
					const modal_Load = document.querySelector(`#modalPaqueteHtml`);
					const formWizard_btn = document.querySelector(`#formWizard`);
					const getToken = localStorage.getItem('x-token');

					const user = {
						nombre: document.querySelector(`#nombre`).value || null,
						apellido: document.querySelector(`#apellidos`).value || null,
						cedula: document.querySelector(`#cedula`).value || null,
						pais: document.querySelector(`#pais`).value || null,
						ciudad: document.querySelector(`#ciudad`).value || null,
						direccion: document.querySelector(`#direccion`).value || null,
						telefono: document.querySelector(`#telefono`).value || null
					}

					var jsonSend = {
						"idPaquete": planId,
						"idUsuario": parseInt(idUser),
						"idUsuarioObject": idwylexIdObject,
						"metodoPago": valorMetodoPago,
						"usuario":user
					};

					// console.log(jsonSend)
					load_BTN.setAttribute("disabled", "true");
					modal_Load.setAttribute("disabled", "true");

					var myHeaders = new Headers();
					myHeaders.append("Content-Type", "application/json");
					myHeaders.append("Authorization", "Bearer " + getToken);

					var raw = JSON.stringify(jsonSend);

					var requestOptions = {
						method: 'POST',
						headers: myHeaders,
						body: raw,
						redirect: 'follow'
					};

					fetch("https://ecuavisa-suscripciones.vercel.app/cash/create", requestOptions)
						.then(response => response.json())
						.then(result => {
							console.log(result);
							if (result.resp) {
								contentgracias_btn.classList.add('success');
							} else {
								contentgracias_btn.classList.add('error');
								document.querySelector(".gracias-descripcion").innerHTML = "Se presentó un error: " + result.error;
							}
							// load_BTN.style.opacity = "1";
							load_BTN.removeAttribute("disabled");
							modal_Load.removeAttribute("disabled");
							formWizard_btn.classList.add('d-none');
							contentgracias_btn.classList.remove('d-none');

						}).catch(error => {
							// console.log(result);
							// load_BTN.style.opacity = "1";
							load_BTN.removeAttribute("disabled");
							modal_Load.removeAttribute("disabled");

							formWizard_btn.classList.add('d-none');
							contentgracias_btn.classList.remove('d-none');

							contentgracias_btn.classList.add('error');

							document.querySelector(".gracias-descripcion").innerHTML = "Se presentó un error: " + error;
							// console.log('error', error)
						});

				} else {
					alert("El plan seleccionado no existe")
				}
			} else {
				alert("No estas logueado")
			}

		});

		async function buscarCiudades(p){
			var paises = [];
			var ciudades = [];
			$('#ciudad option').remove();
			$('#ciudad').append(`<option value="">Seleccione su ciudad</option>`);
			for(var i in dataPaisesCiudades){
				const pais = dataPaisesCiudades[i].country;
				if(pais.includes(p)){
					for(var j in dataPaisesCiudades[i].data){
						const ciudad = dataPaisesCiudades[i].data[j].city;
						$('#ciudad').append(`<option value="${ciudad}">${ciudad}</option>`);
					}
				}
				
			}

			$('#ciudad').select2({
					// allowClear: true,
			    theme: "bootstrap-5",
			    width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
			    placeholder: $( this ).data( 'placeholder' )
			});
			// $("#pais").select2('data', {id: 1, text: "sdas"}); 

			return true;
		}

		async function armarSelectPaises(){
			var paises = "";
			var ciudades = "";
			var geoLocal = (ECUAVISA_EC.USER_data("location") == "null" ? ECUAVISA_EC.USER_data("geo") : ECUAVISA_EC.USER_data("location"));

			$('#pais option').remove();
			$('#pais').append(`<option value="">Seleccione su país</option>`);
			for(var i in dataPaisesCiudades){
				const pais = dataPaisesCiudades[i].country;
				$('#pais').append(`<option value="${pais}">${pais}</option>`);
			}

			$('#pais').select2({
					// allowClear: true,
			    theme: "bootstrap-5",
			    width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
			    placeholder: $( this ).data( 'placeholder' )
			});

			$('#ciudad').select2({
					// allowClear: true,
			    theme: "bootstrap-5",
			    width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
			    placeholder: $( this ).data( 'placeholder' )
			});
			// $("#pais").select2('data', {id: 1, text: "sdas"});
			if(geoLocal){
				var jsonGeoLocal = JSON.parse(geoLocal);
				// paises = jsonGeoLocal.country;
				// ciudades = jsonGeoLocal.city;
				setTimeout(function(){
					paqueteJSON.location.country = jsonGeoLocal.country;
					$('#pais').val(jsonGeoLocal.country).trigger("change");
				}, 500);

				setTimeout(function(){
					paqueteJSON.location.city = jsonGeoLocal.city;
					$('#ciudad').val(jsonGeoLocal.city).trigger("change");
				}, 700);
			}
			return true;
		}

		$('#pais').change(function(){
			var pais = $(this).val();
			buscarCiudades(pais);
			paqueteJSON.location.country = pais;
		});

		$('#ciudad').change(function(){
			var ciudad = $(this).val();
			paqueteJSON.location.city = ciudad;
		});

		$wz_doc.addEventListener("wz.error", function (e) {
		  $(`.invalid-feedback`).remove();
		  for(var i in e.detail.target){
		      const field = e.detail.target[i];
		      if(!document.querySelector(`.invalid-feedback.${field.id}`)){
		          $(`#${field.id}`).after(`<div class="show invalid-feedback ${field.id}">Campo requerido. </div>`);
		      }
		      setTimeout(function(){
					    $(`.invalid-feedback`).remove();
					}, 2000);
		  }
		});

		var respSelect = await armarSelectPaises();


	}
})();