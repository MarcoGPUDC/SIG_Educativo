function logIn() {
    
    let user = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    if (!user || !pass) {
        console.error("Por favor, completa ambos campos.");
        document.getElementById("message").textContent = "Por favor, completa ambos campos.";
        return;
    }

    const data = { username: user, password: pass };

    fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:'include',
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            // Si la respuesta no es exitosa, muestra el error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();  // Procesa la respuesta como JSON
    })
    .then(data => {
        if (data) {
            window.open('/abm/','_self');  // Si el login es exitoso, redirige
        } else {
            document.getElementById("message").textContent = "Error al iniciar sesión.";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("message").textContent = "Error al iniciar sesión.";
    });
}

function logOut(){
    fetch(`auth/logout`)
        .then(response => {
            // Maneja la respuesta recibida del servidor
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json(); // Convierte la respuesta en formato JSON
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function loginFormSelect(form){
    var registrarseForm = document.getElementById('registrarseForm')
    var registrarseButton = document.getElementById('registrarseButton')
    var loginForm = document.getElementById('loginForm')
    var loginButton = document.getElementById('loginButton')
    var contraForm = document.getElementById('contraseñaForm')
    var contraButton = document.getElementById('contraseñaButton')
    switch (form) {
        case 'registrarseButton':
            /*registrarseForm.setAttribute('style','display:block');
            registrarseButton.setAttribute('style','display:none');
            loginForm.setAttribute('style','display:none');
            loginButton.setAttribute('style','display:inline-block');
            contraForm.setAttribute('style','display:none');
            contraButton.setAttribute('style','display:inline-block');*/
            window.location.href = 'https://sistemas2.chubut.edu.ar/soft/ddjj/admin/register/cmon_let_me_in'
            break ;
        case 'contraseñaButton':
            /*registrarseForm.setAttribute('style','display:none');
            registrarseButton.setAttribute('style','display:inline-block');
            loginForm.setAttribute('style','display:none');
            loginButton.setAttribute('style','display:inline-block');
            contraForm.setAttribute('style','display:block');
            contraButton.setAttribute('style','display:none');*/
            window.location.href = 'https://sistemas2.chubut.edu.ar/soft/ddjj/admin/password/new'
        break;
        case 'loginButton':
            registrarseForm.setAttribute('style','display:none');
            registrarseButton.setAttribute('style','display:inline-block');
            loginForm.setAttribute('style','display:block')
            loginButton.setAttribute('style','display:none');
            contraForm.setAttribute('style','display:none');
            contraButton.setAttribute('style','display:inline-block');
            break;
    }
}

function checkEmail(){
    var checkContraDiv = document.getElementById("checkEmailDiv");
    checkContraDiv.setAttribute('style', 'display:none');
    var cambiarContraDiv = document.getElementById("cambiarContraDiv");
    cambiarContraDiv.setAttribute('style', 'display: block');
}

function crearUsuario() {
    var nombre = document.getElementById("registroNombre").value
    var apellido = document.getElementById("registroApellido").value
    var email = document.getElementById("registroEmail").value
    var rol = document.getElementById("registroRol").value
    var contra = document.getElementById("registroContra").value
    var contraRep = document.getElementById("registroContraRep").value
    var data = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        rol: rol,
        contra: contra,
        contraRep: contraRep
    }
    console.log(data);
    fetch('/login/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            // Si la respuesta no es exitosa, muestra el error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();  // Procesa la respuesta como JSON
    })
    .then(data => {
        console.log(data);
    })
}