import React from "react";

import { loginUser } from "../../dataAccess/userRepository/helpers";
import SignInForm from "../../components/Signs/SignInForm";

class SignInContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: ""
    };
  }

  handleChange = e => {
    const { name } = e.target;
    this.setState({ [name]: e.target.value });
  };

  logUser = async () => {
    const { login, password } = this.state;
    const payload = { login, password };
    await loginUser(payload).then(() => {
      console.log("srabotalo??????"); // rabotaet ksta
    });
  };

  render() {
    return (
      <>
        <SignInForm logUser={this.logUser} handleChange={this.handleChange} />
      </>
    );
  }
}

export default SignInContainer;