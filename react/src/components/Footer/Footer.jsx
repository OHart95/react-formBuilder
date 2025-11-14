import styles from './Footer.module.css'

const Footer = () => {
    return (
        <div className={styles.footer}>
            <img src="./src/assets/skanska.svg" alt="Skanska Logo" className={styles.logo}/>
        </div>
    )
}

export default Footer