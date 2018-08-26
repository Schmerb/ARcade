import React, { Component } from 'react'
// import styled from 'styled-components'
// import hexToRgba from 'hex-rgba'
import Modal from './index.js'

// import { BG_COLOR } from 'utils/styles'
// import ArcadeIcon from 'svg/arcade.svg'

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   background-color: ${props => hexToRgba(BG_COLOR, props.opacity || 60)};
//   width: 100%;
//   height: 100%;
// `

export default class AddGameModal extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <Modal
        shouldCloseOnOverlayClick={false}
        isOpen={this.props.isOpen}
        onAfterOpen={this.onAfterOpen}
        onRequestClose={this.closeModal}
        title='Welcome to Urban Arcade!'
        opacity={70}
        customStyles={{content: { height: '350px', minWidth: '200px', maxWidth: '600px' }}}
        containerStyle={{width: '100%', height: '100%'}}>
        <h1>Add Game Modal</h1>
      </Modal>
    )
  }
}
