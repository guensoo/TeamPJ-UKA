import './AdBar.css';
import adImg from '../../assets/ad_banner.png';

export default function AdBar() {
    return (
        <div className="left-ad-bar-stack">
            <div className="left-ad-bar-section">
                <div className="left-ad-bar">
                    <img src={adImg} alt="광고 배너" className="left-ad-img" />
                    <a href="/ad-link" className="left-ad-btn">광고 자세히 보기</a>
                </div>
            </div>
        </div>
    );
}
