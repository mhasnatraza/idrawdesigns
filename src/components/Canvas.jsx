import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';

const BASE_AREA = 1280 * 720;

const Canvas = forwardRef(({ brushColor = '#ffffff', brushSize = 2 }, ref) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState(null);

    // History State
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);

    const getAdaptiveBrushSize = useCallback((width, height) => {
        const areaScale = Math.sqrt((width * height) / BASE_AREA);
        return Math.max(1, brushSize * areaScale);
    }, [brushSize]);

    const applyBrushStyle = useCallback((ctx, width, height) => {
        if (!ctx) return;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = getAdaptiveBrushSize(width, height);
        ctx.strokeStyle = brushColor;
    }, [brushColor, getAdaptiveBrushSize]);

    const saveHistory = useCallback(() => {
        if (!canvasRef.current || !context) return;

        const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(imageData);

        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    }, [context, history, historyStep]);

    const resizeToContainer = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !context) return;

        const width = Math.max(1, Math.floor(container.clientWidth));
        const height = Math.max(1, Math.floor(container.clientHeight));

        if (canvas.width === width && canvas.height === height) {
            applyBrushStyle(context, width, height);
            return;
        }

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx && canvas.width > 0 && canvas.height > 0) {
            tempCtx.drawImage(canvas, 0, 0);
        }

        canvas.width = width;
        canvas.height = height;

        applyBrushStyle(context, width, height);

        if (tempCtx && tempCanvas.width > 0 && tempCanvas.height > 0) {
            context.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, width, height);
        }
    }, [context, applyBrushStyle]);

    useImperativeHandle(ref, () => ({
        undo: () => {
            if (historyStep > 0) {
                const newStep = historyStep - 1;
                setHistoryStep(newStep);
                const imageData = history[newStep];
                if (imageData && context) {
                    context.putImageData(imageData, 0, 0);
                    applyBrushStyle(context, canvasRef.current.width, canvasRef.current.height);
                }
            }
        },
        redo: () => {
            if (historyStep < history.length - 1) {
                const newStep = historyStep + 1;
                setHistoryStep(newStep);
                const imageData = history[newStep];
                if (imageData && context) {
                    context.putImageData(imageData, 0, 0);
                    applyBrushStyle(context, canvasRef.current.width, canvasRef.current.height);
                }
            }
        },
        clear: () => {
            if (context && canvasRef.current) {
                context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                saveHistory();
            }
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        setContext(ctx);
    }, []);

    useEffect(() => {
        if (!context) return;

        resizeToContainer();

        const observer = new ResizeObserver(() => resizeToContainer());
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        const timer = setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const initialData = context.getImageData(0, 0, canvas.width, canvas.height);
            setHistory([initialData]);
            setHistoryStep(0);
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [context, resizeToContainer]);

    useEffect(() => {
        if (!context || !canvasRef.current) return;
        applyBrushStyle(context, canvasRef.current.width || 1, canvasRef.current.height || 1);
    }, [context, brushColor, brushSize, applyBrushStyle]);

    const getPoint = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const startDrawing = (e) => {
        if (!context) return;
        const { x, y } = getPoint(e);
        context.beginPath();
        context.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || !context) return;
        const { x, y } = getPoint(e);
        context.lineTo(x, y);
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
        <div ref={containerRef} className="relative flex-1 bg-[#0f172a] overflow-hidden cursor-crosshair touch-none">
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>
            <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerCancel={stopDrawing}
                onPointerLeave={stopDrawing}
                className="block w-full h-full"
            />
        </div>
    );
});

Canvas.displayName = 'Canvas';

export default Canvas;
