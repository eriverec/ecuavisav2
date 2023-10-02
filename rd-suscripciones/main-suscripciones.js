(async () => {
	if(ECUAVISA_EC){
		async function cargarNombresYPlanes() {
			const loadingElement = document.getElementById('loading');
			loadingElement.style.display = 'block';
			try {
		    const response = await fetch('https://ecuavisa-modulos.vercel.app/paquete/display/all');
		    if (!response.ok) {
		      throw new Error('Error al obtener datos desde JSON');
		    }
		    const resp = await response.json();
		    if(resp.resp){
		    	return resp;
		    }
		    return [];
		  } catch (error) {
		    console.error('Error al obtener datos desde JSON:', error);
		    throw error;
		  }
			loadingElement.style.display = 'none';
		}

		let dataPlanes = await cargarNombresYPlanes();
		let productos = await dataPlanes.data;
		let planId = "";
		let x_Token = await dataPlanes.token;
		let valorMetodoPago = document.querySelectorAll('.pago-list .btn.atice').value || 1;
		localStorage.setItem('x-token', x_Token);

		async function armarPlanes(){
			if(productos.length > 0){
				const tabContainer = document.querySelector('.tab-container');
				tabContainer.innerHTML = ''; // Limpiar contenido anterior

				productos.forEach(producto => {
					const productoNombre = producto.nombre;
					const buttonHtml = `
                <button class="tab-button" data-producto="${productoNombre}">${productoNombre}</button>`;

					tabContainer.innerHTML += buttonHtml;
				});

				// Evento click para cambiar de producto
				const tabButtons = document.querySelectorAll('.tab-button');
				tabButtons.forEach(button => {
					button.addEventListener('click', () => {
						const producto = button.getAttribute('data-producto');
						cargarPlanes(producto, productos);
						// Cambiar clase activa
						tabButtons.forEach(btn => btn.classList.remove('active-button'));
						button.classList.add('active-button');
					});
				});

				// Cargar los planes del primer producto por defecto
				if (productos.length > 0) {
					cargarPlanes(productos[0].nombre, productos);
					tabButtons[0].classList.add('active-button');
				}
				URLParams();
			}
		}

		/*Inicio de modal*/
		var modalPaqueteID = document.getElementById('modalPaqueteHtml');
		var modalPaquete = new bootstrap.Modal(modalPaqueteID, {
			keyboard: true
		});

		modalPaqueteID.addEventListener('hidden.bs.modal', function (event) {
			var urlActual = window.location.href;
			var url = new URL(urlActual);
			url.searchParams.delete("paquete");
			window.history.replaceState({}, document.title, url.toString());
		})

		modalPaqueteID.addEventListener('show.bs.modal', function (event) {
			setTimeout(() => {
				var bg = document.querySelector(".modal-backdrop");
				bg.style.backgroundColor = "#e8ebf4";
				bg.style.opacity = "1";
			}, 200);
		})
		/*Fin de modal*/

		await armarPlanes();

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

		function htmlTemplatePrice(precio, precioPromo){
			precio = parseFloat(precio).toFixed(2);

			if(precioPromo > 0){
				precioPromo = parseFloat(precioPromo).toFixed(2);
				return `<div class="precio-promo-content"><div class="precio-normal">${precio}</div><div class="precio-promo">${precioPromo}</div></div>`;
			}else{
				return precio;
			}
		}

		function detallesPaquete(id) {
			planId = id;
			const planData = buscarPaquete(id);
			var nombrePlan = planData.nombre_plan;
			var precio = parseFloat(planData.precio || 0).toFixed(2);
			var precioPromo = parseFloat(planData.precio_promocional || 0).toFixed(2);
			// console.log(precioPromo)
			var frecuencia = planData.frecuencia;

			localStorage.setItem('PlanID', planData.id);
			const classPLanSelect = document.querySelector('.plan_Select_id');
			if (classPLanSelect) {
				classPLanSelect.innerHTML = nombrePlan
			}

			document.querySelector('.title-plan').innerHTML = nombrePlan;
			document.querySelector('.price-detaill .valor').innerHTML = htmlTemplatePrice(precio, precioPromo);
			document.querySelector('.price-detaill .frecuencia').innerHTML = `/${frecuencia}`;
			document.querySelector('.beneficios-list').innerHTML = "";
			planData.descripcion.forEach(benefcio => {
				document.querySelector('.beneficios-list').innerHTML += templateBeneficios(benefcio);
			});

			if (ECUAVISA_EC.login()) {
				var usuario = ECUAVISA_EC.USER_data();
				if(document.querySelector("#nombre")){
					document.querySelector("#nombre").value = usuario.name;
					document.querySelector("#apellidos").value = usuario.lastname;
				}
			} else {
				const gru = document.querySelector('.form-group');
				gru.innerHTML = `
				<span>Debes iniciar sesion</span> <br>
				<a href="https://www.ecuavisa.com/servicios/login/?nextpage=${window.location.href}" class="btn btn-secondary html_Login" onclick="">Login</a>`;
			}
			modalPaquete.show();
		}

		function URLParams() {
			if (new URLSearchParams(window.location.search).get('paquete')) {
				const valueParam = new URLSearchParams(window.location.search).get('paquete');
				detallesPaquete(valueParam);
			}
		}

		function templatePlanes(producto, plan, descripcionHtml){
			const imgPreder = "https://estadisticas.ecuavisa.com/sites/gestor/assets-rd/ecuavisayellow.jpg";
			return `
        <div class="tab card" style="width: 18rem;" data-producto="${producto}">
          <div class="card-body">
            <h5 class="card-title">${plan.nombre_plan}</h5>
            <h5 class="plan_precio">
              <span class="span_">$${htmlTemplatePrice(plan.precio, plan.precio_promocional)}</span>
              <span>/${plan.frecuencia}</span>
            </h5>
            <div class="btn boton_sus" data-id="${plan.id}" data-plan='${JSON.stringify(plan)}'>Suscríbete</div>

            <img src="${plan.url_imagen ? plan.url_imagen : imgPreder}" alt="Ecuavisa">
            <div class="plan_grupos">
              ${descripcionHtml}
            </div>
          </div>
          <div class="card-footer text-muted">
            <p>${plan.condiciones}</p>
          </div>
        </div>
      `;
		}

		function templateBeneficios(beneficios){
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

		function cargarPlanes(producto, productos) {
			const productoData = productos.find(item => item.nombre === producto);
			if (productoData) {
				const planes = productoData.planes;
				const tabContent = document.querySelector('.list-card-plans');
				tabContent.innerHTML = ''; // Limpiar contenido anterior

				planes.forEach(plan => {
					const descripcionHtml = plan.descripcion.map(item => `<li class="icono">${item}</li>`).join('');
					tabContent.innerHTML += templatePlanes(producto, plan, descripcionHtml);
				});

				// Ocultar todas las tabs
				const tabs = document.querySelectorAll('.tab');
				tabs.forEach(tab => {
					tab.style.display = 'none';
				});

				// Mostrar solo la tab del producto seleccionado
				const tabToShow = document.querySelectorAll(`.tab[data-producto="${producto}"]`);
				tabToShow.forEach(tabTo => {
					tabTo.style.display = 'flex';
				});

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
		  });
		});

		$wz_doc.addEventListener("wz.form.submit", function (e) {
		  if(ECUAVISA_EC.login()){//VERIFICA SI EL USUARIO ESTÁ LOGUEADO
		  	if(buscarPaquete(planId)){
					const idUser = ECUAVISA_EC.USER_data().id;
					const idwylexIdObject = ECUAVISA_EC.USER_data().wylexIdObject;
					const load_BTN = document.querySelector(`.btn-ecuavisa.finish`);
					const modal_Load = document.querySelector(`#modalPaqueteHtml`);
					const getToken = localStorage.getItem('x-token');

					var jsonSend = {
						"idPaquete": planId,
				    "idUsuario": parseInt(idUser),
				    "idUsuarioObject": idwylexIdObject,
						"metodoPago" : valorMetodoPago
					};

					// console.log(jsonSend)
					load_BTN.setAttribute("disabled", "true");
					modal_Load.setAttribute("disabled", "true");

					var myHeaders = new Headers();
					myHeaders.append("Content-Type", "application/json");
					myHeaders.append("Authorization", "Bearer "+getToken);

					var raw = JSON.stringify(jsonSend);

					var requestOptions = {
					  method: 'POST',
					  headers: myHeaders,
					  body: raw,
					  redirect: 'follow'
					};

					fetch("https://ecuavisa-suscripciones.vercel.app/cash/create", requestOptions)
					  .then(response => response.text())
					  .then(result => {
					  	console.log(result);
							// load_BTN.style.opacity = "1";
							load_BTN.removeAttribute("disabled");
							modal_Load.removeAttribute("disabled");
					  }).catch(error => {
					  	console.log(result);
							// load_BTN.style.opacity = "1";
							load_BTN.removeAttribute("disabled");
							modal_Load.removeAttribute("disabled");
							console.log('error', error)
					  });

		  	}else{
		  		alert("El plan seleccionado no existe")
		  	}
		  }else{
		  	alert("No estas logueado")
		  }

		});

	}
})();