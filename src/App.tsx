import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import RegionsList from './components/RegionsList/RegionsList';
import RegionsOverview from './components/RegionsOverview/RegionsOverview';

const demoRectangles: IRectangle[] = [
  {
    id: 1,
    label: 'region1',
    points: [466.171875, 23, 590.171875, 147],
  },
  {
    id: 2,
    label: 'region2',
    points: [114.171875, 417, 265.171875, 568],
  },
];

export interface IData {
  id: string;
  image: string;
  regions: string;
}

export interface IRectangle {
  id: number;
  label: string;
  points: number[];
}

function App() {
  const [data, setData] = useState<IData[]>([]);
  const [selectedImg, setSelectedImg] = useState<IData | null>(null);
  const [selectedImgRegions, setSelectedImgRegions] = useState<IRectangle[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get('/api/available-images-and-regions')
      .then((response) => {
        setData(response.data);
        console.log('available-images-and-regions', response);
      })
      .catch((error) => {
        console.error('There was an error fetching the rectangles!', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setSelectedImg(data[0]);
    }
  }, [data]);

  const handleSelectedImg = useCallback(
    (img: IData) => {
      setIsLoading(true);
      setSelectedImg(img);

      axios
        .get(`/api/get/regions/${img.id}`)
        .then((response) => {
          setSelectedImgRegions(response.data);
          console.log('Selected image regions>>', response.data);
        })
        .catch((error) => {
          console.error('There was an error fetching the rectangles!', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [setIsLoading, setSelectedImg, setSelectedImgRegions]
  );

  return (
    <div className='appContainer'>
      {isLoading ? (
        <div>
          Loading... <br /> Please wait
        </div>
      ) : (
        <>
          <RegionsList
            data={data}
            selectedImgId={selectedImg?.id}
            handleSelectedImg={handleSelectedImg}
          />
          {selectedImg && (
            <RegionsOverview
              imgSrc={`/api/${selectedImg.image}`}
              initialRectangles={selectedImgRegions}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
