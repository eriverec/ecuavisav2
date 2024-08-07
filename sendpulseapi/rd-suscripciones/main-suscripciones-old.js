var productos = [];

var modalPaquete = new bootstrap.Modal(document.getElementById('modalPaqueteHtml'), {
	keyboard: false
})

var modalPaqueteHtml = document.getElementById('modalPaqueteHtml')
modalPaqueteHtml.addEventListener('hidden.bs.modal', function (event) {
	var urlActual = window.location.href;
	var url = new URL(urlActual);
	url.searchParams.delete("paquete");
	window.history.replaceState({}, document.title, url.toString());
})

modalPaqueteHtml.addEventListener('show.bs.modal', function (event) {
	setTimeout(() => {
		var bg = document.querySelector(".modal-backdrop");
		bg.style.backgroundColor = "#e8ebf4";
		bg.style.opacity = "1";
	}, 200);
	// $('.modal-backdrop').css('background', 'red');
})

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

function detallesPaquete(id) {
	const planData = buscarPaquete(id);
	localStorage.setItem('PlanID', planData.id);

	const classPack = document.querySelector('.plan_Select_id');
	classPack.innerHTML = planData.nombre_plan;

	console.log(planData.id);
	console.log(planData.nombre_plan);
	modalPaquete.show();
}

function URLParams() {
	if (new URLSearchParams(window.location.search).get('paquete')) {
		const valueParam = new URLSearchParams(window.location.search).get('paquete');
		detallesPaquete(valueParam);
	}
}


function cargarNombresYPlanes() {
	const loadingElement = document.getElementById('loading');
	loadingElement.style.display = 'block';
	fetch('https://ecuavisa-modulos.vercel.app/paquete/display/all')
		.then(response => response.json())
		.then(data => {
			productos = data.data;
			console.log(productos);
			const resp = data.resp;
			const x_Token = data.token;
			localStorage.setItem('x-token', x_Token);
			if (resp) {
				const nombresProductos = productos.map(producto => producto.nombre);
				nombresProductos.sort((b, a) => b.localeCompare(a));
				const tabContainer = document.querySelector('.tab-container');
				tabContainer.innerHTML = ''; // Limpiar contenido anterior
				URLParams();

				const classNombre = document.querySelector('.data_nombre');
				const classApellido = document.querySelector('.data_apellido');
				const classCorreo = document.querySelector('.data_correo');

				if (classNombre) {
					classNombre.innerHTML = localStorage.getItem('wylexFirstName');
				}
				if (classApellido) {
					classApellido.innerHTML = localStorage.getItem('wylexLastName');
				}
				if (classCorreo) {
					classCorreo.innerHTML = localStorage.getItem('wylexEmail');
				}

				productos.forEach(producto => {
					const productoNombre = producto.nombre;
					const buttonHtml = `
                <button class="tab-button" data-producto="${productoNombre}">${productoNombre}</button>
              `;

				// nombresProductos.forEach(productoNombre => {
				// 	const buttonHtml = `<button class="tab-button" data-producto="${productoNombre}">${productoNombre}</button>`;
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
				loadingElement.style.display = 'none';

			}
		}).catch(error => {
			console.error('Error en la solicitud fetch:', error);
			loadingElement.style.display = 'none';
		});
}

function cargarPlanes(producto, productos) {
	const productoData = productos.find(item => item.nombre === producto);
	const imgPreder = "https://estadisticas.ecuavisa.com/sites/gestor/assets-rd/ecuavisayellow.jpg"
	if (productoData) {
		const planes = productoData.planes;
		const tabContent = document.querySelector('.list-card-plans');
		tabContent.innerHTML = ''; // Limpiar contenido anterior



		planes.forEach(plan => {
			const descripcionHtml = plan.descripcion.map(item => `<li class="icono">${item}</li>`).join('');

			const planHtml = `
          <div class="tab card" style="width: 18rem;" data-producto="${producto}">
            <div class="card-body">
              <h5 class="card-title">${plan.nombre_plan}</h5>
              <h5 class="plan_precio">
                <span class="span_">$${plan.precio}</span>
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
			tabContent.innerHTML += planHtml;

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


		const realizarCompra = document.querySelectorAll('.wizard-btn.btn.btn-ecuavisa.finish');
		realizarCompra.forEach(button => {
			button.addEventListener('click', () => {
				// const planId = button.getAttribute('data-id');
				const planId = localStorage.getItem('PlanID');
				const idEcuavisa = ECUAVISA_EC.USER_data().id;
				const idwylexIdObject = ECUAVISA_EC.USER_data().wylexIdObject;
				const load_BTN = document.querySelector(`.btn.boton_sus[data-id='${planId}']`);
				const getToken = localStorage.getItem('x-token');
				// load_BTN.style.opacity = "0.4";
				console.log('Plan ID:', planId, idEcuavisa, idwylexIdObject);

				// fetch("https://ecuavisa-suscripciones.vercel.app/cash/create", {
				// 	method: 'POST',
				// 	headers: {
				// 		'Authorization': 'Bearer ' + getToken,
				// 		'Content-Type': 'application/json'
				// 	},
				// 	body: JSON.stringify({
				// 		"idPaquete": planId,
				// 		"idUsuario": idEcuavisa,
				// 		"idUsuarioObject": idwylexIdObject,
				// 		"metodoPago": "1"
				// 	}),
				// 	redirect: 'follow'
				// })
				// 	.then(response => response.json())
				// 	.then(result => {
				// 		console.log(result);
				// 		load_BTN.style.opacity = "1";
				// 	})
				// 	.catch(error => {
				// 		console.log('error', error);
				// 		load_BTN.style.opacity = "1";
				// 	});

			});
		});


		const suscribirseButtons = document.querySelectorAll('.btn.boton_sus');
		suscribirseButtons.forEach(button => {
			button.addEventListener('click', () => {

				if (ECUAVISA_EC.login()) {
					console.log("estas logueado");
					const classNombre = document.querySelector('.data_nombre');
					const classApellido = document.querySelector('.data_apellido');
					const classCorreo = document.querySelector('.data_correo');

					if (classNombre) {
						classNombre.innerHTML = localStorage.getItem('wylexFirstName');
					}
					if (classApellido) {
						classApellido.innerHTML = localStorage.getItem('wylexLastName');
					}
					if (classCorreo) {
						classCorreo.innerHTML = localStorage.getItem('wylexEmail');
					}
				} else {
					console.log("no estas logueado");
					setTimeout(() => {
						const gru = document.querySelector('.form-group');
						gru.innerHTML = `
						<span>Debes iniciar sesion</span> <br>
						<a href="https://www.ecuavisa.com/servicios/login/?nextpage=${window.location.href}" class="btn btn-secondary html_Login" onclick="">Login</a>
					`;
					}, 200);

				}

				const planData = JSON.parse(button.getAttribute('data-plan'));
				var varPaquete = planData.id;
				var parametrosURL = new URLSearchParams(window.location.search);
				parametrosURL.set('paquete', varPaquete);
				var urlBase = window.location.href.split('?')[0];
				var nuevaURL = urlBase + '?' + parametrosURL.toString();
				history.replaceState(null, null, nuevaURL);
				detallesPaquete(varPaquete);


				const classPLanSelect = document.querySelector('.plan_Select_id');
				if (classPLanSelect) {
					classPLanSelect.innerHTML = planData.nombre_plan
				}

				// Construir el contenido dinámico del modal utilizando una plantilla de cadena
				// const modalContent = `${planData.nombre_plan}`;
			});
		});

	}
}
// Cargar los nombres de los productos y los planes
setTimeout(() => {
	cargarNombresYPlanes();
}, 300);