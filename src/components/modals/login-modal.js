import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import hexToRgba from 'hex-rgba'

// import { openLoginModal } from 'actions/display'
import Modal from './index.js'

import { BG_COLOR } from 'utils/styles'
import ArcadeIcon from 'svg/arcade.svg'

const containerStyles = {
  justifyContent: 'space-around',
  alignItems: 'center'
}

const LogoWrap = styled.div`
`

const Logo = styled.img`
  height: 100px;
  width: auto;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 0 auto;
`

const Input = styled.input`
  background-color: ${BG_COLOR};
  height: 35px;
  line-height: 35px;
  padding-left: 5px;
  margin-bottom: 5px;
  border: none;
  border-radius: 3px;

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px ${hexToRgba('#fff', 20)} inset;
  }
  ::-webkit-input-placeholder {
    color: white;
  }
`

const Button = styled.button`
  background-color: transparent;
  color: white;
  margin-top: 5px;  
  padding: 15px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 3px;
  border: 1px solid white;

  &:hover {
    background-color: ${hexToRgba(BG_COLOR, 100)};
  }
  &:active {
    background-color: white;
    color: black;
  }
`

class LoginModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  // componentDidMount () {
  //   this.setState({ isOpen: true })
  // }

  handleLogin = (e) => {
    e.preventDefault()
    // let form = e.target
    let username = this.username.value
    let password = this.password.value

    console.log({username, password})
    if (username.trim() === 'admin' && password.trim() === 'admin') {
      console.log('Success')
      this.props.history.push('/')
    } else {
      console.log('Login failed')
    }
  }

  render () {
    console.log({LoginModal_props: this.props})
    return (
      <Modal
        shouldCloseOnOverlayClick={false}
        isOpen={this.props.isOpen}
        onAfterOpen={this.onAfterOpen}
        onRequestClose={this.closeModal}
        title='Welcome to Urban Arcade!'
        opacity={70}
        customStyles={{content: { height: '350px', minWidth: '200px', maxWidth: '600px' }}}
        containerStyle={containerStyles}>
        <LogoWrap>
          <Logo src={ArcadeIcon} className='App-logo' alt='Urban Arcade logo' />
        </LogoWrap>
        <Form innerRef={ref => { this.form = ref }} onSubmit={this.handleLogin}>
          <Input
            name='username' type='text' placeholder='Email/Username' required
            innerRef={ref => { this.username = ref }} />
          <Input
            name='password' type='password' placeholder='Password' required
            innerRef={ref => { this.password = ref }} />
          <Button type='submit'>Login</Button>
        </Form>
      </Modal>
    )
  }
}

const mapStoreToProps = state => ({
  loginIsOpen: state.loginIsOpen
})

export default withRouter(connect(mapStoreToProps)(LoginModal))
