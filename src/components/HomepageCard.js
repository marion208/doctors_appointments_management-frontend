import './../App.css';
import './styles_components/HomepageCard.css';
import BtnPlus from './../img/btn-add.svg';

function HomepageCard(props) {
    return (
        <div className="homeCard">
            <img src={BtnPlus} alt="Accueil" className="btnPlusHomepageCard" />
            <p>{props.title}</p>
        </div>
    );
}

export default HomepageCard;
