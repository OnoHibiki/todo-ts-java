import LoginForm from "../components/LoginForm";
import  styles  from "./page.module.css";

export default function LoginPage() {
    return (
        <div className={styles.loginPage}>
            <h1 className={styles.appName}>ToDoアプリ</h1>
            <LoginForm />
        </div>
    )
}