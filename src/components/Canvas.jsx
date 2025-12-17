import { useRef, useEffect, useState } from 'react';
import { Layers, MousePointer2, Move, Type, Square, Circle, Minus } from 'lucide-react';

const Canvas = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth - 320; // Sidebar width
        canvas.height = window.innerHeight - 64; // Header height

        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        setContext(ctx);

        const handleResize = () => {
            if (!canvasRef.current || !context) return;
            const canvas = canvasRef.current;
            // Save current drawing
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            // Resize
            canvas.width = window.innerWidth - 320;
            canvas.height = window.innerHeight - 64;

            // Restore context properties (they get reset on resize)
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.lineWidth = 2;
            context.strokeStyle = '#fff';

            // Restore drawing
            context.putImageData(imageData, 0, 0);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [context]); // depend on context to ensure it's available

    const startDrawing = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        context.lineTo(offsetX, offsetY);
        context.stroke();
    };

    const stopDrawing = () => {
        context.closePath();
        setIsDrawing(false);
    };

    return (
        <div className="relative flex-1 bg-[#0f172a] overflow-hidden cursor-crosshair">
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="block"
            />
        </div>
    );
};

export default Canvas;
