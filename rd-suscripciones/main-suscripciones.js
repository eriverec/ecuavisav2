function cargarNombresYPlanes() {
	const loadingElement = document.getElementById('loading');
	loadingElement.style.display = 'block';
	fetch('https://ecuavisa-modulos.vercel.app/paquete/display/all')
		.then(response => response.json())
		.then(data => {
			const productos = data.data;
			const resp = data.resp;
			const x_Token = data.token;
			localStorage.setItem('x-token', x_Token);
			// console.log(x_Token);
			if (resp) {
				const tabContainer = document.querySelector('.tab-container');
				tabContainer.innerHTML = ''; // Limpiar contenido anterior

				productos.forEach(producto => {
					const productoNombre = producto.nombre;
					const buttonHtml = `
                <button class="tab-button" data-producto="${productoNombre}">${productoNombre}</button>
              `;
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
              <div class="btn boton_sus" data-id="${plan.id}">Suscríbete</div>
              <img src="${plan.url_imagen ? imgPreder : plan.url_imagen}" alt="Ecuavisa">
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


		// Evento click para la suscripción
		const susButtons = document.querySelectorAll('.boton_sus');
		susButtons.forEach(button => {
			button.addEventListener('click', () => {

				if (ECUAVISA_EC.login()) {
					console.log("estas logueado");
					const planId = button.getAttribute('data-id');
					const idEcuavisa = ECUAVISA_EC.USER_data().id;
					const idwylexIdObject = ECUAVISA_EC.USER_data().wylexIdObject;
					const load_BTN = document.querySelector(`.btn.boton_sus[data-id='${planId}']`);
					const getToken = localStorage.getItem('x-token');
					load_BTN.style.opacity = "0.4";
					console.log('Plan ID:', planId, idEcuavisa, idwylexIdObject);

					fetch("https://ecuavisa-suscripciones.vercel.app/cash/create", {
						method: 'POST',
						headers: {
							'x-auth-token': getToken,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							"idPaquete": planId,
							"idUsuario": idEcuavisa,
							"idUsuarioObject": idwylexIdObject,
							"metodoPago": "1"
						}),
						redirect: 'follow'
					})
						.then(response => response.json())
						.then(result => {
							console.log(result);
							load_BTN.style.opacity = "1";
						})
						.catch(error => {
							console.log('error', error);
							load_BTN.style.opacity = "1";
						});
				} else {
					console.log("no estas logueado");
					redireccionAlLogin();
				}
			});
		});

	}
}
// Cargar los nombres de los productos y los planes
setTimeout(() => {
	cargarNombresYPlanes();
}, 300);