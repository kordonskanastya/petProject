import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        email: '', password: ''
    })

    useEffect( () => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHander = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)
        } catch (e) {}
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch (e) {}
    }

    return (
        <div className='row'>
            <div className='coll s6 offset-s3'>
                <h1>Pet Project</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Athorization</span>
                        <div>

                        <div className="input-field">
                            <input 
                            placeholder='Input Email'
                            id="email" 
                            type="email"
                            name='email'
                            className='yellow-input'
                            onChange={changeHander}
                            />
                            <label htmlFor="email">Email</label>
                        </div>

                        <div className="input-field">
                            <input 
                            placeholder='Input Password'
                            id="password" 
                            type="password"
                            name='password' 
                            className='yellow-input'
                            onChange={changeHander}
                            />
                            <label htmlFor="password">Password</label>
                        </div>
                    </div>

                    <div className="card-action">
                        <button 
                        className='btn yellow darken-4' 
                        style={{marginRight: 10}}
                        onClick={loginHandler}
                        disabled={loading}
                        >
                            Log in
                        </button>
                        <button 
                        className='btn grey lighten-1 black-text'
                        onClick={registerHandler}
                        disabled={loading}
                        >
                            Sign up
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}