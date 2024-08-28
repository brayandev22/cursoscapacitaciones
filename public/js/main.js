
let isAnimating = false;
let nextCardToExpand = null;
let expandedCard = null;

const headerbars = document.querySelector('.header-bars');
const menu = document.querySelector('.menu-navegacion');

document.addEventListener('DOMContentLoaded', function() {
    // Obtener los datos del usuario desde localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
        const { usuario, estado } = userData;

        // Mostrar el nombre del usuario
        document.getElementById('nombre-user').textContent = usuario;

        // Mostrar u ocultar el enlace "Cursos2" según el estado del usuario
        if (estado === 'docente') {
            document.getElementById('cursos2').style.display = 'block';
        } else if (estado === 'Alumno') {
            document.getElementById('cursos2').style.display = 'none';
        }
    }
});

headerbars.addEventListener('click', () => {
    menu.classList.toggle("spread");
    closeAnyExpandedCard(); // Cerrar cualquier tarjeta expandida
});

window.addEventListener('click', e => {
    if (menu.classList.contains('spread') && e.target != menu && e.target != headerbars) {
        console.log('cerrar');
        menu.classList.toggle("spread");
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const mainCardContainer = document.getElementById('mainCardContainer');
    let expandedCardContainer = null;

    // Cargar cursos desde la base de datos y agregar a la página principal
    loadCoursesToMainPage();

    function expandCard(card, course) {
        if (expandedCardContainer) {
            expandedCardContainer.remove();
            expandedCardContainer = null;
        }

        // Crear una tarjeta expandida
        expandedCardContainer = document.createElement('div');
        expandedCardContainer.classList.add('expanded-card-container');

        const expandedCard = document.createElement('div');
        expandedCard.classList.add('expanded-card');

        const expandedImage = document.createElement('img');
        expandedImage.src = card.querySelector('img').src;
        expandedImage.alt = 'Imagen Expandida';

        const expandedConcepts = document.createElement('div');
        expandedConcepts.classList.add('concepts');

        const expandedTitle = document.createElement('h3');
        expandedTitle.textContent = course.name;

        const expandedDescription = document.createElement('p');
        expandedDescription.textContent = course.description;

        const expandedDays = document.createElement('p');
        expandedDays.textContent = "Días: " + course.days;

        const expandedHours = document.createElement('p');
        expandedHours.textContent = "Horas: " + course.hours;

        const expandedPrice = document.createElement('p');
        expandedPrice.textContent = "Precio: " + course.price;

        expandedConcepts.appendChild(expandedTitle);
        expandedConcepts.appendChild(expandedDescription);
        expandedConcepts.appendChild(expandedDays);
        expandedConcepts.appendChild(expandedHours);
        expandedConcepts.appendChild(expandedPrice);

        if (course.pdfUrl) {
            const pdfLink = document.createElement('a');
            pdfLink.href = course.pdfUrl;
            pdfLink.target = '_blank';
            pdfLink.classList.add('view-pdf');
            pdfLink.textContent = 'Ver Módulos (PDF)';
            expandedConcepts.appendChild(pdfLink);
        }

        expandedCard.appendChild(expandedImage);
        expandedCard.appendChild(expandedConcepts);
        expandedCardContainer.appendChild(expandedCard);

        // Insertar la tarjeta expandida al final del body
        document.body.appendChild(expandedCardContainer);

        // Ajustar la opacidad para la animación
        setTimeout(() => {
            expandedCardContainer.classList.add('active');
        }, 100);

        // Cerrar la tarjeta expandida al hacer clic fuera de ella
        window.addEventListener('click', e => {
            if (expandedCardContainer.classList.contains("active") && e.target !== expandCard) {
                closeExpandedCard();
            }
        });

        expandedCard.addEventListener('mouseleave', function() {
            closeExpandedCard(expandedCard);
        });

    }

    function closeExpandedCard() {
        if (expandedCardContainer) {
            expandedCardContainer.classList.remove('active');
            setTimeout(() => {
                if (expandedCardContainer) {
                    expandedCardContainer.remove();
                    expandedCardContainer = null;
                }
            }, 300); // Tiempo de espera igual a la duración de la transición
        }
    }

    function loadCoursesToMainPage() {
        fetch('/api/get-courses')
            .then(response => response.json())
            .then(courses => {
                courses.forEach(course => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    // Truncar la descripción a las primeras diez palabras
                    const truncatedDescription = course.description.split(' ').slice(0, 10).join(' ') + '...';

                    card.innerHTML = `
                        <img src="${course.imageUrl}" alt="${course.name}">
                        <h3>${course.name}</h3>
                        <p>${truncatedDescription}</p>
                        <p>Días: ${course.days}</p>
                        <p>Horas: ${course.hours}</p>
                        <p>Precio: ${course.price}</p>
                    `;

                    mainCardContainer.appendChild(card);

                    card.addEventListener('click', function() {
                        expandCard(card, course);
                    });
                });
            })
            .catch(err => {
                console.error('Error al cargar los cursos:', err);
            });
    }
});

