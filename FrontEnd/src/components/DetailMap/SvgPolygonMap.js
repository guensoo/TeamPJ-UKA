import { useEffect, useRef, useState } from 'react';

const SvgPolygonMap = () => {
    const [areas, setAreas] = useState([]);
    const [detailMode, setDetailMode] = useState(false);
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [animating, setAnimating] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const svgRef = useRef(null);

    const width = 800;
    const height = 600;

    const bounds = {
        lngMin: 125.5,
        lngMax: 129.5,
        latMin: 33.0,
        latMax: 39.5,
    };

    const project = ([lng, lat]) => {
        const x = ((lng - bounds.lngMin) / (bounds.lngMax - bounds.lngMin)) * width;
        const y = height - ((lat - bounds.latMin) / (bounds.latMax - bounds.latMin)) * height;
        return [x, y];
    };

    const parseGeojson = (geojson) => {
        return geojson.features.map((feature) => {
        const name = feature.properties.SIG_KOR_NM;
        const code = feature.properties.SIG_CD || '';
        let coordinates = [];

        if (feature.geometry.type === 'Polygon') {
            coordinates = [feature.geometry.coordinates];
        } else if (feature.geometry.type === 'MultiPolygon') {
            coordinates = feature.geometry.coordinates;
        }

        const paths = coordinates.map(polygon =>
            polygon[0].map(coord => project(coord))
        );

        return { name, code, paths };
        });
    };

    const loadGeoJson = async (path) => {
        try {
        const res = await fetch(path);
        const geojson = await res.json();
        const parsed = parseGeojson(geojson);
        setAreas(parsed);
        } catch (err) {
        console.error('Failed to load geojson', err);
        }
    };

    const loadFilteredSig = async (regionPrefix) => {
        try {
        const res = await fetch('json/sig.json');
        const geojson = await res.json();
        const filtered = geojson.features.filter((f) =>
            f.properties.SIG_CD.startsWith(regionPrefix)
        );
        const tempGeo = { ...geojson, features: filtered };
        const parsed = parseGeojson(tempGeo);
        setAreas(parsed);
        } catch (err) {
        console.error('Failed to load filtered sig.json', err);
        }
    };

    useEffect(() => {
        loadGeoJson('json/sido.json');
    }, []);

    const handleClick = (area) => {
        if (animating || detailMode) return;

        setAnimating(true);

        const path = area.paths[0];
        const center = path.reduce(
        (acc, [x, y]) => [acc[0] + x, acc[1] + y],
        [0, 0]
        ).map(v => v / path.length);

        const [cx, cy] = center;
        const scaleFactor = 2;
        const tx = width / 2 - cx * scaleFactor;
        const ty = height / 2 - cy * scaleFactor;

        setScale(scaleFactor);
        setTranslate({ x: tx, y: ty });

        setTimeout(() => {
        const prefix = area.code.substring(0, 2);
        setDetailMode(true);
        loadFilteredSig(prefix);
        setAnimating(false);
        }, 800);
    };

    const handleBack = () => {
        if (animating || !detailMode) return;

        setAnimating(true);
        setScale(1);
        setTranslate({ x: 0, y: 0 });

        setTimeout(() => {
        setDetailMode(false);
        loadGeoJson('json/sido.json');
        setAnimating(false);
        }, 800);
    };

    const handleMouseDown = (e) => {
        if (scale <= 1) return;
        setIsDragging(true);
        setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastPos.x;
        const dy = e.clientY - lastPos.y;
        setTranslate(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div>
        {detailMode && (
            <button onClick={handleBack} style={{ marginBottom: '10px' }}>
            ← 뒤로가기
            </button>
        )}

        <svg
            ref={svgRef}
            width={width}
            height={height}
            style={{
            border: '1px solid #ccc',
            background: '#f9f9f9',
            overflow: 'hidden',
            cursor: scale > 1 ? 'grab' : 'default',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <g
            transform={`scale(${scale}) translate(${translate.x}, ${translate.y})`}
            style={{
                transition: animating ? 'transform 0.8s ease-in-out' : 'none',
                transformOrigin: 'center center',
            }}
            >
            {areas.map((area, idx) =>
                area.paths.map((path, pathIdx) => (
                <polygon
                    key={`${idx}-${pathIdx}`}
                    points={path.map(([x, y]) => `${x},${y}`).join(' ')}
                    fill="#ffffff"
                    stroke="#004c80"
                    strokeWidth={1}
                    fillOpacity={0.7}
                    onMouseOver={(e) => e.target.setAttribute('fill', '#09f')}
                    onMouseOut={(e) => e.target.setAttribute('fill', '#ffffff')}
                    onClick={() => handleClick(area)}
                    style={{ cursor: 'pointer' }}
                />
                ))
            )}
            </g>
        </svg>
        </div>
    );
};

export default SvgPolygonMap;
