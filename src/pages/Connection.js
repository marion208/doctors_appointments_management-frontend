import React, { Component } from 'react';
import './../index.css';

class Connection extends Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        var input_pseudo = document.getElementById('input_pseudo').value;
        var input_pswd = document.getElementById('input_pswd').value;

        var feedback = '';

        if (input_pseudo.trim() === '' || input_pswd.trim() === '') {
            feedback = 'Tous les champs doivent être renseignés.'
            document.getElementById('feedback_error').innerHTML = feedback;
        } else {
            var dataForm = {
                pseudo: input_pseudo,
                password: input_pswd
            };

            var jsonDataForm = JSON.stringify(dataForm);

            fetch("http://localhost:3000/api/auth/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: jsonDataForm
            }).then(res => res.json())
                .then((result) => {
                    if (result['error'] !== undefined) {
                        feedback = result['error'];
                        document.getElementById('feedback_error').innerHTML = feedback;
                    } else {
                        if (result['token'] !== undefined) {
                            sessionStorage.setItem('token', result['token']);
                            window.location.href = "http://localhost:3005/";
                        }
                    }
                });
        }
        event.preventDefault();
    }

    render() {
        return (
            <React.StrictMode>
                <form onSubmit={this.handleSubmit}>
                    <div className="formConnection">
                        <p className="formTitle">Connexion</p>
                        <label>Pseudo</label>
                        <input type="text" name="pseudo" id="input_pseudo" />
                        <label>Mot de passe</label>
                        <input type="password" name="pswd" id="input_pswd" />
                        <br />
                        <span className="FeedbackSuccess" id="feedback_success"></span>
                        <span className="FeedbackError" id="feedback_error"></span>
                        <br />
                        <input className="ButtonValidation" type="submit" value="Se connecter" />
                    </div>
                </form>
            </React.StrictMode>
        )
    }
}

export default Connection;