import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';

const Canvas = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState(null);

    // History State
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);

    const saveHistory = useCallback(() => {
        if (!canvasRef.current || !context) return;

        const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

        // If we are in the middle of history (undid something), slice the future off
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

        if (canvas.width === width && canvas.height === height) return;

        let imageData = null;
        if (canvas.width > 0 && canvas.height > 0) {
            imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        }

        canvas.width = width;
        canvas.height = height;

        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = 2;
        context.strokeStyle = '#fff';

        if (imageData) {
            context.putImageData(imageData, 0, 0);
        }
    }, [context]);

    useImperativeHandle(ref, () => ({
        undo: () => {
            if (historyStep > 0) {
                const newStep = historyStep - 1;
                setHistoryStep(newStep);
                const imageData = history[newStep];
                if (imageData && context) {
                    context.putImageData(imageData, 0, 0);
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
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        setContext(ctx);
    }, []);

    useEffect(() => {
        if (!context) return;

        resizeToContainer();

        const observer = new ResizeObserver(() => resizeToContainer());
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const initialData = context.getImageData(0, 0, canvas.width, canvas.height);
            setHistory([initialData]);
            setHistoryStep(0);
        }, 100);

        return () => observer.disconnect();
    }, [context, resizeToContainer]);

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
}); // End forwardRef

Canvas.displayName = 'Canvas';

export default Canvas;
