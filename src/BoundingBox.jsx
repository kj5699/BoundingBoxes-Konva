import React, { useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";

const BoundingBox = ({ shapeProps, isSelected, onSelect, onChange }) => {
    const shapeRef = useRef();
    const trRef = useRef();
    
    useEffect(() => {
    if (isSelected) {
    trRef.current.nodes([shapeRef.current]);
    trRef.current.getLayer().batchDraw();
    }
    }, [isSelected]);
    
    return (
    <React.Fragment>
    <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        onTransformEnd={e => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
            });
        }}
    />
        {isSelected && (
        <Transformer
            ref={trRef}
            rotateEnabled={false}
            keepRatio={false}
            anchorSize={8}
            borderDash={[6, 2]}
            borderColor="#22A6B3"
        />
        )}
        </React.Fragment>) 
};
export default BoundingBox;

    
    