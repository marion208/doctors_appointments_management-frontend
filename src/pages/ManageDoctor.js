import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from './../components/Navbar';
import DoctorCard from './../components/DoctorCard';

class ManageDoctor extends Component {
    constructor() {
        super();
        this.state = {
            doctors: []
        };

    }

    componentDidMount() {
        if (sessionStorage.getItem('token') !== null) {
            fetch("http://localhost:3000/api/doctor", {
                headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
            })
                .then(res => res.json())
                .then((result) => {
                    if (result['error'] !== undefined) {
                        window.location.href = "http://localhost:3005/connection";
                    } else {
                        this.setState({
                            doctors: result
                        });
                    }
                })
        } else {
            window.location.href = "http://localhost:3005/connection";
        }
    }

    render() {
        return (
            <React.StrictMode>
                <Navbar />
                <div className="ButtonsLine">
                    <Link to="/add_doctor"><span className="ButtonType">Ajouter un médecin</span></Link>
                </div>
                <div>
                    {this.state.doctors.map(item => (
                        <DoctorCard key={item._id} iddoc={item._id} firstname={item.firstname} lastname={item.lastname}></DoctorCard>
                    ))}
                </div>
            </React.StrictMode>
        )
    }
}

export default ManageDoctor;