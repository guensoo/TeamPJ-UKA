/* global naver */
import { useEffect, useRef } from 'react';

const NAVER_MAP_CLIENT_ID = process.env.REACT_APP_ALL_NAVER_MAP_Client_ID;

const NaverMap = ({ centers = [] }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);

    // 지도 로딩
    useEffect(() => {
        const loadMap = () => {
            mapInstance.current = new window.naver.maps.Map(mapRef.current, {
                center: new window.naver.maps.LatLng(37.566826, 126.9786567),
                zoom: 8,
            });

            // Geocoder 모듈 로딩
            window.naver.maps.onJSContentLoaded = () => {
                window.naver.maps.Service = window.naver.maps.Service || {};
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://openapi.map.naver.com/openapi/v3/maps-geocoder.js';
                script.onload = () => {
                    console.log("Geocoder 모듈 로딩 완료");
                };
                document.head.appendChild(script);
            };
        };

        if (window.naver && window.naver.maps) {
            loadMap();
        } else {
            const script = document.createElement('script');
            script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`;
            script.onload = loadMap;
            document.head.appendChild(script);
        }
    }, []);

    // 센터들 주소로 마커 찍기
    useEffect(() => {
        if (!mapInstance.current || !window.naver?.maps?.Service?.geocode || !centers.length) return;

        // 기존 마커 모두 삭제
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        centers.forEach(center => {
            window.naver.maps.Service.geocode(
                { query: center.careAddr },
                function (status, response) {
                    if (status !== window.naver.maps.Service.Status.OK || response.v2.addresses.length === 0) {
                        console.error('주소 검색 실패:', center.careAddr);
                        return;
                    }

                    const { x, y } = response.v2.addresses[0];
                    const latlng = new window.naver.maps.LatLng(Number(y), Number(x));

                    const marker = new window.naver.maps.Marker({
                        position: latlng,
                        map: mapInstance.current,
                        title: center.careNm,
                    });

                    markersRef.current.push(marker);
                }
            );
        });

        // 첫 번째 센터 기준 지도 중심 이동
        window.naver.maps.Service.geocode(
            { query: centers[0].careAddr },
            function (status, response) {
                if (status === window.naver.maps.Service.Status.OK && response.v2.addresses.length > 0) {
                    const { x, y } = response.v2.addresses[0];
                    const latlng = new window.naver.maps.LatLng(Number(y), Number(x));
                    mapInstance.current.setCenter(latlng);
                    mapInstance.current.setZoom(12);
                }
            }
        );

    }, [centers]);

    return <div ref={mapRef} style={{ width: '100%', height: '100px' }} />;
};

export default NaverMap;
