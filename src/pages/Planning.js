import React, { Component } from "react";
import Navbar from './../components/Navbar';

class Planning extends Component {
    constructor() {
        super();
        this.state = {
            list_days: this.getListDaysOfWeek(),
            list_schedule: [],
            doctors: []
        };
        this.getListDaysOfWeek = this.getListDaysOfWeek.bind(this);
        this.updateDoctorPlanning = this.updateDoctorPlanning.bind(this);
        this.deleteAppointment = this.deleteAppointment.bind(this);
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
                                    updatingSchedule[dayAppointment][indexTime]['tel'] = element.tel_patient;
                                    updatingSchedule[dayAppointment][indexTime]['idappointment'] = element._id;
                                }
                            });
                            this.setState({
                                list_schedule: updatingSchedule
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
                                            console.log(element);
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
                    });
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
                        'fulldatetime': this.state.list_days[i]['year'] + '-' + this.state.list_days[i]['month'] + '-' + this.state.list_days[i]['date'] + '-' + j + ':00',
                        'datetime': first_quarter,
                        'name': '',
                        'tel': '',
                        'idappointment': '',
                        'absence': false
                    },
                    {
                        'fulldatetime': this.state.list_days[i]['year'] + '-' + this.state.list_days[i]['month'] + '-' + this.state.list_days[i]['date'] + '-' + j + ':15',
                        'datetime': second_quarter,
                        'name': '',
                        'tel': '',
                        'idappointment': '',
                        'absence': false
                    },
                    {
                        'fulldatetime': this.state.list_days[i]['year'] + '-' + this.state.list_days[i]['month'] + '-' + this.state.list_days[i]['date'] + '-' + j + ':30',
                        'datetime': third_quarter,
                        'name': '',
                        'tel': '',
                        'idappointment': '',
                        'absence': false
                    },
                    {
                        'fulldatetime': this.state.list_days[i]['year'] + '-' + this.state.list_days[i]['month'] + '-' + this.state.list_days[i]['date'] + '-' + j + ':45',
                        'datetime': fourth_quarter,
                        'name': '',
                        'tel': '',
                        'idappointment': '',
                        'absence': false
                    });
            }
            schedule[i] = hours;
        }
        return schedule;
    }

    deleteAppointment(id) {
        if (sessionStorage.getItem('token') !== null) {
            fetch("http://localhost:3000/api/appointment/" + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(res => {
                this.updateDoctorPlanning();
            });
        } else {
            window.location.href = "http://localhost:3005/connection";
        }
    }

    render() {
        return (
            <React.StrictMode>
                <Navbar />
                <div className="ButtonsManageWeek">
                    <span className="ButtonType" onClick={() => { this.getListDaysOfPreviousWeek() }}>&lt;&lt; Semaine précédente</span>
                    <span className="ButtonType" onClick={() => { this.getListDaysOfNextWeek() }}>Semaine suivante &gt;&gt;</span>
                </div>
                <div>
                    <select className="selectDoctorPlanning" name="doctor" id="doctor-select" onChange={this.updateDoctorPlanning}>
                        <option value="">--Sélectionner un médecin--</option>
                        {this.state.doctors.map(item => (
                            <option key={item._id} value={item._id}>{item.firstname + " " + item.lastname}</option>
                        ))}
                    </select>
                    <div className="HeaderDaysPlanning">
                        {this.state.list_days.map(item => (
                            <span key={item.date}>{item.longday} {item.date}/{(item.month < 9) ? '0' + (item.month + 1) : (item.month + 1)}</span>
                        ))}
                    </div>
                    <div className="schedule">
                        {this.state.list_schedule.map((item, i) => (
                            <div className="columnSchedule" key={i}>
                                {item.map(mapitem => (
                                    <div className="gridSchedule" key={mapitem.datetime}>
                                        {mapitem.name === '' ?
                                            mapitem.absence === true ?
                                                <span className="time_button time_absence">{mapitem.datetime}</span> :
                                                <span className="time_button time_available">{mapitem.datetime}</span> :
                                            <span className="time_button time_busy">{mapitem.datetime}</span>
                                        }
                                        <span className="schedule_name">{mapitem.name}</span>
                                        <span className="schedule_tel">{mapitem.tel}</span>
                                        <span className="schedule_button_delete" title="Supprimer le rendez-vous" onClick={() => this.deleteAppointment(mapitem.idappointment)}>{mapitem.name === '' ? '' : 'x'}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </React.StrictMode>
        )
    }
}

export default Planning;