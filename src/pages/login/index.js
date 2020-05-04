import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'react-final-form';
import Form from '../../components/Form';
import { logInUser } from '../../redux/auth';
import {
  TextField,
  PasswordField,
} from '../../components/Form/Inputs';
import {
  composeValidators,
  makeFormValidator,
  validationTexts,
  isEmptyValue
} from "../../components/Form/validation";

const texts = {
  name: "Please enter name",
  password: 'Please enter password',
  btn: "Log in",
}

const defaultData = {
  grant_type: "password",
  client_id: 2,
  client_secret: "A70gUEybx2na3RqMIvpbasaWJCLIKEF6Q1FpIpo3",
}

class Login extends Form {

  onValidate = makeFormValidator({
    username: composeValidators({
      [validationTexts.required]: value => value === undefined || value.toString().trim().length === 0,
      [validationTexts.minLength(3)]: value => value ? value.length < 3 : false,
    }),
    password: composeValidators({
      [validationTexts.required]: isEmptyValue
    }),
  });

  onSubmit = props => {
    const { logInUser } = this.props;
   
    logInUser({
      ...defaultData,
      ...props
    })
  }

  renderFields = () => (
    <>
      <div className="login-form" >
        <Field
          className="login-form__field"
          name="username"
          component={TextField}
          placeholder="Please enter"
          label={texts.name}
          required
        />
      </div>
      <div className="login-form_item">
        <Field
          className="login-form__field"
          name="password"
          component={PasswordField}
          placeholder="Please enter"
          label={texts.password}
          required
        />
      </div>
      <div className="login-form__submit">
        <button className="c-button" disabled={this.props.loading} type="submit">{texts.btn}</button>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  loading: state.login.loading
})


const mapDispatchToProps = {
  logInUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);