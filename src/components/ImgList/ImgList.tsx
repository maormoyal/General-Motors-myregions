import React, { ChangeEvent } from 'react';
import { IData, IRectangle } from '../../types/types';
import styles from './ImgList.module.scss';
import ImgCard from '../ImgCard/ImgCard';

export interface ImgListProps {
  data: IData[];
  selectedImgId?: string;
  handleSelectedImg: (img: IData) => void;
  handleUploadImage: (file: File, regions: IRectangle[]) => void;
  handleDeleteImage: (id: string) => void;
}

const ImgList: React.FC<ImgListProps> = ({
  data,
  selectedImgId,
  handleSelectedImg,
  handleUploadImage,
  handleDeleteImage,
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const regions: IRectangle[] = []; // Initialize with empty regions or any default regions you want
      handleUploadImage(file, regions);
    }
  };

  return (
    <div className={styles.imgListContainer}>
      <label className={styles.addImgBtn}>
        Add Image +
        <input
          type='file'
          accept='image/jpeg'
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>
      {data.map((item) => (
        <ImgCard
          key={item.id}
          item={item}
          handleSelectedImg={handleSelectedImg}
          handleDeleteImage={handleDeleteImage}
          selectedImgId={selectedImgId}
        />
      ))}
    </div>
  );
};

export default ImgList;
