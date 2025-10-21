const stations = [
    { id: 'san-antonio', name: 'San Antonio', biblio: { available: true, horarios: [{ label: 'Lunes a viernes', hours: '8:00–8:00 p.m.' }], info: 'Ubicación: Acceso oriental. Para buscar información de los libros: Teléfono: 5109741' }, escucha: { available: true, horarios: [{ label: 'Martes', hours: '9:00–12:00 m.' }], info: 'Línea A. Horario presencial: Martes. Para asesoría virtual: Teléfono: 444 4448' } },
    { id: 'itagui', name: 'Itagüí', biblio: { available: true, horarios: [{ label: 'Lunes a viernes', hours: '8:00–6:00 p.m.' }], info: 'Ubicación: Acceso sur. Para buscar información de los libros: Bibliotecas Comfama (central): (604) 2162900, opción 2.' }, escucha: { available: false } },
    { id: 'niquia', name: 'Niquía', biblio: { available: true, horarios: [{ label: 'Lunes a viernes', hours: '8:00–6:00 p.m.' }], info: 'Ubicación: Acceso occidental. Para buscar información de los libros: Bibliotecas Comfama (central): (604) 2162900, opción 2.' }, escucha: { available: false } },
    { id: 'santo-domingo', name: 'Santo Domingo', biblio: { available: true, horarios: [{ label: 'Lunes a viernes', hours: '9:00–6:00 p.m.' }], info: 'Ubicación: Hacia el Metrocable Línea L. Para buscar información de los libros: Bibliotecas Comfama (central): (604) 2162900, opción 2.' }, escucha: { available: true, horarios: [{ label: 'Martes y jueves', hours: '1:00–5:00 p.m.' }], info: 'Línea K. Horario presencial: Martes y jueves. Para asesoría virtual: Teléfono: 444 4448' } },
    { id: 'el-pinal', name: 'El Pinal', biblio: { available: true, horarios: [{ label: 'Lunes a viernes', hours: '9:00–5:00 p.m.' }], info: 'Ubicación: Plazoleta inferior Metrocable Línea M. Para buscar información de los libros: Bibliotecas Comfama (central): (604) 2162900, opción 2.' }, escucha: { available: false } },
    { id: 'acevedo', name: 'Acevedo', biblio: { available: true, horarios: [{ label: 'Lunes a viernes', hours: '8:00–8:00 p.m.' }], info: 'Ubicación: Plataforma Metrocable Línea P. Para buscar información de los libros: Bibliotecas Comfama (central): (604) 2162900, opción 2.' }, escucha: { available: true, horarios: [{ label: 'Miércoles', hours: '8:00–12:00 m.' }], info: 'Línea P. Horario presencial: Miércoles. Para asesoría virtual: Teléfono: 444 4448' } },
];

// --- Información General y Títulos ---
const infoTitles = {
    biblio: 'Detalles de Biblometro',
    escucha: 'Detalles de Escuchadero'
};

const infoBiblioGeneral = `
    <div class="schedule" style="background:#f6fbf7;">
        <p><strong>💡 Selecciona una sede para conocer su información.</strong></p>
    </div>
`;

const infoEscuchaGeneral = `
    <div class="schedule" style="background:#f6fbf7;">
        <p><strong>💡 Selecciona una estación para conocer su información.</strong></p>
    </div>
`;

// --- Inicialización de variables ---
let currentMode = 'biblio';
const list = document.getElementById('stationList');
const track = document.getElementById('track');
const train = document.getElementById('train');
const infoDetails = document.getElementById('infoDetails');
const generalInfoContent = document.getElementById('generalInfoContent');
const modeBiblioBtn = document.getElementById('modeBiblio');
const modeEscuchaBtn = document.getElementById('modeEscucha');
const trainImage = document.querySelector('.img_train'); // Elemento imagen del tren

// --- Funciones de Renderizado ---
function renderStations() {
    list.innerHTML = '';
    track.innerHTML = '';

    const availableStations = stations.filter(st => st[currentMode].available);

    availableStations.forEach((st, i) => {
        const btn = document.createElement('button');
        btn.className = 'station-btn';
        btn.textContent = st.name;
        // La función selectStation ahora acepta solo el índice
        btn.onclick = () => selectStation(i, st, availableStations);
        list.appendChild(btn);

        // Renderiza nodo en el mapa
        const node = document.createElement('div');
        node.className = 'station-node';
        node.innerHTML = `<div class="node-dot" data-index="${i}"></div><div class="node-label">${st.name}</div>`;

        // Hace que todo el 'node' sea clicqueable
        node.onclick = () => selectStation(i, st, availableStations);

        track.appendChild(node);
    });

    // Ocultar tren al cambiar de modo
    train.style.display = 'none';
}

// --- Manejo de la imagen responsiva ---
function updateTrainImage() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Carga la imagen móvil (asumiendo que tiene data-mobile-src)
        const mobileSrc = trainImage.getAttribute('data-mobile-src');
        if (mobileSrc) {
            trainImage.src = mobileSrc;
        }
    } else {
        // Vuelve a la imagen de escritorio
        trainImage.src = 'img/metro_animado_1.webp';
    }
}


/**
 * Muestra la información específica de la estación seleccionada.
 */
function displayStationDetails(station) {
    const data = station[currentMode];

    // 1️⃣ Título
    infoDetails.querySelector('h2').textContent = station.name;

    // 2️⃣ Contenido
    let contentHTML = '';

    if (data.info) {
        contentHTML += `<p>${data.info}</p>`;
    }

    if (data.horarios && data.horarios.length > 0) {
        const schedules = data.horarios
            .map(h => `<li><strong>${h.label}:</strong> ${h.hours}</li>`)
            .join('');
        contentHTML += `<div class="schedule"><h4>Horario de Atención:</h4><ul>${schedules}</ul></div>`;
    } else {
        contentHTML += `<p>No hay horarios específicos disponibles para esta estación en el modo ${currentMode}.</p>`;
    }

    generalInfoContent.innerHTML = contentHTML;
}

/**
 * Posiciona el tren en la estación seleccionada, con lógica responsiva.
 */
function selectStation(index, st, availableStations) {
    const nodeDot = document.querySelector(`.node-dot[data-index="${index}"]`);
    if (!nodeDot) return;

    const wasHidden = train.style.display === 'none';
    if (wasHidden) {
        train.style.display = 'flex';
        train.style.transition = 'none'; // Deshabilita la transición para el primer render
    }

    const trackRect = track.getBoundingClientRect();
    const dotRect = nodeDot.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;

    let finalPosition;
    let positionProperty;

    // 🔥 LÓGICA MÓVIL (Movimiento Vertical y Alineación Horizontal Responsiva)
    // 🔥 LÓGICA MÓVIL (Movimiento Vertical SOLAMENTE)
    if (isMobile) {
        const verticalAdjustment = -15; // ⬅️ Debería empujar el tren unos 15px hacia abajo

        const dotCenterY = (dotRect.top + dotRect.height / 2) - trackRect.top;
        const trainHeight = train.offsetHeight;

        // Al restar un número negativo, se suma, moviendo el tren hacia abajo
        finalPosition = dotCenterY - (trainHeight / 2) - verticalAdjustment;
        positionProperty = 'top';

        train.style.transition = 'top 0.8s ease-in-out';
    }
    // 🖥️ LÓGICA ESCRITORIO (Movimiento Horizontal)
    else {
        // 1. CÁLCULO HORIZONTAL (Propiedad 'left')
        const dotCenterX = (dotRect.left + dotRect.width / 2) - trackRect.left;
        const trainWidth = train.offsetWidth;
        const correctionX = dotRect.width * 0.1;

        finalPosition = dotCenterX - (trainWidth / 2) - correctionX;
        positionProperty = 'left';

        // Configurar la transición para escritorio
        train.style.transition = 'left 0.8s ease-in-out';
        train.style.top = 'auto'; // Limpiar la posición TOP del móvil
        train.style.right = 'auto';
    }

    // 🔹 Aplicación de la posición (animación)
    void train.offsetWidth;

    if (wasHidden) {
        requestAnimationFrame(() => {
            train.style[positionProperty] = `${finalPosition}px`;
        });
    } else {
        train.style[positionProperty] = `${finalPosition}px`;
    }

    // 🟡 Marcar estación activa
    document.querySelectorAll('.station-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.node-dot').forEach(dot => dot.classList.remove('active'));

    const allButtons = document.querySelectorAll('.station-btn');
    if (allButtons[index]) allButtons[index].classList.add('active');
    nodeDot.classList.add('active');

    displayStationDetails(st);
}

// --- Mostrar mensaje inicial al cambiar modo ---
function updateGeneralInfo() {
    infoDetails.querySelector('h2').textContent = `Información General de ${currentMode === 'biblio' ? 'Biblometros' : 'Escuchaderos'}`;

    generalInfoContent.innerHTML = `
        <p style="text-align:center; font-weight:500; color:#666; margin-bottom:12px;">
            Selecciona una estación para ver los detalles.
        </p>
        ${currentMode === 'biblio' ? infoBiblioGeneral : infoEscuchaGeneral}
    `;

    // Ocultar tren hasta que se seleccione estación
    train.style.display = 'none';
}

// --- Event Listeners ---
modeBiblioBtn.onclick = () => {
    currentMode = 'biblio';
    modeBiblioBtn.classList.add('active');
    modeEscuchaBtn.classList.remove('active');
    renderStations();
    updateGeneralInfo();

    // 🔹 Reiniciar posición y forzar la imagen correcta
    train.style.left = '0px';
    train.style.top = '0px';
    updateTrainImage();
};

modeEscuchaBtn.onclick = () => {
    currentMode = 'escucha';
    modeEscuchaBtn.classList.add('active');
    modeBiblioBtn.classList.remove('active');
    renderStations();
    updateGeneralInfo();

    // 🔹 Reiniciar posición y forzar la imagen correcta
    train.style.left = '0px';
    train.style.top = '0px';
    updateTrainImage();
};


// --- Inicialización ---
renderStations();
updateGeneralInfo();
updateTrainImage(); // Asegura la imagen correcta al cargar
window.addEventListener('resize', updateTrainImage); // Asegura la imagen correcta al rotar/redimensionar
