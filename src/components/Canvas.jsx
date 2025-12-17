import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Layers, MousePointer2, Move, Type, Square, Circle, Minus } from 'lucide-react';

const Canvas = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState(null);

    // History State
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);

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

    // Helper to save current state to history
    const saveHistory = () => {
        if (!canvasRef.current || !context) return;

        const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

        // If we are in the middle of history (undid something), slice the future off
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(imageData);

        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth - 320; // Sidebar width
        canvas.height = window.innerHeight - 64; // Header height

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        setContext(ctx);

        // Save initial blank state
        setTimeout(() => {
            const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setHistory([initialData]);
            setHistoryStep(0);
        }, 100);

        const handleResize = () => {
            if (!canvasRef.current || !ctx) return;
            const canvas = canvasRef.current;
            // Save current drawing
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Resize
            canvas.width = window.innerWidth - 320;
            canvas.height = window.innerHeight - 64;

            // Restore context properties (they get reset on resize)
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#fff';

            // Restore drawing
            ctx.putImageData(imageData, 0, 0);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Run once on mount

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
        if (isDrawing) {
            context.closePath();
            setIsDrawing(false);
            saveHistory(); // Save state after stroke
        }
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
}); // End forwardRef

Canvas.displayName = 'Canvas';

export default Canvas;
