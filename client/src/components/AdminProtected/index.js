import {Navigate, Route} from 'react-router-dom'
import Cookie from 'js-cookie'

const AdminProtected = props => {
  const token = Cookie.get('admin_token')
  if (token === undefined) {
    return <Navigate to="/login" />
  }
  return <Route {...props} />
}
export default AdminProtected