import { useNavigate } from 'react-router-dom';
import './index.css'

const Open=props=>{
    const navigate=useNavigate()
    const user=()=>{
        navigate('/userlogin')
    }
    const admin=()=>{
        navigate('/adminlogin')
    }
    return(
    <div className="openBg">
        <div className='b'>
        <h1>Courier Tracking System</h1>
        <br/>
        <div className="openC1">
            <button onClick={user}>Login as User</button>
            <button onClick={admin}>Login as Admin</button>
        </div>
        </div>
    </div>
    )
}
export default Open