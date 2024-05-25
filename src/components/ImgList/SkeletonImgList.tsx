import React from 'react';
import SkeletonImgCard from '../ImgCard/SkeletonImgCard';
import styles from './SkeletonImgList.module.scss';

const SkeletonImgList: React.FC = () => {
  return (
    <div className={styles.skeletonImgListContainer}>
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonImgCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonImgList;
