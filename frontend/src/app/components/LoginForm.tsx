// src/components/LoginForm.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './LoginForm.module.css'

export default function LoginForm() {
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const router = useRouter()

    const handleLogin = () => {
        if ( username && password ) {
            //　仮のログイン処理(localStorage　に保存)
            localStorage.setItem('loggedInUser', username)
            router.push('/todos')
        } else {
            alert('正しいユーザー名とパスワードを入力してください')
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>ログイン</h1>
     
            <input
                type="text"
                placeholder='ユーザ名'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
            />
            <input 
                type="password"
                placeholder='パスワード'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
            />
            <button onClick={handleLogin} className={styles.button}>
                ログイン
            </button>
        </div>
    )


}