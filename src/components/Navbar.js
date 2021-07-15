import { Link } from "react-router-dom";
import './../App.css';

function Navbar() {
    return (
        <div className="navbar">
            <header>
                <nav>
                    <div className="leftNav">
                        <Link to="/"><span>Accueil</span></Link>
                        <Link to="/add_appointment"><span>Ajouter un rendez-vous</span></Link>
                    </div>
                    <Link to="/connection"><span onClick={() => sessionStorage.removeItem('token')}>Se déconnecter</span></Link>
                </nav>
            </header>
        </div>
    );
}

export default Navbar;
