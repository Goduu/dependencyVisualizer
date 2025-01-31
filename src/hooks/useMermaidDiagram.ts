import { useState, useRef, useEffect, Ref } from 'react'
import mermaid from 'mermaid'
import svgPanZoom from 'svg-pan-zoom'
import { DiagramData, FileNode } from '@/src/types'

interface UseMermaidDiagramProps {
    diagram: string;
    nodes: FileNode[];
    edges: DiagramData['edges'];
    setHighlightedNodes: (nodes: Set<string>) => void;
    setHighlightedEdges: (edges: Set<string>) => void;
}

export const useMermaidDiagram = ({
    diagram,
    nodes,
    edges,
    setHighlightedNodes,
    setHighlightedEdges,
}: UseMermaidDiagramProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const panZoomInstance = useRef<any>(null);
    const [scale, setScale] = useState(1);

    const handleSearch = (term: string) => {
        if (!term) {
            setHighlightedNodes(new Set());
            setHighlightedEdges(new Set());
            return;
        }

        const newHighlightedNodes = new Set<string>();
        const newHighlightedEdges = new Set<string>();
        const termLower = term.toLowerCase();

        nodes.forEach(node => {
            const matches =
                node.path.toLowerCase().includes(termLower) ||
                node.exports?.components?.some(c => c.toLowerCase().includes(termLower)) ||
                node.exports?.functions?.some(f => f.toLowerCase().includes(termLower)) ||
                node.hooks?.some(h => h.name.toLowerCase().includes(termLower)) ||
                node.hocs?.some(h => h.toLowerCase().includes(termLower));

            if (matches) {
                newHighlightedNodes.add(node.path);
                edges.forEach(edge => {
                    if (edge.from === node.path || edge.to === node.path) {
                        newHighlightedEdges.add(`${edge.from}-${edge.to}`);
                        newHighlightedNodes.add(edge.from);
                        newHighlightedNodes.add(edge.to);
                    }
                });
            }
        });

        setHighlightedNodes(newHighlightedNodes);
        setHighlightedEdges(newHighlightedEdges);
    };

    const handleZoomIn = () => {
        panZoomInstance.current?.zoomIn();
        setScale(panZoomInstance.current?.getZoom() || 1);
    };

    const handleZoomOut = () => {
        panZoomInstance.current?.zoomOut();
        setScale(panZoomInstance.current?.getZoom() || 1);
    };

    const handleResetZoom = () => {
        panZoomInstance.current?.reset();
        setScale(1);
    };

    // Initialize mermaid
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            maxTextSize: 1000000,
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis',
                rankSpacing: 100,
                nodeSpacing: 100,
                diagramPadding: 100,
            },
        });
    }, []);

    // Render diagram and initialize pan-zoom
    useEffect(() => {

        if (!containerRef.current || !diagram) return;
        const renderDiagram = async () => {
            try {
                // Clean up previous instance
                if (panZoomInstance.current) {
                    panZoomInstance.current.destroy();
                    panZoomInstance.current = null;
                }

                const { svg } = await mermaid.render('mermaid-diagram-svg', diagram);

                if (svg && containerRef.current) {
                    containerRef.current.innerHTML = svg;

                    // Get the SVG element and set its styles
                    const svgElement = containerRef.current.querySelector('svg');
                    if (svgElement) {
                        // Make SVG fill the container
                        svgElement.style.width = '100%';
                        svgElement.style.height = '100%';
                        svgElement.style.minHeight = '500px';

                        // Wait for the next frame to ensure SVG is properly mounted
                        requestAnimationFrame(() => {
                            try {
                                panZoomInstance.current = svgPanZoom(svgElement, {
                                    zoomEnabled: true,
                                    controlIconsEnabled: false,
                                    fit: true,
                                    center: true,
                                    minZoom: 0.1,
                                    maxZoom: 30,
                                    zoomScaleSensitivity: 0.5,
                                    beforePan: function () {
                                        return true;
                                    },
                                    onZoom: function (newZoom: number) {
                                        setScale(newZoom);
                                    }
                                });

                                // Set initial scale
                                setScale(panZoomInstance.current.getZoom());
                            } catch (error) {
                                console.error('Error initializing svg-pan-zoom:', error);
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error rendering diagram:', error);
                if (containerRef.current) {
                    containerRef.current.innerHTML = 'Error rendering diagram';
                }
            }
        };

        renderDiagram();

        // Cleanup
        return () => {
            if (panZoomInstance.current) {
                panZoomInstance.current.destroy();
                panZoomInstance.current = null;
            }
        };
    }, [diagram]);
    //     const renderDiagram = async () => {
    //         try {
    //             // Clean up previous instance
    //             if (panZoomInstance.current) {
    //                 panZoomInstance.current.destroy();
    //                 panZoomInstance.current = null;
    //             }

    //             // Create a temporary div to hold the original SVG
    //             const tempDiv = document.createElement('div');
    //             const { svg, bindFunctions } = await mermaid.render('mermaid-diagram-svg', diagram);
    //             tempDiv.innerHTML = svg;
    //             const graphDiv = tempDiv.querySelector<SVGSVGElement>('svg');
    //             if (!graphDiv) {
    //                 throw new Error('svg not found');
    //             }

    //             if (containerRef.current) {
    //                 // Convert to rough sketch
    //                 const svg2rough = new Svg2Roughjs(containerRef.current);
    //                 // Set configuration before assigning SVG and sketching
    //                 svg2rough.roughConfig = {
    //                     roughness: 2,
    //                     bowing: 1,
    //                     stroke: '#aa00ff',
    //                     strokeWidth: 2,
    //                     fillStyle: 'hachure',
    //                     fill: 'none',
    //                     fillWeight: 0.1,
    //                     hachureGap: 8,
    //                 };

    //                 // Apply configuration to specific elements
    //                 svg2rough.svg = graphDiv;
    //                 await svg2rough.sketch();
    //                 graphDiv.remove();

    //                 // Post-process the SVG if needed
    //                 const svgElement = containerRef.current.querySelector<SVGSVGElement>('svg');
    //                 if (svgElement) {
    //                     // Ensure paths (arrows) have no fill
    //                     svgElement.querySelectorAll('path').forEach(path => {
    //                         path.setAttribute('fill', 'none');
    //                         path.style.fill = 'none';
    //                         path.style.stroke = 'rgb(249 115 22)';
    //                     });

    //                     // Make SVG fill the container
    //                     const height = svgElement.getAttribute('height');
    //                     const width = svgElement.getAttribute('width');
    //                     svgElement.style.width = '100%';
    //                     svgElement.style.height = '100%';
    //                     svgElement.style.minHeight = '500px';
    //                     svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);

    //                     // Wait for the next frame to ensure SVG is properly mounted
    //                     requestAnimationFrame(() => {
    //                         try {
    //                             panZoomInstance.current = svgPanZoom(svgElement, {
    //                                 zoomEnabled: true,
    //                                 controlIconsEnabled: false,
    //                                 fit: true,
    //                                 center: true,
    //                                 minZoom: 0.1,
    //                                 maxZoom: 30,
    //                                 zoomScaleSensitivity: 0.5,
    //                                 beforePan: function () {
    //                                     return true;
    //                                 },
    //                                 onZoom: function (newZoom: number) {
    //                                     setScale(newZoom);
    //                                 }
    //                             });

    //                             // Set initial scale
    //                             setScale(panZoomInstance.current.getZoom());
    //                         } catch (error) {
    //                             console.error('Error initializing svg-pan-zoom:', error);
    //                         }
    //                     });
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('Error rendering diagram:', error);
    //             if (containerRef.current) {
    //                 containerRef.current.innerHTML = 'Error rendering diagram';
    //             }
    //         }
    //     };

    //     renderDiagram();

    //     // Cleanup
    //     return () => {
    //         if (panZoomInstance.current) {
    //             panZoomInstance.current.destroy();
    //             panZoomInstance.current = null;
    //         }
    //     };
    // }, [diagram]);

    return {
        containerRef,
        scale,
        handleSearch,
        handleZoomIn,
        handleZoomOut,
        handleResetZoom,
    };
}; 