import { OPEN_LOGIN_MODAL } from 'actions/display'

export function loginIsOpen (state = true, action) {
  switch (action.type) {
    case OPEN_LOGIN_MODAL:
      return action.isOpen
    default:
      break
  }
  return state
}
