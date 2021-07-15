import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Homepage from './pages/Homepage';
import ManageDoctor from './pages/ManageDoctor';
import FormAddDoctor from './pages/FormAddDoctor';
import FormAddAppointment from './pages/FormAddAppointment';
import Planning from './pages/Planning';
import Connection from './pages/Connection';

const Main = () => {
    return (
        <Switch> {/* The Switch decides which component to show based on the current URL.*/}
            <Route exact path='/' component={Homepage}></Route>
            <Route exact path='/connection' component={Connection}></Route>
            <Route exact path='/add_appointment' component={FormAddAppointment}></Route>
            <Route exact path='/planning' component={Planning}></Route>
            <Route exact path='/manage_doctors' component={ManageDoctor}></Route>
            <Route exact path='/add_doctor' component={FormAddDoctor}></Route>
        </Switch>
    );
}

export default Main;