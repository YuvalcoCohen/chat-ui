
//This is your top level React component, you may change everything

import React from 'react'
import logo from '../assets/spotim-logo.jpg'
import avatar1 from '../assets/avatar1.jpg'
import avatar2 from '../assets/avatar2.jpg'
import avatar3 from '../assets/avatar3.jpg'
import avatar4 from '../assets/avatar4.jpg'
import avatar5 from '../assets/avatar5.jpg'
import avatar6 from '../assets/avatar6.jpg'
import {Container, Image} from 'semantic-ui-react'
import styled from 'styled-components';
import io from "socket.io-client";

const Logo = styled.div`
      img{
        margin-left: auto;
        margin-right: auto;
        margin-top: 15px;      
      }
      
`;



const messages=[];
const socket = io("https://spotim-demo-chat-server.herokuapp.com");
const print= (m)=>{
  console.log(m);
  console.log(m.username);
  if (m.username===localUsername){m.type='my-message';}
  else {m.type='other-user-message';}
  messages.push(m);
  displayMessages();

}

const createMessageHTML=(m)=>{
  if (m.type==="my-message"){
    return `<div id= 'my-message' className={'my-message'}>
    <div id='my-message-details' className={'my-message-details'}>
      <p id='my-username' className={'my-username'}>You</p>
      <p id='${m.av ? m.av : ''}' className={'my-avatar'}></p>
    </div>
      <p id='my-message-content' className={'my-message-content'}>${m.content}</p>
  </div>`
    
  }
  else {
    return `<div id='other-user-message' className={'other-user-message'}>
    <div id= 'othe-user-message-details' className={'othe-user-message-details'}>
      <p id='other-user-username' className={'other-user-username'}>${m.username}</p>
      <p id='${m.av ? m.av : ''}' className={'other-user-avatar'}></p>
    </div>
      <p id='other-user-message-content' className={'other-user-message-content'}>${m.content}</p>
  </div>`
    
  }
}

const displayMessages=()=>{
  const messagesHTML =messages.map(m => createMessageHTML(m)).join('');
  document.getElementById('message-list-area').innerHTML=messagesHTML;
  //document.getElementsByClassName('message-list-area').innerHTML = messagesHTML;
}

var localUsername='';

class App extends React.PureComponent {
  constructor(props){
    super(props);
    this.state={
      username: '',
      message: '',
      avatar: ''
      
    };
    
    this.handleChangeUsername=this.handleChangeUsername.bind(this);
    this.handleChangeMessage=this.handleChangeMessage.bind(this);
    this.handleSubmitMessage=this.handleSubmitMessage.bind(this);
    this.handleChangeAvatar=this.handleChangeAvatar.bind(this);
  }


  

  
  handleChangeUsername(event) {
    this.setState({username: event.target.value});
    localUsername=event.target.value;
  }

  
  handleChangeAvatar(event) {
    this.setState({avatar: event.target.value});
  }

  
  handleChangeMessage(event) {
    this.setState({message: event.target.value});
  }

  handleSubmitMessage(event) {
    if (!this.state.username) {return;}  //can't send a message with no username.
    if (!this.state.message) {return;}  //users can't send empty messages.
    event.preventDefault();
    //create a message and send it:
    const msg={av: this.state.avatar,
               username: this.state.username, 
               content: this.state.message};
    socket.emit("spotim/chat", msg);
   
    this.setState({message:null});
    document.getElementById('textArea').value='';
  }
  
 
  render() {
    return <div>
      <Container className={'spotim-header'}>
        <div className={'spotim-title'}>
          Welcome to the Spot.IM Chat app
        </div>
        <div>
          <Logo>
            <Image size={'tiny'} src={logo}/>
          </Logo>
        </div>
      </Container>
      <Container id='message-list-area' className={'message-list-area'}></Container>
      <Container id='message-creation-area' className={'message-creation-area'}>
        <div id='textField-for-username' className={'textField-for-username'}>
          <form>
            <label>
              Username:
              <input type="usernameText" value={this.state.username} onChange={this.handleChangeUsername} />
            </label>
          </form>
        </div>
        <div id='avatar-select' className={'avatar-select'}>
        <form>
          <label id='pickAv'>
            Pick your avatar: </label>
            <input type="radio" name='thing' id="thing1" value="thing1" onChange={this.handleChangeAvatar}/><label for='thing1'></label> 
            <input type="radio" name='thing' id="thing2" value="thing2" onChange={this.handleChangeAvatar}/><label for='thing2'></label> 
            <input type="radio" name='thing' id="thing3" value="thing3" onChange={this.handleChangeAvatar}/><label for='thing3'></label> 
            <input type="radio" name='thing' id="thing4" value="thing4" onChange={this.handleChangeAvatar}/><label for='thing4'></label> 
            <input type="radio" name='thing' id="thing5" value="thing5" onChange={this.handleChangeAvatar}/><label for='thing5'></label> 
            <input type="radio" name='thing' id="thing6" value="thing6" onChange={this.handleChangeAvatar}/><label for='thing6'></label> 
        </form>
       </div>
        <div id='textField-for-message' className={'textField-for-message'}>
          <form onSubmit={this.handleSubmitMessage}>
            <label>
              Your message:
              <input type="text" id='textArea' value={this.state.message} onChange={this.handleChangeMessage} />
            </label>
            <input type="submit" value="Send" />
          </form>
        </div>
      </Container>
    </div>
    
  }
}

export {print};
export default App;