import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { refreshTokens } from './redux/auth'

import Users from './pages/users'
import Login from './pages/login';

class App extends Component {

  componentDidMount = () => this.props.refreshTokens()

  render() {
    const { loggedIn } = this.props
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route
              path="/login"
              render={props => loggedIn ? <Redirect to={{ pathname: '/' }} /> : <Login {...props} />}
            />
            <Route
              path="/"
              render={props => !loggedIn ? <Redirect to={{ pathname: '/login' }} /> : <Users {...props} />}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}
  
const mapStateToProps = state => ({
  loggedIn: state.login.logIn
})

const mapDispatchToProps = {
  refreshTokens
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
