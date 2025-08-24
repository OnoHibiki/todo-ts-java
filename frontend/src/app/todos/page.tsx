'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Todos.module.css'
import { headers } from 'next/headers'

//Todoの型
type Todo = { id: number; title: string; deadline:Date; completed: boolean }

export default function TodosPage() {
    const router = useRouter()
    const [todos, setTodos] = useState<Todo[]>([])


    const [input, setInput] = useState('')
    const [deadlineInput, setdeadlineInput] = useState('')


    //未ログインなら、/login（ログイン画面)へ戻す
    useEffect(() => {
        const user = typeof window !== 'undefined' ? localStorage.getItem('loggedInUser') : null 
        if (!user) {
            router.replace('/login')
            return
        }

        (async () =>{
            try {
                const res = await fetch('http://localhost:8080/api/todos')
                const data = await res.json()

                //POST時の処理
                //Spring ApiのdeadLineをDateに変換してからstateへ。
                setTodos((data as any[]).map(d => ({
                    id: d.id as number,
                    title: d.title as string,
                    deadline: new Date(d.deadline as string),
                    completed: d.completed as boolean,
                })))
            } catch (e) {
                console.error('fetch（Todoの取得)に失敗しました', e)
            }
        })()
    },[router])

    //Todo追加
    const addTodo = async () => {
        const title = input.trim()
        
        if (!title) {
            return;
        }

        try{
            const body = {
                title,
                deadline: deadlineInput || undefined,
                completed: false,
            }

            //POST時,Jsonで返す
            const res = await fetch('http://localhost:8080/api/todos',{
                method: 'POST',
                headers:{ 'Content-Type' : 'application/json' },
                body: JSON.stringify(body),
            })

            //エラー処理
            if(!res.ok){
                throw new Error ('HTTP ${res.status}')
            }

            const created = await res.json()
            const createdForUi: Todo = {
                id: created.id as number,
                title: created.title as string,
                deadline: new Date(created.deadline as string),
                completed: created.completed as boolean,
            }

            setTodos(prev => [...prev, createdForUi])
            setInput(' ')
            setdeadlineInput(' ')

        } catch (e){
            //エラー処理
            console.error('Todoの作成に失敗しました' , e)
        }
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
                <label className={styles.dateLabel} htmlFor="deadline">
                    締切日
                    <input 
                        type="date" 
                        value={deadlineInput}
                        onChange={(e) => setdeadlineInput(e.target.value)}
                        min={todayStr}
                        className={styles.dateInput}
                    />
                </label>

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