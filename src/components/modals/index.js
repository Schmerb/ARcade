import React, { Component } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import hexToRgba from 'hex-rgba'

import { BG_COLOR } from 'utils/styles'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => hexToRgba(BG_COLOR, props.opacity || 60)};
  width: 100%;
  height: 100%;
`

const TitleBar = styled.div`
  border-bottom: 1px solid lightgrey;
  h1 {
    padding: 5px 0;
    margin: 0;
    text-align: center;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 10px;
`

const customStyles = (props) => ({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    ...(props && props.overlay)
  },
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    background: 'transparent',
    color: '#fff',
    overflow: 'hidden',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '0',
    ...(props && props.content)
  }
})

export default class Modal extends Component {
  render () {
    return (
      <ReactModal
        shouldCloseOnOverlayClick={this.props.shouldCloseOnOverlayClick}
        ariaHideApp={false}
        isOpen={this.props.isOpen}
        onAfterOpen={this.props.onAfterOpen}
        onRequestClose={this.props.onRequestClose}
        style={customStyles(this.props.customStyles)}
        contentLabel='Modal'>
        <Container opacity={this.props.opacity}>
          <TitleBar>
            <h1>{this.props.title}</h1>
          </TitleBar>
          <Content style={this.props.containerStyle}>
            {this.props.children}
          </Content>
        </Container>
      </ReactModal>
    )
  }
}
