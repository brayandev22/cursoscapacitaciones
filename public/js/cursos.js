document.addEventListener('DOMContentLoaded', () => {
    const showFormButton = document.getElementById('showForm');
    const showCoursesButton = document.getElementById('showCourses');
    const formSection = document.getElementById('formSection');
    const coursesSection = document.getElementById('coursesSection');
    const courseForm = document.getElementById('courseForm');
    const coursesList = document.getElementById('coursesList');

    function showSection(section) {
        formSection.classList.remove('active');
        coursesSection.classList.remove('active');
        section.classList.add('active');
    }

    showFormButton.addEventListener('click', () => showSection(formSection));
    showCoursesButton.addEventListener('click', () => showSection(coursesSection));

    showSection(formSection);

    loadCourses();

    courseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('courseName', document.getElementById('courseName').value);
        formData.append('courseDescription', document.getElementById('courseDescription').value);
        formData.append('courseDays', document.getElementById('courseDays').value);
        formData.append('courseHours', document.getElementById('courseHours').value);
        formData.append('coursePrice', document.getElementById('coursePrice').value);
        formData.append('courseImage', document.getElementById('courseImage').files[0]);
        formData.append('coursePDF', document.getElementById('coursePDF').files[0]);

        try {
            const response = await fetch('/api/add-course', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Curso agregado exitosamente');
                courseForm.reset();
                loadCourses(); // Cargar cursos después de agregar
            } else {
                alert('Error al agregar el curso');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al agregar el curso');
        }
    });

    function addCourse(name, description, days, hours, price, imageUrl, pdfUrl) {
        const course = document.createElement('div');
        course.classList.add('course');

        course.innerHTML = `
            <div class="course-info-container">
                <div class="course-info">
                    <img src="${imageUrl}" alt="${name}">
                    <div>
                        <h3>${name}</h3>
                        <p>${description}</p>
                        <p>Días: ${days}</p>
                        <p>Horas: ${hours}</p>
                        <p>Precio: ${price}</p>
                    </div>
                </div>
                ${pdfUrl ? `<a href="${pdfUrl}" target="_blank" class="view-pdf">Ver Módulos (PDF)</a>` : ''}
            </div>
            <div class="course-actions">
                <button class="edit">Editar</button>
                <button class="delete">Eliminar</button>
                <button class="update" style="display:none;">Actualizar</button>
            </div>
        `;


        coursesList.appendChild(course);

        const deleteButton = course.querySelector('.delete');

        deleteButton.addEventListener('click', () => {
            coursesList.removeChild(course);
            removeCourse(name);
        });

        const editButton = course.querySelector('.edit');
        const updateButton = course.querySelector('.update');
        const courseInfo = course.querySelector('.course-info');

        editButton.addEventListener('click', () => {
            editButton.style.display = 'none';
            deleteButton.style.display = 'none';
            updateButton.style.display = 'inline';

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = name;

            const descriptionInput = document.createElement('textarea');
            descriptionInput.value = description;
            descriptionInput.maxLength = 850; // Limitar a 850 caracteres

            const daysInput = document.createElement('input');
            daysInput.type = 'text';
            daysInput.value = days;

            const hoursInput = document.createElement('input');
            hoursInput.type = 'text';
            hoursInput.value = hours;

            const priceInput = document.createElement('input');
            priceInput.type = 'text';
            priceInput.value = price;

            const imageInput = document.createElement('input');
            imageInput.type = 'file';
            imageInput.accept = 'image/*';

            const pdfInput = document.createElement('input');
            pdfInput.type = 'file';
            pdfInput.accept = 'application/pdf';

            // Mostrar imagen y PDF subidos si existen
            const image = document.createElement('img');
            if (imageUrl) {
                image.src = imageUrl;
                image.alt = name;
                image.style.maxWidth = '100px';
                courseInfo.appendChild(image);
            }

            const pdfLink = document.createElement('a');
            if (pdfUrl) {
                pdfLink.href = pdfUrl;
                pdfLink.target = '_blank';
                pdfLink.textContent = 'Ver Módulos (PDF)';
                courseInfo.appendChild(pdfLink);
            }

            courseInfo.innerHTML = '';
            courseInfo.appendChild(nameInput);
            courseInfo.appendChild(descriptionInput);
            courseInfo.appendChild(daysInput);
            courseInfo.appendChild(hoursInput);
            courseInfo.appendChild(priceInput);
            courseInfo.appendChild(imageInput);
            courseInfo.appendChild(pdfInput);
            

            updateButton.addEventListener('click', async () => {
                const newName = nameInput.value;
                const newDescription = descriptionInput.value;
                const newDays = daysInput.value;
                const newHours = hoursInput.value;
                const newPrice = priceInput.value;
                const newImageFile = imageInput.files[0];
                const newPDFFile = pdfInput.files[0];

                const formData = new FormData();
                formData.append('oldName', name);
                formData.append('name', newName);
                formData.append('description', newDescription);
                formData.append('days', newDays);
                formData.append('hours', newHours);
                formData.append('price', newPrice);
                if (newImageFile) formData.append('courseImage', newImageFile);
                if (newPDFFile) formData.append('coursePDF', newPDFFile);

                try {
                    const response = await fetch('/api/update-course', {
                        method: 'PUT',
                        body: formData
                    });

                    if (response.ok) {
                        alert('Curso actualizado exitosamente');
                        courseInfo.innerHTML = `
                            <img src="${newImageFile ? URL.createObjectURL(newImageFile) : imageUrl}" alt="${newName}">
                            <div>
                                <h3>${newName}</h3>
                                <p>${newDescription}</p>
                                <p>Días: ${newDays}</p>
                                <p>Horas: ${newHours}</p>
                                <p>Precio: ${newPrice}</p>
                            </div>
                        `;

                        if (newPDFFile) {
                            const pdfLink = course.querySelector('.view-pdf');
                            if (pdfLink) {
                                pdfLink.href = URL.createObjectURL(newPDFFile);
                            } else {
                                const newPdfLink = document.createElement('a');
                                newPdfLink.href = URL.createObjectURL(newPDFFile);
                                newPdfLink.target = '_blank';
                                newPdfLink.classList.add('view-pdf');
                                newPdfLink.textContent = 'Ver Módulos (PDF)';
                                courseInfo.appendChild(newPdfLink);
                            }
                        }

                        editButton.style.display = 'inline';
                        deleteButton.style.display = 'inline';
                        updateButton.style.display = 'none';
                    } else {
                        alert('Error al actualizar el curso');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error al actualizar el curso');
                }
            });
        });

        if (pdfUrl) {
            const pdfLink = course.querySelector('.view-pdf');
            pdfLink.addEventListener('click', (e) => {
                e.preventDefault();
                const win = window.open();
                win.document.write('<iframe src="' + pdfUrl  + '" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>');
            });
        }
    }

    function loadCourses() {
        const userData = JSON.parse(localStorage.getItem('userData')); // Obtener los datos del usuario desde localStorage
        const userEmail = userData ? userData.email : null; // Obtener el email del usuario
    
        if (!userEmail) {
            console.error('No se encontró información del usuario en localStorage.');
            return;
        }
    
        coursesList.innerHTML = ''; // Limpiar la lista de cursos
        fetch('/api/get-courses')
            .then(response => response.json())
            .then(courses => {
                // Comentar o eliminar la línea de filtrado
                // const filteredCourses = courses.filter(course => course.docenteEmail === userEmail);
                courses.forEach(course => {  // Cambiar filteredCourses por courses
                    addCourse(course.name, course.description, course.days, course.hours, course.price, course.imageUrl, course.pdfUrl);
                });
            })
            .catch(error => console.error('Error:', error));
    }
    

    function removeCourse(name) {
        fetch(`/api/delete-course/${encodeURIComponent(name)}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Curso eliminado exitosamente');
                loadCourses(); // Cargar cursos después de eliminar
            } else {
                alert('Error al eliminar el curso');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar el curso');
        });
    }
});
