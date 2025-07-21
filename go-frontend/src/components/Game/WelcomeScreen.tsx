import React from 'react';
import { WelcomeScreenProps } from './types';
import styles from './Game.module.css';

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onCreate, onJoin }) => (
  <>
    <header className={styles.gameIntro}>
      <h1 className={styles.title}>
        <small>Игра</small> ГО
      </h1>
      <p className={styles.subtitle}>
        Многопользовательская онлайн игра ГО
      </p>
    </header>
    <article className={styles.content}>
      <div className={styles.menu}>
        <button type="button" className={styles.menuButton} onClick={onCreate}>
          Создать игру
        </button>
        <button type="button" className={styles.menuButton} onClick={onJoin}>
          Присоединиться к игре
        </button>
      </div>
    </article>
  </>
);

export default WelcomeScreen; 