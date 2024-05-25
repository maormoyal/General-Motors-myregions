import React, { ChangeEvent } from 'react';
import { IData, IRectangle } from '../../App';
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
          item={item}
          handleSelectedImg={handleSelectedImg}
          handleDeleteImage={handleDeleteImage}
          selectedImgId={selectedImgId}
        />
        // <div
        //   key={item.id}
        //   className={`${styles.imgCard} ${
        //     item.id === selectedImgId ? styles.selected : ''
        //   }`}
        // >
        //   <div
        //     className={styles.imageContainer}
        //     onClick={() => handleSelectedImg(item)}
        //   >
        //     <img src={`/api/get/image/${item.id}`} alt={`Image ${item.id}`} />
        //   </div>
        //   <button
        //     className={styles.deleteBtn}
        //     onClick={() => handleDeleteImage(item.id)}
        //   >
        //     <svg
        //       xmlns='http://www.w3.org/2000/svg'
        //       viewBox='0 0 24 24'
        //       width='24'
        //       height='24'
        //     >
        //       <path fill='none' d='M0 0h24v24H0z' />
        //       <path
        //         fill='red'
        //         d='M3 6h18v2H3V6zm2 0h1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2h1V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2zm0 3v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9H5zm4 10v-8h2v8H9zm4 0v-8h2v8h-2z'
        //       />
        //     </svg>
        //   </button>
        // </div>
      ))}
    </div>
  );
};

export default ImgList;
