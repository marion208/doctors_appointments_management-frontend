import { Component } from 'react';
import './../App.css';
import './styles_components/DoctorCard.css';

class DoctorCard extends Component {
    constructor() {
        super();
        this.state = {
            listSelectHours: [],
            listSelectMinutes: ['00', '15', '30', '45'],
            showDoctorCardContent: false,
            showFormAbsence: false,
            absences: [],
            showListAbsence: false
        };
        this.showDoctorCardContent = this.showDoctorCardContent.bind(this);
        this.showFormAbsence = this.showFormAbsence.bind(this);
        this.showListAbsence = this.showListAbsence.bind(this);
        this.deleteDoctor = this.deleteDoctor.bind(this);
        this.handleNewAbsence = this.handleNewAbsence.bind(this);
        this.deleteAbsence = this.deleteAbsence.bind(this);
    }

    componentDidMount() {
        var listHours = [];

        for (var i = 9; i < 20; i++) {
            listHours.push(i);
        }

        this.setState({
            listSelectHours: listHours
        });
    }

    showDoctorCardContent() {
        this.setState({
            showDoctorCardContent: !this.state.showDoctorCardContent
        })
    }

    showFormAbsence() {
        this.setState({
            showFormAbsence: !this.state.showFormAbsence
        })
    }

    showListAbsence() {
        this.setState({
            showListAbsence: !this.state.showListAbsence
        }, () => this.updateListAbsence());
    }

    updateListAbsence() {
        if (this.state.showListAbsence === true) {
            var beginDate = new Date(8640000000000000);
            var endDate = Date.now();
            fetch("http://localhost:3000/api/absence/" + this.props.iddoc + "/" + beginDate + '/' + endDate, {
                headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
            })
                .then(res => res.json())
                .then((result) => {
                    if (result['error'] !== undefined) {
                        window.location.href = "http://localhost:3005/connection";
                    } else {
                        var absences_result = result;
                        var listAbsences = [];
                        absences_result.forEach(element => {
                            var dateBegin = new Date(element.date_begin);
                            var dateEnd = new Date(element.date_end);
                            var minutesBegin;
                            if (dateBegin.getMinutes() === 0) {
                                minutesBegin = '00';
                            } else {
                                minutesBegin = dateBegin.getMinutes();
                            }
                            var minutesEnd;
                            if (dateEnd.getMinutes() === 0) {
                                minutesEnd = '00';
                            } else {
                                minutesEnd = dateEnd.getMinutes();
                            }
                            var absence = {
                                'id': element._id,
                                'begin': dateBegin.getDate() + '/' + (dateBegin.getMonth() + 1) + '/' + dateBegin.getFullYear() + ' ' + dateBegin.getHours() + 'h' + minutesBegin,
                                'end': dateEnd.getDate() + '/' + (dateEnd.getMonth() + 1) + '/' + dateEnd.getFullYear() + ' ' + dateEnd.getHours() + 'h' + minutesEnd
                            };
                            listAbsences.push(absence);
                        });
                        console.log(listAbsences);
                        this.setState({
                            absences: listAbsences
                        });
                    }
                });
        }
    }

    deleteDoctor(id) {
        if (sessionStorage.getItem('token') !== null) {
            fetch("http://localhost:3000/api/doctor/" + id, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(res => res.json())
                .then((result) => {
                    if (result['error'] !== undefined) {
                        window.location.href = "http://localhost:3005/connection";
                    } else {
                        document.getElementById('card' + id).remove();
                    }
                })
        } else {
            window.location.href = "http://localhost:3005/connection";
        }
    }

    handleNewAbsence(id_doctor) {
        if (sessionStorage.getItem('token') !== null) {
            var date_begin_input = document.getElementById('date_begin');
            var hour_begin_input = document.getElementById('select_hours_begin');
            var minute_begin_input = document.getElementById('select_minutes_begin');
            var date_end_input = document.getElementById('date_end');
            var hour_end_input = document.getElementById('select_hours_end');
            var minute_end_input = document.getElementById('select_minutes_end');

            if (date_begin_input !== null && hour_begin_input !== null && minute_begin_input !== null && date_end_input !== null && hour_end_input !== null && minute_end_input) {
                var date_begin = date_begin_input.value;
                var hour_begin = hour_begin_input.value;
                var minute_begin = minute_begin_input.value;
                var date_end = date_end_input.value;
                var hour_end = hour_end_input.value;
                var minute_end = minute_end_input.value;

                var doctor = id_doctor;

                var feedback = '';

                if (date_begin === '' || hour_begin === '' || minute_begin === '' || date_end === '' || hour_end === '' || minute_end === '') {
                    feedback = 'Tous les champs doivent être renseignés.'
                    document.getElementById('feedback_error').innerHTML = feedback;
                } else {
                    var dateBegin = new Date(date_begin.split('-')[0], date_begin.split('-')[1] - 1, date_begin.split('-')[2], hour_begin, minute_begin);
                    var dateEnd = new Date(date_end.split('-')[0], date_end.split('-')[1] - 1, date_end.split('-')[2], hour_end, minute_end);
                    var dataForm = {
                        id_doctor: doctor,
                        date_begin: dateBegin,
                        date_end: dateEnd
                    };

                    var jsonDataForm = JSON.stringify(dataForm);

                    fetch("http://localhost:3000/api/absence", {
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
                                feedback = 'Ajout effectué avec succès.'
                                document.getElementById('feedback_success').innerHTML = feedback;
                            }
                        })
                }
            }
        } else {
            window.location.href = "http://localhost:3005/connection";
        }
    }

    deleteAbsence(id_absence) {
        if (sessionStorage.getItem('token') !== null) {
            fetch("http://localhost:3000/api/absence/" + id_absence, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(res => {
                this.updateListAbsence();
            });
        } else {
            window.location.href = "http://localhost:3005/connection";
        }
    }

    render() {
        const { showDoctorCardContent, showFormAbsence, showListAbsence } = this.state;
        return (
            <div id={"card" + this.props.iddoc} className="doctorCard" >
                <div className="doctorCardHeader" onClick={() => { this.showDoctorCardContent() }}>
                    <span>{this.props.firstname} {this.props.lastname}</span>
                </div>
                {
                    showDoctorCardContent && (
                        <div className="doctorCardContent">
                            <p onClick={() => { this.deleteDoctor(this.props.iddoc) }} className="ButtonType">Supprimer ce docteur</p>
                            <p onClick={() => { this.showFormAbsence() }} className="ButtonType">Ajouter une absence</p>
                            {
                                showFormAbsence && (
                                    <div>
                                        <div className="divFormAbsenceDoctor">
                                            <label>Absence du </label>
                                            <input className="inputDateAbsence" type="date" name="date_begin" id="date_begin" />
                                            <select className="selectDateAbsence" name="select_hours_begin" id="select_hours_begin">
                                                <option value=""></option>
                                                {this.state.listSelectHours.map(item => (
                                                    <option key={'begin' + item} value={item}>{item}h</option>
                                                ))}
                                            </select>
                                            <select className="selectDateAbsence" name="select_minutes_begin" id="select_minutes_begin">
                                                <option value=""></option>
                                                {this.state.listSelectMinutes.map(item => (
                                                    <option key={'begin' + item} value={item}>{item}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="divFormAbsenceDoctor">
                                            <label>Au </label>
                                            <input className="inputDateAbsence" type="date" name="date_end" id="date_end" />
                                            <select className="selectDateAbsence" name="select_hours_end" id="select_hours_end">
                                                <option value=""></option>
                                                {this.state.listSelectHours.map(item => (
                                                    <option key={'end' + item} value={item}>{item}h</option>
                                                ))}
                                            </select>
                                            <select className="selectDateAbsence" name="select_minutes_end" id="select_minutes_end">
                                                <option value=""></option>
                                                {this.state.listSelectMinutes.map(item => (
                                                    <option key={'end' + item} value={item}>{item}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <p className="FeedbackSuccess" id="feedback_success"></p>
                                            <p className="FeedbackError" id="feedback_error"></p>
                                            <button className="ButtonValidation" value="Ajouter" onClick={() => this.handleNewAbsence(this.props.iddoc)}>Ajouter</button>
                                        </div>
                                    </div>
                                )
                            }
                            <p onClick={() => { this.showListAbsence() }} className="ButtonType">Liste des absences</p>
                            {
                                showListAbsence && (
                                    <div className="listAbsence">
                                        {this.state.absences.map(item => (
                                            <div key={item.id}>
                                                <p>Absence du {item.begin} au {item.end} <span className="button_delete_absence" title="Supprimer l'absence" onClick={() => this.deleteAbsence(item.id)}>x</span></p>
                                            </div>
                                        ))}
                                        {this.state.absences.length === 0 ? <p>Aucune absence à venir</p> : ''}
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div >
        );
    }
}

export default DoctorCard;
