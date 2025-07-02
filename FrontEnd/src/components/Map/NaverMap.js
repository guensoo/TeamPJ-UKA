/* global naver */
import { useEffect, useRef, useState } from 'react';

const NAVER_MAP_CLIENT_ID = process.env.REACT_APP_ALL_NAVER_MAP_Client_ID;

const NaverMap = ({ centers = [], onMapReady }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);

    // 지도 로딩 되었는지 확인 상태
    const [isMapReady, setIsMapReady] = useState(false);
    const infoWindowRef = useRef(null);

    const loadScript = (src, callback) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        document.head.appendChild(script);
    };

    const initializeMap = () => {
        mapInstance.current = new naver.maps.Map(mapRef.current, {
            center: new naver.maps.LatLng(37.566826, 126.7986567),
            zoom: 8,
        });

        setIsMapReady(true); //지도 준비 완료.
        onMapReady?.();

        loadScript(
            'https://openapi.map.naver.com/openapi/v3/maps-geocoder.js',
            () => createMarkers()
        );
    };

    const createMarkers = () => {
        if (!centers.length) return;

        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        if (!infoWindowRef.current) {
            infoWindowRef.current = new naver.maps.InfoWindow({ anchorSkew: true });
        }

        centers.forEach(center => {
            naver.maps.Service.geocode({ query: center.careAddr }, (status, response) => {
                if (status !== naver.maps.Service.Status.OK || !response.v2.addresses.length) {
                    console.error('주소 검색 실패:', center.careAddr);
                    return;
                }

                const { x, y } = response.v2.addresses[0];
                const position = new naver.maps.LatLng(Number(y), Number(x));

                const marker = new naver.maps.Marker({
                    position,
                    map: mapInstance.current,
                });

                // 마커 클릭 이벤트는 여기서 InfoWindow를 연다.
                naver.maps.Event.addListener(marker, 'click', () => {
                    infoWindowRef.current.setContent(`
                        <div style="padding:10px;">
                            <strong>${center.careNm}</strong><br>${center.careAddr}
                        </div>
                    `);
                    infoWindowRef.current.open(mapInstance.current, marker);
                });

                markersRef.current.push(marker);
            });
        });

        // 첫 번째 마커 기준 지도 이동
        naver.maps.Service.geocode({ query: centers[0].careAddr }, (status, response) => {
            if (status === naver.maps.Service.Status.OK && response.v2.addresses.length) {
                const { x, y } = response.v2.addresses[0];
                mapInstance.current.setCenter(new naver.maps.LatLng(Number(y), Number(x)));
                mapInstance.current.setZoom(12);
            }
        });
    };

    // 초기 지도 로딩 (1회만)
    useEffect(() => {
        if (window.naver && window.naver.maps) {
            initializeMap();
        } else {
            loadScript(
                `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`,
                initializeMap
            );
        }
    }, []);

    // centers가 변경될 때마다 마커를 갱신
    useEffect(() => {
        if (mapInstance.current && window.naver?.maps?.Service?.geocode) {
            createMarkers();
        }
    }, [centers]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default NaverMap;
