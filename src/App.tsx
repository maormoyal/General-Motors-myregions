import './App.css';
import RegionsOverview from './components/RegionsOverview/RegionsOverview';

const demoRectangles = [
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

function App() {
  return (
    <>
      <RegionsOverview
        imgSrc={'/api/images/get/image/718207137099129019'}
        initialRectangles={demoRectangles}
      />
    </>
  );
}

export default App;
