import React from 'react';
import { IData } from '../../App';
import styles from './RegionsList.module.scss';

interface RegionsListProps {
  data: IData[];
  selectedImgId?: string;
  handleSelectedImg: (img: IData) => void;
}

const RegionsList: React.FC<RegionsListProps> = ({
  data,
  selectedImgId,
  handleSelectedImg,
}) => {
  return (
    <div className={styles.regionsListContainer}>
      <button className={styles.addImgBtn}>Add Image +</button>
      {data.map((item) => (
        <div
          onClick={() => handleSelectedImg(item)}
          key={item.id}
          className={`${styles.regionItem} ${
            item.id === selectedImgId ? styles.selected : ''
          }`}
        >
          <img src={`/api/get/image/${item.id}`} />
        </div>
      ))}
    </div>
  );
};

export default RegionsList;
