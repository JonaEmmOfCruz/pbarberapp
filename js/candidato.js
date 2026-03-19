// Menú móvil
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Cerrar menú
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});


// Mostrar mensajes
function showMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');

    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;

        messageDiv.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
        }, 5000);
    }
}


// Procesar días seleccionados
function processSelectedDays(selectElement) {
    return Array.from(selectElement.selectedOptions)
        .map(opt => opt.value)
        .join(', ');
}


// Validar archivos
function validateFiles(formData) {

    const maxSize = 5 * 1024 * 1024;

    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf'
    ];

    const fileFields = [
        'identificacion',
        'curp',
        'comprobante_domicilio',
        'certificados',
        'foto_perfil',
        'portafolio'
    ];

    for (let field of fileFields) {

        const files = formData.getAll(field);

        for (let file of files) {

            if (file && file.size > 0) {

                if (file.size > maxSize) {
                    throw new Error(`El archivo ${file.name} excede 5MB`);
                }

                let fileType = file.type.toLowerCase();

                if (fileType === 'image/jpg') {
                    fileType = 'image/jpeg';
                }

                if (!allowedTypes.includes(fileType)) {
                    throw new Error(`Tipo de archivo no permitido: ${file.name}`);
                }

            }

        }

    }

}



// FORMULARIO
const candidatoForm = document.getElementById('candidatoForm');

if (candidatoForm) {

    candidatoForm.addEventListener('submit', async function (e) {

        e.preventDefault();

        const requiredFiles = [
            'identificacion',
            'curp',
            'comprobante_domicilio',
            'foto_perfil'
        ];

        let missingFiles = [];

        requiredFiles.forEach(name => {

            const fileInput = document.querySelector(`input[name="${name}"]`);

            if (fileInput && fileInput.files.length === 0) {
                missingFiles.push(name);
            }

        });

        if (missingFiles.length > 0) {
            showMessage('Por favor sube todos los documentos requeridos', 'error');
            return;
        }

        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = "Enviando postulación...";
        submitBtn.disabled = true;

        try {

            const formData = new FormData(this);

            validateFiles(formData);

            // PRIMERO: Extraer los datos del formulario (texto, no archivos)
            const datos = {};
            formData.forEach((value, key) => {
                if (!(value instanceof File)) {
                    datos[key] = value;
                }
            });

            // Convertir archivos a base64
            function fileToBase64(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64 = reader.result.split(',')[1];
                        resolve({
                            nombre: file.name,
                            tipo: file.type,
                            data: base64
                        });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }

            let archivos = [];

            for (let pair of formData.entries()) {
                if (pair[1] instanceof File && pair[1].size > 0) {
                    const archivo = await fileToBase64(pair[1]);

                    // AHORA SÍ podemos usar datos porque ya está declarado
                    let nombreArchivo = archivo.nombre;
                    const nombreLimpio = datos.nombre_completo ? datos.nombre_completo.replace(/\s+/g, '_') : 'sin_nombre';
                    const extension = archivo.nombre.split('.').pop();

                    switch (pair[0]) {
                        case 'identificacion':
                            nombreArchivo = `INE_${nombreLimpio}.${extension}`;
                            break;
                        case 'curp':
                            nombreArchivo = `CURP_${nombreLimpio}.${extension}`;
                            break;
                        case 'comprobante_domicilio':
                            nombreArchivo = `Comprobante_Domicilio_${nombreLimpio}.${extension}`;
                            break;
                        case 'certificados':
                            nombreArchivo = `Certificado_${nombreLimpio}_${Date.now()}.${extension}`;
                            break;
                        case 'foto_perfil':
                            nombreArchivo = `Foto_Perfil_${nombreLimpio}.${extension}`;
                            break;
                        case 'portafolio':
                            nombreArchivo = `Portafolio_${nombreLimpio}_${Date.now()}.${extension}`;
                            break;
                        default:
                            nombreArchivo = archivo.nombre;
                    }

                    archivos.push({
                        campo: pair[0],
                        nombre: nombreArchivo,
                        tipo: archivo.tipo,
                        data: archivo.data
                    });
                }
            }

            // Procesar días
            const diasSelect = this.querySelector('select[name="dias_disponibles"]');
            if (diasSelect) {
                datos.dias_disponibles = processSelectedDays(diasSelect);
            }

            // PAYLOAD
            const payload = {
                datos: datos,
                archivos: archivos
            };

            console.log("Payload enviado:", payload);

            // ENVIAR
            const response = await fetch(
                'https://script.google.com/macros/s/AKfycbycGPCQNW2F5Ombt_IpA_vfq8oFlHY81jORaoCSdESXoYOsbnAO0nnAD4SyTSFnkuLC/exec',
                {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

            console.log("Status:", response.status);
            const result = await response.json();
            console.log("Respuesta servidor:", result);

            if (result.success) {
                showMessage(
                    "¡Postulación enviada con éxito! Te contactaremos pronto.",
                    "success"
                );

                this.reset();

                document.querySelectorAll('.file-upload span').forEach(span => {
                    span.textContent = 'Seleccionar archivo';
                });

                document.querySelectorAll('.file-upload').forEach(upload => {
                    upload.style.borderColor = '#ddd';
                    upload.style.background = '#f8f8f8';
                });

            } else {
                throw new Error(result.error || "Error del servidor");
            }

        } catch (error) {
            console.error("Error:", error);
            showMessage(
                `Error: ${error.message}`,
                "error"
            );
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }

    });

}

// El resto del código (validaciones, etc.) permanece igual...
// Validar teléfono
const telefonoInput = document.querySelector('input[name="telefono"]');
if (telefonoInput) {
    telefonoInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    });
}

// Validar código postal
const cpInput = document.querySelector('input[name="codigo_postal"]');
if (cpInput) {
    cpInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 5);
    });
}

// Mostrar nombre archivo
document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', function () {
        const uploadDiv = this.closest('.file-upload');
        const span = uploadDiv.querySelector('span');

        if (this.files.length > 0) {
            if (this.multiple) {
                const nombres = Array.from(this.files).map(f => f.name).join(', ');
                span.textContent = `${this.files.length} archivo(s): ${nombres.substring(0, 40)}...`;
            } else {
                span.textContent = this.files[0].name;
            }
            uploadDiv.style.borderColor = '#c0392b';
            uploadDiv.style.background = '#fff5f5';
        } else {
            span.textContent = 'Seleccionar archivo';
            uploadDiv.style.borderColor = '#ddd';
            uploadDiv.style.background = '#f8f8f8';
        }
    });
});

// Animación scroll
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('.form-section').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
});

// Navbar scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 100) {
        navbar.style.background = "rgba(255,255,255,0.95)";
        navbar.style.backdropFilter = "blur(10px)";
        navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.1)";
    } else {
        navbar.style.background = "#ffffff";
        navbar.style.backdropFilter = "none";
        navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    }
});