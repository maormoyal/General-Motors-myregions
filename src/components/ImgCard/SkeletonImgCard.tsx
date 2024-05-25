import React from 'react';
import styles from './SkeletonImgCard.module.scss';

const SkeletonImgCard: React.FC = () => {
  return (
    <div className={styles.skeletonImgCard}>
      <div className={styles.imageContainer}></div>
      <div className={styles.deleteBtn}></div>
    </div>
  );
};

export default SkeletonImgCard;
