
import styles from "./styles.module.scss";
import { Layer, Stage, Image } from "react-konva";
import { useState, useEffect, useRef } from "react";
import BoundingBox from "./BoundingBox";

let shelfImages = [
  "/assets/Shelf1.jpeg",
  "/assets/Shelf2.jpg",
  "/assets/Shelf3.jpeg",
  "/assets/Shelf4.jpeg",
  "/assets/Shelf5.jpeg"
];

export default function App() {
  const [imageIndex, setImageIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentRectIndex, setCurrentRectIndex] = useState(null);

  const isDragging = useRef(false);
  const dragRectIndex = useRef(null);
  const [currentPos, setCurrentPos] = useState(null);
  const [rectData, setRectData] = useState({});

  useEffect(() => {
    const image = new window.Image();
    image.src = shelfImages[imageIndex];
    image.onload = () => {
      setCurrentImage(image);
    };
  }, [imageIndex]);
  const handlePrevButtonClick = () => {
    const newIndex = imageIndex === 0 ? shelfImages.length - 1 : imageIndex - 1;
    setImageIndex(newIndex);
  };

  const handleNextButtonClick = () => {
    const newIndex = imageIndex === shelfImages.length - 1 ? 0 : imageIndex + 1;
    setImageIndex(newIndex);
  };

  const onMouseDownHandler = (event) => {
    const clickedOnEmpty = event.target === event.target.getLayer().children[0];
    if (clickedOnEmpty) {
      setCurrentRectIndex(null);
      isDragging.current = true;
      const pos = event.target.getStage().getPointerPosition();
      setCurrentPos([pos.x, pos.y]);
      dragRectIndex.current = rectData[imageIndex]?.length || 0;
   };
  }
  const onMouseMoveHandler = (event) => {
    if (isDragging.current) {
      const pos = event.target.getStage().getPointerPosition();
      setRectData((prev) => {
        let updatedData = { ...prev };
        let updatedRects = updatedData[imageIndex]
          ? [...updatedData[imageIndex]]
          : [];
        let newRect = {
          x: currentPos[0],
          y: currentPos[1],
          width: pos.x - currentPos[0],
          height: pos.y - currentPos[1],
          rotation: 0,
          scaleX: 1,
          scaleY: 1
        };
        if (newRect.width > 0 && newRect.height > 0){
          updatedRects.splice(dragRectIndex.current, 1, newRect);
          updatedData[imageIndex] = updatedRects;
        }
        return updatedData;
      });
    }
  };
  const onMouseUpHandler = () => {
    if (isDragging.current) {
      setCurrentPos(null);
      dragRectIndex.current = null;
      isDragging.current = false;
    }
  };
  const handleRectTransform = (index, rect ) => {
    setRectData((prevRectangles) => {
      const updatedData = {...prevRectangles};
      const currentRects = [...updatedData[imageIndex]];
      currentRects[index] = rect;
      updatedData[imageIndex] = currentRects
      return updatedData;
    });
  };
  const onSaveHandler = () => {
    let currectImgRectData = rectData[imageIndex];
    let widthRatio = (currentImage.width / 500).toFixed(2);
    let heightRatio = (currentImage.height / 500).toFixed(2);
    let result = currectImgRectData.map(item => {
      return {
        x1 : Math.floor(item.x * widthRatio),
        x2 : Math.floor((item.x + item.width)* widthRatio),
        y1 : Math.floor(item.y * heightRatio),
        y2 : Math.floor((item.y + item.width)* heightRatio),
      }
    })
    console.log(result);
  }
  const deleteBoxhandler = () => {
    if(currentRectIndex !== null){
      setRectData((prevRectangles) => {
        const updatedData = {...prevRectangles};
        const currentRects = [...updatedData[imageIndex]];
        currentRects.splice(currentRectIndex,1);
        updatedData[imageIndex] = currentRects
        return updatedData;
      });
    }
    setCurrentRectIndex(null);
  }
  return (
    <div className={styles.container}>
      <Stage
        width={500}
        height={500}
        onMouseDown={onMouseDownHandler}
        onMouseMove={onMouseMoveHandler}
        onMouseUp={onMouseUpHandler}
      >
        <Layer>
          {currentImage && (
            <Image image={currentImage} x={0} y={0} width={500} height={500} />
          )}
        </Layer>
        <Layer>
          {rectData[imageIndex] &&
            rectData[imageIndex].map((rect, index) => (
              <BoundingBox 
              shapeProps={{...rect, stroke:index === currentRectIndex ? "green" : "red" , strokeWidth : 2 }} 
              isSelected={index === currentRectIndex} onSelect={() => setCurrentRectIndex(index)} 
              onChange={(rect)=>handleRectTransform(index, rect)}/>
            ))}
        </Layer>
      </Stage>
      <div className={styles.buttonsWrapper}>
        <button onClick={handlePrevButtonClick} className={styles.button} >
          Prev
        </button>
        <button onClick={handleNextButtonClick} className={styles.button}>
          Next 
        </button>
        <button onClick={onSaveHandler} className={styles.button}>
          Save 
        </button>
        {currentRectIndex !== null ? 
          <button onClick={deleteBoxhandler} className={styles.button}>
            Delete 
          </button> : null
        }
      </div>

    </div>
  );
}

