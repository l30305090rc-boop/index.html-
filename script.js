
// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Datos de vuelos simulados
    const flightsData = [
        {
            id: 1,
            flightNumber: "AV123",
            origin: "Bogotá (BOG)",
            destination: "Medellín (MDE)",
            departureTime: "06:30",
            arrivalTime: "07:30",
            departureDate: "15 Oct 2023",
            arrivalDate: "15 Oct 2023",
            duration: "1h 00m",
            originalPrice: 250000,
            status: "Disponible",
            airline: "SkyWings"
        },
        {
            id: 2,
            flightNumber: "AV456",
            origin: "Bogotá (BOG)",
            destination: "Cartagena (CTG)",
            departureTime: "09:15",
            arrivalTime: "10:45",
            departureDate: "15 Oct 2023",
            arrivalDate: "15 Oct 2023",
            duration: "1h 30m",
            originalPrice: 320000,
            status: "Disponible",
            airline: "SkyWings"
        },
        {
            id: 3,
            flightNumber: "AV789",
            origin: "Bogotá (BOG)",
            destination: "Cali (CLO)",
            departureTime: "14:20",
            arrivalTime: "15:30",
            departureDate: "15 Oct 2023",
            arrivalDate: "15 Oct 2023",
            duration: "1h 10m",
            originalPrice: 280000,
            status: "Disponible",
            airline: "SkyWings"
        },
        {
            id: 4,
            flightNumber: "AV101",
            origin: "Bogotá (BOG)",
            destination: "Miami (MIA)",
            departureTime: "18:00",
            arrivalTime: "23:30",
            departureDate: "15 Oct 2023",
            arrivalDate: "15 Oct 2023",
            duration: "5h 30m",
            originalPrice: 1200000,
            status: "Disponible",
            airline: "SkyWings"
        },
        {
            id: 5,
            flightNumber: "AV202",
            origin: "Bogotá (BOG)",
            destination: "Medellín (MDE)",
            departureTime: "20:45",
            arrivalTime: "21:45",
            departureDate: "15 Oct 2023",
            arrivalDate: "15 Oct 2023",
            duration: "1h 00m",
            originalPrice: 270000,
            status: "Últimos asientos",
            airline: "SkyWings"
        }
    ];

    // Elementos DOM
    const flightsList = document.getElementById('flightsList');
    const searchForm = document.getElementById('searchForm');
    const realTimeIndicator = document.querySelector('.real-time-indicator span');
    
    // Variables para control de actualizaciones
    let updateInterval;
    let isUpdating = true;

    // Función para aplicar el 40% de descuento
    function applyDiscount(price) {
        return Math.round(price * 0.6);
    }

    // Función para formatear precio en pesos colombianos
    function formatPrice(price) {
        return "$" + price.toLocaleString("es-CO");
    }

    // Función para formatear hora
    function formatTime(time) {
        return time.replace(/:\d+$/, '');
    }

    // Función para renderizar los vuelos
    function renderFlights(flights = flightsData) {
        flightsList.innerHTML = "";
        
        if (flights.length === 0) {
            flightsList.innerHTML = `
                <div class="no-flights">
                    <i class="fas fa-plane-slash"></i>
                    <h3>No se encontraron vuelos</h3>
                    <p>Intenta con otros criterios de búsqueda</p>
                </div>
            `;
            return;
        }
        
        flights.forEach(flight => {
            const discountedPrice = applyDiscount(flight.originalPrice);
            
            const flightCard = document.createElement('div');
            flightCard.className = 'flight-card';
            flightCard.dataset.id = flight.id;
            
            flightCard.innerHTML = `
                <div class="flight-header">
                    <div class="flight-info">
                        <div class="flight-number">Vuelo ${flight.flightNumber}</div>
                        <div class="airline">${flight.airline}</div>
                    </div>
                    <div class="flight-status">${flight.status}</div>
                </div>
                <div class="flight-body">
                    <div class="flight-origin">
                        <div class="city">${flight.origin}</div>
                        <div class="time">${formatTime(flight.departureTime)}</div>
                        <div class="date">${flight.departureDate}</div>
                    </div>
                    <div class="flight-route">
                        <i class="fas fa-plane"></i>
                        <div class="duration">${flight.duration}</div>
                    </div>
                    <div class="flight-destination">
                        <div class="city">${flight.destination}</div>
                        <div class="time">${formatTime(flight.arrivalTime)}</div>
                        <div class="date">${flight.arrivalDate}</div>
                    </div>
                </div>
                <div class="flight-price">
                    <div class="original-price">${formatPrice(flight.originalPrice)}</div>
                    <div class="discount-price">${formatPrice(discountedPrice)}</div>
                    <div class="discount-tag">40% DE DESCUENTO</div>
                    <button class="btn btn-book" onclick="bookFlight(${flight.id})">
                        <i class="fas fa-shopping-cart"></i> Reservar Ahora
                    </button>
                </div>
            `;
            
            flightsList.appendChild(flightCard);
        });
    }

    // Función para simular actualizaciones en tiempo real
    function simulateRealTimeUpdates() {
        if (updateInterval) clearInterval(updateInterval);
        
        updateInterval = setInterval(() => {
            if (!isUpdating) return;
            
            // Cambiar el estado de algunos vuelos aleatoriamente
            flightsData.forEach(flight => {
                if (Math.random() > 0.7) {
                    if (flight.status === "Disponible") {
                        flight.status = "Últimos asientos";
                    } else if (flight.status === "Últimos asientos") {
                        flight.status = "Disponible";
                    }
                }
                
                // Simular pequeñas fluctuaciones en precios
                if (Math.random() > 0.8) {
                    const changePercent = (Math.random() * 0.08) - 0.04; // Entre -4% y +4%
                    flight.originalPrice = Math.round(flight.originalPrice * (1 + changePercent));
                }
            });
            
            // Actualizar indicador de tiempo real
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-CO', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            realTimeIndicator.textContent = `Actualizado: ${timeString}`;
            
            // Volver a renderizar los vuelos
            renderFlights();
        }, 8000); // Actualizar cada 8 segundos
    }

    // Función para buscar vuelos
    function searchFlights(formData) {
        const origin = formData.get('origin')?.toLowerCase() || '';
        const destination = formData.get('destination')?.toLowerCase() || '';
        
        return flightsData.filter(flight => {
            const matchesOrigin = flight.origin.toLowerCase().includes(origin);
            const matchesDestination = flight.destination.toLowerCase().includes(destination);
            return matchesOrigin && matchesDestination;
        });
    }

    // Función para manejar el envío del formulario
    function handleSearchFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(searchForm);
        const filteredFlights = searchFlights(formData);
        
        renderFlights(filteredFlights);
        
        // Mostrar mensaje de resultados
        const resultsCount = filteredFlights.length;
        const message = resultsCount === 0 
            ? "No se encontraron vuelos con esos criterios" 
            : `Se encontraron ${resultsCount} vuelos`;
        
        showNotification(message, resultsCount > 0 ? 'success' : 'error');
    }

    // Función para mostrar notificaciones
    function showNotification(message, type = 'info') {
        // Eliminar notificación anterior si existe
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Botón para cerrar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Función para reservar un vuelo (global para usar en onclick)
    window.bookFlight = function(flightId) {
        const flight = flightsData.find(f => f.id === flightId);
        if (!flight) return;
        
        const discountedPrice = applyDiscount(flight.originalPrice);
        
        const modalHTML = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Confirmar Reserva</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="booking-details">
                            <div class="booking-flight">
                                <h4>Vuelo ${flight.flightNumber}</h4>
                                <p>${flight.origin} → ${flight.destination}</p>
                                <p>${flight.departureDate} - ${formatTime(flight.departureTime)}</p>
                            </div>
                            <div class="booking-price">
                                <p>Precio original: <span class="original">${formatPrice(flight.originalPrice)}</span></p>
                                <p class="discount">Precio con 40% descuento: <span class="final-price">${formatPrice(discountedPrice)}</span></p>
                            </div>
                        </div>
                        <form id="bookingForm" class="booking-form">
                            <div class="form-group">
                                <label for="passengerName">Nombre completo</label>
                                <input type="text" id="passengerName" required placeholder="Ingresa tu nombre completo">
                            </div>
                            <div class="form-group">
                                <label for="passengerEmail">Correo electrónico</label>
                                <input type="email" id="passengerEmail" required placeholder="tucorreo@ejemplo.com">
                            </div>
                            <button type="submit" class="btn btn-confirm">Confirmar y Pagar</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Agregar estilos para el modal
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 3000;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .modal {
                background-color: white;
                border-radius: 8px;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .modal-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: var(--secondary-color);
                color: white;
                border-radius: 8px 8px 0 0;
            }
            
            .modal-header h3 {
                margin: 0;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                line-height: 1;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .booking-details {
                margin-bottom: 20px;
                padding: 15px;
                background-color: #f9f9f9;
                border-radius: 4px;
            }
            
            .booking-form .form-group {
                margin-bottom: 15px;
            }
            
            .booking-form input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 16px;
            }
            
            .btn-confirm {
                background-color: var(--primary-color);
                color: white;
                width: 100%;
                padding: 12px;
                font-size: 16px;
                font-weight: 600;
                margin-top: 10px;
            }
            
            .original {
                text-decoration: line-through;
                color: #999;
            }
            
            .final-price {
                color: var(--primary-color);
                font-weight: 700;
                font-size: 20px;
            }
            
            .discount {
                font-size: 18px;
                margin-top: 10px;
            }
        `;
        document.head.appendChild(modalStyles);
        
        // Cerrar modal
        modalContainer.querySelector('.modal-close').addEventListener('click', () => {
            modalContainer.remove();
            modalStyles.remove();
        });
        
        // Cerrar al hacer clic fuera del modal
        modalContainer.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === modalContainer.querySelector('.modal-overlay')) {
                modalContainer.remove();
                modalStyles.remove();
            }
        });
        
        // Manejar el formulario de reserva
        modalContainer.querySelector('#bookingForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const passengerName = document.getElementById('passengerName').value;
            const passengerEmail = document.getElementById('passengerEmail').value;
            
            showNotification(`¡Reserva confirmada! Se envió un correo a ${passengerEmail} con los detalles.`, 'success');
            
            // Actualizar estado del vuelo
            flight.status = "Reservado";
            renderFlights();
            
            // Cerrar modal
            modalContainer.remove();
            modalStyles.remove();
        });
    };

    // Función para inicializar la aplicación
    function init() {
        // Renderizar vuelos iniciales
        renderFlights();
        
        // Iniciar actualizaciones en tiempo real
        simulateRealTimeUpdates();
        
        // Configurar eventos
        searchForm.addEventListener('submit', handleSearchFormSubmit);
        
        // Configurar botones de login/register
        document.querySelector('.btn-login').addEventListener('click', () => {
            showNotification('Funcionalidad de inicio de sesión en desarrollo', 'info');
        });
        
        document.querySelector('.btn-register').addEventListener('click', () => {
            showNotification('Funcionalidad de registro en desarrollo', 'info');
        });
        
        // Pausar/Reanudar actualizaciones al hacer clic en el indicador
        realTimeIndicator.parentElement.addEventListener('click', () => {
            isUpdating = !isUpdating;
            if (isUpdating) {
                simulateRealTimeUpdates();
                realTimeIndicator.textContent = 'Actualizando en tiempo real';
            } else {
                clearInterval(updateInterval);
                realTimeIndicator.textContent = 'Actualizaciones pausadas (clic para reanudar)';
            }
        });
    }

    // Inicializar la aplicación
    init();
});
