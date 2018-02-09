import React from 'react';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {utente: 'Anonymous'};
  }

  componentDidMount() {
    this.UserProfile();
  }

  UserProfile() {
    var that = this;
    $.getJSON('/profile', function(data) {
      that.setState({utente: data.user.displayName}, function() {
        console.log(this.state.utente, 'displayName');
      });
    });
  }

  render() {
    return (
      <p>Ciao, { this.state.utente }</p>
    );
  }
}
