import React, { Component } from 'react';
import './../index.css';
import Navbar from '../components/Navbar';

class FormAddAppointment extends Component {
    constructor() {
        super();
        this.state = {
            doctors: [],
            list_days: this.getListDaysOfWeek(),
            list_schedule: [],
            showDoctorSchedule: false,
            dateAppointment: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateDoctorPlanning = this.updateDoctorPlanning.bind(this);
        this.getListSchedule = this.getListSchedule.bind(this);
        this.addNewAppointment = this.addNewAppointment.bind(this);
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
                });
        } else {
            window.location.href = "http://localhost:3005/connection";
        }
    }

    getListDaysOfWeek() {
        var timestamp = Date.now();
        var monday = this.getFirstDayOfWeek(timestamp);
        var daysWeek = [];
        var namesDays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        daysWeek[0] = { longday: namesDays[monday.getDay()], day: monday.getDay(), date: monday.getDate(), month: monday.getMonth(), year: monday.getFullYear() };
        var nbDay = 1;
        while (nbDay < 7) {
            var newday = this.getFollowingDates(monday.getTime(), nbDay);
            daysWeek[nbDay] = newday;
            nbDay++;
        }
        return daysWeek;
    }

    getFirstDayOfWeek(timestamp) {
        var tempDay = new Date(timestamp);
        if (tempDay.getDay() === 1) {
            return tempDay;
        } else {
            var count = 1;
            var nbDay;
            while (nbDay !== 1) {
                tempDay = new Date(timestamp - (count * (60 * 60 * 24) * 1000));
                nbDay = tempDay.getDay();
                count++;
            }
            return tempDay;
        }
    }

    getFollowingDates(time, nbDays) {
        var newtime = new Date((nbDays * (60 * 60 * 24) * 1000) + time);
        var day = newtime.getDay();
        var date = newtime.getDate();
        var month = newtime.getMonth();
        var namesDays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        return { longday: namesDays[day], day: day, date: date, month: month, year: newtime.getFullYear() };
    }

    getListDaysOfNextWeek() {
        var firstday = new Date(this.state.list_days[0]['year'], this.state.list_days[0]['month'], this.state.list_days[0]['date']);
        var monday = new Date(firstday.getTime() + 7 * (60 * 60 * 24) * 1000);
        var listDays = [];
        var namesDays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        listDays[0] = { longday: namesDays[monday.getDay()], day: monday.getDay(), date: monday.getDate(), month: monday.getMonth(), year: monday.getFullYear() };
        var nbDay = 1;
        while (nbDay < 7) {
            var newday = this.getFollowingDates(monday.getTime(), nbDay);
            listDays[nbDay] = newday;
            nbDay++;
        }
        this.setState({
            list_days: listDays
        }, () => this.updateDoctorPlanning());
    }

    getListDaysOfPreviousWeek() {
        var firstday = new Date(this.state.list_days[0]['year'], this.state.list_days[0]['month'], this.state.list_days[0]['date']);
        var monday = new Date(firstday.getTime() - 7 * (60 * 60 * 24) * 1000);
        var namesDays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        var listDays = [];
        listDays[0] = { longday: namesDays[monday.getDay()], day: monday.getDay(), date: monday.getDate(), month: monday.getMonth(), year: monday.getFullYear() };
        var nbDay = 1;
        while (nbDay < 7) {
            var newday = this.getFollowingDates(monday.getTime(), nbDay);
            listDays[nbDay] = newday;
            nbDay++;
        }
        this.setState({
            list_days: listDays
        }, () => this.updateDoctorPlanning());
    }

    updateDoctorPlanning() {
        if (sessionStorage.getItem('token') !== null) {
            if (document.getElementById('doctor-select').value !== '') {
                var id_doctor = document.getElementById('doctor-select').value;
                var appointments_result = [];
                this.setState({
                    list_schedule: this.getListSchedule()
                });
                fetch("http://localhost:3000/api/appointment/" + id_doctor, {
                    headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
                })
                    .then(res => res.json())
                    .then((result) => {
                        if (result['error'] !== undefined) {
                            window.location.href = "http://localhost:3005/connection";
                        } else {
                            appointments_result = result;
                            var updatingSchedule = this.state.list_schedule;
                            appointments_result.forEach(element => {
                                var dateAppointment = new Date(element.date_appointment);
                                var yearAppointment = dateAppointment.getFullYear();
                                var monthAppointment = dateAppointment.getMonth();
                                var dateOfAppointment = dateAppointment.getDate();
                                var dayAppointment = dateAppointment.getDay();
                                if (dayAppointment !== 0) {
                                    dayAppointment--;
                                } else {
                                    dayAppointment = 6;
                                }
                                var hourAppointment = dateAppointment.getHours();
                                var minuteAppointment = dateAppointment.getMinutes();
                                var timeAppointment;
                                if (minuteAppointment === 0) {
                                    timeAppointment = '' + yearAppointment + '-' + monthAppointment + '-' + dateOfAppointment + '-' + hourAppointment + ':0' + minuteAppointment;
                                } else {
                                    timeAppointment = '' + yearAppointment + '-' + monthAppointment + '-' + dateOfAppointment + '-' + hourAppointment + ':' + minuteAppointment;
                                }
                                var indexTime = updatingSchedule[dayAppointment].findIndex(item => item.fulldatetime === timeAppointment);
                                if (indexTime !== -1) {
                                    updatingSchedule[dayAppointment][indexTime]['name'] = element.firstname_patient + ' ' + element.lastname_patient;
                                }
                            });
                            this.setState({
                                showDoctorSchedule: true
                            });
                            var beginWeek = new Date(this.state.list_days[0]['year'], this.state.list_days[0]['month'], this.state.list_days[0]['date']);
                            var endWeek = new Date(this.state.list_days[6]['year'], this.state.list_days[6]['month'], this.state.list_days[6]['date']);
                            fetch("http://localhost:3000/api/absence/" + id_doctor + "/" + endWeek + '/' + beginWeek, {
                                headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
                            })
                                .then(res => res.json())
                                .then((result) => {
                                    if (result['error'] !== undefined) {
                                        window.location.href = "http://localhost:3005/connection";
                                    } else {
                                        var absences_result = result;
                                        var updatingSchedule = this.state.list_schedule;
                                        var quarterMilliSeconds = 15 * 60 * 1000;
                                        absences_result.forEach(element => {
                                            var dateBegin = new Date(element.date_begin);
                                            var dateEnd = new Date(element.date_end);

                                            var listTimeAbsence = [];
                                            listTimeAbsence.push(dateBegin);

                                            var dateReference = dateBegin;
                                            var count = 1;
                                            var timestamp = dateReference.getTime();

                                            while (dateReference < dateEnd) {
                                                dateReference = new Date(timestamp + (count * quarterMilliSeconds));
                                                if (dateReference.getHours() > 9 || dateReference.getHours() < 20) {
                                                    listTimeAbsence.push(dateReference);
                                                }
                                                count++;
                                            }
                                            listTimeAbsence.forEach(element => {
                                                var year = element.getFullYear();
                                                var month = element.getMonth();
                                                var date = element.getDate();
                                                var day = element.getDay();
                                                if (day !== 0) {
                                                    day--;
                                                } else {
                                                    day = 6;
                                                }
                                                var hour = element.getHours();
                                                var minute = element.getMinutes();
                                                var time;
                                                if (minute === 0) {
                                                    time = '' + year + '-' + month + '-' + date + '-' + hour + ':0' + minute;
                                                } else {
                                                    time = '' + year + '-' + month + '-' + date + '-' + hour + ':' + minute;
                                                }

                                                var indexTime = updatingSchedule[day].findIndex(item => item.fulldatetime === time);
                                                if (indexTime !== -1) {
                                                    updatingSchedule[day][indexTime]['absence'] = true;
                                                }
                                            });
                                        });
                                        this.setState({
                                            list_schedule: updatingSchedule
                                        });
                                    }
                                });
                        }
                    })
            }
        } else {
            window.location.href = "http://localhost:3005/connection";
        }
    }

    getListSchedule() {
        var schedule = [];
        for (let i = 0; i < 7; i++) {
            var hours = [];
            for (let j = 9; j < 20; j++) {
                var first_quarter = j.toString() + ':00';
                var second_quarter = j.toString() + ':15';
                var third_quarter = j.toString() + ':30';
                var fourth_quarter = j.toString() + ':45';
                hours.push(
                    {
                        'datetime': first_quarter,
                        'name': '',
                        'fulldatetime': this.state.list_days[i]['year'] + '-' + this.state.list_days[i]['month'] + '-' + this.state.list_days[i]['date'] + '-' + j + ':00',
                        'absence': false
                    },
                    {
                        'datetime': second_quarter,
                        'name': '',
                        'fulldatetime': this.state.list_days[i]['year'] + '-' + this.state.list_days[i]['month'] + '-' + this.state.list_days[i]['date'] + '-' + j + ':15',
                        'absence': false
                    },
                    {
                        'datetime': third_quarter,
                        'name': '',
                        'fulldatetime': this.state.list_days[i]['year'] + '-' + this.state.list_days[i]['month'] + '-' + this.state.list_days[i]['date'] + '-' + j + ':30',
                        'absence': false
                    },
                    {
                        'datetime': fourth_quarter,
                        'name': '',
                        'fulldatetime': this.state.list_days[i]['year'] + '-' + this.state.list_days[i]['month'] + '-' + this.state.list_days[i]['date'] + '-' + j + ':45',
                        'absence': false
                    });
            }
            schedule[i] = hours;
        }
        return schedule;
    }

    handleSubmit(event) {
        if (sessionStorage.getItem('token') !== null) {
            var firstname = document.getElementById('input_firstname').value;
            var lastname = document.getElementById('input_lastname').value;
            var tel = document.getElementById('input_tel').value;
            var doctor = document.getElementById('doctor-select').value;
            var date = this.state.dateAppointment;

            var feedback = '';

            if (firstname.trim() === '' || lastname.trim() === '' || tel.trim() === '' || doctor.trim() === '' || date === '') {
                feedback = 'Tous les champs doivent être renseignés.'
                document.getElementById('feedback_error').innerHTML = feedback;
            } else {
                var dataForm = {
                    id_doctor: doctor,
                    firstname_patient: firstname,
                    lastname_patient: lastname,
                    tel_patient: tel,
                    date_appointment: date
                };

                var jsonDataForm = JSON.stringify(dataForm);

                fetch("http://localhost:3000/api/appointment", {
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
        } else {
            window.location.href = "http://localhost:3005/connection";
        }
        event.preventDefault();
    }

    addNewAppointment(datetimevalue) {
        var current_selected = document.getElementsByClassName('time_selected');
        for (var j = 0; j < current_selected.length; j++) {
            current_selected[j].classList.add('time_available');
            current_selected[j].classList.remove('time_selected');
        }
        var el = document.getElementById('timeid' + datetimevalue);
        el.classList.remove('time_available');
        el.classList.add('time_selected');
        var datetimetemp = new Date(datetimevalue);
        var gooddatetime = datetimetemp.setMonth(datetimetemp.getMonth() + 1);
        this.setState({
            dateAppointment: gooddatetime
        })
    }

    render() {
        return (
            <React.StrictMode>
                <Navbar />
                <form onSubmit={this.handleSubmit}>
                    <div className="FormAppointment">
                        <p className="formTitle">Identité du patient</p>
                        <label>Prénom</label>
                        <input type="text" name="firstname" id="input_firstname" />
                        <label>Nom</label>
                        <input type="text" name="lastname" id="input_lastname" />
                        <label>Numéro de téléphone</label>
                        <input type="tel" name="tel" id="input_tel" />
                    </div>
                    <br />
                    <div>
                        <select className="selectDoctorPlanning" name="doctor" id="doctor-select" onChange={this.updateDoctorPlanning}>
                            <option value="">--Sélectionner un médecin--</option>
                            {this.state.doctors.map(item => (
                                <option key={item._id} value={item._id}>{item.firstname + " " + item.lastname}</option>
                            ))}
                        </select>
                        {this.state.showDoctorSchedule && (
                            <div id="divDoctorSchedule">
                                <div className="ButtonsManageWeek">
                                    <span className="ButtonType" onClick={() => { this.getListDaysOfPreviousWeek() }}>&lt;&lt; Semaine précédente</span>
                                    <span className="ButtonType" onClick={() => { this.getListDaysOfNextWeek() }}>Semaine suivante &gt;&gt;</span>
                                </div>
                                <div className="HeaderDaysPlanning">
                                    {this.state.list_days.map(item => (
                                        <span key={item.date}>{item.longday} {item.date}/{(item.month < 9) ? '0' + (item.month + 1) : (item.month + 1)}</span>
                                    ))}
                                </div>
                                <div className="schedule">
                                    {this.state.list_schedule.map((item, i) => (
                                        <div className="columnSchedule" key={i}>
                                            {item.map((mapitem, j) => (
                                                <div className="" key={j}>
                                                    {mapitem.name === '' ?
                                                        mapitem.absence === true ?
                                                            <span className="time_button time_absence">{mapitem.datetime}</span> :
                                                            <span className="time_button time_available time_hover" id={"timeid" + mapitem.fulldatetime} onClick={() => { this.addNewAppointment(mapitem.fulldatetime) }}>{mapitem.datetime}</span> :
                                                        <span className="time_button time_busy">{mapitem.datetime}</span>
                                                    }
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <br />
                                <span className="FeedbackSuccess" id="feedback_success"></span>
                                <span className="FeedbackError" id="feedback_error"></span>
                                <br />
                                <input className="ButtonValidation" type="submit" value="Ajouter" />
                            </div>
                        )}
                    </div>
                </form>
            </React.StrictMode>
        )
    }
}

export default FormAddAppointment;
