import React, { Component } from 'react';
import { Form as FinalForm } from 'react-final-form';

export default class Form extends Component {

  renderForm = props => {
    const { handleSubmit } = props;
    return (
      <form onSubmit={handleSubmit}>
        {this.renderFields(props)}
      </form>
    )
  }

  getFormValues = () => this.props.values;

  render() {
    return (
      <section className="main-content__form">
        <FinalForm
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          initialValues={this.getFormValues()}
          validate={this.onValidate}
          render={this.renderForm}
        />
      </section>
    )
  }
}
