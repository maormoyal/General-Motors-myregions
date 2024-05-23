import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import styles from './RegionsOverview.module.scss';

interface Rectangle {
  id: number;
  label: string;
  points: number[];
}

interface RegionsOverviewProps {
  imgSrc: string;
  initialRectangles?: Rectangle[];
}

const RegionsOverview: React.FC<RegionsOverviewProps> = ({
  imgSrc,
  initialRectangles = [],
}) => {
  const [rectangles, setRectangles] = useState<Rectangle[]>(initialRectangles);
  const [currentRect, setCurrentRect] = useState<number[]>([]);
  const [currentLabel, setCurrentLabel] = useState<string>('');
  const [drawing, setDrawing] = useState<boolean>(false);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [selectedRectIndex, setSelectedRectIndex] = useState<number | null>(
    null
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const labelInputRef = useRef<HTMLInputElement | null>(null);

  const drawRectangles = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(imageRef.current!, 0, 0);
    rectangles.forEach((rect, index) => {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.rect(
        rect.points[0],
        rect.points[1],
        rect.points[2] - rect.points[0],
        rect.points[3] - rect.points[1]
      );
      ctx.strokeStyle = 'red';
      ctx.stroke();

      ctx.font = 'bold 20px sans-serif'; // Set custom font size, family, and weight
      ctx.fillStyle = 'orange'; // Set custom font color
      ctx.fillText(rect.label, rect.points[0], rect.points[1] - 5);

      // Highlight the selected rectangle with a different color
      if (selectedRectIndex === index) {
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });

    // Draw the current rectangle being drawn
    if (currentRect.length === 4) {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'blue';
      ctx.rect(
        currentRect[0],
        currentRect[1],
        currentRect[2] - currentRect[0],
        currentRect[3] - currentRect[1]
      );
      ctx.stroke();
    }
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && imageRef.current) {
      drawRectangles(ctx);
    }
  }, [rectangles, currentRect, drawing, inputVisible, selectedRectIndex]);

  useEffect(() => {
    if (inputVisible && labelInputRef.current) {
      labelInputRef.current.focus();
    }
  }, [inputVisible]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let insideExistingRect = false;
    rectangles.forEach((rect, index) => {
      if (
        x >= rect.points[0] &&
        x <= rect.points[2] &&
        y >= rect.points[1] &&
        y <= rect.points[3]
      ) {
        setSelectedRectIndex(index);
        insideExistingRect = true;
      }
    });

    if (!insideExistingRect && !inputVisible) {
      setCurrentRect([x, y, x, y]);
      setDrawing(true);
      setSelectedRectIndex(null); // Clear selected rectangle when starting a new one
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawing && !inputVisible) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCurrentRect([currentRect[0], currentRect[1], x, y]);
    }
  };

  const handleMouseUp = () => {
    if (drawing) {
      setDrawing(false);
      setInputVisible(true);
    }
  };

  const handleLabelSubmit = () => {
    if (currentLabel.trim() !== '') {
      setRectangles([
        ...rectangles,
        {
          id: Math.floor(Math.random() * 1000),
          label: currentLabel,
          points: [
            Math.min(currentRect[0], currentRect[2]),
            Math.min(currentRect[1], currentRect[3]),
            Math.max(currentRect[0], currentRect[2]),
            Math.max(currentRect[1], currentRect[3]),
          ],
        },
      ]);
      setCurrentRect([]);
      setCurrentLabel('');
      setInputVisible(false);
    }
  };

  const handleDeleteRectangle = (index: number) => {
    const updatedRectangles = rectangles.filter((_, i) => i !== index);
    setRectangles(updatedRectangles);
    setSelectedRectIndex(null);
  };

  const onSaveRectangles = () => {
    // axios
    //   .post('/api/images/save/rectangles', rectangles)
    //   .then((response) => {
    //     console.log('Rectangles saved', response.data);
    //   })
    //   .catch((error) => {
    //     console.error('There was an error saving the rectangles!', error);
    //   });
    console.log(rectangles);
  };

  return (
    <div>
      <img
        ref={imageRef}
        src={imgSrc}
        crossOrigin='anonymous'
        style={{ display: 'none' }}
        onLoad={() => {
          const ctx = canvasRef.current!.getContext('2d')!;
          ctx.canvas.width = imageRef.current!.width;
          ctx.canvas.height = imageRef.current!.height;
          ctx.drawImage(imageRef.current!, 0, 0);
          drawRectangles(ctx); // Draw initial rectangles on image load
        }}
      />
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: '1px solid black' }}
      />
      {inputVisible && (
        <div
          className={styles.labelInputContainer}
          style={{
            position: 'absolute',
            left: `${Math.min(currentRect[0], currentRect[2]) + 140}px`,
            top: `${Math.min(currentRect[1], currentRect[3]) - 50}px`,
          }}
        >
          <input
            ref={labelInputRef}
            type='text'
            placeholder='Enter label'
            value={currentLabel}
            onChange={(e) => setCurrentLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLabelSubmit()}
          />
          <button onClick={handleLabelSubmit}>Submit Label</button>
        </div>
      )}
      {rectangles.map((rect, index) => (
        <button
          key={index}
          className={`${styles.deleteButton}`}
          style={{
            position: 'absolute',
            left: `${rect.points[2] + 150}px`,
            top: `${rect.points[1] - 25}px`,
          }}
          onClick={() => handleDeleteRectangle(index)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            width='24'
            height='24'
          >
            <path fill='none' d='M0 0h24v24H0z' />
            <path
              fill='red'
              d='M3 6h18v2H3V6zm2 0h1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2h1V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2zm0 3v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9H5zm4 10v-8h2v8H9zm4 0v-8h2v8h-2z'
            />
          </svg>
        </button>
      ))}
      <button onClick={onSaveRectangles}>Save Rectangles</button>
    </div>
  );
};

export default RegionsOverview;
