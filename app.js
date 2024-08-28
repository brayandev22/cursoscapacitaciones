const express = require('express');
const mysql = require('mysql'); // Importar el módulo mysql
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fileUpload = require('express-fileupload');

// Configuración de la base de datos MySQL
const pool = mysql.createPool({
    host: 'b2zvutfvurarprltu3dn-mysql.services.clever-cloud.com', // Cambia esto según tu configuración
    user: 'ueaomjbmtjkdkrie',      // Cambia esto según tu configuración
    password: 'wMiKJHJ28CoVfdk9pq9P', // Cambia esto según tu configuración
    database: 'b2zvutfvurarprltu3dn', // Cambia esto según tu configuración
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Middleware para manejar la carga de archivos
app.use(fileUpload());

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir el archivo index.html desde 'public/html'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// Ruta para insertar datos desde el formulario de registro
app.post('/api/registro', async (req, res) => {
    const { nombresCompletos, estado, usuario, email, password } = req.body;

    try {
        await promisePool.query(
            'INSERT INTO Usuarios (nombresCompletos, usuario, email, password, Estado, codigoDocente) VALUES (?, ?, ?, ?, ?, ?)',
            [nombresCompletos, usuario, email, password, estado, '000']
        );
        res.status(201).send('Usuario creado');
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).send('Error en el servidor');
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await promisePool.query(
            'SELECT * FROM Usuarios WHERE email = ? AND password = ?',
            [email, password]
        );

        if (rows.length > 0) {
            const user = rows[0];
            console.log(`Inicio de sesión exitoso para el usuario: ${email}`);

            res.status(200).json({
                message: 'Login successful',
                user: {
                    nombresCompletos: user.nombresCompletos,
                    usuario: user.usuario,
                    email: user.email,
                    password: user.password,
                    estado: user.Estado,
                    codigoDocente: user.codigoDocente
                }
            });
        } else {
            res.status(401).send('Correo o contraseña incorrectos');
        }
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para agregar un nuevo curso
app.post('/api/add-course', async (req, res) => {
    const { courseName, courseDescription, courseDays, courseHours, coursePrice } = req.body;
    const courseImage = req.files.courseImage ? req.files.courseImage.data : null;
    const coursePDF = req.files.coursePDF ? req.files.coursePDF.data : null;

    try {
        await promisePool.query(
            'INSERT INTO Cursos (NombreCurso, Descripcion, Dias, Horas, Precio, Imagen, ModulosPDF) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [courseName, courseDescription, courseDays, courseHours, coursePrice, courseImage, coursePDF]
        );
        res.status(201).send('Curso agregado exitosamente');
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para obtener todos los cursos
app.get('/api/get-courses', async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            'SELECT Id, NombreCurso, Descripcion, Dias, Horas, Precio, Imagen, ModulosPDF FROM Cursos'
        );

        const courses = rows.map(course => ({
            id: course.Id,
            name: course.NombreCurso,
            description: course.Descripcion,
            days: course.Dias,
            hours: course.Horas,
            price: course.Precio,
            imageUrl: course.Imagen ? `/api/course-image/${course.Id}` : null,
            pdfUrl: course.ModulosPDF ? `/api/course-pdf/${course.Id}` : null
        }));

        res.status(200).json(courses);
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para eliminar un curso
app.delete('/api/delete-course/:name', async (req, res) => {
    const courseName = req.params.name;

    try {
        await promisePool.query(
            'DELETE FROM Cursos WHERE NombreCurso = ?',
            [courseName]
        );
        res.status(200).send('Curso eliminado exitosamente');
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para actualizar un curso
app.put('/api/update-course', async (req, res) => {
    const { oldName, name, description, days, hours, price } = req.body;
    const courseImage = req.files.courseImage ? req.files.courseImage.data : null;
    const coursePDF = req.files.coursePDF ? req.files.coursePDF.data : null;

    try {
        await promisePool.query(`
            UPDATE Cursos
            SET NombreCurso = ?, Descripcion = ?, Dias = ?, Horas = ?, Precio = ?, 
                Imagen = COALESCE(?, Imagen), ModulosPDF = COALESCE(?, ModulosPDF)
            WHERE NombreCurso = ?
        `, [name, description, days, hours, price, courseImage, coursePDF, oldName]);

        res.status(200).send('Curso actualizado exitosamente');
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para servir la imagen de un curso
app.get('/api/course-image/:id', async (req, res) => {
    const courseId = req.params.id;

    try {
        const [rows] = await promisePool.query(
            'SELECT Imagen FROM Cursos WHERE Id = ?',
            [courseId]
        );

        if (rows.length > 0) {
            const courseImage = rows[0].Imagen;
            res.setHeader('Content-Type', 'image/jpeg');
            res.send(courseImage);
        } else {
            res.status(404).send('Imagen no encontrada');
        }
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para servir el PDF de un curso
app.get('/api/course-pdf/:id', async (req, res) => {
    const courseId = req.params.id;

    try {
        const [rows] = await promisePool.query(
            'SELECT ModulosPDF FROM Cursos WHERE Id = ?',
            [courseId]
        );

        if (rows.length > 0) {
            const coursePDF = rows[0].ModulosPDF;
            res.setHeader('Content-Type', 'application/pdf');
            res.send(coursePDF);
        } else {
            res.status(404).send('PDF no encontrado');
        }
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).send('Error en el servidor');
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
