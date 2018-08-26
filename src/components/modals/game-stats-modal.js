import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import hexToRgba from 'hex-rgba'
import faker from 'faker'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

// import Modal from './index.js'

// import { BG_COLOR } from 'utils/styles'
// import ArcadeIcon from 'svg/arcade.svg'

const Container = styled.div`
  background-color: rgba(35,46,51,0.9);
  color: white;
  width: 75%;
  max-width: 600px;
  padding: 10px;
  margin: 0 auto;
  margin-top: 100px;
  border-radius: 5px;
  overflow: hidden;

  h1 {
    margin: 0;
  }
`

const InnerContainer = styled.div`
  padding: 10px;
  border-radius: 8px;  
  border: 1px solid ${hexToRgba('#aaa', 80)};
`

const Button = styled.button`
  background-color: rgba(255,255,255,0.2);
  color: white;
  padding: 15px;
  cursor: pointer;
  border: none;
  border-radius: 2px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255,255,255,0.4);
    color: white;
  }
`

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    text-align: left;
  }
`

const getGoogleUrl = ({lat, lng}) => `http://www.google.com/maps/place/${lat},${lng}`

function openInNewTab (url) {
  var win = window.open(url, '_blank')
  win.focus()
}

/**
 * Returns true if a includes b, case-insentiive
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean} whether a includes b or not
 */
const _includes = (a, b) => _.includes(a.toLowerCase(), b.toLowerCase())

const columns = [{
  Header: 'Name',
  id: 'name',
  accessor: 'name',
  width: 120,
  filterable: true,
  filterMethod: (filter, row) => _includes(row.name, filter.value)
}, {
  Header: 'Address',
  id: 'address',
  accessor: game => {
    let { street, city, state } = game.address
    return <List>
      <li>{street}</li>
      <li>{city}</li>
      <li>{state}</li>
    </List>
  }
}, {
  Header: 'Coordinates',
  id: 'coordinates',
  accessor: game => game.coords.lat + ', ' + game.coords.lng,
  Cell: props => {
    console.log({props})
    return <Button>{props.value}</Button>
  }
}, {
  Header: 'Times Played',
  id: 'timesPlayed',
  accessor: game => game.timesPlayed,
  width: 100,
  resizable: false
}]

class GameStatsModal extends Component {
  getData = () => {
    let arr = [1, 2, 3, 4, 5, 6]
    return arr.map(mem => {
      const randomCard = faker.helpers.createCard() // random contact card containing many properties
      const coords = randomCard.address.geo
      const { city, country, state, streetA, streetB, streetC, streetD } = randomCard.address
      const { name, username, phone, email, website, accountHistory } = randomCard
      console.log(username, phone, email, website)
      let arr = [ streetA, streetB, streetC, streetD ]
      let i = Math.floor(Math.random() * 4)
      let i2 = Math.floor(Math.random() * 3)
      let street = arr[i]
      let timesPlayed = Math.floor(Number(accountHistory[i2].amount))
      let { lat, lng } = coords

      const game = {
        name,
        address: { street, city, state, country },
        coords: { lat, lng },
        timesPlayed
      }
      // console.log({game})
      return game
    })
  }

  setTdProps = (state, rowInfo, column, instance) => ({
    onClick: (e, handleOriginal) => {
      switch (column.id) {
        case 'coordinates':
          let coords = rowInfo.row._original.coords
          openInNewTab(getGoogleUrl(coords))
          break
        default:
          console.log({state, rowInfo, column, instance})
      }

      if (handleOriginal) {
        handleOriginal()
      }
    },
    onDoubleClick: () => {
      console.log('double clicked!')
    }
  })

  /**
   * Props for each row in table
   *
   * @memberof GameStatsModal
   */
  setTrProps = (state, rowInfo, column, instance) => ({
    style: {
      marginBottom: 20,
      border: '1px solid lightlblue'
    }
  })

  render () {
    console.log({GameStatsModal_props: this.props})
    return (
      <Container>
        <InnerContainer>
          <h1>Games</h1>
          <ReactTable
            data={this.getData()}
            className='-highlight -striped'
            columns={columns}
            defaultSorted={[
              {id: 'timesPlayed', desc: true}
            ]}
            getTrProps={this.setTrProps}
            getTdProps={this.setTdProps}
            // page={0} // the index of the page you wish to display
            pageSize={5}
          />
        </InnerContainer>
      </Container>
    )
  }
}

const mapStoreToProps = state => ({
  loginIsOpen: state.loginIsOpen
})

export default withRouter(connect(mapStoreToProps)(GameStatsModal))

// getUrl = coords => {
//   console.log('\n\n')
//   console.log(coords)
//   console.log('\n\n')
//   return '/'
// }

// const GamesList = styled.ul`
//   list-style: none;
//   padding: 0;
//   padding-left: 20px;
//   margin: 0;
// `

// const GameItem = styled.li`
//   text-align: left;
//   border-bottom: 1px solid pink;
//   margin-top: 20px;
//   margin-bottom: 20px;
// `

// const List = styled.ul`
//   list-style: none;

//   > li {
//     display: inline-block;
//     margin-right: 40px;
//   }
// `

// const Address = styled.ul`
// border: 2px solid yellow;
//   > li {
//   display: block;
//   }
// `

// renderGames = () => {
//   let arr = [1, 2, 3, 4, 5, 6]
//   return arr.map(mem => {
//     const randomCard = faker.helpers.createCard() // random contact card containing many properties
//     const coords = randomCard.address.geo
//     const { city, country, state, streetA, streetB, streetC, streetD } = randomCard.address
//     const { name, username, phone, email, website, accountHistory } = randomCard

//     let arr = [ streetA, streetB, streetC, streetD ]
//     let index = Math.floor(Math.random() * 4)
//     let index2 = Math.floor(Math.random() * 3)
//     let street = arr[index]
//     let timesPlayed = Math.floor(Number(accountHistory[index2].amount))
//     let { lat, lng } = coords

//     const user = {
//       name,
//       addres: { street, city, state, country },
//       coords: { lat, lng },
//       timesPlayed
//     }

//     return (
//       <GameItem key={mem}>

//         <List>
//           <li>{name}</li>
//           <li>
//             <Address>
//               <li>{street}</li>
//               <li>{city}</li>
//               <li>{state}</li>
//               <li>{country}</li>
//             </Address>
//           </li>
//           <li>
//             <Link to={this.getUrl(coords)}>
//               {coords.lat},
//               {coords.lng}
//             </Link>
//           </li>
//           <li>Times Played: {timesPlayed}</li>
//         </List>
//       </GameItem>
//     )
//   })
// }
