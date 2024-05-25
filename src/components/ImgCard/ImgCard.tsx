import React from 'react';
import styles from './ImgCard.module.scss';
import { IData } from '../../App';

import trashIcon from '../../assets/trash.icon.svg';

interface ImgCardProps {
  item: IData;
  selectedImgId?: string;
  handleSelectedImg: (img: IData) => void;
  handleDeleteImage: (id: string) => void;
}

const ImgCard: React.FC<ImgCardProps> = ({
  item,
  selectedImgId,
  handleSelectedImg,
  handleDeleteImage,
}) => {
  return (
    <div
      key={item.id}
      className={`${styles.imgCard} ${
        item.id === selectedImgId ? styles.selected : ''
      }`}
    >
      <div
        className={styles.imageContainer}
        onClick={() => handleSelectedImg(item)}
      >
        <img src={`/api/get/image/${item.id}`} alt={`Image ${item.id}`} />
      </div>
      <button
        className={styles.deleteBtn}
        onClick={() => handleDeleteImage(item.id)}
      >
        <img src={trashIcon} alt='trashIcon' />
      </button>
    </div>
  );
};

export default ImgCard;
