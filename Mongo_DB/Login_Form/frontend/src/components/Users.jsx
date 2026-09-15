import React, { useEffect, useState } from 'react'

const Users = () => {
    const [users, setUsers] = useState([]);
      useEffect(() => {
        const getAllUsers = async () => {
          const responce = await fetch("http://localhost:3000/users")
          const data = await responce.json()
          setUsers(data.data)
        }
        getAllUsers()
      }, [users]);
  return (
    <div>
      {users.length > 0 ? users.map(u=>(
        <div key={u._id}>
        <h2>{u.name}</h2>
        <p>{u.email}</p>
      </div>
      )) : <div><p>No user found</p></div>}
    </div>
  )
}

export default Users
