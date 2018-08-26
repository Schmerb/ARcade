import _ from 'lodash'
import React, { Component } from 'react'
import { connectAdvanced } from 'react-redux'
import Widget from '../widget'
import ReactTable from 'react-table'
import { defaultDeptRoster } from 'dforce/actions/selectors'
import { getAlias, getUserDevice } from 'dforce/utils/users'
import { subscribe } from 'dforce/actions/subscriptions'
import styled from 'styled-components'
import locationSvg from 'dforce/svg/location'
import { cellphoneIcon, computerIcon, clearTextIcon, searchIcon, searchIcon2 } from 'dforce/svg/general'
import { absMiddle } from 'dforce/styles/layout'
import 'react-table/react-table.css' // base css for react-table
import { dfLog } from 'dforce/logger'
let Container = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  overflow-y: scroll;
`
let PresenceIcon = styled.div`
  border-radius: 99px;
  background: ${props => props.color};
  width: 1em;
  height: 1em;
`
let LocationIcon = styled.img`
  width: 1em;
  height: 1em;
`
const presenceSort = {
  'online': 2,
  'available': 2,
  'unavailable': 1,
  'offline': 0
}
const presenceColor = {
  'online': '#0F0',
  'available': '#0F0',
  'unavailable': '#ccc',
  'offline': '#fff'
}
const sortString = (a, b) => {
  a = a || 'zzz'
  b = b || 'zzz'
  return a === b
    ? 0
    : a > b || b === ''
      ? 1
      : -1
}
const columns = [{
  Header: '',
  id: 'presence',
  accessor: 'presence',
  style: absMiddle,
  sortMethod: (a, b) => {
    let aWeight = a ? presenceSort[a] : -1
    let bWeight = b ? presenceSort[b] : -1
    return aWeight === bWeight
      ? 0
      : aWeight > bWeight ? 1 : -1
  },
  width: 50,
  filterable: false,
  resizable: false,
  Cell: row => row.value
    ? <PresenceIcon color={presenceColor[row.value]} />
    : <div />
}, {
  Header: 'User',
  id: 'username',
  accessor: i => (i.user || i).username || ''
  /* sortMethod: (a, b) => a === b
    ? 0
    : a > b ? 1 : -1 */
  // sortMethod: Array.sort
}, {
  Header: 'Alias',
  id: 'alias',
  accessor: i => getAlias((i.user || i)),
  sortMethod: sortString
}, {
  Header: 'L',
  id: 'location',
  accessor: i => i,
  width: 50,
  style: absMiddle,
  filterable: false,
  resizable: false,
  Cell: row => row.value.user
    ? <LocationIcon src={locationSvg(row.value)} />
    : <div />
}, {
  Header: 'Dev',
  id: 'device',
  accessor: i => getUserDevice(i),
  width: 50,
  style: absMiddle,
  filterable: false,
  resizable: false,
  Cell: row => {
    switch (row.value) {
      case 'my':
      case 'cc':
        return <img style={{ height: '30px' }} src={computerIcon()} />
      case 'hh':
        return <img style={{ height: '30px' }} src={cellphoneIcon()} />
      default:
        return <div />
    }
  }
}, {
  Header: 'Status',
  id: 'status',
  accessor: i => (i.user || i).status || '',
  style: { textAlign: 'center' },
  maxWidth: 100,
  filterable: false,
  resizable: false,
  Cell: row => row.value
    ? <div style={{color: row.value.color}}>{row.value.value}</div>
    : <div />
}, {
  Header: 'Notes',
  id: 'notes',
  accessor: i => (i.user || i).notes || '',
  style: { textAlign: 'center' },
  maxWidth: 200,
  filterable: false
}]
class DeptRoster extends Component {
  constructor (props) {
    super(props)
    this.state = {
      search: '',
      searching: false,
      data: Object.values(props.roster)
    }
    this.subscribed = false
  }
  componentDidMount () {
    this.setState({ data: Object.values(this.props.roster) })
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.ready) {
      this.subscribeToDept()
    }
  }
  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.roster && this.props.roster) {
      this.setState({ data: Object.values(this.props.roster) })
    }
    if (!prevState.searching && this.state.searching) {
      this.input && this.input.focus()
    }
  }
  // TODO: make this a reusable redux "action"?
  subscribeToDept (jid) {
    if (this.subscribed) return
    this.subscribed = true
    let { dispatch, defaultDept } = this.props
    let jidArray = defaultDept ? [defaultDept] : []
    let subscription = {
      presence: jidArray,
      location: jidArray
    }
    dispatch(subscribe(subscription, true))
  }
  handleSearchClick = (e) => {
    console.log('handleSearchClick')
    this.setState({ searching: true })
  }
  handleClearSearchClick = () => {
    this.setState({ search: '' })
  }
  /**
   * Sets up props for each cell that will be rendered in table
   *
   * @param {object} state
   * @param {object} rowInfo
   * @param {*} column
   * @param {object} instance
   * @returns props object - props to be set on each table cell
   * @memberof DevRoster
   */
  setTdProps = (state, rowInfo, column, instance) => ({
    onClick: (e, handleOriginal) => {
      const { username, alias, presence, location, device, status, notes } = rowInfo.row
      let jid = _.get(location, 'jid', _.get(location, ['user', 'jid'], 'NO JID'))
      dfLog('UI', { username, alias, presence, location, device, status, notes })
      dfLog('UI', `${username} was clicked!`)
      dfLog('UI', alias)
      dfLog('UI', jid)
      dfLog('UI', `device: ${device}`)
      status !== '' && dfLog('UI', status)
      notes !== '' && dfLog('UI', notes)
      console.log('\n\n')
      console.log(rowInfo.row)
      console.log('\n\n')
      // IMPORTANT! React-Table uses onClick internally to trigger
      // events like expanding SubComponents and pivots.
      // By default a custom 'onClick' handler will override this functionality.
      // If you want to fire the original onClick handler, call the
      // 'handleOriginal' function.
      if (handleOriginal) {
        handleOriginal()
      }
    },
    onDoubleClick: (e, handleOriginal) => {
      dfLog('UI', 'onDoubleClick')
      if (handleOriginal) {
        handleOriginal()
      }
    }
  })
  /**
   * Sets the props for each row in table
   *
   * @returns props object - props to be set on each table row
   * @memberof DevRoster
   */
  setTrProps = (state, rowInfo, column, instance) => ({
    style: {
      height: 30
    }
  })
  render () {
    let { search } = this.state
    let data = Object.values(this.props.roster)
    if (search) {
      search = search.toLowerCase()
      data = data.filter(row => (
        _.includes(row.username.toLowerCase(), search) ||
        _.includes(row.alias.toLowerCase(), search)
      ))
    }
    const wrapperStyles = {
      position: 'relative',
      height: '30px'
      // border: '1px solid pink'
    }
    const inputWrapperStyles = {
      ...absMiddle,
      justifyContent: 'flex-start',
      backgroundColor: 'white',
      width: this.state.searching ? '160px' : '0px',
      height: '25px',
      float: 'left',
      overflow: 'hidden'
      // border: '1px solid lightblue'
    }
    const inputStyles = {
      height: '25px',
      lineHeight: '25px',
      paddingLeft: '5px',
      opacity: this.state.searching ? '1' : '0',
      transition: 'all 0.2s ease',
      outline: 'none',
      border: 'none'
    }
    const iconStyles = {
      width: !this.state.searching ? '25px' : '0px',
      height: '25px',
      float: 'left',
      opacity: !this.state.searching ? '1' : '0',
      cursor: 'pointer'
    }
    const clearTextStyles = {
      width: '25px',
      height: '25px',
      cursor: 'pointer'
    }
    return (
      <Widget title='Roster' {...this.props}>
        <Container>
          <div style={wrapperStyles}>
            <img onClick={this.handleSearchClick} style={iconStyles} src={searchIcon()} />
            <div style={inputWrapperStyles}>
              <input type='text'
                style={inputStyles}
                placeholder='Search for user...'
                value={this.state.search}
                ref={ref => { this.input = ref }}
                disable={this.state.searching ? 'false' : 'true'}
                onChange={e => this.setState({search: e.target.value})} />
              {this.state.search !== '' && <img onClick={this.handleClearSearchClick} style={clearTextStyles} src={clearTextIcon()} />}
            </div>
          </div>
          <ReactTable
            data={data}
            className='-highlight -striped'
            columns={columns}
            defaultSorted={[
              {id: 'presence', desc: true},
              {id: 'alias', desc: false}
            ]}
            getTrProps={this.setTrProps}
            getTdProps={this.setTdProps}
            // page={0} // the index of the page you wish to display
            // pageSize={4}
          />
        </Container>
      </Widget>
    )
  }
}
const mapStoreToProps = (dispatch, options) =>
  (state, passedProps) => {
    let { defaultDept, ready } = state
    let roster = defaultDept
      ? defaultDeptRoster(state)
      : {}
    return { ...passedProps, dispatch, defaultDept, roster, ready }
  }
export default connectAdvanced(mapStoreToProps, {withRef: true})(DeptRoster)
