// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import authService from '../features/auth/authService';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement
// } from 'chart.js';
// import { Bar, Line, Pie } from 'react-chartjs-2';
// import * as THREE from 'three';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// // Register all necessary components for Chart.js
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement
// );

// // Colors for charts (moved outside the component to prevent re-creation)
// const chartColors = [
//   'rgba(155, 89, 182, 1)', // Brighter Purple
//   'rgba(52, 152, 219, 1)', // Brighter Blue
//   'rgba(230, 126, 34, 1)', // Brighter Orange
//   'rgba(46, 204, 113, 1)', // Brighter Green
//   'rgba(241, 196, 15, 1)', // Brighter Yellow
//   'rgba(231, 76, 60, 1)', // Brighter Red
// ];

// // Helper function to load a font for Three.js text
// const loadFont = (onLoad) => {
//     const loader = new FontLoader();
//     loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json', (font) => {
//         onLoad(font);
//     });
// };

// function ChartStudio() {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [history, setHistory] = useState([]);
//   const [selectedFileId, setSelectedFileId] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [chartData, setChartData] = useState(null);
//   const [selectedXAxis, setSelectedXAxis] = useState('');
//   const [selectedYAxis, setSelectedYAxis] = useState('');
//   const [selectedChartType, setSelectedChartType] = useState('bar'); // New state for chart type
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Ref for the 3D visualization container
//   const threeDContainerRef = useRef(null);
//   const threeDRendererRef = useRef(null);
//   const animationFrameId = useRef(null);
//   const threeDObjectsRef = useRef([]);
//   const [font, setFont] = useState(null);
//   const chartRef = useRef(null); // Ref for the 2D chart canvas

//   // Load font once on component mount
//   useEffect(() => {
//     loadFont(setFont);
//   }, []);

//   // Function to clean up the 3D chart
//   const cleanup3DChart = () => {
//     if (animationFrameId.current) {
//       cancelAnimationFrame(animationFrameId.current);
//     }
//     if (threeDRendererRef.current) {
//       threeDRendererRef.current.dispose();
//       const canvas = threeDRendererRef.current.domElement;
//       if (canvas && canvas.parentNode) {
//         canvas.parentNode.removeChild(canvas);
//       }
//     }
//     threeDObjectsRef.current.forEach(obj => {
//       if (obj.geometry) obj.geometry.dispose();
//       if (obj.material) obj.material.dispose();
//     });
//     threeDObjectsRef.current = [];
//     threeDRendererRef.current = null;
//   };

//   // Function to initialize and animate the 3D chart
  // const init3DChart = useCallback(() => {
  //   cleanup3DChart();
  //   if (!threeDContainerRef.current || !selectedFile || !selectedXAxis || !selectedYAxis || !font) {
  //     return;
  //   }

  //   const container = threeDContainerRef.current;
  //   const scene = new THREE.Scene();
  //   const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

  //   const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  //   renderer.setClearColor(0x000000, 0); // Transparent background
  //   renderer.setSize(container.clientWidth, container.clientHeight);
  //   container.appendChild(renderer.domElement);

    
  //   threeDRendererRef.current = renderer;

  //   const group = new THREE.Group();
  //   scene.add(group);
    
  //   // Get data and filter out invalid numbers
  //   const labels = selectedFile.data.map(row => row[selectedXAxis]);
  //   const values = selectedFile.data.map(row => parseFloat(row[selectedYAxis])).filter(value => !isNaN(value));
  //   const maxVal = Math.max(...values);
  //   const scaleFactor = maxVal > 0 ? 10 / maxVal : 0;

  //   // Create 3D bars with dynamic colors
  //   values.forEach((value, index) => {
  //     const height = value * scaleFactor;
  //     const geometry = new THREE.BoxGeometry(0.8, height, 0.8);
  //     const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(chartColors[index % chartColors.length]) });
  //     const bar = new THREE.Mesh(geometry, material);
  //     bar.position.set(index - labels.length / 2, height / 2, 0);
  //     group.add(bar);
  //     threeDObjectsRef.current.push(bar);
  //   });

  //   // Add lighting
  //   const ambientLight = new THREE.AmbientLight(0x404040, 2);
  //   scene.add(ambientLight);
  //   const pointLight = new THREE.PointLight(0xa78bfa, 1);
  //   pointLight.position.set(10, 10, 10);
  //   scene.add(pointLight);
  //   const pointLight2 = new THREE.PointLight(0x6366f1, 0.5);
  //   pointLight2.position.set(-10, 5, 5);
  //   scene.add(pointLight2);
    
  //   camera.position.z = 15;
  //   camera.position.y = 5;
  //   camera.lookAt(0, 0, 0);
    
  //   // Mouse rotation
  //   let isDragging = false;
  //   let previousMousePosition = {
  //       x: 0,
  //       y: 0
  //   };
  //   let autoRotate = true;

  //   const onMouseDown = (event) => {
  //       isDragging = true;
  //       autoRotate = false; // Stop auto-rotation when dragging starts
  //       previousMousePosition = { x: event.clientX, y: event.clientY };
  //   };
  //   const onMouseUp = () => {
  //       isDragging = false;
  //       setTimeout(() => autoRotate = true, 500); // Resume auto-rotation after a short delay
  //   };
  //   const onMouseMove = (event) => {
  //       if (!isDragging) return;
  //       const deltaMove = {
  //           x: event.clientX - previousMousePosition.x,
  //           y: event.clientY - previousMousePosition.y
  //       };
  //       const rotationSpeed = 0.005;
  //       group.rotation.y += deltaMove.x * rotationSpeed;
  //       group.rotation.x += deltaMove.y * rotationSpeed;
  //       previousMousePosition = { x: event.clientX, y: event.clientY };
  //   };

  //   renderer.domElement.addEventListener('mousedown', onMouseDown);
  //   renderer.domElement.addEventListener('mouseup', onMouseUp);
  //   renderer.domElement.addEventListener('mousemove', onMouseMove);

  //   // Animation loop
  //   const animate = () => {
  //     animationFrameId.current = requestAnimationFrame(animate);
  //     if (autoRotate) {
  //       group.rotation.y += 0.002;
  //     }
  //     renderer.render(scene, camera);
  //   };
  //   animate();

  //   const onResize = () => {
  //     if (camera && renderer) {
  //       camera.aspect = container.clientWidth / container.clientHeight;
  //       camera.updateProjectionMatrix();
  //       renderer.setSize(container.clientWidth, container.clientHeight);
  //     }
  //   };
  //   window.addEventListener('resize', onResize);
    
  //   return () => {
  //     window.removeEventListener('resize', onResize);
  //     renderer.domElement.removeEventListener('mousedown', onMouseDown);
  //     renderer.domElement.removeEventListener('mouseup', onMouseUp);
  //     renderer.domElement.removeEventListener('mousemove', onMouseMove);
  //     cleanup3DChart();
  //   };
  // }, [selectedFile, selectedXAxis, selectedYAxis, chartColors]);

//   const generateChart = useCallback((xAxis, yAxis, chartType) => {
//     if (!selectedFile || !selectedFile.data || selectedFile.data.length === 0) {
//       setChartData(null);
//       return;
//     }
    
//     const labels = selectedFile.data.map(row => row[xAxis]);
//     const data = selectedFile.data.map(row => parseFloat(row[yAxis])).filter(value => !isNaN(value));

//     const chartConfig = {
//       labels: labels,
//       datasets: [
//         {
//           label: `${yAxis} by ${xAxis}`,
//           data: data,
//           backgroundColor: chartType === 'pie' ? chartColors : chartColors[0],
//           borderColor: chartType === 'pie' ? chartColors : chartColors[0],
//           borderWidth: 1,
//         },
//       ],
//     };
//     setChartData(chartConfig);
//   }, [selectedFile]);
  
//   useEffect(() => {
//     const fetchHistory = async () => {
//       if (!user) {
//         setIsLoading(false);
//         return;
//       }
//       try {
//         setIsLoading(true);
//         setError('');
//         const data = await authService.getUploadHistory();
//         setHistory(data);
//       } catch (err) {
//         console.error('Failed to fetch upload history:', err);
//         setError('Failed to load upload history. Please try again.');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchHistory();
//   }, [user]);

//   // Separate useEffect for 3D chart initialization
//   useEffect(() => {
//     if (selectedChartType === '3d' && selectedXAxis && selectedYAxis && selectedFile && threeDContainerRef.current) {
//       init3DChart();
//     } else {
//       cleanup3DChart();
//     }
//   }, [selectedChartType, selectedXAxis, selectedYAxis, selectedFile, threeDContainerRef, init3DChart]);

//   // useEffect for 2D chart generation
//   useEffect(() => {
//     if (selectedChartType !== '3d' && selectedXAxis && selectedYAxis && selectedFile) {
//       generateChart(selectedXAxis, selectedYAxis, selectedChartType);
//     } else if (selectedChartType !== '3d') {
//       setChartData(null);
//     }
//   }, [selectedXAxis, selectedYAxis, selectedFile, selectedChartType, generateChart]);

//   const handleFileSelect = async (e) => {
//     const id = e.target.value;
//     setSelectedFileId(id);
//     if (id) {
//       try {
//         const fileData = await authService.getExcelDataById(id);
//         setSelectedFile(fileData.data);
//       } catch (err) {
//         console.error('Failed to fetch file data:', err);
//         setError('Failed to load file data. Please try again.');
//         setSelectedFile(null);
//       }
//     } else {
//       setSelectedFile(null);
//     }
//   };

  
//   const handleDownload = () => {
//     if (selectedChartType === '3d') {
//       // Logic for downloading 3D chart
//       if (threeDRendererRef.current) {
//         const imageData = threeDRendererRef.current.domElement.toDataURL('image/png');
//         const link = document.createElement('a');
//         link.href = imageData;
//         link.download = `${selectedFile.fileName}-3d-chart.png`;
//         link.click();
//       }
//     } else {
//       // Logic for downloading 2D charts
//       if (chartRef.current) {
//         const imageData = chartRef.current.toBase64Image('image/png');
//         const link = document.createElement('a');
//         link.href = imageData;
//         link.download = `${selectedFile.fileName}-2d-chart.png`;
//         link.click();
//       }
//     }
//   };

//   const renderChart = () => {
//     if (!chartData) return null;
//     const options = {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           labels: {
//             color: '#FFFFFF', // White for legend
//           },
//         },
//         title: {
//           display: true,
//           text: `${selectedYAxis} vs ${selectedXAxis}`,
//           color: '#FFFFFF', // White for title
//         },
//       },
//       scales: {
//         x: {
//           ticks: { color: '#FFFFFF' },
//           grid: { color: '#4A5568' }, // Gray-600 for grid lines
//           title: {
//             display: true,
//             text: selectedXAxis,
//             color: '#FFFFFF',
//           },
//         },
//         y: {
//           ticks: { color: '#FFFFFF' },
//           grid: { color: '#4A5568' },
//           title: {
//             display: true,
//             text: selectedYAxis,
//             color: '#FFFFFF',
//           },
//         },
//       },
//     };
//     switch(selectedChartType) {
//       case 'bar':
//         return <Bar ref={chartRef} data={chartData} options={options} />;
//       case 'line':
//         return <Line ref={chartRef} data={chartData} options={options} />;
//       case 'pie':
//         const pieOptions = {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: {
//             legend: { labels: { color: '#FFFFFF' } },
//             title: {
//               display: true,
//               text: `${selectedYAxis} vs ${selectedXAxis}`,
//               color: '#FFFFFF',
//             },
//           },
//         };
//         return <Pie ref={chartRef} data={chartData} options={pieOptions} />;
//       default:
//         return null;
//     }
//   };
  
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[calc(100vh-64px)] pt-20 relative z-10">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
//         <p className="ml-4 text-gray-300">Loading history...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-800/80 rounded-lg shadow-xl border border-gray-700 relative z-10 pt-20 pb-20">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-white">Chart Studio</h1>
//         <button
//           onClick={() => navigate('/dashboard')}
//           className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
//         >
//           &larr; Back to Dashboard
//         </button>
//       </div>
      
//       {error && (
//         <div className="bg-red-900/60 p-4 rounded-lg text-red-400 mb-6 border border-red-700">{error}</div>
//       )}

//       {history.length > 0 ? (
//         <>
//           <div className="mb-6">
//             <label htmlFor="file-select" className="block text-gray-300 font-bold mb-2">
//               Select an Excel file to chart:
//             </label>
//             <select
//               id="file-select"
//               value={selectedFileId}
//               onChange={handleFileSelect}
//               className="w-full md:w-1/2 bg-gray-900/50 text-gray-200 rounded-lg p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="">-- Choose a file --</option>
//               {history.map(file => (
//                 <option key={file._id} value={file._id}>{file.fileName}</option>
//               ))}
//             </select>
//           </div>
          
//           {selectedFile && (
//             <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
//               <h3 className="text-xl font-semibold text-white mb-2">Selected File: {selectedFile.fileName}</h3>
//               <p className="text-gray-400">Sheet: {selectedFile.sheetName}</p>
              
//               <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="x-axis-select" className="block text-gray-300 font-bold mb-2">
//                     Select X-Axis:
//                   </label>
//                   <select
//                     id="x-axis-select"
//                     value={selectedXAxis}
//                     onChange={(e) => setSelectedXAxis(e.target.value)}
//                     className="w-full bg-gray-900/50 text-gray-200 rounded-lg p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   >
//                     <option value="">-- Choose a column --</option>
//                     {selectedFile.headers.map((header, index) => (
//                       <option key={index} value={header}>{header}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label htmlFor="y-axis-select" className="block text-gray-300 font-bold mb-2">
//                     Select Y-Axis:
//                   </label>
//                   <select
//                     id="y-axis-select"
//                     value={selectedYAxis}
//                     onChange={(e) => setSelectedYAxis(e.target.value)}
//                     className="w-full bg-gray-900/50 text-gray-200 rounded-lg p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   >
//                     <option value="">-- Choose a column --</option>
//                     {selectedFile.headers.map((header, index) => (
//                       <option key={index} value={header}>{header}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
              
//               <div className="mt-8 flex justify-between items-center">
//                 <h4 className="text-xl font-bold text-white">Chart Type</h4>
//                 {selectedXAxis && selectedYAxis && (
//                   <button
//                     onClick={handleDownload}
//                     className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
//                   >
//                     Download Chart
//                   </button>
//                 )}
//               </div>
              
//               <div className="flex flex-wrap gap-2 mt-4">
//                 <button
//                   onClick={() => setSelectedChartType('bar')}
//                   className={`py-2 px-4 rounded-lg text-sm font-bold transition duration-200 ${selectedChartType === 'bar' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
//                 >
//                   Bar Chart
//                 </button>
//                 <button
//                   onClick={() => setSelectedChartType('line')}
//                   className={`py-2 px-4 rounded-lg text-sm font-bold transition duration-200 ${selectedChartType === 'line' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
//                 >
//                   Line Chart
//                 </button>
//                 <button
//                   onClick={() => setSelectedChartType('pie')}
//                   className={`py-2 px-4 rounded-lg text-sm font-bold transition duration-200 ${selectedChartType === 'pie' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
//                 >
//                   Pie Chart
//                 </button>
//                 <button
//                   onClick={() => setSelectedChartType('3d')}
//                   className={`py-2 px-4 rounded-lg text-sm font-bold transition duration-200 ${selectedChartType === '3d' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
//                 >
//                   3D Chart
//                 </button>
//               </div>
              
//               {selectedXAxis && selectedYAxis && (
//                 <div className="mt-8 p-4 bg-gray-700/60 rounded-lg h-[600px]">
//                   {selectedChartType === '3d' ? (
//                     <div ref={threeDContainerRef} className="w-full h-full"></div>
//                   ) : (
//                     renderChart()
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//         </>
//       ) : (
//         <p className="text-center text-gray-400 mt-10">You have no files to chart. Please upload a file from the dashboard.</p>
//       )}
//     </div>
//   );
// }

// export default ChartStudio;








// src/components/ChartStudio.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../features/auth/authService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Register all necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Colors for charts (moved outside the component to prevent re-creation)
const chartColors = [
  'rgba(155, 89, 182, 1)', // Brighter Purple
  'rgba(52, 152, 219, 1)', // Brighter Blue
  'rgba(230, 126, 34, 1)', // Brighter Orange
  'rgba(46, 204, 113, 1)', // Brighter Green
  'rgba(241, 196, 15, 1)', // Brighter Yellow
  'rgba(231, 76, 60, 1)', // Brighter Red
];

// Helper function to load a font for Three.js text
const loadFont = (onLoad) => {
    const loader = new FontLoader();
    loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        onLoad(font);
    });
};

function ChartStudio() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [selectedXAxis, setSelectedXAxis] = useState('');
  const [selectedYAxis, setSelectedYAxis] = useState('');
  const [selectedChartType, setSelectedChartType] = useState('bar');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // NEW: State for AI prompt and response
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Ref for the 3D visualization container
  const threeDContainerRef = useRef(null);
  const threeDRendererRef = useRef(null);
  const animationFrameId = useRef(null);
  const threeDObjectsRef = useRef([]);
  const [font, setFont] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    loadFont(setFont);
  }, []);

  const cleanup3DChart = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (threeDRendererRef.current) {
      threeDRendererRef.current.dispose();
      const canvas = threeDRendererRef.current.domElement;
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
    threeDObjectsRef.current.forEach(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
    threeDObjectsRef.current = [];
    threeDRendererRef.current = null;
  };

  // const init3DChart = useCallback(() => {
  //   cleanup3DChart();
  //   if (!threeDContainerRef.current || !selectedFile || !selectedXAxis || !selectedYAxis || !font) {
  //     return;
  //   }

  //   const container = threeDContainerRef.current;
  //   const scene = new THREE.Scene();
  //   const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  //   const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  //   renderer.setClearColor(0x000000, 0); // Transparent background
  //   renderer.setSize(container.clientWidth, container.clientHeight);
  //   container.appendChild(renderer.domElement);
    
  //   threeDRendererRef.current = renderer;

  //   const group = new THREE.Group();
  //   scene.add(group);
    
  //   const labels = selectedFile.data.map(row => row[selectedXAxis]);
  //   const values = selectedFile.data.map(row => parseFloat(row[selectedYAxis])).filter(value => !isNaN(value));
  //   const maxVal = Math.max(...values);
  //   const scaleFactor = maxVal > 0 ? 10 / maxVal : 0;

  //   values.forEach((value, index) => {
  //     const height = value * scaleFactor;
  //     const geometry = new THREE.BoxGeometry(0.8, height, 0.8);
  //     const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(chartColors[index % chartColors.length]) });
  //     const bar = new THREE.Mesh(geometry, material);
  //     bar.position.set(index - labels.length / 2, height / 2, 0);
  //     group.add(bar);
  //     threeDObjectsRef.current.push(bar);
  //   });

  //   const ambientLight = new THREE.AmbientLight(0x404040, 2);
  //   scene.add(ambientLight);
  //   const pointLight = new THREE.PointLight(0xa78bfa, 1);
  //   pointLight.position.set(10, 10, 10);
  //   scene.add(pointLight);
  //   const pointLight2 = new THREE.PointLight(0x6366f1, 0.5);
  //   pointLight2.position.set(-10, 5, 5);
  //   scene.add(pointLight2);
    
  //   const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  //   const textParams = {
  //       font: font,
  //       size: 0.5,
  //       height: 0.1,
  //   };

  //   labels.forEach((label, index) => {
  //       const textGeometry = new TextGeometry(String(label), textParams);
  //       const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  //       textMesh.position.set(index - labels.length / 2, -1, 0);
  //       textMesh.rotation.x = -Math.PI / 2;
  //       group.add(textMesh);
  //   });

  //   const yAxisLabelText = new TextGeometry(selectedYAxis, textParams);
  //   const yAxisLabelMesh = new THREE.Mesh(yAxisLabelText, textMaterial);
  //   yAxisLabelMesh.position.set(-labels.length / 2 - 2, 5, 0);
  //   yAxisLabelMesh.rotation.y = Math.PI / 2;
  //   group.add(yAxisLabelMesh);

  //   camera.position.z = 15;
  //   camera.position.y = 5;
  //   camera.lookAt(0, 0, 0);
    
  //   let isDragging = false;
  //   let previousMousePosition = {
  //       x: 0,
  //       y: 0
  //   };
  //   let autoRotate = true;

  //   const onMouseDown = (event) => {
  //       isDragging = true;
  //       autoRotate = false;
  //       previousMousePosition = { x: event.clientX, y: event.clientY };
  //   };
  //   const onMouseUp = () => {
  //       isDragging = false;
  //       setTimeout(() => autoRotate = true, 500);
  //   };
  //   const onMouseMove = (event) => {
  //       if (!isDragging) return;
  //       const deltaMove = {
  //           x: event.clientX - previousMousePosition.x,
  //           y: event.clientY - previousMousePosition.y
  //       };
  //       const rotationSpeed = 0.005;
  //       group.rotation.y += deltaMove.x * rotationSpeed;
  //       group.rotation.x += deltaMove.y * rotationSpeed;
  //       previousMousePosition = { x: event.clientX, y: event.clientY };
  //   };

  //   renderer.domElement.addEventListener('mousedown', onMouseDown);
  //   renderer.domElement.addEventListener('mouseup', onMouseUp);
  //   renderer.domElement.addEventListener('mousemove', onMouseMove);

  //   const animate = () => {
  //     animationFrameId.current = requestAnimationFrame(animate);
  //     if (autoRotate) {
  //       group.rotation.y += 0.002;
  //     }
  //     renderer.render(scene, camera);
  //   };
  //   animate();

  //   const onResize = () => {
  //     if (camera && renderer) {
  //       camera.aspect = container.clientWidth / container.clientHeight;
  //       camera.updateProjectionMatrix();
  //       renderer.setSize(container.clientWidth, container.clientHeight);
  //     }
  //   };
  //   window.addEventListener('resize', onResize);
    
  //   return () => {
  //     window.removeEventListener('resize', onResize);
  //     renderer.domElement.removeEventListener('mousedown', onMouseDown);
  //     renderer.domElement.removeEventListener('mouseup', onMouseUp);
  //     renderer.domElement.removeEventListener('mousemove', onMouseMove);
  //     cleanup3DChart();
  //   };
  // }, [selectedFile, selectedXAxis, selectedYAxis, chartColors, font]);


  const init3DChart = useCallback(() => {
    cleanup3DChart();
    if (!threeDContainerRef.current || !selectedFile || !selectedXAxis || !selectedYAxis || !font) {
      return;
    }

    const container = threeDContainerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    
    threeDRendererRef.current = renderer;

    const group = new THREE.Group();
    scene.add(group);
    
    // Get data and filter out invalid numbers
    const labels = selectedFile.data.map(row => row[selectedXAxis]);
    const values = selectedFile.data.map(row => parseFloat(row[selectedYAxis])).filter(value => !isNaN(value));
    const maxVal = Math.max(...values);
    const scaleFactor = maxVal > 0 ? 10 / maxVal : 0;

    // Create 3D bars with dynamic colors
    values.forEach((value, index) => {
      const height = value * scaleFactor;
      const geometry = new THREE.BoxGeometry(0.8, height, 0.8);
      const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(chartColors[index % chartColors.length]) });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.set(index - labels.length / 2, height / 2, 0);
      group.add(bar);
      threeDObjectsRef.current.push(bar);
    });

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xa78bfa, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    const pointLight2 = new THREE.PointLight(0x6366f1, 0.5);
    pointLight2.position.set(-10, 5, 5);
    scene.add(pointLight2);
    
    camera.position.z = 15;
    camera.position.y = 5;
    camera.lookAt(0, 0, 0);
    
    // Mouse rotation
    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };
    let autoRotate = true;

    const onMouseDown = (event) => {
        isDragging = true;
        autoRotate = false; // Stop auto-rotation when dragging starts
        previousMousePosition = { x: event.clientX, y: event.clientY };
    };
    const onMouseUp = () => {
        isDragging = false;
        setTimeout(() => autoRotate = true, 500); // Resume auto-rotation after a short delay
    };
    const onMouseMove = (event) => {
        if (!isDragging) return;
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };
        const rotationSpeed = 0.005;
        group.rotation.y += deltaMove.x * rotationSpeed;
        group.rotation.x += deltaMove.y * rotationSpeed;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      if (autoRotate) {
        group.rotation.y += 0.002;
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    };
    window.addEventListener('resize', onResize);
    
    return () => {
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      cleanup3DChart();
    };
  }, [selectedFile, selectedXAxis, selectedYAxis, chartColors]);



  const generateChart = useCallback((xAxis, yAxis, chartType) => {
    if (!selectedFile || !selectedFile.data || selectedFile.data.length === 0) {
      setChartData(null);
      return;
    }
    
    const labels = selectedFile.data.map(row => row[xAxis]);
    const data = selectedFile.data.map(row => parseFloat(row[yAxis])).filter(value => !isNaN(value));

    const chartConfig = {
      labels: labels,
      datasets: [
        {
          label: `${yAxis} by ${xAxis}`,
          data: data,
          backgroundColor: chartType === 'pie' ? chartColors : chartColors[0],
          borderColor: chartType === 'pie' ? chartColors : chartColors[0],
          borderWidth: 1,
        },
      ],
    };
    setChartData(chartConfig);
  }, [selectedFile]);
  
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError('');
        const data = await authService.getUploadHistory();
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch upload history:', err);
        setError('Failed to load upload history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  useEffect(() => {
    if (selectedChartType === '3d' && selectedXAxis && selectedYAxis && selectedFile && threeDContainerRef.current) {
      init3DChart();
    } else {
      cleanup3DChart();
    }
  }, [selectedChartType, selectedXAxis, selectedYAxis, selectedFile, threeDContainerRef, init3DChart]);

  useEffect(() => {
    if (selectedChartType !== '3d' && selectedXAxis && selectedYAxis && selectedFile) {
      generateChart(selectedXAxis, selectedYAxis, selectedChartType);
    } else if (selectedChartType !== '3d') {
      setChartData(null);
    }
  }, [selectedXAxis, selectedYAxis, selectedFile, selectedChartType, generateChart]);

  const handleFileSelect = async (e) => {
    const id = e.target.value;
    setSelectedFileId(id);
    if (id) {
      try {
        const fileData = await authService.getExcelDataById(id);
        setSelectedFile(fileData.data);
      } catch (err) {
        console.error('Failed to fetch file data:', err);
        setError('Failed to load file data. Please try again.');
        setSelectedFile(null);
      }
    } else {
      setSelectedFile(null);
    }
  };

  const handleDownload = () => {
    if (selectedXAxis && selectedYAxis && selectedFile) {
      if (selectedChartType === '3d' && threeDRendererRef.current) {
        const imageData = threeDRendererRef.current.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `${selectedFile.fileName}-3d-chart.png`;
        link.click();
      } else if (chartRef.current) {
        const imageData = chartRef.current.toBase64Image('image/png');
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `${selectedFile.fileName}-2d-chart.png`;
        link.click();
      }
    } else {
        alert('Please select X and Y axes before downloading.');
    }
  };

  const handleGetInsights = async () => {
    if (!selectedFileId) {
      setAiResponse('Please select a file to get insights.');
      return;
    }
    if (!aiPrompt) {
        setAiResponse('Please enter a prompt to get insights.');
        return;
    }

    setIsAiLoading(true);
    setAiResponse('');
    try {
      const response = await authService.getAiInsights(selectedFileId, aiPrompt);
      setAiResponse(response.aiResponse);
    } catch (err) {
      setAiResponse(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderChart = () => {
    if (!chartData) return null;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#FFFFFF',
          },
        },
        title: {
          display: true,
          text: `${selectedYAxis} vs ${selectedXAxis}`,
          color: '#FFFFFF',
        },
      },
      scales: {
        x: {
          ticks: { color: '#FFFFFF' },
          grid: { color: '#4A5568' },
          title: {
            display: true,
            text: selectedXAxis,
            color: '#FFFFFF',
          },
        },
        y: {
          ticks: { color: '#FFFFFF' },
          grid: { color: '#4A5568' },
          title: {
            display: true,
            text: selectedYAxis,
            color: '#FFFFFF',
          },
        },
      },
    };
    switch(selectedChartType) {
      case 'bar':
        return <Bar ref={chartRef} data={chartData} options={options} />;
      case 'line':
        return <Line ref={chartRef} data={chartData} options={options} />;
      case 'pie':
        const pieOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#FFFFFF' } },
            title: {
              display: true,
              text: `${selectedYAxis} vs ${selectedXAxis}`,
              color: '#FFFFFF',
            },
          },
        };
        return <Pie ref={chartRef} data={chartData} options={pieOptions} />;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] pt-20 relative z-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-gray-300">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800/80 rounded-lg shadow-xl border border-gray-700 relative z-10 pt-20 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Chart Studio</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
        >
          &larr; Back to Dashboard
        </button>
      </div>
      
      {error && (
        <div className="bg-red-900/60 p-4 rounded-lg text-red-400 mb-6 border border-red-700">{error}</div>
      )}

      {history.length > 0 ? (
        <>
          <div className="mb-6">
            <label htmlFor="file-select" className="block text-gray-300 font-bold mb-2">
              Select an Excel file to chart:
            </label>
            <select
              id="file-select"
              value={selectedFileId}
              onChange={handleFileSelect}
              className="w-full md:w-1/2 bg-gray-900/50 text-gray-200 rounded-lg p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">-- Choose a file --</option>
              {history.map(file => (
                <option key={file._id} value={file._id}>{file.fileName}</option>
              ))}
            </select>
          </div>
          
          {selectedFile && (
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Selected File: {selectedFile.fileName}</h3>
              <p className="text-gray-400">Sheet: {selectedFile.sheetName}</p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="x-axis-select" className="block text-gray-300 font-bold mb-2">
                    Select X-Axis:
                  </label>
                  <select
                    id="x-axis-select"
                    value={selectedXAxis}
                    onChange={(e) => setSelectedXAxis(e.target.value)}
                    className="w-full bg-gray-900/50 text-gray-200 rounded-lg p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">-- Choose a column --</option>
                    {selectedFile.headers.map((header, index) => (
                      <option key={index} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="y-axis-select" className="block text-gray-300 font-bold mb-2">
                    Select Y-Axis:
                  </label>
                  <select
                    id="y-axis-select"
                    value={selectedYAxis}
                    onChange={(e) => setSelectedYAxis(e.target.value)}
                    className="w-full bg-gray-900/50 text-gray-200 rounded-lg p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">-- Choose a column --</option>
                    {selectedFile.headers.map((header, index) => (
                      <option key={index} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between items-center">
                <h4 className="text-xl font-bold text-white">Chart Type</h4>
                {selectedXAxis && selectedYAxis && (
                  <button
                    onClick={handleDownload}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
                  >
                    Download Chart
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => setSelectedChartType('bar')}
                  className={`py-2 px-4 rounded-lg text-sm font-bold transition duration-200 ${selectedChartType === 'bar' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Bar Chart
                </button>
                <button
                  onClick={() => setSelectedChartType('line')}
                  className={`py-2 px-4 rounded-lg text-sm font-bold transition duration-200 ${selectedChartType === 'line' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Line Chart
                </button>
                <button
                  onClick={() => setSelectedChartType('pie')}
                  className={`py-2 px-4 rounded-lg text-sm font-bold transition duration-200 ${selectedChartType === 'pie' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Pie Chart
                </button>
                <button
                  onClick={() => setSelectedChartType('3d')}
                  className={`py-2 px-4 rounded-lg text-sm font-bold transition duration-200 ${selectedChartType === '3d' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  3D Chart
                </button>
              </div>
              
              {selectedXAxis && selectedYAxis && (
                <div className="mt-8 p-4 bg-gray-700/60 rounded-lg h-[600px]">
                  {selectedChartType === '3d' ? (
                    <div ref={threeDContainerRef} className="w-full h-full"></div>
                  ) : (
                    renderChart()
                  )}
                </div>
              )}
            </div>
          )}

          {/* NEW: AI Insights Section */}
          <div className="p-4 mt-6 bg-gray-900/50 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">AI Insights</h3>
            <p className="text-gray-400 mb-4">
              Get an AI-powered summary or insights from your selected file.
            </p>
            <div className="flex flex-col space-y-4">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.g., What are the key trends in this data?"
                className="w-full h-24 bg-gray-700/60 text-gray-200 rounded-lg p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <button
                onClick={handleGetInsights}
                disabled={!selectedFileId || isAiLoading}
                className={`py-2 px-4 rounded-lg font-bold text-white transition duration-200 shadow-md ${!selectedFileId || isAiLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {isAiLoading ? 'Getting Insights...' : 'Get AI Insights'}
              </button>
            </div>
            {aiResponse && (
              <div className="mt-4 p-4 bg-gray-700/60 rounded-lg border border-gray-600">
                <h4 className="text-lg font-bold text-white mb-2">AI Response:</h4>
                <p className="text-gray-300 whitespace-pre-wrap">{aiResponse}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-400 mt-10">You have no files to chart. Please upload a file from the dashboard.</p>
      )}
    </div>
  );
}

export default ChartStudio;




