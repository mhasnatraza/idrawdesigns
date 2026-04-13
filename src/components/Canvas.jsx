import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const SIDEBAR_WIDTH = 360;
const HEADER_HEIGHT = 64;

const Canvas = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState(null);

    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);

    const saveHistory = () => {
        if (!canvasRef.current || !context) return;

        const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(imageData);

        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    };

    const placeImage = (url) => {
        if (!context || !canvasRef.current || !url) return;

        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = url;
        image.onload = () => {
            const canvas = canvasRef.current;
            const maxWidth = canvas.width * 0.45;
            const maxHeight = canvas.height * 0.45;
            const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
            const drawWidth = image.width * scale;
            const drawHeight = image.height * scale;
            const x = (canvas.width - drawWidth) / 2;
            const y = (canvas.height - drawHeight) / 2;
            context.drawImage(image, x, y, drawWidth, drawHeight);
            saveHistory();
        };
    };

    useImperativeHandle(ref, () => ({
        undo: () => {
            if (historyStep > 0) {
                const newStep = historyStep - 1;
                setHistoryStep(newStep);
                const imageData = history[newStep];
                if (imageData && context) context.putImageData(imageData, 0, 0);
            }
        },
        redo: () => {
            if (historyStep < history.length - 1) {
                const newStep = historyStep + 1;
                setHistoryStep(newStep);
                const imageData = history[newStep];
                if (imageData && context) context.putImageData(imageData, 0, 0);
            }
        },
        clear: () => {
            if (context && canvasRef.current) {
                context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                saveHistory();
            }
        },
        placeImage
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth - SIDEBAR_WIDTH;
        canvas.height = window.innerHeight - HEADER_HEIGHT;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        setContext(ctx);

        setTimeout(() => {
            const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setHistory([initialData]);
            setHistoryStep(0);
        }, 80);

        const handleResize = () => {
            if (!canvasRef.current || !ctx) return;
            const currentCanvas = canvasRef.current;
            const imageData = ctx.getImageData(0, 0, currentCanvas.width, currentCanvas.height);

            currentCanvas.width = window.innerWidth - SIDEBAR_WIDTH;
            currentCanvas.height = window.innerHeight - HEADER_HEIGHT;

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.putImageData(imageData, 0, 0);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const startDrawing = (e) => {
        if (!context) return;
        const { offsetX, offsetY } = e.nativeEvent;
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || !context) return;
        const { offsetX, offsetY } = e.nativeEvent;
        context.lineTo(offsetX, offsetY);
        context.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing && context) {
            context.closePath();
            setIsDrawing(false);
            saveHistory();
        }
    };

    return (
        <div className="relative flex-1 bg-[#0f172a] overflow-hidden cursor-crosshair">
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />
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
});

Canvas.displayName = 'Canvas';

export default Canvas;
