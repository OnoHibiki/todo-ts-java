'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Todos.module.css'

//Todoの型
type Todo = { id: number; title: string; deadline:Date; completed: boolean }

export default function TodosPage() {
    const router = useRouter()
    const [todos, setTodos] = useState<Todo[]>([
        { id: 1, title: '（サンプル）牛乳を買う' , deadline: new Date() , completed: false },
        { id: 2, title: '（サンプル）本を読む' , deadline: new Date() , completed: true },
    ])


    const [input, setInput] = useState('')
    const [deadlineInput, setdeadlineInput] = useState('')


    //未ログインなら、/login（ログイン画面)へ戻す
    useEffect(() => {
        const user = typeof window !== 'undefined' ? localStorage.getItem('loggedInUser') : null 
        if (!user) router.replace('/login')
    },[router])

    //Todo追加
    const addTodo = () => {
        const title = input.trim()
        if(!title) return
        
        //締切日設定用
        const deadline = deadlineInput ? new Date(deadlineInput) : new Date()

        setTodos(prev => [...prev, { id: Date.now(), title, deadline, completed: false }])
        setInput('')
        setdeadlineInput('')
    
    }

    //Todo完了状態管理
    const toggleTodo = (id: number) => {
        setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t )))
    }

    //Todo削除
    const deleteTodo = (id: number) => {
        setTodos(prev => prev.filter(t => t.id !== id))
    }

    const logout = () => {
        localStorage.removeItem('loggedInUser')
        router.replace('/login')
    }

    const todayStr = new Date().toISOString().slice(0,10)
    const formatDate = (d: Date) => new Date(d).toLocaleDateString('ja-JP')


    return(
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>ToDo</h1>
                <button className={styles.logoutBtn} onClick={logout}>ログアウト</button>
            </header>
            
            <div className={styles.inputRow}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="やることを入力"
                    className={styles.input}
                />
                <input 
                    type="date" 
                    value={deadlineInput}
                    onChange={(e) => setdeadlineInput(e.target.value)}
                    min={todayStr}
                    className={styles.dateInput}
                />

                <button className={styles.addBtn} onClick={addTodo}>追加</button>

            </div>

            <ul className={styles.list}>
                {todos.map((t) => (
                    <li key={t.id} className={styles.item}>
                        <input type="checkbox" checked={t.completed} onChange={() => toggleTodo(t.id)} />
                        <span className={`${styles.text} ${t.completed ? styles.completed : ''}`}>
                            {t.title}
                        </span>
                        <span className={styles.deadline}>期限: {formatDate(t.deadline)}</span>
                        <button className={styles.deleteBtn} onClick={() => deleteTodo(t.id)}>削除</button>
                    </li>
                ))}
            </ul>


        </div>
    )


}