import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './../index.css';
import Navbar from './../components/Navbar';
import HomepageCard from './../components/HomepageCard';

class Homepage extends Component {
    constructor() {
        super();
        this.state = {
            showHomeContent: true,
            showManageDoctors: false,
        };
        this.showHomeContent = this.showHomeContent.bind(this);
        this.hideComponent = this.hideComponent.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('token') === null) {
            window.location.href = "http://localhost:3005/connection";
        }
    }

    showHomeContent() {
        this.setState({
            showHomeContent: true,
            showManageDoctors: false
        })
    }

    hideComponent(name) {
        switch (name) {
            case "homeContent":
                this.setState({ showHomeContent: !this.state.showHomeContent });
                break;
            case "manageDoctors":
                this.setState({ showManageDoctors: !this.state.showManageDoctors });
                break;
            default:
        }
    }

    render() {
        const { showHomeContent } = this.state;
        return (
            <React.StrictMode>
                <Navbar />
                {showHomeContent && (
                    <div className="homepageCardContainer">
                        <Link to="/add_appointment"><HomepageCard title="Ajouter un rendez-vous" /></Link>
                        <Link to="/planning"><HomepageCard title="Plannings" /></Link>
                        <Link to="/manage_doctors"><HomepageCard title="Gestion des médecins" /></Link>
                    </div>
                )}
            </React.StrictMode>
        )
    }
}

export default Homepage;
