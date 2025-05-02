import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../utils/api';

function AssignAdmin() {
  const { user, isLoggedIn, roles } = useAuth();
  const roleName = "ADMIN";
  console.log(isLoggedIn)
  console.log(roles)
  const userId = user.id;
  const [message, setMessage] = useState(null)


  const assignAdmin = async () => {
    try {
      const response = await api.post("/roles/assign", { userId, roleName });
      setMessage(response.data)

    } catch (err) {
      console.error(err)
      setMessage(err)
    }
  }

  if (!isLoggedIn) {
    return <p>You must be logged in for this</p>;
  }
  return (
    <div>
      <button onClick={assignAdmin}>click me!</button>
      {message && (
        <p>{message}</p>
      )}
    </div>
  )
}

export default AssignAdmin
