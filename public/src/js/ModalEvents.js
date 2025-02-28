import HttpClient from './HttpClient.js';
import ResponseContent from './ResponseContent.js';

export default class ModalEvents {

    constructor(url, csrf) {
        this.url = url;
        this.csrf = csrf;

        this.content = document.getElementById('content');
        this.userContent = document.getElementById('userContent');
        this.pagination = document.getElementById('pagination');
        this.responseContent = new ResponseContent(this.content, this.pagination, this.userContent);

        this.fetchUrl = '';
        this.httpClient = new HttpClient(this.url, this.csrf);

        // Create
        this.modalCreate = document.getElementById('createModal');
        this.modalCreateButton = document.getElementById('modalCreateButton');
        this.createName = document.getElementById('createName');
        this.createRating = document.getElementById('createRating');
        this.createYear = document.getElementById('createYear');

        // Delete
        this.modalDelete = document.getElementById('deleteModal');
        this.modalDeleteButton = document.getElementById('modalDeleteButton');
        this.deleteName = document.getElementById('deleteName');
        this.deleteRating = document.getElementById('deleteRating');
        this.deleteYear = document.getElementById('deleteYear');

        // Edit
        this.modalEdit = document.getElementById('editModal');
        this.modalEditButton = document.getElementById('modalEditButton');
        this.editName = document.getElementById('editName');
        this.editRating = document.getElementById('editRating');
        this.editYear = document.getElementById('editYear');

        // Login
        this.modalLogin = document.getElementById('loginModal');
        this.modalLoginUserButton = document.getElementById('modalLoginUserButton');
        this.loginEmail = document.getElementById('loginEmail');
        this.loginPassword = document.getElementById('loginPassword');

        // Register
        this.modalRegister = document.getElementById('registerModal');
        this.modalRegisterUserButton = document.getElementById('modalRegisterUserButton');
        this.registerConfirmPassword = document.getElementById('registerConfirmPassword');
        this.registerEmail = document.getElementById('registerEmail');
        this.registerName = document.getElementById('registerName');
        this.registerPassword = document.getElementById('registerPassword');

        // View
        this.modalView = document.getElementById('viewModal');
        this.viewCreatedAt = document.getElementById('viewCreatedAt');
        this.viewId = document.getElementById('viewId');
        this.viewName = document.getElementById('viewName');
        this.viewRating = document.getElementById('viewRating');
        this.viewYear = document.getElementById('viewYear');
        this.viewUpdatedAt = document.getElementById('viewUpdatedAt');

        this.filmError = document.getElementById('filmError');
        this.filmSuccess = document.getElementById('filmSuccess');

        this.logoutButton = document.getElementById('logoutButton');

        this.assignEvents();
    }

    assignEvents() {

        // Create
        this.modalCreate.addEventListener('show.bs.modal', (event) => {
            document.getElementById('modalCreateWarning').style.display = 'none';
            this.fetchUrl = event.relatedTarget.dataset.url;
            this.createName.value = '';
            this.createRating.value = '';
            this.createYear.value = '';
        });

        // Delete
        this.modalDelete.addEventListener('show.bs.modal', (event) => {
            document.getElementById('modalDeleteWarning').style.display = 'none';
            this.fetchUrl = event.relatedTarget.dataset.url;
            this.deleteName.value = event.relatedTarget.dataset.name;
            this.deleteRating.value = event.relatedTarget.dataset.rating;
            this.deleteYear.value = event.relatedTarget.dataset.year;
        });

        // Edit
        this.modalEdit.addEventListener('show.bs.modal', (event) => {
            document.getElementById('modalEditWarning').style.display = 'none';
            this.fetchUrl = event.relatedTarget.dataset.url;
            this.editName.value = event.relatedTarget.dataset.name;
            this.editRating.value = event.relatedTarget.dataset.rating;
            this.editYear.value = event.relatedTarget.dataset.year;
        });

        // Login
        this.modalLogin.addEventListener('show.bs.modal', (event) => {
            this.fetchUrl = event.relatedTarget.dataset.url;
            this.loginEmail.value = '';
            this.loginPassword.value = '';
        });

        // Register
        this.modalRegister.addEventListener('show.bs.modal', (event) => {
            this.fetchUrl = event.relatedTarget.dataset.url;
            this.registerConfirmPassword.value = '';
            this.registerEmail.value = '';
            this.registerName.value = '';
            this.registerPassword.value = '';
        });

        // View
        this.modalView.addEventListener('show.bs.modal', (event) => {
            document.getElementById('modalViewWarning').style.display = 'none';
            this.viewCreatedAt.value = '';
            this.viewId.value = event.relatedTarget.dataset.id;
            this.viewName.value = event.relatedTarget.dataset.name;
            this.viewRating.value = event.relatedTarget.dataset.rating;
            this.viewYear.value = event.relatedTarget.dataset.year;
            this.viewUpdatedAt.value = '';
            const url = event.relatedTarget.dataset.url;
            this.httpClient.get(
                url,
                {},
                data => this.responseShow(data)
            );
        });

        // Create Event
        this.modalCreateButton.addEventListener('click', (event) => {
            this.httpClient.post(
                this.fetchUrl,
                {
                    name: this.createName.value,
                    rating: this.createRating.value,
                    year: this.createYear.value,
                    page: this.responseContent.currentPage
                },
                (data) => this.responseCreate(data)
            );
        });

        
        // Delete Event
        this.modalDeleteButton.addEventListener('click', (event) => {
            this.httpClient.delete(
                this.fetchUrl,
                {
                    page: this.responseContent.currentPage
                },
                (data) => this.responseDelete(data));
        });
    
        // Edit Event
        this.modalEditButton.addEventListener('click', (event) => {
            this.httpClient.put(
                this.fetchUrl,
                {
                    name: this.editName.value,
                    rating: this.editRating.value,
                    year: this.editYear.value,
                    page: this.responseContent.currentPage
                },
                (data) => this.responseEdit(data)
            );
        });
        
        // Login Event
        this.modalLoginUserButton.addEventListener('click', (event) => {
            this.httpClient.post(
                this.fetchUrl,
                {
                    email: this.loginEmail.value,
                    password: this.loginPassword.value,
                },
                (data) => this.responseLogin(data)
            );
        });

        // Register Event
        this.modalRegisterUserButton.addEventListener('click', (event) => {
            this.httpClient.post(
                this.fetchUrl,
                {
                    name: this.registerName.value,
                    email: this.registerEmail.value,
                    password: this.registerPassword.value,
                    password_confirmation: this.registerConfirmPassword.value
                },
                (data) => this.responseRegister(data)
            );
        });
    }

    formattedDate(date) {
        date = new Date(date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    responseCommonContent(data) {
        this.responseContent.setContent(data);
        let link = document.getElementById('logoutLink');
        if (link) {
            link.addEventListener('click', (event) => {
                this.httpClient.post(
                    link.dataset.url,
                    {},
                    (data) => console.log(data) 
                );
            });
        }
    }

    responseCreate(data) {
        if (data.result) {
            this.filmSuccess.style.display = 'block';
            bootstrap.Modal.getInstance(this.modalCreate).hide();
            this.init();
            setTimeout(() => {
                this.filmSuccess.style.display = 'none';
            }, 4000);
        } else {
            document.getElementById('modalCreateWarning').style.display = 'block';
        }
    }

    responseDelete(data) {
        if (data.result) {
            this.filmSuccess.style.display = 'block';
            bootstrap.Modal.getInstance(this.modalDelete).hide();
            this.init();
            setTimeout(() => {
                this.filmSuccess.style.display = 'none';
            }, 4000);
        } else {
            document.getElementById('modalDeleteWarning').style.display = 'block';
        }
    }

    responseEdit(data) {
        if (data.result) {
            this.filmSuccess.style.display = 'block';
            bootstrap.Modal.getInstance(this.modalEdit).hide();
            this.init();
            setTimeout(() => {
                this.filmSuccess.style.display = 'none';
            }, 4000);
        } else {
            document.getElementById('modalEditWarning').style.display = 'block';
        }
    }

    responseLogin(data) {
        if (data.result) {
            // Update user area with received user data
            this.responseContent.setUserContent(data.user);
            // Hide the login modal
            bootstrap.Modal.getInstance(this.modalLogin).hide();
            console.log("Login correcto");
            // Attach logout event handler
            this.attachLogoutHandler();
        } else {
            console.log("Error en el login: " + data.message);
            document.getElementById("modalViewWarning").style.display = "block";
        }
    }

    responseRegister(data) {
        if (data.result) {
            // Auto-login: update user area with the new user data
            this.responseContent.setUserContent(data.user);
            // Hide the register modal
            bootstrap.Modal.getInstance(this.modalRegister).hide();
            console.log("Registro correcto, usuario logueado automáticamente");
            // Attach logout event handler
            this.attachLogoutHandler();
        } else {
            console.log("Error en el registro: " + data.message);
            document.getElementById("modalViewWarning").style.display = "block";
        }
    }

    responseLogout(data) {
        if (data.result) {
            // Clear the user area to show login/register links
            this.responseContent.setUserContent(null);
            console.log("Logout correcto");
        } else {
            console.log("Error al hacer logout: " + data.message);
            document.getElementById("modalViewWarning").style.display = "block";
        }
    }

    attachLogoutHandler() {
        // Find the logout link added in setCurrentUserContent
        let logoutLink = document.getElementById("logoutLink");
        if (logoutLink) {
            logoutLink.addEventListener("click", (event) => {
                event.preventDefault();
                // Send AJAX POST to logout URL
                this.httpClient.post(logoutLink.dataset.url, {}, (data) =>
                    this.responseLogout(data)
                );
            });
        }
    }

    responseShow(data) {
        const { id, name, rating, created_at, updated_at } = data.film;
        this.viewCreatedAt.value = this.formattedDate(created_at);
        this.viewId.value = id;
        this.viewName.value = name;
        this.viewRating.value = rating;
        this.viewYear.value = year;
        this.viewUpdatedAt.value = this.formattedDate(updated_at);
    }

    init() {
        this.httpClient.get(
            '/film',
            {},
            (data) => {
                this.responseCommonContent(data);
            }
        );
    }
}