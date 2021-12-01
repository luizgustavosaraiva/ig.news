import { ReactNode } from 'react';
import { SignInButton } from '../SignInButton';

import styles from './styles.module.scss';

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src='/images/logo.svg' alt='ig.news' />
        <nav>
          <a className={styles.active} href=''>
            Home
          </a>
          <a href=''>Posts</a>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
