const express = require('express');
const { poolPromise } = require('./dbConfig'); // Importar la configuración de la base de datos
const sql = require('mssql'); // Importar el módulo mssql
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fileUpload = require('express-fileupload');

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

// Ruta para servir el archivo index-copy.html desde 'public/html'
//app.get('/menu.html', (req, res) => {
//    res.sendFile(path.join(__dirname, 'public', 'html', 'menu.html'));
//});

// Ruta para insertar datos desde el formulario de registro
app.post('/api/registro', async (req, res) => {
    const { nombresCompletos, estado, usuario, email, password } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('nombresCompletos', sql.NVarChar, nombresCompletos)
            .input('usuario', sql.NVarChar, usuario)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .input('estado', sql.NVarChar, estado)  // Valor por defecto
            .input('codigoDocente', sql.NVarChar, '000')  // Valor por defecto
            .query('INSERT INTO Usuarios (nombresCompletos, usuario, email, password, Estado, codigoDocente) VALUES (@nombresCompletos, @usuario, @email, @password, @estado, @codigoDocente)');
        
        res.status(201).send('Usuario creado');
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).send('Error en el servidor');
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .query('SELECT * FROM Usuarios WHERE email = @email AND password = @password');

        if (result.recordset.length > 0) {
            const user = result.recordset[0]; // Datos del usuario autenticado
            console.log(`Inicio de sesión exitoso para el usuario: ${email}`);

            // Mostrar los datos del usuario en la consola
            /*console.log('Datos del usuario:', {
                nombresCompletos: user.nombresCompletos,
                usuario: user.usuario,
                email: user.email,
                password: user.password,
                estado: user.Estado,  // Incluye el estado
                codigoDocente: user.codigoDocente  // Incluye el código del docente
            });*/

            // Responder con todos los datos del usuario autenticado, incluyendo los nuevos campos
            res.status(200).json({
                message: 'Login successful',
                user: {
                    nombresCompletos: user.nombresCompletos,
                    usuario: user.usuario,
                    email: user.email,
                    password: user.password,
                    estado: user.Estado,  // Incluye el estado
                    codigoDocente: user.codigoDocente  // Incluye el código del docente
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
        const pool = await poolPromise;
        await pool.request()
            .input('NombreCurso', sql.VarChar, courseName)
            .input('Descripcion', sql.Text, courseDescription)
            .input('Dias', sql.VarChar, courseDays)
            .input('Horas', sql.VarChar, courseHours)
            .input('Precio', sql.Decimal(10, 2), coursePrice)
            .input('Imagen', sql.VarBinary, courseImage)
            .input('ModulosPDF', sql.VarBinary, coursePDF)
            .query('INSERT INTO Cursos (NombreCurso, Descripcion, Dias, Horas, Precio, Imagen, ModulosPDF) VALUES (@NombreCurso, @Descripcion, @Dias, @Horas, @Precio, @Imagen, @ModulosPDF)');
        
        res.status(201).send('Curso agregado exitosamente');
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para obtener todos los cursos
app.get('/api/get-courses', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT Id, NombreCurso, Descripcion, Dias, Horas, Precio, Imagen, ModulosPDF FROM Cursos');
        
        const courses = result.recordset.map(course => ({
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
        const pool = await poolPromise;
        await pool.request()
            .input('NombreCurso', sql.VarChar, courseName)
            .query('DELETE FROM Cursos WHERE NombreCurso = @NombreCurso');
        
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
        const pool = await poolPromise;
        const request = pool.request()
            .input('OldNombreCurso', sql.VarChar, oldName)
            .input('NombreCurso', sql.VarChar, name)
            .input('Descripcion', sql.Text, description)
            .input('Dias', sql.VarChar, days)
            .input('Horas', sql.VarChar, hours)
            .input('Precio', sql.Decimal(10, 2), price);
        
        if (courseImage) {
            request.input('Imagen', sql.VarBinary, courseImage);
        }
        if (coursePDF) {
            request.input('ModulosPDF', sql.VarBinary, coursePDF);
        }

        await request.query(`
            UPDATE Cursos
            SET NombreCurso = @NombreCurso,
                Descripcion = @Descripcion,
                Dias = @Dias,
                Horas = @Horas,
                Precio = @Precio,
                Imagen = CASE WHEN @Imagen IS NOT NULL THEN @Imagen ELSE Imagen END,
                ModulosPDF = CASE WHEN @ModulosPDF IS NOT NULL THEN @ModulosPDF ELSE ModulosPDF END
            WHERE NombreCurso = @OldNombreCurso
        `);
        
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
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Id', sql.Int, courseId)
            .query('SELECT Imagen FROM Cursos WHERE Id = @Id');
        
        if (result.recordset.length > 0) {
            const courseImage = result.recordset[0].Imagen;
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
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Id', sql.Int, courseId)
            .query('SELECT ModulosPDF FROM Cursos WHERE Id = @Id');
        
        if (result.recordset.length > 0) {
            const coursePDF = result.recordset[0].ModulosPDF;
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
