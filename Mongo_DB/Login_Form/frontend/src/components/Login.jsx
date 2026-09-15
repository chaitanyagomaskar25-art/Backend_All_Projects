import React from 'react'
import {useForm}  from 'react-hook-form'

const Login = () => {
    const {register, handleSubmit, reset} = useForm()
    const onSubmit = (data)=>{
        console.log(data)
        const createUser = async () => {
            const responce = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const answer = await responce.json()
            
            reset()
        }
        createUser()
    }
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("name")}/>
        <input type="email" {...register("email")} />
        <input type="password" {...register("password")}/>
        <button type='submit'>Add</button>
      </form>
    </div>
  )
}

export default Login
