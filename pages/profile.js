import React, { PureComponent } from 'react';

export default class extends PureComponent {
  // static async getInitialProps({ req, res }) {
  //   if (req === '' || req === undefined) res.redirect('/');
  //   console.log(`user: ${req.user.name}`);
  // }

  render() {
    return (
      <div>
        <h1>Hola!</h1>
      </div>
    );
  }
}