import React, { Component } from "react";

class EditableComponent extends Component {
  constructor() {
    super();
    this.state = {
      isActive: false,
      value: undefined,
      originValue: undefined
    };
  }

  componentDidMount() {
    // const { entity, entityField } = this.props;
    // const value = entity[entityField];
    this.setOriginValue();
  }

  setOriginValue = () => {
    const { entity, entityField } = this.props;
    this.setState({
      value: entity[entityField],
      originValue: entity[entityField],
      isActive: false
    });
  };

  componentDidUpdate() {
    const { errors, entityField, resetErrors } = this.props;

    if (errors && errors.length > 0 && errors[0].title === entityField) {
      this.setOriginValue();
      resetErrors();
    }
  }

  disableEdit = () => {
    this.setState({ isActive: false });
  };

  enableEdit = () => {
    this.setState({ isActive: true });
  };

  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  update = () => {
    const { updateRental, entityField } = this.props;
    const { value, originValue } = this.state;

    if (value !== originValue) {
      updateRental({ [entityField]: value });
      this.setState({ isActive: false, originValue: value });
    }
  };
}

export default EditableComponent;
