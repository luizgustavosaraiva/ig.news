import { ReactNode } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, useSession, signOut } from 'next-auth/react';

import styles from './styles.module.scss';

interface SignInButtonProps {
  children?: ReactNode;
}

export function SignInButton({ }: SignInButtonProps) {
  const { data: session } = useSession();

  return session?.user ? (
    <button
      className={styles.signInButton}
      type='button'
      onClick={() => signOut()}>
      <FaGithub color='#04d361' />
      {session.user?.name}
      <FiX color='#737380' className={styles.closeIcon} />
    </button>
  ) : (
    <button
      className={styles.signInButton}
      type='button'
      onClick={() => signIn('github')}>
      <FaGithub color='#eba417' />
      Sign in with Github
    </button>
  );
}
