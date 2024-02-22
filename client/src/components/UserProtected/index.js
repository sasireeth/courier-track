import {Navigate, Route} from 'react-router-dom'
import Cookie from 'js-cookie'

const UserProtected = props => {
  const token = Cookie.get('user_token')
  if (token === undefined) {
    return <Navigate to="/login" />
  }
  return <Route {...props} />
}
export default UserProtected