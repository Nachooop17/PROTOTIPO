// --- 1. SIMULACIÓN DE DATOS (JSON) ---
const userData = {
    // Datos para RF1.3 - Horarios
    horarios: [
        { dia: 'Lunes', curso: 'Programación Web I', hora: '14:00 - 16:00', sala: 'B-301' },
        { dia: 'Martes', curso: 'Matemáticas Avanzadas', hora: '10:00 - 12:00', sala: 'A-105' },
        { dia: 'Miércoles', curso: 'Física Clásica', hora: '16:00 - 18:00', sala: 'C-204' }
    ],
    // Datos para RF1.4 - Calificaciones
    calificaciones: [
        { curso: 'Programación Web I', nota_parcial_1: '5.5', nota_parcial_2: '6.2', nota_final: '5.8' },
        { curso: 'Matemáticas Avanzadas', nota_parcial_1: '4.8', nota_parcial_2: '5.0', nota_final: '4.9' },
        { curso: 'Física Clásica', nota_parcial_1: '6.5', nota_parcial_2: '6.8', nota_final: '6.7' }
    ],
    // Datos para RF2.5 (Control de Inasistencias)
    estudiantes: [
        { id: 1, nombre: 'Ana Gómez' },
        { id: 2, nombre: 'Benito Pérez' },
        { id: 3, nombre: 'Carla Díaz' },
        { id: 4, nombre: 'David Soto' }
    ]
};

let currentUserRole = null; // Variable global para el rol actual

// --- 2. GESTIÓN DE ROLES Y LOGIN ---

window.login = function(role) {
    currentUserRole = role;

    // 1. Mostrar/Ocultar pantallas
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = 'block';

    // 2. Mostrar el rol en el header
    let roleText = '';
    if (role === 'student') roleText = 'ESTUDIANTE';
    else if (role === 'teacher') roleText = 'DOCENTE';
    else if (role === 'coordinator') roleText = 'COORDINADOR';
    document.getElementById('userRoleDisplay').textContent = roleText;

    // 3. Configurar el menú y el contenido según el rol
    showRoleMenu(role);

    // 4. Renderizar datos
    renderHorarios();
    renderCalificaciones();
    renderAsistenciaTable();
}

window.logout = function() {
    currentUserRole = null;
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboardScreen').style.display = 'none';
}


function showRoleMenu(role) {
    const isStudent = role === 'student';
    const isTeacher = role === 'teacher';
    const isCoordinator = role === 'coordinator';

    // 1. Ocultar y mostrar ítems por rol
    document.querySelectorAll('.role-student').forEach(el => el.style.display = isStudent ? 'block' : 'none');
    document.querySelectorAll('.role-teacher').forEach(el => el.style.display = isTeacher ? 'block' : 'none');
    document.querySelectorAll('.role-coordinator').forEach(el => el.style.display = isCoordinator ? 'block' : 'none');

    // 2. Definir el módulo de inicio
    let initialModuleId = 'horarios'; // Default para el que siempre está

    if (isStudent) {
        initialModuleId = 'certificados'; 
    } else if (isTeacher) {
        initialModuleId = 'asignacion'; 
    } else if (isCoordinator) {
        initialModuleId = 'trazabilidad'; 
    }
    
    // 3. Activar el módulo inicial
    
    // Desactivar todos los activos
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    
    // Activar el inicial
    const initialItem = document.querySelector(`.sidebar-item[data-module="${initialModuleId}"]`);
    const initialModule = document.getElementById(initialModuleId);

    if (initialItem) initialItem.classList.add('active');
    if (initialModule) initialModule.classList.add('active');
    
    // Asegurar que Horarios se muestre (aunque no sea el activo por defecto para Coordinador)
    document.querySelector('.sidebar-item[data-module="horarios"]').style.display = 'block'; 
}


// --- 3. FUNCIONES DE RENDERIZADO ---

function renderHorarios() {
    const data = userData.horarios;
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Día</th>
                    <th>Curso</th>
                    <th>Hora</th>
                    <th>Sala</th>
                </tr>
            </thead>
            <tbody>
    `;
    data.forEach(item => {
        html += `
            <tr>
                <td>${item.dia}</td>
                <td>${item.curso}</td>
                <td>${item.hora}</td>
                <td>${item.sala}</td>
            </tr>
        `;
    });
    html += `
            </tbody>
        </table>
    `;
    document.getElementById('horario-data').innerHTML = html;
}

function renderCalificaciones() {
    const data = userData.calificaciones;
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Curso</th>
                    <th>Parcial 1</th>
                    <th>Parcial 2</th>
                    <th>Nota Final</th>
                </tr>
            </thead>
            <tbody>
    `;
    data.forEach(item => {
        // Lógica simple para resaltar notas bajo 5.0
        const style = (nota) => parseFloat(nota) < 5.0 ? 'style="color: red; font-weight: bold;"' : '';

        html += `
            <tr>
                <td>${item.curso}</td>
                <td ${style(item.nota_parcial_1)}>${item.nota_parcial_1}</td>
                <td ${style(item.nota_parcial_2)}>${item.nota_parcial_2}</td>
                <td ${style(item.nota_final)}>${item.nota_final}</td>
            </tr>
        `;
    });
    html += `
            </tbody>
        </table>
    `;
    document.getElementById('calificaciones-data').innerHTML = html;
}

function renderAsistenciaTable() {
    const tableBody = document.querySelector('#asistencia-table tbody');
    let html = '';
    userData.estudiantes.forEach(est => {
        html += `
            <tr>
                <td>${est.nombre}</td>
                <td><input type="radio" name="asistencia_${est.id}" value="P" checked></td>
                <td><input type="radio" name="asistencia_${est.id}" value="A"></td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

window.registrarAsistencia = function() {
    const curso = document.getElementById('curso-select').value;
    const cursoNombre = document.querySelector(`#curso-select option[value="${curso}"]`).textContent;
    const messageElement = document.getElementById('asistencia-message');

    messageElement.textContent = `✅ ¡Asistencia registrada con éxito para el curso de ${cursoNombre}!`;

    setTimeout(() => {
        messageElement.textContent = '';
    }, 3000);
}


// --- 4. LÓGICA DE NAVEGACIÓN ---

function setupNavigation() {
    const sidebarMenu = document.getElementById('sidebarMenu');

    sidebarMenu.addEventListener('click', function(e) {
        if (!e.target.closest('.sidebar-item')) return;
        
        const item = e.target.closest('.sidebar-item');
        const targetModuleId = item.getAttribute('data-module');

        // 1. Desactivar todos los ítems de la barra lateral
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        // 2. Activar el ítem seleccionado
        item.classList.add('active');

        // 3. Ocultar todos los módulos
        document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));

        // 4. Mostrar el módulo objetivo
        const targetModule = document.getElementById(targetModuleId);
        if (targetModule) {
            targetModule.classList.add('active');
        }
    });
}

// --- 5. INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
});