var calidad = document.getElementById('calidad');
var zip = new JSZip(); //Generar el archivo zip

//Aquí se comprime la imagen. Se recibe el archivo y la calidad
const comprimirImagen = (imagenComoArchivo, porcentajeCalidad) => {
	return new Promise((resolve, reject) => {
		//Crear elemento canvas
		const canvas = document.createElement("canvas");
		const nva_imagen = new Image(); //Crear una nueva imagen

		nva_imagen.onload = ()=>{
			//La imagen es cargada en el canvas,
			canvas.width = nva_imagen.width;
			canvas.height = nva_imagen.height;
			canvas.getContext("2d").drawImage(nva_imagen, 0, 0);
			//elemento.toBlob, recibe el elemento canvas y la calidad para devolver el archivo blob con la compresión aplicada. Sintaxis elemento.toBlob(callback, type, quality)
			canvas.toBlob((blob) => {
				blob === null ? reject(blob) : resolve(blob);
			},
			"image/jpeg",
			porcentajeCalidad / 100
		);
	}

	//La fuente src de la nueva imagen representa la URL (objeto file) ligada al documento DOM de la ventana actual
	nva_imagen.src = URL.createObjectURL(imagenComoArchivo);
});
}

//Se lee el evento clic del botón comprimir
document.getElementById('btn_comprimir').addEventListener("click",
async () => {
	var img_comp = document.getElementById('f_subir').files;

	//Verificar que el array de files contenga imagenes
	if (img_comp.length <= 0) {
		alert("Debe cargar un archivo.") //No hay imagenes, mostrar error
		return
	}

	for (var i = 0; i < img_comp.length; i++) {
		const imgtocompress = img_comp[i];
		// console.log(img_comp[i].name);//Mostrar nombre de archivo en la consola
		const blob = await comprimirImagen(imgtocompress, parseInt(calidad.value));

		//Agregar un archivo al archivo ZIP
		zip.file(img_comp[i].name, blob, {base64: true});

		//Mostrar imagen con compresión aplicada, descomentar para visualizar
		// let vista_previa = document.getElementById('vista_previa_02'),
		// img_vp = document.createElement('img');
		// img_vp.classList = "img-thumbnail";
		// img_vp.src = URL.createObjectURL(blob);
		// vista_previa.innerHTML = '';
		// vista_previa.append(img_vp);
		// document.getElementById('div_comp02').classList.remove("d-none");
		// document.getElementById('div_comp02').classList.add("d-block");

		mostrar_descargar(URL.createObjectURL(blob), imgtocompress.name);

	}

	//Descarga automatica del archivo zip.
	//Se lee el URI del archivo zip generado.
	const _blob = await zip.generateAsync({type:"blob"});
	//Crear un elemento tipo anchor (link a)
	const nvo_link = document.createElement("a");
	nvo_link.setAttribute("href", window.URL.createObjectURL(_blob));
	nvo_link.setAttribute("download", "mis_img_zip.zip");
	nvo_link.style.display = "none";
	// Agregar elemento creado al DOM
	document.body.appendChild(nvo_link);
	nvo_link.click(); // Ejecutar el clic al elemento agregado al DOM
	document.body.removeChild(nvo_link); //Se ejecuta, luego se elimina

	//Mostrar el icono descargar
	mostrar_icono_descargar_zip(URL.createObjectURL(_blob));
});

function mostrar_descargar(url, nombre_div) {
	//Mostrar un link de descarga por cada imagen comprimida
	const agregar_icono = document.getElementById(nombre_div);
	let div_icono = document.createElement("div");
	let icono_desc = document.createElement("a");
	icono_desc.innerHTML = "Descargar IMG Comprimida";
	div_icono.id = nombre_div;
	icono_desc.href = url;
	icono_desc.download = "Imagen_comprimida.jpg";
	agregar_icono.append(div_icono);
	div_icono.append(icono_desc);
	// document.getElementById('div_desc').classList.remove("d-none");
	// document.getElementById('div_desc').classList.add("d-block");
}

function mostrar_icono_descargar_zip(url) {
	//Muestra el botón descargar archivo ZIP al final de las imagenes
	const icono_desc = document.getElementById("btn_descargar");
	icono_desc.href = url;
	icono_desc.download = "mis_img_zip.zip";
	document.getElementById('div_desc').classList.remove("d-none");
	document.getElementById('div_desc').classList.add("d-block");
}

function abrir_exp_foto() {
	//Al dar clir sobre el icono se abre el explorador de archivos.
	document.getElementById('f_subir').click();
}

function mostrar_valor_calidad() {
	//Al cambiar o deslizar el elemento input range se muestra la calidad debajo
	document.getElementById('valor_calidad').innerHTML = "CALIDAD " + calidad.value + " Deslice para cambiar.";
}

function obtener_vista_previa(){
	//Obtener la vista previa al seleccionar imagen o imagenes
	var img_comp = document.getElementById('f_subir').files;

	//Recorrer el array de imagenes
	for (let i = 0; i < img_comp.length; i++) {
		let reader = new FileReader();
		reader.readAsDataURL(img_comp[i]);

		reader.onload = function(){
			//Vista previa, es el div, principal de las vistas miniatura
			let vista_previa = document.getElementById('vista_previa');
			let img_vp = document.createElement('img'); // img_vp es la imagen a mostrar
			//nvo_div, elemento a agregar en vista_previa, div principal
			let nvo_div = document.createElement('div');
			let nombre_div = document.createElement('div');
			nombre_div.id = img_comp[i].name;
			img_vp.classList = "img-thumbnail"; //Clase en miniatura para la imagen
			img_vp.src = reader.result; // Se lee la imagen desde archivos temporales
			vista_previa.append(nvo_div); // Agregar el nuevo div.
			nvo_div.append(img_vp); // Agregar la nueva imagen al div agregado
			nombre_div.append("Archivo: " + img_comp[i].name); //Agregar nombre
			nvo_div.append(nombre_div); //Agregar nombre
			document.getElementById('div_comp').classList.remove("d-none");
			document.getElementById('div_comp').classList.add("d-block");
		}
	}
}

//Más información en:
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
//https://developer.mozilla.org/es/docs/Web/API/URL/createObjectURL
