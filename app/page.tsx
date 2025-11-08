import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to Just Cakes</h1>
        <p className={styles.description}>
          Premium custom cakes for all occasions
        </p>
      </div>
    </main>
  )
}
