import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './../index.css';
import Navbar from '../components/Navbar';

class FormAddDoctor extends Component {
    constructor() {
        super();
        this.state = {

        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('token') === null) {
            window.location.href = "http://localhost:3005/connection";
        } else {
            console.log(sessionStorage.getItem('token'));
        }
    }

    handleSubmit(event) {
        if (sessionStorage.getItem('token') !== null) {
            var input_firstname = document.getElementById('input_firstname').value;
            var input_lastname = document.getElementById('input_lastname').value;

            var feedback = '';

            if (input_firstname.trim() === '' || input_lastname.trim() === '') {
                feedback = 'Le nom et le prénom ne peuvent pas être vides.'
                document.getElementById('feedback_error').innerHTML = feedback;
            } else {
                var dataForm = {
                    firstname: input_firstname,
                    lastname: input_lastname
                };

                var jsonDataForm = JSON.stringify(dataForm);

                fetch("http://localhost:3000/api/doctor", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    },
                    body: jsonDataForm
                }).then(res => res.json())
                    .then((result) => {
                        if (result['error'] !== undefined) {
                            window.location.href = "http://localhost:3005/connection";
                        } else {
                            feedback = 'Ajout effectué avec succès.';
                            document.getElementById('feedback_success').innerHTML = feedback;
                        }
                    });
            }
        } else {
            window.location.href = "http://localhost:3005/connection";
        }

        event.preventDefault();
    }

    render() {
        return (
            <React.StrictMode>
                <Navbar />
                <div className="ButtonsLine">
                    <Link to="/manage_doctors"><span className="ButtonType">Gestion des médecins</span></Link>
                </div>
                <form className="FormXS" onSubmit={this.handleSubmit}>
                    <p className="formTitle">Nouveau médecin</p>
                    <label>Prénom</label>
                    <input type="text" name="firstname" id="input_firstname" />
                    <label>Nom</label>
                    <input type="text" name="lastname" id="input_lastname" />
                    <br />
                    <input className="ButtonValidation" type="submit" value="Ajouter" />
                    <span className="FeedbackSuccess" id="feedback_success"></span>
                    <span className="FeedbackError" id="feedback_error"></span>
                </form>
            </React.StrictMode>
        )
    }
}

export default FormAddDoctor;
