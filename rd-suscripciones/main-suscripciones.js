function cargarNombresYPlanes() {
	const loadingElement = document.getElementById('loading');
	loadingElement.style.display = 'block';
	fetch('https://ecuavisa-pricing.vercel.app/pricing/get/all/producto')
		.then(response => response.json())
		.then(data => {
			const productos = data.data;
			const resp = data.resp;
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
              <a href="#" class="btn boton_sus">Suscríbete</a>
              <img src="${plan.url_imagen}" alt="Ecuavisa">
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
	}
}
// Cargar los nombres de los productos y los planes
setTimeout(() => {
	cargarNombresYPlanes();
}, 300);