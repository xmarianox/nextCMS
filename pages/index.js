import React, { PureComponent } from 'react';
import Head from 'next/head';
import App from '../components/App';
import fetch from 'isomorphic-fetch';

import { 
  Layout,
  Alert,
  Form,
  Input,
  Icon,
  Button 
} from 'antd'

const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;


export default class extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      emailValid: true,
      userPassword: '',
      formValid: true,
      errorMessage: ''
    };

    this.date = new Date().getFullYear();

    // events
    this._handleChangeUser = this._handleChangeUser.bind(this);
    this._handleChangePassword = this._handleChangePassword.bind(this);
    this._handleClearUser = this._handleClearUser.bind(this);
    this._handleClearPassword = this._handleClearPassword.bind(this);
    this._handleSubmitForm = this._handleSubmitForm.bind(this);
  }

  _handleChangeUser = (event) => this.setState({ userName: event.target.value });

  _handleChangePassword = (event) => this.setState({ userPassword: event.target.value });

  _handleClearUser = () => {
    this.userNameInput.focus();
    this.setState({ userName: '' });
  };

  _handleClearPassword = () => {
    this.userPassInput.focus();
    this.setState({ userPassword: '' });
  };

  _validateEmail = (email) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  };

  _handleSubmitForm = () => {

    if (!this._validateEmail(this.state.userName)) {
      this.setState({ emailValid: false });
    }

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        logemail: this.state.userName,
        logpassword: this.state.userPassword,
      }),
    })
    .then((response) => response.json())
    .then((json) => {
      // console.log(JSON.stringify(json));
      if (!json.status) {
        this.setState({
          formValid: false,
          errorMessage: json.message
        });
      }
      else {
        window.location.replace('/profile');
      }

    })
    .catch((err) => {
      console.log(`Server error: ${err}`);
    });

  }

  _renderEmailAlert = () => {
    if (this.state.emailValid) return null;
    return (
      <div className="alert-container">
        <Alert
          message="Error"
          description="Debes ingresar un email valido."
          type="error"
          showIcon
        />
      </div>
    );
  }

  _renderAlert = () => {
    if (this.state.formValid) return null;
    return (
      <div className="alert-container">
        <Alert
          message="Error"
          description={this.state.errorMessage}
          type="error"
          showIcon
        />
      </div>
    );
  }

  render() {
    const { userName, userPassword } = this.state;
    const suffix = userName ? <Icon type="close-circle" onClick={this._handleClearUser} /> : null;
    const suffixPass = userPassword ? <Icon type="close-circle" onClick={this._handleClearPassword} /> : null;

    return (
      <App>
        <style jsx global>{`
          .layout-form {
            min-height: calc(100vh - 83px);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          }
          .login-form {
            max-width: 300px;
          }
          .login-form-forgot {
            float: right;
          }
          .login-form-button {
            width: 100%;
          }
          .layout-footer {
            text-align: center;
          }
          .alert-container {
            position: absolute;
            width: 70%;
            bottom: 90px;
            left: 0;
            right: 0;
            margin: 0 auto;
          }
        `}</style>
        <Layout>

          <Content className="layout-form">
            <Form className="login-form">
              <FormItem>
                <Input
                  id="user"
                  type="email"
                  placeholder="Usuario o email"
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={suffix}
                  value={userName}
                  onChange={this._handleChangeUser}
                  ref={node => this.userNameInput = node}
                />

                <Input 
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={suffixPass}
                  value={userPassword}
                  onChange={this._handleChangePassword}
                  ref={node => this.userPassInput = node}
                />

                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={this._handleSubmitForm}
                >
                  Ingresar
                </Button>

              </FormItem>
            </Form>
          </Content>

          {this._renderEmailAlert()}
          {this._renderAlert()}

          <Footer className="layout-footer">
            <p>NextCMS ©{this.date} - Develop by Mariano Molina.</p>
          </Footer>

        </Layout>
      </App>
    );
  }
}