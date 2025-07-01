import { useState, useEffect, useMemo } from "react";
import { fetchSavedAnimals } from "../api/AnimalApiData";

export default function useRegionData() {
    const [rawData, setRawData] = useState([]); // API에서 파싱해온 객체 배열
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const allData = await fetchSavedAnimals();
                setRawData(allData);
                
                if (!allData || Object.keys(allData).length === 0) {
                    setError({ type: "empty" });
                }
            } catch (e) {
                setError({ type: "server", detail: e.message });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // 전체 집계
    const allRegionData = useMemo(() => {
        const result = {
            centerSet: new Set(),
            animalCount: 0,
            dogsCount: 0,
            catsCount: 0,
            othersCount: 0,
        };

        rawData.forEach(item => {
            result.centerSet.add(item.careRegNo);
            result.animalCount += 1;
            switch (item.upKindNm) {
                case "개":
                    result.dogsCount += 1;
                    break;
                case "고양이":
                    result.catsCount += 1;
                    break;
                default:
                    result.othersCount += 1;
            }
        });

        return [{
            centerCount: result.centerSet.size,
            animalCount: result.animalCount,
            dogsCount: result.dogsCount,
            catsCount: result.catsCount,
            otherCount: result.othersCount,
        }];
    }, [rawData]);

    // 지역별 집계
    const regionData = useMemo(() => {
        const map = {};

        rawData.forEach(item => {
            const fullName = item.orgNm; // "orgNm = 경상북도 포항시 ... "

            // item.orgNm.replace(/\s.*$/, '') 정규식으로도 사용가능
            const region = fullName.split(" ")[0]; 
            if (!map[region]) {
                map[region] = {
                    region,
                    centerSet: new Set(),
                    animalCount: 0,
                    dogsCount: 0,
                    catsCount: 0,
                    othersCount: 0,
                };
            }
            map[region].centerSet.add(item.careRegNo);
            map[region].animalCount += 1;
            switch (item.upKindNm) {
                case "개":
                    map[region].dogsCount += 1;
                    break;
                case "고양이":
                    map[region].catsCount += 1;
                    break;
                default:
                    map[region].othersCount += 1;
            }
        });

        return Object.values(map).map(r => ({
            region: r.region,
            centerCount: r.centerSet.size,
            animalCount: r.animalCount,
            dogsCount: r.dogsCount,
            catsCount: r.catsCount,
            otherCount: r.othersCount,
        }));
    }, [rawData]);

    return {rawData, allRegionData, regionData, loading, error };
}