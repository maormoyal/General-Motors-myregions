import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ImgList from './components/ImgList/ImgList';
import ImgCanvas from './components/ImgCanvas/ImgCanvas';
import { IData, IDataToSave, IRectangle } from './types/types';

function App() {
  const [data, setData] = useState<IData[]>([]);
  const [selectedImg, setSelectedImg] = useState<IData | null>(null);
  const [selectedImgRegions, setSelectedImgRegions] = useState<IRectangle[]>(
    []
  );
  const regionsCache = useState<Map<string, IRectangle[]>>(new Map())[0];

  useEffect(() => {
    const fetchImagesAndRegions = async () => {
      try {
        const response = await axios.get('/api/available-images-and-regions');
        setData(response.data);
      } catch (error) {
        console.error(
          'There was an error fetching the images and regions!',
          error
        );
      }
    };
    fetchImagesAndRegions();
  }, []);

  useEffect(() => {
    if (data.length > 0 && !selectedImg) {
      setSelectedImg(data[0]);
    }
  }, [data, selectedImg]);

  const fetchSelectedImageRegions = useCallback(
    async (img: IData) => {
      try {
        const response = await axios.get(`/api/${img.regions}`);
        regionsCache.set(img.id, response.data);
        setSelectedImgRegions(response.data);
      } catch (error) {
        console.error('There was an error fetching the image regions!', error);
      }
    },
    [regionsCache]
  );

  useEffect(() => {
    if (selectedImg) {
      const cachedRegions = regionsCache.get(selectedImg.id);
      if (cachedRegions) {
        setSelectedImgRegions(cachedRegions);
        console.log(
          `Using cached regions for image ${selectedImg.id}`,
          cachedRegions
        );
      } else {
        fetchSelectedImageRegions(selectedImg);
        console.log(`Fetching regions for image ${selectedImg.id}`);
      }
    }
  }, [selectedImg, fetchSelectedImageRegions, regionsCache]);

  const handleSelectedImg = useCallback((img: IData) => {
    console.log('Selecting image:', img);
    setSelectedImg(img);
  }, []);

  const handleSaveRectangles = useCallback(
    async (dataToSave: IDataToSave) => {
      const formData = new FormData();
      formData.append('id', dataToSave.id);
      formData.append('regions', JSON.stringify(dataToSave.regions));

      try {
        const response = await axios.post('/api/update-regions', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Update the cache with the new regions
        regionsCache.set(dataToSave.id, dataToSave.regions);
        setSelectedImgRegions(dataToSave.regions);

        toast.success('Regions saved successfully!');
        return response;
      } catch (error) {
        console.error('There was an error updating the image regions!', error);
        toast.error('Failed to save regions.');
      }
    },
    [regionsCache]
  );

  const handleUploadImage = async (file: File, regions: IRectangle[]) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('regions', JSON.stringify(regions));

    try {
      const response = await axios.post('/api/post-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Full server response:', response);

      const newImage: IData = {
        id: response.data.id,
        image: response.data.image,
        regions: response.data.regions,
      };

      console.log('Uploaded new image:', newImage);

      setData((prevData) => {
        const updatedData = [newImage, ...prevData];
        return updatedData;
      });

      setSelectedImg(newImage);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('There was an error uploading the image!', error);
      toast.error('Failed to upload image.');
    }
  };

  const handleDeleteImage = useCallback(
    async (id: string) => {
      try {
        const response = await axios.get(`/api/delete/${id}`);

        console.log('🚀 ~ response:', response);
        if (response.status === 200) {
          setData((prevData) => prevData.filter((img) => img.id !== id));
          toast.success('Image deleted successfully!');
          if (selectedImg?.id === id) {
            setSelectedImg(null);
            setSelectedImgRegions([]);
          }
        } else {
          toast.error('Failed to delete image.');
        }
      } catch (error) {
        console.error('There was an error deleting the image!', error);
        toast.error('Failed to delete image.');
      }
    },
    [selectedImg]
  );

  return (
    <div className='appContainer'>
      <ToastContainer />
      <ImgList
        data={data}
        selectedImgId={selectedImg?.id}
        handleSelectedImg={handleSelectedImg}
        handleUploadImage={handleUploadImage}
        handleDeleteImage={handleDeleteImage}
      />
      {selectedImg && (
        <ImgCanvas
          imgId={selectedImg.id}
          imgSrc={`/api/${selectedImg.image}`}
          initialRectangles={selectedImgRegions}
          handleSaveRectangles={handleSaveRectangles}
        />
      )}
    </div>
  );
}

export default App;
