import { ThreeCircles } from 'react-loader-spinner';

import styles from './loader.module.css';

export const Loader = () => {
  return (
    <div className={styles.loader}>
      <ThreeCircles height="100" width="100" color="#7FFFD4" ariaLabel="loading" />
    </div>
  );
};