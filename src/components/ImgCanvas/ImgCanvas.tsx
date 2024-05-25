import React, { useState, useRef, useEffect } from 'react';
import { IRectangle, IDataToSave } from '../../types/types';

import styles from './ImgCanvas.module.scss';
import trashIcon from '/trash.icon.svg';

interface ImgCanvasProps {
  imgId: string;
  imgSrc: string;
  initialRectangles?: IRectangle[];
  handleSaveRectangles: (dataToSave: IDataToSave) => void;
}

interface Rectangle extends IRectangle {
  deleteButtonPosition?: { left: number; top: number };
  labelInputPosition?: { left: number; top: number };
}

const ImgCanvas: React.FC<ImgCanvasProps> = ({
  imgId,
  imgSrc,
  initialRectangles = [],
  handleSaveRectangles,
}) => {
  const [rectangles, setRectangles] = useState<Rectangle[]>(initialRectangles);
  const [currentRect, setCurrentRect] = useState<number[]>([]);
  const [currentLabel, setCurrentLabel] = useState<string>('');
  const [drawing, setDrawing] = useState<boolean>(false);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [selectedRectIndex, setSelectedRectIndex] = useState<number | null>(
    null
  );
  const [deleteButtonPosition, setDeleteButtonPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [labelInputPosition, setLabelInputPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const labelInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setRectangles(initialRectangles as Rectangle[]);
  }, [initialRectangles]);

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
      ctx.strokeStyle = selectedRectIndex === index ? 'orange' : 'red';
      ctx.stroke();

      ctx.font = 'bold 20px sans-serif';
      const textWidth = ctx.measureText(rect.label).width;
      const textHeight = 20; // Approximate text height
      const padding = 4;

      // Draw background rectangle for the label
      ctx.fillStyle = 'rgba(255, 165, 0, 0.8)'; // Background color with some opacity
      ctx.fillRect(
        rect.points[0],
        rect.points[1] - textHeight - padding,
        textWidth + padding * 2,
        textHeight + padding
      );

      // Draw label text
      ctx.fillStyle = 'black'; // Text color
      ctx.fillText(rect.label, rect.points[0] + padding, rect.points[1] - 5);
    });

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

      ctx.font = '15px sans-serif'; // Set custom font size and family
      const textHeight = 15; // Approximate text height
      const padding = 4;

      const coordText1 = `(${currentRect[0].toFixed(
        2
      )}, ${currentRect[1].toFixed(2)})`;
      const coordText2 = `(${currentRect[2].toFixed(
        2
      )}, ${currentRect[3].toFixed(2)})`;

      // Measure text width
      const coordText1Width = ctx.measureText(coordText1).width;
      const coordText2Width = ctx.measureText(coordText2).width;

      // Draw background rectangle for the first coordinate
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Background color with some opacity
      ctx.fillRect(
        currentRect[0],
        currentRect[1] - textHeight - padding,
        coordText1Width + padding * 2,
        textHeight + padding
      );

      // Draw the first coordinate text
      ctx.fillStyle = 'white'; // Text color
      ctx.fillText(coordText1, currentRect[0] + padding, currentRect[1] - 5);

      // Draw background rectangle for the second coordinate
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Background color with some opacity
      ctx.fillRect(
        currentRect[2],
        currentRect[3] + padding,
        coordText2Width + padding * 2,
        textHeight + padding
      );

      // Draw the second coordinate text
      ctx.fillStyle = 'white'; // Text color
      ctx.fillText(
        coordText2,
        currentRect[2] + padding,
        currentRect[3] + textHeight + padding
      );
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
        setDeleteButtonPosition({
          left: rect.points[2] - 20, // Adjust this value as needed
          top: rect.points[1] + 10, // Adjust this value as needed
        });
        setLabelInputPosition({
          left: rect.points[0] + 10,
          top: rect.points[1] - 30,
        });
        insideExistingRect = true;
        setDrawing(false);
        setInputVisible(false);
      }
    });

    if (!insideExistingRect) {
      setCurrentRect([x, y, x, y]);
      setDrawing(true);
      setSelectedRectIndex(null);
      setDeleteButtonPosition(null);
      setLabelInputPosition(null);
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
      setLabelInputPosition({
        left: Math.min(currentRect[0], currentRect[2]) + 10,
        top: Math.min(currentRect[1], currentRect[3]) - 30,
      });
    }
  };

  const handleLabelSubmit = () => {
    if (currentLabel.trim() !== '') {
      const newRectangle: Rectangle = {
        id: Math.floor(Math.random() * 1000),
        label: currentLabel,
        points: [
          Math.min(currentRect[0], currentRect[2]),
          Math.min(currentRect[1], currentRect[3]),
          Math.max(currentRect[0], currentRect[2]),
          Math.max(currentRect[1], currentRect[3]),
        ],
      };

      setRectangles([...rectangles, newRectangle]);
      setCurrentRect([]);
      setCurrentLabel('');
      setInputVisible(false);
    }
  };

  const handleDeleteRectangle = () => {
    if (selectedRectIndex !== null) {
      const updatedRectangles = rectangles.filter(
        (_, i) => i !== selectedRectIndex
      );
      setRectangles(updatedRectangles);
      setSelectedRectIndex(null);
      setDeleteButtonPosition(null);
      setLabelInputPosition(null);
    }
  };

  const handleDeleteAllRectangles = () => {
    setRectangles([]);
    setSelectedRectIndex(null);
    setDeleteButtonPosition(null);
    setLabelInputPosition(null);
  };

  const onSaveRectangles = () => {
    const dataToSave: IDataToSave = {
      id: imgId,
      regions: rectangles,
    };
    handleSaveRectangles(dataToSave);
    console.log(dataToSave);
  };

  return (
    <div className={styles.imgCanvasContainer}>
      <div className={styles.buttonsContainer}>
        <button onClick={onSaveRectangles}>Save Rectangles</button>
        <button
          onClick={handleDeleteAllRectangles}
          disabled={rectangles.length <= 0}
        >
          Delete All Rectangles
        </button>
      </div>
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
          drawRectangles(ctx);
        }}
      />
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: '1px solid black' }}
      />
      {inputVisible && labelInputPosition && (
        <div
          className={styles.labelInputContainer}
          style={{
            position: 'absolute',
            left: `${labelInputPosition.left}px`,
            top: `${labelInputPosition.top}px`,
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
      {deleteButtonPosition && (
        <button
          className={styles.deleteButton}
          style={{
            position: 'absolute',
            left: `${deleteButtonPosition.left}px`,
            top: `${deleteButtonPosition.top}px`,
            transform: 'translate(-50%, -50%)',
          }}
          onClick={handleDeleteRectangle}
        >
          <img src={trashIcon} alt='trashIcon' />
        </button>
      )}
    </div>
  );
};

export default ImgCanvas;
