import React from 'react';
import styles from './ImgCard.module.scss';
import { IData } from '../../types/types';

import trashIcon from '/trash.icon.svg';

const API_BASE_URL =
  import.meta.env.MODE === 'development'
    ? '/api/get/image'
    : 'https://gm-proxy-server-47c5e71ee6ae.herokuapp.com/api/get/image';

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
      className={`${styles.imgCard} ${
        item.id === selectedImgId ? styles.selected : ''
      }`}
    >
      <div
        className={styles.imageContainer}
        onClick={() => handleSelectedImg(item)}
      >
        <img src={`${API_BASE_URL}/${item.id}`} alt={`Image ${item.id}`} />
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
